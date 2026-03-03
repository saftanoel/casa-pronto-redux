import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MapPin, Bed, Bath, Square, ArrowRight, Search, Phone, Mail, ChevronRight, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { allProperties, type Property } from "@/data/properties";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SearchProvider } from "@/context/SearchContext";

type FilterTab = "toate" | "cumparare" | "inchiriere" | "vandute";
type ViewMode = "grid" | "list";
type SortOption = "newest" | "oldest" | "price-high" | "price-low";

const zones = [
  { value: "ampoi", label: "Ampoi" },
  { value: "centru", label: "Centru" },
  { value: "cetate", label: "Cetate" },
  { value: "ciugud", label: "Ciugud" },
  { value: "oarda", label: "Oarda" },
  { value: "partos", label: "Partoș" },
  { value: "sebes", label: "Sebeș" },
];

const categories = [
  { value: "apartamente", label: "Apartamente" },
  { value: "birouri", label: "Birouri" },
  { value: "case", label: "Case" },
  { value: "garsoniere", label: "Garsoniere" },
  { value: "spatii-comerciale", label: "Spații Comerciale" },
  { value: "terenuri", label: "Terenuri" },
  { value: "vile", label: "Vile" },
];

function matchTab(p: Property, tab: FilterTab): boolean {
  switch (tab) {
    case "cumparare": return p.type === "Vânzare";
    case "inchiriere": return p.type === "Închiriere";
    case "vandute": return p.type === "Vândut";
    default: return true;
  }
}

const PropertyRow = ({ property }: { property: Property }) => (
  <Link to={`/proprietate/${property.id}`} className="block">
    <article className="bg-card rounded-xl overflow-hidden shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 flex flex-col md:flex-row animate-fade-up">
      <div className="relative md:w-80 aspect-[4/3] md:aspect-auto overflow-hidden flex-shrink-0">
        <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={property.type === "Vânzare" ? "default" : property.type === "Închiriere" ? "secondary" : "outline"}
            className={cn("text-xs", property.type === "Vândut" && "bg-foreground/80 text-background")}>
            {property.type}
          </Badge>
          {property.isNew && <Badge className="bg-accent text-accent-foreground text-xs">Nou</Badge>}
        </div>
      </div>
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{property.location}</span>
          </div>
          <h3 className="font-serif text-lg font-semibold text-foreground hover:text-primary transition-colors">
            {property.title}
          </h3>
          <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
            Agentia Imobiliară Casa Pronto oferă spre {property.type === "Închiriere" ? "închiriere" : "vânzare"} {property.title.toLowerCase()}, zona {property.location.split(",")[0]}. Suprafața imobilului este de {property.area} mp.
          </p>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Square className="h-4 w-4" />
              <span>{property.area} m²</span>
            </div>
            {property.beds > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Bed className="h-4 w-4" />
                <span>{property.beds} Camere</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Bath className="h-4 w-4" />
              <span>{property.baths} Băi</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-xl text-primary">
              {property.price}
              {property.type === "Închiriere" && <span className="text-sm font-normal text-muted-foreground">/lună</span>}
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </article>
  </Link>
);

const PropertyGrid = ({ property }: { property: Property }) => (
  <Link to={`/proprietate/${property.id}`} className="block">
    <article className="bg-card rounded-xl overflow-hidden shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 animate-fade-up">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={property.image} alt={property.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={property.type === "Vânzare" ? "default" : property.type === "Închiriere" ? "secondary" : "outline"}
            className={cn("text-xs", property.type === "Vândut" && "bg-foreground/80 text-background")}>
            {property.type}
          </Badge>
          {property.isNew && <Badge className="bg-accent text-accent-foreground text-xs">Nou</Badge>}
        </div>
        <div className="absolute bottom-3 left-3">
          <p className="text-background font-bold text-xl drop-shadow-lg">
            {property.price}
            {property.type === "Închiriere" && <span className="text-sm font-normal">/lună</span>}
          </p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-base font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">{property.title}</h3>
        <div className="flex items-center gap-1.5 text-muted-foreground mt-1.5">
          <MapPin className="h-3.5 w-3.5" />
          <span className="text-sm">{property.location}</span>
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
          {property.beds > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Bed className="h-3.5 w-3.5" />
              <span>{property.beds}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Bath className="h-3.5 w-3.5" />
            <span>{property.baths}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Square className="h-3.5 w-3.5" />
            <span>{property.area} mp</span>
          </div>
          <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
    </article>
  </Link>
);

const PropertiesPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<FilterTab>((searchParams.get("tab") as FilterTab) || "toate");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [zone, setZone] = useState(searchParams.get("zone") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [rooms, setRooms] = useState(searchParams.get("rooms") || "");
  const [area, setArea] = useState(searchParams.get("area") || "");
  const [price, setPrice] = useState(searchParams.get("price") || "");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // React to URL param changes
  useEffect(() => {
    setCategory(searchParams.get("category") || "");
    setZone(searchParams.get("zone") || "");
    setActiveTab((searchParams.get("tab") as FilterTab) || "toate");
    setSearchQuery(searchParams.get("q") || "");
    setRooms(searchParams.get("rooms") || "");
    setArea(searchParams.get("area") || "");
    setPrice(searchParams.get("price") || "");
  }, [searchParams]);

  const resetAllFilters = () => {
    setActiveTab("toate");
    setSearchQuery("");
    setZone("");
    setCategory("");
  };

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "toate", label: "TOATE" },
    { id: "cumparare", label: "CUMPĂRĂRI" },
    { id: "inchiriere", label: "ÎNCHIRIERI" },
    { id: "vandute", label: "VÂNDUTE" },
  ];

  const filteredProperties = useMemo(() => {
    let result = allProperties.filter((p) => {
      if (!matchTab(p, activeTab)) return false;
      if (zone && p.zone !== zone) return false;
      if (category && p.propertyType !== category) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q) && !p.propertyType.toLowerCase().includes(q))
          return false;
      }
      return true;
    });

    switch (sortBy) {
      case "price-high": result.sort((a, b) => b.priceValue - a.priceValue); break;
      case "price-low": result.sort((a, b) => a.priceValue - b.priceValue); break;
      case "oldest": result.sort((a, b) => a.id - b.id); break;
      default: result.sort((a, b) => b.id - a.id); break;
    }

    return result;
  }, [activeTab, zone, category, searchQuery, sortBy]);

  const handleSearch = () => {
    // Already filtering in real-time via useMemo
  };

  const getCategoryLabel = () => {
    if (category) {
      const cat = categories.find(c => c.value === category);
      return cat?.label || "Anunțuri Imobiliare";
    }
    return "Anunțuri Imobiliare";
  };

  return (
    <SearchProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        {/* Page Header */}
        <div className="bg-muted/50 pt-36 pb-8 border-b border-border">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-3xl md:text-4xl font-bold">{getCategoryLabel()} Alba Iulia</h1>
            <nav className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">Casa Pronto</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link to="/proprietati" onClick={resetAllFilters} className="hover:text-primary transition-colors">Anunțuri Imobiliare</Link>
              {category && (
                <>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="text-foreground">{getCategoryLabel()}</span>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Tabs + Sort Bar */}
        <div className="bg-background border-b border-border sticky top-[calc(2rem+5rem)] z-30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-3 gap-4">
              <div className="flex gap-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "px-5 py-2.5 text-sm font-semibold tracking-wide transition-all border-b-2",
                      activeTab === tab.id
                        ? "border-primary text-primary bg-accent/50"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Sortează:</span>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-44 h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Nou → Vechi</SelectItem>
                    <SelectItem value="oldest">Vechi → Nou</SelectItem>
                    <SelectItem value="price-high">Preț (Mare - Mic)</SelectItem>
                    <SelectItem value="price-low">Preț (Mic - Mare)</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border border-border rounded-md overflow-hidden">
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn("p-2 transition-colors", viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn("p-2 transition-colors", viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-background py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Property List */}
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-6">
                  {filteredProperties.length} proprietăți găsite
                </p>

                {filteredProperties.length > 0 ? (
                  viewMode === "list" ? (
                    <div className="flex flex-col gap-6">
                      {filteredProperties.map((property) => (
                        <PropertyRow key={property.id} property={property} />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredProperties.map((property) => (
                        <PropertyGrid key={property.id} property={property} />
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-20 bg-muted/30 rounded-xl">
                    <p className="text-muted-foreground text-lg">Nu s-au găsit proprietăți cu filtrele selectate.</p>
                    <Button variant="outline" className="mt-4" onClick={() => { setActiveTab("toate"); setZone(""); setCategory(""); setSearchQuery(""); }}>
                      Resetează Filtrele
                    </Button>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
                {/* Filters Card */}
                <div className="bg-card rounded-xl p-6 shadow-[var(--card-shadow)] border border-border">
                  <h3 className="font-serif font-semibold text-lg mb-5">Filtre</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Categorie</label>
                      <Select value={category || "all"} onValueChange={(v) => setCategory(v === "all" ? "" : v)}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Toate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toate</SelectItem>
                          {categories.map((c) => (
                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Zonă</label>
                      <Select value={zone || "all"} onValueChange={(v) => setZone(v === "all" ? "" : v)}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Toate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toate</SelectItem>
                          {zones.map((z) => (
                            <SelectItem key={z.value} value={z.value}>{z.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Caută</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Caută anunțuri..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 h-10"
                        />
                      </div>
                    </div>

                    <Button className="w-full gap-2" onClick={handleSearch}>
                      <Search className="h-4 w-4" />
                      CAUTĂ ANUNȚURI
                    </Button>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-card rounded-xl p-6 shadow-[var(--card-shadow)] border border-border">
                  <h3 className="font-serif font-semibold text-lg text-primary mb-1">Casa Pronto</h3>
                  <div className="w-12 h-1 bg-primary rounded-full mb-5" />
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span>Alba Iulia, Calea Moților, Nr 59C</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <a href="tel:0740197476" className="hover:text-primary transition-colors">0740197476</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <a href="mailto:casa_pronto@yahoo.com" className="hover:text-primary transition-colors">casa_pronto@yahoo.com</a>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </SearchProvider>
  );
};

export default PropertiesPage;
