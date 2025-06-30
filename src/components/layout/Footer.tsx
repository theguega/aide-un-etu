// src/components/layout/Footer.tsx

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // -- ACCESSIBILITÉ: La balise <footer> est un landmark de fin de page --
    <footer className="bg-gray-100 text-gray-600 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-sm">
            © {currentYear} Aide-un-étudiant. Un projet pour le Hackathon UTC x
            mc2i.
          </p>

          {/* Liens de pied de page */}
          <div className="flex gap-4 mt-4 md:mt-0">
            {/*
              Même si les pages n'existent pas pour le hackathon,
              afficher les liens montre une bonne pratique.
            */}
            <Link href="/mentions-legales" className="text-sm hover:underline">
              Mentions Légales
            </Link>
            <Link href="/confidentialite" className="text-sm hover:underline">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
