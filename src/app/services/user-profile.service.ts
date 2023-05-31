import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, catchError, tap } from 'rxjs';
import { PasswordChangeRequest } from '../interfaces/IPasswordChangeRequest';
import { EmailChangeRequest } from '../interfaces/IEmailChangeRequest';
import { UserDetails } from '../interfaces/IUserDetails';
import { SharedUserDetailsService } from '../services/shared-user-details.service';
import { AuthService } from '../auth/auth.service';
import { AuthenticationResponse } from '../interfaces/IAuthenticationResponse';

/**
 * Service for UserProfile component to communicate with backend
 */
@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private readonly baseUrl = "http://localhost:8080/api/v1/users/"

  constructor(
    private http: HttpClient,
    private userDetailsService: SharedUserDetailsService,
    private authService: AuthService
  ) { }

  /**
   * function to request the backend to change the password
   * @param passwordChangeRequest FORM entered by user
   * @param id of current logged-in user, passed from localStorage.getItem("userDetails")
   */
  updatePassword(passwordChangeRequest: PasswordChangeRequest, id: string) {
    return this.http.put<AuthenticationResponse>(this.baseUrl + `${id}/password`, passwordChangeRequest, { observe: 'body' })
      .pipe(
        tap((res: AuthenticationResponse) => {
          localStorage.removeItem("jwt")
          localStorage.removeItem("expirationDate")
          this.authService.setSession(res)
        }),
        catchError(this.handleException)
      );
  }

  changeEmail(emailChangeRequest: EmailChangeRequest, id: string) {
    return this.http.put<UserDetails>(this.baseUrl + `${id}/email`, emailChangeRequest, { observe: 'body', responseType: 'json' })
      .pipe(
        tap((res: UserDetails) => {
          this.userDetailsService.setUserDetails(res)
        }),
        catchError(this.handleException)
      );
  }

  private handleException(exception: HttpErrorResponse) {
    if (exception.status === 0) {
      console.error(`Error on client-side occured:, ${exception.error}`)
    } else {
      console.error(`Error on server-side occured with status code: ${exception.status} and message: ${JSON.stringify(exception.error)}`)
    }

    return throwError(() => new Error("Error happened; Try again"))
  }
}