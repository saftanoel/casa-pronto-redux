import { Facebook, Instagram, Linkedin, Youtube, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const links = {
    quickLinks: [
      { label: "Acasă", href: "#home" },
      { label: "Proprietăți", href: "#properties" },
      { label: "Despre Noi", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
    propertyTypes: [
      { label: "Apartamente", href: "#" },
      { label: "Case", href: "#" },
      { label: "Garsoniere", href: "#" },
      { label: "Terenuri", href: "#" },
      { label: "Spații Comerciale", href: "#" },
    ],
    services: [
      { label: "Vânzare", href: "#" },
      { label: "Cumpărare", href: "#" },
      { label: "Închiriere", href: "#" },
      { label: "Evaluare", href: "#" },
      { label: "Consultanță", href: "#" },
    ],
  };

  const socials = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-foreground text-background">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary rounded-lg p-2">
                <span className="text-primary-foreground font-serif font-bold text-xl">CP</span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg">Casa Pronto</h3>
                <p className="text-xs text-background/60">Imobiliare</p>
              </div>
            </div>
            
            <p className="text-background/70 leading-relaxed mb-6 max-w-sm">
              Din anul 2004 vă punem la dispoziție cele mai frumoase proprietăți 
              imobiliare în Alba Iulia. Echipa noastră de profesioniști vă așteaptă.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold mb-5">Link-uri Rapide</h4>
            <ul className="space-y-3">
              {links.quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Property types */}
          <div>
            <h4 className="font-semibold mb-5">Tipuri de Proprietăți</h4>
            <ul className="space-y-3">
              {links.propertyTypes.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-5">Servicii</h4>
            <ul className="space-y-3">
              {links.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
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
          
          <div className="flex items-center gap-6 text-sm text-background/50">
            <a href="#" className="hover:text-background transition-colors">
              Termeni și Condiții
            </a>
            <a href="#" className="hover:text-background transition-colors">
              Politica de Confidențialitate
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <Button
        onClick={scrollToTop}
        variant="default"
        size="icon"
        className="fixed bottom-6 right-6 rounded-full shadow-lg z-50"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </footer>
  );
};

export default Footer;
