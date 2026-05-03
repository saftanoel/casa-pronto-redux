import fs from 'fs';
import path from 'path';

// We fetch directly from the WordPress API endpoint
const WP_API_BASE = "https://casapronto.ro/wp-json/casapronto/v1";
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

async function fetchAllProperties() {
  console.log("Starting to fetch all properties from WordPress...");

  const PER_PAGE = 10;
  const firstUrl = `${WP_API_BASE}/anunturi?per_page=${PER_PAGE}&page=1`;
  const firstResponse = await fetch(firstUrl);

  if (!firstResponse.ok) {
    throw new Error(`Failed to fetch properties: ${firstResponse.status}`);
  }

  const totalPages = parseInt(firstResponse.headers.get("X-WP-TotalPages") || "1", 10);
  const totalItems = parseInt(firstResponse.headers.get("X-WP-Total") || "0", 10);
  console.log(`Found ${totalItems} properties across ${totalPages} pages.`);

  const firstBatch = await firstResponse.json();
  let allPosts = [...firstBatch];

  if (totalPages > 1) {
    const chunkSize = 1; // reduced to 1 for fully serial requests to prevent HeadersTimeout

    for (let i = 2; i <= totalPages; i += chunkSize) {
      const chunkPromises = [];
      for (let j = i; j < i + chunkSize && j <= totalPages; j++) {
        chunkPromises.push(
          fetch(`${WP_API_BASE}/anunturi?per_page=${PER_PAGE}&page=${j}`)
            .then(r => r.json())
        );
      }
      const chunkResults = await Promise.all(chunkPromises);
      for (const batch of chunkResults) {
        allPosts = allPosts.concat(batch);
      }
      console.log(`Fetched pages up to ${Math.min(i + chunkSize - 1, totalPages)} / ${totalPages}`);
    }
  }

  console.log(`Successfully fetched ${allPosts.length} total properties.`);

  const destFile = path.join(PUBLIC_DIR, 'prerender-properties.json');
  fs.writeFileSync(destFile, JSON.stringify(allPosts), 'utf-8');
  console.log(`Saved to ${destFile}`);
}

async function fetchTaxonomies() {
  console.log("Starting to fetch taxonomies from WordPress...");
  const response = await fetch(`${WP_API_BASE}/taxonomii`);
  if (!response.ok) {
    throw new Error(`Failed to fetch taxonomies: ${response.status}`);
  }

  const data = await response.json();
  const destFile = path.join(PUBLIC_DIR, 'prerender-taxonomies.json');
  fs.writeFileSync(destFile, JSON.stringify(data), 'utf-8');
  console.log(`Saved taxonomies to ${destFile}`);
}

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  try {
    await fetchAllProperties();
    await fetchTaxonomies();
    console.log("Prefetch complete!");
  } catch (error) {
    console.error("Error during prefetch:", error);
    process.exit(1);
  }
}

main();
