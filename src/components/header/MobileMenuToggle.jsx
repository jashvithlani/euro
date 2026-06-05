export default function MobileMenuToggle({ isOpen, onToggle }) {
  return (
    <button
      className="nav-icon nav-menu-toggle"
      type="button"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      onClick={onToggle}
    >
      <span />
      <span />
      <span />
    </button>
  );
}
