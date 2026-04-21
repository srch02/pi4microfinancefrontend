import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

declare global {
  interface Window {
    __onMemberRecaptchaLoaded?: () => void;
    grecaptcha?: {
      render: (
        container: HTMLElement,
        params: {
          sitekey: string;
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        },
      ) => number;
      reset: (widgetId?: number) => void;
      ready: (cb: () => void) => void;
    };
  }
}

@Component({
  selector: 'app-member-sign-in',
  templateUrl: './member-sign-in.component.html',
  standalone: false,
})
export class MemberSignInComponent implements AfterViewInit, OnDestroy {
  @ViewChild('recaptchaContainer') recaptchaContainer?: ElementRef<HTMLDivElement>;

  username = '';
  password = '';
  recaptchaToken = '';
  recaptchaEnabled = false;
  recaptchaSiteKey = '';
  rememberMe = false;
  showPassword = false;
  busy = false;
  errorMessage: string | null = null;
  recaptchaError: string | null = null;
  tokenInfoMessage: string | null = null;
  private recaptchaWidgetId: number | null = null;
  private recaptchaScriptEl?: HTMLScriptElement;
  private viewReady = false;
  private recaptchaRendered = false;
  private recaptchaWatchdogId: number | null = null;
  private recaptchaFallbackTried = false;

  constructor(
    private readonly router: Router,
    private readonly auth: AuthService,
    private readonly cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
    this.auth.getRecaptchaConfig().subscribe({
      next: (cfg) => {
        this.recaptchaEnabled = !!cfg?.enabled;
        this.recaptchaSiteKey = cfg?.siteKey ?? '';
        if (this.recaptchaEnabled && this.recaptchaSiteKey) {
          this.ensureRecaptchaScript();
        }
        this.tryRenderRecaptcha();
      },
      error: () => {
        this.recaptchaEnabled = false;
      },
    });
  }

  ngAfterViewInit(): void {
    if (this.auth.hasMemberAccess()) {
      this.router.navigate(['/app']);
      return;
    }
    this.viewReady = true;
    this.tryRenderRecaptcha();
  }

  ngOnDestroy(): void {
    this.clearRecaptchaWatchdog();
    if (this.recaptchaScriptEl?.parentNode) {
      this.recaptchaScriptEl.parentNode.removeChild(this.recaptchaScriptEl);
    }
    delete window.__onMemberRecaptchaLoaded;
  }

  private ensureRecaptchaScript(): void {
    this.startRecaptchaWatchdog();
    window.__onMemberRecaptchaLoaded = () => {
      this.tryRenderRecaptcha();
    };
    if (this.document.getElementById('google-recaptcha-script')) return;
    this.loadRecaptchaScript(
      'google-recaptcha-script',
      'https://www.google.com/recaptcha/api.js?onload=__onMemberRecaptchaLoaded&render=explicit',
    );
  }

  private loadRecaptchaScript(id: string, src: string): void {
    if (this.document.getElementById(id)) return;
    const script = this.document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      if (!this.recaptchaFallbackTried) {
        this.recaptchaFallbackTried = true;
        this.recaptchaError = 'Google reCAPTCHA script blocked; retrying via recaptcha.net...';
        this.cdr.detectChanges();
        this.loadRecaptchaScript(
          'recaptcha-net-script',
          'https://www.recaptcha.net/recaptcha/api.js?onload=__onMemberRecaptchaLoaded&render=explicit',
        );
        return;
      }
      this.recaptchaError =
        'Failed to load reCAPTCHA script from google.com and recaptcha.net. Check ad blocker/firewall/network policy.';
      this.cdr.detectChanges();
    };
    this.document.head.appendChild(script);
    this.recaptchaScriptEl = script;
  }

  private tryRenderRecaptcha(): void {
    if (!this.viewReady || !this.recaptchaEnabled || !this.recaptchaSiteKey) return;
    const container = this.recaptchaContainer?.nativeElement;
    if (!container || this.recaptchaWidgetId != null) return;
    const recaptcha = window.grecaptcha;
    if (!recaptcha) return;

    recaptcha.ready(() => {
      if (this.recaptchaWidgetId != null || !this.recaptchaContainer?.nativeElement) return;
      try {
        this.recaptchaWidgetId = recaptcha.render(this.recaptchaContainer.nativeElement, {
          sitekey: this.recaptchaSiteKey,
          callback: (token: string) => {
            this.recaptchaToken = token;
            this.recaptchaError = null;
          },
          'expired-callback': () => {
            this.recaptchaToken = '';
            this.recaptchaError = 'reCAPTCHA expired. Please verify again.';
          },
          'error-callback': () => {
            this.recaptchaToken = '';
            this.recaptchaError = 'reCAPTCHA failed to load. Refresh and retry.';
          },
        });
        this.recaptchaRendered = true;
        this.clearRecaptchaWatchdog();
      } catch (e) {
        const reason = e instanceof Error ? e.message : 'Unknown render error';
        this.recaptchaError = `reCAPTCHA render failed: ${reason}`;
      }
      this.cdr.detectChanges();
    });
  }

  private startRecaptchaWatchdog(): void {
    this.clearRecaptchaWatchdog();
    this.recaptchaWatchdogId = window.setTimeout(() => {
      if (this.recaptchaRendered || !this.recaptchaEnabled) return;
      if (!window.grecaptcha && !this.recaptchaFallbackTried) {
        this.recaptchaFallbackTried = true;
        this.recaptchaError = 'reCAPTCHA is slow to load from google.com; retrying via recaptcha.net...';
        this.cdr.detectChanges();
        this.loadRecaptchaScript(
          'recaptcha-net-script',
          'https://www.recaptcha.net/recaptcha/api.js?onload=__onMemberRecaptchaLoaded&render=explicit',
        );
        return;
      }
      this.recaptchaError =
        'reCAPTCHA is still loading. If it never appears, allow google.com/gstatic.com or verify localhost is in authorized domains.';
      this.cdr.detectChanges();
    }, 12000);
  }

  private clearRecaptchaWatchdog(): void {
    if (this.recaptchaWatchdogId == null) return;
    window.clearTimeout(this.recaptchaWatchdogId);
    this.recaptchaWatchdogId = null;
  }

  get isRecaptchaBlocking(): boolean {
    // In local dev, captcha frequently fails to render for localhost/domain-key reasons.
    // Keep production strict, but do not block sign-in during development.
    if (!environment.production) return false;
    return this.recaptchaEnabled;
  }

  signIn(): void {
    this.errorMessage = null;
    const captchaToken = this.recaptchaToken;
    if (this.looksLikeJwt(captchaToken)) {
      this.errorMessage = 'Invalid captcha token format. Please solve reCAPTCHA on this page again.';
      return;
    }
    if (this.isRecaptchaBlocking && !captchaToken) {
      this.errorMessage = 'Please complete reCAPTCHA before signing in.';
      return;
    }
    this.busy = true;
    const uiFailSafe = window.setTimeout(() => {
      if (!this.busy) return;
      this.busy = false;
      this.errorMessage = 'Sign-in is taking too long. Please check backend connectivity and try again.';
      this.cdr.detectChanges();
    }, 20000);
    this.auth.login(this.username, this.password, captchaToken || undefined).subscribe({
      next: () => {
        window.clearTimeout(uiFailSafe);
        this.busy = false;
        this.tokenInfoMessage = 'JWT token received and stored.';
        this.cdr.detectChanges();
        this.router.navigate(['/app']);
      },
      error: (e) => {
        window.clearTimeout(uiFailSafe);
        this.busy = false;
        const message = e?.error?.message ?? e?.message ?? 'Sign-in failed.';
        this.errorMessage = this.recaptchaEnabled && environment.production
          ? `${message} Complete reCAPTCHA and try again.`
          : message;
        if (this.recaptchaWidgetId != null && window.grecaptcha) {
          window.grecaptcha.reset(this.recaptchaWidgetId);
          this.recaptchaToken = '';
        }
        this.cdr.detectChanges();
      },
    });
  }

  private looksLikeJwt(value: string): boolean {
    if (!value) return false;
    // JWTs are typically three base64url segments separated by dots.
    return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value);
  }

  get accessTokenPreview(): string {
    const token = this.auth.getAccessToken();
    if (!token) return '';
    return token.length > 40 ? `${token.slice(0, 20)}...${token.slice(-20)}` : token;
  }

  copyToken(kind: 'recaptcha' | 'jwt'): void {
    const value = kind === 'recaptcha' ? this.recaptchaToken : (this.auth.getAccessToken() ?? '');
    if (!value) return;
    navigator.clipboard?.writeText(value);
    this.tokenInfoMessage = `${kind === 'recaptcha' ? 'reCAPTCHA' : 'JWT'} token copied.`;
    setTimeout(() => {
      this.tokenInfoMessage = null;
    }, 1500);
  }
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  standalone: false,
})
export class ForgotPasswordComponent {
  @ViewChildren('codeInput') codeInputs?: QueryList<ElementRef<HTMLInputElement>>;

  step = 1;
  email = '';
  codeDigits = ['', '', '', '', '', ''];
  password = '';
  confirmPassword = '';
  busy = false;
  infoMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private readonly router: Router) {}

  get codeValue(): string {
    return this.codeDigits.join('');
  }

  get canReset(): boolean {
    return this.password.length >= 8 && this.password === this.confirmPassword;
  }

  sendCode(): void {
    if (!this.email.trim() || this.busy) return;
    this.busy = true;
    this.errorMessage = null;
    this.infoMessage = null;
    setTimeout(() => {
      this.busy = false;
      this.step = 2;
      this.infoMessage = 'Verification code sent. (Demo code: 123456)';
      setTimeout(() => this.codeInputs?.first?.nativeElement.focus(), 0);
    }, 600);
  }

  onCodeInput(index: number, raw: string): void {
    const value = (raw || '').replace(/\D/g, '').slice(-1);
    this.codeDigits[index] = value;
    if (value && index < 5) {
      this.codeInputs?.get(index + 1)?.nativeElement.focus();
    }
  }

  onCodeKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.codeDigits[index] && index > 0) {
      this.codeInputs?.get(index - 1)?.nativeElement.focus();
    }
  }

  verifyCode(): void {
    if (this.codeValue.length !== 6 || this.busy) return;
    this.busy = true;
    this.errorMessage = null;
    setTimeout(() => {
      this.busy = false;
      if (this.codeValue !== '123456') {
        this.errorMessage = 'Invalid verification code. Use 123456 for demo.';
        return;
      }
      this.step = 3;
      this.infoMessage = null;
    }, 500);
  }

  resendCode(): void {
    if (this.busy) return;
    this.infoMessage = 'A new code was sent.';
  }

  resetPassword(): void {
    if (!this.canReset || this.busy) return;
    this.busy = true;
    this.errorMessage = null;
    setTimeout(() => {
      this.busy = false;
      this.infoMessage = 'Password updated successfully. Redirecting to login...';
      setTimeout(() => this.router.navigate(['/sign-in']), 1200);
    }, 700);
  }
}

@Component({
  selector: 'app-face-login',
  templateUrl: './face-login.component.html',
  standalone: false,
})
export class FaceRecognitionLoginComponent {
  scanning = false;
  progress = 0;
  stage = 0;
  scanLineTop = 0;
  message = '';
  failed = false;
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly router: Router) {}

  stageClass(done: boolean): string {
    return done ? 'text-emerald-700 font-medium' : 'text-gray-500';
  }

  startScan(): void {
    if (this.scanning) return;
    this.failed = false;
    this.message = '';
    this.scanning = true;
    this.progress = 0;
    this.stage = 0;
    this.scanLineTop = 0;
    this.timer = setInterval(() => {
      this.progress = Math.min(this.progress + 4, 100);
      this.scanLineTop = (this.scanLineTop + 4) % 100;
      if (this.progress >= 20) this.stage = 1;
      if (this.progress >= 55) this.stage = 2;
      if (this.progress >= 90) this.stage = 3;
      if (this.progress >= 100) {
        this.finishScan(true);
      }
    }, 100);
  }

  retry(): void {
    this.startScan();
  }

  private finishScan(success: boolean): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.scanning = false;
    if (!success) {
      this.failed = true;
      this.message = 'Face recognition failed. Please retry in better lighting.';
      return;
    }
    this.message = 'Identity verified. Signing you in...';
    setTimeout(() => this.router.navigate(['/app']), 800);
  }
}
