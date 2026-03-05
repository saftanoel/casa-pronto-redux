import { useState, useRef } from "react";
import { Menu, X, Phone, Mail, Search } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSearch } from "@/context/SearchContext";
import logo from "@/assets/logo3.jpg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { filters, setFilter, scrollToProperties } = useSearch();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: "Acasă", href: "/" },
    { label: "Proprietăți", href: "/proprietati" },
    { label: "Despre Noi", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ];

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const handleSearchChange = (value: string) => {
    setFilter("searchQuery", value);
    scrollToProperties();
  };

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href === "/") {
      e.preventDefault();
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
      }
    } else if (href.startsWith("/#")) {
      e.preventDefault();
      const hash = href.substring(1);
      if (location.pathname === "/") {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/" + hash);
      }
    } else {
      // Regular route like /proprietati
      e.preventDefault();
      navigate(href);
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      {/* Top bar */}
      <div className="bg-foreground text-background py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:0740197476" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">0740 197 476</span>
            </a>
            <a href="mailto:casa_pronto@yahoo.com" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">casa_pronto@yahoo.com</span>
            </a>
          </div>
          <p className="hidden md:block text-background/70">Din 2004 vă punem la dispoziție cele mai frumoase proprietăți</p>
        </div>
      </div>

      {/* Main nav */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20 relative">
          {/* Logo */}
          <a href="/" onClick={handleLogoClick} className="flex items-center gap-3 cursor-pointer">
            <img src={logo} alt="Casa Pronto Logo" className="h-14 md:h-18 w-auto object-contain" />
            <div className="hidden sm:block">
              <h1 className="font-serif font-bold text-lg leading-tight">Casa Pronto</h1>
              <p className="text-xs text-muted-foreground">Imobiliare</p>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA & Search */}
          <div className="hidden lg:flex items-center gap-4">
            <div className={cn(
              "overflow-hidden transition-all duration-300",
              isSearchOpen ? "w-64" : "w-0"
            )}>
              <Input
                ref={searchInputRef}
                placeholder="Caută proprietăți..."
                value={filters.searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-9"
              />
            </div>
            <Button variant="ghost" size="icon" className="text-foreground/70" onClick={handleSearchToggle}>
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300",
          isMenuOpen ? "max-h-[500px] border-t border-border" : "max-h-0"
        )}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
          <Input
            placeholder="Caută proprietăți..."
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="mb-2"
          />
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { handleNavClick(e, link.href); setIsMenuOpen(false); }}
              className="py-3 px-4 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
          
        </nav>
      </div>
    </header>
  );
};

export default Header;
