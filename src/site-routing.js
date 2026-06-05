export const CATEGORY_PATHS = new Set([
  "/chips",
  "/beverages",
  "/getmore",
  "/namkeen",
  "/chikki",
  "/khakhra",
  "/bakery",
  "/fryums",
  "/farali",
]);

export function normalizePath(pathname) {
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

export function getNavActive(pathname) {
  const path = normalizePath(pathname);

  if (path === "/") {
    return "home";
  }

  if (CATEGORY_PATHS.has(path)) {
    return "products";
  }

  if (path === "/dealers") {
    return "partner";
  }

  if (path === "/investor" || path.startsWith("/investor/")) {
    return "investor";
  }

  const slug = path.slice(1);
  const known = ["about", "exports", "career", "contact", "achievements"];

  if (known.includes(slug)) {
    return slug;
  }

  return "home";
}

export function getShellClassName(pathname) {
  const path = normalizePath(pathname);

  if (path === "/") {
    return "page-shell home-page";
  }

  if (CATEGORY_PATHS.has(path)) {
    return "page-shell category-page";
  }

  if (path === "/dealers") {
    return "page-shell dealers-page";
  }

  if (path === "/investor" || path.startsWith("/investor/")) {
    return "page-shell investor-page";
  }

  const slug = path.slice(1);
  return `page-shell ${slug}-page`;
}
