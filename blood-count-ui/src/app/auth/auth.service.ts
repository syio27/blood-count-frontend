import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationRequest } from './authenticationRequest';
import { RegisterRequest } from './registerRequest';
import { AuthenticationResponse } from './authenticationResponse';
import { HttpClient } from '@angular/common/http';
import { tap, shareReplay, catchError, of, switchMap } from 'rxjs';
import * as moment from 'moment';
import { UserDetails } from '../interfaces/userDetails';
import { SharedUserDetailsService } from '../services/shared-user-details.service';

@Injectable()
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isLoginExpired());

  private readonly baseUrl = "http://localhost:8080/api/v1/auth/"

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
          //save userDetails to BehaviorSubject
          console.log("USER DETAILS ->")
          console.log(userDetails)
          this.userDetailsService.setUserDetails(userDetails),
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
        tap(res => {
          this.setSession(res)
          this.loggedIn.next(true);
          this.router.navigate(['/']);
        }),
        catchError(() => []),
        shareReplay()
      )
  }

  private setSession(authResult) {
    localStorage.setItem('jwt', authResult.token);
    localStorage.setItem("expirationDate", JSON.stringify(authResult.expirationDate.valueOf()));
  }

  logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("expirationDate");
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  public isLoginExpired(): boolean {
    const expirationDate = this.getExpiration();
    // console.log("exp date");
    // console.log(expirationDate)
    // console.log("current date")
    // console.log(moment())
    // console.log(moment().isBefore(expirationDate))
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
}
