import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import {
  AccountCredentials,
  AuthenticatedMember,
  ForgotPasswordPayload,
  MemberAuthResponse,
  MemberRegisterPayload,
  RecaptchaConfig,
} from '../member/models/member.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = API_CONFIG.baseUrl;
  private readonly authBase = `${this.baseUrl}/members/auth`;
  private readonly tokenStorageKey = 'member_token';
  private readonly userStorageKey = 'member_user';

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string, recaptchaToken?: string): Observable<MemberAuthResponse> {
    const payload: AccountCredentials = { username, password };
    if (recaptchaToken) payload.recaptchaToken = recaptchaToken;
    return this.http
      .post<MemberAuthResponse | (Partial<MemberAuthResponse> & { accessToken?: string; jwt?: string })>(
        `${this.authBase}/login`,
        payload,
      )
      .pipe(
        map((response) => {
          const apiResponse = response as MemberAuthResponse & { accessToken?: string; jwt?: string };
          const token = apiResponse.token ?? apiResponse.accessToken ?? apiResponse.jwt ?? '';
          if (!token) {
            throw new Error('Token is missing in login response.');
          }
          const normalized: MemberAuthResponse = {
            id: Number(response.id ?? 0),
            username: String(response.username ?? ''),
            email: String(response.email ?? ''),
            enabled: Boolean(response.enabled ?? true),
            role: String(response.role ?? 'MEMBER'),
            memberId: response.memberId ?? null,
            token,
          };
          return normalized;
        }),
        tap((response) => {
          this.storeAccessToken(response.token);
          this.storeCurrentUser({
            id: response.id,
            username: response.username,
            email: response.email,
            enabled: response.enabled,
            role: response.role,
            memberId: response.memberId ?? null,
          });
        }),
      );
  }

  register(payload: MemberRegisterPayload): Observable<unknown> {
    return this.http.post(`${this.authBase}/register`, payload);
  }

  createAccount(payload: MemberRegisterPayload): Observable<unknown> {
    return this.register(payload);
  }

  forgotPassword(payload: ForgotPasswordPayload): Observable<unknown> {
    return this.http.post(`${this.authBase}/forgot-password`, payload);
  }

  getRecaptchaConfig(): Observable<RecaptchaConfig> {
    return this.http
      .get<Partial<RecaptchaConfig>>(`${this.baseUrl}/auth/recaptcha-config`)
      .pipe(
        map((cfg) => ({
          enabled: Boolean(cfg.enabled),
          siteKey: String(cfg.siteKey ?? ''),
        })),
        catchError(() => of({ enabled: false, siteKey: '' })),
      );
  }

  getAccessToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(this.tokenStorageKey);
  }

  storeAccessToken(token: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.tokenStorageKey, token);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  hasMemberAccess(): boolean {
    return this.isAuthenticated();
  }

  logout(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem(this.userStorageKey);
  }

  getCurrentUser(): AuthenticatedMember | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(this.userStorageKey);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as Partial<AuthenticatedMember>;
      return {
        id: Number(parsed.id ?? 0),
        username: String(parsed.username ?? ''),
        email: String(parsed.email ?? ''),
        enabled: Boolean(parsed.enabled ?? true),
        role: String(parsed.role ?? 'MEMBER'),
        memberId: parsed.memberId ?? null,
      };
    } catch {
      return null;
    }
  }

  storeCurrentUser(user: AuthenticatedMember): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.userStorageKey, JSON.stringify(user));
  }
}
