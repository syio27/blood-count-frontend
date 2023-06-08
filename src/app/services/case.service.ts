import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, catchError, retry, tap, Observable, switchMap } from 'rxjs';
import { ICreateCaseRequest } from '../interfaces/ICreateCaseRequest';
import { ICreateAbnormalityRequest } from '../interfaces/ICreateAbnormalityRequest';
import { ICaseResponse } from '../interfaces/ICaseResponse';

@Injectable({
    providedIn: 'root'
})
export class CaseService {
    private readonly baseUrl = "http://localhost:8080/api/v1/cases/"

    constructor(
        private http: HttpClient
    ) { }

    private createCase(caseRequest: ICreateCaseRequest): Observable<ICaseResponse> {
        return this.http.post<ICaseResponse>(this.baseUrl, caseRequest)
            .pipe(
                catchError(this.handleException)
            );
    }

    private createAbnormality(caseId: number, abnormalityRequest: ICreateAbnormalityRequest) {
        return this.http.post<void>(this.baseUrl + `${caseId}/abnormality`, abnormalityRequest)
            .pipe(
                catchError(this.handleException)
            );
    }

    createCaseWithAbnormality(caseData: ICreateCaseRequest, abnormalityData: ICreateAbnormalityRequest) {
        this.createCase(caseData).pipe(
            switchMap((caseResponse: ICaseResponse) => {
                const caseId = caseResponse.id;
                return this.createAbnormality(caseId, abnormalityData);
            })
        ).subscribe();
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