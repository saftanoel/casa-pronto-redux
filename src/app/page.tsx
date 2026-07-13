import { fetchInitialProperties } from "@/lib/api/wordpress";
import PropertyListingsInteractive from "@/components/PropertyListingsInteractive";

// Optionally set dynamic revalidation (e.g. revalidate every 3600 seconds)
export const revalidate = 3600;

export default async function Home() {
  // Fetch initial batch of properties server-side
  const properties = await fetchInitialProperties(60);

  return (
    <main>
      <PropertyListingsInteractive initialProperties={properties} />
    </main>
  );
}
