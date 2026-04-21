import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { AuthInterceptor } from './interceptors/auth.interceptor';
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
} from './member';

@NgModule({
  declarations: [
    App,
    MemberRootComponent,
    MemberAppComponent,
    HomeComponent,
    WelcomeComponent,
    MemberSignInComponent,
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
    SubmitClaimComponent,
    ClaimsHistoryComponent,
    RewardsChallengeComponent,
    DoctorDirectoryComponent,
    MedicationRecommendationsComponent,
    HealthToolsHubComponent,
    PharmacyQrComponent,
    PaymentHistoryComponent,
    TelemedicineBookingComponent,
    VideoCallComponent,
    CreateAccountComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [App]
})
export class AppModule { }
