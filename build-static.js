const fs = require("fs");
const path = require("path");
const { buildConfig, renderPage, renderRobotsTxt, renderSitemapXml } = require("./server");

const projectRoot = __dirname;
const distDir = path.join(projectRoot, "dist");
const publicDir = path.join(projectRoot, "public");
const distPublicDir = path.join(distDir, "public");

function ensureCleanDist() {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });
}

function writeTextFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function copyPublicAssets() {
  fs.cpSync(publicDir, distPublicDir, { recursive: true, force: true });
}

function build() {
  ensureCleanDist();
  const config = buildConfig();

  writeTextFile(path.join(distDir, "index.html"), renderPage(config, config.defaultLanguage, "/"));
  writeTextFile(path.join(distDir, "en", "index.html"), renderPage(config, "en", "/en/"));
  writeTextFile(path.join(distDir, "de", "index.html"), renderPage(config, "de", "/de/"));
  writeTextFile(path.join(distDir, "robots.txt"), renderRobotsTxt());
  writeTextFile(path.join(distDir, "sitemap.xml"), renderSitemapXml());

  copyPublicAssets();

  // eslint-disable-next-line no-console
  console.log("Static site built in ./dist");
}

build();
