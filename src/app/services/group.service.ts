import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { IGroupResponse } from '../interfaces/IGroupResponse';
import { ICreateGroupRequest } from '../interfaces/ICreateGroupRequest';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root'
})
export class GroupService extends BaseService {
    constructor(http: HttpClient) {
        super(http, 'groups');
    }

    // only authorized users
    fetchAllGroups(): Observable<IGroupResponse[]> {
        return this.get<IGroupResponse[]>('')
            .pipe(
                retry(3),
                catchError(this.handleException)
            );
    }

    // public api for non-authorized users
    fetchAllGroupsPublic(): Observable<IGroupResponse> {
        return this.getPublic<IGroupResponse>('')
            .pipe(
                retry(3),
                catchError(this.handleException)
            );
    }

    fetchGroupByNumber(groupNumber: string): Observable<IGroupResponse> {
        return this.get<IGroupResponse>(groupNumber)
            .pipe(
                retry(3),
                catchError(this.handleException)
            );
    }

    createNewGroup(groupRequest: ICreateGroupRequest): Observable<IGroupResponse> {
        return this.post<IGroupResponse>('', groupRequest)
            .pipe(catchError(this.handleException));
    }

    clearGroup(groupNumber: string): Observable<any> {
        return this.post<any>('clear', {}, { groupNumber })
            .pipe(catchError(this.handleException));
    }

    deleteGroup(groupNumber: string): Observable<void> {
        return this.delete<void>(groupNumber)
            .pipe(
                retry(3),
                catchError(this.handleException)
            );
    }

    deleteUserFromGroup(groupNumber: string, userId: string): Observable<void> {
        return this.post<void>(`${groupNumber}/users/${userId}`, {})
            .pipe(
                retry(3),
                catchError(this.handleException)
            );
    }
}