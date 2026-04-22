import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberAuthGuard } from './guards/member-auth.guard';
import {
  CinVerificationComponent,
  ClaimsHistoryComponent,
  BrowseGroupsComponent,
  MemberChatbotComponent,
  MemberMessagesComponent,
  MemberProfileComponent,
  DoctorDirectoryComponent,
  ExcludedConditionsComponent,
  FaceRecognitionLoginComponent,
  FirstPaymentComponent,
  ForgotPasswordComponent,
  GroupsDashboardComponent,
  HealthToolsHubComponent,
  HomeComponent,
  MedicationRecommendationsComponent,
  MedicalHistoryComponent,
  MemberProfileOnboardingComponent,
  MemberAppComponent,
  MemberSignInComponent,
  MemberRootComponent,
  PaymentHistoryComponent,
  InvitationQrComponent,
  PharmacyQrComponent,
  PlanSelectionComponent,
  PriceCalculationComponent,
  RewardsChallengeComponent,
  SubmitClaimComponent,
  TelemedicineBookingComponent,
  VideoCallComponent,
  WaitingApprovalComponent,
  WelcomeComponent,
  CreateAccountComponent,
  MemberPortalComponent,
} from './member';
import { AdminWelcomeComponent } from './admin/admin-welcome/admin-welcome.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { AdminOverviewComponent } from './admin/admin-overview/admin-overview.component';
import { AdminPreRegistrationComponent } from './admin/admin-pre-registration/admin-pre-registration.component';
import { AdminGroupsPaymentsComponent } from './admin/admin-groups-payments/admin-groups-payments.component';
import { AdminClaimsScoringComponent } from './admin/admin-claims-scoring/admin-claims-scoring.component';
import { AdminHealthServicesComponent } from './admin/admin-health-services/admin-health-services.component';
import { AdminAnalyticsComponent } from './admin/admin-analytics/admin-analytics.component';

const routes: Routes = [
  { path: 'admin/welcome', component: AdminWelcomeComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: AdminOverviewComponent },
      { path: 'pre-registration', component: AdminPreRegistrationComponent },
      { path: 'groups-payments', component: AdminGroupsPaymentsComponent },
      { path: 'claims-scoring', component: AdminClaimsScoringComponent },
      { path: 'health-services', component: AdminHealthServicesComponent },
      { path: 'analytics', component: AdminAnalyticsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'app',
    component: MemberAppComponent,
    canActivate: [MemberAuthGuard],
    children: [
      { path: '', component: GroupsDashboardComponent },
      { path: 'submit-claim', component: SubmitClaimComponent },
      { path: 'claims-history', component: ClaimsHistoryComponent },
      { path: 'rewards', component: RewardsChallengeComponent },
      { path: 'doctors', component: DoctorDirectoryComponent },
      { path: 'create-join-group', component: BrowseGroupsComponent },
      { path: 'browse-groups', component: BrowseGroupsComponent },
      { path: 'medications', component: MedicationRecommendationsComponent },
      { path: 'health', component: HealthToolsHubComponent },
      { path: 'pharmacy-qr', component: PharmacyQrComponent },
      { path: 'payment-history', component: PaymentHistoryComponent },
      { path: 'telemedicine-booking', component: TelemedicineBookingComponent },
      { path: 'video-call/:appointmentId', component: VideoCallComponent },
      { path: 'profile', component: MemberProfileComponent },
      { path: 'messages', component: MemberMessagesComponent },
      { path: 'group-chat', component: MemberMessagesComponent },
      { path: 'invite-qr', component: InvitationQrComponent },
      { path: 'chatbot', component: MemberChatbotComponent },
    ],
  },
  {
    path: '',
    component: MemberRootComponent,
    children: [
      {
        path: 'member-app',
        component: MemberAppComponent,
        canActivate: [MemberAuthGuard],
        children: [
          { path: '', component: GroupsDashboardComponent },
          { path: 'submit-claim', component: SubmitClaimComponent },
          { path: 'claims-history', component: ClaimsHistoryComponent },
          { path: 'rewards', component: RewardsChallengeComponent },
          { path: 'doctors', component: DoctorDirectoryComponent },
          { path: 'create-join-group', component: BrowseGroupsComponent },
          { path: 'browse-groups', component: BrowseGroupsComponent },
          { path: 'medications', component: MedicationRecommendationsComponent },
          { path: 'health', component: HealthToolsHubComponent },
          { path: 'pharmacy-qr', component: PharmacyQrComponent },
          { path: 'payment-history', component: PaymentHistoryComponent },
          { path: 'telemedicine-booking', component: TelemedicineBookingComponent },
          { path: 'video-call/:appointmentId', component: VideoCallComponent },
          { path: 'profile', component: MemberProfileComponent },
          { path: 'messages', component: MemberMessagesComponent },
          { path: 'group-chat', component: MemberMessagesComponent },
          { path: 'invite-qr', component: InvitationQrComponent },
          { path: 'chatbot', component: MemberChatbotComponent },
        ],
      },
      { path: 'dashboard', redirectTo: 'member-app', pathMatch: 'full' },
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', component: AdminWelcomeComponent },
      { path: 'sign-in', component: MemberPortalComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'face-login', component: FaceRecognitionLoginComponent },
      { path: 'verify-cin', component: CinVerificationComponent },
      { path: 'medical-history', component: MedicalHistoryComponent },
      { path: 'excluded', component: ExcludedConditionsComponent },
      { path: 'calculating', component: PriceCalculationComponent },
      { path: 'select-plan', component: PlanSelectionComponent },
      { path: 'waiting-approval', component: WaitingApprovalComponent },
      { path: 'member-profile', component: MemberProfileOnboardingComponent },
      { path: 'browse-groups', component: BrowseGroupsComponent },
      { path: 'first-payment', component: FirstPaymentComponent },
      { path: 'create-account', component: CreateAccountComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
