import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PasswordChangeRequest } from '../interfaces/IPasswordChangeRequest';
import { AuthService } from '../auth/auth.service';
import { AuthenticationResponse } from '../interfaces/IAuthenticationResponse';
import { IUserSelectedAnswerResponse } from '../interfaces/ISelectedUserAnswers';
import { ISimpleGameResponse } from '../interfaces/ISimpleGameResponse';
import { BaseService } from './base.service';

/**
 * Service for UserProfile component to communicate with backend
 */
@Injectable({
  providedIn: 'root'
})
export class UserProfileService extends BaseService {
  constructor(
    http: HttpClient,
    private authService: AuthService
  ) {
    super(http, 'users');
  }

  /**
   * function to request the backend to change the password
   * @param passwordChangeRequest FORM entered by user
   * @param id of current logged-in user, passed from localStorage.getItem("userDetails")
   */
  updatePassword(passwordChangeRequest: PasswordChangeRequest, id: string): Observable<AuthenticationResponse> {
    return this.put<AuthenticationResponse>(`${id}/password`, passwordChangeRequest)
      .pipe(
        tap((res: AuthenticationResponse) => {
          localStorage.removeItem("jwt");
          localStorage.removeItem("expirationDate");
          this.authService.setSession(res);
        }),
        catchError(this.handleException)
      );
  }

  getSelectedAnswersOfStudent(userId: string, gameId: number): Observable<IUserSelectedAnswerResponse[]> {
    return this.get<IUserSelectedAnswerResponse[]>(`${userId}/games/${gameId}`);
  }

  /**
   * method used for student user to see the completed games as history
   * @param userId 
   * @returns 
   */
  getHistory(userId: string): Observable<ISimpleGameResponse[]> {
    return this.get<ISimpleGameResponse[]>(`${userId}/games/completed`);
  }

  getCompletedGameById(userId: string, gameId: number): Observable<ISimpleGameResponse> {
    return this.get<ISimpleGameResponse>(userId, { gameId });
  }

  forgotPassword(email: any): Observable<any> {
    return this.postPublic<void>('forgot-password', email)
      .pipe(catchError(this.handleException));
  }

  resetPassword(token: string, email: string, form: { newPassword: string; confirmPassword: string }): Observable<any> {
    const payload = {
      token: token,
      email: email,
      newPassword: form.newPassword,
      newPasswordRepeat: form.confirmPassword
    };
    return this.postPublic<void>('reset-password', payload)
      .pipe(catchError(this.handleException));
  }

  validateToken(token: string, email: string): Observable<any> {
    const payload = {
      token: token,
      email: email
    };
    return this.postPublic<void>('validate-token', payload)
      .pipe(catchError(this.handleException));
  }
}