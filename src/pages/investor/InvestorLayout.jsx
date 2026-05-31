import { Outlet, useLocation } from "react-router-dom";
import InvestorFilterNav from "./components/InvestorFilterNav.jsx";
import InvestorHero from "./components/InvestorHero.jsx";
import InvestorTransparency from "./components/InvestorTransparency.jsx";
import { getInvestorActiveTab } from "./investor-routing.js";
import "./InvestorPage.css";

export default function InvestorLayout() {
  const { pathname } = useLocation();
  const activeTab = getInvestorActiveTab(pathname);
  const isKmpPage = activeTab === "kmp";
  const isSecretarialPage = activeTab === "secretarial";
  const isFinancialPage = activeTab === "financial";
  const isAgmPage = activeTab === "agm";
  const isGrievancePage = activeTab === "grievance";
  const isAnnualPage = activeTab === "annual";
  const isAnnouncementsPage = activeTab === "announcements";
  const isReconciliationPage = activeTab === "reconciliation";
  const isMemorandumPage = activeTab === "memorandum";
  const isUpdatesPage = activeTab === "updates";
  const isDisputePage = activeTab === "dispute";
  const isShareholdingPage = activeTab === "shareholding";
  const isPoliciesPage = activeTab === "policies";
  const isGovernancePage = activeTab === "governance";
  const isBoardPage = activeTab === "board";
  const hideTransparency =
    isKmpPage ||
    isSecretarialPage ||
    isAgmPage ||
    isGrievancePage ||
    isAnnualPage ||
    isAnnouncementsPage ||
    isFinancialPage ||
    isReconciliationPage ||
    isMemorandumPage ||
    isUpdatesPage ||
    isDisputePage ||
    isShareholdingPage ||
    isPoliciesPage ||
    isGovernancePage ||
    isBoardPage;

  const mainClassName = [
    "investor-main",
    isKmpPage ? "investor-main--kmp" : "",
    isSecretarialPage ? "investor-main--secretarial" : "",
    isFinancialPage ? "investor-main--financial" : "",
    isAgmPage ? "investor-main--agm" : "",
    isGrievancePage ? "investor-main--grievance" : "",
    isAnnualPage ? "investor-main--annual" : "",
    isAnnouncementsPage ? "investor-main--announcements" : "",
    isReconciliationPage ? "investor-main--reconciliation" : "",
    isMemorandumPage ? "investor-main--memorandum" : "",
    isUpdatesPage ? "investor-main--updates" : "",
    isDisputePage ? "investor-main--dispute" : "",
    isShareholdingPage ? "investor-main--shareholding" : "",
    isPoliciesPage ? "investor-main--policies" : "",
    isGovernancePage ? "investor-main--governance" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main className={mainClassName} aria-labelledby="investor-hero-title">
      <InvestorHero />
      <InvestorFilterNav />
      <Outlet />
      {!hideTransparency && <InvestorTransparency />}
    </main>
  );
}
