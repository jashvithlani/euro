# Pages

Each route page lives in its own folder with JSX, CSS (when used), and local assets.

```
pages/
  home/
    HomePage.jsx
    HomePage.css
    asset.js
    assets/
  investor/
    InvestorLayout.jsx    # shared shell: hero, subnav, transparency
    InvestorPage.css
    InvestorIndexPage.jsx # /investor
    components/           # InvestorFilterNav, InvestorHero, …
    grievance/GrievancePage.jsx   # /investor/grievance
    …
```

Site-wide assets (logos, footer, favicons) live in [`../shared/assets/`](../shared/assets/) and are loaded via `sharedAsset()` from [`../shared/asset.js`](../shared/asset.js).

Favicons are copied to `public/` for `index.html`.
