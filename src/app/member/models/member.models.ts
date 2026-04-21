export type ActivityType = 'payment' | 'claim';
export type ClaimStatus = 'approved' | 'pending' | 'rejected';

export interface GroupDashboardData {
  name: string;
  type: string;
  memberCount: number;
  poolBalance: number;
  monthlyContribution?: number;
  adherenceScore: number;
  nextPaymentDue: string;
  nextPaymentAmount: number;
}

export interface RecentActivityItem {
  id: number;
  type: ActivityType;
  user: string;
  desc: string;
  amount: number;
  date: string;
}

export interface ClaimFormData {
  expenseType: string;
  amount: string;
  description: string;
}

export interface ClaimHistoryItem {
  id: string;
  type: string;
  amount: number;
  status: ClaimStatus;
  score: number;
  date: string;
}

export interface Badge {
  name: string;
  desc: string;
  icon: string;
  unlocked: boolean;
}

export interface Doctor {
  id?: number;
  initial: string;
  name: string;
  specialty: string;
  rating?: number;
  location?: string;
  fee: number;
  available: boolean;
}

export interface PlanOption {
  id: string;
  name: string;
  price: number;
  adjustment: number;
  icon: 'shield' | 'star' | 'zap';
  color: 'indigo' | 'blue' | 'purple';
  popular?: boolean;
  features: string[];
}

export interface PaymentMethod {
  id: string;
  label?: string;
  hint?: string;
  name?: string;
  description?: string;
  color?: 'orange' | 'red' | 'blue' | 'emerald';
}

export interface CinVerificationPayload {
  cinNumber: string;
}

export interface MedicalHistoryPayload {
  currentConditions: string[];
  familyConditions: string[];
  ongoingTreatments: string;
  consultationFrequency: string;
}

export interface SubmitPaymentPayload {
  method: string;
  /** Omit when the server resolves pending membership from the authenticated member (JWT). */
  membershipId?: number;
}

export interface PlanSummary {
  planName: string;
  monthlyPremium: number;
}

export interface MedicalHistoryFormData {
  currentConditions: string[];
  familyHistory: string[];
  ongoingTreatments: string;
  consultationFrequency: string;
}

export interface ScoreBreakdownItem {
  label: string;
  score: string;
}

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  date: string;
  method: string;
  status: 'paid' | 'pending' | 'failed';
}

export interface MemberProfile {
  fullName: string;
  memberId: string;
  email: string;
  phone: string;
  city: string;
  plan: string;
  joinedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'member' | 'agent' | 'bot';
  text: string;
  time: string;
}

export interface InviteQr {
  code: string;
  expiresAt: string;
  invitedCount: number;
}

export interface ChatbotQuickAction {
  id: string;
  label: string;
  prompt: string;
}

export interface VerifyCinResponse {
  cinNumber: string;
  duplicate: boolean;
  message?: string;
}

export interface GenericApiResponse {
  success: boolean;
  message: string;
}

export interface GroupDashboardResponse extends GroupDashboardData {
  recentActivity: RecentActivityItem[];
}

export interface DoctorsResponse {
  doctors: Doctor[];
}

// ---- Groups / Memberships (Spring Module 1) ----

export type GroupJoinPolicy = 'public' | 'private';
export type GroupType = 'FAMILY' | 'STUDENTS' | 'WORKERS' | 'MIXED' | string;

export interface GroupDto {
  groupId: number;
  name: string;
  type?: GroupType | null;
  region?: string | null;
  joinPolicy?: GroupJoinPolicy | string | null;
  inviteCode?: string | null;
  createdByMemberId?: number | null;
  minMembers?: number | null;
  maxMembers?: number | null;
  currentMemberCount?: number | null;
  /** Present when backend returns extended / scoring fields */
  matchScore?: number | null;
  poolBalance?: number | null;
  trustScore?: number | null;
  monthlyContributions?: number | null;
  claimApprovalRate?: number | null;
  acceptanceCriteria?: string | null;
}

export type PackageType = 'BASIC' | 'CONFORT' | 'PREMIUM';

export interface MembershipDto {
  membershipId: number;
  memberId: number;
  groupId: number;
  packageType?: PackageType | string | null;
  monthlyAmount?: number | null;
  consultationsLimit?: number | null;
  annualLimit?: number | null;
  status?: 'pending' | 'active' | 'suspended' | 'cancelled' | string | null;
}

export interface MemberDto {
  memberId: number;
  cinNumber: string;
  age?: number | null;
  profession?: string | null;
  region?: string | null;
  email?: string | null;
  personalizedMonthlyPrice?: number | null;
  priceBasic?: number | null;
  priceConfort?: number | null;
  pricePremium?: number | null;
  adherenceScore?: number | null;
  currentGroupId?: number | null;
  createdAt?: string | null;
}

// ---- Member Auth ----

export interface AccountCredentials {
  username: string;
  password: string;
  recaptchaToken?: string;
}

export interface MemberRegisterPayload extends AccountCredentials {
  email: string;
  memberId?: number;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface RecaptchaConfig {
  enabled: boolean;
  siteKey: string;
}

export interface AuthenticatedMember {
  id: number;
  username: string;
  email: string;
  enabled: boolean;
  role: string;
  memberId?: number | null;
}

export interface MemberAuthResponse extends AuthenticatedMember {
  token: string;
}
