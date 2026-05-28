import { Navigate, Route, Routes } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import AboutPage from "./pages/about/AboutPage.jsx";
import ExportsPage from "./pages/exports/ExportsPage.jsx";
import CareerPage from "./pages/career/CareerPage.jsx";
import ContactPage from "./pages/contact/ContactPage.jsx";
import DealersPage from "./pages/dealers/DealersPage.jsx";
import AchievementsPage from "./pages/achievements/AchievementsPage.jsx";
import InvestorPage from "./pages/investor/InvestorPage.jsx";
import CategoryPage from "./pages/category/CategoryPage.jsx";

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
