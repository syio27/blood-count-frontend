import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { throwError, catchError, retry, tap, Observable } from 'rxjs';
import { IInviteUserRequest } from '../interfaces/IInviteUserRequest';
import { UserDetails } from '../interfaces/IUserDetails';
import { Roles } from '../enums/role.enum';
import { ISimpleGameResponse } from '../interfaces/ISimpleGameResponse';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private readonly baseUrl = `${environment.baseUrl}api/v1/users/`

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

    fetchGroupParticipants(groupNumber: string): Observable<UserDetails[]> {
        let params = new HttpParams().set('groupNumber', groupNumber);
        return this.http.get<UserDetails[]>(this.baseUrl + "group", { params: params })
            .pipe(
                catchError(this.handleException)
            );
    }

    fetchUsersByRole(role: Roles): Observable<UserDetails[]> {
        let params = new HttpParams().set('role', role);
        return this.http.get<UserDetails[]>(this.baseUrl, { params: params })
            .pipe(
                catchError(this.handleException)
            );
    }

    ban(userId: string): Observable<void> {
        return this.http.post<void>(this.baseUrl + `${userId}/ban`, {})
            .pipe(
                catchError(this.handleException)
            )
    }

    /**
     * method used for admin/root/supervisors to see the completed games of user
     * @param userId 
     * @returns 
     */
    getCompletedGames(userId: string): Observable<ISimpleGameResponse[]> {
        return this.http.get<ISimpleGameResponse[]>(`${this.baseUrl}${userId}/games`);
    }

    deleteUserById(userId: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}${userId}`);
    }

    assignUserToAnotherGroup(userId: string, groupNumber: string): Observable<void> {
        return this.http.put<void>(this.baseUrl + 'user/group', { userId, groupNumber });
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