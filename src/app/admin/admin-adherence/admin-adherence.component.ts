import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  AdherenceService,
  MemberAdherenceSummary,
  AdherenceEvent,
} from '../../services/adherence.service';

@Component({
  selector: 'app-admin-adherence',
  templateUrl: './admin-adherence.component.html',
  standalone: false,
})
export class AdminAdherenceComponent implements OnInit {
  members: MemberAdherenceSummary[] = [];
  selectedMember: MemberAdherenceSummary | null = null;
  memberEvents: AdherenceEvent[] = [];

  isLoading = false;
  isLoadingEvents = false;
  errorMessage = '';

  // Pagination membres
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  // Pagination events
  eventsPage = 0;
  eventsTotalPages = 0;

  // Search
  searchTerm = '';

  constructor(
    private adherenceService: AdherenceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  async loadMembers(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      const result = await this.adherenceService.getAllMembers(this.currentPage, this.pageSize);
      this.members = result.content;
      this.totalElements = result.totalElements;
      this.totalPages = result.totalPages;
    } catch (err: any) {
      this.errorMessage = err?.error?.message || 'Failed to load members.';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  async selectMember(member: MemberAdherenceSummary): Promise<void> {
    this.selectedMember = member;
    this.eventsPage = 0;
    this.memberEvents = [];
    await this.loadMemberEvents();
  }

  async loadMemberEvents(): Promise<void> {
    if (!this.selectedMember) return;
    this.isLoadingEvents = true;
    try {
      const result = await this.adherenceService.getMemberEvents(
        this.selectedMember.id,
        this.eventsPage,
        10
      );
      this.memberEvents = result.content;
      this.eventsTotalPages = result.totalPages;
    } catch (err: any) {
      this.errorMessage = err?.error?.message || 'Failed to load events.';
    } finally {
      this.isLoadingEvents = false;
      this.cdr.detectChanges();
    }
  }

  async goToPage(page: number): Promise<void> {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    await this.loadMembers();
  }

  async goToEventsPage(page: number): Promise<void> {
    if (page < 0 || page >= this.eventsTotalPages) return;
    this.eventsPage = page;
    await this.loadMemberEvents();
  }

  closeDetail(): void {
    this.selectedMember = null;
    this.memberEvents = [];
  }

  get filteredMembers(): MemberAdherenceSummary[] {
    if (!this.searchTerm.trim()) return this.members;
    const term = this.searchTerm.toLowerCase();
    return this.members.filter(
      (m) =>
        m.email?.toLowerCase().includes(term) ||
        m.cinNumber?.toLowerCase().includes(term) ||
        m.groupName?.toLowerCase().includes(term) ||
        m.region?.toLowerCase().includes(term)
    );
  }

  getScoreColor(score: number): string {
    if (score >= 75) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  }

  getScoreLabel(score: number): string {
    if (score >= 75) return 'Good';
    if (score >= 50) return 'Average';
    return 'Poor';
  }

  getScoreBarColor(score: number): string {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  getEventIcon(eventType: string): string {
    const icons: Record<string, string> = {
      CLAIM_APPROVED_BONUS: '✅',
      CLAIM_REJECTED_PENALTY: '❌',
      DOCUMENT_VERIFIED_BONUS: '📄',
      FRAUD_FLAG_PENALTY: '🚨',
      MANUAL_REVIEW_PENDING: '🔍',
      REWARD_REDEMPTION: '🎁',
      CLAIM_SUBMITTED: '📋',
      ONBOARDING_MEDICAL_BASELINE: '🏥',
      CLAIM_MILESTONE_3: '🏆',
      CLAIM_MILESTONE_5: '🏆',
      CLAIM_MILESTONE_10: '🏆',
      CLAIM_DISCOUNT_GRANTED: '💰',
    };
    return icons[eventType] ?? '📌';
  }

  getEventColor(eventType: string): string {
    const positive = ['CLAIM_APPROVED_BONUS', 'DOCUMENT_VERIFIED_BONUS', 'REWARD_REDEMPTION',
      'CLAIM_MILESTONE_3', 'CLAIM_MILESTONE_5', 'CLAIM_MILESTONE_10', 'CLAIM_DISCOUNT_GRANTED',
      'ONBOARDING_MEDICAL_BASELINE'];
    const negative = ['CLAIM_REJECTED_PENALTY', 'FRAUD_FLAG_PENALTY'];
    if (positive.includes(eventType)) return 'border-l-green-400 bg-green-50';
    if (negative.includes(eventType)) return 'border-l-red-400 bg-red-50';
    return 'border-l-yellow-400 bg-yellow-50';
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  get eventsPages(): number[] {
    return Array.from({ length: this.eventsTotalPages }, (_, i) => i);
  }

  // Stats
  get avgScore(): number {
    if (!this.members.length) return 0;
    return Math.round(this.members.reduce((s, m) => s + m.adherenceScore, 0) / this.members.length);
  }

  get goodCount(): number {
    return this.members.filter((m) => m.adherenceScore >= 75).length;
  }

  get averageCount(): number {
    return this.members.filter((m) => m.adherenceScore >= 50 && m.adherenceScore < 75).length;
  }

  get poorCount(): number {
    return this.members.filter((m) => m.adherenceScore < 50).length;
  }
}
