# Investor Pages — Final Review

**Review date:** 2026-05-28  
**Figma file:** `2cZtlXU663ataMAsZYzoGP`  
**Viewport:** 1280×900 (Playwright screenshots in `review-screenshots/investor-v2/`)  
**Build:** `npm run build` — **pass** (416 modules)

## Executive summary

The investor area has a solid **shared shell** (`InvestorLayout`, hero, filter nav, optional transparency band) and **11 builder-assigned Figma frames are largely implemented** in code. **Prospectus**, **grievance**, **shareholding**, **board**, **policies**, **governance**, **annual**, **secretarial**, **announcements**, **AGM**, **financial**, and **KMP** have dedicated components and data — not generic `InvestorDocumentSection` placeholders.

**Four routes remain placeholders** (`dispute`, `memorandum`, `updates`, `reconciliation`): they still render the shared “Documents coming soon” card. No dedicated Figma frame was in the parallel-builder node list; treat as **P0** if those tabs must ship.

**Cross-cutting shell issues:** default `.investor-main { height: 1521px; overflow: hidden }` clips tall pages unless a route-specific height modifier exists; several subpages still show the **prospectus transparency** block when Figma omits it; many **download links use `href="#"`**.

---

## Architecture (verified)

| Piece | Location | Notes |
|--------|-----------|--------|
| Layout shell | `InvestorLayout.jsx` | Hero + `InvestorFilterNav` + `<Outlet />` + conditional `InvestorTransparency` |
| Routes | `App.jsx` nested under `/investor` | 16 child routes + `*` → redirect to `/investor` |
| Tab config | `investor-tabs.js`, `investor-routing.js` | 16 tabs; `getInvestorActiveTab` drives nav `aria-current` |
| Shared prospectus card | `InvestorDocumentSection.jsx` + `investor-content.jsx` | Only `prospectus` has real copy; others fall back to placeholder |
| Global styles | `InvestorPage.css`, `InvestorFilterNav.css` | Per-route heights via `.investor-main--*` and `:has(...)` |
| Assets | `pages/investor/**/assets/`, `asset.js` | Co-located per section; SVG/PNG imports via `import.meta.url` |

---

## Figma → route mapping

| Figma node | Figma frame name | Route | Page module | Screenshot (1280px) |
|------------|------------------|-------|-------------|-------------------|
| `1103:4364` | Investor Relations - Multi-Line Navigation | `/investor` | `InvestorIndexPage.jsx` | `review-screenshots/investor-v2/index.png` |
| `1105:4593` | Investor Grievance | `/investor/grievance` | `grievance/GrievancePage.jsx` | `grievance.png` |
| `1110:4838` | Shareholding Pattern | `/investor/shareholding` | `shareholding/ShareholdingPage.jsx` | `shareholding.png` |
| `1110:5167` | Composition of Board | `/investor/board` | `board/BoardPage.jsx` → `InvestorBoardSection` | `board.png` |
| `1117:5551` | Corporate Policies | `/investor/policies` | `policies/PoliciesPage.jsx` | `policies.png` |
| `1117:5978` | Corporate Governance Reports | `/investor/governance` | `governance/GovernancePage.jsx` | `governance.png` |
| `1117:6898` | Corporate Announcements | `/investor/announcements` | `announcements/AnnouncementsPage.jsx` | `announcements.png` |
| `1119:7391` | AGM/EGM | `/investor/agm` | `agm/AgmPage.jsx` | `agm.png` |
| `1130:37` | Financial Information | `/investor/financial` | `financial/InvestorFinancialSection.jsx` | `financial.png` |
| `1130:449` | Annual Reports | `/investor/annual` | `annual/InvestorAnnualReports.jsx` | `annual.png` |
| `1130:887` | Annual Secretarial Compliance Report | `/investor/secretarial` | `secretarial/SecretarialPage.jsx` | `secretarial.png` |
| `1130:1288` | Authorized KMP's for Determining Materiality… | `/investor/kmp` | `components/InvestorKmpSection.jsx` | `kmp.png` |
| — | *(no builder frame assigned)* | `/investor/dispute` | `dispute/DisputePage.jsx` | `dispute.png` |
| — | *(no builder frame assigned)* | `/investor/memorandum` | `memorandum/MemorandumPage.jsx` | `memorandum.png` |
| — | *(no builder frame assigned)* | `/investor/updates` | `updates/UpdatesPage.jsx` | `updates.png` |
| — | *(no builder frame assigned)* | `/investor/reconciliation` | `reconciliation/ReconciliationPage.jsx` | `reconciliation.png` |

---

## Per-route status

| Route | Status | Notes |
|-------|--------|--------|
| `/investor` | **Pass** | Prospectus card, download CTA, transparency band match landing frame. |
| `/investor/grievance` | **Pass** | Dual-column CS + RTA layout; transparency correctly hidden (`investor-main--grievance`). |
| `/investor/shareholding` | **Partial** | FY tabs, doc grid, promo card implemented (`height: 1867px` in CSS) but **viewport still clips** footer/promo; verify `:has(.investor-shareholding)` in built CSS. |
| `/investor/board` | **Partial** | Directors + committee tables present; `min-height: 2520px` set but **lower committees clipped** in 1280×900 shot — may need taller canvas or scroll. |
| `/investor/policies` | **Pass** | FY-grouped policy cards; transparency repositioned (`:has(.investor-policies)`). |
| `/investor/governance` | **Partial** | Year tabs + doc cards render; **no `investor-main` height override** → content clipped at default 1521px; **transparency still shown** (not in Figma governance frame). |
| `/investor/annual` | **Partial** | Bento / archive layout strong; bottom archive rows **clipped**; transparency hidden. |
| `/investor/secretarial` | **Pass** | Archive explorer + report list + newsletter CTA; transparency hidden. |
| `/investor/announcements` | **Pass** | FY tabs, compact grids, report cards; tall canvas `2560px`; transparency hidden. |
| `/investor/agm` | **Pass** | Year tabs, document grids, postal ballot section; transparency hidden. |
| `/investor/financial` | **Pass** | Quarterly cards in two rows; transparency hidden via `FinancialPage.css`. |
| `/investor/kmp` | **Partial** | Profile grid matches Figma intent; **row 2 clipped** at 1280×900 (`investor-main--kmp` height 1560px may be tight). |
| `/investor/dispute` | **Fail** | Placeholder `InvestorDocumentSection` only. |
| `/investor/memorandum` | **Fail** | Placeholder only. |
| `/investor/updates` | **Fail** | Placeholder only. |
| `/investor/reconciliation` | **Fail** | Placeholder only. |

---

## Visual / shell gaps (from screenshots)

1. **Fixed canvas + `overflow: hidden`** on `.investor-main` (1521px default) — tall Figma frames (board, annual, shareholding, governance, KMP) lose footer content unless each route sets `height` / `min-height` (some do; governance does not).
2. **Transparency band** — Correctly hidden on grievance, annual, secretarial, AGM, financial, KMP, announcements. Still visible on **governance**, **policies**, **shareholding**, and **placeholder** routes — mismatch vs several Figma subpages.
3. **Filter nav active state** — Works (`is-active` pink pill, `aria-current="page"`); verified on all screenshots.
4. **Placeholder routes** — Show generic PDF card + “Documents coming soon” + transparency (prospectus marketing copy) — clearly not production-ready.

---

## Code review notes

### CSS organization

- **Good:** Route-scoped CSS (`GrievancePage.css`, `ShareholdingPage.css`, `BoardPage.css`, `PoliciesPage.css`, `GovernancePage.css`, `AnnualPage.css`, etc.) plus shared `InvestorPage.css` for shell/transparency/KMP.
- **Risk:** Height/transparency `top` overrides split across `InvestorPage.css` and route CSS — easy to miss when adding a route (e.g. governance).
- **Duplicate patterns:** Multiple `InvestorYearTabs` implementations (`components/InvestorYearTabs.jsx` vs `announcements/components/InvestorYearTabs.jsx`) — consider consolidating later, not blocking.

### Assets

- Section assets live under `src/pages/investor/**/assets/` (grievance icons, policy icons, annual bento images, etc.).
- Hero uses `investor-hero-photo.png` / `investor-hero-texture.png`; transparency uses `investor-transparency.png` (also `investor-transparency-photo.png` present — confirm which matches Figma export).

### Routing / data

- `investor-pages.js` exports all page components; wiring is complete.
- Many PDFs/links still `href="#"` in content modules — needs CMS or static URL pass before release.

### Build / preview

- Production **`npm run build` succeeds** after latest board/annual wiring.
- **`vite preview` deep links** returned blank pages in this review (likely preview + client-router timing); use **`npm run dev`** for route QA.

---

## Required fixes by route

### P0 — Ship blockers

| Route | Fix |
|-------|-----|
| `dispute`, `memorandum`, `updates`, `reconciliation` | Implement dedicated sections (or remove/hide tabs) — stop shipping `InvestorDocumentSection` fallback. |
| `governance` | Add `.investor-main` height (~2167px scaled) and **hide transparency**; match `1117:5978` doc grid without clipping. |
| `shareholding` | Confirm `height: 1867px` applies in build; extend if promo/footer still clipped. |

### P1 — Figma parity

| Route | Fix |
|-------|-----|
| `board` | Ensure full committee tables visible (audit, stakeholder, nomination); adjust `min-height` or allow scroll. |
| `annual` | Extend canvas for “Previous Archives” grid; hide or reposition transparency per frame. |
| `kmp` | Tune `investor-main--kmp` height so second row of profile cards is visible at 1280×900. |
| `policies` | Confirm transparency placement vs Figma (currently shown at `top: 1373px`). |
| All implemented routes | Replace `#` download hrefs with real document URLs. |

### P2 — Polish

- Add `investor-main--*` layout flags in `InvestorLayout` for governance/shareholding (consistent with grievance/annual) instead of relying only on `:has()`.
- Document which subpages omit transparency in `InvestorLayout.jsx` comments.
- Add Playwright smoke script for 16 routes in CI (optional).

---

## Priority list (ordered)

1. Implement or disable **dispute / memorandum / updates / reconciliation** placeholders.  
2. Fix **governance** canvas height + transparency visibility.  
3. Fix **clipping** on shareholding, board, annual, KMP (heights / overflow strategy).  
4. Wire **real PDF URLs** across content modules.  
5. Consolidate year-tab component and audit transparency rules per route.  

---

## Screenshots

Captured at **1280×900** via Playwright against **`npm run dev`** (post-build source):

`review-screenshots/investor-v2/{index,grievance,shareholding,board,policies,governance,annual,secretarial,announcements,agm,financial,dispute,memorandum,kmp,updates,reconciliation}.png`

Earlier captures under `review-screenshots/investor/` may reflect **stale dev server** state — prefer `investor-v2` for review.

---

## Coordinator summary

**Done well:** Nested routing, filter nav with correct active states, shared hero, and **12/16** tabs with real bespoke UI aligned to assigned Figma frames. Build is green.

**Not done:** **4 tabs still placeholders**; **governance** (and several tall pages) suffer from **1521px overflow clipping**; **transparency** appears on some subpages where Figma does not; document links largely stubbed.

**Recommend:** Block merge on P0 items; assign follow-up builders to the four placeholder routes or descope those URLs until designs exist.
