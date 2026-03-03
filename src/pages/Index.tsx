import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import About from "@/components/About";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { SearchProvider } from "@/context/SearchContext";

const Index = () => {
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
