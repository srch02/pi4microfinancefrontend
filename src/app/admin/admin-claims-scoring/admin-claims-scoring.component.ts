import { Component } from '@angular/core';

interface Claim {
  id: string;
  patientName: string;
  groupName: string;
  amount: number;
  type: string;
  submittedDate: string;
  riskScore: number;
  fraudFlags: string[];
  status: 'pending' | 'approved' | 'rejected';
}

@Component({
  selector: 'app-admin-claims-scoring',
  templateUrl: './admin-claims-scoring.component.html',
  standalone: false
})
export class AdminClaimsScoringComponent {
  claims: Claim[] = [
    {
      id: 'C-2847',
      patientName: 'Fatima Zahra',
      groupName: 'Alpha Solidarity Group',
      amount: 450.00,
      type: 'Medical Consultation',
      submittedDate: '2026-02-12',
      riskScore: 85,
      fraudFlags: ['Duplicate claim pattern detected'],
      status: 'pending'
    },
    {
      id: 'C-2846',
      patientName: 'Ahmed Trabelsi',
      groupName: 'Beta Health Circle',
      amount: 1200.00,
      type: 'Emergency Care',
      submittedDate: '2026-02-12',
      riskScore: 35,
      fraudFlags: [],
      status: 'pending'
    },
    {
      id: 'C-2845',
      patientName: 'Salma Ben Salem',
      groupName: 'Gamma Support Network',
      amount: 280.00,
      type: 'Pharmacy',
      submittedDate: '2026-02-11',
      riskScore: 15,
      fraudFlags: [],
      status: 'pending'
    },
    {
      id: 'C-2844',
      patientName: 'Karim Gharbi',
      groupName: 'Delta Care Collective',
      amount: 950.00,
      type: 'Lab Tests',
      submittedDate: '2026-02-11',
      riskScore: 72,
      fraudFlags: ['Unusual claim amount', 'Multiple claims in short period'],
      status: 'pending'
    },
    {
      id: 'C-2843',
      patientName: 'Nour Jebali',
      groupName: 'Epsilon Wellness Group',
      amount: 320.00,
      type: 'Medical Consultation',
      submittedDate: '2026-02-10',
      riskScore: 22,
      fraudFlags: [],
      status: 'pending'
    },
  ];

  selectedClaim: Claim | null = null;

  get pendingClaims() {
    return this.claims.filter(claim => claim.status === 'pending');
  }

  get highRiskCount() {
    return this.pendingClaims.filter(c => c.riskScore >= 70).length;
  }

  get mediumRiskCount() {
    return this.pendingClaims.filter(c => c.riskScore >= 40 && c.riskScore < 70).length;
  }

  get lowRiskCount() {
    return this.pendingClaims.filter(c => c.riskScore < 40).length;
  }

  handleApprove(id: string) {
    this.claims = this.claims.map(claim => 
      claim.id === id ? { ...claim, status: 'approved' } : claim
    );
    this.selectedClaim = null;
  }

  handleReject(id: string) {
    this.claims = this.claims.map(claim => 
      claim.id === id ? { ...claim, status: 'rejected' } : claim
    );
    this.selectedClaim = null;
  }

  selectClaim(claim: Claim) {
    this.selectedClaim = claim;
  }

  getRiskColor(score: number): string {
    if (score >= 70) return 'text-red-600 bg-red-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  }

  getRiskLabel(score: number): string {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Medium Risk';
    return 'Low Risk';
  }
}
