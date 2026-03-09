import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PropertyCard from "./PropertyCard";
import { useSearch } from "@/context/SearchContext";
import { PropertyGridSkeletons } from "./PropertyCardSkeleton";

const FeaturedProperties = () => {
  const { allProperties, isLoading } = useSearch();
  const displayProperties = [...allProperties]
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    .slice(0, 6);

  return (
    <section id="properties" className="py-20 md:py-28 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-primary font-medium text-sm">Proprietăți Recomandate</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2">
              Descoperă Cele Mai Bune Oferte
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg">
              Selecție de proprietăți premium din Alba Iulia, alese cu grijă pentru tine.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <PropertyGridSkeletons count={6} />
          </div>
        ) : displayProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {displayProperties.map((property, index) => (
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
          </div>
        )}

        <div className="flex justify-center mt-12">
          <Button variant="outline" size="lg" className="gap-2 group" asChild>
            <Link to="/proprietati">
              Vezi Toate Proprietățile
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
