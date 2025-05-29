import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

export abstract class BaseService {
    protected readonly baseUrl: string;
    protected readonly publicBaseUrl: string;

    constructor(
        protected http: HttpClient,
        servicePath: string
    ) {
        this.baseUrl = `${environment.baseUrl}api/v1/${servicePath}/`;
        this.publicBaseUrl = `${environment.baseUrl}public/api/v1/${servicePath}/`;
    }

    protected handleException(exception: HttpErrorResponse) {
        if (exception.status === 0) {
            console.error(`Error on client-side occurred:, ${exception.error}`);
        } else {
            console.error(`Error on server-side occurred with status code: ${exception.status} and message: ${exception.error}`);
        }
        return throwError(() => exception.error);
    }

    protected get<T>(endpoint: string, params?: any): Observable<T> {
        const url = `${this.baseUrl}${endpoint}`;
        return this.http.get<T>(url, { params });
    }

    protected post<T>(endpoint: string, body: any, params?: any): Observable<T> {
        const url = `${this.baseUrl}${endpoint}`;
        return this.http.post<T>(url, body, { params });
    }

    protected put<T>(endpoint: string, body: any, params?: any): Observable<T> {
        const url = `${this.baseUrl}${endpoint}`;
        return this.http.put<T>(url, body, { params });
    }

    protected delete<T>(endpoint: string, params?: any): Observable<T> {
        const url = `${this.baseUrl}${endpoint}`;
        return this.http.delete<T>(url, { params });
    }

    protected getPublic<T>(endpoint: string, params?: any): Observable<T> {
        const url = `${this.publicBaseUrl}${endpoint}`;
        return this.http.get<T>(url, { params });
    }

    protected postPublic<T>(endpoint: string, body: any, params?: any): Observable<T> {
        const url = `${this.publicBaseUrl}${endpoint}`;
        return this.http.post<T>(url, body, { params });
    }
} 