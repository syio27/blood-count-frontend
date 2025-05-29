import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { IInviteUserRequest } from '../interfaces/IInviteUserRequest';
import { UserDetails } from '../interfaces/IUserDetails';
import { Roles } from '../enums/role.enum';
import { ISimpleGameResponse } from '../interfaces/ISimpleGameResponse';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root'
})
export class AdminService extends BaseService {
    constructor(http: HttpClient) {
        super(http, 'users');
    }

    invite(inviteRequest: IInviteUserRequest): Observable<void> {
        return this.post<void>('invite', inviteRequest)
            .pipe(catchError(this.handleException));
    }

    assignUserToGroup(groupNumber: string, uuid: string): Observable<void> {
        const payload = { groupNumber: groupNumber };
        return this.post<void>(`${uuid}/group`, payload)
            .pipe(catchError(this.handleException));
    }

    assignBatchUsersToGroup(groupNumber: string, uuids: string[]): Observable<void> {
        const payload = {
            userIds: uuids,
            groupNumber: groupNumber
        };
        return this.post<void>('group', payload)
            .pipe(catchError(this.handleException));
    }

    changeUserGroup(uuid: string, groupNumber: string): Observable<void> {
        const payload = {
            id: uuid,
            groupNumber: groupNumber
        };
        return this.put<void>('user/group', payload)
            .pipe(catchError(this.handleException));
    }

    fetchGroupParticipants(groupNumber: string): Observable<UserDetails[]> {
        return this.get<UserDetails[]>('group', { groupNumber })
            .pipe(catchError(this.handleException));
    }

    fetchUsersByRole(role: Roles): Observable<UserDetails[]> {
        return this.get<UserDetails[]>('', { role })
            .pipe(catchError(this.handleException));
    }

    ban(userId: string): Observable<void> {
        return this.post<void>(`${userId}/ban`, {})
            .pipe(catchError(this.handleException));
    }

    /**
     * method used for admin/root/supervisors to see the completed games of user
     * @param userId 
     * @returns 
     */
    getCompletedGames(userId: string): Observable<ISimpleGameResponse[]> {
        return this.get<ISimpleGameResponse[]>(`${userId}/games`);
    }

    deleteUserById(userId: string): Observable<void> {
        return this.delete<void>(userId);
    }

    assignUserToAnotherGroup(userId: string, groupNumber: string): Observable<void> {
        return this.put<void>('user/group', { userId, groupNumber });
    }
}