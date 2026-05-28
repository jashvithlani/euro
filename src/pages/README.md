# Pages

Each route page lives in its own folder with JSX, CSS (when used), and local assets.

```
pages/
  home/
    HomePage.jsx
    HomePage.css
    asset.js          # asset('file.png') → resolved URL
    assets/
  about/
    ...
  category/
    ...
```

Site-wide assets (logos, footer, favicons) live in [`../shared/assets/`](../shared/assets/) and are loaded via `sharedAsset()` from [`../shared/asset.js`](../shared/asset.js).

Favicons are copied to `public/` for `index.html`.
