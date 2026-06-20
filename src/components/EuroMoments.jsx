import { useEffect, useRef } from "react";
import "./EuroMoments.css";

const DEFAULT_CARD_TRAVEL = [96, 154, 74, 132, 88];

function addMediaChangeListener(mediaQuery, listener) {
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }

  mediaQuery.addListener(listener);
  return () => mediaQuery.removeListener(listener);
}

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export default function EuroMoments({
  ariaLabel = "Euro India social feed",
  cardAriaLabel = "Euro India social moments",
  cards,
  cardClassName = "",
  cardTravel = DEFAULT_CARD_TRAVEL,
  children,
  className = "",
  gridClassName = "",
}) {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    const momentCards = section ? Array.from(section.querySelectorAll(".euro-moments-card")) : [];

    if (!section || !grid || momentCards.length === 0 || typeof window === "undefined") {
      return undefined;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 999px)");
    let rafId = 0;

    const resetCards = () => {
      momentCards.forEach((card) => {
        card.style.setProperty("--euro-moments-card-y", "0px");
        card.style.setProperty("--euro-moments-card-opacity", "1");
      });
    };

    const updateCards = () => {
      rafId = 0;

      if (reducedMotionQuery.matches || mobileQuery.matches) {
        resetCards();
        return;
      }

      const gridRect = grid.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 720;
      const start = viewportHeight * 1.04;
      const end = viewportHeight * 0.3;
      const progress = clamp((start - gridRect.top) / Math.max(1, start - end));

      momentCards.forEach((card, index) => {
        const travel = cardTravel[index] || DEFAULT_CARD_TRAVEL[index] || 88;
        const y = travel * (1 - progress);
        const opacity = 0.84 + progress * 0.16;

        card.style.setProperty("--euro-moments-card-y", `${y.toFixed(2)}px`);
        card.style.setProperty("--euro-moments-card-opacity", opacity.toFixed(4));
      });
    };

    const requestUpdate = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateCards);
      }
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    const removeReducedMotionListener = addMediaChangeListener(reducedMotionQuery, requestUpdate);
    const removeMobileListener = addMediaChangeListener(mobileQuery, requestUpdate);

    requestUpdate();

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      removeReducedMotionListener();
      removeMobileListener();

      momentCards.forEach((card) => {
        card.style.removeProperty("--euro-moments-card-y");
        card.style.removeProperty("--euro-moments-card-opacity");
      });
    };
  }, [cardTravel]);

  return (
    <section className={`euro-moments ${className}`.trim()} ref={sectionRef} aria-label={ariaLabel}>
      {children}
      <div className={`euro-moments-grid ${gridClassName}`.trim()} ref={gridRef} aria-label={cardAriaLabel}>
        {cards.map((card, index) => (
          <img
            key={card.src}
            className={`euro-moments-card ${cardClassName}`.trim()}
            src={card.src}
            alt={card.alt}
            loading={index === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>
    </section>
  );
}
