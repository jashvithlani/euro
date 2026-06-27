import { useEffect, useRef } from "react";
import EuroMoments from "../../components/EuroMoments.jsx";
import { useHorizontalScrollPin } from "../about/useHorizontalScrollPin.js";
import {
  MoodCategoryCard,
  MoodDealershipCta,
  MoodSectionHeading,
  moodCategoryVariants,
} from "./mood-categories.jsx";
import EuroFlavorStage from "./EuroFlavorStage.jsx";
import {
  FavoriteProductCard,
  FavoritesCarouselControls,
  FavoritesSectionHeading,
  favoriteProducts,
} from "./favorites-content.jsx";
import { asset } from "./asset.js";
import "./HomePage.css";

export default function HomePage() {
  const moodScrollRef = useRef(null);
  const moodStickyRef = useRef(null);
  const moodViewportRef = useRef(null);
  const moodTrackRef = useRef(null);
  const favoritesScrollRef = useRef(null);
  const favoritesStickyRef = useRef(null);
  const favoritesViewportRef = useRef(null);
  const favoritesTrackRef = useRef(null);

  useHorizontalScrollPin({
    driverRef: moodScrollRef,
    stickyRef: moodStickyRef,
    viewportRef: moodViewportRef,
    trackRef: moodTrackRef,
    tileWidthCssVar: "--mood-tile-width",
    progressCssVar: "--mood-progress",
    tileSelector: ".mood-section__scroll-tile",
    edgeFadeCssVar: "--mood-edge-fade",
    approachCssVar: "--mood-approach",
    tileWidthScale: 0.88,
    tileMotion: "soft",
    edgeFadeZone: 0.04,
  });

  useHorizontalScrollPin({
    driverRef: favoritesScrollRef,
    stickyRef: favoritesStickyRef,
    viewportRef: favoritesViewportRef,
    trackRef: favoritesTrackRef,
    tileWidthCssVar: "--favorites-tile-width",
    progressCssVar: "--favorites-progress",
    tileSelector: ".favorites-section__scroll-tile",
    edgeFadeCssVar: "--favorites-edge-fade",
    approachCssVar: "--favorites-approach",
    tileWidthScale: 0.88,
    tileMotion: "soft",
    edgeFadeZone: 0.04,
  });

  useEffect(() => {
    const carouselRoots = document.querySelectorAll(
      ".favorites-section__desktop [data-carousel-root], .favorites-section__mobile-fallback [data-carousel-root]",
    );

    const cleanups = [];

    carouselRoots.forEach((root) => {
      const carouselViewport = root.querySelector("[data-carousel-viewport]");
      const carouselPrev = root.querySelector("[data-carousel-prev]");
      const carouselNext = root.querySelector("[data-carousel-next]");

      if (!carouselViewport || !carouselPrev || !carouselNext) {
        return;
      }

      const updateCarouselControls = () => {
        const maxScroll = carouselViewport.scrollWidth - carouselViewport.clientWidth;
        carouselPrev.disabled = carouselViewport.scrollLeft <= 4;
        carouselNext.disabled = carouselViewport.scrollLeft >= maxScroll - 4;
      };

      const moveCarousel = (direction) => {
        carouselViewport.scrollBy({
          left: direction * 256,
          behavior: "smooth",
        });
      };

      const handlePrevClick = () => moveCarousel(-1);
      const handleNextClick = () => moveCarousel(1);

      carouselPrev.addEventListener("click", handlePrevClick);
      carouselNext.addEventListener("click", handleNextClick);
      carouselViewport.addEventListener("scroll", updateCarouselControls);
      updateCarouselControls();

      cleanups.push(() => {
        carouselPrev.removeEventListener("click", handlePrevClick);
        carouselNext.removeEventListener("click", handleNextClick);
        carouselViewport.removeEventListener("scroll", updateCarouselControls);
      });
    });

    const handleLoad = () => {
      carouselRoots.forEach((root) => {
        const carouselViewport = root.querySelector("[data-carousel-viewport]");
        if (!carouselViewport) return;
        const maxScroll = carouselViewport.scrollWidth - carouselViewport.clientWidth;
        const carouselPrev = root.querySelector("[data-carousel-prev]");
        const carouselNext = root.querySelector("[data-carousel-next]");
        if (carouselPrev) carouselPrev.disabled = carouselViewport.scrollLeft <= 4;
        if (carouselNext) carouselNext.disabled = carouselViewport.scrollLeft >= maxScroll - 4;
      });
    };

    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
            <>
            <main>
              <section className="hero">
                <div className="hero-bg"></div>
                <img className="hero-products" src={asset('hero-products.png')} alt="Euro potato chips packs" />
                <div className="hero-copy">
                  <h1 className="hero-title">
                    <span>Every</span>
                    <span>Bite.</span>
                    <span className="accent">A Vibe.</span>
                  </h1>
                  <p>Redefining the snack game with premium ingredients and bold, authentic flavors that travel from our kitchen to your heart.</p>
                </div>
                <a className="button button-primary hero-button" href="/chips">Explore <img className="hero-button-icon" src={asset('hero-explore-icon.svg')} alt="" aria-hidden="true" /></a>
                <h2 className="hero-deserve">You deserve.</h2>
                <span className="hero-tag hero-tag-crunchy" aria-hidden="true">#Crunchy</span>
                <span className="hero-tag hero-tag-delicious" aria-hidden="true">#delicious</span>
              </section>

              <div className="patch patch-gold"></div>

              <EuroFlavorStage />

              <section className="mood-section" id="products">
                <div className="pattern-layer" aria-hidden="true"></div>

                <div className="mood-section__desktop">
                  <MoodSectionHeading />
                  <MoodDealershipCta />
                  {moodCategoryVariants.map((variant) => (
                    <MoodCategoryCard key={variant} variant={variant} />
                  ))}
                </div>

                <div ref={moodScrollRef} className="mood-section__scroll-driver">
                  <div ref={moodStickyRef} className="mood-section__scroll-sticky">
                    <MoodSectionHeading />
                    <MoodDealershipCta />
                    <div className="mood-section__scroll-progress" aria-hidden="true">
                      <span className="mood-section__scroll-progress-bar" />
                    </div>
                    <div ref={moodViewportRef} className="mood-section__scroll-viewport">
                      <div ref={moodTrackRef} className="mood-section__scroll-track">
                        {moodCategoryVariants.map((variant, index) => (
                          <article
                            className="mood-section__scroll-tile"
                            key={variant}
                            aria-label={variant}
                            data-mood-index={index}
                          >
                            <MoodCategoryCard variant={variant} />
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mood-section__mobile-fallback" aria-label="Pick Your Mood categories">
                  <MoodSectionHeading />
                  <MoodDealershipCta />
                  {moodCategoryVariants.map((variant) => (
                    <MoodCategoryCard key={`fallback-${variant}`} variant={variant} />
                  ))}
                </div>
              </section>

              <div className="patch patch-lavender"></div>

              <section className="favorites-section">
                <div className="favorites-section__desktop">
                  <FavoritesSectionHeading />
                  <div data-carousel-root>
                    <FavoritesCarouselControls />
                    <div className="product-viewport" data-carousel-viewport>
                      <div className="product-track">
                        {favoriteProducts.map((product) => (
                          <FavoriteProductCard key={product.id} product={product} />
                        ))}
                        <FavoriteProductCard key="masala-carousel-tail" product={favoriteProducts[0]} />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  ref={favoritesScrollRef}
                  className="favorites-section__scroll-driver favorites-section__scroll-driver--mirror"
                >
                  <div ref={favoritesStickyRef} className="favorites-section__scroll-sticky">
                    <FavoritesSectionHeading />
                    <div className="favorites-section__scroll-progress" aria-hidden="true">
                      <span className="favorites-section__scroll-progress-bar" />
                    </div>
                    <div ref={favoritesViewportRef} className="favorites-section__scroll-viewport">
                      <div ref={favoritesTrackRef} className="favorites-section__scroll-track">
                        {favoriteProducts.map((product, index) => (
                          <article
                            className="favorites-section__scroll-tile"
                            key={product.id}
                            aria-label={product.title}
                            data-favorite-index={index}
                          >
                            <FavoriteProductCard product={product} />
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="favorites-section__mobile-fallback" aria-label="Crowd Favourites products">
                  <FavoritesSectionHeading />
                  <div data-carousel-root>
                    <FavoritesCarouselControls />
                    <div className="product-viewport" data-carousel-viewport>
                      <div className="product-track">
                        {favoriteProducts.map((product) => (
                          <FavoriteProductCard key={`fallback-${product.id}`} product={product} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="patch patch-rose"></div>

              <section className="story-section">
                <div className="story-photo-wrap">
                  <div className="story-photo-bg"></div>
                  <img src={asset('story-photo.png')} alt="One bite, pausing the chaos" />
                </div>
                <div className="story-copy">
                  <h2>
                    <span>Not just</span>
                    <span>snacks.</span>
                    <em>Moments.</em>
                  </h2>
                  <p>At Euro India Foods, every recipe is a legacy. We source the finest potatoes from local farmers and authentic spices that carry the soul of India.</p>
                  <p>Our commitment to quality ensures that every crunch is consistent, every flavor is balanced, and every moment shared is a memory.</p>
                  <a className="story-link" href="/about">Read Our Story <span className="story-link-icon" aria-hidden="true"><img src={asset('story-arrow.svg')} alt="" /></span></a>
                </div>
              </section>

              <section className="quality-section">
                <div className="quality-grid">
                  <article className="quality-card tilt-left">
                    <div className="quality-icon">
                      <img src={asset('icon-veg.svg')} alt="" />
                    </div>
                    <h3>100% Vegetarian</h3>
                    <p>No animal-derived ingredients or processing aids</p>
                  </article>
                  <article className="quality-card tilt-right">
                    <div className="quality-icon icon-pink">
                      <img src={asset('icon-test.svg')} alt="" />
                    </div>
                    <h3>Strict Tests</h3>
                    <p>Batch-wise quality control at every stage</p>
                  </article>
                  <article className="quality-card tilt-left">
                    <div className="quality-icon icon-gold">
                      <img src={asset('icon-hygiene.svg')} alt="" />
                    </div>
                    <h3>Hygiene</h3>
                    <p>Strict hygiene audits &amp; pest control</p>
                  </article>
                  <article className="quality-card tilt-right">
                    <div className="quality-icon icon-pink">
                      <img src={asset('icon-quality.svg')} alt="" />
                    </div>
                    <h3>Quality</h3>
                    <p>Standardized recipes for uniform taste &amp; texture</p>
                  </article>
                </div>
              </section>

              <section className="dealership-section" id="franchise">
                <aside className="partner-panel">
                  <span className="kicker">Partner with Us</span>
                  <h2>Let's grow<br />together.</h2>
                  <p>Join the Euro family and bring the crunch to your city.</p>
                  <ul>
                    <li>Fat margins for you</li>
                    <li>Marketing and ads support</li>
                    <li>Super fast logistics</li>
                  </ul>
                </aside>

                <form className="inquiry-form">
                  <h2>Get in touch!</h2>
                  <div className="form-grid">
                    <label>
                      <span>Full Name</span>
                      <input type="text" placeholder="Your Name" />
                    </label>
                    <label>
                      <span>City</span>
                      <input type="text" placeholder="Where you at?" />
                    </label>
                    <label className="form-field-full">
                      <span>Phone Number</span>
                      <input type="tel" placeholder="+91 00000 00000" />
                    </label>
                  </div>
                  <button className="button button-primary" type="submit">Send Enquiry</button>
                </form>
              </section>

              <div className="patch patch-yellow-slant" aria-hidden="true"></div>

              <EuroMoments className="euro-moments--home" />
            </main>
    </>
  );
}
