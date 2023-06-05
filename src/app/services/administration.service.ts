import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { throwError, catchError, retry, tap, Observable } from 'rxjs';
import { IInviteUserRequest } from '../interfaces/IInviteUserRequest';
import { UserDetails } from '../interfaces/IUserDetails';


@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private readonly baseUrl = "http://localhost:8080/api/v1/users/"

    constructor(
        private http: HttpClient
    ) { }

    invite(inviteRequest: IInviteUserRequest) {
        return this.http.post(this.baseUrl + "invite", inviteRequest)
            .pipe(
                catchError(this.handleException)
            )
    }

    assignUserToGroup(groupNumber: string, uuid: string) {
        const payload = { groupNumber: groupNumber };
        return this.http.post(this.baseUrl + `${uuid}/group`, payload)
            .pipe(
                catchError(this.handleException)
            )
    }

    assignBatchUsersToGroup(groupNumber: string, uuids: string[]) {
        const payload = {
            userIds: uuids,
            groupNumber: groupNumber
        };
        return this.http.post(this.baseUrl + "group", payload)
            .pipe(
                catchError(this.handleException)
            )
    }

    changeUserGroup(uuid: string, groupNumber: string) {
        const payload = {
            id: uuid,
            groupNumber: groupNumber
        }
        return this.http.put(this.baseUrl + "user/group", payload)
            .pipe(
                catchError(this.handleException)
            )
    }

    fetchGroupParticipants(groupNumber: string): Observable<UserDetails> {
        let params = new HttpParams().set('groupNumber', groupNumber);
        return this.http.get<UserDetails>(this.baseUrl + "group", { params: params })
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