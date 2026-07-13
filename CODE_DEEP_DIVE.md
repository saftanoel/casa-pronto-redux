# 🏡 Casa Pronto Redux - Code Deep Dive

This document focuses exclusively on the code-level implementation details of the Casa Pronto Redux repository. It is designed to help you prepare for deeply technical interview questions.

---

## 1. The 5 Most Important Technical Flows

### Flow 1: Global Properties Fetching & Caching (The "Instant" UX)
*   **Trigger:** The application mounts (`<App />` loads).
*   **Frontend File:** `src/App.tsx` and `src/hooks/useProperties.ts`
*   **API/Helper:** `fetchInitialProperties` and `fetchAllProperties` in `src/lib/api/wordpress.ts`
*   **Backend Route:** `GET /wp-json/casapronto/v1/anunturi` (Custom WP REST API endpoint).
*   **Response/UI Update:** 
    1.  `useInitialProperties` quickly fetches ~60 items for an instant First Paint.
    2.  `useAllProperties` silently fetches the remaining 4700+ properties in paginated batches in the background.
    3.  The `SearchContext` is populated, replacing the initial properties with the full list once loading finishes.
*   **Review Exact Files:** `src/hooks/useProperties.ts`, `src/lib/api/wordpress.ts`

### Flow 2: Client-Side "God Mode" Search
*   **Trigger:** User types "apartament renovat cetate" in the search bar.
*   **Frontend File:** `src/context/SearchContext.tsx`
*   **API/Helper:** None. Runs entirely in-memory on the client.
*   **Response/UI Update:** 
    *   The input is debounced. 
    *   A `useMemo` block triggers, running `extractAllValues` recursively on all 4700+ property objects, converting everything to a normalized string.
    *   If all search terms exist in that string, the property is kept.
    *   `filteredProperties` updates instantly, re-rendering the `PropertiesPage.tsx`.
*   **Review Exact Files:** `src/context/SearchContext.tsx`

### Flow 3: Pre-rendering / Static Site Generation (SSG) Build
*   **Trigger:** Developer runs `npm run build:ssg`.
*   **Build File:** `scripts/generate-ssg.js`
*   **Backend:** A local Express server is spun up to serve the newly built Vite `/dist`.
*   **Response/UI Update:** 
    *   Puppeteer opens 34 predefined routes (e.g., `/case-centru`) one by one.
    *   It intercepts and blocks external requests (`request.abort()`).
    *   It waits for the React `#root` div to populate, then extracts `document.documentElement.outerHTML` and saves it to `dist/case-centru/index.html`.
*   **Review Exact Files:** `scripts/generate-ssg.js`

### Flow 4: Dynamic SEO Tag Injection (Fallback Router)
*   **Trigger:** A user (or Googlebot) navigates directly to a dynamic property URL: `/proprietate/123`.
*   **Backend/Server File:** `dist/index.php`
*   **API/Database:** Standard WordPress MySQL database (via WP native functions `get_post()` and `get_post_meta()`).
*   **Response/UI Update:** 
    *   Apache routes the request to `index.php`.
    *   The PHP script loads the raw `index.html` SPA shell.
    *   It fetches the property details from WP.
    *   It uses `preg_replace` to strip the default `<title>` and `<meta>` tags.
    *   It injects the specific property's OpenGraph and Canonical tags into the HTML string, then `echo`es it to the browser.
*   **Review Exact Files:** `dist/index.php`

### Flow 5: API Data Parsing & Normalization
*   **Trigger:** Any API fetch for properties.
*   **API/Helper:** `mapWPPostToProperty` in `src/lib/api/wordpress.ts`.
*   **Response/UI Update:** 
    *   The raw WordPress JSON is messy. This function normalizes it into a clean `Property` interface.
    *   It uses Regex to extract the zone from the title (`extractLocation`).
    *   It parses the raw price string into a numeric value (`parsePrice`).
    *   It maps image arrays to ensure `webp` fallbacks.
*   **Review Exact Files:** `src/lib/api/wordpress.ts` (specifically `mapWPPostToProperty`).

---

## 2. The Hardest Technical Implementation

**The hardest implementation in this project is managing Memory Limits (OOM) and Race Conditions during the Puppeteer SSG build.**

**The Problem:** 
Rendering 34 pages simultaneously with a React app that tries to load 4700+ complex property objects into memory (via `SearchContext`) caused the Headless Chromium browser instances to crash (Out of Memory) and hang indefinitely during the Vite build process.

**The Solution:**
1.  **Strict Timers (`Promise.race`):** In `scripts/generate-ssg.js`, the Puppeteer `page.goto` and HTML extraction are wrapped in `Promise.race` against a 15-20 second `setTimeout`. If React takes too long to render, the script forcefully aborts that route instead of hanging the entire build.
2.  **Network Interception:** Inside Puppeteer, `page.setRequestInterception(true)` is used to explicitly block all external requests (fonts, analytics, external images), saving massive amounts of memory and network overhead.
3.  **The `isPrerendering()` Data Hack:** In `src/lib/api/wordpress.ts`, `fetchAllProperties()` checks if the app is being run by Puppeteer. If so, it reads a local `.json` file instead of hitting the live API. **Crucially**, it parses the URL path (e.g., `/case-oarda`), filters the JSON to find matches for that specific category, and forcefully `slice(0, 100)` limits the array. This gives Puppeteer exactly enough DOM nodes to satisfy SEO without crashing the browser with 4700 DOM elements.

---

## 3. "Walk me through the code" (Interview Answers)

### The Most Important Frontend Flow (God Mode Search)
*"If you look at `SearchContext.tsx`, you'll see a `useMemo` block that calculates `filteredProperties`. Instead of writing 20 different `if` statements for every possible property field, I wrote a recursive function called `extractAllValues`. It takes the entire property object and squashes all strings and numbers into one giant, normalized string (no accents, lowercased). Then, it takes the user's debounced search query, splits it into words, removes connecting words (like 'si', 'de'), and checks if `every()` term exists in that giant string. Because `useAllProperties` loaded the entire catalog into memory via TanStack Query, this complex text-matching runs instantly on the client without any API latency."*

### The Most Important Backend Flow (PHP SEO Injection)
*"The most critical backend flow is in `dist/index.php`. Since this is a React SPA running on Apache, dynamic routes like `/proprietate/:id` don't physically exist as HTML files. When a request comes in, `index.php` acts as the router. It reads the base `index.html` file as a raw string. Then, it uses Regex to find the property ID from the URL, queries the WordPress database using `get_post_meta` to get the RankMath SEO descriptions, and uses `preg_replace` to safely strip the generic React `<title>` and `<meta>` tags. Finally, it concatenates the specific property's OpenGraph tags into the `<head>` and echoes the string. This guarantees Googlebot gets the exact property details on the initial request, preventing hydration mismatches."*

### The Most Important Data Flow (Mapping the WP API)
*"In `src/lib/api/wordpress.ts`, the WP REST API returns a lot of nested, messy data. The critical flow is the `mapWPPostToProperty` function. It acts as an anti-corruption layer. For example, the API might return a title like 'Apartament 2 camere, zona Cetate'. I wrote custom regex functions like `extractLocation` to parse 'Cetate' out of the title, and `parsePrice` to strip currency symbols and return a clean number for sorting. This ensures that the React components receive a strictly typed, clean `Property` interface, completely agnostic of how messy the WordPress database actually is."*

### One Bug or Edge Case (Prerendering Empty Categories)
*"During the SSG build, I restricted the property array to 100 items to prevent Chromium from crashing. The bug was that if I just did `.slice(0, 100)`, niche categories like `/terenuri-oarda` would render as empty pages because the 100 newest items didn't contain any land in Oarda. The fix is inside `fetchAllProperties`: during `isPrerendering()`, I grab the URL path, turn it into search terms, filter the massive JSON to find matching items first, put them at the top of the array using a `Set`, and *then* slice the top 100. This ensures every static category page gets relevant content for Googlebot."*

---

## 4. 15 Technical Questions Based on This Codebase

1.  **Q: How do you prevent memory leaks when debouncing the search input?**
    *A: By using a custom `useDebounce` hook that wraps the `setTimeout` inside a `useEffect`, ensuring the timeout is cleared (`clearTimeout`) in the cleanup function if the user types again before the delay finishes.*
2.  **Q: Why use `useMemo` in `SearchContext.tsx`?**
    *A: To memoize the heavily calculated `filteredProperties` array. It prevents the expensive recursive text-searching algorithm from running on every render, executing only when `filters` or the `properties` array actually changes.*
3.  **Q: How does `Promise.race` work in your `generate-ssg.js` script?**
    *A: It takes an array of promises (the Puppeteer page load and a `setTimeout`). Whichever resolves or rejects first "wins". It's used as a strict timeout mechanism to kill the page load if React hangs, preventing the whole build from freezing.*
4.  **Q: Why use Regex to parse the location (`extractLocation`) instead of a dedicated API field?**
    *A: The legacy WordPress database didn't have a strict taxonomy for micro-zones initially; agents typed "zona Cetate" directly into the title. The Regex was a pragmatic adapter pattern to extract structured data from unstructured legacy input.*
5.  **Q: Explain the `isPrerendering()` logic in the API helper.**
    *A: It checks if `window` is undefined or if the user agent contains `HeadlessChrome`. It tells the data fetcher to load from a local JSON file instead of making HTTP requests to the live WP API, preventing rate-limiting and timeouts during the SSG build.*
6.  **Q: How do you optimize image loading for FCP (First Contentful Paint)?**
    *A: In `mapWPPostToProperty`, the code explicitly looks for `webp` formats or appends `?w=800` to WordPress image URLs to force smaller thumbnails, preventing the client from downloading 3MB full-res images in the grid view.*
7.  **Q: Why intercept and abort network requests in Puppeteer?**
    *A: By aborting requests for external scripts (like Google Analytics) or fonts during the SSG build, we drastically reduce memory usage and speed up the generation of the static HTML.*
8.  **Q: What is `staleTime` vs `gcTime` in your `useProperties` hook?**
    *A: `staleTime` (30 mins) prevents TanStack Query from refetching data in the background if the user navigates back and forth. `gcTime` (60 mins) dictates how long the data stays in the cache memory before being garbage collected if unused.*
9.  **Q: How do you manage the React hydration mismatch with your PHP SEO tags?**
    *A: The PHP script only modifies the `<head>` of the document. React exclusively hydrates the `<div id="root">`. Because the root div is untouched, React doesn't throw a hydration error.*
10. **Q: Why did you build a custom crawler instead of using Vite's SSG plugins?**
    *A: Standard plugins often struggle with dynamic client-side fetching (TanStack Query). Puppeteer allowed me to physically wait for the exact `#root` DOM nodes to populate, giving me total control over the timeout and rendering lifecycle.*
11. **Q: How does the `Critters` plugin improve performance?**
    *A: During the Vite build, it analyzes the generated HTML and CSS, extracts only the CSS required for the initial viewport, inlines it in the `<head>`, and defers the rest. This eliminates render-blocking CSS.*
12. **Q: How do you handle pagination when fetching 4700 properties?**
    *A: `fetchAllProperties` fetches the first page to get `X-WP-TotalPages`. It then creates an array of Promises for all remaining pages and uses `Promise.all()` to fetch them concurrently in chunks, concatenating the results.*
13. **Q: How do you test the mobile responsive hamburger menu in Playwright?**
    *A: In `e2e.spec.ts`, we check the `isMobile` fixture provided by Playwright. If true, we simulate a click on the `<button>` with role 'banner', wait for the CSS transition, and then use `{ force: true }` to click the link.*
14. **Q: Why use `Array.from(new Set(...))` when combining prerender posts?**
    *A: To remove duplicates. When I push the category-specific matching posts to the front of the array, and then append the rest of the generic posts, the `Set` ensures no property ID appears twice before slicing.*
15. **Q: How are you managing URL state with the filters?**
    *A: React Router is used to map hardcoded paths (e.g., `/apartamente-cetate`) to specific prop values passed to `<PropertiesPage tip="apartamente" zone="cetate" />`. The UI initializes its state based on these props.*

---

## 5. Risky Claims & Interview "Traps" to Avoid

*   ⚠️ **Risky Claim:** *"Zero-PHP Overhead for category pages."*
    *   **Reality Check:** Unless you have explicit `.htaccess` rules that route `/case` directly to `/case/index.html` bypassing `index.php` entirely, Apache might still spin up PHP to serve it.
    *   **How to phrase it:** *"For static category routes, the HTML is pre-rendered. Depending on server configuration, it bypasses database queries entirely and serves the static file, massively reducing TTFB (Time to First Byte)."*
*   ⚠️ **Risky Claim:** *"Perfect 100/100 Lighthouse score."*
    *   **Reality Check:** Lighthouse scores fluctuate based on the server response time, images, and external scripts (like Google Analytics).
    *   **How to phrase it:** *"The architecture was heavily optimized with Critical CSS and static generation, allowing us to consistently hit 95-100 on Lighthouse performance metrics in controlled tests."*
*   ⚠️ **Honest Limitation to Admit:** *"Client-side filtering of 5000 items."*
    *   **Reality Check:** Downloading 5000 JSON objects to the browser is an anti-pattern for massive scale. It consumes a lot of mobile RAM and bandwidth.
    *   **How to address it proactively:** *"A known limitation in V1 is the memory footprint of loading all properties into the client `SearchContext`. It provides an incredibly fast UX once loaded, but it doesn't scale to 50,000 properties. In V2 (Next.js), I plan to move this to server-side query parameters to paginate and filter on the database level."*
*   ⚠️ **Impressive but needs verification:** *"Dynamic Photo Gallery using Custom Meta Boxes."*
    *   **Reality Check:** Ensure you can explain *how* the WP REST API exposes these arrays. The frontend code expects `gallery_urls` or `gallery_data`. If the interviewer asks how you wrote the PHP plugin to expose this, be honest if someone else wrote the WP backend, or be prepared to explain `register_rest_field` in WordPress.
