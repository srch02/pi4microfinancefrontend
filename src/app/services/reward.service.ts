import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface RewardBadgeResponse {
  code: string;
  title: string;
  description: string;
  earned: boolean;
  discountPercent: number;
  requiredClaims: number;
}

export interface ClaimRewardSummaryResponse {
  memberId: number;
  submittedClaimsCount: number;
  currentDiscountPercent: number;
  nextMilestoneClaims: number | null;
  nextMilestoneDiscountPercent: number | null;
  claimsRemainingToNextMilestone: number | null;
  badges: RewardBadgeResponse[];
}

@Injectable({
  providedIn: 'root',
})
export class RewardService {
  private readonly apiUrl = 'http://localhost:8080/api/my-rewards';

  constructor(private http: HttpClient) {}

  getMyRewards(): Promise<ClaimRewardSummaryResponse> {
    return firstValueFrom(
      this.http.get<ClaimRewardSummaryResponse>(this.apiUrl)
    );
  }
}