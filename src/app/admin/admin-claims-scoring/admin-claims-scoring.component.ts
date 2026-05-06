import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ClaimService, ClaimResponse, ClaimStatus, ClaimDocument } from '../../services/claimService';
import { AiSummaryService } from '../../services/ai-summary.service';

@Component({
  selector: 'app-admin-claims-scoring',
  templateUrl: './admin-claims-scoring.component.html',
  standalone: false
})
export class AdminClaimsScoringComponent implements OnInit {
  claims: ClaimResponse[] = [];
  selectedClaim: ClaimResponse | null = null;
  isLoading = false;
  errorMessage = '';

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  // Filter
  statusFilter: ClaimStatus | 'ALL' = 'ALL';
  statusOptions: (ClaimStatus | 'ALL')[] = [
    'ALL',
    'SUBMITTED',
    'SCORED',
    'APPROVED_AUTO',
    'MANUAL_REVIEW',
    'APPROVED_MANUAL',
    'REJECTED_LOW_SCORE',
    'REJECTED_FRAUD',
    'PAID',
    'CANCELLED',
  ];

  constructor(private claimService: ClaimService, private cdr: ChangeDetectorRef, private aiSummary: AiSummaryService) {}

  ngOnInit(): void {
    this.loadClaims();
  }

  async loadClaims(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      const result = await this.claimService.getAll({
        page: this.currentPage,
        size: this.pageSize,
        status: this.statusFilter,
      });
      this.claims = result.content;
      this.totalElements = result.totalElements;
      this.totalPages = result.totalPages;
    } catch (err: any) {
      this.errorMessage = err?.error?.message || 'Failed to load claims.';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  onStatusFilterChange(): void {
    this.currentPage = 0;
    this.loadClaims();
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadClaims();
  }

  // AI Summary
  aiSummaryText = '';
  isLoadingAi = false;
  aiError = '';

  // Documents
  claimDocuments: ClaimDocument[] = [];
  isLoadingDocs = false;

  async generateAiSummary(): Promise<void> {
    if (!this.selectedClaim) return;
    this.isLoadingAi = true;
    this.aiSummaryText = '';
    this.aiError = '';
    try {
      this.aiSummaryText = await this.aiSummary.summarizeClaim(this.selectedClaim);
    } catch (err: any) {
      // Should not reach here — service always returns a local fallback
      this.aiSummaryText = this.buildLocalFallback(this.selectedClaim);
    } finally {
      this.isLoadingAi = false;
      this.cdr.detectChanges();
    }
  }

  private buildLocalFallback(claim: ClaimResponse): string {
    const score = claim.finalScoreSnapshot;
    if (score === null || score === undefined) {
      return `This claim (${claim.claimNumber}) is pending and has not been scored yet — no risk assessment available.`;
    }
    const risk = score >= 85 ? 'low risk' : score >= 60 ? 'medium risk' : 'high risk';
    return `This claim presents ${risk} (score: ${score}/100)${claim.excludedConditionDetected ? ' — excluded condition detected' : ''}.`;
  }

  selectClaim(claim: ClaimResponse): void {
    this.selectedClaim = claim;
    this.aiSummaryText = '';
    this.aiError = '';
    this.claimDocuments = [];
    this.loadClaimDocuments(claim.id);
  }

  async loadClaimDocuments(claimId: number): Promise<void> {
    this.isLoadingDocs = true;
    try {
      this.claimDocuments = await this.claimService.getDocuments(claimId);
    } catch {
      this.claimDocuments = [];
    } finally {
      this.isLoadingDocs = false;
      this.cdr.detectChanges();
    }
  }

  getDocumentIcon(contentType: string): string {
    if (contentType?.includes('pdf')) return '📄';
    if (contentType?.includes('image')) return '🖼️';
    return '📎';
  }

  getDocumentUrl(doc: ClaimDocument): string {
    if (!doc.fileUrl) return '';
    return `http://localhost:8080${doc.fileUrl}`;
  }

  formatSize(bytes: number): string {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  async handleApprove(id: number): Promise<void> {
    try {
      await this.claimService.updateStatus(id, {
        status: 'APPROVED_MANUAL',
        comment: 'Approved by admin',
      });
      await this.loadClaims();
      this.selectedClaim = null;
    } catch (err: any) {
      this.errorMessage = err?.error?.message || 'Failed to approve claim.';
    }
  }

  async handleReject(id: number): Promise<void> {
    try {
      await this.claimService.updateStatus(id, {
        status: 'REJECTED_FRAUD',
        comment: 'Rejected by admin',
      });
      await this.loadClaims();
      this.selectedClaim = null;
    } catch (err: any) {
      this.errorMessage = err?.error?.message || 'Failed to reject claim.';
    }
  }

  get pendingClaims(): ClaimResponse[] {
    return this.claims.filter(c =>
      c.status === 'SUBMITTED' || c.status === 'SCORED' || c.status === 'MANUAL_REVIEW'
    );
  }

  get highRiskCount(): number {
    return this.claims.filter(c => c.finalScoreSnapshot !== null && c.finalScoreSnapshot !== undefined && c.finalScoreSnapshot < 60).length;
  }

  get mediumRiskCount(): number {
    return this.claims.filter(c => {
      const s = c.finalScoreSnapshot;
      return s !== null && s !== undefined && s >= 60 && s < 85;
    }).length;
  }

  get lowRiskCount(): number {
    return this.claims.filter(c => c.finalScoreSnapshot !== null && c.finalScoreSnapshot !== undefined && c.finalScoreSnapshot >= 85).length;
  }

  getRiskColor(score: number | null): string {
    if (score === null || score === undefined) return 'text-gray-500 bg-gray-100';
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  }

  getRiskLabel(score: number | null): string {
    if (score === null || score === undefined) return 'Not Scored';
    if (score >= 85) return 'Low Risk';
    if (score >= 60) return 'Medium Risk';
    return 'High Risk';
  }

  getStatusBadge(status: ClaimStatus | null): string {
    const map: Record<string, string> = {
      SUBMITTED: 'bg-blue-100 text-blue-800',
      SCORED: 'bg-purple-100 text-purple-800',
      APPROVED_AUTO: 'bg-green-100 text-green-800',
      MANUAL_REVIEW: 'bg-yellow-100 text-yellow-800',
      APPROVED_MANUAL: 'bg-green-100 text-green-800',
      REJECTED_LOW_SCORE: 'bg-red-100 text-red-800',
      REJECTED_EXCLUSION: 'bg-red-100 text-red-800',
      REJECTED_FRAUD: 'bg-red-100 text-red-800',
      PAID: 'bg-teal-100 text-teal-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
    };
    return map[status ?? ''] ?? 'bg-gray-100 text-gray-800';
  }

  isPending(claim: ClaimResponse): boolean {
    return (
      claim.status === 'SUBMITTED' ||
      claim.status === 'SCORED' ||
      claim.status === 'MANUAL_REVIEW'
    );
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}
