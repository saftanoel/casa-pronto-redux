import { CheckCircle, Award, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Award,
    title: "Experiență de 20+ Ani",
    description: "Din 2004 suntem partenerul de încredere pentru tranzacții imobiliare în Alba Iulia.",
  },
  {
    icon: Users,
    title: "Echipă Profesionistă",
    description: "Agenți imobiliari certificați, dedicați să vă găsească proprietatea perfectă.",
  },
  {
    icon: TrendingUp,
    title: "Cele Mai Bune Prețuri",
    description: "Negociem pentru dumneavoastră cele mai avantajoase condiții de pe piață.",
  },
];

const checkpoints = [
  "Evaluare gratuită a proprietății",
  "Consultanță juridică specializată",
  "Fotografii profesionale incluse",
  "Marketing digital avansat",
  "Vizionări personalizate",
  "Suport complet până la notariat",
];

const About = () => {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left side - Image composition */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
                alt="Modern real estate office"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Stats card */}
            <div className="absolute -bottom-8 -right-4 md:right-8 bg-primary text-primary-foreground p-6 rounded-xl shadow-[var(--primary-glow)]">
              <p className="font-serif text-4xl font-bold">5000+</p>
              <p className="text-primary-foreground/80 text-sm mt-1">Clienți Mulțumiți</p>
            </div>

            {/* Decorative element */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent rounded-xl -z-10" />
          </div>

          {/* Right side - Content */}
          <div>
            <span className="text-primary font-medium text-sm">Despre Noi</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2 mb-6">
              Agenția Imobiliară{" "}
              <span className="text-primary">Casa Pronto</span>
            </h2>
            
            <p className="text-muted-foreground leading-relaxed mb-8">
              Suntem o agenție imobiliară de încredere din Alba Iulia, cu o experiență 
              de peste 20 de ani pe piața locală. Ne dedicăm să vă ajutăm să găsiți 
              proprietatea visurilor dumneavoastră sau să vindeți rapid și la cel mai 
              bun preț.
            </p>

            {/* Features */}
            <div className="space-y-6 mb-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {checkpoints.map((point) => (
                <div key={point} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <Button size="lg">Află Mai Multe</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
