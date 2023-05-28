import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDetails } from '../interfaces/userDetails';
import { BehaviorSubject, throwError, catchError, retry, tap, Observable } from 'rxjs';

/**
 * Shared Service used to hold the User's Details information from `users/email/{email}` api
 * UserDetails stored in BehaviorSubject
 * Any Component can subscibe to the BehaviorSubject and use the UserDetails
 */

@Injectable({
  providedIn: 'root'
})
export class SharedUserDetailsService {
  private userDetailsSource: BehaviorSubject<UserDetails> = new BehaviorSubject<UserDetails>(this.getUserDetailsFromLocalStorage() || null);
  private readonly baseUrl = "http://localhost:8080/api/v1/users/"

  getUserDetails() {
    return this.userDetailsSource.asObservable();
  }

  setUserDetails(userDetails: UserDetails) {
    this.userDetailsSource.next(userDetails);
    this.persistUserDetailsToLocalStore(userDetails);
  }

  constructor(private http: HttpClient) { }

  fetchUserDetailsByEmail(email: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(this.baseUrl + `email/${email}`, { observe: 'body', responseType: 'json' })
      .pipe(
        retry(3),
        catchError(this.handleException)
      );
  }


  /**
   * Sets userDetails to localStorage to be persisted inside the whole application
   * and can be returned and used with BehaviorSubject on other components of app
   * @param userDetails 
   */
  private persistUserDetailsToLocalStore(userDetails: UserDetails) {
    const userDetailsString = JSON.stringify(userDetails)
    localStorage.setItem('userDetails', userDetailsString);
  }

  private getUserDetailsFromLocalStorage(): UserDetails {
    const userDetailsString = localStorage.getItem('userDetails');
    const userDetails = JSON.parse(userDetailsString);
    return userDetails;
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
