import { Component } from '@angular/core';

interface Application {
  id: string;
  name: string;
  cin: string;
  phone: string;
  submittedDate: string;
  status: 'pending' | 'verified' | 'rejected';
  documents: string[];
}

@Component({
  selector: 'app-admin-pre-registration',
  templateUrl: './admin-pre-registration.component.html',
  standalone: false
})
export class AdminPreRegistrationComponent {
  applications: Application[] = [
    {
      id: 'PRE-001',
      name: 'Mohamed Hassan',
      cin: '12345678',
      phone: '+216 98 765 432',
      submittedDate: '2026-02-10',
      status: 'pending',
      documents: ['CIN Front', 'CIN Back', 'Proof of Residence']
    },
    {
      id: 'PRE-002',
      name: 'Amira Ben Ali',
      cin: '23456789',
      phone: '+216 97 654 321',
      submittedDate: '2026-02-11',
      status: 'pending',
      documents: ['CIN Front', 'CIN Back', 'Proof of Residence']
    },
    {
      id: 'PRE-003',
      name: 'Karim Trabelsi',
      cin: '34567890',
      phone: '+216 96 543 210',
      submittedDate: '2026-02-11',
      status: 'pending',
      documents: ['CIN Front', 'CIN Back']
    },
    {
      id: 'PRE-004',
      name: 'Salma Gharbi',
      cin: '45678901',
      phone: '+216 95 432 109',
      submittedDate: '2026-02-12',
      status: 'pending',
      documents: ['CIN Front', 'CIN Back', 'Proof of Residence', 'Income Statement']
    },
  ];

  selectedApp: Application | null = null;

  get pendingApps() {
    return this.applications.filter(app => app.status === 'pending');
  }

  handleAccept(id: string) {
    this.applications = this.applications.map(app => 
      app.id === id ? { ...app, status: 'verified' } : app
    );
    this.selectedApp = null;
  }

  handleReject(id: string) {
    this.applications = this.applications.map(app => 
      app.id === id ? { ...app, status: 'rejected' } : app
    );
    this.selectedApp = null;
  }

  selectApp(app: Application) {
    this.selectedApp = app;
  }
}
