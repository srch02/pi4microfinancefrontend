import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  standalone: false
})
export class AdminLayoutComponent {
  menuItems = [
    { id: 'dashboard', label: 'Overview', route: '/admin/dashboard', icon: 'dashboard', subtitle: '' },
    { id: 'pre-registration', label: 'Pre-Registration', route: '/admin/pre-registration', icon: 'userCheck', subtitle: 'Module 5' },
    { id: 'groups-payments', label: 'Groups & Payments', route: '/admin/groups-payments', icon: 'users', subtitle: 'Module 1' },
    { id: 'claims-scoring', label: 'Claims & Scoring', route: '/admin/claims-scoring', icon: 'clipboardList', subtitle: 'Module 2' },
    { id: 'health-services', label: 'Health Services', route: '/admin/health-services', icon: 'hospital', subtitle: 'Module 3' },
    { id: 'analytics-admin', label: 'Analytics & Admin', route: '/admin/analytics', icon: 'barChart', subtitle: 'Module 4' },
    { id: 'adherence', label: 'Adherence Tracking', route: '/admin/adherence', icon: 'activity', subtitle: 'Members' },
  ];
}
