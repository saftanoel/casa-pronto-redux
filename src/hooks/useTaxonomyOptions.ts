import { useMemo } from "react";
import { type Property } from "@/data/properties";

export interface TaxonomyOption {
  value: string;
  label: string;
}

function toSlug(input: any): string {
  if (!input) return "";
  const str = typeof input === "string" ? input : (input?.name || "");
  return str
    .toLowerCase()
    .replace(/ă/g, "a").replace(/â/g, "a").replace(/î/g, "i")
    .replace(/ș/g, "s").replace(/ț/g, "t")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function extractUnique(properties: Property[], key: "property_type" | "property_status" | "property_city"): TaxonomyOption[] {
  const seen = new Map<string, string>();
  for (const p of properties) {
    const terms = p.taxonomies?.[key] ?? [];
    for (const term of terms) {
      const slug = toSlug(term);
      const name = typeof term === "string" ? term : (term?.name || "");
      if (!seen.has(slug) && name) {
        seen.set(slug, name);
      }
    }
  }
  return Array.from(seen.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label, "ro"));
}

export function useTaxonomyOptions(properties: Property[]) {
  const zones = useMemo(() => extractUnique(properties, "property_city"), [properties]);
  const propertyTypes = useMemo(() => extractUnique(properties, "property_type"), [properties]);
  const statuses = useMemo(() => extractUnique(properties, "property_status"), [properties]);
  return { zones, propertyTypes, statuses };
}

/** Check if a property matches a taxonomy filter */
export function matchesTaxonomy(
  property: Property,
  key: "property_type" | "property_status" | "property_city",
  filterValue: string
): boolean {
  if (!filterValue) return true;
  const terms = property.taxonomies?.[key] ?? [];
  return terms.some((t) => toSlug(t) === filterValue);
}
