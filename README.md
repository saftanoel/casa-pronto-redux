🏡 Casa Pronto Redux
A modern, fast, and responsive web application for the Casa Pronto real estate agency, built on a Headless WordPress + React architecture. The project transforms the agency's massive database (4700+ listings) into a fluid user experience, comparable to major real estate portals.

🚀 Tech Stack
Frontend: React, TypeScript, Vite

Styling: Tailwind CSS, shadcn/ui, Lucide Icons

Routing: React Router DOM

Backend/API: WordPress REST API (Custom Post Types & Meta Boxes)

⚙️ Backend & WordPress Integration (Headless)
To ensure the React application works flawlessly, native WordPress functionalities were extended via a dedicated plugin/snippet:

Custom Post Types & Taxonomies: Registered REST routes for property types, areas, and statuses.

Dynamic Photo Gallery: Integration with the WP Media Library through a custom Meta Box system, allowing unlimited image uploads (cleanly saved as arrays and exposed via the API).

Custom Fields: Price, surface area, bedrooms, and bathrooms natively attached to the properties API endpoint.

🔗 SEO & Traffic Migration
Smart 301 Redirects: Custom PHP script implemented on the legacy server/site that intercepts old URLs (/proprietate.php?id=...) and redirects users and Google bots to the new React routes (/proprietate/1234), preserving all SEO "juice" and eliminating 404 errors.
