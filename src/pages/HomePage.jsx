import { useEffect } from "react";

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
        left: direction * 379,
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

  return (
    <>
            <main>
              <section className="hero">
                <div className="hero-bg"></div>
                <img className="hero-products" src="assets/hero-products.png" alt="Euro potato chips packs" />
                <div className="hero-copy">
                  <h1 className="hero-title">
                    <span>Every</span>
                    <span>Bite.</span>
                    <span className="accent">A Vibe.</span>
                  </h1>
                  <p>Redefining the snack game with premium ingredients and bold, authentic flavors that travel from our kitchen to your heart.</p>
                </div>
                <a className="button button-primary hero-button" href="#products">Explore <span aria-hidden="true">-&gt;</span></a>
                <h2 className="hero-deserve">You deserve.</h2>
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
                  <img src="assets/category-chips.png" alt="Classic chips flavors" />
                </article>

                <article className="category-card card-juice">
                  <span>Juices</span>
                  <img src="assets/category-juices.png" alt="Euro juices" />
                </article>

                <article className="category-card card-namkeen">
                  <span>Namkeen</span>
                  <img src="assets/category-namkeen.png" alt="Euro namkeen pack" />
                </article>

                <article className="category-card card-basket">
                  <img src="assets/category-bundle.png" alt="Euro sweet memories box" />
                  <div>
                    <h3>Can't decide?<br />Try our Mix-It-Up Boxes.</h3>
                    <a href="#">Explore Bundles <span aria-hidden="true">-&gt;</span></a>
                  </div>
                </article>
              </section>

              <div className="patch patch-lavender"></div>

              <section className="favorites-section">
                <div className="section-heading favorites-heading">
                  <span className="kicker">Trending Now</span>
                  <h2>The Crowd<br />Favorites</h2>
                </div>
                <div className="slider-buttons" aria-label="Product carousel controls">
                  <button className="slider-btn" type="button" data-carousel-prev aria-label="Previous products">&lsaquo;</button>
                  <button className="slider-btn" type="button" data-carousel-next aria-label="Next products">&rsaquo;</button>
                </div>
                <div className="product-viewport" data-carousel-viewport>
                  <div className="product-track">
                    <article className="product-card product-card--lavender">
                      <div className="product-art">
                        <span className="product-badge product-badge--gold">Best Seller</span>
                        <img src="assets/bestseller-masala.png" alt="Masti Masala chips" />
                      </div>
                      <h3>Masti Masala chips</h3>
                      <p>Light, crispy, and perfectly salted.</p>
                    </article>
                    <article className="product-card product-card--cyan">
                      <div className="product-art">
                        <span className="product-badge">Hot</span>
                        <img src="assets/bestseller-tomato.png" alt="Tingling Tomato chips" />
                      </div>
                      <h3>Tingling Tomato</h3>
                      <p>For those who like it bold.</p>
                    </article>
                    <article className="product-card product-card--rose">
                      <div className="product-art">
                        <span className="product-badge product-badge--purple">Sweet</span>
                        <img src="assets/bestseller-guava.png" alt="Fresh Guava Juice" />
                      </div>
                      <h3>Fresh Guava Juice</h3>
                      <p>Guava with a fresh taste.</p>
                    </article>
                    <article className="product-card product-card--yellow">
                      <div className="product-art">
                        <span className="product-badge product-badge--green">Natural</span>
                        <img src="assets/bestseller-raw-mango.png" alt="Raw Mango Punch" />
                      </div>
                      <h3>Raw Mango Punch</h3>
                      <p>Tangy refreshment in every sip.</p>
                    </article>
                  </div>
                </div>
              </section>

              <div className="patch patch-rose"></div>

              <section className="story-section">
                <div className="story-photo-wrap">
                  <div className="story-photo-bg"></div>
                  <img src="assets/story-photo.png" alt="One bite, pausing the chaos" />
                </div>
                <div className="story-copy">
                  <h2>
                    <span>Not just</span>
                    <span>snacks.</span>
                    <em>Moments.</em>
                  </h2>
                  <p>At Euro India Foods, every recipe is a legacy. We source the<br />finest potatoes from local farmers and authentic spices that<br />carry the soul of India.</p>
                  <p>Our commitment to quality ensures that every crunch is<br />consistent, every flavor is balanced, and every moment<br />shared is a memory.</p>
                  <a className="story-link" href="/about">Read Our Story <span aria-hidden="true">-&gt;</span></a>
                </div>
              </section>

              <section className="quality-section">
                <div className="quality-grid">
                  <article className="quality-card tilt-left">
                    <div className="quality-icon">
                      <img src="assets/icon-veg.svg" alt="" />
                    </div>
                    <h3>100% Vegetarian</h3>
                    <p>No animal ingredients, no compromise.</p>
                  </article>
                  <article className="quality-card tilt-right">
                    <div className="quality-icon icon-pink">
                      <img src="assets/icon-test.svg" alt="" />
                    </div>
                    <h3>Strict Tests</h3>
                    <p>Batch-wise quality control at every stage.</p>
                  </article>
                  <article className="quality-card tilt-left">
                    <div className="quality-icon icon-gold">
                      <img src="assets/icon-hygiene.svg" alt="" />
                    </div>
                    <h3>Hygiene</h3>
                    <p>Strict hygiene audits and pest control.</p>
                  </article>
                  <article className="quality-card tilt-right">
                    <div className="quality-icon icon-pink">
                      <img src="assets/icon-quality.svg" alt="" />
                    </div>
                    <h3>Quality</h3>
                    <p>Standardized recipes for uniform taste.</p>
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
                      <input type="text" />
                    </label>
                    <label>
                      <span>Phone Number</span>
                      <input type="tel" />
                    </label>
                    <label>
                      <span>Email</span>
                      <input type="email" />
                    </label>
                    <label>
                      <span>Preferred City</span>
                      <input type="text" />
                    </label>
                  </div>
                  <label>
                    <span>Message</span>
                    <textarea></textarea>
                  </label>
                  <button className="button button-primary" type="submit">Send Inquiry</button>
                </form>
              </section>

              <section className="social-section">
                <img src="assets/social-strip.png" alt="Euro India social feed" />
              </section>
            </main>
    </>
  );
}
