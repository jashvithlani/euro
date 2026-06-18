import { useEffect } from "react";
import { asset } from "./asset.js";
import "./HomePage.css";

export default function HomePage() {
  useEffect(() => {
    const carouselViewport = document.querySelector("[data-carousel-viewport]");
    const carouselPrev = document.querySelector("[data-carousel-prev]");
    const carouselNext = document.querySelector("[data-carousel-next]");

    if (!carouselViewport || !carouselPrev || !carouselNext) {
      return undefined;
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
    window.addEventListener("load", updateCarouselControls);
    updateCarouselControls();

    return () => {
      carouselPrev.removeEventListener("click", handlePrevClick);
      carouselNext.removeEventListener("click", handleNextClick);
      carouselViewport.removeEventListener("scroll", updateCarouselControls);
      window.removeEventListener("load", updateCarouselControls);
    };
  }, []);

  useEffect(() => {
    const socialSection = document.querySelector(".social-section");
    const socialGrid = document.querySelector(".social-feed-grid");
    const socialCards = Array.from(document.querySelectorAll(".social-feed-card"));

    if (!socialSection || !socialGrid || socialCards.length === 0) {
      return undefined;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 999px)");
    const cardTravel = [96, 154, 74, 132, 88];
    let rafId = 0;

    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

    const resetSocialCards = () => {
      socialCards.forEach((card) => {
        card.style.setProperty("--social-card-y", "0px");
        card.style.setProperty("--social-card-opacity", "1");
      });
    };

    const updateSocialMotion = () => {
      rafId = 0;

      if (reducedMotionQuery.matches || mobileQuery.matches) {
        resetSocialCards();
        return;
      }

      const gridRect = socialGrid.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 720;
      const start = viewportHeight * 1.04;
      const end = viewportHeight * 0.3;
      const progress = clamp((start - gridRect.top) / Math.max(1, start - end));

      socialCards.forEach((card, index) => {
        const travel = cardTravel[index] || 88;
        const y = travel * (1 - progress);
        const opacity = 0.84 + progress * 0.16;
        card.style.setProperty("--social-card-y", `${y.toFixed(2)}px`);
        card.style.setProperty("--social-card-opacity", opacity.toFixed(4));
      });
    };

    const requestUpdate = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateSocialMotion);
      }
    };

    const handleMotionPreferenceChange = () => requestUpdate();

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener("change", handleMotionPreferenceChange);
    } else {
      reducedMotionQuery.addListener(handleMotionPreferenceChange);
    }

    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener("change", handleMotionPreferenceChange);
    } else {
      mobileQuery.addListener(handleMotionPreferenceChange);
    }

    requestUpdate();

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (reducedMotionQuery.removeEventListener) {
        reducedMotionQuery.removeEventListener("change", handleMotionPreferenceChange);
      } else {
        reducedMotionQuery.removeListener(handleMotionPreferenceChange);
      }

      if (mobileQuery.removeEventListener) {
        mobileQuery.removeEventListener("change", handleMotionPreferenceChange);
      } else {
        mobileQuery.removeListener(handleMotionPreferenceChange);
      }

      socialCards.forEach((card) => {
        card.style.removeProperty("--social-card-y");
        card.style.removeProperty("--social-card-opacity");
      });
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
                <a className="button button-primary hero-button" href="#products">Explore <img className="hero-button-icon" src={asset('hero-explore-icon.svg')} alt="" aria-hidden="true" /></a>
                <h2 className="hero-deserve">You deserve.</h2>
                <span className="hero-tag hero-tag-crunchy" aria-hidden="true">#Crunchy</span>
                <span className="hero-tag hero-tag-delicious" aria-hidden="true">#delicious</span>
              </section>

              <div className="patch patch-gold"></div>

              <section className="mood-section" id="products">
                <div className="pattern-layer" aria-hidden="true"></div>
                <div className="section-heading mood-heading">
                  <span className="kicker">Categories</span>
                  <h2>Pick Your Mood.</h2>
                </div>
                <a className="button button-blue mood-cta" href="#franchise">Make Dealership Inquiry</a>

                <article className="category-card card-chips">
                  <div>
                    <span>Classic Chips</span>
                    <small>The crunch that started it all.<br />Simple,<br />salty, iconic.</small>
                  </div>
                  <img src={asset('category-chips.png')} alt="Classic chips flavors" />
                </article>

                <article className="category-card card-juice">
                  <span>Juices</span>
                  <img src={asset('category-juices.png')} alt="Euro juices" />
                </article>

                <article className="category-card card-namkeen">
                  <span>Namkeen</span>
                  <img src={asset('category-namkeen.png')} alt="Euro namkeen pack" />
                </article>

                <article className="category-card card-basket">
                  <img src={asset('category-bundle.png')} alt="Euro sweet memories box" />
                  <div>
                    <h3>Can't decide?<br />Try our Mix-It-Up Boxes.</h3>
                  </div>
                </article>
              </section>

              <div className="patch patch-lavender"></div>

              <section className="favorites-section">
                <div className="section-heading favorites-heading">
                  <span className="kicker">Trending Now</span>
                  <h2>The Crowd<br />Favourites</h2>
                </div>
                <div className="slider-buttons" aria-label="Product carousel controls">
                  <button className="slider-btn" type="button" data-carousel-prev aria-label="Previous products">
                    <img src={asset('arrow-prev.svg')} alt="" aria-hidden="true" />
                  </button>
                  <button className="slider-btn" type="button" data-carousel-next aria-label="Next products">
                    <img src={asset('arrow-next.svg')} alt="" aria-hidden="true" />
                  </button>
                </div>
                <div className="product-viewport" data-carousel-viewport>
                  <div className="product-track">
                    <article className="product-card product-card--lavender">
                      <div className="product-art">
                        <span className="product-badge product-badge--gold">Best Seller</span>
                        <img src={asset('bestseller-masala.png')} alt="Masti Masala chips" />
                      </div>
                      <h3>Masti Masala chips</h3>
                      <p>Light, crispy, and perfectly salted.</p>
                    </article>
                    <article className="product-card product-card--cyan">
                      <div className="product-art">
                        <span className="product-badge">Hot</span>
                        <img src={asset('bestseller-tomato.png')} alt="Tingling Tomato chips" />
                      </div>
                      <h3>Tingling Tomato</h3>
                      <p>For those who like it bold.</p>
                    </article>
                    <article className="product-card product-card--rose">
                      <div className="product-art">
                        <span className="product-badge product-badge--purple">Sweet</span>
                        <img src={asset('bestseller-guava.png')} alt="Fresh Guava Juice" />
                      </div>
                      <h3>Fresh Guava Juice</h3>
                      <p>Guava with a fresh taste.</p>
                    </article>
                    <article className="product-card product-card--yellow">
                      <div className="product-art">
                        <span className="product-badge product-badge--green">Natural</span>
                        <img src={asset('bestseller-mango.png')} alt="Raw Mango Punch" />
                      </div>
                      <h3>Raw Mango Punch</h3>
                      <p>Tangy refreshment in every sip.</p>
                    </article>
                    <article className="product-card product-card--lavender">
                      <div className="product-art">
                        <span className="product-badge product-badge--gold">Best Seller</span>
                        <img src={asset('bestseller-masala.png')} alt="Masti Masala chips" />
                      </div>
                      <h3>Masti Masala chips</h3>
                      <p>Light, crispy, and perfectly salted.</p>
                    </article>
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
                  <p>Join the Euro India family and bring the crunch to your city.</p>
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

              <section className="social-section">
                <img className="social-feed-header" src={asset('social-feed-header-figma.png')} alt="Euro India social feed header" />
                <div className="social-feed-grid" aria-label="Euro India social moments">
                  <img className="social-feed-card" src={asset('social-card-1.png')} alt="Euro snack moment" loading="lazy" />
                  <img className="social-feed-card" src={asset('social-card-2.png')} alt="Euro chips pack moment" loading="lazy" />
                  <img className="social-feed-card" src={asset('social-card-3.png')} alt="Euro chips everywhere moment" loading="lazy" />
                  <img className="social-feed-card" src={asset('social-card-4.png')} alt="Euro table snack moment" loading="lazy" />
                  <img className="social-feed-card" src={asset('social-card-5.png')} alt="Fresh and tasty Euro beverages" loading="lazy" />
                </div>
              </section>
            </main>
    </>
  );
}
