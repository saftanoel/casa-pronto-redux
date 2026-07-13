import type { Metadata } from "next";
import "../index.css";

export const metadata: Metadata = {
  title: "Casa Pronto Imobiliare",
  description: "Apartamente, case, terenuri de vanzare in Alba Iulia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
