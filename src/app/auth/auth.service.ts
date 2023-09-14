import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationRequest } from '../interfaces/IAuthenticationRequest';
import { RegisterRequest } from '../interfaces/IRegisterRequest';
import { AuthenticationResponse } from '../interfaces/IAuthenticationResponse';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap, shareReplay, catchError, of, switchMap, throwError } from 'rxjs';
import * as moment from 'moment';
import { UserDetails } from '../interfaces/IUserDetails';
import { SharedUserDetailsService } from '../services/shared-user-details.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isLoginExpired());

  private readonly baseUrl = `${environment.baseUrl}api/v1/auth/`

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    private userDetailsService: SharedUserDetailsService
  ) {
    this.loggedIn.next(this.isLoginExpired());
  }

  login(authenticationRequest: AuthenticationRequest) {
    authenticationRequest.timezoneOffset = this.getTimezoneoffset();
    return this.http.post<AuthenticationResponse>(this.baseUrl + "authenticate", authenticationRequest, { observe: 'body' })
      .pipe(
        switchMap((res: AuthenticationResponse) => {
          this.setSession(res)
          this.loggedIn.next(true);

          return this.userDetailsService.fetchUserDetailsByEmail(authenticationRequest.email);
        }),
        tap((userDetails: UserDetails) => {
          this.userDetailsService.setUserDetails(userDetails);
          this.router.navigate(['/']);
        }),
        catchError(error => {
          if (error.status === 401) {
            console.log('Invalid credentials');
          } else {
            console.error('An error occurred:', error.message);
          }
          return of(null);
        }),
        shareReplay()
      );
  }

  register(registerRequest: RegisterRequest) {
    registerRequest.timezoneOffset = this.getTimezoneoffset();
    return this.http.post<AuthenticationResponse>(this.baseUrl + "register", registerRequest, { observe: 'body' })
      .pipe(
        switchMap((res: AuthenticationResponse) => {
          this.setSession(res)
          this.loggedIn.next(true);

          return this.userDetailsService.fetchUserDetailsByEmail(registerRequest.email);
        }),
        tap((userDetails: UserDetails) => {
          this.userDetailsService.setUserDetails(userDetails);
          this.router.navigate(['/']);
        }),
        catchError(this.handleException),
        shareReplay()
      )
  }

  setSession(authResult) {
    localStorage.setItem('jwt', authResult.token);
    localStorage.setItem("expirationDate", JSON.stringify(authResult.expirationDate.valueOf()));
  }

  logout() {
    this.router.navigate(['/login']);
    this.removeAccess();
    sessionStorage.setItem('anemia-type', '');
    sessionStorage.setItem('diagnosis', '');
    sessionStorage.removeItem('first-min');
    sessionStorage.removeItem('first-max');
    sessionStorage.removeItem('second-min');
    sessionStorage.removeItem('second-max');
    sessionStorage.removeItem('selectedGenderOption');
    sessionStorage.removeItem('showSecondRangeForm');
    sessionStorage.removeItem('addedValues');
    sessionStorage.setItem('parameter', '');
    sessionStorage.removeItem('parameter-min');
    sessionStorage.removeItem('parameter-max');
    sessionStorage.removeItem('selectedLevelTypeOption');
  }

  removeAccess() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userDetails");
    this.loggedIn.next(false);
  }

  public isLoginExpired(): boolean {
    const expirationDate = this.getExpiration();
    return moment().isBefore(expirationDate);
  }

  isLoggedOut() {
    return !this.isLoginExpired();
  }

  getExpiration() {
    const expirationDate = localStorage.getItem("expirationDate");
    const expiresAt = JSON.parse(expirationDate);
    return moment.parseZone(expiresAt);
  }

  getTimezoneoffset() {
    //return new Date().getTimezoneOffset() * -1;
    return 0;
  }

  private handleException(exception: HttpErrorResponse) {
    if (exception.status === 0) {
      console.error(`Error on client-side occured:, ${exception.error}`)
    } else {
      console.error(`Error on server-side occured with status code: ${exception.status} and message: ${JSON.stringify(exception.error)}`)
    }

    return throwError(() => exception.error)
  }
}
