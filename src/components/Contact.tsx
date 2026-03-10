import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Numele este obligatoriu").max(100),
  phone: z.string().trim().min(1, "Telefonul este obligatoriu").regex(/^[\d\s\+\-\(\)]{7,20}$/, "Număr de telefon invalid"),
  email: z.string().trim().email("Adresă de email invalidă").max(255),
  subject: z.string().trim().min(1, "Subiectul este obligatoriu").max(200),
  message: z.string().trim().min(10, "Mesajul trebuie să aibă minim 10 caractere").max(2000),
});

type ContactFormData = z.infer<typeof contactSchema>;

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mdawnlwr";

const contactInfo = [
  { icon: Phone, label: "Telefon", value: "0740 197 476", href: "tel:0740197476" },
  { icon: Mail, label: "Email", value: "casa_pronto@yahoo.com", href: "mailto:casa_pronto@yahoo.com" },
  { icon: MapPin, label: "Adresă", value: "Alba Iulia, România", href: "#" },
  { icon: Clock, label: "Program", value: "Luni - Vineri: 9:00 - 18:00", href: "#" },
];

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    const WP_API_URL = "https://casapronto.ro/wp-json/casa-pronto/v1/contact";

    try {
      console.log("Trimitere date către WordPress...", data);

      const res = await fetch(WP_API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data),
      });

      // Verificăm dacă răspunsul este OK
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Răspuns server (eroare):", errorText);
        throw new Error("Serverul WordPress a raportat o eroare.");
      }

      const result = await res.json();
      console.log("Succes server:", result);

      toast.success("Mesajul a fost trimis cu succes! Te vom contacta în cel mai scurt timp.");
      reset(); // Resetează câmpurile formularului
    } catch (error: any) {
      console.error("Eroare la trimitere formular:", error);
      toast.error("A apărut o eroare. Te rugăm să încerci din nou sau să ne suni direct.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left side - Info */}
          <div>
            <span className="text-primary font-medium text-sm">Contact</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2 mb-6">
              Să Păstrăm Legătura
            </h2>
            <p className="text-muted-foreground mb-10">
              Suntem aici pentru a răspunde la toate întrebările dumneavoastră. 
              Contactați-ne pentru o consultație gratuită sau trimiteți-ne un mesaj 
              și vă vom răspunde în cel mai scurt timp.
            </p>

            {/* Contact info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((item) => {
                const classes = "flex items-start gap-4 p-5 rounded-xl bg-muted/50 hover:bg-muted transition-colors group";
                const content = (
                  <>
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <item.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-medium text-foreground">{item.value}</p>
                    </div>
                  </>
                );
                return item.href && item.href !== "#" ? (
                  <a key={item.label} href={item.href} className={classes}>{content}</a>
                ) : (
                  <div key={item.label} className={classes}>{content}</div>
                );
              })}
            </div>

            {/* Map */}
            <div className="mt-8 rounded-xl overflow-hidden border border-border h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2504.7404845883398!2d23.5696261!3d46.074462399999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474ea7d6d819e357%3A0xaad3b4a1251da7f1!2sAgen%C8%9Bia%20Imobiliar%C4%83%20Casa%20Pronto%20Alba%20Iulia!5e1!3m2!1sro!2sro!4v1772721606205!5m2!1sro!2sro"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Casa Pronto - Locație pe Google Maps"
              />
            </div>
          </div>

          {/* Right side - Form */}
          <div className="bg-card rounded-2xl p-8 md:p-10 shadow-[var(--card-shadow)] border border-border">
            <h3 className="font-serif text-2xl font-semibold mb-2">
              Trimite-ne un Mesaj
            </h3>
            <p className="text-muted-foreground text-sm mb-8">
              Completează formularul și te vom contacta în cel mai scurt timp.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Nume Complet
                  </label>
                  <Input placeholder="Ion Popescu" className="h-12" {...register("name")} />
                  {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Telefon
                  </label>
                  <Input placeholder="0740 000 000" type="tel" className="h-12" {...register("phone")} />
                  {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Email
                </label>
                <Input placeholder="email@exemplu.com" type="email" className="h-12" {...register("email")} />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Subiect
                </label>
                <Input placeholder="Sunt interesat de..." className="h-12" {...register("subject")} />
                {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Mesaj
                </label>
                <Textarea 
                  placeholder="Scrie mesajul tău aici..." 
                  className="min-h-[120px] resize-none"
                  {...register("message")}
                />
                {errors.message && <p className="text-destructive text-xs mt-1">{errors.message.message}</p>}
              </div>

              <Button className="w-full h-12 gap-2" size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Se trimite...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Trimite Mesajul
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
