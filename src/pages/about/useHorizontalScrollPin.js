import { useEffect } from "react";

const MOBILE_NAV_HEIGHT = 76;

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function addMediaChangeListener(query, handler) {
  if (typeof query.addEventListener === "function") {
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }

  query.addListener(handler);
  return () => query.removeListener(handler);
}

function getStickyHeight() {
  return Math.max(320, window.innerHeight - MOBILE_NAV_HEIGHT);
}

function clearStickyPosition(sticky) {
  if (!sticky) return;

  sticky.style.position = "";
  sticky.style.top = "";
  sticky.style.left = "";
  sticky.style.right = "";
  sticky.style.width = "";
  sticky.style.height = "";
  sticky.style.zIndex = "";
}

function setStickyPinned(sticky, stickyHeight) {
  sticky.style.position = "fixed";
  sticky.style.top = `${MOBILE_NAV_HEIGHT}px`;
  sticky.style.left = "0";
  sticky.style.right = "0";
  sticky.style.width = "100%";
  sticky.style.height = `${stickyHeight}px`;
  sticky.style.zIndex = "2";
}

function setStickyAfterPin(sticky, stickyHeight, scrollRange) {
  sticky.style.position = "absolute";
  sticky.style.top = `${scrollRange}px`;
  sticky.style.left = "0";
  sticky.style.right = "0";
  sticky.style.width = "100%";
  sticky.style.height = `${stickyHeight}px`;
  sticky.style.zIndex = "2";
}

function getTranslateX(progress, maxScroll) {
  return -progress * maxScroll;
}

function updateTileMotion(track, tileSelector, progress, motion = "default") {
  if (!tileSelector) return;

  const tiles = track.querySelectorAll(tileSelector);
  const count = tiles.length;

  if (count <= 1) {
    if (count === 1) {
      tiles[0].style.setProperty("--tile-enter", "1");
    }
    return;
  }

  const segment = 1 / (count - 1);

  tiles.forEach((tile, index) => {
    const distance = Math.abs(progress - index * segment) / Math.max(segment, 0.001);

    if (motion === "soft") {
      const enter = clamp(1 - Math.max(0, distance - 0.4) * 0.45);
      tile.style.setProperty("--tile-visibility", enter.toFixed(3));
      tile.style.setProperty("--tile-enter", enter.toFixed(3));
      return;
    }

    const visibility = clamp(1 - distance * 0.9);
    const enter = clamp(visibility / 0.5);

    tile.style.setProperty("--tile-visibility", visibility.toFixed(3));
    tile.style.setProperty("--tile-enter", enter.toFixed(3));
  });
}

function updateDeckMotion(track, tileSelector, progress, direction = 1) {
  if (!tileSelector) return;

  const tiles = [...track.querySelectorAll(tileSelector)];
  const count = tiles.length;
  const position = progress * Math.max(0, count - 1);
  const activeIndex = Math.round(position);

  tiles.forEach((tile, index) => {
    const distance = index - position;
    const offset = clamp(distance, -1, 1) * direction;
    const isVisible = Math.abs(distance) <= 1.001;
    const isActive = index === activeIndex;

    tile.style.setProperty("--tile-offset", offset.toFixed(4));
    tile.style.setProperty("--tile-deck-opacity", isVisible ? "1" : "0");
    tile.style.setProperty("--tile-deck-y", "0px");
    tile.style.zIndex = isActive ? "2" : "1";
    tile.style.pointerEvents = isActive ? "auto" : "none";
    tile.inert = !isActive;
  });
}

function clearTileMotion(track, tileSelector) {
  if (!track || !tileSelector) return;

  track.querySelectorAll(tileSelector).forEach((tile) => {
    tile.style.removeProperty("--tile-visibility");
    tile.style.removeProperty("--tile-enter");
    tile.style.removeProperty("--tile-offset");
    tile.style.removeProperty("--tile-deck-opacity");
    tile.style.removeProperty("--tile-deck-y");
    tile.style.removeProperty("z-index");
    tile.style.removeProperty("pointer-events");
    tile.inert = false;
  });
}

function getSectionApproach(driverTop) {
  if (driverTop <= MOBILE_NAV_HEIGHT) {
    return 1;
  }

  return clamp(1 - (driverTop - MOBILE_NAV_HEIGHT) / 140);
}

function getSectionEdgeFade(progress, edgeFadeZone = 0.14) {
  return Math.min(progress / edgeFadeZone, (1 - progress) / edgeFadeZone, 1);
}

function updateStickyPinState(sticky, metrics, driverTop, driverBottom) {
  if (!sticky || !metrics) return;

  const pinEnd = MOBILE_NAV_HEIGHT + metrics.stickyHeight;

  if (driverTop <= MOBILE_NAV_HEIGHT && driverBottom > pinEnd) {
    setStickyPinned(sticky, metrics.stickyHeight);
    return;
  }

  if (driverBottom <= pinEnd) {
    setStickyAfterPin(sticky, metrics.stickyHeight, metrics.scrollRange);
    return;
  }

  clearStickyPosition(sticky);
}

export {
  MOBILE_NAV_HEIGHT,
  getStickyHeight,
  clearStickyPosition,
  updateStickyPinState,
};

export function useHorizontalScrollPin({
  driverRef,
  stickyRef,
  viewportRef,
  trackRef,
  tileWidthCssVar = "--scroll-tile-width",
  progressCssVar = "--scroll-progress",
  tileSelector,
  edgeFadeCssVar,
  approachCssVar,
  tileWidthScale = 1,
  tileMotion = "default",
  edgeFadeZone = 0.14,
  scrollMode = "track",
  deckDirection = 1,
  deckStepScale = 0.58,
}) {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mobileQuery = window.matchMedia("(max-width: 999px)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let rafId = 0;

    const resetScrollDriver = () => {
      const driver = driverRef.current;
      const track = trackRef.current;
      const viewport = viewportRef.current;

      driver?.style.removeProperty("height");
      driver?.style.removeProperty(tileWidthCssVar);
      driver?.style.removeProperty(progressCssVar);
      viewport?.style.removeProperty("width");
      track?.style.removeProperty("transform");
      clearStickyPosition(stickyRef.current);
      clearTileMotion(track, tileSelector);

      if (edgeFadeCssVar) {
        driver?.style.removeProperty(edgeFadeCssVar);
      }

      if (approachCssVar) {
        driver?.style.removeProperty(approachCssVar);
      }
    };

    const measure = () => {
      const driver = driverRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;

      if (!driver || !viewport || !track) {
        return null;
      }

      viewport.style.removeProperty("width");
      const viewportWidth = viewport.clientWidth;
      const stickyHeight = getStickyHeight();
      const tileWidth = Math.max(280, viewportWidth - 40) * tileWidthScale;

      driver.style.setProperty(tileWidthCssVar, `${tileWidth}px`);

      if (scrollMode === "deck") {
        const tileCount = tileSelector ? track.querySelectorAll(tileSelector).length : 0;
        const deckStep = Math.max(280, Math.min(420, stickyHeight * deckStepScale));
        const scrollRange = Math.max(1, (tileCount - 1) * deckStep);

        driver.style.height = `${stickyHeight + scrollRange}px`;
        return { maxScroll: 0, scrollRange, stickyHeight };
      }

      viewport.style.width = `${viewportWidth}px`;

      const maxScroll = Math.max(0, track.scrollWidth - viewportWidth);
      const scrollRange = Math.max(1, maxScroll);

      driver.style.height = `${stickyHeight + scrollRange}px`;

      return { maxScroll, scrollRange, stickyHeight };
    };

    const update = () => {
      rafId = 0;

      if (!mobileQuery.matches || reducedMotionQuery.matches) {
        resetScrollDriver();
        return;
      }

      const metrics = measure();
      const driver = driverRef.current;
      const track = trackRef.current;

      if (!metrics || !driver || !track) {
        return;
      }

      const rect = driver.getBoundingClientRect();
      const progress = clamp((MOBILE_NAV_HEIGHT - rect.top) / metrics.scrollRange);

      updateStickyPinState(stickyRef.current, metrics, rect.top, rect.bottom);

      if (scrollMode === "deck") {
        track.style.removeProperty("transform");
        updateDeckMotion(track, tileSelector, progress, deckDirection);
      } else {
        const translateX = getTranslateX(progress, metrics.maxScroll);
        track.style.transform = `translate3d(${translateX}px, 0, 0)`;
        updateTileMotion(track, tileSelector, progress, tileMotion);
      }

      driver.style.setProperty(progressCssVar, progress.toFixed(4));

      if (edgeFadeCssVar) {
        driver.style.setProperty(edgeFadeCssVar, getSectionEdgeFade(progress, edgeFadeZone).toFixed(4));
      }

      if (approachCssVar) {
        driver.style.setProperty(approachCssVar, getSectionApproach(rect.top).toFixed(4));
      }
    };

    const requestUpdate = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(update);
      }
    };

    const handleMediaChange = () => {
      if (mobileQuery.matches && !reducedMotionQuery.matches) {
        measure();
      } else {
        resetScrollDriver();
      }

      requestUpdate();
    };

    const removeMobileListener = addMediaChangeListener(mobileQuery, handleMediaChange);
    const removeReducedMotionListener = addMediaChangeListener(reducedMotionQuery, handleMediaChange);

    let resizeObserver;
    const track = trackRef.current;
    const viewport = viewportRef.current;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(requestUpdate);
      if (track) resizeObserver.observe(track);
      if (viewport) resizeObserver.observe(viewport);
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    handleMediaChange();
    requestUpdate();

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      removeMobileListener();
      removeReducedMotionListener();
      resizeObserver?.disconnect();
      resetScrollDriver();
    };
  }, [
    approachCssVar,
    driverRef,
    edgeFadeCssVar,
    edgeFadeZone,
    deckDirection,
    deckStepScale,
    progressCssVar,
    scrollMode,
    stickyRef,
    tileMotion,
    tileSelector,
    tileWidthCssVar,
    tileWidthScale,
    trackRef,
    viewportRef,
  ]);
}
