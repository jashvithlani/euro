export const PAGE_LOADER_MAX_WAIT_MS = 2400;

export function delay(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export function waitForImageElement(image) {
  if (!image) return Promise.resolve();

  const decode = () => {
    if (typeof image.decode !== "function") return Promise.resolve();
    return image.decode().catch(() => undefined);
  };

  if (image.complete) return decode();

  return new Promise((resolve) => {
    const finish = () => {
      image.removeEventListener("load", finish);
      image.removeEventListener("error", finish);
      decode().finally(resolve);
    };
    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", finish, { once: true });
  });
}

function waitForPaint() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
  });
}

export function waitForCurrentPageReady(timeoutMs = PAGE_LOADER_MAX_WAIT_MS) {
  return new Promise((resolve) => {
    let finished = false;
    let readinessStarted = false;
    let observer;
    let timeoutId;

    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timeoutId);
      observer?.disconnect();
      resolve();
    };

    const check = () => {
      if (finished || readinessStarted) return;

      const page = document.querySelector(".page-shell main:not(.route-loading)");
      if (!page) return;

      readinessStarted = true;
      observer?.disconnect();
      const criticalImages = Array.from(
        page.querySelectorAll('img[data-loader-critical="true"]'),
      );
      const ready = criticalImages.length
        ? Promise.all(criticalImages.map(waitForImageElement))
        : waitForPaint();

      ready.finally(finish);
    };

    observer = new MutationObserver(check);
    observer.observe(document.getElementById("root") || document.body, {
      childList: true,
      subtree: true,
    });
    timeoutId = window.setTimeout(finish, timeoutMs);
    check();
  });
}
