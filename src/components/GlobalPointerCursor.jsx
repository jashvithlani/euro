import React from "react";
import "./GlobalPointerCursor.css";

const INTERACTIVE_SELECTOR = "a, button, [role='button'], summary, [tabindex]:not([tabindex='-1'])";
const NATIVE_CURSOR_SELECTOR = "input, textarea, select, option, [contenteditable='true'], form, form *";
const PRODUCT_SELECTOR = [
  ".product-card",
  ".category-card",
  ".euro-flavor-stage__product-scroll-layer",
  ".euro-flavor-stage__wall-card",
  ".euro-moments-card",
  ".social-feed-card",
].join(", ");
const CURSOR_COLOR_SAMPLE_INTERVAL = 90;
const LIGHT_PINK_CURSOR_ACCENT = { r: 255, g: 178, b: 205 };
const DEFAULT_CURSOR_PALETTE = {
  accent: "rgb(255, 222, 167)",
  accentStrong: "rgba(255, 222, 167, 0.86)",
  accentSoft: "rgba(255, 222, 167, 0.58)",
  accentGlow: "rgba(255, 222, 167, 0.2)",
  sourceGlow: "rgba(190, 0, 75, 0.12)",
  dot: "rgb(255, 242, 191)",
};

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function parseColorValue(value) {
  if (!value || value === "transparent") return null;

  const hex = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const raw = hex[1].length === 3 ? hex[1].split("").map((char) => char + char).join("") : hex[1];
    return {
      r: parseInt(raw.slice(0, 2), 16),
      g: parseInt(raw.slice(2, 4), 16),
      b: parseInt(raw.slice(4, 6), 16),
      a: 1,
    };
  }

  const rgb = value.match(/rgba?\(([^)]+)\)/i);
  if (!rgb) return null;

  const parts = rgb[1].split(",").map((part) => Number.parseFloat(part.trim()));
  const [r, g, b, a = 1] = parts;
  if (![r, g, b, a].every(Number.isFinite) || a < 0.08) return null;

  return { r, g, b, a };
}

function getRelativeLuminance({ r, g, b }) {
  const [sr, sg, sb] = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return sr * 0.2126 + sg * 0.7152 + sb * 0.0722;
}

function rgbToHsl({ r, g, b }) {
  const nr = r / 255;
  const ng = g / 255;
  const nb = b / 255;
  const max = Math.max(nr, ng, nb);
  const min = Math.min(nr, ng, nb);
  const lightness = (max + min) / 2;

  if (max === min) {
    return { h: 38, s: 0, l: lightness };
  }

  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;

  if (max === nr) hue = (ng - nb) / delta + (ng < nb ? 6 : 0);
  if (max === ng) hue = (nb - nr) / delta + 2;
  if (max === nb) hue = (nr - ng) / delta + 4;

  return { h: hue * 60, s: saturation, l: lightness };
}

function hslToRgb({ h, s, l }) {
  const hue = (((h % 360) + 360) % 360) / 360;

  if (s === 0) {
    const value = Math.round(l * 255);
    return { r: value, g: value, b: value };
  }

  const hueToRgb = (p, q, t) => {
    let nextT = t;
    if (nextT < 0) nextT += 1;
    if (nextT > 1) nextT -= 1;
    if (nextT < 1 / 6) return p + (q - p) * 6 * nextT;
    if (nextT < 1 / 2) return q;
    if (nextT < 2 / 3) return p + (q - p) * (2 / 3 - nextT) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hueToRgb(p, q, hue + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, hue) * 255),
    b: Math.round(hueToRgb(p, q, hue - 1 / 3) * 255),
  };
}

function toRgbString({ r, g, b }) {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

function toRgbaString({ r, g, b }, alpha) {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
}

function isCyanBlueHue(hue) {
  const normalizedHue = ((hue % 360) + 360) % 360;
  return normalizedHue >= 165 && normalizedHue <= 230;
}

function getReadableAccent(baseColor) {
  const hsl = rgbToHsl(baseColor);
  const luminance = getRelativeLuminance(baseColor);

  if (hsl.s < 0.08) {
    return luminance > 0.62 ? { r: 190, g: 0, b: 75 } : { r: 255, g: 222, b: 167 };
  }

  const complementHue = hsl.h + 180;

  if (isCyanBlueHue(complementHue)) {
    return LIGHT_PINK_CURSOR_ACCENT;
  }

  return hslToRgb({
    h: complementHue,
    s: clampNumber(hsl.s * 0.56 + 0.26, 0.38, 0.68),
    l: luminance < 0.28 ? 0.72 : 0.56,
  });
}

function deriveCursorPalette(baseColor) {
  if (!baseColor) return DEFAULT_CURSOR_PALETTE;

  const accent = getReadableAccent(baseColor);
  const luminance = getRelativeLuminance(accent);
  const dot = luminance < 0.46 ? hslToRgb({ ...rgbToHsl(accent), l: 0.74 }) : accent;

  return {
    accent: toRgbString(accent),
    accentStrong: toRgbaString(accent, 0.84),
    accentSoft: toRgbaString(accent, 0.56),
    accentGlow: toRgbaString(accent, 0.22),
    sourceGlow: toRgbaString(baseColor, 0.13),
    dot: toRgbString(dot),
  };
}

function getElementColor(element, includeTextColor = false) {
  const explicitColor = parseColorValue(element.dataset?.cursorColor);
  if (explicitColor) return explicitColor;

  const computed = window.getComputedStyle(element);
  const background = parseColorValue(computed.backgroundColor);
  if (background) return background;

  const borderColor = parseColorValue(computed.borderTopColor);
  if (borderColor && getRelativeLuminance(borderColor) < 0.95) return borderColor;

  return includeTextColor ? parseColorValue(computed.color) : null;
}

function sampleCoveredColor(x, y, fallbackTarget) {
  const startElement = document.elementFromPoint(x, y) || getElementTarget(fallbackTarget);
  let element = startElement;

  while (element && element !== document.documentElement) {
    const color = getElementColor(element);
    if (color) return color;
    element = element.parentElement;
  }

  element = startElement;
  while (element && element !== document.documentElement) {
    const color = getElementColor(element, true);
    if (color) return color;
    element = element.parentElement;
  }

  return parseColorValue(window.getComputedStyle(document.body).backgroundColor);
}

function addMediaChangeListener(mediaQuery, listener) {
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }

  mediaQuery.addListener(listener);
  return () => mediaQuery.removeListener(listener);
}

function getElementTarget(target) {
  if (!target) return null;
  if (target.nodeType === 1) return target;
  return target.parentElement || null;
}

function getCursorIntent(target) {
  const element = getElementTarget(target);
  if (!element) return { state: "stage", label: "" };

  if (element.closest(NATIVE_CURSOR_SELECTOR)) {
    return { state: "native", label: "" };
  }

  const explicitTarget = element.closest("[data-cursor]");
  if (explicitTarget) {
    return {
      state: explicitTarget.dataset.cursor || "stage",
      label: explicitTarget.dataset.cursorLabel || "",
    };
  }

  if (element.closest(PRODUCT_SELECTOR)) {
    return { state: "product", label: "" };
  }

  if (element.closest(INTERACTIVE_SELECTOR)) {
    return { state: "cta", label: "" };
  }

  return { state: "stage", label: "" };
}

export default function GlobalPointerCursor() {
  const cursorRef = React.useRef(null);
  const labelRef = React.useRef(null);

  React.useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return undefined;

    const cursor = cursorRef.current;
    const label = labelRef.current;
    const body = document.body;
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let rafId = 0;
    let isEnabled = false;
    let isVisible = false;
    let currentState = "stage";
    let lastColorSampleAt = 0;

    const values = {
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      dotX: window.innerWidth / 2,
      dotY: window.innerHeight / 2,
      ringX: window.innerWidth / 2,
      ringY: window.innerHeight / 2,
      glowX: window.innerWidth / 2,
      glowY: window.innerHeight / 2,
    };

    const writeVariables = () => {
      if (!cursor) return;

      cursor.style.setProperty("--global-cursor-dot-x", `${values.dotX.toFixed(2)}px`);
      cursor.style.setProperty("--global-cursor-dot-y", `${values.dotY.toFixed(2)}px`);
      cursor.style.setProperty("--global-cursor-ring-x", `${values.ringX.toFixed(2)}px`);
      cursor.style.setProperty("--global-cursor-ring-y", `${values.ringY.toFixed(2)}px`);
      cursor.style.setProperty("--global-cursor-glow-x", `${values.glowX.toFixed(2)}px`);
      cursor.style.setProperty("--global-cursor-glow-y", `${values.glowY.toFixed(2)}px`);
    };

    const setCursorPalette = (palette) => {
      if (!cursor) return;

      cursor.style.setProperty("--global-cursor-accent", palette.accent);
      cursor.style.setProperty("--global-cursor-accent-strong", palette.accentStrong);
      cursor.style.setProperty("--global-cursor-accent-soft", palette.accentSoft);
      cursor.style.setProperty("--global-cursor-accent-glow", palette.accentGlow);
      cursor.style.setProperty("--global-cursor-source-glow", palette.sourceGlow);
      cursor.style.setProperty("--global-cursor-dot-color", palette.dot);
    };

    const updateCursorPalette = (event) => {
      const now = window.performance.now();
      if (now - lastColorSampleAt < CURSOR_COLOR_SAMPLE_INTERVAL) return;

      lastColorSampleAt = now;
      setCursorPalette(deriveCursorPalette(sampleCoveredColor(event.clientX, event.clientY, event.target)));
    };

    const setCursorState = (state, cursorLabel = "") => {
      if (currentState !== state) {
        currentState = state;
        body.setAttribute("data-global-cursor-state", state);
      }

      if (cursorLabel) {
        body.setAttribute("data-global-cursor-has-label", "true");
        if (label) label.textContent = cursorLabel;
      } else {
        body.removeAttribute("data-global-cursor-has-label");
        if (label) label.textContent = "";
      }
    };

    const stopRaf = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const tick = () => {
      values.dotX += (values.targetX - values.dotX) * 0.34;
      values.dotY += (values.targetY - values.dotY) * 0.34;
      values.ringX += (values.targetX - values.ringX) * 0.18;
      values.ringY += (values.targetY - values.ringY) * 0.18;
      values.glowX += (values.targetX - values.glowX) * 0.075;
      values.glowY += (values.targetY - values.glowY) * 0.075;

      writeVariables();

      const distanceToRest =
        Math.abs(values.targetX - values.glowX) +
        Math.abs(values.targetY - values.glowY);

      if (isVisible || distanceToRest > 0.35) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    };

    const requestTick = () => {
      if (!rafId && isEnabled) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const showCursor = () => {
      if (isVisible) return;
      isVisible = true;
      body.setAttribute("data-global-cursor-visible", "true");
    };

    const hideCursor = () => {
      isVisible = false;
      body.removeAttribute("data-global-cursor-visible");
      setCursorState("stage");
    };

    const handlePointerMove = (event) => {
      if (!isEnabled) return;

      values.targetX = event.clientX;
      values.targetY = event.clientY;
      showCursor();
      updateCursorPalette(event);

      const intent = getCursorIntent(event.target);
      setCursorState(intent.state, intent.label);
      requestTick();
    };

    const handlePointerLeave = (event) => {
      if (event.relatedTarget) return;
      hideCursor();
      requestTick();
    };

    const handleResize = () => {
      if (isVisible) return;

      values.targetX = window.innerWidth / 2;
      values.targetY = window.innerHeight / 2;
      values.dotX = values.targetX;
      values.dotY = values.targetY;
      values.ringX = values.targetX;
      values.ringY = values.targetY;
      values.glowX = values.targetX;
      values.glowY = values.targetY;
      writeVariables();
    };

    const updateEnabledState = () => {
      const nextEnabled = pointerQuery.matches && !reducedMotionQuery.matches;
      isEnabled = nextEnabled;

      if (!nextEnabled) {
        isVisible = false;
        stopRaf();
        body.removeAttribute("data-global-cursor-ready");
        body.removeAttribute("data-global-cursor-visible");
        body.removeAttribute("data-global-cursor-state");
        body.removeAttribute("data-global-cursor-has-label");
        return;
      }

      body.setAttribute("data-global-cursor-ready", "true");
      setCursorState("stage");
      setCursorPalette(DEFAULT_CURSOR_PALETTE);
      handleResize();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") hideCursor();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("blur", hideCursor);
    document.addEventListener("mouseout", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const removePointerListener = addMediaChangeListener(pointerQuery, updateEnabledState);
    const removeReducedMotionListener = addMediaChangeListener(reducedMotionQuery, updateEnabledState);
    updateEnabledState();

    return () => {
      stopRaf();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("blur", hideCursor);
      document.removeEventListener("mouseout", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      removePointerListener();
      removeReducedMotionListener();
      body.removeAttribute("data-global-cursor-ready");
      body.removeAttribute("data-global-cursor-visible");
      body.removeAttribute("data-global-cursor-state");
      body.removeAttribute("data-global-cursor-has-label");
    };
  }, []);

  return (
    <div className="global-pointer-cursor" ref={cursorRef} aria-hidden="true">
      <span className="global-pointer-cursor__glow" />
      <span className="global-pointer-cursor__ring" />
      <span className="global-pointer-cursor__dot" />
      <span className="global-pointer-cursor__label" ref={labelRef} />
    </div>
  );
}
