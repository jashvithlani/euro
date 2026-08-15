import { useLayoutEffect, useRef, useState } from "react";
import InvestorYearTabs from "../components/InvestorYearTabs.jsx";
import { useInvestorDynamicHeight } from "../components/useInvestorDynamicHeight.js";
import InvestorUpdateItem from "./components/InvestorUpdateItem.jsx";
import { asset } from "./asset.js";
import { sharedAsset } from "../../../shared/asset.js";
import OptimizedImage from "../../../components/OptimizedImage.jsx";
import {
  fyYearTabs,
  getUpdatesForYear,
  updatesPageCopy,
} from "./updates-content.js";
import "./UpdatesPage.css";

export default function UpdatesPage() {
  const [activeYear, setActiveYear] = useState(fyYearTabs[0]);
  const updatesRef = useRef(null);
  const ctaRef = useRef(null);
  const items = getUpdatesForYear(activeYear);

  useLayoutEffect(() => {
    const updates = updatesRef.current;
    const main = updates?.closest(".investor-main");

    if (!updates || !main) {
      return undefined;
    }

    let animationFrame = 0;

    const updateCtaPosition = () => {
      if (!window.matchMedia("(min-width: 1000px)").matches) {
        main.style.removeProperty("--investor-updates-cta-top");
        return;
      }

      const updatesRect = updates.getBoundingClientRect();
      const mainRect = main.getBoundingClientRect();
      const appScale = Number.parseFloat(getComputedStyle(main).getPropertyValue("--app-scale"));
      const layoutScale =
        Number.isFinite(appScale) && appScale > 0
          ? appScale
          : main.offsetWidth
            ? mainRect.width / main.offsetWidth
            : 1;
      main.style.setProperty(
        "--investor-updates-cta-top",
        `${Math.ceil((updatesRect.bottom - mainRect.top) / layoutScale + 40)}px`
      );
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateCtaPosition);
    };

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    const mediaQuery = window.matchMedia("(min-width: 1000px)");
    resizeObserver.observe(updates);
    mediaQuery.addEventListener("change", scheduleUpdate);
    scheduleUpdate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      mediaQuery.removeEventListener("change", scheduleUpdate);
      main.style.removeProperty("--investor-updates-cta-top");
    };
  }, [activeYear]);

  useInvestorDynamicHeight([updatesRef, ctaRef], [activeYear]);

  return (
    <>
      <section ref={updatesRef} className="investor-updates" aria-labelledby="investor-updates-title">
        <header className="investor-updates__header">
          <h2 id="investor-updates-title">{updatesPageCopy.title}</h2>
          <p>{updatesPageCopy.description}</p>
        </header>

        <InvestorYearTabs years={fyYearTabs} activeYear={activeYear} onSelect={setActiveYear} />

        <div className="investor-updates__list">
          {items.map((item) => (
            <InvestorUpdateItem key={`${item.month}-${item.day}-${item.title}`} {...item} />
          ))}
        </div>
      </section>

      <section ref={ctaRef} className="investor-updates-cta" aria-labelledby="investor-updates-cta-title">
        <div className="investor-updates-cta__backdrop" aria-hidden="true">
          <OptimizedImage src={sharedAsset("section-cta-texture.png")} alt="" sizes="(max-width: 999px) 100vw, 1284px" />
          <span className="investor-updates-cta__backdrop-fade" />
        </div>
        <div className="investor-updates-cta__inner">
          <div className="investor-updates-cta__copy">
            <h2 id="investor-updates-cta-title">
              {updatesPageCopy.ctaTitle.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p>{updatesPageCopy.ctaBody}</p>
          </div>
          <button type="button" className="investor-updates-cta__button">
            {updatesPageCopy.ctaButton}
          </button>
        </div>
      </section>
    </>
  );
}
