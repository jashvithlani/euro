import { useEffect } from "react";
import {
  SITE_BOOTSTRAP_STORAGE_KEY,
  startSiteBootstrap,
  subscribeToSiteBootstrap,
} from "../site-bootstrap.js";
import {
  delay,
  waitForCurrentPageReady,
  waitForImageElement,
} from "./page-loading.js";

const MINIMUM_DISPLAY_MS = 650;
const SITE_BOOTSTRAP_MAX_WAIT_MS = 30000;
const CURRENT_PAGE_MAX_WAIT_MS = 5000;

function rememberBootstrap() {
  try {
    window.sessionStorage.setItem(SITE_BOOTSTRAP_STORAGE_KEY, "1");
  } catch {
    // Storage can be unavailable in privacy-restricted browsers.
  }
}

export default function InitialPageLoader() {
  useEffect(() => {
    const loader = document.getElementById("initial-page-loader");
    const html = document.documentElement;

    if (!loader || html.dataset.euroLoader !== "active") return undefined;

    let cancelled = false;
    const progressBar = loader.querySelector(".initial-loader__progress");
    const progressTrack = loader.querySelector('[role="progressbar"]');
    const label = loader.querySelector(".initial-loader__label");
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const startedAt = Number(window.__EURO_LOADER_STARTED_AT__) || window.performance.now();

    const unsubscribe = subscribeToSiteBootstrap(({ progress, label: nextLabel }) => {
      if (cancelled) return;
      const boundedProgress = Math.min(0.96, Math.max(0.03, progress));
      if (progressBar) {
        progressBar.style.transform = `scaleX(${boundedProgress})`;
        progressBar.style.animation = "none";
      }
      progressTrack?.setAttribute("aria-valuenow", String(Math.round(boundedProgress * 100)));
      if (label && nextLabel) label.textContent = nextLabel;
    });

    const bootstrapReady = Promise.race([
      startSiteBootstrap(),
      delay(SITE_BOOTSTRAP_MAX_WAIT_MS),
    ]);
    const currentPageReady = Promise.race([
      Promise.all([
        waitForCurrentPageReady(CURRENT_PAGE_MAX_WAIT_MS),
        waitForImageElement(document.querySelector(".site-logo img")),
        document.fonts?.ready || Promise.resolve(),
      ]),
      delay(CURRENT_PAGE_MAX_WAIT_MS),
    ]);

    const finish = async () => {
      await Promise.all([bootstrapReady, currentPageReady]);

      const elapsed = window.performance.now() - startedAt;
      const minimum = reducedMotion ? 120 : MINIMUM_DISPLAY_MS;
      if (elapsed < minimum) await delay(minimum - elapsed);
      if (cancelled) return;

      rememberBootstrap();
      if (label) label.textContent = "Ready to crunch.";
      progressTrack?.setAttribute("aria-valuenow", "100");
      loader.classList.add("is-ready");

      await delay(reducedMotion ? 20 : 180);
      if (cancelled) return;

      loader.classList.add("is-leaving");
      html.dataset.euroLoader = "skip";

      await delay(reducedMotion ? 0 : 360);
      if (!cancelled) loader.remove();
    };

    finish();
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return null;
}
