# Casa Pronto - Next.js App Router Migration (V2)

This repository contains the V2 Next.js App Router refactor of the Casa Pronto real estate platform.

## Architecture

We have successfully migrated the application from a traditional decoupled React SPA (Vite + React Router) to a hybrid **Next.js Server-Side Rendered (SSR) & Client-Side Rendered (CSR)** architecture. 

### Key Improvements:
1. **Next.js App Router**: We've completely replaced `react-router-dom` with the file-based Next.js App Router (`src/app`).
2. **Hybrid SSR + CSR**:
   - The initial load of the property listing page (`src/app/page.tsx`) uses a **React Server Component** to fetch the first batch of properties natively on the server.
   - The data is then handed off to a **Client Component** (`PropertyListingsInteractive.tsx`), which takes over for instantaneous client-side filtering, searching, and pagination using TanStack Query.
3. **Native SEO Management**: We removed the fragile PHP (`generate-ssg.js`) regex injection script. All meta tags, open graph data, and canonical URLs are now dynamically and safely injected using Next.js `generateMetadata()` APIs on the server.
4. **State Management**: The application purely leverages React Context (`SearchContext.tsx`) and TanStack Query. Redux was consciously excluded to prevent over-engineering.

## Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production Build

```bash
# Build the Next.js application
npm run build

# Start the production server
npm run start
```
