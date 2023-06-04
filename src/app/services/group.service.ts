import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, catchError, retry, tap, Observable } from 'rxjs';
import { IGroupResponse } from '../interfaces/IGroupResponse';
import { ICreateGroupRequest } from '../interfaces/ICreateGroupRequest';


@Injectable({
    providedIn: 'root'
})
export class GroupService {
    private readonly baseUrl = "http://localhost:8080/api/v1/groups/"

    constructor(
        private http: HttpClient
    ) { }

    fetchAllGroups(): Observable<IGroupResponse> {
        return this.http.get<IGroupResponse>(this.baseUrl, { observe: 'body', responseType: 'json' })
            .pipe(
                retry(3),
                catchError(this.handleException)
            );
    }

    fetchGroupByNumber(groupNumber: string): Observable<IGroupResponse> {
        return this.http.get<IGroupResponse>(this.baseUrl + groupNumber, { observe: 'body', responseType: 'json' })
            .pipe(
                retry(3),
                catchError(this.handleException)
            );
    }

    createNewGroup(groupRequest: ICreateGroupRequest): Observable<IGroupResponse> {
        return this.http.post<IGroupResponse>(this.baseUrl, groupRequest, { observe: 'body' })
            .pipe(
                catchError(this.handleException)
            );
    }

    clearGroup(groupNumber: string): Observable<any> {
        const url = `${this.baseUrl}clear?groupNumber=${groupNumber}`;
        return this.http.post(url, {})
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

        return throwError(() => new Error("Error happened; Try again"))
    }
}