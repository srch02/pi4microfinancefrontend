import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js/auto';

interface KpiCard {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  color: string;
}

interface Activity {
  id: number;
  message: string;
  time: string;
  status: 'pending' | 'success' | 'warning' | 'info';
  type?: string;
}

interface Alert {
  id: number;
  title: string;
  description: string;
  color: 'red' | 'blue' | 'orange';
  iconType: 'alert' | 'check' | 'dollar';
}

interface Task {
  id: number;
  task: string;
  count: number;
  dueDate: string;
}

@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  standalone: false
})
export class AdminOverviewComponent implements AfterViewInit {
  kpiCards: KpiCard[] = [
    { label: 'Total Members', value: '12,543', change: '+12.5%', trend: 'up', color: 'blue' },
    { label: 'Active Groups', value: '247', change: '+8.2%', trend: 'up', color: 'green' },
    { label: 'Claims Pending', value: '34', change: '-15.3%', trend: 'down', color: 'orange' },
    { label: 'Pool Health', value: '92%', change: '+3.1%', trend: 'up', color: 'purple' },
  ];

  alerts: Alert[] = [
    { id: 1, title: 'High Fraud Risk Detected', description: '3 claims flagged for review', color: 'red', iconType: 'alert' },
    { id: 2, title: 'Monthly Report Ready', description: 'February 2026 analytics available', color: 'blue', iconType: 'check' },
    { id: 3, title: 'Payment Due Soon', description: '12 groups have pending contributions', color: 'orange', iconType: 'dollar' },
  ];

  upcomingTasks: Task[] = [
    { id: 1, task: 'Review pending applications', count: 23, dueDate: 'Today' },
    { id: 2, task: 'Process claim verifications', count: 15, dueDate: 'Tomorrow' },
    { id: 3, task: 'Update partner contracts', count: 8, dueDate: 'This week' },
    { id: 4, task: 'Generate monthly reports', count: 1, dueDate: 'Feb 28' },
  ];

  claimsByType = [
    { name: 'Medical Consultation', value: 145, color: '#5B52FF' },
    { name: 'Pharmacy', value: 98, color: '#3b82f6' },
    { name: 'Laboratory', value: 67, color: '#10b981' },
    { name: 'Emergency', value: 34, color: '#f59e0b' },
  ];

  claimsData = [
    { month: 'Jul', claims: 45 },
    { month: 'Aug', claims: 52 },
    { month: 'Sep', claims: 48 },
    { month: 'Oct', claims: 61 },
    { month: 'Nov', claims: 55 },
    { month: 'Dec', claims: 58 },
    { month: 'Jan', claims: 64 },
    { month: 'Feb', claims: 59 },
  ];

  poolTrendData = [
    { month: 'Jul', balance: 125000 },
    { month: 'Aug', balance: 138000 },
    { month: 'Sep', balance: 142000 },
    { month: 'Oct', balance: 155000 },
    { month: 'Nov', balance: 148000 },
    { month: 'Dec', balance: 162000 },
    { month: 'Jan', balance: 178000 },
    { month: 'Feb', balance: 185000 },
  ];

  recentActivity: Activity[] = [
    { id: 1, message: 'New claim submitted by Group Alpha-12', time: '5 min ago', status: 'pending' },
    { id: 2, message: 'Pre-registration approved: Mohamed Hassan', time: '12 min ago', status: 'success' },
    { id: 3, message: 'Payment received from Group Beta-7 (5,000 TND)', time: '23 min ago', status: 'success' },
    { id: 4, message: 'Fraud alert flagged for claim #C-2847', time: '45 min ago', status: 'warning' },
    { id: 5, message: 'New pharmacy partner added: Pharmacie Centrale', time: '1 hour ago', status: 'info' },
    { id: 6, message: 'Claim approved for Fatima Zahra', time: '2 hours ago', status: 'success' },
  ];

  @ViewChild('claimsChartCanvas') claimsChartCanvas!: ElementRef;
  @ViewChild('poolTrendChartCanvas') poolTrendChartCanvas!: ElementRef;
  @ViewChild('claimsByTypeCanvas') claimsByTypeCanvas!: ElementRef;

  claimsChart: any;
  poolTrendChart: any;
  claimsByTypeChart: any;

  ngAfterViewInit(): void {
    this.initClaimsChart();
    this.initPoolTrendChart();
    this.initClaimsByTypeChart();
  }

  initClaimsChart() {
    if (this.claimsChart) this.claimsChart.destroy();
    const ctx = this.claimsChartCanvas.nativeElement.getContext('2d');
    this.claimsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.claimsData.map(d => d.month),
        datasets: [{
          label: 'Claims',
          data: this.claimsData.map(d => d.claims),
          backgroundColor: '#5B52FF',
          borderRadius: 8,
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
            padding: 10,
            displayColors: false,
            callbacks: {
              label: (context: any) => `claims : ${context.parsed.y ?? 0}`
            }
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            grid: { color: '#e5e7eb', tickLength: 0 },
            border: { dash: [4, 4] }
          }
        }
      }
    });
  }

  initPoolTrendChart() {
    if (this.poolTrendChart) this.poolTrendChart.destroy();
    const ctx = this.poolTrendChartCanvas.nativeElement.getContext('2d');
    this.poolTrendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.poolTrendData.map(d => d.month),
        datasets: [{
          label: 'Balance',
          data: this.poolTrendData.map(d => d.balance),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#10b981',
          pointBorderColor: 'white',
          pointBorderWidth: 2,
          borderWidth: 3
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
            padding: 10,
            displayColors: false,
            callbacks: {
              label: (context: any) => `${(context.parsed.y ?? 0).toLocaleString()} TND`
            }
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            grid: { color: '#e5e7eb', tickLength: 0 },
            border: { dash: [4, 4] },
            ticks: {
              callback: (value) => `${(value as number) / 1000}k`
            }
          }
        }
      }
    });
  }

  initClaimsByTypeChart() {
    if (this.claimsByTypeChart) this.claimsByTypeChart.destroy();
    const ctx = this.claimsByTypeCanvas.nativeElement.getContext('2d');
    this.claimsByTypeChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.claimsByType.map(d => d.name),
        datasets: [{
          data: this.claimsByType.map(d => d.value),
          backgroundColor: this.claimsByType.map(d => d.color),
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'white',
            titleColor: '#1f2937',
            bodyColor: '#1f2937',
            borderColor: '#e5e7eb',
            borderWidth: 1
          }
        }
      }
    });
  }

  getKpiIconColor(color: string): string {
    const map: Record<string, string> = {
      blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
      green: 'bg-gradient-to-br from-green-500 to-green-600',
      orange: 'bg-gradient-to-br from-orange-500 to-orange-600',
      purple: 'bg-gradient-to-br from-[#5B52FF] to-[#4B42EF]',
    };
    return map[color] ?? 'bg-gray-500';
  }

  getAlertBg(color: string): string {
    const map: Record<string, string> = {
      red: 'bg-red-50 border-red-200 text-red-800',
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
    };
    return map[color] ?? '';
  }

  getAlertIcon(color: string): string {
    const map: Record<string, string> = {
      red: 'text-red-600',
      blue: 'text-blue-600',
      orange: 'text-orange-600',
    };
    return map[color] ?? 'text-gray-600';
  }

  getStatusBorder(status: string): string {
    const map: Record<string, string> = {
      pending: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      success: 'bg-green-50 border-green-200 text-green-800',
      warning: 'bg-red-50 border-red-200 text-red-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
    };
    return map[status] ?? 'bg-gray-50 border-gray-200 text-gray-800';
  }
}
