import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 999;
const SHOW_AFTER_SCROLL = 280;

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setVisible(isMobile && window.scrollY > SHOW_AFTER_SCROLL);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      className="scroll-to-top"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 5.5 6 11.5l1.4 1.4 3.6-3.6V18h2V9.3l3.6 3.6 1.4-1.4-6-6Z" />
      </svg>
    </button>
  );
}
