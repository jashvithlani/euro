import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout.jsx";
import HomePage from "./pages/home/HomePage.jsx";

const AboutPage = lazy(() => import("./pages/about/AboutPage.jsx"));
const ExportsPage = lazy(() => import("./pages/exports/ExportsPage.jsx"));
const CareerPage = lazy(() => import("./pages/career/CareerPage.jsx"));
const ContactPage = lazy(() => import("./pages/contact/ContactPage.jsx"));
const DealersPage = lazy(() => import("./pages/dealers/DealersPage.jsx"));
const AchievementsPage = lazy(() => import("./pages/achievements/AchievementsPage.jsx"));
const CategoryPage = lazy(() => import("./pages/category/CategoryPage.jsx"));
const InvestorLayout = lazy(() => import("./pages/investor/InvestorLayout.jsx"));

const lazyInvestorPage = (exportName) =>
  lazy(() =>
    import("./pages/investor/investor-pages.js").then((module) => ({
      default: module[exportName],
    })),
  );

const AgmPage = lazyInvestorPage("AgmPage");
const AnnouncementsPage = lazyInvestorPage("AnnouncementsPage");
const AnnualPage = lazyInvestorPage("AnnualPage");
const BoardPage = lazyInvestorPage("BoardPage");
const CreditRatingsPage = lazyInvestorPage("CreditRatingsPage");
const DisputePage = lazyInvestorPage("DisputePage");
const FinancialPage = lazyInvestorPage("FinancialPage");
const GovernancePage = lazyInvestorPage("GovernancePage");
const GrievancePage = lazyInvestorPage("GrievancePage");
const InvestorIndexPage = lazyInvestorPage("InvestorIndexPage");
const KmpPage = lazyInvestorPage("KmpPage");
const MemorandumPage = lazyInvestorPage("MemorandumPage");
const PoliciesPage = lazyInvestorPage("PoliciesPage");
const ReconciliationPage = lazyInvestorPage("ReconciliationPage");
const SecretarialPage = lazyInvestorPage("SecretarialPage");
const ShareholdingPage = lazyInvestorPage("ShareholdingPage");
const UpdatesPage = lazyInvestorPage("UpdatesPage");

function deferred(element) {
  return (
    <Suspense
      fallback={(
        <main className="route-loading" aria-label="Loading page" />
      )}
    >
      {element}
    </Suspense>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={deferred(<AboutPage />)} />
        <Route path="/exports" element={deferred(<ExportsPage />)} />
        <Route path="/career" element={deferred(<CareerPage />)} />
        <Route path="/contact" element={deferred(<ContactPage />)} />
        <Route path="/dealers" element={deferred(<DealersPage />)} />
        <Route path="/dealer" element={<Navigate to="/dealers" replace />} />
        <Route path="/achievements" element={deferred(<AchievementsPage />)} />
        <Route path="/investor" element={deferred(<InvestorLayout />)}>
          <Route index element={<InvestorIndexPage />} />
          <Route path="grievance" element={<GrievancePage />} />
          <Route path="shareholding" element={<ShareholdingPage />} />
          <Route path="board" element={<BoardPage />} />
          <Route path="policies" element={<PoliciesPage />} />
          <Route path="credit-ratings" element={<CreditRatingsPage />} />
          <Route path="governance" element={<GovernancePage />} />
          <Route path="annual" element={<AnnualPage />} />
          <Route path="secretarial" element={<SecretarialPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="agm" element={<AgmPage />} />
          <Route path="financial" element={<FinancialPage />} />
          <Route path="dispute" element={<DisputePage />} />
          <Route path="memorandum" element={<MemorandumPage />} />
          <Route path="kmp" element={<KmpPage />} />
          <Route path="updates" element={<UpdatesPage />} />
          <Route path="reconciliation" element={<ReconciliationPage />} />
          <Route path="*" element={<Navigate to="/investor" replace />} />
        </Route>
        <Route path="/chips" element={deferred(<CategoryPage pageKey="chips" />)} />
        <Route path="/beverages" element={deferred(<CategoryPage pageKey="beverages" />)} />
        <Route path="/bevereges" element={<Navigate to="/beverages" replace />} />
        <Route path="/getmore" element={deferred(<CategoryPage pageKey="getmore" />)} />
        <Route path="/namkeen" element={deferred(<CategoryPage pageKey="namkeen" />)} />
        <Route path="/chikki" element={deferred(<CategoryPage pageKey="chikki" />)} />
        <Route path="/khakhra" element={deferred(<CategoryPage pageKey="khakhra" />)} />
        <Route path="/bakery" element={deferred(<CategoryPage pageKey="bakery" />)} />
        <Route path="/fryums" element={deferred(<CategoryPage pageKey="fryums" />)} />
        <Route path="/farali" element={deferred(<CategoryPage pageKey="farali" />)} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
