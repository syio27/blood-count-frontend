import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor() { }

  private excludedUrls: string[] = [
    'http://localhost:8080/api/v1/auth/authenticate',
    'http://localhost:8080/api/v1/auth/register',
    'http://localhost:8080/public/api/v1/groups'
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.getjwtToken();

    // Check if the request URL is in the excludedUrls list
    if (this.excludedUrls.some(url => req.url.includes(url))) {
      // If it is, pass the request unchanged
      return next.handle(req);
    }

    // If it's not, add the Authorization header
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });

    return next.handle(authReq);
  }

  getjwtToken() {
    return localStorage.getItem("jwt");
  }
}
