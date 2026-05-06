import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import {
  CinVerificationComponent,
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
import { AdminAdherenceComponent } from './admin/admin-adherence/admin-adherence.component';
import { ClaimHistory } from './member/app-pages/Score/claim-history/claim-history';
import { SubmitClaimComponent } from './member/app-pages/Score/submit-claim/submit-claim';
import { ClaimListComponent } from './member/app-pages/Score/claim-list/claim-list';
import { MemberRewardsComponent } from './member/app-pages/Score/member-reward/member-reward';

@NgModule({
  declarations: [
    App,
    MemberRootComponent,
    MemberAppComponent,
    HomeComponent,
    WelcomeComponent,
    MemberSignInComponent,
    MemberPortalComponent,
    ForgotPasswordComponent,
    FaceRecognitionLoginComponent,
    CinVerificationComponent,
    MedicalHistoryComponent,
    MemberProfileOnboardingComponent,
    ExcludedConditionsComponent,
    PriceCalculationComponent,
    PlanSelectionComponent,
    WaitingApprovalComponent,
    FirstPaymentComponent,
    GroupsDashboardComponent,
    BrowseGroupsComponent,
    MemberProfileComponent,
    MemberMessagesComponent,
    InvitationQrComponent,
    MemberChatbotComponent,
    RewardsChallengeComponent,
    DoctorDirectoryComponent,
    MedicationRecommendationsComponent,
    HealthToolsHubComponent,
    PharmacyQrComponent,
    PaymentHistoryComponent,
    TelemedicineBookingComponent,
    VideoCallComponent,
    CreateAccountComponent,
    AdminWelcomeComponent,
    AdminLayoutComponent,
    AdminOverviewComponent,
    AdminPreRegistrationComponent,
    AdminGroupsPaymentsComponent,
    AdminClaimsScoringComponent,
    AdminHealthServicesComponent,
    AdminAnalyticsComponent,
    AdminAdherenceComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    SubmitClaimComponent,
    ClaimListComponent,
    MemberRewardsComponent
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [App],
})
export class AppModule {}
