# 🏡 Casa Pronto Redux

<div align="left">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white" alt="PHP" />
  <img src="https://img.shields.io/badge/WordPress-%23117AC9.svg?style=for-the-badge&logo=WordPress&logoColor=white" alt="WordPress" />
  <img src="https://img.shields.io/badge/apache-%23D42029.svg?style=for-the-badge&logo=apache&logoColor=white" alt="Apache" />
  <img src="https://img.shields.io/badge/playwright-%232EAD33.svg?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
</div>
<br>

A modern, fast, and responsive web application for the Casa Pronto real estate agency, built on a Headless WordPress + React architecture. The project transforms the agency's massive database (4700+ listings) into a fluid user experience, comparable to major real estate portals.

## 🚀 Tech Stack 
* **Frontend:** React, TypeScript, Vite
* **Styling:** Tailwind CSS, shadcn/ui, Lucide Icons
* **Routing:** React Router DOM
* **Performance & SEO:** Custom Static Site Generation (SSG) via Node.js & Puppeteer
* **Backend/API:** WordPress REST API (Custom Post Types & Meta Boxes) with optimized object caching.
* **Server/Hosting:** Apache (`.htaccess`), native WordPress Theme deployment
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
* **Dynamic Metadata Injection:** Engineered a robust `index.php` interceptor using Regex to securely inject canonical tags and meta descriptions on the fly, preventing hydration mismatches and HTTP 500 errors.
* **Smart 301 Redirects:** Custom mapping implemented on the server that intercepts old URLs (`/anunturi-imobiliare/...`) and redirects users and bots to the new React routes (`/proprietati?tip=...`), preserving all SEO "juice" and eliminating 404 errors.

## 🧪 Testing & Quality Assurance
To ensure long-term stability and prevent regressions, the application is covered by a robust End-to-End (E2E) testing suite powered by **Playwright**:
* **Cross-Device Validation:** Tests are configured to run natively on both Desktop (Chromium) and Mobile (Mobile Chrome/Pixel) viewports, handling responsive UI changes.
* **Core Flows Tested:** Complex real estate search logic, form validation, and external UI integrations.
* **Automated Workflow:** Automatically bootstraps the Vite development server before test execution.

## 🚧 Roadmap: V2 Architecture (Next.js)
**Current State (V1):** The live application uses a custom React SPA integrated with WordPress via a custom Server-Side Generation script for SEO optimization.

**Upcoming (V2):** We are actively refactoring the frontend to **Next.js** (`refactor/nextjs-migration` branch). This migration aims to replace the custom PHP SSG injection with native Server-Side Rendering (SSR), significantly improving LCP (Largest Contentful Paint), eliminating temporary loading spinners, and providing out-of-the-box SEO management via the Next.js App Router.

---

*🤖 **AI-Assisted & Human-Engineered Workflow:*** *This project represents a powerful hybrid approach—combining advanced AI tools with hardcore manual engineering. While initially bootstrapped with **Lovable** for rapid UI prototyping, and leveraging **Antigravity IDE** to generate complex React logic and SSG build scripts, the core integration relied heavily on manual coding and human oversight. Server configurations, custom WordPress PHP integrations, and resolving intricate React lifecycle race conditions were meticulously hand-coded and fine-tuned by the developer. High-level architecture, Apache `.htaccess` routing, and advanced SEO strategies were brainstormed alongside **Gemini 3.1 Pro**. The result is a carefully handcrafted, production-grade application capable of handling 4700+ properties with uncompromising speed and SEO compliance.*
