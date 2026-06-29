import { useEffect } from "react";

const REVEALED_CLASS = "category-product-card--shop-revealed";

export function useCategoryProductShopReveal(tileRef) {
  useEffect(() => {
    const card = tileRef.current;
    if (!card || !card.querySelector(".category-product-shop")) return undefined;

    const touchMedia = window.matchMedia("(hover: none)");

    const dismiss = () => {
      card.classList.remove(REVEALED_CLASS);
    };

    const onCardClick = (event) => {
      if (!touchMedia.matches) return;

      const shopLink = event.target.closest(".category-product-shop");
      if (shopLink && !card.classList.contains(REVEALED_CLASS)) {
        event.preventDefault();
        card.classList.add(REVEALED_CLASS);
        return;
      }

      if (!shopLink && !card.classList.contains(REVEALED_CLASS)) {
        card.classList.add(REVEALED_CLASS);
      }
    };

    const onDocumentClick = (event) => {
      if (!touchMedia.matches) return;
      if (!card.contains(event.target)) dismiss();
    };

    card.addEventListener("click", onCardClick);
    document.addEventListener("click", onDocumentClick);

    return () => {
      card.removeEventListener("click", onCardClick);
      document.removeEventListener("click", onDocumentClick);
      dismiss();
    };
  }, [tileRef]);
}
