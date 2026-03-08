import { useQuery } from "@tanstack/react-query";
import { fetchAllProperties, fetchPropertyById } from "@/lib/api/wordpress";
import type { Property } from "@/data/properties";

export function useProperties() {
  return useQuery<Property[]>({
    queryKey: ["properties"],
    queryFn: fetchAllProperties,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
