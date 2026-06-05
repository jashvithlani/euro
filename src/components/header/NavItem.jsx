import { Link } from "react-router-dom";

export default function NavItem({ item, active, onNavigate }) {
  const className = item.key === active ? "is-active" : undefined;
  const ariaCurrent = item.key === active ? "page" : undefined;

  if (item.href.startsWith("/")) {
    return (
      <Link className={className} to={item.href} aria-current={ariaCurrent} onClick={onNavigate}>
        {item.label}
      </Link>
    );
  }

  return (
    <a className={className} href={item.href} aria-current={ariaCurrent} onClick={onNavigate}>
      {item.label}
    </a>
  );
}
