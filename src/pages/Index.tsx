import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import About from "@/components/About";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { SearchProvider } from "@/context/SearchContext";
import { useProperties, useAllProperties } from "@/hooks/useProperties";

const Index = () => {
  const location = useLocation();
  const { data: initialProperties = [], isLoading } = useProperties();
  // Also load all properties in background so Hero dropdowns populate from real taxonomy data
  const { data: allPropertiesFull } = useAllProperties();

  // Use full dataset when available, otherwise initial 60
  const properties = allPropertiesFull ?? initialProperties;

  // --- NOU: Setăm titlul paginii ---
  useEffect(() => {
    document.title = "Casa Pronto | Agenție Imobiliară Alba Iulia";
  }, []);

  // --- VECHI: Scroll la secțiuni ---
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [location]);

  return (
    <SearchProvider properties={properties} isLoading={isLoading}>
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <FeaturedProperties />
          <About />
          <Services />
          <Contact />
        </main>
        <Footer />
      </div>
    </SearchProvider>
  );
};

export default Index;