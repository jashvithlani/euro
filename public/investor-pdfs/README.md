# Investor PDF Folder Conventions

Investor pages are driven by `scripts/generate-investor-documents.mjs`.
The browser does not read folders directly; `npm run dev` and `npm run build`
generate `src/pages/investor/generated/investor-documents.generated.js` from this folder.

Use these folders for new files:

```text
public/investor-pdfs/financial/2027-28/01-Quarter-ended-June-30-2027.pdf
public/investor-pdfs/governance/2027-28/01-Corporate-Governance-Report-as-on-30.06.2027.pdf
public/investor-pdfs/shareholding/2027-28/01-Shareholding-Pattern-as-on-30.06.2027.pdf
public/investor-pdfs/reconciliation/2027-28/01-Reconciliation-of-Share-Capital-Audit-Report-30.06.2027.pdf
public/investor-pdfs/agm/2027-28/01-Notice-of-Annual-General-Meeting.pdf
public/investor-pdfs/annual/2027-28/01-Annual-Report-2027-28.pdf
public/investor-pdfs/updates/2027/01-Credit-Rating-01.07.2027.pdf
public/investor-pdfs/secretarial/2027-28/01-Compliance-Report-2028.pdf
public/investor-pdfs/policies/corporate-policies/01-Board-Diversity-Policy.pdf
```

Announcements use one extra folder level for fiscal-year sections:

```text
public/investor-pdfs/announcements/2027-28/board-meetings/01-Intimation-of-Board-Meeting-27.05.2027.pdf
public/investor-pdfs/announcements/2027-28/general-announcements/01-Trading-Window-Closure-Q1.pdf
```

The bottom General Announcements section is root-level, then grouped by calendar year:

```text
public/investor-pdfs/announcements/general-announcements/2027/board-meetings/01-Outcome-of-Board-Meeting-27.05.2027.pdf
```

Numeric prefixes control display order and are removed from the on-page title.
If a filename has no numeric prefix, it is sorted by parsed date and then title.
