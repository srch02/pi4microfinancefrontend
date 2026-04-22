import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js/auto';

interface ChurnRiskMember {
  id: string;
  name: string;
  group: string;
  riskScore: number;
  reason: string;
  lastActivity: string;
}

@Component({
  selector: 'app-admin-analytics',
  templateUrl: './admin-analytics.component.html',
  standalone: false
})
export class AdminAnalyticsComponent {
  mockChurnRisk: ChurnRiskMember[] = [
    {
      id: 'M-1234',
      name: 'Hassan Jebali',
      group: 'Alpha Solidarity Group',
      riskScore: 85,
      reason: 'No activity in 45 days',
      lastActivity: '2025-12-28'
    },
    {
      id: 'M-1235',
      name: 'Leila Mansour',
      group: 'Beta Health Circle',
      riskScore: 72,
      reason: 'Missed 2 consecutive payments',
      lastActivity: '2026-01-15'
    },
    {
      id: 'M-1236',
      name: 'Youssef Toumi',
      group: 'Gamma Support Network',
      riskScore: 68,
      reason: 'Low engagement score',
      lastActivity: '2026-01-22'
    },
    {
      id: 'M-1237',
      name: 'Samira Khelifi',
      group: 'Delta Care Collective',
      riskScore: 79,
      reason: 'Multiple support tickets',
      lastActivity: '2026-01-18'
    },
  ];

  kpiData = [
    { month: 'Jul', members: 11243, revenue: 168645 },
    { month: 'Aug', members: 11456, revenue: 171840 },
    { month: 'Sep', members: 11678, revenue: 175170 },
    { month: 'Oct', members: 11892, revenue: 178380 },
    { month: 'Nov', members: 12134, revenue: 182010 },
    { month: 'Dec', members: 12321, revenue: 184815 },
    { month: 'Jan', members: 12456, revenue: 186840 },
    { month: 'Feb', members: 12543, revenue: 188145 },
  ];

  membershipData = [
    { name: 'Active Members', value: 11867, color: '#22c55e' },
    { name: 'At Risk', value: 542, color: '#f59e0b' },
    { name: 'Inactive', value: 134, color: '#ef4444' },
  ];

  @ViewChild('growthChartCanvas') growthChartCanvas!: ElementRef;
  @ViewChild('pieChartCanvas') pieChartCanvas!: ElementRef;

  growthChart: any;
  pieChart: any;

  ngAfterViewInit(): void {
    this.initGrowthChart();
    this.initPieChart();
  }

  initGrowthChart() {
    if (this.growthChart) {
      this.growthChart.destroy();
    }
    const ctx = this.growthChartCanvas.nativeElement.getContext('2d');
    this.growthChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.kpiData.map(d => d.month),
        datasets: [
          {
            label: 'Members',
            data: this.kpiData.map(d => d.members),
            borderColor: '#3b82f6',
            backgroundColor: '#3b82f6',
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'Revenue',
            data: this.kpiData.map(d => d.revenue),
            borderColor: '#10b981',
            backgroundColor: '#10b981',
            tension: 0.4,
            yAxisID: 'y1'
          }
        ]
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
            callbacks: {
              label: (context: any) => {
                if (context.datasetIndex === 0) return `${(context.parsed.y ?? 0).toLocaleString()} Members`;
                return `${(context.parsed.y ?? 0).toLocaleString()} TND`;
              }
            }
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: { color: '#e5e7eb', tickLength: 0 },
            ticks: { callback: (value) => `${(value as number) / 1000}k` }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { callback: (value) => `${(value as number) / 1000}k` }
          }
        }
      }
    });
  }

  initPieChart() {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    const ctx = this.pieChartCanvas.nativeElement.getContext('2d');
    this.pieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.membershipData.map(d => d.name),
        datasets: [{
          data: this.membershipData.map(d => d.value),
          backgroundColor: this.membershipData.map(d => d.color),
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'white',
            titleColor: '#1f2937',
            bodyColor: '#1f2937',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            callbacks: {
              label: (context) => ` ${context.parsed.toLocaleString()}`
            }
          }
        }
      }
    });
  }

  get totalAtRisk() {
    return this.mockChurnRisk.length;
  }

  get highRiskCount() {
    return this.mockChurnRisk.filter(m => m.riskScore >= 75).length;
  }

  get totalMembers() {
    return this.membershipData.reduce((acc, curr) => acc + curr.value, 0);
  }

  getChartHeight(value: number, max: number): number {
    return (value / max) * 100;
  }
}
