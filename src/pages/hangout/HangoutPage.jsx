import { useCallback, useEffect, useRef, useState } from "react";
import "./HangoutPage.css";

const CONFETTI_COLORS = ["#be004b", "#ffdea7", "#9df197", "#ffffff", "#203679", "#ffa9b7", "#00d4aa", "#ffd700"];
const VIEWPORT_PAD = 16;
const DODGE_RADIUS = 120;

function getViewportBounds(buttonW, buttonH) {
  const vv = window.visualViewport;
  const width = vv?.width ?? window.innerWidth;
  const height = vv?.height ?? window.innerHeight;
  const offsetLeft = vv?.offsetLeft ?? 0;
  const offsetTop = vv?.offsetTop ?? 0;

  return {
    minX: offsetLeft + VIEWPORT_PAD,
    minY: offsetTop + VIEWPORT_PAD,
    maxX: offsetLeft + width - buttonW - VIEWPORT_PAD,
    maxY: offsetTop + height - buttonH - VIEWPORT_PAD,
  };
}

function clampPosition(x, y, buttonW, buttonH) {
  const bounds = getViewportBounds(buttonW, buttonH);
  return {
    x: Math.min(bounds.maxX, Math.max(bounds.minX, x)),
    y: Math.min(bounds.maxY, Math.max(bounds.minY, y)),
  };
}

function randomPosition(buttonW, buttonH) {
  const bounds = getViewportBounds(buttonW, buttonH);
  const rangeX = Math.max(0, bounds.maxX - bounds.minX);
  const rangeY = Math.max(0, bounds.maxY - bounds.minY);
  return {
    x: bounds.minX + Math.random() * rangeX,
    y: bounds.minY + Math.random() * rangeY,
  };
}

function pickDodgePosition(fromX, fromY, buttonW, buttonH) {
  let best = randomPosition(buttonW, buttonH);
  let bestDist = Math.hypot(fromX - (best.x + buttonW / 2), fromY - (best.y + buttonH / 2));

  for (let i = 0; i < 28; i += 1) {
    const candidate = randomPosition(buttonW, buttonH);
    const cx = candidate.x + buttonW / 2;
    const cy = candidate.y + buttonH / 2;
    const dist = Math.hypot(fromX - cx, fromY - cy);
    if (dist > bestDist) {
      best = candidate;
      bestDist = dist;
    }
    if (dist > 200) break;
  }

  return best;
}

function runConfetti(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 180 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.5,
    vx: (Math.random() - 0.5) * 10,
    vy: Math.random() * 4 + 3,
    w: Math.random() * 10 + 5,
    h: Math.random() * 6 + 4,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rot: Math.random() * 360,
    spin: (Math.random() - 0.5) * 12,
    life: 1,
  }));

  let frameId;
  let running = true;

  const tick = () => {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let alive = 0;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.vx *= 0.99;
      p.rot += p.spin;
      if (p.y > canvas.height + 40) p.life = 0;
      if (p.life <= 0) continue;
      alive++;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (alive > 0) {
      frameId = requestAnimationFrame(tick);
    }
  };

  frameId = requestAnimationFrame(tick);

  return () => {
    running = false;
    cancelAnimationFrame(frameId);
  };
}

export default function HangoutPage() {
  const [accepted, setAccepted] = useState(false);
  const [noPos, setNoPos] = useState(() => ({ x: 0, y: 0 }));
  const [noReady, setNoReady] = useState(false);
  const noRef = useRef(null);
  const canvasRef = useRef(null);
  const stopConfettiRef = useRef(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);

    return () => {
      document.body.style.overflow = prevOverflow;
      robots.remove();
    };
  }, []);

  const getNoSize = useCallback(() => {
    const rect = noRef.current?.getBoundingClientRect();
    return {
      w: rect?.width ?? 100,
      h: rect?.height ?? 48,
    };
  }, []);

  const placeNoButton = useCallback(() => {
    const { w, h } = getNoSize();
    setNoPos(randomPosition(w, h));
    setNoReady(true);
  }, [getNoSize]);

  const moveNoAway = useCallback(
    (clientX, clientY, { force = false } = {}) => {
      if (accepted || !noRef.current) return;

      const rect = noRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(clientX - cx, clientY - cy);
      const onButton =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      if (!force && !onButton && dist >= DODGE_RADIUS) return;

      const { w, h } = getNoSize();
      setNoPos(pickDodgePosition(clientX, clientY, w, h));
    },
    [accepted, getNoSize],
  );

  useEffect(() => {
    placeNoButton();

    const onResize = () => {
      const { w, h } = getNoSize();
      setNoPos((prev) => clampPosition(prev.x, prev.y, w, h));
    };

    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("scroll", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("scroll", onResize);
    };
  }, [placeNoButton, getNoSize]);

  useEffect(() => {
    if (accepted) return undefined;

    const onMove = (e) => moveNoAway(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      const t = e.touches[0];
      if (t) moveNoAway(t.clientX, t.clientY);
    };
    const onTouchStart = (e) => {
      const t = e.touches[0];
      if (!t) return;
      const rect = noRef.current?.getBoundingClientRect();
      if (!rect) return;

      const onButton =
        t.clientX >= rect.left &&
        t.clientX <= rect.right &&
        t.clientY >= rect.top &&
        t.clientY <= rect.bottom;
      const near =
        Math.hypot(t.clientX - (rect.left + rect.width / 2), t.clientY - (rect.top + rect.height / 2)) <
        DODGE_RADIUS;

      if (onButton || near) {
        e.preventDefault();
        moveNoAway(t.clientX, t.clientY, { force: true });
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: false, capture: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart, { capture: true });
    };
  }, [accepted, moveNoAway]);

  const blockNoAction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    moveNoAway(e.clientX, e.clientY, { force: true });
  };

  const handleYes = () => {
    setAccepted(true);
    if (canvasRef.current) {
      stopConfettiRef.current = runConfetti(canvasRef.current);
    }
  };

  useEffect(() => {
    return () => stopConfettiRef.current?.();
  }, []);

  return (
    <div className={`hangout-page${accepted ? " hangout-page--celebrate" : ""}`}>
      <div className="hangout-page__bg" aria-hidden="true">
        <span className="hangout-blob hangout-blob--1" />
        <span className="hangout-blob hangout-blob--2" />
        <span className="hangout-blob hangout-blob--3" />
        <span className="hangout-blob hangout-blob--4" />
      </div>

      <canvas ref={canvasRef} className="hangout-page__confetti" aria-hidden="true" />

      <main className="hangout-page__main">
        {!accepted ? (
          <>
            <p className="hangout-page__eyebrow">important question</p>
            <h1 className="hangout-page__question">are we hanging out tomorrow?</h1>

            <div className="hangout-page__actions">
              <button type="button" className="hangout-btn hangout-btn--yes" onClick={handleYes}>
                Yes!
              </button>
            </div>

            <div
              ref={noRef}
              role="presentation"
              className={`hangout-btn hangout-btn--no${noReady ? " is-ready" : ""}`}
              style={{ left: noPos.x, top: noPos.y }}
              onPointerDown={blockNoAction}
              onMouseEnter={(e) => moveNoAway(e.clientX, e.clientY, { force: true })}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              aria-hidden="true"
            >
              No
            </div>
          </>
        ) : (
          <div className="hangout-page__success">
            <p className="hangout-page__yay">Yayyyyy!</p>
            <p className="hangout-page__whatsapp">dm me the time on whatsapp please</p>
          </div>
        )}
      </main>
    </div>
  );
}
