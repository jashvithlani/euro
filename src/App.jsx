import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout.jsx";
import HomePage from "./pages/home/HomePage.jsx";

const AboutPage = lazy(() => import("./pages/about/AboutPage.jsx"));
const ExportsPage = lazy(() => import("./pages/exports/ExportsPage.jsx"));
const CareerPage = lazy(() => import("./pages/career/CareerPage.jsx"));
const ContactPage = lazy(() => import("./pages/contact/ContactPage.jsx"));
const DealersPage = lazy(() => import("./pages/dealers/DealersPage.jsx"));
const AchievementsPage = lazy(() => import("./pages/achievements/AchievementsPage.jsx"));
const InvestorPage = lazy(() => import("./pages/investor/InvestorPage.jsx"));
const CategoryPage = lazy(() => import("./pages/category/CategoryPage.jsx"));

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/exports" element={<ExportsPage />} />
        <Route path="/career" element={<CareerPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/dealers" element={<DealersPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/investor" element={<InvestorPage />} />
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
