import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const token = tokenService.getToken();
  if (token) {
    const exp = tokenService.getExp();
    const now = Math.floor(Date.now() / 1000);
    if (exp > now) {
      return true;
    }
  }

  return router.parseUrl('/');
};
