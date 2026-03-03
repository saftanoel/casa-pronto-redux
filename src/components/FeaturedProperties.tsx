import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "./PropertyCard";
import { useSearch } from "@/context/SearchContext";

const FeaturedProperties = () => {
  const { filteredProperties, scrollToProperties, filters, setFilter } = useSearch();

  const hasActiveFilters = filters.searchQuery || filters.zone || filters.propertyType || filters.rooms || filters.area || filters.price || filters.tab !== "toate";

  const handleViewAll = () => {
    // Reset filters to show all, then scroll
    setFilter("tab", "toate");
    setFilter("searchQuery", "");
    setFilter("zone", "");
    setFilter("propertyType", "");
    setFilter("rooms", "");
    setFilter("area", "");
    setFilter("price", "");
    setTimeout(() => {
      scrollToProperties();
    }, 50);
  };

  return (
    <section id="properties" className="py-20 md:py-28 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-primary font-medium text-sm">Proprietăți Recomandate</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2">
              {hasActiveFilters ? "Rezultate Căutare" : "Descoperă Cele Mai Bune Oferte"}
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg">
              {hasActiveFilters
                ? `${filteredProperties.length} proprietăți găsite`
                : "Selecție de proprietăți premium din Alba Iulia, alese cu grijă pentru tine."}
            </p>
          </div>
        </div>

        {/* Properties grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProperties.map((property, index) => (
              <PropertyCard
                key={property.id}
                {...property}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` } as React.CSSProperties}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Nu s-au găsit proprietăți cu filtrele selectate.</p>
            <Button variant="outline" className="mt-4" onClick={handleViewAll}>
              Resetează Filtrele
            </Button>
          </div>
        )}

        {/* View all button */}
        {hasActiveFilters && filteredProperties.length > 0 && (
          <div className="flex justify-center mt-12">
            <Button variant="outline" size="lg" className="gap-2 group" onClick={handleViewAll}>
              Vezi Toate Proprietățile
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
        {!hasActiveFilters && (
          <div className="flex justify-center mt-12">
            <Button variant="outline" size="lg" className="gap-2 group" onClick={handleViewAll}>
              Vezi Toate Proprietățile
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
