import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  images: string[];
  title: string;
  type: string;
  isNew?: boolean;
}

const PropertyGallery = ({ images, title, type, isNew }: PropertyGalleryProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, skipSnaps: false });
  const [activeIndex, setActiveIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  // Reset to first slide when images change (new property)
  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(0, true);
      setActiveIndex(0);
    }
  }, [images, emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  return (
    <div className="rounded-xl overflow-hidden bg-muted mb-6">
      {/* Main carousel */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative aspect-[16/10] md:aspect-[16/9] flex-[0_0_100%] min-w-0"
              >
                <img
                  src={img}
                  alt={`${title} - ${i + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Arrow buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge
            variant={type === "Vânzare" ? "default" : type === "Închiriere" ? "secondary" : "outline"}
            className={cn("text-xs", type === "Vândut" && "bg-foreground/80 text-background")}
          >
            {type}
          </Badge>
          {isNew && <Badge className="bg-accent text-accent-foreground text-xs">Nou</Badge>}
        </div>

        {/* Pagination indicator (mobile/tablet) */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-foreground/60 backdrop-blur-sm text-background text-xs font-medium px-3 py-1.5 rounded-full lg:hidden">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails (desktop) + dots (mobile/tablet) */}
      {images.length > 1 && (
        <>
          {/* Desktop thumbnails */}
          <div className="hidden lg:flex gap-2 p-3 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={cn(
                  "w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all",
                  activeIndex === i ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Mobile/tablet dots */}
          <div className="flex lg:hidden justify-center gap-1.5 py-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={cn(
                  "rounded-full transition-all duration-200",
                  activeIndex === i
                    ? "w-6 h-2 bg-primary"
                    : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyGallery;
