import { type Property } from "@/data/properties";

const WP_API_BASE = "https://casapronto.ro/wp-json/casapronto/v1";
// Custom endpoint returns flattened data — no _embed or _fields needed
const PER_PAGE_LIST = 12;

export interface WPPost {
  id: number;
  slug?: string;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  gallery_urls?: string[];
  taxonomies?: {
    property_type?: string[];
    property_status?: string[];
    property_city?: string[];
  };
  property_details?: {
    price?: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      media_details?: {
        sizes?: {
          full?: { source_url: string };
          large?: { source_url: string };
          medium_large?: { source_url: string };
          medium?: { source_url: string };
        };
      };
    }>;
  };
}

export interface PaginatedResult {
  properties: Property[];
  totalPages: number;
  totalItems: number;
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

function parsePrice(raw: string | undefined): { price: string; priceValue: number } {
  if (!raw) return { price: "Preț la cerere", priceValue: 0 };
  const cleaned = raw.replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".");
  const value = parseFloat(cleaned);
  if (isNaN(value) || value === 0) return { price: "Preț la cerere", priceValue: 0 };
  const formatted = value.toLocaleString("ro-RO");
  return { price: `${formatted} €`, priceValue: value };
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

/** Get featured image from gallery_urls or placeholder */
function getImageUrl(post: WPPost): string {
  return post.gallery_urls?.[0] || "/placeholder.svg";
}

function isNewProperty(dateStr: string): boolean {
  const postDate = new Date(dateStr);
  const now = new Date();
  return (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24) <= 14;
}

export function mapWPPostToProperty(post: WPPost, preferSmallImage = false): Property {
  const title = post.title.rendered;
  const contentText = stripHtml(post.content.rendered);
  const type = extractType(title);
  const { location, zone } = extractLocation(title);
  const featuredImage = getImageUrl(post);

  const details = post.property_details;
  const { price, priceValue } = parsePrice(details?.price);
  const beds = details?.bedrooms ?? 0;
  const baths = details?.bathrooms ?? 0;
  const area = details?.area ?? 0;

  const galleryImages = post.gallery_urls && post.gallery_urls.length > 0
    ? post.gallery_urls
    : [featuredImage];

  const taxonomies = {
    property_type: post.taxonomies?.property_type ?? [],
    property_status: post.taxonomies?.property_status ?? [],
    property_city: post.taxonomies?.property_city ?? [],
  };

  return {
    id: post.id,
    image: featuredImage,
    images: galleryImages,
    title,
    description: contentText.trim(),
    location,
    zone,
    price,
    priceValue,
    beds,
    baths,
    area,
    type,
    propertyType: extractPropertyType(title),
    isNew: isNewProperty(post.date),
    features: extractFeatures(contentText),
    agent: "Baba Elena",
    date: post.date,
    taxonomies,
  };
}

/** Paginated fetch — used for load more */
export async function fetchPropertiesPaginated(page = 1, perPage = PER_PAGE_LIST): Promise<PaginatedResult> {
  const url = `${WP_API_BASE}/anunturi?per_page=${perPage}&page=${page}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch properties: ${response.status}`);
  }
  
  const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "1");
  const totalItems = parseInt(response.headers.get("X-WP-Total") || "0");
  const posts: WPPost[] = await response.json();
  
  return {
    properties: posts.map(p => mapWPPostToProperty(p, true)),
    totalPages,
    totalItems,
  };
}

/** Fetch all properties — still needed for homepage featured + search context */
export async function fetchAllProperties(): Promise<Property[]> {
  const firstUrl = `${WP_API_BASE}/anunturi?per_page=100&page=1`;
  const firstResponse = await fetch(firstUrl);
  
  if (!firstResponse.ok) {
    throw new Error(`Failed to fetch properties: ${firstResponse.status}`);
  }
  
  const totalPages = parseInt(firstResponse.headers.get("X-WP-TotalPages") || "1");
  const firstBatch: WPPost[] = await firstResponse.json();
  let allPosts = [...firstBatch];
  
  if (totalPages > 1) {
    const promises = [];
    for (let page = 2; page <= totalPages; page++) {
      promises.push(
        fetch(`${WP_API_BASE}/anunturi?per_page=100&page=${page}`)
          .then(r => r.json() as Promise<WPPost[]>)
      );
    }
    const results = await Promise.all(promises);
    for (const batch of results) {
      allPosts = allPosts.concat(batch);
    }
  }
  
  return allPosts.map(p => mapWPPostToProperty(p, true));
}

/** Fetch single property by ID — uses dedicated endpoint */
export async function fetchPropertyById(id: number): Promise<Property | null> {
  const postRes = await fetch(`${WP_API_BASE}/anunturi/${id}`);
  if (!postRes.ok) return null;

  const post: WPPost = await postRes.json();
  return mapWPPostToProperty(post);
}
