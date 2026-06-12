import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { asset } from "./asset.js";
import { asset as categoryAsset } from "../category/asset.js";
import { sharedAsset } from "../../shared/asset.js";
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

const socialCards = [
  { image: "social-card-1.png", alt: "Euro snack moment" },
  { image: "social-card-2.png", alt: "Euro chips pack moment" },
  { image: "social-card-3.png", alt: "Euro chips everywhere moment" },
  { image: "social-card-4.png", alt: "Euro table snack moment" },
  { image: "social-card-5.png", alt: "Fresh and tasty Euro beverages" },
];

export default function AboutPage() {
  const timelineRef = useRef(null);
  const timelineProductMarkerRef = useRef(null);
  const activeTimelineProductRef = useRef(0);
  const showTimelineProductRef = useRef(false);
  const timelineProductLeftRef = useRef(0);
  const [activeTimelineProduct, setActiveTimelineProduct] = useState(0);
  const [showTimelineProduct, setShowTimelineProduct] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    let rafId = 0;

    const updateTimelineProduct = () => {
      rafId = 0;

      const timeline = timelineRef.current;
      if (!timeline) return;

      const line = timeline.querySelector(".timeline-line");
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

      const milestones = [...timeline.querySelectorAll(".timeline-milestone, .timeline-text-only")];
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

    updateTimelineProduct();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
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
              <img
                key={product.category}
                className={`timeline-product-marker__image${
                  index === activeTimelineProduct ? " is-active" : ""
                }`}
                src={product.image}
                alt=""
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
                      <img src={asset('about-hero-left-source.png')} alt="" />
                    </div>
                  </div>
                  <div className="about-hero-card-wrap about-hero-right-wrap" aria-hidden="true">
                    <div className="about-hero-card about-hero-right-card">
                      <img src={asset('about-hero-right-source.png')} alt="" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="about-journey" id="journey">
                <img src={asset('about-office.png')} alt="Euro India Foods office" />
                <span className="float-tag tag-trusted">#trusted</span>
                <span className="float-tag tag-loyal">#loyal</span>
                <span className="float-tag tag-experienced">#experienced</span>
                <h2>The Family Legacy</h2>
                <p>Euro India Foods started as a dream in a local kitchen, rooted in the belief that the soul of Indian snacking deserved a global stage. We aren't just a food company; we are curators of culture. By blending traditional family recipes with modern manufacturing excellence, we've created a bridge between generations. Every chip, every sip, carries the warmth of home and the excitement of world-class gourmet.</p>
              </section>

              <section className="about-pillars">
                <div className="about-section-heading">
                  <span>Our Compass</span>
                  <h2>Pillars of Excellence</h2>
                </div>
                <div className="pillar-grid">
                  <article className="pillar-card">
                    <div className="pillar-icon"><img className="pillar-icon-quality" src={asset('about-icon-quality.svg')} alt="" /></div>
                    <h3>Quality</h3>
                    <p>Sourcing only the finest ingredients from local Indian farms to ensure every bite is a premium experience.</p>
                  </article>
                  <article className="pillar-card">
                    <div className="pillar-icon"><img className="pillar-icon-innovation" src={asset('about-icon-innovation.svg')} alt="" /></div>
                    <h3>Innovation</h3>
                    <p>Reimagining traditional textures and shapes for a youthful, modern snacking aesthetic.</p>
                  </article>
                  <article className="pillar-card">
                    <div className="pillar-icon"><img className="pillar-icon-community" src={asset('about-icon-community.svg')} alt="" /></div>
                    <h3>Community</h3>
                    <p>Building a sustainable ecosystem that supports our farmers and delights our consumers worldwide.</p>
                  </article>
                  <article className="pillar-card">
                    <div className="pillar-icon"><img className="pillar-icon-taste" src={asset('about-icon-taste.svg')} alt="" /></div>
                    <h3>Taste</h3>
                    <p>An uncompromising commitment to bold, authentic, and memorable flavor profiles.</p>
                  </article>
                </div>
              </section>

              <section className="about-manufacturing">
                <img className="manufacturing-photo" src={asset('about-manufacturing.png')} alt="Euro India Foods manufacturing line" />
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
                    <span className="manufacturing-icon"><img src={asset('about-icon-ribbon.png')} alt="" /></span>
                    <div>
                      <h3>Strict Quality Control</h3>
                      <p>Rigorous testing protocols ensure every batch meets the highest standards of safety, taste, and reliability.</p>
                    </div>
                  </div>
                  <div className="manufacturing-feature">
                    <span className="manufacturing-icon"><img src={asset('about-icon-chain.png')} alt="" /></span>
                    <div>
                      <h3>Efficient Supply Chain</h3>
                      <p>A robust distribution network ensures timely delivery and product availability across markets.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section ref={timelineRef} className="about-timeline" id="milestones">
                <div className="about-section-heading">
                  <span>The Evolution</span>
                  <h2>Our <em>Milestones</em></h2>
                </div>
                <div className="timeline-line" aria-hidden="true"></div>
                <article className="timeline-milestone timeline-2009 timeline-left">
                  <div className="timeline-copy timeline-copy-left">
                    <h3>2009</h3>
                    <h4>The Spark</h4>
                    <p>Formation of Euro India Fresh Foods Limited with a vision to establish a strong presence in the packaged food industry.</p>
                  </div>
                  <div className="timeline-card timeline-2009-card" aria-label="Euro India Foods plant">
                    <img src={asset('about-timeline-2009.png')} alt="" />
                  </div>
                </article>
                <article className="timeline-milestone timeline-2012 timeline-right">
                  <div className="timeline-card timeline-2012-card" aria-label="Scaling Up production">
                    <img src={asset('about-timeline-2012.png')} alt="" />
                  </div>
                  <div className="timeline-copy timeline-copy-right">
                    <h3>2012</h3>
                    <h4>Scaling Up</h4>
                    <p>Commencement of commercial operations and the establishment of manufacturing capabilities for chips and fried snacks.</p>
                  </div>
                </article>
                <article className="timeline-milestone timeline-2014 timeline-left">
                  <div className="timeline-copy timeline-copy-left">
                    <h3>2014</h3>
                    <h4>Public Debut</h4>
                    <ul>
                      <li>Received ISO 22000:2005 certification for food safety and quality standards.</li>
                      <li>Honoured as Asia's Fastest Growing Marketing Brand at WCRC Leaders Asia Summit.</li>
                    </ul>
                  </div>
                  <div className="timeline-card timeline-iso-card" aria-label="ISO 22000:2005 certification">
                    <img src={sharedAsset("footer-cert-iso-22000.png")} alt="" />
                  </div>
                </article>
                <article className="timeline-milestone timeline-2015 timeline-right">
                  <div className="timeline-card timeline-2015-card" aria-label="Global Reach production line">
                    <img src={asset('about-timeline-2015.png')} alt="" />
                  </div>
                  <div className="timeline-copy timeline-copy-right">
                    <h3>2015</h3>
                    <h4>Global Reach</h4>
                    <ul>
                      <li>Awarded as Fastest Growing Indian Company at the International Achievers Summit in Bangkok, Thailand.</li>
                      <li>Secured the International Star for Quality at the International Star Award in Geneva.</li>
                    </ul>
                  </div>
                </article>
                <article className="timeline-milestone timeline-2016 timeline-left">
                  <div className="timeline-copy timeline-copy-left">
                    <h3>2016</h3>
                    <h4>Limited</h4>
                    <ul>
                      <li>Converted from a private company to a public company, effecting the strength of the business and its readiness for new opportunities.</li>
                      <li>Recognised with the ESQR Quality Choice Prize in Berlin for business excellence.</li>
                    </ul>
                  </div>
                  <div className="timeline-card timeline-award-card" aria-label="ESQR Quality Choice Prize">
                    <div className="timeline-award-crop">
                      <img src={asset('about-timeline-award-source.png')} alt="" />
                    </div>
                  </div>
                </article>
                <article className="timeline-milestone timeline-2017 timeline-right">
                  <div className="timeline-card timeline-nse-card">
                    <img src={asset('about-timeline-nse-source.png')} alt="NSE logo" />
                  </div>
                  <div className="timeline-copy timeline-copy-right">
                    <h3>2017</h3>
                    <h4>NSE</h4>
                    <p>Listed successfully on NSE Emerge, marking a significant entry into public capital markets.</p>
                    <p>* Received the Surat Entrepreneur and Excellence Award.</p>
                  </div>
                </article>
                <article className="timeline-text-only timeline-2021">
                  <div className="timeline-copy timeline-copy-left">
                    <h3>2021</h3>
                    <h4>Excellence</h4>
                    <p>* Migration to the NSE Main Board, elevating the Company's presence in the public market.</p>
                    <p>* Acknowledged during the Vibrant Gujarat Global Summit for entrepreneurship and recognised continued excellence.</p>
                  </div>
                  <div className="timeline-card timeline-2021-card" aria-label="Vibrant Gujarat">
                    <img src={asset('about-timeline-2021.png')} alt="" />
                  </div>
                </article>
                <article className="timeline-milestone timeline-2025 timeline-right">
                  <div className="timeline-card timeline-gt-card" aria-label="Gujarat Titans x Euro">
                    <img className="timeline-gt-logo" src={asset('about-timeline-gt-source.png')} alt="" />
                    <span>x</span>
                    <img className="timeline-euro-logo" src={asset('about-timeline-euro-logo-source.png')} alt="" />
                  </div>
                  <div className="timeline-copy timeline-copy-right">
                    <h3>2025</h3>
                    <h4>IPL- Gujarat Titans</h4>
                    <p>Named as the Official Snacking Partner of Gujarat Titans IPL team, broadening visibility and strengthening consumer engagement through sports partnerships.</p>
                  </div>
                </article>
                <article className="timeline-text-only timeline-2026">
                  <div className="timeline-copy timeline-copy-left">
                    <h3>2026</h3>
                    <h4>Manufacturing Expansion</h4>
                    <p>28.57 Acres manufacturing plant development at Chikhli, sized huge &amp; production capacity to next level.</p>
                  </div>
                  <div className="timeline-card timeline-2026-card" aria-label="Euro Food Park">
                    <img src={asset('about-timeline-2026-source.png')} alt="" />
                  </div>
                </article>
              </section>

              <section className="about-infrastructure">
                <div className="about-section-heading">
                  <span>Our Foundation</span>
                  <h2>Infrastructure <em>& Capacity</em></h2>
                </div>
                <div className="infra-grid">
                  <article className="infra-card infra-large">
                    <img src={asset('about-infra-surat.png')} alt="Surat plant" />
                    <div>
                      <h3>Surat Plant</h3>
                      <p>Our flagship Surat facility spans over <strong>2,00,000 square feet</strong>, housing advanced production lines for chips, namkeen, and beverages. Designed for high-volume output without compromising on craftsmanship, this plant is the heart of our operations.</p>
                    </div>
                  </article>
                  <article className="infra-card infra-large">
                    <img src={asset('about-infra-chikhli.png')} alt="Chikhli plant" />
                    <div>
                      <h3>Chikhli Plant</h3>
                      <p>Spread across <strong>28.57 acres of land</strong>, our Chikhli plant is built for the future. With expansive infrastructure and modern processing capabilities, it enables us to meet growing demand while maintaining the highest standards of hygiene and quality.</p>
                    </div>
                  </article>
                  <article className="infra-card">
                    <img src={asset('about-infra-line.png')} alt="Rain water harvesting" />
                    <div>
                      <h3>Rain Water Harvesting</h3>
                      <p>Every drop counts. Our facilities are equipped with rainwater harvesting systems that conserve water and replenish groundwater, supporting long-term water sustainability.</p>
                    </div>
                  </article>
                  <article className="infra-card">
                    <img src={asset('about-infra-line.png')} alt="Solar power generation" />
                    <div>
                      <h3>Solar Power Generation</h3>
                      <p>Our plants are powered by clean, renewable solar energy - reducing dependence on conventional electricity and significantly lowering carbon emissions.</p>
                    </div>
                  </article>
                  <article className="infra-card">
                    <img src={asset('about-infra-line.png')} alt="Effluent treatment plant" />
                    <div>
                      <h3>Effluent Treatment Plant (ETP) - Zero Liquid Discharge</h3>
                      <p>We treat 100% of our wastewater through our in-house ETP, achieving Zero Liquid Discharge. Not a single drop of untreated water leaves our premises.</p>
                    </div>
                  </article>
                  <article className="infra-card">
                    <img src={asset('about-infra-line.png')} alt="Bio gas plant" />
                    <div>
                      <h3>Bio-Gas Plant - Agro Waste to Energy</h3>
                      <p>Agricultural waste from our processes is converted into clean bio-gas through our dedicated bio-gas plant - turning waste into a valuable energy resource.</p>
                    </div>
                  </article>
                </div>
              </section>

              <div className="about-patch"></div>

              <section className="about-logistics">
                <h2>Logistics</h2>
                <p>Getting our products from the plant to your shelf is just as important as making them. With a robust in-house logistics network of <strong>40+ fleets</strong>, we ensure timely, efficient, and reliable delivery across the country.</p>
                <img src={asset('about-logistics.png')} alt="Euro logistics fleet" />
              </section>

              <section className="about-family">
                <h2>The Euro India Family</h2>
                <img src={asset('about-family.png')} alt="Euro India Foods team" />
                <span className="float-tag family-tag-one">#Teamwork</span>
                <span className="float-tag family-tag-two">#Innovative</span>
                <span className="float-tag family-tag-three">#Happiness</span>
              </section>

              <section className="about-social">
                <div className="about-social-header">
                  <div className="about-social-heading">
                    <span className="about-social-kicker">Social Feed</span>
                    <h2>
                      #EuroIndia
                      <br />
                      Moments
                    </h2>
                  </div>
                  <p className="about-social-tagline">
                    Tag us in your snack selfies for a chance
                    <br />
                    to get featured!
                  </p>
                </div>
                <div className="about-social-cards" aria-label="Euro India social feed">
                  {socialCards.map((card, index) => (
                    <img
                      key={card.image}
                      className="about-social-card"
                      src={asset(card.image)}
                      alt={card.alt}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  ))}
                </div>
              </section>
            </main>
    </>
  );
}
