import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnDestroy, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

declare global {
  interface Window {
    __onMemberPortalRecaptchaLoaded?: () => void;
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

export type MemberPortalView = 'home' | 'signin' | 'register';

@Component({
  selector: 'app-member-portal',
  templateUrl: './member-portal.component.html',
  standalone: false
})
export class MemberPortalComponent implements AfterViewInit, OnDestroy {
  @Output() onBack = new EventEmitter<void>();
  @ViewChild('recaptchaContainer') recaptchaContainer?: ElementRef<HTMLDivElement>;

  view: MemberPortalView = 'home';
  busy = false;
  errorMessage = '';
  
  // reCAPTCHA state
  recaptchaToken = '';
  recaptchaEnabled = false;
  recaptchaSiteKey = '';
  recaptchaError: string | null = null;
  private recaptchaWidgetId: number | null = null;
  private recaptchaScriptEl?: HTMLScriptElement;
  private viewReady = false;
  recaptchaRendered = false;
  private recaptchaRendering = false;
  private recaptchaWatchdogId: number | null = null;
  private recaptchaFallbackTried = false;

  // Sign-in fields
  username = '';
  password = '';

  // Register fields (forwarded to /verify-cin flow)
  name = '';
  cin = '';
  email = '';
  phone = '';
  address = '';
  regPassword = '';

  features = [
    { title: 'Affordable Protection', description: 'Starting at 10 DT/month', icon: 'shield' },
    { title: 'Solidarity Groups', description: 'Pool resources with your community', icon: 'users' },
    { title: 'Fair Pricing', description: 'Personalized to your health profile', icon: 'trending' },
  ];
  
  get isRecaptchaBlocking(): boolean {
    // In local dev, captcha frequently fails to render for localhost/domain-key reasons.
    // Keep production strict, but do not block sign-in during development.
    if (!environment.production) return false;
    return this.recaptchaEnabled;
  }

  constructor(
    private router: Router, 
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.authService.getRecaptchaConfig().subscribe({
      next: (cfg) => {
        this.recaptchaEnabled = !!cfg?.enabled;
        this.recaptchaSiteKey = (cfg?.siteKey ?? '').trim();
        
        // Force a change detection cycle to ensure *ngIf="recaptchaEnabled" 
        // renders the container before we try to use it.
        this.cdr.detectChanges();

        if (this.recaptchaEnabled) {
          if (this.recaptchaSiteKey) {
            this.ensureRecaptchaScript();
            this.tryRenderRecaptcha();
          } else {
            this.recaptchaError = 'reCAPTCHA is enabled but site key is missing.';
            this.cdr.detectChanges();
          }
        }
      },
      error: () => {
        this.recaptchaEnabled = false;
        this.cdr.detectChanges();
      },
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.tryRenderRecaptcha();
  }

  ngOnDestroy(): void {
    this.clearRecaptchaWatchdog();
    if (this.recaptchaScriptEl?.parentNode) {
      this.recaptchaScriptEl.parentNode.removeChild(this.recaptchaScriptEl);
    }
    delete window.__onMemberPortalRecaptchaLoaded;
  }

  goBack() {
    if (this.view !== 'home') {
      this.view = 'home';
      this.errorMessage = '';
      this.recaptchaWidgetId = null; // Force re-render when returning to sign-in
    } else {
      this.onBack.emit();
    }
  }

  onViewChange(newView: MemberPortalView) {
    this.view = newView;
    this.cdr.detectChanges(); // Ensure *ngIf reflects immediately
    if (newView === 'signin') {
      // Small delay to allow ViewChild to link the new container
      setTimeout(() => {
        this.tryRenderRecaptcha();
        this.cdr.detectChanges();
      }, 150);
    }
  }

  signIn() {
    if (!this.username || !this.password) return;
    if (this.isRecaptchaBlocking && !this.recaptchaToken) {
      this.errorMessage = 'Please complete reCAPTCHA before signing in.';
      return;
    }
    this.busy = true;
    this.errorMessage = '';
    this.authService.login(this.username, this.password, this.recaptchaToken || undefined).subscribe({
      next: (response) => {
        const role = response.role?.toUpperCase();
        if (role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/app']);
        }
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.message || err?.message || 'Invalid credentials. Please try again.';
        this.busy = false;
        if (this.recaptchaWidgetId != null && window.grecaptcha) {
          window.grecaptcha.reset(this.recaptchaWidgetId);
          this.recaptchaToken = '';
        }
      }
    });
  }

  private ensureRecaptchaScript(): void {
    this.startRecaptchaWatchdog();
    window.__onMemberPortalRecaptchaLoaded = () => {
      this.tryRenderRecaptcha();
    };
    if (this.document.getElementById('google-recaptcha-script')) return;
    this.loadRecaptchaScript(
      'google-recaptcha-script',
      'https://www.google.com/recaptcha/api.js?onload=__onMemberPortalRecaptchaLoaded&render=explicit',
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
          'google-recaptcha-script',
          'https://www.recaptcha.net/recaptcha/api.js?onload=__onMemberPortalRecaptchaLoaded&render=explicit',
        );
        return;
      }
      this.recaptchaError = 'Failed to load reCAPTCHA script.';
      this.cdr.detectChanges();
    };
    this.document.head.appendChild(script);
    this.recaptchaScriptEl = script;
  }

  private tryRenderRecaptcha(): void {
    if (!this.viewReady || !this.recaptchaEnabled || this.view !== 'signin') return;

    if (!this.recaptchaSiteKey) {
      this.recaptchaError = 'reCAPTCHA site key is missing.';
      this.cdr.detectChanges();
      return;
    }
    
    // Explicitly check for container in DOM if ViewChild is not yet populated
    let container: HTMLElement | null | undefined = this.recaptchaContainer?.nativeElement;
    if (!container) {
      container = this.document.querySelector('.recaptcha-target') as HTMLElement;
    }

    if (!container || this.recaptchaWidgetId != null || this.recaptchaRendering) return;
    
    const recaptcha = window.grecaptcha;
    if (!recaptcha) {
      // Script is likely still loading; onload will call this again
      return;
    }

    this.recaptchaRendering = true;
    recaptcha.ready(() => {
      // Re-verify container existence inside ready callback
      const currentTarget = this.recaptchaContainer?.nativeElement || 
                            (this.document.querySelector('.recaptcha-target') as HTMLElement);
                     
      if (!currentTarget || this.recaptchaWidgetId != null) {
        this.recaptchaRendering = false;
        return;
      }
      
      try {
        // Optional: clear container to ensure Google doesn't complain about existing content
        currentTarget.innerHTML = ''; 
        
        this.recaptchaWidgetId = recaptcha.render(currentTarget, {
          sitekey: this.recaptchaSiteKey,
          callback: (token: string) => {
            this.recaptchaToken = token;
            this.recaptchaError = null;
            this.cdr.detectChanges();
          },
          'expired-callback': () => {
            this.recaptchaToken = '';
            this.recaptchaError = 'reCAPTCHA expired. Please verify again.';
            this.cdr.detectChanges();
          },
          'error-callback': () => {
            this.recaptchaToken = '';
            this.recaptchaError = 'reCAPTCHA failed to load. Refresh and retry.';
            this.cdr.detectChanges();
          },
        });
        this.recaptchaRendered = true;
        this.clearRecaptchaWatchdog();
      } catch (e) {
        console.error('reCAPTCHA render error:', e);
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.includes('already been rendered')) {
           this.recaptchaRendered = true;
           this.recaptchaError = null;
        } else {
           this.recaptchaError = `reCAPTCHA render failed: ${msg}. Check site key and domain.`;
        }
      } finally {
        this.recaptchaRendering = false;
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
        this.loadRecaptchaScript(
          'recaptcha-net-script-portal',
          'https://www.recaptcha.net/recaptcha/api.js?onload=__onMemberPortalRecaptchaLoaded&render=explicit',
        );
      }
    }, 10000);
  }

  private clearRecaptchaWatchdog(): void {
    if (this.recaptchaWatchdogId == null) return;
    window.clearTimeout(this.recaptchaWatchdogId);
    this.recaptchaWatchdogId = null;
  }

  register() {
    // Forward to the existing CIN-based onboarding flow
    this.router.navigate(['/verify-cin']);
  }
}
