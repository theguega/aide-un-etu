// src/components/ui/OfferCard.tsx

import Link from "next/link";
import type { Offer, User } from "@prisma/client";

// Pour plus de robustesse, on peut définir un type qui inclut l'auteur
// car on voudra sûrement l'afficher. On le fera via la requête Prisma.
// Pour l'instant, on se contente du type Offer de base.
interface OfferCardProps {
  offer: Offer; // On pourrait plus tard utiliser : offer: Offer & { author: User }
}

// Fonction utilitaire pour formater les dates de manière lisible et sobre
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export function OfferCard({ offer }: OfferCardProps) {
  // On construit l'URL de la page de détail de l'offre
  const offerUrl = `/offre/${offer.id}`;

  return (
    // -- ACCESSIBILITÉ & ÉCO-CONCEPTION : Tout comme CategoryCard, la carte entière est un lien.
    // Une seule cible de tabulation, et pré-chargement par Next.js.
    <Link
      href={offerUrl}
      className="group flex flex-col h-full bg-white border border-gray-200 rounded-lg p-5 transition-shadow duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <header className="mb-3">
        {/* -- ACCESSIBILITÉ : Le titre est un <h3>, car il est hiérarchiquement sous le <h1> de la page ("Objets à prêter") */}
        <h3 className="text-xl font-bold text-gray-900 group-hover:underline">
          {offer.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {offer.city}, {offer.postalCode}
        </p>
      </header>

      {/* On utilise flex-grow pour que la description prenne l'espace disponible, alignant les footers des cartes */}
      <div className="flex-grow mb-4">
        <p className="text-gray-700 line-clamp-3">
          {" "}
          {/* line-clamp-3 limite la description à 3 lignes */}
          {offer.description}
        </p>
      </div>

      <footer className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
        {/* Affichage des tags s'ils existent */}
        <div className="flex flex-wrap gap-2">
          {offer.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* -- ÉCO-CONCEPTION : On affiche une date formatée simplement, sans librairie lourde comme moment.js -- */}
        <time dateTime={offer.createdAt.toISOString()}>
          {formatDate(offer.createdAt)}
        </time>
      </footer>
    </Link>
  );
}
