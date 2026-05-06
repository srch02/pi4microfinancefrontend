import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ClaimResponse } from './claimService';

const GEMINI_API_KEY = 'AIzaSyDrNtlXWWkWuCd6-Yere-xHLat3URVPPdU';

// Try multiple models in order
const GEMINI_MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash-lite',
  'gemini-flash-lite-latest',
];

@Injectable({ providedIn: 'root' })
export class AiSummaryService {
  constructor(private http: HttpClient) {}

  async summarizeClaim(claim: ClaimResponse): Promise<string> {
    const prompt = this.buildPrompt(claim);
    const body = { contents: [{ parts: [{ text: prompt }] }] };

    for (const model of GEMINI_MODELS) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await firstValueFrom(
            this.http.post<any>(url, body)
          );
          const text = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (text) return text;
        } catch (err: any) {
          const status = err?.status ?? err?.error?.error?.code;
          if (status === 503 && attempt === 0) {
            await this.delay(3000);
            continue;
          }
          break; // try next model
        }
      }
    }

    // All models failed — use local summary
    return this.localSummary(claim);
  }

  private buildPrompt(claim: ClaimResponse): string {
    return `
You are an insurance claim analyst. Analyze this claim and write ONE concise sentence (max 30 words) in English summarizing the risk level and key factors.

Claim: ${claim.claimNumber}, Status: ${claim.status ?? 'N/A'}, Amount: ${claim.amountRequested} TND, Score: ${claim.finalScoreSnapshot ?? 'N/A'}/100, Reason: ${claim.decisionReason ?? 'none'}, Excluded condition: ${claim.excludedConditionDetected ? 'yes' : 'no'}.

Write only the summary sentence.
    `.trim();
  }

  private localSummary(claim: ClaimResponse): string {
    const score = claim.finalScoreSnapshot ?? 0;
    const amount = claim.amountRequested;
    const excluded = claim.excludedConditionDetected;

    let risk = score >= 85 ? 'low risk' : score >= 60 ? 'medium risk' : 'high risk';
    let factors: string[] = [];

    if (excluded) factors.push('excluded condition detected');
    if (amount > 700) factors.push('high requested amount');
    else if (amount <= 300) factors.push('moderate requested amount');
    if (score < 60) factors.push('low compliance score');
    if (claim.decisionReason) factors.push(claim.decisionReason.toLowerCase());

    const factorStr = factors.length > 0 ? ` — ${factors.slice(0, 2).join(', ')}` : '';
    return `This claim presents ${risk} (score: ${score}/100)${factorStr}.`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
