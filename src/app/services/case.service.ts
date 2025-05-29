import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry, switchMap, map } from 'rxjs/operators';
import { ICreateCaseRequest } from '../interfaces/ICreateCaseRequest';
import { ICreateAbnormalityRequest } from '../interfaces/ICreateAbnormalityRequest';
import { ICaseResponse } from '../interfaces/ICaseResponse';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root'
})
export class CaseService extends BaseService {
    constructor(http: HttpClient) {
        super(http, 'cases');
    }

    createCase(caseRequest: ICreateCaseRequest): Observable<ICaseResponse> {
        return this.post<ICaseResponse>('', caseRequest)
            .pipe(catchError(this.handleException));
    }

    createAbnormality(caseId: number, abnormalityRequestList: ICreateAbnormalityRequest[]): Observable<void> {
        return this.post<void>(`${caseId}/abnormalities`, abnormalityRequestList)
            .pipe(catchError(this.handleException));
    }

    createCaseWithAbnormality(caseData: ICreateCaseRequest, abnormalityDataList: ICreateAbnormalityRequest[]): Observable<ICaseResponse> {
        return this.createCase(caseData).pipe(
            switchMap((caseResponse: ICaseResponse) => {
                const caseId = caseResponse.id;
                return this.createAbnormality(caseId, abnormalityDataList).pipe(
                    map(() => caseResponse) // Return the caseResponse object
                );
            })
        );
    }

    getAllCasesWithAbnormalities(): Observable<ICaseResponse[]> {
        return this.get<ICaseResponse[]>('abnormalities')
            .pipe(
                retry(3),
                catchError(this.handleException)
            );
    }

    getCaseWithAbnormalities(id: number): Observable<ICaseResponse> {
        return this.get<ICaseResponse>(`${id}/abnormalities`)
            .pipe(
                retry(3),
                catchError(this.handleException)
            );
    }

    deleteCase(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}${id}`)
            .pipe(catchError(this.handleException));
    }
}