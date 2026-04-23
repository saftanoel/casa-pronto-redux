
export interface PropertyTaxonomies {
  property_type: string[];
  property_status: string[];
  property_city: string[];
}

export interface Property {
  id: number;
  image: string;
  images: string[];
  title: string;
  description: string;
  location: string;
  zone: string;
  price: string;
  priceValue: number;
  beds: number;
  baths: number;
  area: number;
  type: "Vânzare" | "Închiriere" | "Vândut";
  propertyType: string;
  isNew: boolean;
  features: string[];
  agent: string;
  date?: string;
  taxonomies?: PropertyTaxonomies;
}

