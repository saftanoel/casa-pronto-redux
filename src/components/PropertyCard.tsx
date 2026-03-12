import { MapPin, Bed, Bath, Square, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import PropertyImageCarousel from "@/components/PropertyImageCarousel";

interface PropertyCardProps {
  id: number;
  image: string;
  images?: string[];
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  area: number;
  type: "Vânzare" | "Închiriere" | "Vândut";
  isNew?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const PropertyCard = ({
  id,
  image,
  images,
  title,
  location,
  price,
  beds,
  baths,
  area,
  type,
  isNew = false,
  className,
  style,
}: PropertyCardProps) => {
  const allImages = images && images.length > 0 ? images : [image];
  return (
    <Link to={`/proprietate/${id}`} className="block">
      <article
        className={cn(
          "group bg-card rounded-xl overflow-hidden shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-300",
          className
        )}
        style={style}
      >
        {/* Image Carousel */}
        <PropertyImageCarousel images={allImages} alt={title} aspectClass="aspect-[4/3]">
          {/* Overlay badges (Stânga Sus) */}
          <div className="absolute top-4 left-4 flex gap-2 pointer-events-none z-[5]">
            <Badge
              variant={type === "Vânzare" ? "default" : type === "Închiriere" ? "secondary" : "outline"}
              className={cn(
                "text-xs font-medium",
                type === "Vândut" && "bg-foreground/80 text-background"
              )}
            >
              {type}
            </Badge>
            {isNew && (
              <Badge className="bg-accent text-accent-foreground text-xs font-medium">
                Nou
              </Badge>
            )}
          </div>

          {/* NOU: Badge-ul de Preț PREMIUM (Glassmorphism) - Jos Stânga */}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg font-bold text-sm md:text-base z-[5] pointer-events-none flex items-baseline gap-1">
            <span>{price.replace("€", "").trim()}</span>
            <span className="text-xs font-semibold">€</span>
            {type === "Închiriere" && (
              <span className="text-[10px] font-normal opacity-90 ml-0.5">/lună</span>
            )}
          </div>
        </PropertyImageCarousel>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>

          <div className="flex items-center gap-1.5 text-muted-foreground mt-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>

          {/* Features */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Bed className="h-4 w-4" />
              <span>{beds}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Bath className="h-4 w-4" />
              <span>{baths}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Square className="h-4 w-4" />
              <span>{area} mp</span>
            </div>
            <span
              className="ml-auto h-8 w-8 rounded-full hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PropertyCard;