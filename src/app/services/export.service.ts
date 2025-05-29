import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root'
})
export class ExportService extends BaseService {
    constructor(http: HttpClient) {
        super(http, 'files');
    }

    exportGameStats(): Observable<Blob> {
        const headers = new HttpHeaders({
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        return this.get<Blob>('export', { headers, responseType: 'blob' as 'json' })
            .pipe(catchError(this.handleException));
    }
}