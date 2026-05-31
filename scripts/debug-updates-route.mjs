import { chromium } from "playwright";

const page = await chromium.launch().then((b) => b.newPage());
await page.setViewportSize({ width: 1280, height: 1400 });
await page.goto("http://127.0.0.1:4191/investor/updates", { waitUntil: "networkidle" });
const info = await page.evaluate(() => ({
  url: location.href,
  title: document.title,
  mainClass: document.querySelector(".investor-main")?.className,
  html: document.querySelector("main")?.innerHTML?.slice(0, 500),
  text: document.body.innerText.slice(0, 400),
}));
console.log(JSON.stringify(info, null, 2));
await page.screenshot({ path: "qa-screenshots/debug-updates-route.png", fullPage: true });
await page.close();
