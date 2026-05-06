import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
  ClaimResponse,
  ClaimService,
  ClaimStatus,
  PageResponse,
} from '../../../../services/claimService';

@Component({
  selector: 'app-claim-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './claim-list.html',
  styleUrls: ['./claim-list.css'],
})
export class ClaimListComponent implements OnInit {
  claims: ClaimResponse[] = [];

  loading = false;
  errorMessage = '';

  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;

  selectedStatus: ClaimStatus | 'ALL' = 'ALL';

  statuses: Array<ClaimStatus | 'ALL'> = [
    'ALL',
    'SUBMITTED',
    'SCORED',
    'APPROVED_AUTO',
    'MANUAL_REVIEW',
    'APPROVED_MANUAL',
    'REJECTED_LOW_SCORE',
    'REJECTED_EXCLUSION',
    'REJECTED_FRAUD',
    'PAID',
    'CANCELLED',
  ];

  constructor(
    private claimService: ClaimService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadClaims();
  }

  async loadClaims(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    console.log('Loading claims...');

    try {
      const response: PageResponse<ClaimResponse> =
        await this.claimService.getMyClaims({
          page: this.page,
          size: this.size,
          status: this.selectedStatus,
        });

      console.log('Claims response:', response);

      this.claims = response?.content || [];
      this.totalPages = response?.totalPages || 0;
      this.totalElements = response?.totalElements || 0;

    } catch (error: any) {
      console.error('Load claims error:', error);

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Erreur lors du chargement des réclamations.';

      this.claims = [];
      this.totalPages = 0;
      this.totalElements = 0;

    } finally {
      this.loading = false;

      // Important: force Angular to refresh the screen after async loading
      this.cdr.detectChanges();
    }
  }

  async onStatusChange(): Promise<void> {
    this.page = 0;
    await this.loadClaims();
  }

  async nextPage(): Promise<void> {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      await this.loadClaims();
    }
  }

  async previousPage(): Promise<void> {
    if (this.page > 0) {
      this.page--;
      await this.loadClaims();
    }
  }

  getStatusLabel(status: ClaimStatus | null): string {
    switch (status) {
      case 'SUBMITTED':
        return 'Soumis';
      case 'SCORED':
        return 'Score calculé';
      case 'APPROVED_AUTO':
        return 'Approuvé automatiquement';
      case 'MANUAL_REVIEW':
        return 'En révision';
      case 'APPROVED_MANUAL':
        return 'Approuvé manuellement';
      case 'REJECTED_LOW_SCORE':
        return 'Rejeté - score faible';
      case 'REJECTED_EXCLUSION':
        return 'Rejeté - exclusion';
      case 'REJECTED_FRAUD':
        return 'Rejeté - fraude';
      case 'PAID':
        return 'Payé';
      case 'CANCELLED':
        return 'Annulé';
      default:
        return 'Inconnu';
    }
  }

  getStatusClass(status: ClaimStatus | null): string {
    switch (status) {
      case 'APPROVED_AUTO':
      case 'APPROVED_MANUAL':
      case 'PAID':
        return 'status-success';

      case 'REJECTED_LOW_SCORE':
      case 'REJECTED_EXCLUSION':
      case 'REJECTED_FRAUD':
      case 'CANCELLED':
        return 'status-danger';

      case 'MANUAL_REVIEW':
      case 'SCORED':
        return 'status-warning';

      case 'SUBMITTED':
      default:
        return 'status-info';
    }
  }
}