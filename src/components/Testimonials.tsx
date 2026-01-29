import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Maria Popescu",
    role: "Cumpărător",
    content: "Am găsit apartamentul perfect în doar 2 săptămâni! Echipa Casa Pronto a fost extrem de profesionistă și atentă la toate cerințele noastre.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 2,
    name: "Alexandru Ionescu",
    role: "Vânzător",
    content: "Am vândut casa în timp record și la un preț excelent. Recomand cu încredere serviciile lor oricui caută o agenție de încredere.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 3,
    name: "Elena Dumitrescu",
    role: "Cumpărător",
    content: "Profesionalism desăvârșit de la prima vizionare până la semnarea actelor. Mulțumesc echipei Casa Pronto pentru tot suportul acordat!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm">Testimoniale</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2 mb-4">
            Ce Spun Clienții Noștri
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Mii de clienți fericiți au trecut prin porțile noastre. Iată ce spun despre noi.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-background rounded-xl p-8 shadow-[var(--card-shadow)] animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Quote className="h-10 w-10 text-primary/20 mb-4" />
              
              <p className="text-foreground/80 leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
