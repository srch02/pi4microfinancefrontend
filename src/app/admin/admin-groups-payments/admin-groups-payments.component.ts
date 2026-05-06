import { Component } from '@angular/core';

interface Group {
  id: string;
  name: string;
  members: number;
  poolBalance: number;
  monthlyContribution: number;
  status: 'active' | 'inactive';
  lastPayment: string;
}

@Component({
  selector: 'app-admin-groups-payments',
  templateUrl: './admin-groups-payments.component.html',
  standalone: false
})
export class AdminGroupsPaymentsComponent {
  mockGroups: Group[] = [
    {
      id: 'G-001',
      name: 'Alpha Solidarity Group',
      members: 52,
      poolBalance: 8450.00,
      monthlyContribution: 150.00,
      status: 'active',
      lastPayment: '2026-02-10'
    },
    {
      id: 'G-002',
      name: 'Beta Health Circle',
      members: 48,
      poolBalance: 7200.00,
      monthlyContribution: 150.00,
      status: 'active',
      lastPayment: '2026-02-11'
    },
    {
      id: 'G-003',
      name: 'Gamma Support Network',
      members: 65,
      poolBalance: 9750.00,
      monthlyContribution: 150.00,
      status: 'active',
      lastPayment: '2026-02-09'
    },
    {
      id: 'G-004',
      name: 'Delta Care Collective',
      members: 41,
      poolBalance: 6150.00,
      monthlyContribution: 150.00,
      status: 'active',
      lastPayment: '2026-02-08'
    },
    {
      id: 'G-005',
      name: 'Epsilon Wellness Group',
      members: 38,
      poolBalance: 5700.00,
      monthlyContribution: 150.00,
      status: 'active',
      lastPayment: '2026-02-12'
    },
  ];

  mockPaymentHistory = [
    { id: 'P-101', group: 'Alpha Solidarity Group', amount: 7800.00, date: '2026-02-10', status: 'completed' },
    { id: 'P-102', group: 'Beta Health Circle', amount: 7200.00, date: '2026-02-11', status: 'completed' },
    { id: 'P-103', group: 'Epsilon Wellness Group', amount: 5700.00, date: '2026-02-12', status: 'completed' },
    { id: 'P-104', group: 'Gamma Support Network', amount: 9750.00, date: '2026-02-09', status: 'completed' },
    { id: 'P-105', group: 'Delta Care Collective', amount: 6150.00, date: '2026-02-08', status: 'completed' },
  ];

  selectedGroup: Group | null = null;

  get totalMembers() {
    return this.mockGroups.reduce((sum, group) => sum + group.members, 0);
  }

  get totalPoolBalance() {
    return this.mockGroups.reduce((sum, group) => sum + group.poolBalance, 0);
  }

  selectGroup(group: Group) {
    this.selectedGroup = group;
  }
}
