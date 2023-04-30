import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDetails } from '../interfaces/userDetails';
import { BehaviorSubject, throwError, catchError, retry } from 'rxjs';

/**
 * Shared Service used to hold the User's Details information from `users/email/{email}` api
 * UserDetails stored in BehaviorSubject
 * Any Component can subscibe to the BehaviorSubject and use the UserDetails
 */

@Injectable({
  providedIn: 'root'
})
export class SharedUserDetailsService {

  private userDetailsSource: BehaviorSubject<UserDetails> = new BehaviorSubject<UserDetails>(null);
  private readonly baseUrl = "http://localhost:8080/api/v1/users/"

  get userDetails() {
    return this.userDetailsSource.asObservable();
  }

  setUserDetails(userDetails: UserDetails) {
    this.userDetailsSource.next(userDetails);
  }

  constructor(private http: HttpClient) { }

  fetchUserDetailsByEmail(email: string) {
    return this.http.get<UserDetails>(this.baseUrl + `email/${email}`, { observe: 'body', responseType: 'json' })
      .pipe(
        retry(3),
        catchError(this.handleException)
      );
  }

  private handleException(exception: HttpErrorResponse) {
    if (exception.status === 0) {
      console.error(`Error on client-side occured:, ${exception.error}`)
    } else {
      console.error(`Error on server-side occured with status code: ${exception.status} and message: ${exception.error}`)
    }

    return throwError(() => new Error("Error happened; Try again"))
  }
}
