import { normalizePath } from "../../site-routing.js";

export const INVESTOR_TAB_IDS = [
  "prospectus",
  "grievance",
  "shareholding",
  "board",
  "policies",
  "governance",
  "annual",
  "secretarial",
  "announcements",
  "agm",
  "financial",
  "dispute",
  "memorandum",
  "kmp",
  "updates",
  "reconciliation",
];

export function getInvestorHref(tabId) {
  if (tabId === "prospectus") {
    return "/investor";
  }

  return `/investor/${tabId}`;
}

export function getInvestorActiveTab(pathname) {
  const path = normalizePath(pathname);

  if (path === "/investor") {
    return "prospectus";
  }

  const match = path.match(/^\/investor\/([^/]+)$/);
  return match?.[1] ?? "prospectus";
}

export function isInvestorPath(pathname) {
  const path = normalizePath(pathname);
  return path === "/investor" || path.startsWith("/investor/");
}
