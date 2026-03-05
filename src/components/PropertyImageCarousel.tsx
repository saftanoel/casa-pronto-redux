import { useState, useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  aspectClass?: string;
  children?: React.ReactNode; // For overlaying badges, price, etc.
}

const PropertyImageCarousel = ({
  images,
  alt,
  className,
  aspectClass = "aspect-[4/3]",
  children,
}: PropertyImageCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, skipSnaps: false });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const scrollPrev = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    emblaApi?.scrollNext();
  }, [emblaApi]);

  if (images.length <= 1) {
    return (
      <div className={cn("relative overflow-hidden", aspectClass, className)}>
        <img src={images[0]} alt={alt} className="w-full h-full object-cover" />
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden group/carousel", aspectClass, className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((img, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0 h-full">
              <img
                src={img}
                alt={`${alt} - ${i + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows - visible on hover (desktop) */}
      <button
        onClick={scrollPrev}
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-200 hover:bg-background z-10",
          isHovered ? "opacity-100" : "opacity-0 md:opacity-0"
        )}
        aria-label="Previous image"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={scrollNext}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-200 hover:bg-background z-10",
          isHovered ? "opacity-100" : "opacity-0 md:opacity-0"
        )}
        aria-label="Next image"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
        {images.map((_, i) => (
          <span
            key={i}
            className={cn(
              "rounded-full transition-all duration-200",
              activeIndex === i
                ? "w-4 h-1.5 bg-background"
                : "w-1.5 h-1.5 bg-background/50"
            )}
          />
        ))}
      </div>

      {children}
    </div>
  );
};

export default PropertyImageCarousel;
