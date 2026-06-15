import { useLayoutEffect } from "react";

const DESKTOP_QUERY = "(min-width: 1000px)";

function getRefNode(ref) {
  return ref?.current ?? null;
}

function collectMeasuredNodes(root) {
  if (!root) {
    return [];
  }

  return [root, ...root.querySelectorAll("*")].filter((node) => node instanceof HTMLElement);
}

function getContentBottom(nodes, mainRect) {
  return nodes.reduce((bottom, node) => {
    const rect = node.getBoundingClientRect();

    if (rect.width === 0 && rect.height === 0) {
      return bottom;
    }

    return Math.max(bottom, rect.bottom - mainRect.top);
  }, 0);
}

function getLayoutScale(element, rect) {
  const appScale = Number.parseFloat(getComputedStyle(element).getPropertyValue("--app-scale"));

  if (Number.isFinite(appScale) && appScale > 0) {
    return appScale;
  }

  return element?.offsetWidth ? rect.width / element.offsetWidth || 1 : 1;
}

export function useInvestorDynamicHeight(refs, deps = [], { bottomGap = 40 } = {}) {
  useLayoutEffect(() => {
    const refList = Array.isArray(refs) ? refs : [refs];
    const roots = refList.map(getRefNode).filter(Boolean);
    const main = roots[0]?.closest(".investor-main");

    if (!main) {
      return undefined;
    }

    const originalHeight = main.style.height;
    let animationFrame = 0;

    const updateHeight = () => {
      if (!window.matchMedia(DESKTOP_QUERY).matches) {
        main.style.height = originalHeight;
        return;
      }

      const mainRect = main.getBoundingClientRect();
      const layoutScale = getLayoutScale(main, mainRect);
      const measuredNodes = roots.flatMap(collectMeasuredNodes);
      const contentBottom = getContentBottom(measuredNodes, mainRect) / layoutScale;

      main.style.height = `${Math.ceil(contentBottom + bottomGap)}px`;
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateHeight);
    };

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    roots.flatMap(collectMeasuredNodes).forEach((node) => resizeObserver.observe(node));

    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    mediaQuery.addEventListener("change", scheduleUpdate);
    scheduleUpdate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      mediaQuery.removeEventListener("change", scheduleUpdate);
      main.style.height = originalHeight;
    };
  }, deps);
}
