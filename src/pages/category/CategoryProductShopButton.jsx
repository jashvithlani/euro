export const CATEGORY_PRODUCT_SHOP_URL =
  "https://www.amazon.in/stores/EuroIndiaFreshFoodsPvtLtd/page/B6C6B387-3B3E-495A-957A-EDE91567671E?lp_asin=B0CWLDDWJ9&ref_=ast_bln&store_ref=bl_ast_dp_brandlogo_sto";

export default function CategoryProductShopButton({ className = "" }) {
  return (
    <a
      className={className ? `category-product-shop ${className}` : "category-product-shop"}
      href={CATEGORY_PRODUCT_SHOP_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      Shop Now
    </a>
  );
}
