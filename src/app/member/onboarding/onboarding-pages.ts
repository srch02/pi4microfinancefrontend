import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { API_CONFIG } from '../../config/api.config';
import { AuthService } from '../../services/auth.service';
import { MemberService } from '../../services/member.service';
import { MedicalHistoryFormData, PaymentMethod, PlanOption } from '../models/member.models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  standalone: false,
})
export class WelcomeComponent {}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html', standalone: false })
export class HomeComponent {}

@Component({
  selector: 'app-cin-verification',
  templateUrl: './cin-verification.component.html',
  standalone: false,
})
export class CinVerificationComponent {
  verifying = false;
  error = '';
  cinNumber = '';
  dragActive = false;
  simulateVerification(): void {
    this.verifying = true;
    this.error = '';
    setTimeout(() => {
      this.cinNumber = '12345678901234';
      if (Math.random() < 0.1) {
        this.error = 'You are already registered with this national ID.';
        this.verifying = false;
      } else {
        this.verifying = false;
        setTimeout(() => {
          window.location.href = '/medical-history';
        }, 1500);
      }
    }, 2000);
  }

  onDrag(state: boolean): void {
    this.dragActive = state;
  }
}

@Component({
  selector: 'app-medical-history',
  templateUrl: './medical-history.component.html',
  standalone: false,
})
export class MedicalHistoryComponent {
  formData: MedicalHistoryFormData = {
    currentConditions: [],
    familyHistory: [],
    ongoingTreatments: '',
    consultationFrequency: 'never',
  };
  currentConditions = ['Recurrent flu', 'Seasonal allergies', 'Mild asthma', 'Hypertension', 'Diabetes', 'Heart disease', 'None of the above'];
  familyConditions = ['Diabetes (parents/siblings)', 'Heart disease (parents/siblings)', 'Cancer (parents/siblings)', 'Hypertension (parents/siblings)', 'None'];

  constructor(private readonly router: Router) {}

  toggleCondition(condition: string, field: 'currentConditions' | 'familyHistory'): void {
    const current = this.formData[field];
    this.formData = {
      ...this.formData,
      [field]: current.includes(condition) ? current.filter((c) => c !== condition) : [...current, condition],
    };
  }

  handleSubmit(): void {
    const hasExcluded = this.formData.currentConditions.some((condition) => condition === 'Heart disease' || condition === 'Diabetes');
    this.router.navigate([hasExcluded ? '/excluded' : '/calculating']);
  }
}

@Component({
  selector: 'app-excluded-conditions',
  templateUrl: './excluded-conditions.component.html',
  standalone: false,
})
export class ExcludedConditionsComponent {}

@Component({
  selector: 'app-price-calculation',
  templateUrl: './price-calculation.component.html',
  standalone: false
})
export class PriceCalculationComponent implements OnInit {
  constructor(private readonly router: Router) {}
  ngOnInit(): void {
    setTimeout(() => this.router.navigate(['/select-plan']), 2500);
  }
}

@Component({
  selector: 'app-plan-selection',
  templateUrl: './plan-selection.component.html',
  standalone: false
})
export class PlanSelectionComponent {
  basePrice = 17;
  selectedPlan: string | null = null;
  plans: PlanOption[] = [
    { id: 'basic', name: 'BASIC', price: 17, adjustment: 0, icon: 'shield', color: 'indigo', features: ['Essential medical consultations', 'Basic medication coverage', 'Emergency care included', 'Access to partner doctors', '70% of premium to solidarity pool'] },
    { id: 'comfort', name: 'COMFORT', price: 23, adjustment: 35, icon: 'star', color: 'blue', popular: true, features: ['All BASIC benefits', 'Dental emergency coverage', 'Lab test discounts (30%)', 'Priority telemedicine', 'Extended medication list'] },
    { id: 'premium', name: 'PREMIUM', price: 27, adjustment: 60, icon: 'zap', color: 'purple', features: ['All COMFORT benefits', 'Unlimited telemedicine', 'Specialist consultations', 'Advanced diagnostics', 'Premium pharmacy network'] },
  ];

  constructor(private readonly router: Router) {}

  get selectedPlanName(): string {
    return this.plans.find((p) => p.id === this.selectedPlan)?.name ?? '';
  }

  getColorClasses(color: string): string {
    if (color === 'blue') return 'border-blue-600 bg-blue-50';
    if (color === 'purple') return 'border-purple-600 bg-purple-50';
    return 'border-indigo-600 bg-indigo-50';
  }

  continueWithPlan(): void {
    if (!this.selectedPlan) return;
    this.router.navigate(['/waiting-approval']);
  }
}

@Component({
  selector: 'app-waiting-approval',
  templateUrl: './waiting-approval.component.html',
  standalone: false,
})
export class WaitingApprovalComponent {}

@Component({
  selector: 'app-member-profile-onboarding',
  templateUrl: './member-profile-onboarding.component.html',
  standalone: false,
})
export class MemberProfileOnboardingComponent {
  profile = {
    cinNumber: '',
    age: '' as string | number,
    profession: '',
    region: '',
    email: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    altPhone: '',
  };

  creating = false;
  error: string | null = null;

  constructor(
    private readonly router: Router,
    private readonly api: MemberService,
  ) {}

  private resolveMemberId(payload: unknown): number | null {
    const read = (value: unknown): number | null => {
      if (value == null) return null;
      const n = Number(value);
      return Number.isFinite(n) && n > 0 ? n : null;
    };

    const asAny = payload as any;
    // Common Spring response shapes:
    // 1) { memberId: 123, ... }
    // 2) { data: { memberId: 123, ... } }
    // 3) { member: { memberId: 123, ... } }
    return (
      read(asAny?.memberId) ??
      read(asAny?.id) ??
      read(asAny?.data?.memberId) ??
      read(asAny?.data?.id) ??
      read(asAny?.member?.memberId) ??
      read(asAny?.member?.id) ??
      null
    );
  }

  private continueUsingCinLookup(cinNumber: string): void {
    this.api.getAllMembers().subscribe({
      next: (members) => {
        const normalizedCin = cinNumber.trim();
        const match = (members ?? []).find((m) => String(m?.cinNumber ?? '').trim() === normalizedCin);
        const memberId = this.resolveMemberId(match);
        this.creating = false;
        if (!memberId) {
          this.error = 'Member was created but could not be found for this CIN. Please retry or refresh.';
          return;
        }
        this.router.navigate(['/browse-groups'], { queryParams: { memberId } });
      },
      error: () => {
        this.creating = false;
        this.error = 'Member seems created, but lookup failed. Please retry once.';
      },
    });
  }

  continueToGroupSelection(): void {
    if (this.creating) return;
    this.error = null;

    const cinNumber = String(this.profile.cinNumber ?? '').trim();
    if (!cinNumber) {
      this.error = 'CIN number is required to create a member.';
      return;
    }

    const ageNum =
      this.profile.age === '' || this.profile.age == null ? null : Number(this.profile.age);
    const age = ageNum == null || Number.isNaN(ageNum) ? null : ageNum;

    this.creating = true;
    this.api.createMember({
      cinNumber,
      age,
      profession: this.profile.profession?.trim() || null,
      region: this.profile.region?.trim() || null,
      email: this.profile.email?.trim() || null,
    }).subscribe({
      next: (member) => {
        this.creating = false;
        const memberId = this.resolveMemberId(member);
        if (!memberId) {
          this.creating = true;
          this.continueUsingCinLookup(cinNumber);
          return;
        }
        // Keep registration flow public; guarded member-app requires an authenticated session.
        this.router.navigate(['/browse-groups'], { queryParams: { memberId } });
      },
      error: (e) => {
        const status = e?.status;
        // Some Spring setups create the row but return non-JSON/empty response, which Angular treats as error.
        if (status === 200 || (status === 500 && /json|parse|Unexpected end/i.test(String(e?.message ?? '')))) {
          this.creating = true;
          this.continueUsingCinLookup(cinNumber);
          return;
        }
        // In some environments POST /api/members is protected, but the record may already exist.
        // Attempt lookup by CIN before blocking the user.
        if (status === 401) {
          this.creating = true;
          this.api.getAllMembers().subscribe({
            next: (members) => {
              const normalizedCin = cinNumber.trim();
              const match = (members ?? []).find((m) => String(m?.cinNumber ?? '').trim() === normalizedCin);
              const memberId = this.resolveMemberId(match);
              this.creating = false;
              if (memberId) {
                this.router.navigate(['/browse-groups'], { queryParams: { memberId } });
                return;
              }
              this.error =
                'POST /api/members is unauthorized in your backend. Please allow this endpoint in dev security config, or sign in before creating member.';
            },
            error: () => {
              this.creating = false;
              // Do not hard-block the user when backend security is strict.
              // Continue to group page in preview mode.
              this.router.navigate(['/browse-groups'], {
                queryParams: {
                  preview: 1,
                  cinNumber,
                },
              });
            },
          });
          return;
        }
        this.creating = false;
        if (status === 0) {
          this.error = 'Request blocked or no response (often CORS or backend not running). Check Spring is on http://localhost:8080 and CORS allows http://localhost:4200.';
          return;
        }
        this.error = e?.error?.message ?? e?.message ?? 'Could not create member. Is Spring running?';
      },
    });
  }
}

@Component({
  selector: 'app-first-payment',
  templateUrl: './first-payment.component.html',
  standalone: false,
})
export class FirstPaymentComponent implements OnInit {
  selectedMethod: string | null = null;
  processing = false;
  paymentComplete = false;
  paymentError: string | null = null;
  /** From query ?membershipId= or {@link API_CONFIG.devMembershipId} */
  membershipId: number | null = null;
  readonly planPrice = 23;
  readonly planName = 'COMFORT';

  paymentMethods: PaymentMethod[] = [
    { id: 'd17', name: 'D17 Mobile Money', description: 'Instant payment via D17', color: 'orange' },
    { id: 'ooredoo', name: 'Ooredoo Money', description: 'Pay with Ooredoo Money', color: 'red' },
    { id: 'bank', name: 'Bank Transfer', description: '2-3 business days', color: 'blue' },
    { id: 'cash', name: 'Cash Deposit', description: 'At authorized agents', color: 'emerald' },
  ];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly memberService: MemberService,
    private readonly auth: AuthService,
  ) {}

  ngOnInit(): void {
    const raw = this.route.snapshot.queryParamMap.get('membershipId');
    if (raw) {
      const n = Number(raw);
      if (!Number.isNaN(n)) {
        this.membershipId = n;
      }
    }
    if (this.membershipId == null && API_CONFIG.devMembershipId != null) {
      this.membershipId = API_CONFIG.devMembershipId;
    }
  }

completePayment(): void {
  if (!this.selectedMethod || this.processing) return;

  this.paymentError = null;
  const membershipId = this.membershipId ?? API_CONFIG.devMembershipId;

  if (membershipId == null && !this.auth.isAuthenticated()) {
    if (!environment.production) {
      console.warn('Dev mode: no membership yet, skipping payment API call.');
      this.paymentComplete = true;

      setTimeout(() => {
        this.router.navigate(['/create-account']);
      }, 1000);

      return;
    }

    this.paymentError =
      'Add ?membershipId=<id> to the URL, set devMembershipId in environment.ts, or sign in so the API can resolve your pending membership.';
    return;
  }

  this.processing = true;
  this.memberService.submitPayment(this.selectedMethod, membershipId ?? undefined).subscribe({
    next: () => {
      this.processing = false;
      this.paymentComplete = true;
      setTimeout(() => {
        this.router.navigate(['/create-account']);
      }, 2000);
    },
    error: () => {
      this.processing = false;
      this.paymentError =
        'Could not reach the API. Start Spring Boot on port 8080 and ensure membershipId is valid (pending membership).';
    },
  });
}
}

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  standalone: false
})
export class CreateAccountComponent {
  showPassword = false;
  showConfirmPassword = false;
  recaptchaVerified = false;
  busy = false;
  errorMessage: string | null = null;
  
  formData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  passwordValidation = {
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecial: false,
  };

  constructor(
    private readonly router: Router,
    private readonly auth: AuthService,
  ) {}

  goBack() {
    window.history.back();
  }

  handlePasswordChange(password: string) {
    this.formData.password = password;
    this.passwordValidation = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }

  handleRecaptchaClick() {
    setTimeout(() => {
      this.recaptchaVerified = true;
    }, 1000);
  }

  isPasswordValid(): boolean {
    return Object.values(this.passwordValidation).every(v => v === true);
  }

  passwordsMatch(): boolean {
    return this.formData.password === this.formData.confirmPassword && this.formData.confirmPassword !== '';
  }

  canSubmit(): boolean {
    return this.recaptchaVerified && 
           this.isPasswordValid() && 
           this.passwordsMatch() && 
           !!this.formData.username && 
           !!this.formData.email;
  }

  handleSubmit(): void {
    if (!this.canSubmit() || this.busy) return;
    this.errorMessage = null;
    this.busy = true;

    const payload = {
      username: this.formData.username.trim(),
      email: this.formData.email.trim(),
      password: this.formData.password,
    };

    this.auth.createAccount(payload).subscribe({
      next: () => {
        // Most backends keep register/login separate; sign in immediately after successful registration.
        this.auth.login(payload.username, payload.password).subscribe({
          next: () => {
            this.busy = false;
            this.router.navigate(['/app']);
          },
          error: (e) => {
            this.busy = false;
            this.errorMessage =
              e?.error?.message ??
              e?.message ??
              'Account created, but automatic sign-in failed. Please log in from the sign-in page.';
            setTimeout(() => {
              this.router.navigate(['/sign-in']);
            }, 1200);
          },
        });
      },
      error: (e) => {
        this.busy = false;
        this.errorMessage =
          e?.error?.message ??
          e?.message ??
          'Could not create account. Check backend connectivity and try again.';
      },
    });
  }
}
