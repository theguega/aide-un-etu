// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SessionProvider } from "@/components/providers/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aide-un-étudiant - Acceuil",
  description:
    "Plateforme d'entraide pour le prêt d'objets, le partage de services et de connaissances entre étudiants.",
  keywords:
    "entraide, étudiants, partage, éco-responsable, services, objets, connaissances",
  authors: [{ name: "Aide-un-étudiant" }],
  //viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",

  openGraph: {
    title: "Aide-un-étudiant - Plateforme d'entraide étudiante",
    description: "Plateforme éco-responsable d'entraide entre étudiants",
    type: "website",
    locale: "fr_FR",
  },

  other: {
    "theme-color": "#3B82F6",
    "color-scheme": "light",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}
      >
        <SessionProvider>
          <Header />

          <main
            id="main-content"
            className="flex-1 container mx-auto px-4 py-8"
            tabIndex={-1}
          >
            {children}
          </main>

          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
