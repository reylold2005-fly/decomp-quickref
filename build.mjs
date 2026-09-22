// 构建离线单文件 + PWA 站点:src/index.html + gzip 内嵌 archify 决策图
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
let html = readFileSync(join(root, "src/index.html"), "utf8");

const CHARTS = { c1: 6, c2: 6, c3: 10, c4: 4 };

for (const [key, n] of Object.entries(CHARTS)) {
  for (let i = 1; i <= n; i++) {
    const ph = `<template id="dg-${key}-s${i}"></template>`;
    if (!html.includes(ph)) throw new Error(`placeholder missing: ${key}-s${i}`);
    let block = ph;
    try {
      const dg = readFileSync(join(root, `archify/dg-${key}-s${i}.html`));
      const b64 = gzipSync(dg, { level: 9 }).toString("base64");
      block = `<script type="text/plain" id="dgz-${key}-s${i}">${b64}</script>`;
    } catch {
      console.warn(`! dg-${key}-s${i}.html 缺失,跳过`);
    }
    html = html.replace(ph, block);
  }
}

mkdirSync(join(root, "dist"), { recursive: true });
const out = join(root, "dist/释压程序速查_v0.6.html");
writeFileSync(out, html);
console.log("built:", out, (html.length / 1024 / 1024).toFixed(2), "MB");

// ── PWA 站点(GitHub Pages / 任意静态托管)──
const site = join(root, "dist/site");
mkdirSync(site, { recursive: true });
writeFileSync(join(site, "index.html"), html);
for (const ic of ["icon-512.png", "icon-192.png", "icon-180.png"]) {
  copyFileSync(join(root, "assets", ic), join(site, ic));
}
writeFileSync(join(site, "manifest.webmanifest"), JSON.stringify({
  name: "释压应急程序速查",
  short_name: "释压速查",
  start_url: "./",
  scope: "./",
  display: "standalone",
  background_color: "#0e141d",
  theme_color: "#0b62d6",
  icons: [
    { src: "icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "icon-512.png", sizes: "512x512", type: "image/png" },
  ],
}, null, 2));
const hash = createHash("sha256").update(html).digest("hex").slice(0, 12);
writeFileSync(join(site, "sw.js"), `// 释压速查 离线缓存 · 构建指纹 ${hash}
const CACHE = "decomp-${hash}";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-180.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(res => {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const cp = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, cp));
      }
      return res;
    }))
  );
});
`);
console.log("site :", site, "(cache", hash + ")");
