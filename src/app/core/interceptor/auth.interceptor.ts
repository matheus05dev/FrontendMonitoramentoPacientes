import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';

import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { TokenResponse } from '../types/TokenResponse';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> =
  new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const accessToken = tokenService.getAccessToken();

  if (
    accessToken &&
    authService.isLoggedIn() &&
    !req.url.includes('/auth/login')
  ) {
    req = addTokenToRequest(req, accessToken);
  }

  return next(req).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !req.url.includes('/auth/refresh')
      ) {
        return handle401Error(req, next, authService);
      }
      return throwError(() => error);
    })
  );
};

const addTokenToRequest = (
  request: HttpRequest<any>,
  token: string
): HttpRequest<any> => {
  return request.clone({
    headers: request.headers.set('Authorization', `Bearer ${token}`),
  });
};

const handle401Error = (
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<any>> => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((token: TokenResponse) => {
        isRefreshing = false;
        refreshTokenSubject.next(token.accessToken);
        return next(addTokenToRequest(request, token.accessToken));
      }),
      catchError((err) => {
        isRefreshing = false;
        authService.logout(); // Logout on refresh failure
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((jwt) => {
        return next(addTokenToRequest(request, jwt!));
      })
    );
  }
};
