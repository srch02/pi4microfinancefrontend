import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ClaimRewardSummaryResponse,
  RewardService,
} from '../../../../services/reward.service';

@Component({
  selector: 'app-member-rewards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-reward.html',
  styleUrls: ['./member-reward.css'],
})
export class MemberRewardsComponent implements OnInit {
  rewards: ClaimRewardSummaryResponse | null = null;

  loading = false;
  errorMessage = '';

  constructor(
    private rewardService: RewardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRewards();
  }

  async loadRewards(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    console.log('Loading rewards...');

    try {
      const response = await this.rewardService.getMyRewards();

      console.log('Rewards response:', response);

      this.rewards = response;
    } catch (error: any) {
      console.error('Load rewards error:', error);

      this.errorMessage =
        error?.error?.message ||
        error?.message ||
        'Erreur lors du chargement des rewards.';

      this.rewards = null;
    } finally {
      this.loading = false;

      // Force Angular à rafraîchir l'écran après le chargement
      this.cdr.detectChanges();
    }
  }

  getProgressPercent(): number {
    if (!this.rewards) {
      return 0;
    }

    if (!this.rewards.nextMilestoneClaims) {
      return 100;
    }

    const progress =
      (this.rewards.submittedClaimsCount / this.rewards.nextMilestoneClaims) * 100;

    return Math.min(100, Math.round(progress));
  }
}