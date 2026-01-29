import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "./PropertyCard";
import { cn } from "@/lib/utils";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

const properties = [
  {
    id: 1,
    image: property1,
    title: "Apartament Modern cu 3 Camere",
    location: "Centru, Alba Iulia",
    price: "89.000 €",
    beds: 3,
    baths: 2,
    area: 85,
    type: "Vânzare" as const,
    isNew: true,
  },
  {
    id: 2,
    image: property2,
    title: "Apartament Lux cu Bucătărie Open Space",
    location: "Cetate, Alba Iulia",
    price: "120.000 €",
    beds: 2,
    baths: 1,
    area: 65,
    type: "Vânzare" as const,
    isNew: false,
  },
  {
    id: 3,
    image: property3,
    title: "Casă Familială cu Grădină",
    location: "Ampoi, Alba Iulia",
    price: "175.000 €",
    beds: 4,
    baths: 2,
    area: 180,
    type: "Vânzare" as const,
    isNew: true,
  },
  {
    id: 4,
    image: property4,
    title: "Penthouse cu Vedere Panoramică",
    location: "Centru, Alba Iulia",
    price: "1.200 €",
    beds: 3,
    baths: 2,
    area: 120,
    type: "Închiriere" as const,
    isNew: false,
  },
  {
    id: 5,
    image: property5,
    title: "Garsonieră Modernă",
    location: "Partoș, Alba Iulia",
    price: "45.000 €",
    beds: 1,
    baths: 1,
    area: 38,
    type: "Vânzare" as const,
    isNew: false,
  },
  {
    id: 6,
    image: property6,
    title: "Spațiu Comercial Premium",
    location: "Centru, Alba Iulia",
    price: "2.500 €",
    beds: 0,
    baths: 2,
    area: 250,
    type: "Închiriere" as const,
    isNew: true,
  },
];

const categories = ["Toate", "Apartamente", "Case", "Garsoniere", "Comercial"];

const FeaturedProperties = () => {
  const [activeCategory, setActiveCategory] = useState("Toate");

  return (
    <section id="properties" className="py-20 md:py-28 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Header */}
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

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground hover:bg-muted"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Properties grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {properties.map((property, index) => (
            <PropertyCard
              key={property.id}
              {...property}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` } as React.CSSProperties}
            />
          ))}
        </div>

        {/* View all button */}
        <div className="flex justify-center mt-12">
          <Button variant="outline" size="lg" className="gap-2 group">
            Vezi Toate Proprietățile
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
