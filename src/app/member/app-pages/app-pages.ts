import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Badge,
  ClaimFormData,
  ClaimHistoryItem,
  Doctor,
  GroupDto,
  GroupDashboardData,
  PackageType,
  PaymentHistoryItem,
  RecentActivityItem,
} from '../models/member.models';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-groups-dashboard',
  templateUrl: './groups-dashboard.component.html',
  standalone: false,
})
export class GroupsDashboardComponent {
  groupData: GroupDashboardData = {
    name: 'Alpha-12 Solidarity Group',
    type: 'Family',
    memberCount: 45,
    poolBalance: 18500,
    adherenceScore: 92,
    nextPaymentDue: '2024-03-01',
    nextPaymentAmount: 23,
  };

  recentActivity: RecentActivityItem[] = [
    { id: 1, type: 'payment', user: 'You', desc: 'Contribution received', amount: 23, date: '2024-02-01' },
    { id: 2, type: 'claim', user: 'Marie D.', desc: 'Claim approved', amount: -85, date: '2024-01-28' },
    { id: 3, type: 'payment', user: 'Group', desc: 'Pool contribution', amount: 1035, date: '2024-02-01' },
  ];

  get poolPercentage(): number {
    return (this.groupData.poolBalance / 20000) * 100;
  }
}

@Component({
  selector: 'app-submit-claim',
  templateUrl: './submit-claim.component.html',
  standalone: false,
})
export class SubmitClaimComponent {
  step = 1;
  score = 78;
  steps = [1, 2, 3];
  formData: ClaimFormData = { expenseType: '', amount: '', description: '' };
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}
  submitClaim(): void {
    this.router.navigate(['claims-history'], { relativeTo: this.route.parent });
  }
}

@Component({
  selector: 'app-claims-history',
  templateUrl: './claims-history.component.html',
  standalone: false,
})
export class ClaimsHistoryComponent {
  claims: ClaimHistoryItem[] = [
    { id: 'C-001', type: 'Consultation', amount: 45, status: 'approved', score: 92, date: '2024-02-01' },
    { id: 'C-002', type: 'Medication', amount: 65, status: 'pending', score: 78, date: '2024-02-10' },
  ];
}

@Component({
  selector: 'app-rewards-challenge',
  templateUrl: './rewards-challenge.component.html', standalone: false})
export class RewardsChallengeComponent {
  badges: Badge[] = [
    { name: '12 Payments', desc: '5% discount earned', icon: '🏅', unlocked: true },
    { name: 'Perfect Year', desc: 'No missed payments', icon: '⭐', unlocked: false },
    { name: 'Health Champion', desc: '10k steps daily', icon: '🏃', unlocked: true },
  ];
}

@Component({
  selector: 'app-doctor-directory',
  templateUrl: './doctor-directory.component.html',
  standalone: false,
})
export class DoctorDirectoryComponent {
  doctors: Doctor[] = [
    { initial: 'D', name: 'Dr. Mamadou Diop', specialty: 'General Medicine', fee: 45, available: true },
    { initial: 'N', name: 'Dr. Aissatou Ndiaye', specialty: 'Pediatrics', fee: 50, available: false },
    { initial: 'S', name: 'Dr. Omar Seck', specialty: 'Cardiology', fee: 75, available: true },
  ];
}

@Component({
  selector: 'app-pharmacy-qr',
  templateUrl: './pharmacy-qr.component.html', standalone: false})
export class PharmacyQrComponent {}
@Component({
  selector: 'app-browse-groups',
  templateUrl: './browse-groups.component.html',
  standalone: false,
})
export class BrowseGroupsComponent implements OnInit {
  inviteCode = '';
  selectedPackage: PackageType = 'CONFORT';
  loading = false;
  joining = false;
  showQRScanner = false;
  scanningQR = false;
  scannedInviteCode: string | null = null;
  selectedGroupId: number | null = null;
  error: string | null = null;
  joinSuccess: string | null = null;
  /** True only when ?preview=1 or no memberId — demo data / cannot join via API */
  previewMode = false;
  private forcedPreview = false;
  groups: GroupDto[] = [];
  fallbackGroups = [
    {
      groupId: 101,
      name: 'Dakar Young Professionals',
      type: 'Professional',
      currentMemberCount: 42,
      region: 'Dakar, Senegal',
      poolBalance: 16800,
      acceptanceCriteria: 'Working professionals, Age 22-40, Dakar area',
      trustScore: 92,
      monthlyContributions: 23,
      claimApprovalRate: 94,
      matchScore: 95,
      joinPolicy: 'public',
    },
    {
      groupId: 102,
      name: 'Family Health Circle - Plateau',
      type: 'Family',
      currentMemberCount: 51,
      region: 'Plateau, Dakar',
      poolBalance: 19500,
      acceptanceCriteria: 'Families with children, Plateau district',
      trustScore: 88,
      monthlyContributions: 23,
      claimApprovalRate: 91,
      matchScore: 87,
      joinPolicy: 'public',
    },
  ];
  private memberId: number | null = null;

  /** Exposed for template (package picker, live list) */
  get hasMemberContext(): boolean {
    return this.memberId != null;
  }

  constructor(
    private readonly api: MemberService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.forcedPreview = this.route.snapshot.queryParamMap.get('preview') === '1';
    const raw = this.route.snapshot.queryParamMap.get('memberId');
    if (raw) {
      const n = Number(raw);
      if (!Number.isNaN(n)) this.memberId = n;
    }
    this.syncPreviewFlag();
    if (this.memberId == null) {
      this.loading = false;
      return;
    }
    this.loadGroups();
  }

  private syncPreviewFlag(): void {
    this.previewMode = this.forcedPreview || this.memberId == null;
  }

  /** Stable pseudo-metrics when API returns only core GroupDto fields */
  private seed(g: GroupDto): number {
    return Math.abs((Number(g.groupId) * 7919) % 9973);
  }

  displayMatchScore(g: GroupDto): number {
    if (g.matchScore != null && !Number.isNaN(Number(g.matchScore))) return Number(g.matchScore);
    return 70 + (this.seed(g) % 26);
  }

  displayPoolBalance(g: GroupDto): number {
    if (g.poolBalance != null && !Number.isNaN(Number(g.poolBalance))) return Number(g.poolBalance);
    return 8000 + (this.seed(g) % 22000);
  }

  displayTrustScore(g: GroupDto): number {
    if (g.trustScore != null && !Number.isNaN(Number(g.trustScore))) return Number(g.trustScore);
    return 82 + (this.seed(g) % 15);
  }

  displayMonthlyPremium(g: GroupDto): number {
    if (g.monthlyContributions != null && !Number.isNaN(Number(g.monthlyContributions))) {
      return Number(g.monthlyContributions);
    }
    return 17 + (this.seed(g) % 12);
  }

  displayApprovalRate(g: GroupDto): number {
    if (g.claimApprovalRate != null && !Number.isNaN(Number(g.claimApprovalRate))) {
      return Number(g.claimApprovalRate);
    }
    return 88 + (this.seed(g) % 10);
  }

  displayCriteria(g: GroupDto): string {
    if (g.acceptanceCriteria?.trim()) return g.acceptanceCriteria.trim();
    const parts: string[] = [];
    if (g.type) parts.push(`Type: ${g.type}`);
    if (g.region) parts.push(`Region: ${g.region}`);
    if (g.minMembers != null || g.maxMembers != null) {
      parts.push(`Size: ${g.minMembers ?? '—'}–${g.maxMembers ?? '—'} members`);
    }
    const policy = (g.joinPolicy ?? 'public').toString().toLowerCase();
    parts.push(policy === 'private' ? 'Private — invite / QR only' : 'Open to join');
    return parts.length ? parts.join(' · ') : 'Based on your profile and selected package.';
  }

  refreshSuggestions(): void {
    if (this.memberId == null) {
      this.syncPreviewFlag();
      this.loading = false;
      return;
    }
    this.loadGroups();
  }

  private loadGroups(): void {
    if (this.memberId == null) return;
    this.loading = true;
    this.error = null;
    this.api.getGroupSuggestions(this.memberId).subscribe({
      next: (suggested) => {
        const list = suggested ?? [];
        if (list.length > 0) {
          this.groups = list;
          this.finishLoadOk();
          return;
        }
        this.loadAllGroupsAsFallback();
      },
      error: () => {
        this.loadAllGroupsAsFallback();
      },
    });
  }

  private loadAllGroupsAsFallback(): void {
    this.api.listAllGroups().subscribe({
      next: (all) => {
        this.groups = all ?? [];
        this.finishLoadOk();
        if (this.groups.length === 0) {
          this.error = 'No groups are available yet. Create groups in the backend or try again later.';
        }
      },
      error: (e) => {
        this.loading = false;
        this.groups = [];
        const msg =
          typeof e?.error === 'string'
            ? e.error
            : e?.error?.message ?? e?.message ?? 'Could not load groups.';
        this.error = msg;
      },
    });
  }

  private finishLoadOk(): void {
    this.loading = false;
    this.syncPreviewFlag();
  }

  get displayGroups(): GroupDto[] {
    if (this.previewMode && this.memberId == null) {
      return this.fallbackGroups as unknown as GroupDto[];
    }
    return this.groups;
  }

  chooseGroup(group: GroupDto): void {
    this.selectedGroupId = Number(group?.groupId ?? 0) || null;
  }

  continueWithSelectedGroup(): void {
    const selected = this.displayGroups.find((g) => Number(g.groupId) === this.selectedGroupId);
    if (!selected) return;
    if (this.previewMode || this.memberId == null) {
      this.joinSuccess = `Selected "${selected.name}" (preview — add memberId to join for real).`;
      return;
    }
    this.joinSuggested(selected);
  }

  joinSuggested(group: GroupDto): void {
    if (!group?.groupId || this.joining) return;
    if (this.memberId == null) {
      this.error = 'Cannot join yet: missing memberId. Backend must allow member onboarding endpoints.';
      return;
    }
    if ((group.joinPolicy ?? 'public') === 'private') {
      this.error = 'This group is private. Join using the invite code (QR).';
      return;
    }
    this.joining = true;
    this.error = null;
    this.joinSuccess = null;
    this.api.joinPublicGroup(group.groupId, this.selectedPackage, this.memberId ?? undefined).subscribe({
      next: (membership) => {
        this.joining = false;
        const membershipId = membership?.membershipId;
        if (!membershipId) {
          this.error = 'Join succeeded but membershipId is missing from the API response.';
          return;
        }
        this.joinSuccess = `Joined "${group.name}". Redirecting to first payment...`;
        this.router.navigate(['/first-payment'], { queryParams: { membershipId } });
      },
      error: (e) => {
        this.joining = false;
        this.error =
          e?.error?.message ??
          e?.message ??
          'Could not join group. If you are already in another group, an admin approval may be required.';
      },
    });
  }

  joinWithInvite(): void {
    const code = this.inviteCode.trim();
    if (!code || this.joining) return;
    if (this.memberId == null) {
      this.error = 'Cannot join yet: missing memberId. Backend must allow member onboarding endpoints.';
      return;
    }
    this.joining = true;
    this.error = null;
    this.joinSuccess = null;
    this.api.joinByInvite(code, this.selectedPackage, this.memberId ?? undefined).subscribe({
      next: (membership) => {
        this.joining = false;
        const membershipId = membership?.membershipId;
        if (!membershipId) {
          this.error = 'Join succeeded but membershipId is missing from the API response.';
          return;
        }
        this.joinSuccess = 'Invite accepted. Redirecting to first payment...';
        this.router.navigate(['/first-payment'], { queryParams: { membershipId } });
      },
      error: (e) => {
        this.joining = false;
        this.error =
          e?.error?.message ??
          e?.message ??
          'Invite join failed. Check the invite code and that the group is private.';
      },
    });
  }

  openQrScanner(): void {
    if (this.joining) return;
    this.showQRScanner = true;
    this.scanningQR = true;
    this.scannedInviteCode = null;

    // Template behavior: emulate a successful scan, then prefill invite code.
    setTimeout(() => {
      this.scanningQR = false;
      this.scannedInviteCode = 'INVITE-ALPHA12';
      this.inviteCode = this.scannedInviteCode;
    }, 1800);
  }

  closeQrScanner(): void {
    this.showQRScanner = false;
    this.scanningQR = false;
    this.scannedInviteCode = null;
  }

  joinScannedPrivateGroup(): void {
    if (!this.scannedInviteCode) return;
    this.joinWithInvite();
    if (!this.error) {
      this.closeQrScanner();
    }
  }

  getJoinBadgeClasses(g: GroupDto): string {
    const policy = (g.joinPolicy ?? 'public').toString().toLowerCase();
    return policy === 'private'
      ? 'bg-amber-100 text-amber-800'
      : 'bg-emerald-100 text-emerald-800';
  }

  getJoinBadgeLabel(g: GroupDto): string {
    const policy = (g.joinPolicy ?? 'public').toString().toLowerCase();
    return policy === 'private' ? 'Private' : 'Public';
  }
}
@Component({
  selector: 'app-medication-recommendations',
  templateUrl: './medication-recommendations.component.html', standalone: false})
export class MedicationRecommendationsComponent {}
@Component({
  selector: 'app-health-tools-hub',
  templateUrl: './health-tools-hub.component.html',
  standalone: false,
})
export class HealthToolsHubComponent {
  activeTab: 'chatbot' | 'scanner' | 'doctors' = 'chatbot';
  chatDraft = '';
  chatMessages: { from: 'user' | 'ai'; text: string }[] = [];
  hubDoctors = [
    { name: 'Dr. Mamadou Diop', specialty: 'General Medicine', fee: 45 },
    { name: 'Dr. Aissatou Ndiaye', specialty: 'Pediatrics', fee: 50 },
  ];

  sendChat(): void {
    const t = this.chatDraft.trim();
    if (!t) return;
    this.chatMessages.push({ from: 'user', text: t });
    this.chatDraft = '';
    setTimeout(() => {
      this.chatMessages.push({
        from: 'ai',
        text: 'Thanks for your message. In production this would connect to your AI backend.',
      });
    }, 400);
  }
}
@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  standalone: false,
})
export class PaymentHistoryComponent {
  payments: PaymentHistoryItem[] = [
    { id: 'P-001', amount: 23, date: '2026-03-01', method: 'D17 Mobile Money', status: 'paid' },
    { id: 'P-002', amount: 23, date: '2026-04-01', method: 'Bank Transfer', status: 'pending' },
    { id: 'P-003', amount: 23, date: '2026-02-01', method: 'Ooredoo Money', status: 'paid' },
  ];
}
@Component({
  selector: 'app-telemedicine-booking',
  templateUrl: './telemedicine-booking.component.html', standalone: false})
export class TelemedicineBookingComponent {}
@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html', standalone: false})
export class VideoCallComponent {}
