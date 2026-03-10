import { ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const links = {
    contact: {
      address: "Alba Iulia, Calea Moților, Nr 59C",
      phone: "0740197476",
      email: "casa_pronto@yahoo.com",
    },
    propertyTypes: [
      { label: "Apartamente", category: "apartamente" },
      { label: "Case", category: "case" },
      { label: "Terenuri", category: "terenuri" },
      { label: "Spații Comerciale", category: "spatii-comerciale" },
      { label: "Garsoniere", category: "garsoniere" },
      { label: "Vile", category: "vile" },
      { label: "Proiecte Rezidențiale", category: "proiecte-rezidentiale" },
    ],
  };


  return (
    <footer className="bg-foreground text-background">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-5">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-2 text-background/70">
                <span>📍</span>
                <span>{links.contact.address}</span>
              </li>
              <li>
                <a href={`tel:${links.contact.phone}`} className="flex items-start gap-2 text-background/70 hover:text-primary transition-colors">
                  <span>📞</span>
                  <span>{links.contact.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${links.contact.email}`} className="flex items-start gap-2 text-background/70 hover:text-primary transition-colors">
                  <span>✉️</span>
                  <span>{links.contact.email}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Cine suntem */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-5">Cine suntem ?</h4>
            <p className="text-background/70 text-sm leading-relaxed">
              Casa Pronto, o agentie imobiliara din Alba Iulia lansata pe piata imobiliara in anul 2004, si-a prefigurat cu fermitate inca de la inceput standardele de inalta clasa pentru calitatea serviciilor si produselor oferite.
            </p>
          </div>

          {/* De ce noi */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-5">De ce noi ?</h4>
            <p className="text-background/70 text-sm leading-relaxed">
              Experienta in domeniul imobiliar si partenerii de incredere ai agentiei fac din serviciile noastre oferta ideala pentru satisfacerea cererilor dumneavoastra.
            </p>
          </div>

          {/* Tipuri de proprietati */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-5">Tipuri de proprietati</h4>
            <ul className="space-y-2.5">
              {links.propertyTypes.map((link) => (
                <li key={link.label}>
                  <Link
                    to={`/proprietati?category=${link.category}`}
                    className="text-background/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-background/50 text-sm text-center sm:text-left">
            © 2024 Casa Pronto Imobiliare. Toate drepturile rezervate.
          </p>
          
        </div>
      </div>

      {/* Scroll to top */}
      <Button
        onClick={scrollToTop}
        variant="default"
        size="icon"
        className="fixed bottom-6 right-6 rounded-full shadow-lg z-40"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </footer>
  );
};

export default Footer;
