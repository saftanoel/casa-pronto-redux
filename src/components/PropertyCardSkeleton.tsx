import { Skeleton } from "@/components/ui/skeleton";

export const PropertyCardSkeleton = () => (
  <div className="bg-card rounded-xl overflow-hidden shadow-[var(--card-shadow)] border border-border">
    <Skeleton className="aspect-[4/3] w-full rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center gap-4 pt-3 border-t border-border">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  </div>
);

export const PropertyRowSkeleton = () => (
  <div className="bg-card rounded-xl overflow-hidden shadow-[var(--card-shadow)] border border-border flex flex-col md:flex-row">
    <Skeleton className="md:w-80 flex-shrink-0 aspect-[4/3] md:aspect-auto md:min-h-[200px] rounded-none" />
    <div className="flex-1 p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="flex items-center gap-5 pt-4 border-t border-border">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-6 w-24 ml-auto" />
      </div>
    </div>
  </div>
);

export const PropertyGridSkeletons = ({ count = 6 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <PropertyCardSkeleton key={i} />
    ))}
  </>
);

export const PropertyRowSkeletons = ({ count = 4 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <PropertyRowSkeleton key={i} />
    ))}
  </>
);
