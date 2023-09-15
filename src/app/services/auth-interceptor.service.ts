import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private router: Router) { }

  private excludedUrls: string[] = [
    `${environment.baseUrl}api/v1/auth/authenticate`,
    `${environment.baseUrl}api/v1/auth/register`,
    `${environment.baseUrl}public/api/v1/groups`,
    `${environment.baseUrl}public/api/v1/reset-password`,
    `${environment.baseUrl}public/api/v1/forgot-password`,
    `${environment.baseUrl}public/api/v1/validate-token`
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.getjwtToken();
    if (this.excludedUrls.some(url => req.url.includes(url))) {
      return next.handle(req);
    }

    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });

    return next.handle(authReq).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {
            // Do nothing for now
          }
        },
        error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 403) {
              this.router.navigate(['/login']);
            }
          }
        }
      )
    );
  }

  getjwtToken() {
    return localStorage.getItem("jwt");
  }
}
