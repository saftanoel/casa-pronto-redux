import { Search, MapPin, Home, Building2, Ruler, Euro } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useSearch } from "@/context/SearchContext";
import heroBg from "@/assets/hero-bg.jpg";

const zones = [
  "Aiud", "Alba-Micesti", "Ampoi", "Ampoi3", "Ampoita", "Barabant", "Blaj",
  "Caroline", "Centru", "Cetate", "Cetate Alba Carolina", "Ciugud", "Cluj",
  "Cluj Napoca", "Cugir", "Geoagiu", "Ighiu", "Micesti", "Oarda", "Oarda de Sus",
  "Oiejdea", "Oradea", "Partos", "Periferie", "Piclisa", "Sard", "Schit",
  "Sebes", "Seusa", "Spring", "Stadion", "Teius", "Tolstoi", "Valea Popii",
  "Vint", "Vintu de Jos", "Zlatna", "Zona Stadion",
];

const suprafataOptions = [
  { value: "sub-1000", label: "Sub 1,000 m²" },
  { value: "1000-2000", label: "1,000 - 2,000 m²" },
  { value: "2000-3000", label: "2,000 - 3,000 m²" },
  { value: "3000-4000", label: "3,000 - 4,000 m²" },
  { value: "4000-5000", label: "4,000 - 5,000 m²" },
  { value: "5000-6000", label: "5,000 - 6,000 m²" },
  { value: "6000-7000", label: "6,000 - 7,000 m²" },
  { value: "7000-8000", label: "7,000 - 8,000 m²" },
  { value: "peste-8000", label: "Peste 8,000 m²" },
];

type FilterTab = "toate" | "cumparare" | "inchiriere" | "vandute";

const Hero = () => {
  const { filters, setFilter, scrollToProperties } = useSearch();
  const activeTab = filters.tab;

  const navigate = useNavigate();

  const handleTabChange = (tab: FilterTab) => {
    setFilter("tab", tab);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.tab && filters.tab !== "toate") params.set("tab", filters.tab);
    if (filters.zone) params.set("zone", filters.zone);
    if (filters.propertyType) params.set("category", filters.propertyType);
    if (filters.rooms) params.set("rooms", filters.rooms);
    if (filters.area) params.set("area", filters.area);
    if (filters.price) params.set("price", filters.price);
    if (filters.searchQuery) params.set("q", filters.searchQuery);
    const qs = params.toString();
    navigate(`/proprietati${qs ? `?${qs}` : ""}`);
  };

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "toate", label: "Toate Proprietățile" },
    { id: "cumparare", label: "Cumpărare" },
    { id: "inchiriere", label: "Închiriere" },
    { id: "vandute", label: "Vândute" },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-32 pb-20"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/90 via-foreground/70 to-foreground/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center text-background">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6 animate-fade-up">
            Agenția Imobiliară #1 în Alba Iulia
          </span>
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Găsește-ți Casa
            <span className="text-primary"> Perfectă</span>
          </h1>
          
          <p className="text-lg md:text-xl text-background/80 mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Din anul 2004 vă punem la dispoziție cele mai frumoase proprietăți imobiliare în Alba Iulia. 
            Peste 1000 de anunțuri active.
          </p>

          {/* Search Box */}
          <div 
            className="bg-background/95 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-2xl max-w-4xl mx-auto animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "flex-1 sm:flex-none px-4 md:px-6 py-2.5 rounded-lg font-medium text-sm transition-all",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search form - Row 1 */}
            <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Select value={filters.zone || "all"} onValueChange={(v) => setFilter("zone", v === "all" ? "" : v)}>
                  <SelectTrigger className="pl-10 h-12 bg-muted border-0 text-foreground">
                    <SelectValue placeholder="Zonă" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="all">Toate Zonele</SelectItem>
                    {zones.map((zone) => (
                      <SelectItem key={zone} value={zone.toLowerCase().replace(/\s+/g, "-")}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Select value={filters.propertyType || "all"} onValueChange={(v) => setFilter("propertyType", v === "all" ? "" : v)}>
                  <SelectTrigger className="pl-10 h-12 bg-muted border-0 text-foreground">
                    <SelectValue placeholder="Tip proprietate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toate Tipurile</SelectItem>
                    <SelectItem value="apartamente">Apartamente</SelectItem>
                    <SelectItem value="birouri">Birouri</SelectItem>
                    <SelectItem value="cabana">Cabană</SelectItem>
                    <SelectItem value="case">Case</SelectItem>
                    <SelectItem value="garsoniere">Garsoniere</SelectItem>
                    <SelectItem value="hale">Hale</SelectItem>
                    <SelectItem value="pensiune">Pensiune</SelectItem>
                    <SelectItem value="proiecte-rezidentiale">Proiecte Rezidențiale</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="spatii-comerciale">Spații Comerciale</SelectItem>
                    <SelectItem value="terenuri">Terenuri</SelectItem>
                    <SelectItem value="vile">Vile</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Select value={filters.rooms || "all"} onValueChange={(v) => setFilter("rooms", v === "all" ? "" : v)}>
                  <SelectTrigger className="pl-10 h-12 bg-muted border-0 text-foreground">
                    <SelectValue placeholder="Camere" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toate</SelectItem>
                    <SelectItem value="1">1 cameră</SelectItem>
                    <SelectItem value="2">2 camere</SelectItem>
                    <SelectItem value="3">3 camere</SelectItem>
                    <SelectItem value="4+">4+ camere</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search form - Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Select value={filters.area || "all"} onValueChange={(v) => setFilter("area", v === "all" ? "" : v)}>
                  <SelectTrigger className="pl-10 h-12 bg-muted border-0 text-foreground">
                    <SelectValue placeholder="Suprafață" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toate</SelectItem>
                    {suprafataOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {activeTab !== "vandute" && (
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Select value={filters.price || "all"} onValueChange={(v) => setFilter("price", v === "all" ? "" : v)}>
                    <SelectTrigger className="pl-10 h-12 bg-muted border-0 text-foreground">
                      <SelectValue placeholder="Preț" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toate Prețurile</SelectItem>
                      {activeTab === "inchiriere" ? (
                        <>
                          <SelectItem value="sub-200">Sub 200 €/lună</SelectItem>
                          <SelectItem value="200-300">200 - 300 €/lună</SelectItem>
                          <SelectItem value="300-400">300 - 400 €/lună</SelectItem>
                          <SelectItem value="400-500">400 - 500 €/lună</SelectItem>
                          <SelectItem value="500-700">500 - 700 €/lună</SelectItem>
                          <SelectItem value="700-1000">700 - 1,000 €/lună</SelectItem>
                          <SelectItem value="peste-1000">Peste 1,000 €/lună</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="sub-25000">Sub 25,000 €</SelectItem>
                          <SelectItem value="25000-50000">25,000 - 50,000 €</SelectItem>
                          <SelectItem value="50000-75000">50,000 - 75,000 €</SelectItem>
                          <SelectItem value="75000-100000">75,000 - 100,000 €</SelectItem>
                          <SelectItem value="100000-150000">100,000 - 150,000 €</SelectItem>
                          <SelectItem value="150000-200000">150,000 - 200,000 €</SelectItem>
                          <SelectItem value="200000-300000">200,000 - 300,000 €</SelectItem>
                          <SelectItem value="peste-300000">Peste 300,000 €</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className={cn(activeTab === "vandute" && "lg:col-start-3")}>
                <Button className="h-12 w-full gap-2" onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                  Caută Anunțuri
                </Button>
              </div>
            </div>
            </div>
          </div>

          {/* Stats */}
          <div 
            className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { value: "1000+", label: "Proprietăți" },
              { value: "20+", label: "Ani Experiență" },
              { value: "5000+", label: "Clienți Fericiți" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-serif text-3xl md:text-4xl font-bold text-background">{stat.value}</p>
                <p className="text-background/60 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-background/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-background/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
