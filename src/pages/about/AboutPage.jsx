import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import EuroMoments from "../../components/EuroMoments.jsx";
import OptimizedImage from "../../components/OptimizedImage.jsx";
import { asset } from "./asset.js";
import { asset as categoryAsset } from "../category/asset.js";
import { PillarCard, PillarsSectionHeading } from "./PillarCard.jsx";
import { pillars } from "./pillars-content.jsx";
import { InfrastructureCard, InfrastructureSectionHeading } from "./InfrastructureCard.jsx";
import { infrastructureItems } from "./infrastructure-content.jsx";
import { TimelineMilestone, TimelineSectionHeading } from "./TimelineMilestone.jsx";
import { timelineMilestones } from "./timeline-milestones.js";
import { useHorizontalScrollPin } from "./useHorizontalScrollPin.js";
import { useTimelineMobileScroll } from "./useTimelineMobileScroll.js";
import "./AboutPage.css";

const timelineProducts = [
  { category: "Chips", image: categoryAsset("category-chips-wide-hero-masti.png") },
  { category: "Beverages", image: categoryAsset("category-beverage-fig-mango.png") },
  { category: "Getmore", image: categoryAsset("category-getmore-tomato.png") },
  { category: "Namkeen", image: categoryAsset("category-namkeen-shahi-mixture.png") },
  { category: "Chikki", image: categoryAsset("category-chikki-peanut.png") },
  { category: "Khakhra", image: categoryAsset("category-khakhra-masala.png") },
  { category: "Bakery", image: categoryAsset("category-bakery-jeera-khari.png") },
  { category: "Fryums", image: categoryAsset("category-fryums-magic-abcde.png") },
  { category: "Farali", image: categoryAsset("category-farali-kela-wafers.png") },
];

export default function AboutPage() {
  const timelineRef = useRef(null);
  const mobileScrollRef = useRef(null);
  const mobileStickyRef = useRef(null);
  const mobileViewportRef = useRef(null);
  const mobileTrackRef = useRef(null);
  const infraScrollRef = useRef(null);
  const infraStickyRef = useRef(null);
  const infraViewportRef = useRef(null);
  const infraTrackRef = useRef(null);
  const pillarsScrollRef = useRef(null);
  const pillarsStickyRef = useRef(null);
  const pillarsViewportRef = useRef(null);
  const pillarsTrackRef = useRef(null);
  const timelineProductMarkerRef = useRef(null);
  const activeTimelineProductRef = useRef(0);
  const showTimelineProductRef = useRef(false);
  const timelineProductLeftRef = useRef(0);
  const [activeTimelineProduct, setActiveTimelineProduct] = useState(0);
  const [showTimelineProduct, setShowTimelineProduct] = useState(false);

  useTimelineMobileScroll({
    driverRef: mobileScrollRef,
    stickyRef: mobileStickyRef,
    viewportRef: mobileViewportRef,
    trackRef: mobileTrackRef,
  });

  useHorizontalScrollPin({
    driverRef: pillarsScrollRef,
    stickyRef: pillarsStickyRef,
    viewportRef: pillarsViewportRef,
    trackRef: pillarsTrackRef,
    tileWidthCssVar: "--pillars-tile-width",
    progressCssVar: "--pillars-progress",
    tileSelector: ".about-pillars__scroll-tile",
    edgeFadeCssVar: "--pillars-edge-fade",
    approachCssVar: "--pillars-approach",
    tileWidthScale: 0.8,
    tileMotion: "soft",
    edgeFadeZone: 0.04,
  });

  useHorizontalScrollPin({
    driverRef: infraScrollRef,
    stickyRef: infraStickyRef,
    viewportRef: infraViewportRef,
    trackRef: infraTrackRef,
    tileWidthCssVar: "--infra-tile-width",
    progressCssVar: "--infra-progress",
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const desktopQuery = window.matchMedia("(min-width: 1000px)");
    let rafId = 0;

    const updateTimelineProduct = () => {
      rafId = 0;

      if (!desktopQuery.matches) return;

      const timeline = timelineRef.current;
      if (!timeline) return;

      const line = timeline.querySelector(".about-timeline__desktop .timeline-line");
      if (!line) return;

      const viewportCenter = window.innerHeight / 2;
      const lineRect = line.getBoundingClientRect();
      const isProductOnLine = lineRect.top <= viewportCenter && lineRect.bottom >= viewportCenter;
      const nextTimelineProductLeft = Math.round(lineRect.left + lineRect.width / 2);

      if (showTimelineProductRef.current !== isProductOnLine) {
        showTimelineProductRef.current = isProductOnLine;
        setShowTimelineProduct(isProductOnLine);
      }

      if (Math.abs(timelineProductLeftRef.current - nextTimelineProductLeft) > 1) {
        timelineProductLeftRef.current = nextTimelineProductLeft;
        timelineProductMarkerRef.current?.style.setProperty(
          "--timeline-product-left",
          `${nextTimelineProductLeft}px`,
        );
      }

      if (!isProductOnLine) return;

      const milestones = [
        ...timeline.querySelectorAll(".about-timeline__desktop .timeline-milestone, .about-timeline__desktop .timeline-text-only"),
      ];
      let nextProductIndex = 0;

      milestones.forEach((milestone, index) => {
        const rect = milestone.getBoundingClientRect();
        const dotStyle = window.getComputedStyle(milestone, "::after");
        const dotTop = Number.parseFloat(dotStyle.top);
        const dotHeight = Number.parseFloat(dotStyle.height);
        const dotCenter = Number.isFinite(dotTop)
          ? rect.top + dotTop + (Number.isFinite(dotHeight) ? dotHeight / 2 : 0)
          : rect.top + rect.height / 2;

        if (dotCenter <= viewportCenter) {
          nextProductIndex = index;
        }
      });

      const boundedProductIndex = Math.min(nextProductIndex, timelineProducts.length - 1);

      if (activeTimelineProductRef.current !== boundedProductIndex) {
        activeTimelineProductRef.current = boundedProductIndex;
        setActiveTimelineProduct(boundedProductIndex);
      }
    };

    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateTimelineProduct);
    };

    const handleDesktopQueryChange = () => {
      if (!desktopQuery.matches) {
        showTimelineProductRef.current = false;
        setShowTimelineProduct(false);
      }

      scheduleUpdate();
    };

    updateTimelineProduct();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    desktopQuery.addEventListener("change", handleDesktopQueryChange);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      desktopQuery.removeEventListener("change", handleDesktopQueryChange);
    };
  }, []);

  const timelineProductMarker =
    typeof document === "undefined"
      ? null
      : createPortal(
          <div
            ref={timelineProductMarkerRef}
            className={`timeline-product-marker${showTimelineProduct ? " is-visible" : ""}`}
            aria-hidden="true"
          >
            {timelineProducts.map((product, index) => (
              <OptimizedImage
                key={product.category}
                className={`timeline-product-marker__image${
                  index === activeTimelineProduct ? " is-active" : ""
                }`}
                src={product.image}
                alt=""
                sizes="120px"
              />
            ))}
          </div>,
          document.body,
        );

  return (
    <>
            {timelineProductMarker}
            <main>
              <section className="about-hero">
                <div className="about-hero-copy">
                  <span className="about-kicker">Legacy Reimagined</span>
                  <h1 className="about-hero-title">
                    <span>From <em>Local</em></span>
                    <span>Roots</span>
                    <span>to <strong>global</strong></span>
                    <span>Flavours</span>
                  </h1>
                  <a className="button button-primary about-hero-btn" href="#journey">Explore Flavors</a>
                </div>
                <div className="about-hero-media">
                  <div className="about-hero-card-wrap about-hero-left-wrap" aria-hidden="true">
                    <div className="about-hero-card about-hero-left-card">
                      <OptimizedImage src={asset('about-hero-left-source.png')} alt="" sizes="(max-width: 999px) 45vw, 360px" priority />
                    </div>
                  </div>
                  <div className="about-hero-card-wrap about-hero-right-wrap" aria-hidden="true">
                    <div className="about-hero-card about-hero-right-card">
                      <OptimizedImage src={asset('about-hero-right-source.png')} alt="" sizes="(max-width: 999px) 45vw, 360px" data-loader-critical="true" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="about-journey" id="journey">
                <OptimizedImage src={asset('about-office.png')} alt="Euro India Foods office" sizes="(max-width: 999px) 92vw, 560px" />
                <span className="float-tag tag-trusted">#trusted</span>
                <span className="float-tag tag-loyal">#loyal</span>
                <span className="float-tag tag-experienced">#experienced</span>
                <h2>The Family Legacy</h2>
                <p>Euro India Foods started as a dream in a local kitchen, rooted in the belief that the soul of Indian snacking deserved a global stage. We aren't just a food company; we are curators of culture. By blending traditional family recipes with modern manufacturing excellence, we've created a bridge between generations. Every chip, every sip, carries the warmth of home and the excitement of world-class gourmet.</p>
              </section>

              <section className="about-pillars">
                <div className="about-pillars__desktop">
                  <PillarsSectionHeading />
                  <div className="pillar-grid">
                    {pillars.map((pillar) => (
                      <PillarCard key={pillar.id} pillar={pillar} />
                    ))}
                  </div>
                </div>

                <div ref={pillarsScrollRef} className="about-pillars__scroll-driver">
                  <div ref={pillarsStickyRef} className="about-pillars__scroll-sticky">
                    <PillarsSectionHeading />
                    <div className="about-pillars__scroll-progress" aria-hidden="true">
                      <span className="about-pillars__scroll-progress-bar" />
                    </div>
                    <div ref={pillarsViewportRef} className="about-pillars__scroll-viewport">
                      <div ref={pillarsTrackRef} className="about-pillars__scroll-track">
                        {pillars.map((pillar, index) => (
                          <article
                            className="about-pillars__scroll-tile"
                            key={pillar.id}
                            aria-label={pillar.title}
                            data-pillar-index={index}
                          >
                            <PillarCard pillar={pillar} />
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="about-pillars__mobile-fallback" aria-label="Pillars of Excellence">
                  <PillarsSectionHeading />
                  <div className="pillar-grid">
                    {pillars.map((pillar) => (
                      <PillarCard key={`fallback-${pillar.id}`} pillar={pillar} />
                    ))}
                  </div>
                </div>
              </section>

              <section className="about-manufacturing">
                <OptimizedImage className="manufacturing-photo" src={asset('about-manufacturing.png')} alt="Euro India Foods manufacturing line" sizes="(max-width: 999px) 92vw, 560px" />
                <div className="manufacturing-copy">
                  <span className="about-kicker">Precision Crafted</span>
                  <h2>
                    Manufacturing
                    <br />
                    <em>Excellence</em>
                  </h2>
                  <div className="manufacturing-feature">
                    <span className="manufacturing-icon"><img src={asset('about-icon-facility.svg')} alt="" /></span>
                    <div>
                      <h3>State-of-the-Art Facility</h3>
                      <p>Operating in a world-class production environment equipped with advanced European technology, ensuring superior quality across snacks and beverages.</p>
                    </div>
                  </div>
                  <div className="manufacturing-feature">
                    <span className="manufacturing-icon"><img src={asset('about-icon-automation.svg')} alt="" /></span>
                    <div>
                      <h3>Automated Precision</h3>
                      <p>Fully automated processes guarantee consistency, hygiene, and precision at every stage - from preparation to packaging.</p>
                    </div>
                  </div>
                  <div className="manufacturing-feature">
                    <span className="manufacturing-icon"><OptimizedImage src={asset('about-icon-ribbon.png')} alt="" sizes="64px" /></span>
                    <div>
                      <h3>Strict Quality Control</h3>
                      <p>Rigorous testing protocols ensure every batch meets the highest standards of safety, taste, and reliability.</p>
                    </div>
                  </div>
                  <div className="manufacturing-feature">
                    <span className="manufacturing-icon"><OptimizedImage src={asset('about-icon-chain.png')} alt="" sizes="64px" /></span>
                    <div>
                      <h3>Efficient Supply Chain</h3>
                      <p>A robust distribution network ensures timely delivery and product availability across markets.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section ref={timelineRef} className="about-timeline" id="milestones">
                <div className="about-timeline__desktop">
                  <TimelineSectionHeading />
                  <div className="timeline-line" aria-hidden="true"></div>
                  {timelineMilestones.map((milestone) => (
                    <TimelineMilestone key={milestone.id} milestone={milestone} layout="desktop" />
                  ))}
                </div>

                <div ref={mobileScrollRef} className="about-timeline__scroll-driver">
                  <div ref={mobileStickyRef} className="about-timeline__scroll-sticky">
                    <TimelineSectionHeading />
                    <div className="about-timeline__scroll-progress" aria-hidden="true">
                      <span className="about-timeline__scroll-progress-bar" />
                    </div>
                    <div ref={mobileViewportRef} className="about-timeline__scroll-viewport">
                      <div ref={mobileTrackRef} className="about-timeline__scroll-track">
                        {timelineMilestones.map((milestone, index) => (
                          <article
                            className="about-timeline__scroll-tile"
                            key={milestone.id}
                            aria-label={`Milestone ${milestone.year}`}
                            data-milestone-index={index}
                          >
                            <TimelineMilestone milestone={milestone} layout="mobile" />
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="about-timeline__mobile-fallback" aria-label="Our Milestones">
                  <TimelineSectionHeading />
                  {timelineMilestones.map((milestone) => (
                    <TimelineMilestone key={`fallback-${milestone.id}`} milestone={milestone} layout="mobile" />
                  ))}
                </div>
              </section>

              <section className="about-infrastructure">
                <div className="about-infrastructure__desktop">
                  <InfrastructureSectionHeading />
                  <div className="infra-grid">
                    {infrastructureItems.map((item) => (
                      <InfrastructureCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>

                <div ref={infraScrollRef} className="about-infrastructure__scroll-driver about-infrastructure__scroll-driver--mirror">
                  <div ref={infraStickyRef} className="about-infrastructure__scroll-sticky">
                    <InfrastructureSectionHeading />
                    <div className="about-infrastructure__scroll-progress" aria-hidden="true">
                      <span className="about-infrastructure__scroll-progress-bar" />
                    </div>
                    <div ref={infraViewportRef} className="about-infrastructure__scroll-viewport">
                      <div ref={infraTrackRef} className="about-infrastructure__scroll-track">
                        {infrastructureItems.map((item, index) => (
                          <article
                            className="about-infrastructure__scroll-tile"
                            key={item.id}
                            aria-label={item.title}
                            data-infra-index={index}
                          >
                            <InfrastructureCard item={item} />
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="about-infrastructure__mobile-fallback" aria-label="Infrastructure and Capacity">
                  <InfrastructureSectionHeading />
                  <div className="infra-grid">
                    {infrastructureItems.map((item) => (
                      <InfrastructureCard key={`fallback-${item.id}`} item={item} />
                    ))}
                  </div>
                </div>
              </section>

              <div className="about-patch"></div>

              <section className="about-logistics">
                <h2>Logistics</h2>
                <p>Getting our products from the plant to your shelf is just as important as making them. With a robust in-house logistics network of <strong>40+ fleets</strong>, we ensure timely, efficient, and reliable delivery across the country.</p>
                <OptimizedImage src={asset('about-logistics.jpeg')} alt="Euro logistics fleet" sizes="(max-width: 999px) 92vw, 480px" />
              </section>

              <section className="about-family">
                <h2>The Euro Family</h2>
                <OptimizedImage src={asset('about-family.png')} alt="Euro India Foods team" sizes="(max-width: 999px) 92vw, 1152px" />
                <span className="float-tag family-tag-one">#Teamwork</span>
                <span className="float-tag family-tag-two">#Innovative</span>
                <span className="float-tag family-tag-three">#Happiness</span>
              </section>

              <EuroMoments className="euro-moments--about" />
            </main>
    </>
  );
}
