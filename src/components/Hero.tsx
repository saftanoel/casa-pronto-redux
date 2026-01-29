import { Search, MapPin, Home, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-32 pb-20"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/90 via-foreground/70 to-foreground/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-background">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6 animate-fade-up">
            Agenția Imobiliară #1 în Alba Iulia
          </span>
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Găsește-ți Casa
            <span className="text-primary"> Perfectă</span>
          </h1>
          
          <p className="text-lg md:text-xl text-background/80 mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Din anul 2004 vă punem la dispoziție cele mai frumoase proprietăți imobiliare în Alba Iulia. 
            Peste 1000 de anunțuri active.
          </p>

          {/* Search Box */}
          <div 
            className="bg-background/95 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-2xl max-w-3xl mx-auto animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition-all">
                Cumpărare
              </button>
              <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-muted text-foreground font-medium text-sm hover:bg-muted/80 transition-all">
                Închiriere
              </button>
            </div>

            {/* Search form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Select>
                  <SelectTrigger className="pl-10 h-12 bg-muted border-0 text-foreground">
                    <SelectValue placeholder="Zonă" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="centru">Centru</SelectItem>
                    <SelectItem value="ampoi">Ampoi</SelectItem>
                    <SelectItem value="cetate">Cetate</SelectItem>
                    <SelectItem value="partos">Partoș</SelectItem>
                    <SelectItem value="stadion">Zona Stadion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Select>
                  <SelectTrigger className="pl-10 h-12 bg-muted border-0 text-foreground">
                    <SelectValue placeholder="Tip proprietate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartament">Apartament</SelectItem>
                    <SelectItem value="casa">Casă</SelectItem>
                    <SelectItem value="garsoniera">Garsonieră</SelectItem>
                    <SelectItem value="vila">Vilă</SelectItem>
                    <SelectItem value="teren">Teren</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Select>
                  <SelectTrigger className="pl-10 h-12 bg-muted border-0 text-foreground">
                    <SelectValue placeholder="Camere" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 cameră</SelectItem>
                    <SelectItem value="2">2 camere</SelectItem>
                    <SelectItem value="3">3 camere</SelectItem>
                    <SelectItem value="4+">4+ camere</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="h-12 gap-2">
                <Search className="h-4 w-4" />
                Caută
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div 
            className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { value: "1000+", label: "Proprietăți" },
              { value: "20+", label: "Ani Experiență" },
              { value: "5000+", label: "Clienți Fericiți" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-serif text-3xl md:text-4xl font-bold text-background">{stat.value}</p>
                <p className="text-background/60 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-background/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-background/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
