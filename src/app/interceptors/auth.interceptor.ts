import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly auth: AuthService) {}

intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  // Ne pas ajouter le token JWT pour les requêtes externes (Gemini, etc.)
  if (req.url.includes('generativelanguage.googleapis.com')) {
    return next.handle(req);
  }

  const token = this.auth.getAccessToken();

  console.log('TOKEN INTERCEPTOR =', token);
  console.log('REQUEST URL =', req.url);

  if (!token) {
    console.log('Aucun token trouvé');
    return next.handle(req);
  }

  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('AUTH HEADER =', `Bearer ${token}`);

  return next.handle(cloned);
}
}