import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, catchError, retry, tap, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ExportService {
    private readonly baseUrl = "http://localhost:8080/api/v1/files/"

    constructor(
        private http: HttpClient
    ) { }

    exportGameStats(): Observable<Blob> {
        const headers = new HttpHeaders({
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        return this.http.get<Blob>(this.baseUrl + "export", { headers, responseType: 'blob' as 'json' });
    }
}