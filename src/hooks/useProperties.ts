import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchAllProperties, fetchPropertyById, fetchPropertiesPaginated } from "@/lib/api/wordpress";
import type { Property } from "@/data/properties";

export function useProperties() {
  return useQuery<Property[]>({
    queryKey: ["properties"],
    queryFn: fetchAllProperties,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useInfiniteProperties(perPage = 12) {
  return useInfiniteQuery({
    queryKey: ["properties-infinite", perPage],
    queryFn: ({ pageParam = 1 }) => fetchPropertiesPaginated(pageParam, perPage),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPageParam < lastPage.totalPages) return lastPageParam + 1;
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useProperty(id: number | undefined) {
  return useQuery<Property | null>({
    queryKey: ["property", id],
    queryFn: () => (id ? fetchPropertyById(id) : Promise.resolve(null)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
