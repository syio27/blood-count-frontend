import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, catchError, retry, tap, Observable, switchMap, map } from 'rxjs';
import { IGameResponse } from '../interfaces/IGameResponse';
import { IAnswerRequest } from '../interfaces/IAnswerRequest';
import { environment } from 'src/environments/environment';
import { IGameCurrentSessionState } from '../interfaces/IGameCurrentSessionState';
import { IGameInProgress } from '../interfaces/IGameInProgress';
import { ISimpleGameResponse } from '../interfaces/ISimpleGameResponse';


@Injectable({
    providedIn: 'root'
})
export class GameService {
    private readonly baseUrl = `${environment.baseUrl}api/v1/games/`

    constructor(
        private http: HttpClient
    ) { }

    start(caseId: number, userId: string): Observable<IGameResponse> {
        const url = `${this.baseUrl}case/${caseId}?userId=${userId}`;
        return this.http.get<IGameResponse>(url, {})
            .pipe(
                catchError(this.handleException)
            );
    }

    complete(gameId: number, answerRequests: IAnswerRequest[], userId: string): Observable<ISimpleGameResponse> {
        const url = `${this.baseUrl}${gameId}/complete?userId=${userId}`;
        return this.http.post<ISimpleGameResponse>(url, answerRequests)
            .pipe(
                catchError(this.handleException)
            );
    }

    getInProgressGame(gameId: number, userId: string): Observable<IGameResponse> {
        const url = `${this.baseUrl}${gameId}?userId=${userId}`;
        return this.http.get<IGameResponse>(url, {})
            .pipe(
                catchError(this.handleException)
            );
    }

    checkIfAnyInProgress(userId: string): Observable<IGameInProgress> {
        const url = `${this.baseUrl}?userId=${userId}`;
        return this.http.get<IGameInProgress>(url, {})
            .pipe(
                catchError(this.handleException)
            );
    }

    autoSave(gameId: number, userId: string, answerRequests: IAnswerRequest[]) {
        const url = `${this.baseUrl}${gameId}/save?userId=${userId}`;
        return this.http.post<void>(url, answerRequests)
            .pipe(
                catchError(this.handleException)
            );
    }

    next(gameId: number, userId: string, answerRequests: IAnswerRequest[]): Observable<IGameCurrentSessionState> {
        const url = `${this.baseUrl}${gameId}/next?userId=${userId}`;
        return this.http.post<IGameCurrentSessionState>(url, answerRequests)
            .pipe(
                catchError(this.handleException)
            );
    }

    private handleException(exception: HttpErrorResponse) {
        if (exception.status === 0) {
            console.error(`Error on client-side occured:, ${exception.error}`)
        } else {
            console.error(`Error on server-side occured with status code: ${exception.status} and message: ${exception.error}`)
        }

        return throwError(() => exception.error)
    }
}