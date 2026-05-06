import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  canActivate(): boolean | UrlTree {
    const user = this.auth.getCurrentUser();
    if (user && user.role?.toUpperCase() === 'ADMIN') {
      return true;
    }
    return this.router.createUrlTree(['/home']);
  }
}
