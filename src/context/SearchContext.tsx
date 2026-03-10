import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import { type Property } from "@/data/properties";
import { matchesTaxonomy } from "@/hooks/useTaxonomyOptions";

export type FilterTab = "toate" | "cumparare" | "inchiriere" | "vandute";

interface SearchFilters {
  tab: FilterTab;
  searchQuery: string;
  zone: string;
  propertyType: string;
  rooms: string;
  area: string;
  price: string;
}

interface SearchContextType {
  filters: SearchFilters;
  setFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  filteredProperties: Property[];
  allProperties: Property[];
  isLoading: boolean;
  scrollToProperties: () => void;
}

const defaultFilters: SearchFilters = {
  tab: "toate",
  searchQuery: "",
  zone: "",
  propertyType: "",
  rooms: "",
  area: "",
  price: "",
};

const SearchContext = createContext<SearchContextType | null>(null);

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
};

function matchesArea(property: Property, areaFilter: string): boolean {
  if (!areaFilter) return true;
  const a = property.area;
  switch (areaFilter) {
    case "sub-1000": return a < 1000;
    case "1000-2000": return a >= 1000 && a < 2000;
    case "2000-3000": return a >= 2000 && a < 3000;
    case "3000-4000": return a >= 3000 && a < 4000;
    case "4000-5000": return a >= 4000 && a < 5000;
    case "5000-6000": return a >= 5000 && a < 6000;
    case "6000-7000": return a >= 6000 && a < 7000;
    case "7000-8000": return a >= 7000 && a < 8000;
    case "peste-8000": return a >= 8000;
    default: return true;
  }
}

function matchesRooms(property: Property, roomsFilter: string): boolean {
  if (!roomsFilter) return true;
  if (roomsFilter === "4+") return property.beds >= 4;
  return property.beds === parseInt(roomsFilter);
}

function matchesTab(property: Property, tab: FilterTab): boolean {
  if (tab === "toate") return true;
  const statuses = property.taxonomies?.property_status ?? [];
  const slugs = statuses.map(s => s.toLowerCase());
  switch (tab) {
    case "cumparare": return slugs.some(s => s.includes("cumpar") || s.includes("vanzar") || s.includes("vânzar"));
    case "inchiriere": return slugs.some(s => s.includes("inchiri") || s.includes("închiri"));
    case "vandute": return slugs.some(s => s.includes("vandu") || s.includes("vându") || s.includes("vandut") || s.includes("vândut"));
    default: return true;
  }
}

interface SearchProviderProps {
  children: ReactNode;
  properties?: Property[];
  isLoading?: boolean;
}

export const SearchProvider = ({ children, properties = [], isLoading = false }: SearchProviderProps) => {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  const setFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (!matchesTab(p, filters.tab)) return false;
      if (filters.zone && !matchesTaxonomy(p, "property_city", filters.zone)) return false;
      if (filters.propertyType && !matchesTaxonomy(p, "property_type", filters.propertyType)) return false;
      if (!matchesRooms(p, filters.rooms)) return false;
      if (!matchesArea(p, filters.area)) return false;
      
      if (filters.searchQuery) {
  const q = filters.searchQuery.toLowerCase();
  
  // Curățăm textele pentru a evita "Casa Pronto"
  const cleanTitle = (p.title || "").toLowerCase().replace(/casa pronto/g, "");
  const cleanLoc = (p.location || "").toLowerCase();
  const cleanPropType = (p.propertyType || "").toLowerCase().replace(/casa pronto/g, "");
  
  // Includem și prețul în căutare (convertim în string să fim siguri)
  const priceStr = (p.price || "").toLowerCase();

  if (
    !cleanTitle.includes(q) &&
    !cleanLoc.includes(q) &&
    !cleanPropType.includes(q) &&
    !priceStr.includes(q) // Acum caută și în preț (ex: dacă scrii "450")
  ) {
    return false;
  }
}
      return true;
    });
  }, [filters, properties]);

  const scrollToProperties = () => {
    document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <SearchContext.Provider value={{ filters, setFilter, filteredProperties, allProperties: properties, isLoading, scrollToProperties }}>
      {children}
    </SearchContext.Provider>
  );
};