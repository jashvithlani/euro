import { useLayoutEffect } from "react";

function setTileHeight(element) {
  element.style.setProperty("--tile-height", `${element.offsetHeight}px`);
}

export function useCategoryTileHeight(tileRef) {
  useLayoutEffect(() => {
    const tile = tileRef.current;
    if (!tile || typeof window === "undefined") return undefined;

    setTileHeight(tile);

    if (typeof ResizeObserver === "undefined") {
      const handleResize = () => setTileHeight(tile);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }

    const observer = new ResizeObserver(() => setTileHeight(tile));
    observer.observe(tile);

    return () => observer.disconnect();
  }, [tileRef]);
}
