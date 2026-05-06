import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface MemberAdherenceSummary {
  id: number;
  email: string;
  cinNumber: string;
  profession: string | null;
  region: string | null;
  age: number | null;
  adherenceScore: number;
  createdAt: string | null;
  groupId: number | null;
  groupName: string | null;
}

export interface AdherenceEvent {
  id: number;
  memberId: number;
  claimId: number | null;
  eventType: string;
  scoreChange: number;
  currentScore: number;
  note: string | null;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({ providedIn: 'root' })
export class AdherenceService {
  private readonly base = 'http://localhost:8080/api/admin/adherence-tracking';

  constructor(private http: HttpClient) {}

  getAllMembers(page = 0, size = 20): Promise<PageResponse<MemberAdherenceSummary>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('sort', 'id,desc');
    return firstValueFrom(
      this.http.get<PageResponse<MemberAdherenceSummary>>(`${this.base}/members`, { params })
    );
  }

  getMemberEvents(memberId: number, page = 0, size = 20): Promise<PageResponse<AdherenceEvent>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));
    return firstValueFrom(
      this.http.get<PageResponse<AdherenceEvent>>(`${this.base}/members/${memberId}/events`, { params })
    );
  }
}
