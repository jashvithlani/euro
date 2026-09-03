import { useSyncExternalStore } from "react";

let homeSecondaryAssetsReady = false;
const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return homeSecondaryAssetsReady;
}

export function markHomeSecondaryAssetsReady() {
  if (homeSecondaryAssetsReady) return;
  homeSecondaryAssetsReady = true;
  listeners.forEach((listener) => listener());
}

export function scheduleHomeSecondaryAssets() {
  if (homeSecondaryAssetsReady || typeof window === "undefined") return;

  const release = () => markHomeSecondaryAssetsReady();
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(release, { timeout: 900 });
  } else {
    window.setTimeout(release, 120);
  }
}

export function useHomeSecondaryAssetsReady() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
