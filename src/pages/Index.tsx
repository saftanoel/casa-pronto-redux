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

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [location]);

  return (
    <SearchProvider>
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
