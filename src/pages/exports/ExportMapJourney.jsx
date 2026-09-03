import React from "react";
import WorldMapCanvas from "./WorldMapCanvas.jsx";
import { EXPORT_JOURNEY_PALETTE } from "./export-map-palette.js";

const JOURNEY_STEPS = [
  {
    kicker: "Origin",
    title: "India",
    description: "Every route begins at home.",
    color: EXPORT_JOURNEY_PALETTE[0].color,
    surface: EXPORT_JOURNEY_PALETTE[0].surface,
    start: 0,
  },
  {
    kicker: "North America",
    title: "United States of America",
    description: "Carrying familiar Indian flavours across the Atlantic.",
    color: EXPORT_JOURNEY_PALETTE[1].color,
    surface: EXPORT_JOURNEY_PALETTE[1].surface,
    start: 0.07,
  },
  {
    kicker: "Europe",
    title: "United Kingdom",
    description: "A growing presence in one of our key international markets.",
    color: EXPORT_JOURNEY_PALETTE[2].color,
    surface: EXPORT_JOURNEY_PALETTE[2].surface,
    start: 0.18,
  },
  {
    kicker: "Oceania",
    title: "Australia",
    description: "Reaching shelves and communities across Australia.",
    color: EXPORT_JOURNEY_PALETTE[3].color,
    surface: EXPORT_JOURNEY_PALETTE[3].surface,
    start: 0.29,
  },
  {
    kicker: "Oceania",
    title: "New Zealand",
    description: "Extending our footprint to the edge of the Pacific.",
    color: EXPORT_JOURNEY_PALETTE[4].color,
    surface: EXPORT_JOURNEY_PALETTE[4].surface,
    start: 0.4,
  },
  {
    kicker: "Middle East",
    title: "United Arab Emirates",
    description: "A dedicated destination at the crossroads of global trade.",
    color: EXPORT_JOURNEY_PALETTE[5].color,
    surface: EXPORT_JOURNEY_PALETTE[5].surface,
    start: 0.51,
  },
  {
    kicker: "Regional reach",
    title: "Across Asia",
    description: "A growing network of Asian markets, anchored in Indonesia.",
    color: EXPORT_JOURNEY_PALETTE[6].color,
    surface: EXPORT_JOURNEY_PALETTE[6].surface,
    start: 0.62,
  },
  {
    kicker: "Regional reach",
    title: "Across Europe",
    description: "Multiple European markets, connected by one commitment to quality.",
    color: EXPORT_JOURNEY_PALETTE[7].color,
    surface: EXPORT_JOURNEY_PALETTE[7].surface,
    start: 0.77,
  },
  {
    kicker: "Global presence",
    title: "20+ export destinations",
    description: "One growing network, bringing Euro products to the world.",
    color: EXPORT_JOURNEY_PALETTE[8].color,
    surface: EXPORT_JOURNEY_PALETTE[8].surface,
    start: 0.92,
  },
];

function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function smoothStep(value) {
  const bounded = clamp(value);
  return bounded * bounded * (3 - 2 * bounded);
}

function getAppScale(section) {
  const viewport = section?.closest(".app-viewport");
  if (!viewport) return 1;

  const value = Number.parseFloat(
    window.getComputedStyle(viewport).getPropertyValue("--app-scale"),
  );
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function findActiveStep(progress) {
  for (let index = JOURNEY_STEPS.length - 1; index >= 0; index -= 1) {
    if (progress >= JOURNEY_STEPS[index].start) return index;
  }
  return 0;
}

function useMobileLayout() {
  const [isMobile, setIsMobile] = React.useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 999px)").matches,
  );

  React.useEffect(() => {
    const query = window.matchMedia("(max-width: 999px)");
    const update = () => setIsMobile(query.matches);

    update();
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", update);
      return () => query.removeEventListener("change", update);
    }

    query.addListener(update);
    return () => query.removeListener(update);
  }, []);

  return isMobile;
}

function useExportMapJourney(sectionRef, mapRef, storyRef, disabled = false) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeIndexRef = React.useRef(0);

  React.useEffect(() => {
    if (disabled) return undefined;

    const section = sectionRef.current;
    if (!section || typeof window === "undefined") return undefined;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 999px)");
    let frameId = 0;

    const setProgress = (progress) => {
      const nextProgress = clamp(progress);
      const nextIndex = findActiveStep(nextProgress);
      const finalProgress = smoothStep((nextProgress - 0.86) / 0.14);
      const summaryProgress = smoothStep((finalProgress - 0.18) / 0.82);
      const storyWidth = storyRef.current?.offsetWidth || 370;
      const storyGutter = 34;
      const storyTravel = Math.max(
        0,
        section.clientWidth - storyWidth - storyGutter * 2,
      );

      section.style.setProperty("--journey-progress", nextProgress.toFixed(4));
      section.style.setProperty(
        "--journey-card-x",
        `${storyTravel * finalProgress}px`,
      );
      section.style.setProperty(
        "--journey-final-opacity",
        summaryProgress.toFixed(4),
      );
      section.style.setProperty(
        "--journey-final-shift",
        `${(1 - summaryProgress) * 34}px`,
      );
      section.style.setProperty(
        "--journey-final-scale",
        (0.96 + summaryProgress * 0.04).toFixed(4),
      );
      mapRef.current?.setJourneyProgress(nextProgress);

      if (activeIndexRef.current !== nextIndex) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      }
    };

    const measure = () => {
      const scale = getAppScale(section);
      const viewportHeight = window.innerHeight || 720;
      const viewportHeightInLayout = viewportHeight / scale;
      const isMobile = mobileQuery.matches;
      const scrollScreens = isMobile ? 5.8 : 6.8;
      const navHeight = isMobile ? 76 : 65.33;
      const mapWidth = Math.min(
        1280,
        Math.max(280, viewportHeightInLayout - navHeight) * (5000 / 3334),
      );

      section.style.setProperty(
        "--journey-viewport-height",
        `${viewportHeightInLayout}px`,
      );
      section.style.setProperty("--journey-map-width", `${mapWidth}px`);

      const summary = section.querySelector(".export-map-journey__summary");
      const summaryHeight = summary?.offsetHeight || 0;
      const summaryGutter = clamp(viewportHeightInLayout * 0.04, 12, 28);
      const summaryAvailableHeight = Math.max(
        1,
        viewportHeightInLayout - summaryGutter * 2,
      );
      const summaryFit = summaryHeight
        ? Math.min(1, summaryAvailableHeight / summaryHeight)
        : 1;
      const summaryTop = Math.max(
        summaryGutter,
        Math.min(
          viewportHeightInLayout * 0.45,
          viewportHeightInLayout - summaryHeight * summaryFit - summaryGutter,
        ),
      );

      section.style.setProperty("--journey-summary-fit", summaryFit.toFixed(4));
      section.style.setProperty("--journey-summary-top", `${summaryTop.toFixed(2)}px`);

      const storyHeight = storyRef.current?.offsetHeight || 0;
      const storyGutter = clamp(viewportHeightInLayout * 0.04, 12, 28);
      const storyAvailableHeight = Math.max(
        1,
        viewportHeightInLayout - storyGutter * 2,
      );
      const storyFit = storyHeight
        ? Math.min(1, storyAvailableHeight / storyHeight)
        : 1;
      const scaledStoryHeight = storyHeight * storyFit;
      const storyCenter = clamp(
        viewportHeightInLayout * 0.68,
        storyGutter + scaledStoryHeight / 2,
        viewportHeightInLayout - storyGutter - scaledStoryHeight / 2,
      );

      section.style.setProperty("--journey-story-fit", storyFit.toFixed(4));
      section.style.setProperty("--journey-story-center", `${storyCenter.toFixed(2)}px`);

      if (reducedMotionQuery.matches) {
        section.style.height = "auto";
        section.dataset.reducedMotion = "true";
        return;
      }

      delete section.dataset.reducedMotion;
      section.style.height = `${viewportHeightInLayout * (1 + scrollScreens)}px`;
    };

    const update = () => {
      frameId = 0;
      measure();

      if (reducedMotionQuery.matches) {
        setProgress(1);
        return;
      }

      const rect = section.getBoundingClientRect();
      const scrollRange = Math.max(1, rect.height - window.innerHeight);
      setProgress(-rect.top / scrollRange);
    };

    const requestUpdate = () => {
      if (!frameId) frameId = window.requestAnimationFrame(update);
    };

    const handleMediaChange = () => {
      measure();
      requestUpdate();
    };

    const addMediaListener = (query) => {
      if (typeof query.addEventListener === "function") {
        query.addEventListener("change", handleMediaChange);
        return () => query.removeEventListener("change", handleMediaChange);
      }

      query.addListener(handleMediaChange);
      return () => query.removeListener(handleMediaChange);
    };

    const removeReducedMotionListener = addMediaListener(reducedMotionQuery);
    const removeMobileListener = addMediaListener(mobileQuery);

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    const summaryResizeObserver = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(requestUpdate);
    const summary = section.querySelector(".export-map-journey__summary");
    if (summary) summaryResizeObserver?.observe(summary);
    if (storyRef.current) summaryResizeObserver?.observe(storyRef.current);
    document.fonts?.ready.then(requestUpdate).catch(() => undefined);
    measure();
    requestUpdate();

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      summaryResizeObserver?.disconnect();
      removeReducedMotionListener();
      removeMobileListener();
      section.style.removeProperty("height");
      section.style.removeProperty("--journey-progress");
      section.style.removeProperty("--journey-card-x");
      section.style.removeProperty("--journey-final-opacity");
      section.style.removeProperty("--journey-final-shift");
      section.style.removeProperty("--journey-final-scale");
      section.style.removeProperty("--journey-viewport-height");
      section.style.removeProperty("--journey-map-width");
      section.style.removeProperty("--journey-summary-fit");
      section.style.removeProperty("--journey-summary-top");
      section.style.removeProperty("--journey-story-fit");
      section.style.removeProperty("--journey-story-center");
      delete section.dataset.reducedMotion;
    };
  }, [disabled, mapRef, sectionRef, storyRef]);

  return activeIndex;
}

function GlobalReachSummary({ mobile = false }) {
  return (
    <div
      className={`export-map-journey__summary${mobile ? " export-map-journey__summary--mobile" : ""}`}
    >
      <span className="export-map-journey__summary-pill">Global Reach</span>
      <h1 id={mobile ? "exports-mobile-global-title" : "exports-global-title"}>
        Expanding <em>Globally</em>
      </h1>
      <p>
        As of the financial year ending March 2025, we have actively exported
        to 20 countries worldwide, showcasing our expanding global footprint
        and product acceptance across diverse markets.
      </p>

      <div className="export-map-journey__summary-stats">
        <div>
          <strong>2012</strong>
          <span>Commercial Start</span>
        </div>
        <i aria-hidden="true" />
        <div>
          <strong>20+</strong>
          <span>Export Destinations</span>
        </div>
      </div>
    </div>
  );
}

export default function ExportMapJourney() {
  const sectionRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const storyRef = React.useRef(null);
  const isMobile = useMobileLayout();
  const activeIndex = useExportMapJourney(sectionRef, mapRef, storyRef, isMobile);
  const activeStep = JOURNEY_STEPS[activeIndex];
  const visibleStepNumber = Math.min(activeIndex + 1, JOURNEY_STEPS.length - 1);

  if (isMobile) {
    return (
      <section
        className="export-map-mobile-intro"
        aria-labelledby="exports-mobile-global-title"
      >
        <GlobalReachSummary mobile />
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="export-map-journey"
      aria-label="Our global export journey"
      style={{
        "--journey-color": activeStep.color,
        "--journey-surface": activeStep.surface,
      }}
    >
      <div className="export-map-journey__sticky">
        <div className="export-map-journey__map-stage">
          <WorldMapCanvas
            ref={mapRef}
            className="export-map-hero-canvas"
            journey
          />
        </div>

        <GlobalReachSummary />

        <aside ref={storyRef} className="export-map-journey__story" aria-live="off">
          <div className="export-map-journey__counter" aria-hidden="true">
            {activeIndex === JOURNEY_STEPS.length - 1
              ? "Complete"
              : `${String(visibleStepNumber).padStart(2, "0")} / 08`}
          </div>
          <div className="export-map-journey__copy" key={activeStep.title}>
            <span>{activeStep.kicker}</span>
            <strong>{activeStep.title}</strong>
            <p>{activeStep.description}</p>
          </div>
          <div className="export-map-journey__progress" aria-hidden="true">
            <i />
          </div>
        </aside>

        <div className="export-map-journey__hint" aria-hidden="true">
          <span />
          Scroll to explore
        </div>
      </div>
    </section>
  );
}
