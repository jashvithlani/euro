import { useHorizontalScrollPin } from "./useHorizontalScrollPin.js";

export function useTimelineMobileScroll(refs) {
  useHorizontalScrollPin({
    ...refs,
    tileWidthCssVar: "--timeline-tile-width",
    progressCssVar: "--timeline-progress",
  });
}
