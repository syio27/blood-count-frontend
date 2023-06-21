import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, catchError, retry, tap, Observable, switchMap, map } from 'rxjs';
import { ICreateCaseRequest } from '../interfaces/ICreateCaseRequest';
import { ICreateAbnormalityRequest } from '../interfaces/ICreateAbnormalityRequest';
import { ICaseResponse } from '../interfaces/ICaseResponse';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class CaseService {
    private readonly baseUrl = `${environment.baseUrl}api/v1/cases/`

    constructor(
        private http: HttpClient
    ) { }

    private createCase(caseRequest: ICreateCaseRequest): Observable<ICaseResponse> {
        return this.http.post<ICaseResponse>(this.baseUrl, caseRequest)
            .pipe(
                catchError(this.handleException)
            );
    }

    private createAbnormality(caseId: number, abnormalityRequestList: ICreateAbnormalityRequest[]) {
        return this.http.post<void>(this.baseUrl + `${caseId}/abnormalities`, abnormalityRequestList)
            .pipe(
                catchError(this.handleException)
            );
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

    getAllCasesWithAbnormalities(): Observable<ICaseResponse> {
        return this.http.get<ICaseResponse>(this.baseUrl + "abnormalities", { observe: 'body', responseType: 'json' })
            .pipe(
                retry(3),
                catchError(this.handleException)
            );
    }

    getCaseWithAbnormalities(id: number): Observable<ICaseResponse> {
        return this.http.get<ICaseResponse>(this.baseUrl + `${id}/abnormalities`, { observe: 'body', responseType: 'json' })
            .pipe(
                retry(3),
                catchError(this.handleException)
            );
    }

    deleteCase(id: number) {
        return this.http.delete(this.baseUrl + `${id}`);
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