/** Dominant colour per product image, sampled at build time.
  Used by CategoryPage.jsx to drive --product-color on each card so
  the flip-style hover reveals the product's own palette behind it. */
export const productColors = {
  "category-bakery-coconut-card.png": "#18a55c",
  "category-bakery-jeera-khari.png": "#a8624d",
  "category-bakery-methi-khari.png": "#aacd48",
  "category-bakery-plain-khari.png": "#f6ac58",
  "category-bakery-rusk.png": "#c98b45",
  "category-bakery-surati-nankhatai.png": "#c99958",
  "category-beverage-guava.png": "#f38896",
  "category-beverage-jeera.png": "#c65c1a",
  "category-beverage-lemoni.png": "#005c15",
  "category-beverage-litchi.png": "#e2d9cb",
  "category-beverage-mango.png": "#f18804",
  "category-beverage-onceup.png": "#d6d619",
  "category-beverage-orange.png": "#f78707",
  "category-beverage-sparker.png": "#ed1e2a",
  "category-beverage-water.png": "#221f26",
  "category-chikki-almond.png": "#b76a24",
  "category-chikki-cashew.png": "#e7dbb6",
  "category-chikki-crush-peanut.png": "#921622",
  "category-chikki-dryfruit-mix.png": "#f5ead6",
  "category-chikki-murmura.png": "#c5ab59",
  "category-chikki-peanut.png": "#23154c",
  "category-chikki-rajgira.png": "#f5e7d6",
  // Chips wide-card images composite each pack onto a peach splash, so
  // naive dominant-colour sampling returned peach for every variant.
  // Salted / tomato / chilli came out right under saturation weighting;
  // masti + onion are hand-picked to match the pack art (navy, green).
  //
  // ALIAS NOTE: the 5 category-chips-wide-card-*.png files are
  // byte-identical to the category-chips-*.png files used elsewhere
  // (home Mood section). Vite dedupes identical assets at build time,
  // so in production both filenames resolve to the same hashed URL —
  // which strips back to "category-chips-X.png" (the dedup winner),
  // not the "wide-card" name. We register the colour under BOTH keys
  // so the lookup hits either way.
  "category-chips-wide-card-chilli.png": "#d51a23", // chilli red
  "category-chips-wide-card-masti.png":  "#293582",
  "category-chips-wide-card-onion.png":  "#6ca538", // onion green
  "category-chips-wide-card-salted.png": "#ebca18", // bright yellow
  "category-chips-wide-card-tomato.png": "#c0392b", // tomato red
  "category-chips-chilli.png":           "#d51a23",
  "category-chips-masti.png":            "#293582",
  "category-chips-onion.png":            "#6ca538",
  "category-chips-salted.png":           "#ebca18",
  "category-chips-tomato.png":           "#c0392b",
  "category-farali-chiwda-mitha.png": "#36366a",
  "category-farali-chiwda-tikha.png": "#864748",
  "category-farali-kela-chiwda-card.png": "#a7869a",
  "category-farali-kela-chiwda-tikha.png": "#e4bbb5",
  "category-farali-potato-wafers-card.png": "#872a75",
  "category-farali-sabudana.png": "#363c64",
  "category-farali-wafers-green-card.png": "#b8866a",
  "category-farali-wafers-white-card.png": "#26462a",
  "category-fryums-cone-cap.png": "#0d77b4",
  "category-fryums-crunchy-cups.png": "#ca9c9a",
  "category-fryums-magic-abcde.png": "#d3a318",
  "category-fryums-noodles-sticks.png": "#3795ac",
  "category-fryums-ringoli-tomato-rings.png": "#791638",
  "category-fryums-salted-finger-pipe.png": "#e5d8b8",
  "category-fryums-tasty-pasta.png": "#d2bc13",
  "category-fryums-wheels-chaska.png": "#0c5b25",
  "category-getmore-chatpata.png": "#182664",
  "category-getmore-tomato.png": "#c62829",
  "category-khakhra-7grain.png": "#ab6b55",
  "category-khakhra-bajri.png": "#ebc515",
  "category-khakhra-chorafali.png": "#ebc514",
  "category-khakhra-fafda.png": "#ebc516",
  "category-khakhra-garlic.png": "#e9c8b9",
  "category-khakhra-jeera.png": "#cb8a56",
  "category-khakhra-masala.png": "#9acbe3",
  "category-khakhra-oats.png": "#d88a83",
  "category-khakhra-panipuri.png": "#95ba99",
  "category-namkeen-chana-jor-masala.png": "#89b7c9",
  "category-namkeen-dry-kachori.png": "#6c8738",
  "category-namkeen-jeera-puri.png": "#b6352b",
  "category-namkeen-kenyan-chiwda-hot.png": "#9cb674",
  "category-namkeen-lemon-mint-bhel.png": "#b89945",
  "category-namkeen-madras-mix.png": "#cac467",
  "category-namkeen-masala-soya-sticks.png": "#c6d8b7",
  "category-namkeen-methi-puri.png": "#548263",
  "category-namkeen-mini-samosa.png": "#b9354a",
  "category-namkeen-papad-chavana.png": "#174747",
  "category-namkeen-plain-nylon-papdi.png": "#6b2b2e",
  "category-namkeen-royal-moong.png": "#74976c",
  "category-namkeen-royal-peanuts.png": "#862649",
  "category-namkeen-shahi-mixture.png": "#98287a",
  "category-namkeen-shakkarpara.png": "#a56984",
  "category-namkeen-spicy-potato-sticks.png": "#9a5564",
  "category-namkeen-tikhi-sev.png": "#84391d",
  "category-namkeen-tomato-soya-sticks.png": "#b64b33",
};
