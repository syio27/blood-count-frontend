import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { throwError, catchError, retry, tap, Observable, pipe } from 'rxjs';
import { IReferenceTable } from '../interfaces/IReferenceTable';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class ReferenceTableService {
    private readonly baseUrl = `${environment.baseUrl}api/v1/bc-ref/`

    constructor(
        private http: HttpClient
    ) { }

    fetchBCReferenceTable(): Observable<IReferenceTable> {
        return this.http.get<IReferenceTable>(this.baseUrl + "table")
            .pipe(
                retry(3),
                catchError(this.handleException)
            )
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