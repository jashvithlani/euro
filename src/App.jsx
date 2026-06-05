import { Navigate, Route, Routes } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import AboutPage from "./pages/about/AboutPage.jsx";
import ExportsPage from "./pages/exports/ExportsPage.jsx";
import CareerPage from "./pages/career/CareerPage.jsx";
import ContactPage from "./pages/contact/ContactPage.jsx";
import DealersPage from "./pages/dealers/DealersPage.jsx";
import AchievementsPage from "./pages/achievements/AchievementsPage.jsx";
import CategoryPage from "./pages/category/CategoryPage.jsx";
import HangoutPage from "./pages/hangout/HangoutPage.jsx";
import InvestorLayout from "./pages/investor/InvestorLayout.jsx";
import {
  AgmPage,
  AnnouncementsPage,
  AnnualPage,
  BoardPage,
  DisputePage,
  FinancialPage,
  GovernancePage,
  GrievancePage,
  InvestorIndexPage,
  KmpPage,
  MemorandumPage,
  PoliciesPage,
  ReconciliationPage,
  SecretarialPage,
  ShareholdingPage,
  UpdatesPage,
} from "./pages/investor/investor-pages.js";

export default function App() {
  return (
    <Routes>
      {/* Unlisted — no nav links; URL-only access */}
      <Route path="/vrushti-hangout" element={<HangoutPage />} />
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/exports" element={<ExportsPage />} />
        <Route path="/career" element={<CareerPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/dealers" element={<DealersPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/investor" element={<InvestorLayout />}>
          <Route index element={<InvestorIndexPage />} />
          <Route path="grievance" element={<GrievancePage />} />
          <Route path="shareholding" element={<ShareholdingPage />} />
          <Route path="board" element={<BoardPage />} />
          <Route path="policies" element={<PoliciesPage />} />
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
        <Route path="/chips" element={<CategoryPage pageKey="chips" />} />
        <Route path="/beverages" element={<CategoryPage pageKey="beverages" />} />
        <Route path="/getmore" element={<CategoryPage pageKey="getmore" />} />
        <Route path="/namkeen" element={<CategoryPage pageKey="namkeen" />} />
        <Route path="/chikki" element={<CategoryPage pageKey="chikki" />} />
        <Route path="/khakhra" element={<CategoryPage pageKey="khakhra" />} />
        <Route path="/bakery" element={<CategoryPage pageKey="bakery" />} />
        <Route path="/fryums" element={<CategoryPage pageKey="fryums" />} />
        <Route path="/farali" element={<CategoryPage pageKey="farali" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
