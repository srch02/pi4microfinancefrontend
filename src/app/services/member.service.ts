import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, timeout } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { AuthService } from './auth.service';
import {
  CinVerificationPayload,
  DoctorsResponse,
  GenericApiResponse,
  GroupDashboardResponse,
  GroupDto,
  MemberDto,
  MembershipDto,
  MedicalHistoryPayload,
  PackageType,
  SubmitPaymentPayload,
  VerifyCinResponse,
} from '../member/models/member.models';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private readonly baseUrl = API_CONFIG.baseUrl;

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService,
  ) {}

  submitCin(cinNumber: string): Observable<VerifyCinResponse> {
    const payload: CinVerificationPayload = { cinNumber };
    return this.http.post<VerifyCinResponse>(`${this.baseUrl}/members/verify-cin`, payload);
  }

  /**
   * Spring: POST /api/members (request params).
   * Returns the created member including `memberId`.
   */
  createMember(input: {
    cinNumber: string;
    age?: number | null;
    profession?: string | null;
    region?: string | null;
    email?: string | null;
    personalizedMonthlyPrice?: number | null;
    adherenceScore?: number | null;
  }): Observable<MemberDto> {
    let params = new HttpParams().set('cinNumber', input.cinNumber);
    if (input.age != null) params = params.set('age', String(input.age));
    if (input.profession) params = params.set('profession', input.profession);
    if (input.region) params = params.set('region', input.region);
    if (input.email) params = params.set('email', input.email);
    if (input.personalizedMonthlyPrice != null) {
      params = params.set('personalizedMonthlyPrice', String(input.personalizedMonthlyPrice));
    }
    if (input.adherenceScore != null) params = params.set('adherenceScore', String(input.adherenceScore));
    return this.http
      .post<MemberDto>(`${this.baseUrl}/members`, null, { params })
      .pipe(timeout({ first: 60000 }));
  }

  saveMedicalHistory(data: MedicalHistoryPayload, memberId?: number): Observable<GenericApiResponse> {
    const id = memberId ?? (this.auth.isAuthenticated() ? undefined : API_CONFIG.devMemberId);
    if (id == null && !this.auth.isAuthenticated()) {
      return throwError(() => new Error('memberId is required (argument or API_CONFIG.devMemberId)'));
    }
    const params = id != null ? new HttpParams().set('memberId', String(id)) : undefined;
    return this.http.post<GenericApiResponse>(`${this.baseUrl}/members/medical-history`, data, {
      params,
    });
  }

  getPlans(): Observable<GenericApiResponse> {
    return this.http.get<GenericApiResponse>(`${this.baseUrl}/plans`);
  }

  submitPayment(method: string, membershipId?: number): Observable<MembershipDto> {
    const mid =
      membershipId ??
      (this.auth.isAuthenticated() ? undefined : API_CONFIG.devMembershipId);
    if (mid == null && !this.auth.isAuthenticated()) {
      return throwError(() => new Error('membershipId is required (argument or API_CONFIG.devMembershipId)'));
    }
    return this.http.post<MembershipDto>(`${this.baseUrl}/payments/memberships/${mid}`, {});
  }

  getGroupDashboard(memberId?: number): Observable<GroupDashboardResponse> {
    const id =
      memberId ??
      (this.auth.isAuthenticated() ? undefined : API_CONFIG.devMemberId);
    const params = id != null ? new HttpParams().set('memberId', String(id)) : undefined;
    return this.http.get<GroupDashboardResponse>(`${this.baseUrl}/members/me/group`, { params });
  }

  submitClaim(data: unknown, memberId?: number): Observable<GenericApiResponse> {
    const id =
      memberId ??
      (this.auth.isAuthenticated() ? undefined : API_CONFIG.devMemberId);
    if (id == null && !this.auth.isAuthenticated()) {
      return throwError(() => new Error('memberId is required (argument or API_CONFIG.devMemberId)'));
    }
    const params = id != null ? new HttpParams().set('memberId', String(id)) : undefined;
    return this.http.post<GenericApiResponse>(`${this.baseUrl}/claims`, data, { params });
  }

  getDoctors(): Observable<DoctorsResponse> {
    return this.http.get<DoctorsResponse>(`${this.baseUrl}/doctors`);
  }

  // ---- Groups / Memberships ----

  getGroupSuggestions(memberId?: number): Observable<GroupDto[]> {
    const id =
      memberId ??
      (this.auth.isAuthenticated() ? undefined : API_CONFIG.devMemberId);
    if (id == null && !this.auth.isAuthenticated()) {
      return throwError(() => new Error('memberId is required (argument or API_CONFIG.devMemberId)'));
    }
    // Until JWT is wired, Spring expects memberId in the path
    return this.http.get<GroupDto[]>(`${this.baseUrl}/members/${id}/group-suggestions`);
  }

  /** GET /api/groups — list all groups (optional type filter). */
  listAllGroups(type?: string): Observable<GroupDto[]> {
    let params = new HttpParams();
    if (type) params = params.set('type', type);
    return this.http.get<GroupDto[]>(`${this.baseUrl}/groups`, { params });
  }

  /** Join a PUBLIC group by selecting it from suggestions. */
  joinPublicGroup(groupId: number, packageType: PackageType, memberId?: number): Observable<MembershipDto> {
    const id =
      memberId ??
      (this.auth.isAuthenticated() ? undefined : API_CONFIG.devMemberId);
    if (id == null && !this.auth.isAuthenticated()) {
      return throwError(() => new Error('memberId is required (argument or API_CONFIG.devMemberId)'));
    }
    const params = new HttpParams()
      .set('memberId', String(id))
      .set('packageType', packageType);
    return this.http.post<MembershipDto>(`${this.baseUrl}/groups/${groupId}/members`, null, { params });
  }

  /** Join a PRIVATE group by invite code (QR). */
  joinByInvite(inviteCode: string, packageType: PackageType, memberId?: number): Observable<MembershipDto> {
    const id =
      memberId ??
      (this.auth.isAuthenticated() ? undefined : API_CONFIG.devMemberId);
    if (id == null && !this.auth.isAuthenticated()) {
      return throwError(() => new Error('memberId is required (argument or API_CONFIG.devMemberId)'));
    }
    const params = new HttpParams()
      .set('inviteCode', inviteCode)
      .set('memberId', String(id))
      .set('packageType', packageType);
    return this.http.post<MembershipDto>(`${this.baseUrl}/memberships/join-by-invite`, null, { params });
  }

  // ---- Member CRUD ----

  /** GET /api/members/me — current member profile (JWT). */
  getMe(): Observable<MemberDto> {
    return this.http.get<MemberDto>(`${this.baseUrl}/members/me`);
  }

  /** GET /api/members/{memberId} */
  getMemberById(memberId: number): Observable<MemberDto> {
    return this.http.get<MemberDto>(`${this.baseUrl}/members/${memberId}`);
  }

  /** GET /api/members — list all members (optionally filtered by groupId). */
  getAllMembers(groupId?: number): Observable<MemberDto[]> {
    let params = new HttpParams();
    if (groupId != null) params = params.set('groupId', String(groupId));
    return this.http.get<MemberDto[]>(`${this.baseUrl}/members`, { params });
  }

  /** PUT /api/members/{memberId} — update member fields. */
  updateMember(memberId: number, updates: {
    age?: number | null;
    profession?: string | null;
    region?: string | null;
    email?: string | null;
    currentGroupId?: number | null;
  }): Observable<MemberDto> {
    let params = new HttpParams();
    if (updates.age != null) params = params.set('age', String(updates.age));
    if (updates.profession) params = params.set('profession', updates.profession);
    if (updates.region) params = params.set('region', updates.region);
    if (updates.email) params = params.set('email', updates.email);
    if (updates.currentGroupId != null) params = params.set('currentGroupId', String(updates.currentGroupId));
    return this.http.put<MemberDto>(`${this.baseUrl}/members/${memberId}`, null, { params });
  }

  /** DELETE /api/members/{memberId} */
  deleteMember(memberId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/members/${memberId}`);
  }

  /** GET /api/members/me/memberships */
  getMyMemberships(): Observable<MembershipDto[]> {
    return this.http.get<MembershipDto[]>(`${this.baseUrl}/members/me/memberships`);
  }

  /** GET /api/members/me/groups */
  getMyGroups(): Observable<GroupDto[]> {
    return this.http.get<GroupDto[]>(`${this.baseUrl}/members/me/groups`);
  }

  /** GET /api/payments/history?memberId=&groupId= */
  getPaymentHistory(memberId: number, groupId?: number): Observable<unknown[]> {
    let params = new HttpParams().set('memberId', String(memberId));
    if (groupId != null) params = params.set('groupId', String(groupId));
    return this.http.get<unknown[]>(`${this.baseUrl}/payments/history`, { params });
  }

  /** POST /api/payments — process monthly premium payment. */
  processMonthlyPayment(memberId: number, groupId: number): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/payments`, { memberId, groupId });
  }
}
