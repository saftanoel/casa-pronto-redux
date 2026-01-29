import { Home, Key, FileText, TrendingUp, Handshake, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: Home,
    title: "Vânzare Proprietăți",
    description: "Vă ajutăm să vindeți rapid și la cel mai bun preț posibil. Marketing profesional inclus.",
  },
  {
    icon: Key,
    title: "Cumpărare Proprietăți",
    description: "Găsim pentru dumneavoastră casa visurilor, potrivită bugetului și nevoilor.",
  },
  {
    icon: FileText,
    title: "Închirieri",
    description: "Servicii complete de închiriere pentru proprietari și chiriași.",
  },
  {
    icon: TrendingUp,
    title: "Evaluare Imobiliară",
    description: "Evaluăm gratuit proprietatea dumneavoastră cu acuratețe profesională.",
  },
  {
    icon: Handshake,
    title: "Consultanță",
    description: "Consultanță specializată în tranzacții imobiliare și investiții.",
  },
  {
    icon: Shield,
    title: "Asistență Juridică",
    description: "Suport legal complet pentru toate documentele necesare.",
  },
];

const Services = () => {
  return (
    <section className="py-20 md:py-28 bg-foreground text-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm">Serviciile Noastre</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2 mb-4">
            Cum Vă Putem Ajuta?
          </h2>
          <p className="text-background/60 max-w-2xl mx-auto">
            Oferim o gamă completă de servicii imobiliare pentru a vă transforma 
            visurile în realitate.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={cn(
                "group p-8 rounded-xl border border-background/10 hover:border-primary/50 bg-background/5 hover:bg-primary/10 transition-all duration-300",
                "animate-fade-up"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <service.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              
              <h3 className="font-serif text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-background/60 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
