import { asset } from "./asset.js";
import OptimizedImage from "../../components/OptimizedImage.jsx";

export const favoriteProducts = [
  {
    id: "masala",
    tone: "lavender",
    badge: "Best Seller",
    badgeTone: "gold",
    image: "bestseller-masala.png",
    title: "Masti Masala chips",
    copy: "Light, crispy, and perfectly salted.",
  },
  {
    id: "tomato",
    tone: "cyan",
    badge: "TANGY",
    badgeTone: "",
    image: "bestseller-tomato.png",
    title: "Tingling Tomato",
    copy: "For those who like it bold.",
  },
  {
    id: "guava",
    tone: "rose",
    badge: "Tropical",
    badgeTone: "purple",
    image: "bestseller-guava.png",
    title: "Guava Juice",
    copy: "A delicious burst of guava flavour.",
  },
  {
    id: "mango",
    tone: "yellow",
    badge: "ZESTY",
    badgeTone: "green",
    image: "bestseller-mango.png",
    title: "Mango Punch",
    copy: "A delicious mango kick in every sip",
  },
  {
    id: "masala",
    tone: "lavender",
    badge: "Best Seller",
    badgeTone: "gold",
    image: "bestseller-sevmumra.png",
    title: "Masala Sev Mumra",
    copy: "Crunchy. Spicy. Irresistible.",
  },
];

export function FavoritesSectionHeading() {
  return (
    <div className="section-heading favorites-heading">
      <span className="kicker">Trending Now</span>
      <h2>
        The Crowd
        <br />
        Favourites
      </h2>
    </div>
  );
}

export function FavoritesCarouselControls() {
  return (
    <div className="slider-buttons" aria-label="Product carousel controls">
      <button className="slider-btn" type="button" data-carousel-prev aria-label="Previous products">
        <img src={asset("arrow-prev.svg")} alt="" aria-hidden="true" />
      </button>
      <button className="slider-btn" type="button" data-carousel-next aria-label="Next products">
        <img src={asset("arrow-next.svg")} alt="" aria-hidden="true" />
      </button>
    </div>
  );
}

export function FavoriteProductCard({ product }) {
  const badgeClassName = ["product-badge", product.badgeTone ? `product-badge--${product.badgeTone}` : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={`product-card product-card--${product.tone}`}>
      <div className="product-art">
        <span className={badgeClassName}>{product.badge}</span>
        <OptimizedImage src={asset(product.image)} alt={product.title} sizes="(max-width: 480px) 70vw, 240px" />
      </div>
      <h3>{product.title}</h3>
      <p>{product.copy}</p>
    </article>
  );
}
