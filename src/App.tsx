import { useEffect } from "react";
import { useLocation, BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import About from "@/components/About";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import NotFound from "./pages/NotFound";
import { SearchProvider } from "@/context/SearchContext";
import { useProperties, useAllProperties } from "@/hooks/useProperties";

const queryClient = new QueryClient();

const Index = () => {
  const location = useLocation();
  const { data: initialProperties = [], isLoading } = useProperties();
  const { data: allPropertiesFull } = useAllProperties();
  const properties = allPropertiesFull ?? initialProperties;

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        (window as any).__PRERENDER_READY_FIRED = true;
        document.dispatchEvent(new Event('prerender-ready'));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

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
      <Helmet>
        <title>Casa Pronto | Agenție Imobiliară Alba Iulia</title>
        <meta name="description" content="Agenția Imobiliară Casa Pronto din Alba Iulia. Găsește cele mai noi oferte de apartamente, case, terenuri și spații comerciale." />
        <link rel="canonical" href="https://casapronto.ro/" />
        <meta property="og:title" content="Casa Pronto | Agenție Imobiliară Alba Iulia" />
        <meta property="og:description" content="Agenția Imobiliară Casa Pronto din Alba Iulia. Găsește cele mai noi oferte de apartamente, case, terenuri și spații comerciale." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://casapronto.ro/" />
      </Helmet>
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

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
            <Routes>
            <Route path="/" element={<Index />} />
            {/* --- 1. CATEGORII PRINCIPALE (Top 8 din baza ta) --- */}
            <Route path="/apartamente" element={<PropertiesPage category="apartamente" />} />
            <Route path="/case" element={<PropertiesPage category="case" />} />
            <Route path="/terenuri" element={<PropertiesPage category="terenuri" />} />
            <Route path="/spatii-comerciale" element={<PropertiesPage category="spatii-comerciale" />} />
            <Route path="/garsoniere" element={<PropertiesPage category="garsoniere" />} />
            <Route path="/hale" element={<PropertiesPage category="hale" />} />
            <Route path="/birouri" element={<PropertiesPage category="birouri" />} />
            <Route path="/vile" element={<PropertiesPage category="vile" />} />

            {/* --- 2. APARTAMENTE & GARSONIERE PE ZONE (Top zone Alba Iulia) --- */}
            <Route path="/apartamente-cetate" element={<PropertiesPage category="apartamente" zone="cetate" />} />
            <Route path="/apartamente-centru" element={<PropertiesPage category="apartamente" zone="centru" />} />
            <Route path="/apartamente-ampoi" element={<PropertiesPage category="apartamente" zone="ampoi" />} />
            <Route path="/apartamente-alba-micesti" element={<PropertiesPage category="apartamente" zone="alba-micesti" />} />
            <Route path="/garsoniere-cetate" element={<PropertiesPage category="garsoniere" zone="cetate" />} />
            <Route path="/garsoniere-centru" element={<PropertiesPage category="garsoniere" zone="centru" />} />

            {/* --- 3. CASE PE ZONE --- */}
            <Route path="/case-cetate" element={<PropertiesPage category="case" zone="cetate" />} />
            <Route path="/case-centru" element={<PropertiesPage category="case" zone="centru" />} />
            <Route path="/case-alba-micesti" element={<PropertiesPage category="case" zone="alba-micesti" />} />
            <Route path="/case-micesti" element={<PropertiesPage category="case" zone="micesti" />} />
            <Route path="/case-ciugud" element={<PropertiesPage category="case" zone="ciugud" />} />
            <Route path="/case-barabant" element={<PropertiesPage category="case" zone="barabant" />} />
            <Route path="/case-oarda" element={<PropertiesPage category="case" zone="oarda" />} />
            <Route path="/case-cugir" element={<PropertiesPage category="case" zone="cugir" />} />

            {/* --- 4. TERENURI PE ZONE --- */}
            <Route path="/terenuri-cetate" element={<PropertiesPage category="terenuri" zone="cetate" />} />
            <Route path="/terenuri-centru" element={<PropertiesPage category="terenuri" zone="centru" />} />
            <Route path="/terenuri-alba-micesti" element={<PropertiesPage category="terenuri" zone="alba-micesti" />} />
            <Route path="/terenuri-micesti" element={<PropertiesPage category="terenuri" zone="micesti" />} />
            <Route path="/terenuri-ciugud" element={<PropertiesPage category="terenuri" zone="ciugud" />} />
            <Route path="/terenuri-oarda" element={<PropertiesPage category="terenuri" zone="oarda" />} />

            {/* --- 5. SPAȚII COMERCIALE & HALE --- */}
            <Route path="/spatii-comerciale-cetate" element={<PropertiesPage category="spatii-comerciale" zone="cetate" />} />
            <Route path="/spatii-comerciale-centru" element={<PropertiesPage category="spatii-comerciale" zone="centru" />} />
            <Route path="/hale-cetate" element={<PropertiesPage category="hale" zone="cetate" />} />
            <Route path="/hale-centru" element={<PropertiesPage category="hale" zone="centru" />} />

            {/* Rute Standard / Fallback */}
            <Route path="/proprietati" element={<PropertiesPage />} />
            <Route path="/proprietate/:id" element={<PropertyDetailPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;