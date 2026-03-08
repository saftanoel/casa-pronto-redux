import { useMemo, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { ChevronRight, MapPin, Bed, Bath, Square, Phone, Mail, Share2, ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import PropertyGallery from "@/components/PropertyGallery";
import { SearchProvider } from "@/context/SearchContext";
import { useProperty, useProperties } from "@/hooks/useProperties";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const isMobile = useIsMobile();
  const backToPropertiesUrl = `/proprietati${location.search}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const propertyId = Number(id);
  const { data: property, isLoading } = useProperty(propertyId);
  const { data: allProps = [] } = useProperties();

  const similarProperties = useMemo(() => {
    if (!property) return [];
    return allProps
      .filter((p) => p.id !== property.id && (p.propertyType === property.propertyType || p.type === property.type))
      .slice(0, 3);
  }, [property, allProps]);

  if (!property) {
    return (
      <SearchProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center pt-32">
            <div className="text-center">
              <h1 className="font-serif text-3xl font-bold mb-4">Proprietatea nu a fost găsită</h1>
              <p className="text-muted-foreground mb-6">Anunțul pe care îl cauți nu există sau a fost eliminat.</p>
              <Button asChild>
                <Link to={backToPropertiesUrl}>Înapoi la Proprietăți</Link>
              </Button>
            </div>
          </div>
          <Footer />
        </div>
      </SearchProvider>
    );
  }

  const getCategoryLabel = () => {
    const map: Record<string, string> = {
      apartamente: "Apartamente",
      case: "Case",
      garsoniere: "Garsoniere",
      terenuri: "Terenuri",
      vile: "Vile",
      birouri: "Birouri",
      "spatii-comerciale": "Spații Comerciale",
    };
    return map[property.propertyType] || property.propertyType;
  };

  return (
    <SearchProvider>
      <div className="min-h-screen flex flex-col">
        <Header />

        {/* Page Header */}
        <div className="bg-muted/50 pt-36 pb-6 border-b border-border">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-2xl md:text-3xl font-bold">{property.location.split(",")[0]}</h1>
            <nav className="flex items-center gap-2 mt-2 text-sm text-muted-foreground flex-wrap">
              <Link to="/" className="hover:text-primary transition-colors">Casa Pronto</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link to="/proprietati" className="hover:text-primary transition-colors">Anunțuri Imobiliare</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link to={`/proprietati?category=${property.propertyType}`} className="hover:text-primary transition-colors">{getCategoryLabel()}</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-foreground line-clamp-1">{property.title}</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-background py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left - Main Content */}
              <div className="flex-1 min-w-0">
                {/* Image Gallery */}
                <div className="relative">
                  <PropertyGallery
                    images={property.images}
                    title={property.title}
                    type={property.type}
                    isNew={property.isNew}
                  />
                  {/* Mobile share button overlaying gallery */}
                  <button
                    className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-md lg:hidden"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: property.title,
                          text: `${property.title} - ${property.price}`,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        import("sonner").then(({ toast }) => {
                          toast.success("Link copiat în clipboard!");
                        });
                      }
                    }}
                    aria-label="Distribuie"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Property Details Card */}
                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 overflow-x-auto scrollbar-hide -mx-6 px-6">
                    <span className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground">Categorie</span>
                      <Link to={`/proprietati?category=${property.propertyType}`} className="text-primary hover:underline">{getCategoryLabel()}</Link>
                    </span>
                    <span>•</span>
                    <span><span className="font-medium text-foreground">ID anunț:</span> {10000 + property.id}</span>
                    <span>•</span>
                    <span><span className="font-medium text-foreground">Zonă</span> {property.location.split(",")[0]}</span>
                    <span>•</span>
                    <span><span className="font-medium text-foreground">Suprafață</span> {property.area} m²</span>
                    {property.beds > 0 && (
                      <>
                        <span>•</span>
                        <span><span className="font-medium text-foreground">Camere</span> {property.beds}</span>
                      </>
                    )}
                    <span>•</span>
                    <span><span className="font-medium text-foreground">Băi</span> {property.baths}</span>
                  </div>
                </div>

                {/* Title + Price + Description */}
                <div className="mb-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground leading-tight">
                      {property.title}
                    </h2>
                    <div className="flex-shrink-0">
                      <p className="text-2xl md:text-3xl font-bold text-primary">
                        {property.price}
                        {property.type === "Închiriere" && <span className="text-base font-normal text-muted-foreground">/lună</span>}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    {property.description.split("\n").map((line, i) => (
                      <p key={i} className={cn(line.startsWith("-") ? "pl-4" : "")}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Features */}
                {property.features.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-serif text-lg font-semibold mb-4">Caracteristici</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {property.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm bg-muted rounded-lg px-3 py-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-muted rounded-xl p-4 text-center">
                    <Square className="h-5 w-5 mx-auto mb-2 text-primary" />
                    <p className="font-bold text-lg">{property.area} m²</p>
                    <p className="text-xs text-muted-foreground">Suprafață</p>
                  </div>
                  {property.beds > 0 && (
                    <div className="bg-muted rounded-xl p-4 text-center">
                      <Bed className="h-5 w-5 mx-auto mb-2 text-primary" />
                      <p className="font-bold text-lg">{property.beds}</p>
                      <p className="text-xs text-muted-foreground">Camere</p>
                    </div>
                  )}
                  <div className="bg-muted rounded-xl p-4 text-center">
                    <Bath className="h-5 w-5 mx-auto mb-2 text-primary" />
                    <p className="font-bold text-lg">{property.baths}</p>
                    <p className="text-xs text-muted-foreground">Băi</p>
                  </div>
                  <div className="bg-muted rounded-xl p-4 text-center">
                    <MapPin className="h-5 w-5 mx-auto mb-2 text-primary" />
                    <p className="font-bold text-sm">{property.location.split(",")[0]}</p>
                    <p className="text-xs text-muted-foreground">Zonă</p>
                  </div>
                </div>

                {/* Contact Agent */}
                <div className="bg-card rounded-xl border border-border p-6 mb-8">
                  <h3 className="font-serif text-lg font-semibold mb-1">Contact</h3>
                  <p className="text-muted-foreground text-sm mb-4">{property.agent}</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="gap-2 flex-1" asChild>
                      <a href="tel:0740197476">
                        <Phone className="h-4 w-4" />
                        Sună Acum
                      </a>
                    </Button>
                    <Button variant="outline" className="gap-2 flex-1" asChild>
                      <a href="mailto:casa_pronto@yahoo.com">
                        <Mail className="h-4 w-4" />
                        Trimite Email
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Similar Properties */}
                {similarProperties.length > 0 && (
                  <div>
                    <h3 className="font-serif text-xl font-semibold mb-6">Proprietăți Asemănătoare</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {similarProperties.map((p) => (
                        <PropertyCard key={p.id} {...p} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
                {/* Actions - hidden on mobile, share is on gallery */}
                <div className="hidden lg:block bg-card rounded-xl p-5 shadow-[var(--card-shadow)] border border-border">
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: property.title,
                          text: `${property.title} - ${property.price}`,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        import("sonner").then(({ toast }) => {
                          toast.success("Link copiat în clipboard!");
                        });
                      }
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                    Distribuie
                  </Button>
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

                {/* Back button */}
                <Button variant="outline" className="w-full gap-2" asChild>
                  <Link to={backToPropertiesUrl}>
                    <ArrowLeft className="h-4 w-4" />
                    Înapoi la Proprietăți
                  </Link>
                </Button>
              </aside>
            </div>
          </div>
        </div>

        <Footer />

        {/* Mobile Sticky Contact Bar */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border shadow-[0_-4px_20px_-4px_hsl(0_0%_0%/0.1)] p-3 flex gap-3 md:hidden">
            <Button className="flex-1 gap-2 h-12 text-base" asChild>
              <a href="tel:0740197476">
                <Phone className="h-5 w-5" />
                Sună Acum
              </a>
            </Button>
            <Button variant="outline" className="flex-1 gap-2 h-12 text-base border-primary/30 text-primary hover:bg-accent" asChild>
              <a href="mailto:casa_pronto@yahoo.com">
                <Mail className="h-5 w-5" />
                Email
              </a>
            </Button>
          </div>
        )}

        {/* Spacer for sticky bar on mobile */}
        {isMobile && <div className="h-[72px] md:hidden" />}
      </div>
    </SearchProvider>
  );
};

export default PropertyDetailPage;
