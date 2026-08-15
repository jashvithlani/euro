import { useEffect, useRef, useState } from "react";
import { asset } from "./EuroMoments/asset.js";
import OptimizedImage from "./OptimizedImage.jsx";
import "./EuroMoments.css";

const CARD_TRAVEL = [96, 154, 74, 132, 88];
const CARD_ROTATE = [0, 0, 0, 5, -5];
const CAROUSEL_ENTER_MS = 550;
const CAROUSEL_HOLD_MS = 3000;
const CAROUSEL_EXIT_MS = 550;

const SOCIAL_CARDS = [
  { src: asset("contact-social-card-1.jpeg"), alt: "Euro snack moment" },
  { src: asset("contact-social-card-2.jpeg"), alt: "Euro chips pack moment" },
  { src: asset("contact-social-card-3.jpeg"), alt: "Euro chips everywhere moment" },
  { src: asset("contact-social-card-4.jpeg"), alt: "Euro table snack moment" },
  { src: asset("contact-social-card-5.jpeg"), alt: "Fresh and tasty Euro beverages" },
];

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

export default function EuroMoments({ className = "" }) {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState("hold");

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mobileQuery = window.matchMedia("(max-width: 999px)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncViewport = () => {
      setIsMobile(mobileQuery.matches);
      setReduceMotion(reducedMotionQuery.matches);
    };

    syncViewport();

    const removeMobileListener = addMediaChangeListener(mobileQuery, syncViewport);
    const removeReducedMotionListener = addMediaChangeListener(reducedMotionQuery, syncViewport);

    return () => {
      removeMobileListener();
      removeReducedMotionListener();
    };
  }, []);

  useEffect(() => {
    if (!isMobile || reduceMotion) {
      setActiveIndex(0);
      setPhase("hold");
      return undefined;
    }

    const timeoutIds = [];

    const schedule = (callback, delay) => {
      const id = window.setTimeout(callback, delay);
      timeoutIds.push(id);
    };

    const startCycle = (index) => {
      setActiveIndex(index);
      setPhase("enter");

      schedule(() => {
        setPhase("hold");

        schedule(() => {
          setPhase("exit");

          schedule(() => {
            startCycle((index + 1) % SOCIAL_CARDS.length);
          }, CAROUSEL_EXIT_MS);
        }, CAROUSEL_HOLD_MS);
      }, CAROUSEL_ENTER_MS);
    };

    startCycle(0);

    return () => {
      timeoutIds.forEach((id) => window.clearTimeout(id));
    };
  }, [isMobile, reduceMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    const momentCards = grid ? Array.from(grid.querySelectorAll(".euro-moments-card")) : [];

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
        const travel = CARD_TRAVEL[index] || 88;
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
  }, [isMobile]);

  const activeCard = SOCIAL_CARDS[activeIndex];

  return (
    <section
      className={`euro-moments ${className}`.trim()}
      ref={sectionRef}
      aria-label="Euro India social feed"
    >
      <header className="euro-moments__intro">
        <div className="euro-moments__intro-top">
          <p className="euro-moments__kicker">Social Feed</p>
          <h2 className="euro-moments__title">
            <span>#EuroIndia</span>
            <span>Moments</span>
          </h2>
        </div>
        <p className="euro-moments__lede">
          Tag us in your snack selfies for a chance to get featured!
        </p>
      </header>

      <OptimizedImage
        className="euro-moments__strip"
        src={asset("contact-social-strip.png")}
        alt="Euro India social feed"
        sizes="(max-width: 999px) 92vw, 1100px"
      />

      {isMobile ? (
        <div className="euro-moments__carousel" aria-live="polite">
          <div className="euro-moments__carousel-stage">
            <OptimizedImage
              key={activeIndex}
              className={`euro-moments-card euro-moments-card--carousel euro-moments-card--carousel-${phase} euro-moments-card--index-${activeIndex + 1}`}
              src={activeCard.src}
              alt={activeCard.alt}
              loading="lazy"
              sizes="(max-width: 480px) 80vw, 320px"
              style={{ "--card-rotate": `${CARD_ROTATE[activeIndex]}deg` }}
            />
          </div>
        </div>
      ) : (
        <div className="euro-moments__grid" ref={gridRef} aria-label="Euro India social moments">
          {SOCIAL_CARDS.map((card, index) => (
            <OptimizedImage
              key={card.src}
              className="euro-moments-card"
              src={card.src}
              alt={card.alt}
              loading="lazy"
              sizes="(max-width: 480px) 45vw, (max-width: 999px) 30vw, 220px"
            />
          ))}
        </div>
      )}
    </section>
  );
}
