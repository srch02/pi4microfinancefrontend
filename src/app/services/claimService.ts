import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type ClaimStatus =
  | 'SUBMITTED'
  | 'SCORED'
  | 'APPROVED_AUTO'
  | 'MANUAL_REVIEW'
  | 'APPROVED_MANUAL'
  | 'REJECTED_LOW_SCORE'
  | 'REJECTED_EXCLUSION'
  | 'REJECTED_FRAUD'
  | 'PAID'
  | 'CANCELLED';

export interface ClaimResponse {
  id: number;
  claimNumber: string;
  amountRequested: number;
  amountApproved: number | null;
  finalScoreSnapshot: number | null;
  status: ClaimStatus | null;
  decisionReason: string | null;
  excludedConditionDetected: boolean;
  decisionComment: string | null;
  decisionAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  memberId: number | null;
  groupId: number | null;
}

export interface ClaimDocument {
  id: number;
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
  documentType: string;
  fraudDetectionScore: number | null;
  createdAt: string;
  fileUrl: string | null;
}

export interface ClaimCreateRequest {
  memberId?: number;
  groupId: number;
  claimNumber: string;
  amountRequested: number;
  documentUploadIds?: number[];
}

export interface ClaimUpdateRequest {
  amountRequested: number;
  amountApproved: number | null;
  finalScoreSnapshot: number | null;
  status: ClaimStatus | null;
  decisionReason: string | null;
  excludedConditionDetected: boolean;
  decisionComment: string | null;
  decisionAt: string | null;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
export interface ClaimCreateWithBulletinRequest {
  memberId?: number;
  groupId: number;
  claimNumber?: string;
  amountRequested: number;
  bulletin: File;
}
@Injectable({
  providedIn: 'root',
})
export class ClaimService {
private readonly apiUrl = 'http://localhost:8080/api/claims';

  constructor(private http: HttpClient) {}

  getAll(params?: {
    page?: number;
    size?: number;
    status?: ClaimStatus | 'ALL';
  }): Promise<PageResponse<ClaimResponse>> {
    let httpParams = new HttpParams();

    if (params?.page !== undefined) {
      httpParams = httpParams.set('page', String(params.page));
    }
    if (params?.size !== undefined) {
      httpParams = httpParams.set('size', String(params.size));
    }
    if (params?.status && params.status !== 'ALL') {
      httpParams = httpParams.set('status', params.status);
    }
    // Sort by createdAt descending — newest first, server-side across all pages
    httpParams = httpParams.set('sort', 'createdAt,desc');

    return firstValueFrom(
      this.http.get<PageResponse<ClaimResponse>>(this.apiUrl, { params: httpParams })
    );
  }

  getById(id: number): Promise<ClaimResponse> {
    return firstValueFrom(
      this.http.get<ClaimResponse>(`${this.apiUrl}/${id}`)
    );
  }

  getDocuments(claimId: number): Promise<ClaimDocument[]> {
    return firstValueFrom(
      this.http.get<ClaimDocument[]>(`${this.apiUrl}/${claimId}/documents`)
    );
  }

  create(payload: ClaimCreateRequest): Promise<ClaimResponse> {
    return firstValueFrom(this.http.post<ClaimResponse>(this.apiUrl, payload));
  }

  update(id: number, payload: ClaimUpdateRequest): Promise<ClaimResponse> {
    return firstValueFrom(this.http.put<ClaimResponse>(`${this.apiUrl}/${id}`, payload));
  }

  remove(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }

  updateStatus(
    id: number,
    payload: {
      status: ClaimStatus;
      reason?: string | null;
      comment?: string | null;
    }
  ): Promise<ClaimResponse> {
    return firstValueFrom(
      this.http.patch<ClaimResponse>(`${this.apiUrl}/${id}/status`, payload)
    );
  }
   getMyClaims(params?: {
    page?: number;
    size?: number;
    status?: ClaimStatus | 'ALL';
  }): Promise<PageResponse<ClaimResponse>> {
    let httpParams = new HttpParams();

    if (params?.page !== undefined) {
      httpParams = httpParams.set('page', String(params.page));
    }

    if (params?.size !== undefined) {
      httpParams = httpParams.set('size', String(params.size));
    }

    if (params?.status && params.status !== 'ALL') {
      httpParams = httpParams.set('status', params.status);
    }

    return firstValueFrom(
      this.http.get<PageResponse<ClaimResponse>>(this.apiUrl, {
        params: httpParams,
      })
    );
  }
  
  createWithBulletin(payload: ClaimCreateWithBulletinRequest): Promise<ClaimResponse> {
  const formData = new FormData();

  formData.append('groupId', String(payload.groupId));
  formData.append('amountRequested', String(payload.amountRequested));

  if (payload.memberId !== undefined && payload.memberId !== null) {
    formData.append('memberId', String(payload.memberId));
  }

  if (payload.claimNumber && payload.claimNumber.trim()) {
    formData.append('claimNumber', payload.claimNumber.trim());
  }

  formData.append('bulletin', payload.bulletin, payload.bulletin.name);

  return firstValueFrom(
    this.http.post<ClaimResponse>(
      `${this.apiUrl}/with-bulletin`,
      formData
    )
  );
}

}