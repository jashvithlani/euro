import React from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import "./EuroFlavorStage.css";

const homeAsset = (fileName) => new URL(`./assets/${fileName}`, import.meta.url).href;
const categoryAsset = (fileName) => new URL(`../category/assets/${fileName}`, import.meta.url).href;

const flavorScenes = [
  {
    id: "intro",
    eyebrow: "Euro Flavor Stage",
    title: "Every craving has a Euro.",
    description: "A world of snacks, sips, crunch, and flavor - made for every mood.",
    product: {
      src: homeAsset("hero-products.png"),
      alt: "Euro chips range",
      width: "585px",
      className: "euro-flavor-stage__product--intro",
    },
    bg: "radial-gradient(circle at 50% 40%, rgba(255, 222, 167, 0.72) 0%, rgba(255, 248, 246, 0.98) 38%, #fff8f6 72%, #ffffff 100%)",
    accent: "#be004b",
    theme: "light",
    particleType: "spark",
  },
  {
    id: "chips",
    eyebrow: "Chips",
    title: "Cool crunch, impossible to pause.",
    description: "Creamy onion flavor with a fresh green snap in every bite.",
    product: {
      src: categoryAsset("category-chips-wide-hero-onion.png"),
      alt: "Euro Cream and Onion chips pack",
      width: "300px",
      className: "euro-flavor-stage__product--chips",
    },
    bg: "radial-gradient(circle at 50% 42%, rgba(255, 222, 167, 0.5) 0%, rgba(97, 182, 79, 0.42) 31%, #1e6f3c 72%, #092515 100%)",
    accent: "#d9f56b",
    particleType: "chip",
  },
  {
    id: "getmore",
    eyebrow: "Getmore",
    title: "Tomato punch. Bigger munch.",
    description: "A punchy snack experience made for bright, chatpata cravings.",
    product: {
      src: categoryAsset("category-getmore-tomato.png"),
      alt: "Euro Getmore Tingling Tomato snack pack",
      width: "368px",
      className: "euro-flavor-stage__product--getmore",
    },
    bg: "radial-gradient(circle at 48% 43%, rgba(255, 182, 74, 0.48) 0%, rgba(233, 49, 45, 0.4) 38%, #7f1230 72%, #1d0712 100%)",
    accent: "#ff9b31",
    particleType: "stick",
  },
  {
    id: "namkeen",
    eyebrow: "Namkeen",
    title: "Classic cravings, freshly made.",
    description: "Traditional Indian snacking with a modern Euro twist.",
    product: {
      src: categoryAsset("category-namkeen-royal-peanuts.png"),
      alt: "Euro Tasty Peanuts namkeen pack",
      width: "322px",
      className: "euro-flavor-stage__product--namkeen",
    },
    bg: "radial-gradient(circle at 52% 42%, rgba(255, 222, 167, 0.48) 0%, rgba(178, 39, 96, 0.34) 36%, #641331 72%, #210713 100%)",
    accent: "#ffd36a",
    particleType: "sev",
  },
  {
    id: "beverages",
    eyebrow: "Beverages",
    title: "Sip the sunshine.",
    description: "A bright mango refreshment that keeps the snack moment going.",
    product: {
      src: categoryAsset("category-beverage-fig-mango.png"),
      alt: "Euro Fresho Mango beverage bottle",
      width: "205px",
      className: "euro-flavor-stage__product--beverage",
    },
    bg: "radial-gradient(circle at 50% 42%, rgba(255, 245, 199, 0.46) 0%, rgba(255, 169, 40, 0.44) 31%, #a95a09 68%, #241005 100%)",
    accent: "#ffd34f",
    particleType: "bubble",
  },
  {
    id: "final",
    eyebrow: "Explore the range",
    title: "Find your Euro flavor.",
    description: "From crunchy bites to fizzy sips, discover a range made for every mood.",
    bg: "radial-gradient(circle at 50% 38%, rgba(255, 222, 167, 0.72) 0%, rgba(255, 248, 246, 0.98) 36%, #fff8f6 72%, #ffffff 100%)",
    accent: "#be004b",
    theme: "light",
    particleType: "spark",
  },
];

const productWall = [
  { label: "Cream & Onion Chips", src: categoryAsset("category-chips-wide-hero-onion.png"), alt: "Euro Cream and Onion chips pack" },
  { label: "Getmore Tomato", src: categoryAsset("category-getmore-tomato.png"), alt: "Euro Getmore Tingling Tomato snack pack" },
  { label: "Tasty Peanuts", src: categoryAsset("category-namkeen-royal-peanuts.png"), alt: "Euro Tasty Peanuts namkeen pack" },
  { label: "Fresho Mango", src: categoryAsset("category-beverage-fig-mango.png"), alt: "Euro Fresho Mango beverage bottle" },
];

const particleSeeds = [
  [18, 24, 12, -16],
  [31, 14, 8, 22],
  [45, 18, 15, -8],
  [66, 16, 9, 18],
  [80, 27, 13, -24],
  [14, 47, 7, 12],
  [28, 62, 16, -20],
  [39, 76, 9, 26],
  [55, 68, 12, -10],
  [72, 78, 8, 16],
  [86, 59, 14, -28],
  [20, 82, 9, 8],
  [11, 31, 6, 30],
  [90, 36, 7, -14],
  [61, 28, 10, 24],
  [37, 38, 6, -26],
  [52, 83, 11, 18],
  [76, 45, 7, -22],
  [24, 39, 13, 14],
  [68, 65, 11, -18],
  [47, 54, 7, 28],
  [83, 86, 10, -12],
];

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function getSceneIndex(progress) {
  return Math.min(flavorScenes.length - 1, Math.floor(clamp(progress) * flavorScenes.length));
}

function getProductSceneValue(progress) {
  const productSceneCount = flavorScenes.length - 1;
  const rawScene = clamp(progress) * flavorScenes.length;
  const sceneIndex = Math.min(productSceneCount - 1, Math.floor(rawScene));
  const localProgress = rawScene - sceneIndex;
  const transitionStart = 0.68;

  if (rawScene >= productSceneCount || sceneIndex >= productSceneCount - 1 || localProgress < transitionStart) {
    return sceneIndex;
  }

  return sceneIndex + clamp((localProgress - transitionStart) / (1 - transitionStart));
}

function addMediaChangeListener(mediaQuery, listener) {
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }

  mediaQuery.addListener(listener);
  return () => mediaQuery.removeListener(listener);
}

function getProductStyle(index, progress) {
  const sceneValue = getProductSceneValue(progress);
  const distance = Math.abs(sceneValue - index);
  const direction = index - sceneValue;
  const transitionDistance = Math.max(0, distance - 0.18);
  const visible = clamp(1 - transitionDistance * 1.85);
  const drift = Math.sin(progress * Math.PI * 5 + index) * 8;
  const lift = Math.cos(progress * Math.PI * 3 + index) * 7;
  const scale = 1 - Math.min(transitionDistance, 1) * 0.1;
  const rotate = direction * 10 + drift * 0.12;
  const blur = Math.min(4, transitionDistance * 8);

  return {
    "--pack-width": flavorScenes[index].product.width,
    opacity: visible,
    filter: `blur(${blur}px) drop-shadow(0 42px 44px rgba(0, 0, 0, 0.36))`,
    transform: `translate3d(${direction * -56}px, ${Math.abs(direction) * 34 + lift}px, 0) rotate(${rotate}deg) scale(${scale})`,
    zIndex: Math.round(20 - distance),
  };
}

function getParticleStyle(seed, index, progress) {
  const [x, y, size, rotate] = seed;
  const depth = 0.55 + (index % 5) * 0.12;
  const driftWave = progress * Math.PI * (1.2 + (index % 4) * 0.18);
  const finalFade = clamp(1 - Math.max(0, progress - 0.82) * 3.5, 0.28, 1);
  const driftDirection = index % 2 === 0 ? 1 : -1;

  return {
    "--particle-x": `${x + Math.sin(driftWave + index) * 3.4}%`,
    "--particle-y": `${y + Math.cos(driftWave * 0.85 + index) * 4.2}%`,
    "--particle-size": `${size}px`,
    "--particle-rotate": `${rotate + progress * (index % 2 === 0 ? 80 : -80)}deg`,
    "--particle-depth": depth,
    "--particle-drift-x": `${driftDirection * (3 + (index % 4) * 1.8)}px`,
    "--particle-drift-y": `${-7 - (index % 5) * 1.4}px`,
    "--particle-drift-rotate": `${driftDirection * (4 + (index % 6))}deg`,
    "--particle-duration": `${6.6 + (index % 7) * 0.72}s`,
    "--particle-delay": `${index * -0.37}s`,
    opacity: finalFade * (0.34 + depth * 0.48),
  };
}

function useFlavorStageProgress(sectionRef) {
  const [progress, setProgress] = React.useState(0);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const progressRef = React.useRef(0);
  const activeRef = React.useRef(0);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof window === "undefined") return undefined;

    const desktopQuery = window.matchMedia("(min-width: 1000px)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let rafId = 0;

    const update = () => {
      rafId = 0;

      if (!desktopQuery.matches || reducedMotionQuery.matches) {
        if (progressRef.current !== 0) {
          progressRef.current = 0;
          setProgress(0);
        }
        if (activeRef.current !== 0) {
          activeRef.current = 0;
          setActiveIndex(0);
        }
        return;
      }

      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      const nextProgress = clamp(-rect.top / scrollable);
      const nextActiveIndex = getSceneIndex(nextProgress);

      if (Math.abs(progressRef.current - nextProgress) > 0.003) {
        progressRef.current = nextProgress;
        setProgress(nextProgress);
      }

      if (activeRef.current !== nextActiveIndex) {
        activeRef.current = nextActiveIndex;
        setActiveIndex(nextActiveIndex);
      }
    };

    const requestUpdate = () => {
      if (!rafId) rafId = window.requestAnimationFrame(update);
    };

    const removeDesktopListener = addMediaChangeListener(desktopQuery, requestUpdate);
    const removeReducedMotionListener = addMediaChangeListener(reducedMotionQuery, requestUpdate);

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      removeDesktopListener();
      removeReducedMotionListener();
    };
  }, [sectionRef]);

  return { progress, activeIndex };
}

function useFlavorStagePointer(sectionRef) {
  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof window === "undefined") return undefined;

    const sticky = section.querySelector(".euro-flavor-stage__sticky");
    const pointerQuery = window.matchMedia("(min-width: 1000px) and (hover: hover) and (pointer: fine)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let rafId = 0;
    let isInside = false;
    let isEnabled = false;
    let cursorState = "stage";

    const values = {
      targetX: 0,
      targetY: 0,
      targetNX: 0,
      targetNY: 0,
      easedX: 0,
      easedY: 0,
      easedNX: 0,
      easedNY: 0,
    };

    const getStageRect = () => (sticky || section).getBoundingClientRect();

    const setCenteredTarget = () => {
      const rect = getStageRect();
      values.targetX = rect.width / 2;
      values.targetY = rect.height / 2;
      values.targetNX = 0;
      values.targetNY = 0;
    };

    const writeVariables = () => {
      section.style.setProperty("--pointer-x", `${values.easedX.toFixed(2)}px`);
      section.style.setProperty("--pointer-y", `${values.easedY.toFixed(2)}px`);
      section.style.setProperty("--pointer-nx", values.easedNX.toFixed(4));
      section.style.setProperty("--pointer-ny", values.easedNY.toFixed(4));
    };

    const snapToCenter = () => {
      setCenteredTarget();
      values.easedX = values.targetX;
      values.easedY = values.targetY;
      values.easedNX = 0;
      values.easedNY = 0;
      writeVariables();
    };

    const setCursorState = (nextState, label = "") => {
      if (cursorState !== nextState) {
        cursorState = nextState;
        section.setAttribute("data-cursor-state", nextState);
      }

      if (label) {
        section.setAttribute("data-cursor-label", label);
      } else {
        section.removeAttribute("data-cursor-label");
      }
    };

    const stopRaf = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const tick = () => {
      values.easedX += (values.targetX - values.easedX) * 0.12;
      values.easedY += (values.targetY - values.easedY) * 0.12;
      values.easedNX += (values.targetNX - values.easedNX) * 0.1;
      values.easedNY += (values.targetNY - values.easedNY) * 0.1;

      writeVariables();

      const distanceToRest =
        Math.abs(values.targetX - values.easedX) +
        Math.abs(values.targetY - values.easedY) +
        Math.abs(values.targetNX - values.easedNX) * 100 +
        Math.abs(values.targetNY - values.easedNY) * 100;

      if (isInside || distanceToRest > 0.3) {
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

    const updatePointerTarget = (event) => {
      if (!isEnabled) return;

      const rect = getStageRect();
      const nextX = clamp(event.clientX - rect.left, 0, rect.width);
      const nextY = clamp(event.clientY - rect.top, 0, rect.height);
      values.targetX = nextX;
      values.targetY = nextY;
      values.targetNX = rect.width > 0 ? (nextX / rect.width - 0.5) * 2 : 0;
      values.targetNY = rect.height > 0 ? (nextY / rect.height - 0.5) * 2 : 0;

      const cursorTarget = event.target?.closest?.("[data-cursor]");
      if (cursorTarget && section.contains(cursorTarget)) {
        setCursorState(cursorTarget.dataset.cursor || "stage", cursorTarget.dataset.cursorLabel || "");
      } else {
        setCursorState("stage");
      }

      requestTick();
    };

    const handlePointerEnter = (event) => {
      if (!isEnabled) return;
      isInside = true;
      section.setAttribute("data-flavor-cursor", "active");
      updatePointerTarget(event);
    };

    const handlePointerMove = (event) => {
      if (!isEnabled) return;
      isInside = true;
      updatePointerTarget(event);
    };

    const handlePointerLeave = () => {
      if (!isEnabled) return;
      isInside = false;
      section.setAttribute("data-flavor-cursor", "idle");
      setCursorState("stage");
      setCenteredTarget();
      requestTick();
    };

    const updateEnabledState = () => {
      const nextEnabled = pointerQuery.matches && !reducedMotionQuery.matches;
      isEnabled = nextEnabled;
      section.toggleAttribute("data-flavor-pointer-ready", nextEnabled);

      if (!nextEnabled) {
        isInside = false;
        stopRaf();
        section.setAttribute("data-flavor-cursor", "idle");
        section.removeAttribute("data-cursor-state");
        section.removeAttribute("data-cursor-label");
        snapToCenter();
        return;
      }

      section.setAttribute("data-flavor-cursor", "idle");
      setCursorState("stage");
      snapToCenter();
    };

    const handleResize = () => {
      if (!isInside) snapToCenter();
    };

    section.addEventListener("pointerenter", handlePointerEnter);
    section.addEventListener("pointermove", handlePointerMove);
    section.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", handleResize);

    const removePointerListener = addMediaChangeListener(pointerQuery, updateEnabledState);
    const removeReducedMotionListener = addMediaChangeListener(reducedMotionQuery, updateEnabledState);
    updateEnabledState();

    return () => {
      stopRaf();
      section.removeEventListener("pointerenter", handlePointerEnter);
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
      removePointerListener();
      removeReducedMotionListener();
    };
  }, [sectionRef]);
}

function ProductWall({ opacity, isActive }) {
  return (
    <div
      className="euro-flavor-stage__wall"
      style={{ opacity, transform: `translate3d(0, ${(1 - opacity) * 28}px, 0) scale(${0.98 + opacity * 0.02})` }}
      aria-hidden={!isActive}
    >
      <div className="euro-flavor-stage__wall-copy">
        <span>{flavorScenes[5].eyebrow}</span>
        <h3>{flavorScenes[5].title}</h3>
        <p>{flavorScenes[5].description}</p>
        <div className="euro-flavor-stage__actions">
          <Link
            className="button button-primary euro-flavor-stage__primary"
            to="/chips"
            tabIndex={isActive ? 0 : -1}
            data-cursor="cta"
            data-cursor-label="Explore"
          >
            Explore Products
          </Link>
          <a
            className="euro-flavor-stage__secondary"
            href="/beverages"
            tabIndex={isActive ? 0 : -1}
            data-cursor="cta"
            data-cursor-label="Explore"
          >
            Find Your Flavor
          </a>
        </div>
      </div>
      <div className="euro-flavor-stage__wall-grid" aria-label="Euro product range">
        {productWall.map((product, index) => (
          <article
            className="euro-flavor-stage__wall-card"
            key={product.label}
            style={{ "--wall-delay": `${index * 38}ms` }}
            data-cursor="product"
          >
            <img src={product.src} alt={product.alt} loading="lazy" />
            <span>{product.label}</span>
          </article>
        ))}
      </div>
    </div>
  );
}

function MobileFlavorStory() {
  return (
    <div className="euro-flavor-stage__mobile-story" aria-label="Euro Flavor Stage scenes">
      {flavorScenes.slice(0, 5).map((scene) => (
        <article className={`euro-flavor-stage__mobile-card euro-flavor-stage__mobile-card--${scene.id}`} key={scene.id}>
          <div className="euro-flavor-stage__mobile-card-copy">
            <span>{scene.eyebrow}</span>
            <h3>{scene.title}</h3>
            <p>{scene.description}</p>
          </div>
          <img src={scene.product.src} alt={scene.product.alt} loading={scene.id === "intro" ? "eager" : "lazy"} />
        </article>
      ))}

      <article className="euro-flavor-stage__mobile-card euro-flavor-stage__mobile-card--final">
        <div className="euro-flavor-stage__mobile-card-copy">
          <span>{flavorScenes[5].eyebrow}</span>
          <h3>{flavorScenes[5].title}</h3>
          <p>{flavorScenes[5].description}</p>
          <div className="euro-flavor-stage__actions">
            <Link className="button button-primary euro-flavor-stage__primary" to="/chips" data-cursor="cta" data-cursor-label="Explore">
              Explore Products
            </Link>
            <a className="euro-flavor-stage__secondary" href="#products" data-cursor="cta" data-cursor-label="Explore">
              Find Your Flavor
            </a>
          </div>
        </div>
        <div className="euro-flavor-stage__mobile-wall">
          {productWall.slice(0, 6).map((product) => (
            <img src={product.src} alt={product.alt} key={product.label} loading="lazy" />
          ))}
        </div>
      </article>
    </div>
  );
}

export function EuroFlavorStagePortal({ enabled }) {
  const [mountNode, setMountNode] = React.useState(null);

  React.useLayoutEffect(() => {
    if (!enabled || typeof document === "undefined") return undefined;

    const main = document.querySelector(".home-page main");
    const anchor = main?.querySelector(".patch-gold");

    if (!main || !anchor) return undefined;

    const mount = document.createElement("div");
    mount.className = "euro-flavor-stage-slot";
    anchor.insertAdjacentElement("afterend", mount);
    setMountNode(mount);

    return () => {
      setMountNode(null);
      mount.remove();
    };
  }, [enabled]);

  if (!enabled || !mountNode) return null;

  return createPortal(<EuroFlavorStage />, mountNode);
}

export default function EuroFlavorStage() {
  const sectionRef = React.useRef(null);
  const { progress, activeIndex } = useFlavorStageProgress(sectionRef);
  useFlavorStagePointer(sectionRef);
  const activeScene = flavorScenes[activeIndex];
  const finalOpacity = clamp((progress - 0.78) / 0.16);
  const copyIsFinal = activeIndex === flavorScenes.length - 1;
  const showSceneCopy = !copyIsFinal && finalOpacity < 0.04;

  return (
    <section
      className={`euro-flavor-stage${copyIsFinal ? " is-final" : ""}${finalOpacity > 0.04 ? " is-wall-entering" : ""}${activeScene.theme === "light" ? " is-light-scene" : ""}`}
      ref={sectionRef}
      aria-labelledby="euro-flavor-stage-title"
      style={{
        "--scene-bg": activeScene.bg,
        "--scene-accent": activeScene.accent,
        "--stage-progress": progress,
      }}
    >
      <div className="euro-flavor-stage__sticky">
        <div className="euro-flavor-stage__bg" aria-hidden="true" />
        <div className="euro-flavor-stage__background-aura" aria-hidden="true" />
        <div className="euro-flavor-stage__pointer-glow" aria-hidden="true" />
        <div className="euro-flavor-stage__grain" aria-hidden="true" />
        <div className="euro-flavor-stage__rings" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="euro-flavor-stage__particles" aria-hidden="true" data-cursor="flavor">
          <div className="euro-flavor-stage__particles-parallax">
            {particleSeeds.map((seed, index) => (
              <span
                className="euro-flavor-stage__particle-scroll-layer"
                key={`${seed.join("-")}-${index}`}
                style={getParticleStyle(seed, index, progress)}
              >
                <span className={`euro-flavor-stage__particle euro-flavor-stage__particle--${activeScene.particleType}`} />
              </span>
            ))}
          </div>
        </div>

        <div className="euro-flavor-stage__scene-label">
          <span>0{activeIndex + 1}</span>
          <strong>{activeScene.eyebrow}</strong>
        </div>

        <div className="euro-flavor-stage__product-wrap" aria-label="Euro featured products">
          <span className="euro-flavor-stage__spotlight" aria-hidden="true" />
          <span className="euro-flavor-stage__pedestal" aria-hidden="true" />
          {flavorScenes.slice(0, 5).map((scene, index) => {
            const productStyle = getProductStyle(index, progress);
            const isVisible = productStyle.opacity > 0.06;

            return (
              <span
                className={`euro-flavor-stage__product-scroll-layer ${scene.product.className}`}
                key={scene.id}
                style={{ ...productStyle, pointerEvents: isVisible ? "auto" : "none" }}
                aria-hidden={!isVisible}
                data-cursor="product"
              >
                <span className="euro-flavor-stage__product-pointer-layer">
                  <span className="euro-flavor-stage__product-ambient-layer">
                    <span className="euro-flavor-stage__product-shine" aria-hidden="true" />
                    <img
                      className="euro-flavor-stage__product"
                      src={scene.product.src}
                      alt={scene.product.alt}
                      loading={index < 2 ? "eager" : "lazy"}
                    />
                  </span>
                </span>
              </span>
            );
          })}
        </div>

        {showSceneCopy ? (
          <div className="euro-flavor-stage__copy" key={activeScene.id}>
            <span>{activeScene.eyebrow}</span>
            <h2 id="euro-flavor-stage-title">{activeScene.title}</h2>
            <p>{activeScene.description}</p>
          </div>
        ) : (
          <h2 className="euro-flavor-stage__sr-title" id="euro-flavor-stage-title">
            {flavorScenes[5].title}
          </h2>
        )}

        <div className="euro-flavor-stage__progress" aria-hidden="true">
          {flavorScenes.map((scene, index) => (
            <span className={index === activeIndex ? "is-active" : ""} key={scene.id} />
          ))}
        </div>

        <ProductWall opacity={finalOpacity} isActive={copyIsFinal} />
      </div>

      <MobileFlavorStory />
    </section>
  );
}
