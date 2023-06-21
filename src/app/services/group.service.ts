import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, catchError, retry, tap, Observable } from 'rxjs';
import { IGroupResponse } from '../interfaces/IGroupResponse';
import { ICreateGroupRequest } from '../interfaces/ICreateGroupRequest';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class GroupService {
    private readonly baseUrl = `${environment.baseUrl}api/v1/groups/`

    constructor(
        private http: HttpClient
    ) { }

    // only authorized users
    fetchAllGroups(): Observable<IGroupResponse> {
        return this.http.get<IGroupResponse>(this.baseUrl, { observe: 'body', responseType: 'json' })
            .pipe(
                retry(3),
                catchError(this.handleException)
            );
    }

    // public api for non-authorized users
    fetchAllGroupsPublic(): Observable<IGroupResponse> {
        return this.http.get<IGroupResponse>("http://localhost:8080/public/api/v1/groups", { observe: 'body', responseType: 'json' })
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

    deleteGroup(groupNumber: string): Observable<void> {
        return this.http.delete<void>(this.baseUrl + groupNumber, { observe: 'body' })
            .pipe(
                retry(3),
                catchError(this.handleException)
            );
    }

    deleteUserFromGroup(groupNumber: string, userId: string): Observable<void> {
        return this.http.post<void>(this.baseUrl + `${groupNumber}/users/${userId}`, { observe: 'body' })
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

        return throwError(() => exception.error)
    }
}