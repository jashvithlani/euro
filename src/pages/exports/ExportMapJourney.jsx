import React from "react";
import WorldMapCanvas from "./WorldMapCanvas.jsx";

const JOURNEY_STEPS = [
  {
    kicker: "Origin",
    title: "India",
    description: "Every route begins at home.",
    color: "#a94b6b",
    surface: "#f8dce4",
    start: 0,
  },
  {
    kicker: "North America",
    title: "United States of America",
    description: "Carrying familiar Indian flavours across the Atlantic.",
    color: "#517da2",
    surface: "#dcecf7",
    start: 0.07,
  },
  {
    kicker: "Europe",
    title: "United Kingdom",
    description: "A growing presence in one of our key international markets.",
    color: "#76588d",
    surface: "#eadff3",
    start: 0.18,
  },
  {
    kicker: "Oceania",
    title: "Australia",
    description: "Reaching shelves and communities across Australia.",
    color: "#a75f82",
    surface: "#f5dfeb",
    start: 0.29,
  },
  {
    kicker: "Oceania",
    title: "New Zealand",
    description: "Extending our footprint to the edge of the Pacific.",
    color: "#4c887f",
    surface: "#dcefe9",
    start: 0.4,
  },
  {
    kicker: "Middle East",
    title: "United Arab Emirates",
    description: "A dedicated destination at the crossroads of global trade.",
    color: "#a57832",
    surface: "#f8e9ca",
    start: 0.51,
  },
  {
    kicker: "Regional reach",
    title: "Across Asia",
    description: "A growing network of Asian markets, anchored in Indonesia.",
    color: "#6176a0",
    surface: "#e4e9f9",
    start: 0.62,
  },
  {
    kicker: "Regional reach",
    title: "Across Europe",
    description: "Multiple European markets, connected by one commitment to quality.",
    color: "#a66858",
    surface: "#f8dfd8",
    start: 0.77,
  },
  {
    kicker: "Global presence",
    title: "20+ export destinations",
    description: "One growing network, bringing Euro products to the world.",
    color: "#a94b6b",
    surface: "#f8dce4",
    start: 0.92,
  },
];

function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
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

function useExportMapJourney(sectionRef, mapRef) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeIndexRef = React.useRef(0);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof window === "undefined") return undefined;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 999px)");
    let frameId = 0;

    const setProgress = (progress) => {
      const nextProgress = clamp(progress);
      const nextIndex = findActiveStep(nextProgress);

      section.style.setProperty("--journey-progress", nextProgress.toFixed(4));
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
    measure();
    requestUpdate();

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      removeReducedMotionListener();
      removeMobileListener();
      section.style.removeProperty("height");
      section.style.removeProperty("--journey-progress");
      section.style.removeProperty("--journey-viewport-height");
      section.style.removeProperty("--journey-map-width");
      delete section.dataset.reducedMotion;
    };
  }, [mapRef, sectionRef]);

  return activeIndex;
}

export default function ExportMapJourney() {
  const sectionRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const activeIndex = useExportMapJourney(sectionRef, mapRef);
  const activeStep = JOURNEY_STEPS[activeIndex];
  const visibleStepNumber = Math.min(activeIndex + 1, JOURNEY_STEPS.length - 1);

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

        <aside className="export-map-journey__story" aria-live="off">
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
