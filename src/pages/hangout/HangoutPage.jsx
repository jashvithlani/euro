import { useCallback, useEffect, useRef, useState } from "react";
import "./HangoutPage.css";

const CONFETTI_COLORS = ["#be004b", "#ffdea7", "#9df197", "#ffffff", "#203679", "#ffa9b7", "#00d4aa", "#ffd700"];

function randomPosition(buttonW = 100, buttonH = 48) {
  const pad = 24;
  const rangeX = Math.max(0, window.innerWidth - buttonW - pad * 2);
  const rangeY = Math.max(0, window.innerHeight - buttonH - pad * 2);
  return {
    x: pad + Math.random() * rangeX,
    y: pad + Math.random() * rangeY,
  };
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

  useEffect(() => {
    const place = () => {
      const w = noRef.current?.offsetWidth ?? 100;
      const h = noRef.current?.offsetHeight ?? 48;
      setNoPos(randomPosition(w, h));
      setNoReady(true);
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, []);

  const dodgePointer = useCallback(
    (clientX, clientY) => {
      if (accepted || !noRef.current) return;

      const rect = noRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(clientX - cx, clientY - cy);

      if (dist < 130) {
        const w = rect.width;
        const h = rect.height;
        let next = randomPosition(w, h);
        let tries = 0;
        while (
          tries < 24 &&
          Math.hypot(clientX - (next.x + w / 2), clientY - (next.y + h / 2)) < 150
        ) {
          next = randomPosition(w, h);
          tries++;
        }
        setNoPos(next);
      }
    },
    [accepted],
  );

  useEffect(() => {
    if (accepted) return undefined;

    const onMove = (e) => dodgePointer(e.clientX, e.clientY);
    const onTouch = (e) => {
      const t = e.touches[0];
      if (t) dodgePointer(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [accepted, dodgePointer]);

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

            <button
              ref={noRef}
              type="button"
              className={`hangout-btn hangout-btn--no${noReady ? " is-ready" : ""}`}
              style={{ left: noPos.x, top: noPos.y }}
              onMouseEnter={(e) => dodgePointer(e.clientX, e.clientY)}
              onTouchStart={(e) => {
                const t = e.touches[0];
                if (t) dodgePointer(t.clientX, t.clientY);
              }}
              onClick={(e) => {
                e.preventDefault();
                dodgePointer(e.clientX, e.clientY);
              }}
              aria-label="No (good luck clicking this)"
            >
              No
            </button>
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
