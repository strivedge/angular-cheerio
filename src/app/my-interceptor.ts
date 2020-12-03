import { Injectable } from '@angular/core';

import {
  HttpRequest,
  HttpHandler,
  HttpHeaders,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {NbAuthToken, NbAuthJWTToken, NbAuthSimpleToken, NbAuthService, NB_AUTH_TOKEN_INTERCEPTOR_FILTER} from '@nebular/auth';

@Injectable()
export class NbAuthJWTInterceptor implements HttpInterceptor {
  user_token: any;
  constructor(private authService: NbAuthService) {
    
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      this.user_token = token.getValue();

    });
  }
  // function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {    
    // console.log(this.authService.getToken());
     var updatedRequest = request.clone({
      url: request.url,
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Content-Type':  'application/json',
        'x-access-token': this.user_token
      })
    });

    return next.handle(updatedRequest).pipe(
      tap(
        event => {
          // logging the http response to browser's console in case of a success
          if (event instanceof HttpResponse) {
            // console.log(HttpResponse);
            // console.log('api call success :', event);
          }
        },
        error => {
          // logging the http response to browser's console in case of a failuer
          if (event instanceof HttpResponse) {
             console.log('api call error :', event);
          }
        }
      )
    );
  }
}