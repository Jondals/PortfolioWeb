// Single end-to-end test for the portfolio:
//  1. Builds the project with Astro.
//  2. Serves /dist with compression (like Vercel does in production).
//  3. Uses Puppeteer to check the page does not explode (console errors, language, mobile menu, carousel).
//  4. Runs Google Lighthouse on mobile and desktop, requiring 100 in every category.
//
// Run with: pnpm test  (or double-click test.bat)

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync } from "node:zlib";
import puppeteer from "puppeteer";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");
const categories = ["performance", "accessibility", "best-practices", "seo"];

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
};

let server;
let browser;
let url;

/** A tiny static file server for `dist/`, with brotli compression and far-future caching for hashed assets. */
function serveDist() {
  return createServer(async (req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    let file = normalize(join(dist, pathname));

    if (!file.startsWith(dist)) {
      res.writeHead(403).end();
      return;
    }

    try {
      if ((await stat(file)).isDirectory()) file = join(file, "index.html");
      let body = await readFile(file);
      const type = mimeTypes[extname(file)] ?? "application/octet-stream";
      const headers = {
        "Content-Type": type,
        "Cache-Control": file.includes("_astro") || file.includes("fonts")
          ? "public, max-age=31536000, immutable"
          : "public, max-age=0, must-revalidate",
      };

      if (/text|javascript|svg/.test(type) && /\bbr\b/.test(req.headers["accept-encoding"] ?? "")) {
        body = brotliCompressSync(body);
        headers["Content-Encoding"] = "br";
      }

      res.writeHead(200, headers).end(body);
    } catch {
      res.writeHead(404).end("Not found");
    }
  });
}

/** Runs Lighthouse against the served page, logs a diagnosis when something fails, and asserts every category is 100. */
async function runLighthouse(name, config) {
  const port = new URL(browser.wsEndpoint()).port;
  const result = await lighthouse(url, { port, output: "json", logLevel: "error" }, config);
  const { lhr } = result;

  const scores = Object.fromEntries(
    categories.map((id) => [id, Math.round((lhr.categories[id].score ?? 0) * 100)])
  );
  console.log(`\nLighthouse ${name}:`, scores);

  const failing = [];
  for (const id of categories) {
    for (const ref of lhr.categories[id].auditRefs) {
      const audit = lhr.audits[ref.id];
      if (ref.weight > 0 && audit.score !== null && audit.score < 1) {
        failing.push(`  [${id}] ${audit.id}: ${audit.title} (${audit.displayValue ?? audit.score})`);
        for (const item of (audit.details?.items ?? []).slice(0, 4)) {
          if (item.node) failing.push(`      → ${item.node.selector} ${item.node.explanation?.split("\n")[1] ?? ""}`);
        }
      }
    }
  }
  if (failing.length) console.log("Failing audits:\n" + failing.join("\n"));

  if (lhr.audits["largest-contentful-paint"].score < 1) {
    const lcp = lhr.audits["lcp-breakdown-insight"]?.details?.items ?? [];
    const node = lcp.find((item) => item.type === "node");
    const table = lcp.find((item) => item.type === "table");
    const phases = table?.items?.map((p) => `${p.label ?? p.subpart} ${Math.round(p.duration)}ms`).join(", ");
    console.log(`  LCP: ${node?.selector ?? "?"} → ${node?.snippet?.slice(0, 80) ?? ""}\n  Phases: ${phases ?? "?"}`);
  }

  if (lhr.audits["total-blocking-time"].score < 1) {
    const work = lhr.audits["mainthread-work-breakdown"]?.details?.items ?? [];
    console.log("  Main thread: " + work.map((w) => `${w.groupLabel} ${Math.round(w.duration)}ms`).join(", "));
    const bootup = lhr.audits["bootup-time"]?.details?.items ?? [];
    console.log("  Scripts: " + bootup.map((b) => `${b.url.split("/").pop() || "(html)"} ${Math.round(b.scripting)}ms`).join(", "));
  }

  const shifts = lhr.audits["layout-shifts"]?.details?.items ?? [];
  for (const shift of shifts) console.log(`  CLS ${shift.score?.toFixed(3)} → ${shift.node?.selector ?? "?"}`);

  for (const id of categories) {
    assert.equal(scores[id], 100, `${name} · ${id} = ${scores[id]} (expected 100)`);
  }
}

before(async () => {
  const build = spawnSync(process.execPath, [join(root, "node_modules/astro/bin/astro.mjs"), "build"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(build.status, 0, `astro build failed:\n${build.stdout}\n${build.stderr}`);

  server = serveDist();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  url = `http://localhost:${server.address().port}/`;

  browser = await puppeteer.launch({ headless: true });
});

after(async () => {
  await browser?.close();
  await new Promise((resolve) => (server ? server.close(resolve) : resolve()));
});

test("the page loads with no errors and everything works", async () => {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
  page.on("requestfailed", (req) => {
    // Lazy images cancelled by a viewport change are not errors
    if (req.failure()?.errorText !== "net::ERR_ABORTED") errors.push(`${req.url()} ${req.failure()?.errorText}`);
  });
  page.on("response", (res) => res.status() >= 400 && errors.push(`${res.status()} ${res.url()}`));

  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "dark" }]);
  await page.evaluateOnNewDocument(() => localStorage.setItem("language", "en"));
  await page.setViewport({ width: 1280, height: 800 });
  const response = await page.goto(url, { waitUntil: "networkidle0" });
  assert.equal(response.status(), 200);
  // Secondary scripts load once the browser is idle: wait for them to finish
  await page.waitForFunction(() => document.documentElement.dataset.ready === "true");

  for (const selector of ["header", "#about", "#projects", "#game-development", "#experience", "#skills", "#contact"]) {
    assert.ok(await page.$(selector), `missing section ${selector}`);
  }

  // Every icon used on the page is defined in the sprite
  const missingIcons = await page.$$eval("svg use", (uses) =>
    uses.map((u) => u.getAttribute("href")).filter((href) => !document.querySelector(href))
  );
  assert.deepEqual(missingIcons, [], "icons missing from the sprite");

  // The header is transparent at the top of the page and gets a background once scrolled
  const headerBackground = () => page.$eval(".site-header", (el) => getComputedStyle(el).backgroundColor);
  assert.match(await headerBackground(), /(rgba\(.*, 0\)|transparent|srgb .* \/ 0\))/, "the header should be transparent at the top of the page");
  await page.evaluate(() => window.scrollTo({ top: 400, behavior: "instant" }));
  await page.waitForFunction(() => document.querySelector(".site-header").classList.contains("is-scrolled"));

  // Language toggle (desktop)
  const title = () => page.$eval("#projects h2 [data-en]", (el) => el.textContent.trim());
  assert.equal(await title(), "Projects");
  await page.click("header .lang-toggle");
  assert.equal(await title(), "Proyectos");
  assert.equal(await page.$eval("html", (el) => el.lang), "es");
  await page.click("header .lang-toggle");
  assert.equal(await title(), "Projects");

  // Carousel
  const currentDot = () => page.$eval(".carousel-dot[aria-current='true']", (el) => el.dataset.index);
  assert.equal(await currentDot(), "0");
  await page.click(".carousel-next");
  await page.waitForFunction(() => document.querySelector(".carousel-dot[aria-current='true']")?.dataset.index === "1");
  await page.click(".carousel-prev");
  await page.waitForFunction(() => document.querySelector(".carousel-dot[aria-current='true']")?.dataset.index === "0");

  // "More projects" expands and collapses
  const panelOpen = () => page.$eval("#more-projects-list", (el) => !el.inert);
  assert.equal(await panelOpen(), false);
  await page.click(".collapse-toggle");
  assert.equal(await panelOpen(), true);
  await page.waitForFunction(() => document.querySelector("#more-projects-list").getBoundingClientRect().height > 300);
  await page.click(".collapse-toggle");
  assert.equal(await panelOpen(), false);

  // Every technology tag has an icon and a link
  const tagsWithoutIcon = await page.$$eval("#projects li a, #skills li a", (links) =>
    links.filter((a) => a.getAttribute("href")?.startsWith("http") && !a.querySelector("svg use")).map((a) => a.textContent.trim())
  );
  assert.deepEqual(tagsWithoutIcon, [], "tags with no icon");

  // Right-click is disabled
  const contextMenuBlocked = await page.evaluate(() => {
    const event = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });
    return !document.body.dispatchEvent(event);
  });
  assert.ok(contextMenuBlocked, "the right-click menu is not blocked");

  // Mobile menu: opens, the overlay covers the whole screen and the language toggle works
  await page.setViewport({ width: 375, height: 740, isMobile: true, hasTouch: true });
  await page.waitForSelector("#menu-btn", { visible: true });
  // After the viewport change the page reflows: if the first tap is missed, retry
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.click("#menu-btn");
    const opened = await page
      .waitForFunction(() => !document.getElementById("mobile-menu").inert, { timeout: 2000 })
      .then(() => true, () => false);
    if (opened) break;
  }
  await page.waitForFunction(() => !document.getElementById("mobile-menu").inert, { timeout: 2000 });
  // Wait for the panel to finish sliding in
  await page.waitForFunction(() => {
    const rect = document.getElementById("mobile-menu").getBoundingClientRect();
    return Math.round(rect.right) <= window.innerWidth;
  });
  const overlay = await page.$eval("#overlay", (el) => el.getBoundingClientRect().height);
  assert.ok(overlay >= 740, `the overlay only covers ${overlay}px`);

  await page.click("#mobile-menu .lang-toggle");
  const mobileLinks = await page.$$eval("#mobile-menu nav a", (links) => links.map((a) => a.textContent.trim()));
  assert.deepEqual(mobileLinks, ["Sobre mí", "Proyectos", "Juegos", "Experiencia", "Habilidades", "Contacto"]);

  await page.keyboard.press("Escape");
  await page.waitForFunction(() => document.getElementById("mobile-menu").inert);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert.ok(overflow <= 0, `there is horizontal scroll on mobile (${overflow}px)`);

  assert.deepEqual(errors, [], "errors on the page");
  await page.close();
});

test("Lighthouse mobile: 100 across the board", async () => {
  await runLighthouse("mobile", undefined);
});

test("Lighthouse desktop: 100 across the board", async () => {
  await runLighthouse("desktop", desktopConfig);
});
