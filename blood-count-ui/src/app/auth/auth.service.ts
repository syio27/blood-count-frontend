import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationRequest } from './authenticationRequest';
import { RegisterRequest } from './registerRequest';
import { AuthenticationResponse } from './authenticationResponse';
import { HttpClient } from '@angular/common/http';
import { tap, shareReplay, catchError, of, Observable } from 'rxjs';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isLoginExpired());

  private readonly baseUrl = "http://localhost:8080/api/v1/auth/"

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  login(authenticationRequest: AuthenticationRequest) {
    return this.http.post<AuthenticationResponse>(this.baseUrl + "authenticate", authenticationRequest, { observe: 'body' })
      .pipe(
        tap(res => {
          this.setSession(res)
          this.loggedIn.next(true);
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
    const expiresAt = moment().add(authResult.expirationDate, 'second');

    localStorage.setItem('token', authResult.token);
    localStorage.setItem("expirationDate", JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  public isLoginExpired(): boolean {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoginExpired();
  }

  getExpiration() {
    const expirationDate = localStorage.getItem("expirationDate");
    const expiresAt = JSON.parse(expirationDate);
    return moment(expiresAt);
  }
}
