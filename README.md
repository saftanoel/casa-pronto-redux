# 🏡 Casa Pronto Redux
A modern, fast, and responsive web application for the Casa Pronto real estate agency, built on a Headless WordPress + React architecture. The project transforms the agency's massive database (4700+ listings) into a fluid user experience, comparable to major real estate portals.

## 🚀 Tech Stack 
* **Frontend:** React, TypeScript, Vite
* **Styling:** Tailwind CSS, shadcn/ui, Lucide Icons
* **Routing:** React Router DOM
* **Performance & SEO:** Custom Static Site Generation (SSG) via Node.js & Puppeteer
* **Backend/API:** WordPress REST API (Custom Post Types & Meta Boxes)
* **Server/Hosting:** Apache (.htaccess), deployed natively as a custom WordPress Theme
* **Testing:** Playwright (End-to-End)

## ⚡ Architecture: Hybrid SSG & SPA
To achieve a perfect 100/100 Lighthouse score and instantly serve content to Googlebot, the application utilizes a custom Hybrid Rendering architecture:
* **Pre-rendered Critical Routes:** A custom Node.js build script (`generate-ssg.js`) spins up a headless browser (Puppeteer) during the build process to crawl and save the Homepage and 34 critical category/zone routes (e.g., `/apartamente`, `/case-cetate`) as pure, fully-populated static `.html` files.
* **Zero-PHP Overhead:** Custom Apache `.htaccess` RewriteRules intercept requests to category pages and serve the static HTML directly from the theme folder, completely bypassing the WordPress/PHP engine for instantaneous load times and zero server strain.
* **SPA Fallback:** Dynamic routes (like individual property pages `/proprietate/:id` or deep filtered searches) gracefully fall back to the dynamic Single Page Application (SPA), loading real-time data via the WP REST API.

## 🧠 State Management & Complex Filtering
* Highly optimized URL state synchronization (`SearchContext` + React Router) allowing users to share exact search filter combinations via URL.
* Solved complex React lifecycle race conditions and infinite rendering loops to ensure smooth transitions between static pre-rendered states and dynamic client-side filtering.

## ⚙️ Backend & WordPress Integration (Headless) 
To ensure the React application works flawlessly, native WordPress functionalities were extended via a dedicated plugin/snippet:
* **Custom Post Types & Taxonomies:** Registered REST routes for property types, areas, and statuses.
* **Dynamic Photo Gallery:** Integration with the WP Media Library through a custom Meta Box system, allowing unlimited image uploads (cleanly saved as arrays and exposed via the API).
* **Custom Fields:** Price, surface area, bedrooms, and bathrooms natively attached to the properties API endpoint.

## 🔗 SEO & Traffic Migration 
* **Flawless Googlebot Crawlability:** Overcame SPA SEO limitations. Pre-rendered HTML guarantees that Googlebot instantly reads listing descriptions, prices, and properties without waiting for JavaScript execution.
* **Smart 301 Redirects:** Custom PHP script implemented on the legacy server/site that intercepts old URLs (`/proprietate.php?id=...`) and redirects users and Google bots to the new React routes (`/proprietate/1234`), preserving all SEO "juice" and eliminating 404 errors.

## 🧪 Testing & Quality Assurance
To ensure long-term stability and prevent regressions, the application is covered by a robust End-to-End (E2E) testing suite powered by **Playwright**:
* **Cross-Device Validation:** Tests are configured to run natively on both Desktop (Chromium) and Mobile (Mobile Chrome/Pixel) viewports, handling responsive UI changes.
* **Core Flows Tested:** Complex real estate search logic, form validation, and external UI integrations.
* **Automated Workflow:** Automatically bootstraps the Vite development server before test execution.

---
---
*🤖 **AI-Assisted & Human-Engineered Workflow:*** 
*This project represents a powerful hybrid approach—combining advanced AI tools with hardcore manual engineering. While initially bootstrapped with **Lovable** for rapid UI prototyping, and leveraging **Antigravity IDE** to generate complex React logic and SSG build scripts, the core integration relied heavily on manual coding and human oversight. Server configurations, custom WordPress PHP integrations, and resolving intricate React lifecycle race conditions were meticulously hand-coded and fine-tuned by the developer. High-level architecture, Apache `.htaccess` routing, and advanced SEO strategies were brainstormed alongside **Gemini 3.1 Pro**. The result is a carefully handcrafted, production-grade application capable of handling 4700+ properties with uncompromising speed and SEO compliance.*
