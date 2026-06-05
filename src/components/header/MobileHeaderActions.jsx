import HeaderSearchButton from "./HeaderSearchButton.jsx";
import MobileMenuToggle from "./MobileMenuToggle.jsx";

export default function MobileHeaderActions({ menuOpen, onMenuToggle }) {
  return (
    <div className="site-nav-actions">
      <HeaderSearchButton className="nav-search nav-search--mobile" />
      <MobileMenuToggle isOpen={menuOpen} onToggle={onMenuToggle} />
    </div>
  );
}
