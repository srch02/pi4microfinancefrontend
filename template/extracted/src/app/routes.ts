import { createBrowserRouter } from "react-router";
import { AdminRoot } from "./components/admin/AdminRoot";
import { Overview } from "./components/admin/Overview";
import { PreRegistration } from "./components/admin/PreRegistration";
import { GroupsPayments } from "./components/admin/GroupsPayments";
import { ClaimsScoring } from "./components/admin/ClaimsScoring";
import { HealthServices } from "./components/admin/HealthServices";
import { AnalyticsAdmin } from "./components/admin/AnalyticsAdmin";

// Member app
import { MemberRoot } from "./components/member/MemberRoot";
import { Welcome } from "./components/member/Welcome";
import { Login } from "./components/member/Login";
import { ForgotPassword } from "./components/member/ForgotPassword";
import { FacialRecognition } from "./components/member/FacialRecognition";
import { CINVerification } from "./components/member/CINVerification";
import { MedicalHistory } from "./components/member/MedicalHistory";
import { MedicalReviewWaiting } from "./components/member/MedicalReviewWaiting";
import { MemberProfileForm } from "./components/member/MemberProfileForm";
import { ExcludedConditions } from "./components/member/ExcludedConditions";
import { PriceCalculation } from "./components/member/PriceCalculation";
import { PlanSelection } from "./components/member/PlanSelection";
import { GroupSelection } from "./components/member/GroupSelection";
import { WaitingApproval } from "./components/member/WaitingApproval";
import { FirstPayment } from "./components/member/FirstPayment";
import { CreateAccount } from "./components/member/CreateAccount";

// Authenticated member area
import { MemberApp } from "./components/member/MemberApp";
import { GroupsDashboard } from "./components/member/GroupsDashboard";
import { GroupBrowsing } from "./components/member/GroupBrowsing";
import { CreateJoinGroup } from "./components/member/CreateJoinGroup";
import { MonthlyPayment } from "./components/member/MonthlyPayment";
import { PaymentHistory } from "./components/member/PaymentHistory";
import { SubmitClaim } from "./components/member/SubmitClaim";
import { ClaimsHistory } from "./components/member/ClaimsHistory";
import { RewardsChallenge } from "./components/member/RewardsChallenge";
import { DoctorDirectory } from "./components/member/DoctorDirectory";
import { TelemedicineBooking } from "./components/member/TelemedicineBooking";
import { VideoCall } from "./components/member/VideoCall";
import { MedicationRecommendations } from "./components/member/MedicationRecommendations";
import { PharmacyQR } from "./components/member/PharmacyQR";
import { HealthDashboard } from "./components/member/HealthDashboard";
import { HealthTools } from "./components/member/HealthTools";
import { GroupChat } from "./components/member/GroupChat";

export const router = createBrowserRouter([
  // Admin dashboard routes
  {
    path: "/admin",
    Component: AdminRoot,
    children: [
      { index: true, Component: Overview },
      { path: "pre-registration", Component: PreRegistration },
      { path: "groups-payments", Component: GroupsPayments },
      { path: "claims-scoring", Component: ClaimsScoring },
      { path: "health-services", Component: HealthServices },
      { path: "analytics-admin", Component: AnalyticsAdmin },
    ],
  },
  // Member onboarding routes (public)
  {
    path: "/",
    Component: MemberRoot,
    children: [
      { index: true, Component: Welcome },
      { path: "login", Component: Login },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "facial-recognition", Component: FacialRecognition },
      { path: "verify-cin", Component: CINVerification },
      { path: "medical-history", Component: MedicalHistory },
      { path: "medical-review", Component: MedicalReviewWaiting },
      { path: "member-profile", Component: MemberProfileForm },
      { path: "excluded", Component: ExcludedConditions },
      { path: "calculating", Component: PriceCalculation },
      { path: "select-plan", Component: PlanSelection },
      { path: "group-selection", Component: GroupSelection },
      { path: "first-payment", Component: FirstPayment },
      { path: "create-account", Component: CreateAccount },
      { path: "waiting-approval", Component: WaitingApproval },
    ],
  },
  // Authenticated member app routes
  {
    path: "/app",
    Component: MemberApp,
    children: [
      { index: true, Component: GroupsDashboard },
      { path: "browse-groups", Component: GroupBrowsing },
      { path: "create-join-group", Component: CreateJoinGroup },
      { path: "monthly-payment", Component: MonthlyPayment },
      { path: "payment-history", Component: PaymentHistory },
      { path: "submit-claim", Component: SubmitClaim },
      { path: "claims-history", Component: ClaimsHistory },
      { path: "rewards", Component: RewardsChallenge },
      { path: "doctors", Component: DoctorDirectory },
      { path: "telemedicine-booking", Component: TelemedicineBooking },
      { path: "video-call/:appointmentId", Component: VideoCall },
      { path: "medications", Component: MedicationRecommendations },
      { path: "pharmacy-qr", Component: PharmacyQR },
      { path: "health", Component: HealthDashboard },
      { path: "health-tools", Component: HealthTools },
      { path: "group-chat", Component: GroupChat },
    ],
  },
]);