import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGameResponse } from '../interfaces/IGameResponse';
import { IAnswerRequest } from '../interfaces/IAnswerRequest';
import { IGameCurrentSessionState } from '../interfaces/IGameCurrentSessionState';
import { IStartGameRequest } from '../interfaces/IStartGameRequest';
import { BaseService } from './base.service';
import { catchError } from 'rxjs/operators';
import { ISimpleGameResponse } from '../interfaces/ISimpleGameResponse';
import { IGameInProgress } from '../interfaces/IGameInProgress';

@Injectable({
    providedIn: 'root'
})
export class GameService extends BaseService {
    constructor(http: HttpClient) {
        super(http, 'games');
    }

    start(startRequest: IStartGameRequest): Observable<void> {
        return this.post<void>('', startRequest)
            .pipe(catchError(this.handleException));
    }

    complete(gameId: number, userId: string): Observable<ISimpleGameResponse> {
        const url = `${this.baseUrl}${gameId}/complete?userId=${userId}`;
        return this.http.post<ISimpleGameResponse>(url, {})
            .pipe(
                catchError(this.handleException)
            );
    }

    getInProgressGame(gameId: number, userId: string): Observable<IGameResponse> {
        return this.get<IGameResponse>(`${gameId}`, { userId })
            .pipe(catchError(this.handleException));
    }

    checkIfAnyInProgress(userId: string): Observable<IGameInProgress> {
        const url = `${this.baseUrl}?userId=${userId}`;
        return this.http.get<IGameInProgress>(url, {})
            .pipe(
                catchError(this.handleException)
            );
    }

    autoSave(gameId: number, userId: string, answerRequests: IAnswerRequest[]): Observable<void> {
        return this.post<void>(`${gameId}/save`, answerRequests, { userId })
            .pipe(catchError(this.handleException));
    }

    next(gameId: number, userId: string, answerRequests: IAnswerRequest[]): Observable<IGameCurrentSessionState> {
        return this.post<IGameCurrentSessionState>(`${gameId}/next`, answerRequests, { userId })
            .pipe(catchError(this.handleException));
    }
}