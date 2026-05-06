import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClaimResponse, ClaimService } from '../../../../services/claimService';

type FormDataState = {
  memberId: string;
  groupId: string;
  claimNumber: string;
  expenseType: string;
  amount: string;
  description: string;
};

@Component({
  selector: 'app-submit-claim',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './submit-claim.html',
  styleUrls: ['./submit-claim.css'],
})
export class SubmitClaimComponent {
  step = 1;
  submitting = false;
  errorMessage = '';
  createdClaim: ClaimResponse | null = null;
  selectedBulletin: File | null = null;
  formData: FormDataState = {
    memberId: '',
    groupId: '',
    claimNumber: '',
    expenseType: '',
    amount: '',
    description: '',
  };

  expenseTypes = [
    'Consultation',
    'Medication',
    'Lab Test',
    'Minor Procedure',
    'Emergency Care',
  ];

  constructor(
    private router: Router,
    private claimService: ClaimService
  ) {}

  get score(): number {
    let total = 0;
    if (this.formData.expenseType) total += 34;
    if (this.formData.amount && Number(this.formData.amount) > 0) total += 33;
    if (this.formData.description.trim()) total += 33;
    return total;
  }

  get canContinueStep1(): boolean {
    return !!(
      this.formData.memberId &&
      this.formData.groupId &&
      this.formData.expenseType &&
      this.formData.amount &&
      Number(this.formData.amount) > 0 &&
      this.formData.description.trim()
    );
  }

  get resolvedClaimNumber(): string {
    return this.formData.claimNumber.trim() || this.generateClaimNumberPreview();
  }

  goBack(): void {
    this.router.navigate(['/app']);
  }

  goToStep2(): void {
    if (!this.canContinueStep1) {
      this.errorMessage = 'Please complete all required fields in step 1.';
      return;
    }

    this.errorMessage = '';
    this.step = 2;
  }

  goToStep3(): void {
    this.errorMessage = '';
    this.step = 3;
  }

  previousStep(): void {
    this.errorMessage = '';
    if (this.step > 1) {
      this.step--;
    }
  }

  async submitClaim(): Promise<void> {
    try {
      this.errorMessage = '';

      if (!this.canContinueStep1) {
        this.errorMessage = 'Please complete all required fields before submitting.';
        return;
      }

      const payload = {
        memberId: Number(this.formData.memberId),
        groupId: Number(this.formData.groupId),
        claimNumber: this.formData.claimNumber.trim() || this.generateClaimNumber(),
        amountRequested: Number(this.formData.amount),
      };

      console.log('Submitting claim payload:', payload);

      this.submitting = true;
      const response = await this.claimService.create(payload);
    await this.router.navigate(['/app/claims/my']);

  } catch (error: any) {
    console.error('Submit claim failed:', error);

    this.errorMessage =
      error?.error?.message ||
      error?.message ||
      'Failed to submit claim.';
  } finally {
    this.submitting = false;
  }
}

  getStatusLabel(status?: string | null): string {
    switch (status) {
      case 'SUBMITTED':
        return 'Submitted';
      case 'SCORED':
        return 'Scored';
      case 'APPROVED_AUTO':
        return 'Approved Automatically';
      case 'MANUAL_REVIEW':
        return 'Manual Review';
      case 'APPROVED_MANUAL':
        return 'Approved Manually';
      case 'REJECTED_LOW_SCORE':
        return 'Rejected - Low Score';
      case 'REJECTED_EXCLUSION':
        return 'Rejected - Exclusion';
      case 'REJECTED_FRAUD':
        return 'Rejected - Fraud';
      case 'PAID':
        return 'Paid';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status || 'Unknown';
    }
  }

  private generateClaimNumber(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();

    return `CLM-${yyyy}${mm}${dd}-${random}`;
  }

  private generateClaimNumberPreview(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    return `CLM-${yyyy}${mm}${dd}-XXXXXX`;
  }
  
  onBulletinSelected(event: Event): void {
  this.errorMessage = '';

  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) {
    this.selectedBulletin = null;
    return;
  }

  const allowedTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
  ];

  if (!allowedTypes.includes(file.type)) {
    this.errorMessage = 'Format invalide. Veuillez choisir un fichier PDF, PNG ou JPG.';
    this.selectedBulletin = null;
    input.value = '';
    return;
  }

  const maxSize = 10 * 1024 * 1024;

  if (file.size > maxSize) {
    this.errorMessage = 'Le fichier ne doit pas dépasser 10MB.';
    this.selectedBulletin = null;
    input.value = '';
    return;
  }

  this.selectedBulletin = file;

  console.log('Bulletin selected:', file);
}
formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

removeBulletin(input: HTMLInputElement): void {
  this.selectedBulletin = null;
  input.value = '';
}
}