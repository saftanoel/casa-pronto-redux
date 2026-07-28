# 🏡 Casa Pronto Redux - Interview Preparation Notes

This document provides a comprehensive analysis of the Casa Pronto Redux repository to help you prepare for your technical interview at Qubiz. It is based strictly on the actual codebase.

## 1. Project Overview

*   **What Casa Pronto is:** A modern, fast, and responsive real estate web application for the Casa Pronto agency in Alba Iulia, replacing or upgrading their previous platform.
*   **Real-world problem it solves:** The agency needed to display a massive database (4700+ listings) with a fast, fluid user experience (like major portals) while maintaining perfect SEO indexability so properties rank on Google.
*   **Who the users are:** Homebuyers, renters, and investors looking for real estate in Alba Iulia and surrounding areas.
*   **60-Second Explanation:** "Casa Pronto is a high-performance real estate platform built on a Headless WordPress and React architecture. To solve the classic SPA SEO problem without requiring a Node.js server in production, I implemented a custom Hybrid Rendering architecture. A custom Puppeteer build script pre-renders all critical category routes as static HTML, while an intelligent PHP interceptor handles dynamic SEO tags on the fly. This allows Googlebot to instantly index 4700+ properties, while users enjoy the lightning-fast filtering and navigation of a React Single Page Application."

## 2. Tech Stack

*   **Frontend:** React 18, TypeScript, Vite.
*   **Styling:** Tailwind CSS, shadcn/ui (Radix UI primitives), Lucide Icons, Framer Motion (tailwindcss-animate).
*   **Backend/CMS/API:** Headless WordPress REST API (used as the data source for properties, taxonomies, and media).
*   **Testing:** Playwright for End-to-End (E2E) testing.
*   **Build/Deployment:** Node.js + Puppeteer (for custom SSG), `Critters` (for critical CSS inlining), Apache/PHP (for routing and fallback).
*   **Why these make sense:**
    *   **React + Vite:** Extremely fast development experience and snappy client-side filtering for thousands of properties.
    *   **Tailwind + shadcn:** Rapid, consistent, and highly accessible UI development without CSS bloat.
    *   **Headless WP:** The client likely already used WordPress. Keeping it headless allows the agency to use the familiar WP admin panel while the frontend benefits from React's speed.
    *   **Puppeteer SSG / PHP:** Avoids the need for expensive Node.js hosting (like Vercel) by generating static files that can be served cheaply on a standard Apache server, while still solving the SPA SEO problem.

## 3. Main Features

*   **Property Listing Display:** Dynamic grid and list views for properties with image carousels (`PropertyImageCarousel`) and quick details (beds, baths, area).
*   **Advanced Filtering/Searching:** A global `SearchContext` that handles complex filtering (type, zone, rooms, price). It includes a "God Mode" search that normalizes user input (removing accents, punctuation, stop words) and matches it against all raw values of a property object.
*   **URL State Synchronization:** Category and zone filters are deeply integrated into React Router paths (e.g., `/apartamente-cetate`), allowing users to share specific searches.
*   **Listing Detail Pages:** Dynamic routing (`/proprietate/:id`) fetching real-time data via TanStack React Query (`useProperty`).
*   **Responsive Design:** Fully responsive UI handled via Tailwind breakpoints, specifically tested for mobile layouts in Playwright.
*   **SEO & Performance:** Custom Static Site Generation (SSG) for 34 critical routes, inline critical CSS, and dynamic Regex-based Meta/Canonical tag injection in `index.php` for dynamic property pages.

## 4. Architecture

*   **Folder Structure:** Standard Vite/React layout (`src/components`, `src/pages`, `src/hooks`, `src/context`, `src/lib`, `tests`, `scripts`).
*   **Important Components:** `SearchContext.tsx` (state heart), `App.tsx` (routing), `PropertiesPage.tsx` (main listing view), `Header/Footer`.
*   **Data Flow:**
    *   `useInitialProperties` fetches the first 60 properties for an instant paint.
    *   `useAllProperties` fetches all ~5000 properties in the background to enable instant client-side global filtering without hitting the API again.
*   **API Integration Flow:** Abstracted in `src/lib/api/wordpress.ts` and consumed via TanStack React Query hooks (`useProperties.ts`).
*   **Filtering:** Managed entirely client-side in `SearchContext.tsx` via a `useMemo` hook that iterates over the large property array based on selected filters and text search.
*   **Routing:** React Router v6. Hardcoded SEO-friendly routes (e.g., `/case-centru`) point to the generic `<PropertiesPage />` with predefined props.
*   **Rendering (Hybrid):**
    *   **SSG:** `scripts/generate-ssg.js` spins up a local server and uses Puppeteer to crawl and save the HTML of predefined routes.
    *   **SPA Fallback:** When a route isn't static (like a specific property `/proprietate/123`), Apache falls back to `index.php`, which serves the SPA HTML shell.

## 5. Performance and SEO

*   **Loading Speed:**
    *   **Critical CSS:** The `Critters` library inlines critical CSS during the SSG build so the first paint is unblocked.
    *   **Initial vs Background Fetch:** Loads 60 properties first for speed, then fetches the rest in the background.
*   **Crawlability/Indexability:**
    *   34 main routes (categories/zones) are pure static HTML generated at build time. Googlebot reads them instantly.
    *   For dynamic properties, `index.php` intercepts the request. It uses standard WordPress functions (`get_post`, `get_post_meta`) to fetch the property details on the server, uses Regex to strip the default SPA `<title>` and `<meta>` tags, and injects the specific property's SEO tags *before* sending the HTML to the browser.
*   **Tradeoffs:**
    *   Regex HTML manipulation in PHP is fragile; if the Vite build changes the `<head>` structure, the regex might break.
    *   Client-side filtering of 5000 items is memory-heavy on low-end devices.
    *   Build times are slow because Puppeteer has to load and render 34 pages sequentially (with 20s timeouts).

## 6. Difficult Technical Parts

*   **Puppeteer Protocol Deadlocks:** The build script (`generate-ssg.js`) uses aggressive network interception and strict `Promise.race` timeouts to prevent Puppeteer from hanging indefinitely while waiting for React to render.
*   **Hydration Mismatches / Race Conditions:** There's a custom event dispatch `document.dispatchEvent(new Event('prerender-ready'))` in `App.tsx` delayed by 1000ms after loading finishes, signaling to external scripts (like prerenderers) that the DOM is stable.
*   **Large JSON Payload / Filtering:** The "God Mode" search (`extractAllValues`) recursively extracts all strings/numbers from the property object. Running this on 5000 items on every keystroke could block the main thread, which is why debouncing (`useDebounce`) is critical.
*   **PHP Regex Injection:** Safely replacing canonical links and meta tags in a raw HTML string using `preg_replace` in `index.php` without breaking the document structure.

## 7. Testing

*   **Playwright Tests (`e2e.spec.ts` & `contact.spec.ts`):**
*   **User flows tested:** Homepage loading, Header search (desktop & mobile), dropdown filtering, Hamburger navigation, and advanced mobile modal filtering (Sort, Type, Zone).
*   **What could be tested better:** There is no mocking of the WordPress API. E2E tests rely on live data, making them flaky if the database changes. There are no unit tests (Vitest) for the complex search logic in `SearchContext.tsx`.
*   **How to explain E2E in interview:** "I used Playwright to simulate real user interactions across both desktop and mobile viewports. It ensures that the critical paths—like searching for an apartment on a mobile device and opening the filter modal—work flawlessly before any deployment."

## 8. Your Likely Contribution / Ownership

*   You should confidently own the **Hybrid Rendering Architecture**.
*   **Crucial files to review and understand deeply:**
    1.  `scripts/generate-ssg.js` (Understand the Puppeteer flow, `Promise.race`, network interception).
    2.  `dist/index.php` (Understand how `preg_replace` works to inject dynamic SEO tags for `/proprietate/:id`).
    3.  `src/context/SearchContext.tsx` (Understand the `extractAllValues` recursive search function and `useMemo` filtering).
    4.  `src/App.tsx` (Understand how static routes map to dynamic components).

## 9. Technical Decisions and Tradeoffs

*   **Why React + TS:** TypeScript prevents runtime errors when dealing with complex, deeply nested WordPress API responses. React provides the component architecture needed for a rich UI.
*   **Why Tailwind:** Allows for rapid iteration of the UI without context switching between CSS and TSX files.
*   **Why Headless WP:** The data already lived there. Rebuilding the CMS was out of scope; exposing it via REST API was the pragmatic choice.
*   **Why custom SSG instead of Next.js:** The project needed to be hosted on a standard shared Apache/PHP server where the WP instance lives. Next.js requires a Node server for SSR. The custom SSG + PHP fallback provided Next.js-like SEO on cheap shared hosting.
*   **What to improve for Production (V2):** Migrate to Next.js App Router. It eliminates the fragile PHP regex injection, removes the slow Puppeteer build step, and handles SSR natively. Also, implementing server-side filtering (via API query params) instead of downloading 5000 items to the client.

## 10. Interview Explanations

*   **60-Second (Elevator Pitch):** "Casa Pronto is a Headless WordPress and React platform I built to handle 4700+ properties. To get perfect SEO without needing a Node server, I wrote a custom Puppeteer script that pre-renders critical pages to static HTML during the Vite build. For dynamic pages, a custom PHP router intercepts the request and injects SEO tags on the fly. It gives the client the speed of a React SPA and the SEO of a static site."
*   **2-3 Minute (Deep Dive):** "The core challenge of Casa Pronto was balancing a highly interactive UI with strict SEO requirements on a standard Apache server. I chose Vite and React for the frontend, consuming a WordPress REST API. Because standard SPAs fail at SEO, I engineered a Hybrid architecture. First, a Node script uses Puppeteer to crawl the local build and save 34 critical category routes as pure HTML. These are served instantly by Apache. Second, for dynamic property pages, requests fall back to an `index.php` file. This PHP script fetches the specific property from WordPress, uses Regex to strip the SPA's default meta tags, injects the real property tags, and serves the shell. On the client, I implemented a global `SearchContext` that fetches all properties in the background, allowing instant, memory-based filtering using a recursive text-matching algorithm."
*   **Simple HR Explanation:** "I built a modern, extremely fast website for a real estate agency. The main goal was to make sure people could find exactly what they were looking for among thousands of houses instantly, while also making sure Google could easily read the site to rank it high in search results. I used React to make it fast for users, and created a special background system so Google sees it perfectly."

## 11. Likely Technical Questions & Answers

1.  **Q: Why use TypeScript instead of plain JavaScript?**
    *A: It catches errors at compile-time, especially useful when mapping the unpredictable JSON responses from the WordPress REST API to strict property interfaces.*
2.  **Q: How does `SearchContext` handle performance with 5000 items?**
    *A: It relies on React's `useMemo` to cache the filtered array, recalculating only when filters change. We also fetch a small batch initially for fast paint, loading the rest in the background.*
3.  **Q: Explain the "God Mode" search in your Context.**
    *A: It's a recursive function (`extractAllValues`) that traverses the entire property object, extracts all strings/numbers, normalizes them (removes accents/punctuation), and checks if the user's debounced search terms exist within that massive string.*
4.  **Q: What is a Race Condition, and how did you prevent it?**
    *A: A race condition occurs when asynchronous operations complete in an unexpected order. I used TanStack Query, which handles request deduplication and caching, ensuring the UI always reflects the latest API state regardless of network speeds.*
5.  **Q: How does Puppeteer help with SEO?**
    *A: It acts like a browser during the build process, executing all React JavaScript and saving the final, fully-rendered HTML structure to disk so Googlebot can crawl it without executing JS.*
6.  **Q: Why use `Promise.race` in your SSG script?**
    *A: Puppeteer can sometimes hang indefinitely waiting for network resources. `Promise.race` pits the page load against a `setTimeout`, forcing the script to abort and continue if a page takes longer than 20 seconds.*
7.  **Q: How do you intercept and serve static files on Apache?**
    *A: Through `.htaccess` rewrite rules that point specific URL paths (like `/apartamente`) directly to the pre-rendered `.html` files in the theme folder, bypassing PHP entirely.*
8.  **Q: Why use Regex to inject SEO tags in PHP?**
    *A: Because we didn't have a Node server for real SSR. `index.php` reads the static `index.html` shell as a string, finds the `<head>`, and surgically replaces the default meta tags with dynamic ones from the database before sending it to the client.*
9.  **Q: What is a Hydration Mismatch?**
    *A: It happens when the server-rendered HTML differs from what React expects to render on the client. It can break the app. My PHP regex injection was carefully written to only alter meta tags in the `<head>`, avoiding changes to the `#root` div where React mounts.*
10. **Q: How does TanStack React Query improve the app?**
    *A: It provides built-in caching, background refetching, and manages loading/error states out of the box, replacing complex `useEffect` and Redux boilerplate.*
11. **Q: How are you managing URL state?**
    *A: By utilizing React Router's URL parameters and mapping hardcoded paths (e.g., `/case-centru`) to the `<PropertiesPage />` component with specific props, keeping the URL as the source of truth for categories.*
12. **Q: What does `Critters` do in the build process?**
    *A: It parses the generated HTML, identifies which CSS is critical for the initial viewport, inlines it directly into the `<style>` tag, and defers the rest, drastically improving First Contentful Paint (FCP).*
13. **Q: How do you handle mobile responsiveness?**
    *A: Using Tailwind's utility-first breakpoint prefixes (e.g., `md:`, `lg:`). We use a custom hook `use-mobile` and thoroughly test layouts with Playwright across device profiles.*
14. **Q: What is the purpose of End-to-End (E2E) testing?**
    *A: To test the application from the user's perspective in a real browser. Playwright clicks buttons and fills forms to ensure the integration between frontend, router, and API works flawlessly.*
15. **Q: Why use `useDebounce` on search inputs?**
    *A: To prevent the heavy `useMemo` filtering logic from running on every single keystroke. It waits until the user stops typing for a specified time before executing the search.*
16. **Q: How does the Headless WordPress integration work?**
    *A: WordPress acts strictly as an API backend. Custom Post Types and Meta Boxes were created for properties, and exposed via custom REST API endpoints which the React app fetches.*
17. **Q: What is the downside of fetching 5000 properties to the client?**
    *A: High memory usage on the user's device and high bandwidth consumption initially. It's a tradeoff made for instant, zero-latency filtering after the initial load.*
18. **Q: How would you fix the memory issue in the future?**
    *A: Shift the filtering logic to the backend. The client would send query parameters to the WP REST API, and the server would return paginated results.*
19. **Q: Explain `staleTime` vs `gcTime` in React Query.**
    *A: `staleTime` is how long data is considered fresh before a background refetch is triggered. `gcTime` (formerly `cacheTime`) is how long inactive data remains in memory before being garbage collected.*
20. **Q: Why use `forwardRef` in React components?**
    *A: (General React knowledge) It allows a component to expose its underlying DOM node to a parent component, useful for focusing inputs or measuring elements.*
21. **Q: How do you handle 404 pages?**
    *A: React Router has a catch-all route `path="*"` that renders a `<NotFound />` component if the URL doesn't match any defined routes.*
22. **Q: What is the purpose of the `prerender-ready` event?**
    *A: It tells the Puppeteer headless browser that React has finished rendering dynamic content and fetching data, so it's safe to take the HTML snapshot.*
23. **Q: How does Playwright handle mobile testing?**
    *A: Playwright can emulate mobile devices by setting specific viewports and user agents in its configuration, allowing us to test mobile-specific UI like hamburger menus.*
24. **Q: What is Tailwind CSS's biggest advantage here?**
    *A: It prevents CSS specificity wars and dead code. Only the utility classes actually used in the TSX files are bundled into the final CSS file.*
25. **Q: How are you handling Environment Variables?**
    *A: Vite uses `.env` files. Variables prefixed with `VITE_` are exposed to the client-side code.*

## 12. Challenging Questions

*   **"Why not Next.js?"**
    *A: "Next.js is actually on the roadmap (V2). However, for V1, we had to deploy on the client's existing shared Apache hosting where WordPress lives. Next.js requires a Node.js server for true SSR. The custom Puppeteer SSG + PHP fallback was a pragmatic solution to achieve Next.js-level SEO on cheap Apache hosting."*
*   **"How do you avoid slow performance with 5000 listings?"**
    *A: "We load a small chunk (60 items) immediately for the First Paint, then load the rest asynchronously in the background. We heavily rely on React's `useMemo` to cache the filtered results so re-renders are fast."*
*   **"What happens if the WP API is down?"**
    *A: "Currently, TanStack query will fail gracefully and we should show an error state. However, because critical paths are pre-rendered as static HTML, the initial page loads will still work perfectly, users just won't be able to do dynamic filtering."*
*   **"How would you scale this?"**
    *A: "Move filtering to the backend. Client-side filtering of 5000 items works now, but at 50,000 items it will crash the browser. We need pagination and server-side filtering via API parameters."*
*   **"What would you improve?"**
    *A: "1. Migrate to Next.js to eliminate the fragile PHP Regex injection. 2. Implement server-side pagination. 3. Add unit tests (Vitest) for the `SearchContext` logic."*

## 13. Final Cheat Sheet

**5 Things I Must Remember:**
1.  **Hybrid Architecture:** Puppeteer SSG for static categories (SEO) + PHP fallback for dynamic properties.
2.  **SearchContext:** The heart of the app; handles global client-side filtering using `useMemo` and recursive object traversal.
3.  **Data Fetching:** TanStack React Query (`useInitialProperties` for speed, `useAllProperties` for background data).
4.  **PHP SEO Injection:** `index.php` intercepts dynamic routes, strips SPA tags using Regex, and injects specific property tags.
5.  **The Next.js Roadmap:** Acknowledge that the current setup is a V1 workaround for Apache hosting, and Next.js is the V2 evolution.

**5 Technical Terms:**
1.  **Static Site Generation (SSG)**
2.  **Single Page Application (SPA)**
3.  **Hydration Mismatch**
4.  **Headless CMS**
5.  **End-to-End (E2E) Testing**

**5 Weaknesses / Improvements:**
1.  Client-side filtering of 5000 items consumes high client memory.
2.  Regex manipulation in PHP is fragile and prone to breaking if HTML structure changes.
3.  Puppeteer build process is slow and resource-intensive.
4.  Lack of isolated Unit Tests (Vitest) for complex functions.
5.  Lack of API mocking in E2E tests makes them dependent on the live database.

**5 Strong Points:**
1.  Instantaneous page loads for pre-rendered SEO routes.
2.  Zero-latency filtering (once the background data is loaded).
3.  Highly robust "God Mode" text search algorithm.
4.  Excellent automated E2E coverage for critical user flows.
5.  Pragmatic engineering: solved the SPA SEO problem on limited Apache infrastructure.
