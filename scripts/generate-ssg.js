import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import express from 'express';
import { fileURLToPath } from 'url';
import Critters from 'critters';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;
const DIST_DIR = path.resolve(__dirname, '../dist');

const routes = [
  "/",
  "/proprietati",
  "/apartamente",
  "/case",
  "/terenuri",
  "/spatii-comerciale",
  "/garsoniere",
  "/hale",
  "/birouri",
  "/vile",
  "/apartamente-alba-micesti",
  "/apartamente-ampoi",
  "/apartamente-centru",
  "/apartamente-cetate",
  "/case-alba-micesti",
  "/case-barabant",
  "/case-centru",
  "/case-cetate",
  "/case-ciugud",
  "/case-cugir",
  "/case-micesti",
  "/case-oarda",
  "/garsoniere-centru",
  "/garsoniere-cetate",
  "/hale-centru",
  "/hale-cetate",
  "/spatii-comerciale-centru",
  "/spatii-comerciale-cetate",
  "/terenuri-alba-micesti",
  "/terenuri-centru",
  "/terenuri-cetate",
  "/terenuri-ciugud",
  "/terenuri-micesti",
  "/terenuri-oarda"
];

async function startServer() {
  const app = express();

  // Serve static files from dist
  app.use(express.static(DIST_DIR));

  // For any other route, serve index.html (SPA fallback)
  app.use((req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });

  return new Promise((resolve) => {
    const server = app.listen(PORT, () => {
      console.log(`[SSG] Internal server running on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function processBatch(batchRoutes, batchIndex) {
  console.log(`\n[SSG] --- Starting Batch ${batchIndex} (${batchRoutes.length} routes) ---`);

  let browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  try {
    for (let i = 0; i < batchRoutes.length; i++) {
      const route = batchRoutes[i];
      const url = `http://localhost:${PORT}${route}`;
      console.log(`[SSG] Prerendering: ${route}`);

      let page;
      let timedOut = false;
      try {
        page = await browser.newPage();

        // Pass browser console to Node terminal
        page.on('console', msg => console.log(`[Browser Console] ${msg.type().toUpperCase()} ${msg.text()}`));
        page.on('pageerror', err => console.error(`[Browser Error] ${err.toString()}`));
        page.on('requestfailed', request => console.error(`[Browser Request Failed] ${request.url()} - ${request.failure()?.errorText}`));

        // Aggressive Network Interception
        await page.setRequestInterception(true);
        page.on('request', request => {
          const reqUrl = request.url();
          if (reqUrl.startsWith(`http://localhost:${PORT}`) || reqUrl.startsWith('data:')) {
            request.continue();
          } else {
            // Block ALL external requests
            request.abort();
          }
        });

        // Strict 30s Global Timeout for the entire route
        await Promise.race([
          (async () => {
            // Step 1: navigate and wait for ALL network requests (incl. lazy chunks) to settle
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 25000 });

            // Step 2: wait until #root actually has content — polls every 200ms up to 10s.
            // This is the bulletproof guard against Suspense snapshots firing too early.
            await page.waitForFunction(
              () => {
                const root = document.getElementById('root');
                return root && root.children.length > 0 && root.innerText.trim().length > 50;
              },
              { timeout: 10000, polling: 200 }
            ).catch(() => {
              // Non-fatal: if root never fills we still grab whatever HTML is present
              console.warn('[SSG] #root did not populate fully — snapshotting anyway');
            });

            // Step 3: extra 500ms buffer for animations / React commit phase
            await new Promise(resolve => setTimeout(resolve, 500));
          })(),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Global Route Timeout (30s)")), 30000))
        ]);

      } catch (err) {
        timedOut = true;
        console.warn(`[SSG] Skipping route ${route} due to timeout. No HTML saved. Error: ${err.message}`);
      }

      if (!timedOut) {
        // Grab whatever HTML is there
        try {
          if (page && !page.isClosed()) {
            // Use Promise.race for evaluate as well to absolutely prevent 180s protocol deadlocks
            const html = await Promise.race([
              page.evaluate(() => document.documentElement.outerHTML),
              new Promise((_, reject) => setTimeout(() => reject(new Error("HTML Extraction Timeout (5s)")), 5000))
            ]);
            const fullHtml = `<!DOCTYPE html>\n${html}`;

            let routeDir = DIST_DIR;
            if (route !== '/') {
              routeDir = path.join(DIST_DIR, route);
              if (!fs.existsSync(routeDir)) {
                fs.mkdirSync(routeDir, { recursive: true });
              }
            }
            fs.writeFileSync(path.join(routeDir, 'index.html'), fullHtml, 'utf-8');
          }
        } catch (e) {
          console.error(`[SSG] Failed to save HTML for ${route}: ${e.message}`);
          timedOut = true; // Mark as poisoned so we restart the browser
        }
      }

      try {
        if (page && !page.isClosed()) {
          // Wrap page.close() in a timeout to detect a poisoned page
          await Promise.race([
            page.close(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Page close timeout (3s)")), 3000))
          ]);
        }
      } catch (e) {
        console.error(`[SSG] Failed to close page for ${route}: ${e.message}. Browser is POISONED. Restarting browser...`);
        try {
          if (browser.process()) {
            browser.process().kill('SIGKILL');
          }
        } catch (killErr) {
          // ignore
        }

        // Launch a fresh browser for the rest of the batch
        browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
          ]
        });
      }
    }
  } finally {
    console.log(`[SSG] Closing browser for Batch ${batchIndex}...`);
    try {
      // Bulletproof Browser Teardown
      await Promise.race([
        browser.close(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Browser close timeout (5s)")), 5000))
      ]);
      console.log(`[SSG] Browser closed cleanly.`);
    } catch (err) {
      console.warn(`[SSG] Browser refused to close: ${err.message}. Brutally murdering process...`);
      const proc = browser.process();
      if (proc) {
        proc.kill('SIGKILL');
      }
    }
  }
}

async function runSSG() {
  console.log('[SSG] Starting standalone SSG generation...');

  if (!fs.existsSync(DIST_DIR)) {
    console.error('[SSG] Error: dist directory not found. Run vite build first.');
    process.exit(1);
  }

  const server = await startServer();
  const BATCH_SIZE = 10;

  try {
    // Chunk routes array
    const chunks = [];
    for (let i = 0; i < routes.length; i += BATCH_SIZE) {
      chunks.push(routes.slice(i, i + BATCH_SIZE));
    }

    // Process chunks sequentially
    for (let j = 0; j < chunks.length; j++) {
      await processBatch(chunks[j], j + 1);
    }

    console.log('\n[SSG] Successfully prerendered all routes!');

    // --- WORDPRESS THEME GENERATION ---
    console.log('[SSG] Generating WordPress Theme files (index.php & style.css)...');

    const styleCss = `/*
Theme Name: Casa Pronto Imobiliare (React SPA)
Theme URI: https://casapronto.ro
Author: Safta Noel
Description: Tema custom ultra-rapida bazata pe React pentru agentia Casa Pronto Alba Iulia. Static Site Generated(SSG) cu Puppeteer & Vite.
Version: 7.0.0
License: Proprietary
Text Domain: casapronto
*/`;

    const indexPhp = `<?php
/**
 * Casa Pronto React SPA Theme Router
 */

$request_uri = $_SERVER['REQUEST_URI'];
$parsed_url = parse_url($request_uri);
$path = $parsed_url['path'];

$theme_dir = get_template_directory();
$theme_uri = get_template_directory_uri();

// 1. ASSET INTERCEPTION & REDIRECTION
if (
    strpos($path, '/assets/') === 0 || 
    strpos($path, '/prerender-') === 0 || 
    $path === '/vite.svg'
) {
    wp_redirect($theme_uri . $path, 301);
    exit;
}

// 2. SSG HTML ROUTING
$clean_path = rtrim($path, '/');
$ssg_file = $theme_dir . $clean_path . '/index.html';

if ($clean_path === '') {
    $ssg_file = $theme_dir . '/index.html';
}

// 3. SERVE PRERENDERED HTML
if (file_exists($ssg_file)) {
    echo file_get_contents($ssg_file);
    exit;
}

// 4. DYNAMIC ROUTE FALLBACK
$fallback_file = $theme_dir . '/index.html';
if (file_exists($fallback_file)) {
    echo file_get_contents($fallback_file);
    exit;
}

// 5. ULTIMATE FAILSAFE
echo "<h1>Casa Pronto SPA Theme Error: index.html not found.</h1>";
exit;
`;

    fs.writeFileSync(path.join(DIST_DIR, 'style.css'), styleCss, 'utf-8');
    fs.writeFileSync(path.join(DIST_DIR, 'index.php'), indexPhp, 'utf-8');

    console.log('[SSG] Theme generation complete.');

    // --- CRITICAL CSS INLINING (Critters) ---
    // Process every HTML file in dist/ and inline the above-the-fold CSS.
    console.log('[SSG] Inlining critical CSS into all HTML files...');
    const critters = new Critters({
      path: DIST_DIR,
      publicPath: '/',
      preload: 'swap',
      pruneSource: false,
      mergeStylesheets: true,
      inlineFonts: false,
    });

    // Collect all index.html files recursively
    function findHtmlFiles(dir) {
      const files = [];
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          files.push(...findHtmlFiles(fullPath));
        } else if (entry.name.endsWith('.html')) {
          files.push(fullPath);
        }
      }
      return files;
    }

    const htmlFiles = findHtmlFiles(DIST_DIR);
    for (const htmlFile of htmlFiles) {
      const html = fs.readFileSync(htmlFile, 'utf-8');
      try {
        const processed = await critters.process(html);
        fs.writeFileSync(htmlFile, processed, 'utf-8');
      } catch (e) {
        // Non-fatal — log and continue
        console.warn(`[SSG] Critters skipped ${htmlFile}: ${e.message}`);
      }
    }
    console.log(`[SSG] Critical CSS inlined into ${htmlFiles.length} HTML files.`);
    console.log('[SSG] The dist/ folder is ready to be zipped!');
    // -----------------------------------

  } catch (error) {
    console.error('[SSG] Fatal Error during prerendering:', error);
    process.exit(1);
  } finally {
    server.close();
    console.log('[SSG] Server shut down.');
  }
}

runSSG();
