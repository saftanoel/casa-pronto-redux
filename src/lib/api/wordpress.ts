import { type Property } from "@/data/properties";

const WP_API_BASE = "https://casapronto.ro/wp-json/wp/v2";

export interface WPPost {
  id: number;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      media_details?: {
        sizes?: {
          full?: { source_url: string };
          large?: { source_url: string };
          medium_large?: { source_url: string };
        };
      };
    }>;
  };
}

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

function extractType(title: string): "Vânzare" | "Închiriere" | "Vândut" {
  const t = title.toLowerCase();
  if (t.includes("inchiri") || t.includes("închiri")) return "Închiriere";
  if (t.includes("vandu") || t.includes("vându") || t.includes("vandut") || t.includes("vândut")) return "Vândut";
  return "Vânzare";
}

function extractPrice(title: string, content: string): { price: string; priceValue: number } {
  const text = title + " " + content;
  
  // Match patterns like "350 Euro/luna", "89.000 Euro", "5 Euro/mp"
  const priceMatch = text.match(/(?:pret|preț)[^0-9]*?([\d.,]+)\s*euro/i)
    || text.match(/([\d.,]+)\s*euro/i);
  
  if (priceMatch) {
    const raw = priceMatch[1].replace(/\./g, "").replace(",", ".");
    const value = parseFloat(raw);
    if (!isNaN(value)) {
      // Format price
      const formatted = value.toLocaleString("ro-RO");
      const suffix = text.toLowerCase().includes("euro/mp") ? " €/mp" 
        : text.toLowerCase().includes("euro/luna") ? " €" 
        : " €";
      return { price: `${formatted}${suffix}`, priceValue: value };
    }
  }
  return { price: "Preț la cerere", priceValue: 0 };
}

function extractLocation(title: string): { location: string; zone: string } {
  const zonaMatch = title.match(/zona\s+([^.,]+)/i);
  const zone = zonaMatch ? zonaMatch[1].trim() : "";
  const location = zone ? `${zone}, Alba Iulia` : "Alba Iulia";
  return { location, zone: zone.toLowerCase().replace(/\s+/g, "-") };
}

function extractPropertyType(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("apartament")) return "apartamente";
  if (t.includes("garsonier")) return "garsoniere";
  if (t.includes("casa") || t.includes("casă")) return "case";
  if (t.includes("vila") || t.includes("vilă")) return "vile";
  if (t.includes("teren")) return "terenuri";
  if (t.includes("birou") || t.includes("birouri")) return "birouri";
  if (t.includes("spatiu") || t.includes("spațiu") || t.includes("depozit") || t.includes("comercial")) return "spatii-comerciale";
  return "altele";
}

function extractNumber(text: string, patterns: RegExp[]): number {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return parseInt(match[1]);
  }
  return 0;
}

function extractBeds(content: string, title: string): number {
  const text = title + " " + content;
  return extractNumber(text, [
    /(\d+)\s*camere/i,
    /(\d+)\s*dormitor/i,
  ]);
}

function extractBaths(content: string): number {
  return extractNumber(content, [
    /(\d+)\s*b[aă]i/i,
    /(\d+)\s*baie/i,
  ]);
}

function extractArea(content: string): number {
  return extractNumber(content, [
    /suprafat[aă][^0-9]*?(\d+)\s*mp/i,
    /(\d+)\s*mp/i,
    /(\d+)\s*m²/i,
  ]);
}

function extractFeatures(content: string): string[] {
  const features: string[] = [];
  const text = content.toLowerCase();
  
  const featureKeywords = [
    { keyword: "central", label: "Centrală termică" },
    { keyword: "balcon", label: "Balcon" },
    { keyword: "garaj", label: "Garaj" },
    { keyword: "parcare", label: "Parcare" },
    { keyword: "mobilat", label: "Mobilat" },
    { keyword: "utilat", label: "Utilat" },
    { keyword: "renovat", label: "Renovat" },
    { keyword: "gradin", label: "Grădină" },
    { keyword: "piscin", label: "Piscină" },
    { keyword: "teras", label: "Terasă" },
    { keyword: "pivnit", label: "Pivniță" },
    { keyword: "lift", label: "Lift" },
    { keyword: "aer conditionat", label: "Aer condiționat" },
    { keyword: "izolat", label: "Izolație termică" },
  ];
  
  for (const { keyword, label } of featureKeywords) {
    if (text.includes(keyword)) features.push(label);
  }
  
  return features;
}

function getImageUrl(post: WPPost): string {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return "/placeholder.svg";
  
  // Prefer large size, fall back to full, then source_url
  return media.media_details?.sizes?.large?.source_url
    || media.media_details?.sizes?.full?.source_url
    || media.source_url;
}

function isNewProperty(dateStr: string): boolean {
  const postDate = new Date(dateStr);
  const now = new Date();
  const diffDays = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 14;
}

export function mapWPPostToProperty(post: WPPost): Property {
  const title = post.title.rendered;
  const contentText = stripHtml(post.content.rendered);
  const type = extractType(title);
  const { price, priceValue } = extractPrice(title, contentText);
  const { location, zone } = extractLocation(title);
  const imageUrl = getImageUrl(post);

  return {
    id: post.id,
    image: imageUrl,
    images: [imageUrl],
    title,
    description: contentText.trim(),
    location,
    zone,
    price,
    priceValue,
    beds: extractBeds(contentText, title),
    baths: extractBaths(contentText),
    area: extractArea(contentText),
    type,
    propertyType: extractPropertyType(title),
    isNew: isNewProperty(post.date),
    features: extractFeatures(contentText),
    agent: "Baba Elena",
  };
}

export async function fetchProperties(page = 1, perPage = 100): Promise<Property[]> {
  const url = `${WP_API_BASE}/anunturi?_embed&per_page=${perPage}&page=${page}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch properties: ${response.status}`);
  }
  
  const posts: WPPost[] = await response.json();
  return posts.map(mapWPPostToProperty);
}

export async function fetchAllProperties(): Promise<Property[]> {
  // First request to get total pages
  const firstUrl = `${WP_API_BASE}/anunturi?_embed&per_page=100&page=1`;
  const firstResponse = await fetch(firstUrl);
  
  if (!firstResponse.ok) {
    throw new Error(`Failed to fetch properties: ${firstResponse.status}`);
  }
  
  const totalPages = parseInt(firstResponse.headers.get("X-WP-TotalPages") || "1");
  const firstBatch: WPPost[] = await firstResponse.json();
  let allPosts = [...firstBatch];
  
  // Fetch remaining pages in parallel
  if (totalPages > 1) {
    const promises = [];
    for (let page = 2; page <= totalPages; page++) {
      promises.push(
        fetch(`${WP_API_BASE}/anunturi?_embed&per_page=100&page=${page}`)
          .then(r => r.json() as Promise<WPPost[]>)
      );
    }
    const results = await Promise.all(promises);
    for (const batch of results) {
      allPosts = allPosts.concat(batch);
    }
  }
  
  return allPosts.map(mapWPPostToProperty);
}

export async function fetchPropertyById(id: number): Promise<Property | null> {
  const [postRes, mediaRes] = await Promise.all([
    fetch(`${WP_API_BASE}/anunturi/${id}?_embed`),
    fetch(`${WP_API_BASE}/media?parent=${id}&per_page=100`),
  ]);
  
  if (!postRes.ok) return null;
  
  const post: WPPost = await postRes.json();
  const property = mapWPPostToProperty(post);

  // Add all attached media images
  if (mediaRes.ok) {
    const media: Array<{ source_url: string; media_details?: { sizes?: { large?: { source_url: string }; full?: { source_url: string } } } }> = await mediaRes.json();
    const allImages = media
      .map(m => m.media_details?.sizes?.large?.source_url || m.media_details?.sizes?.full?.source_url || m.source_url)
      .filter(Boolean);
    if (allImages.length > 0) {
      property.images = allImages;
      property.image = allImages[0];
    }
  }

  return property;
}
