import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, catchError, retry, tap, Observable, switchMap, map } from 'rxjs';
import { IGameResponse } from '../interfaces/IGameResponse';


@Injectable({
    providedIn: 'root'
})
export class GameService {
    private readonly baseUrl = "http://localhost:8080/api/v1/games/"

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

    private handleException(exception: HttpErrorResponse) {
        if (exception.status === 0) {
            console.error(`Error on client-side occured:, ${exception.error}`)
        } else {
            console.error(`Error on server-side occured with status code: ${exception.status} and message: ${exception.error}`)
        }

        return throwError(() => exception.error)
    }
}