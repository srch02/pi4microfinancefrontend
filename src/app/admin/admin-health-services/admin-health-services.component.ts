import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js/auto';

interface Partner {
  id: string;
  name: string;
  type: 'doctor' | 'pharmacy' | 'lab';
  location: string;
  phone: string;
  rating: number;
  consultations: number;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-admin-health-services',
  templateUrl: './admin-health-services.component.html',
  standalone: false
})
export class AdminHealthServicesComponent implements AfterViewInit {
  partners: Partner[] = [
    { id: 'P-001', name: 'Dr. Amina Gharbi', type: 'doctor', location: 'Tunis, Avenue Habib Bourguiba', phone: '+216 71 234 567', rating: 4.8, consultations: 234, status: 'active' },
    { id: 'P-002', name: 'Pharmacie Centrale', type: 'pharmacy', location: 'Sfax, Rue de la République', phone: '+216 74 345 678', rating: 4.6, consultations: 456, status: 'active' },
    { id: 'P-003', name: 'Dr. Karim Ben Salem', type: 'doctor', location: 'Sousse, Boulevard Yahia Ibn Omar', phone: '+216 73 456 789', rating: 4.9, consultations: 189, status: 'active' },
    { id: 'P-004', name: 'Laboratoire Pasteur', type: 'lab', location: 'Tunis, Rue de la Liberté', phone: '+216 71 567 890', rating: 4.7, consultations: 312, status: 'active' },
    { id: 'P-005', name: 'Pharmacie Ezzahra', type: 'pharmacy', location: 'Bizerte, Avenue de Carthage', phone: '+216 72 678 901', rating: 4.5, consultations: 278, status: 'active' },
  ];

  telemedicineData = [
    { month: 'Jul', consultations: 45 },
    { month: 'Aug', consultations: 62 },
    { month: 'Sep', consultations: 58 },
    { month: 'Oct', consultations: 74 },
    { month: 'Nov', consultations: 81 },
    { month: 'Dec', consultations: 89 },
    { month: 'Jan', consultations: 95 },
    { month: 'Feb', consultations: 108 },
  ];

  @ViewChild('telemedicineChartCanvas') telemedicineChartCanvas!: ElementRef;
  telemedicineChart: any;

  ngAfterViewInit(): void {
    const ctx = this.telemedicineChartCanvas.nativeElement.getContext('2d');
    this.telemedicineChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.telemedicineData.map(d => d.month),
        datasets: [{
          label: 'Consultations',
          data: this.telemedicineData.map(d => d.consultations),
          backgroundColor: '#8b5cf6',
          borderRadius: 4,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'white',
            titleColor: '#1f2937',
            bodyColor: '#1f2937',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            padding: 10
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: '#e5e7eb' }, border: { dash: [4, 4] } }
        }
      }
    });
  }

  get totalConsultations() {
    return this.partners.reduce((sum, p) => sum + p.consultations, 0);
  }

  get avgRating() {
    return (this.partners.reduce((sum, p) => sum + p.rating, 0) / this.partners.length).toFixed(1);
  }

  getTypeColor(type: string): string {
    const map: Record<string, string> = {
      doctor: 'bg-blue-100 text-blue-800',
      pharmacy: 'bg-green-100 text-green-800',
      lab: 'bg-purple-100 text-purple-800',
    };
    return map[type] ?? 'bg-gray-100 text-gray-800';
  }

  capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
