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
      { label: "Apartamente", href: "/apartamente" },
      { label: "Case", href: "/case" },
      { label: "Terenuri", href: "/terenuri" },
      { label: "Spații Comerciale", href: "/spatii-comerciale" },
      { label: "Garsoniere", href: "/garsoniere" },
      { label: "Vile", href: "/vile" },
      { label: "Hale", href: "/hale" },
      { label: "Birouri", href: "/birouri" },
    ],
    popularSearches: [
      { label: "Apartamente Alba Micesti", href: "/apartamente-alba-micesti" },
      { label: "Apartamente Cetate", href: "/apartamente-cetate" },
      { label: "Case Alba Micesti", href: "/case-alba-micesti" },
      { label: "Case Cetate", href: "/case-cetate" },
      { label: "Terenuri Micesti", href: "/terenuri-micesti" },
      { label: "Garsoniere Centru", href: "/garsoniere-centru" },
    ]
  };


  return (
    <footer className="bg-foreground text-background">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 xl:gap-8">
          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-1.5 text-background/70">
                <span>📍</span>
                <span>{links.contact.address}</span>
              </li>
              <li>
                <a href={`tel:${links.contact.phone}`} className="flex items-start gap-1.5 text-background/70 hover:text-primary transition-colors">
                  <span>📞</span>
                  <span>{links.contact.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${links.contact.email}`} className="flex items-start gap-1.5 text-background/70 hover:text-primary transition-colors">
                  <span>✉️</span>
                  <span>{links.contact.email}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Cine suntem */}
          <div>
            <h4 className="font-serif font-semibold text-sm mb-4">Cine suntem ?</h4>
            <p className="text-background/70 text-xs leading-relaxed">
              Casa Pronto, o agentie imobiliara din Alba Iulia lansata pe piata imobiliara in anul 2004, si-a prefigurat cu fermitate inca de la inceput standardele de inalta clasa pentru calitatea serviciilor si produselor oferite.
            </p>
          </div>

          {/* De ce noi */}
          <div>
            <h4 className="font-serif font-semibold text-sm mb-4">De ce noi ?</h4>
            <p className="text-background/70 text-xs leading-relaxed">
              Experienta in domeniul imobiliar si partenerii de incredere ai agentiei fac din serviciile noastre oferta ideala pentru satisfacerea cererilor dumneavoastra.
            </p>
          </div>

          {/* Tipuri de proprietati */}
          <div>
            <h4 className="font-serif font-semibold text-sm mb-4">Tipuri de proprietati</h4>
            <ul className="space-y-2">
              {links.propertyTypes.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-primary transition-colors text-xs"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cautari Populare (SEO) */}
          <div>
            <h4 className="font-serif font-semibold text-sm mb-4">Căutări frecvente</h4>
            <ul className="space-y-2">
              {links.popularSearches.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-primary transition-colors text-xs"
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
            © 2026 Casa Pronto Imobiliare. Toate drepturile rezervate.
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
