// src/app/(categories)/[category]/page.tsx

import { FilterBar } from "@/components/ui/FilterBar";
import { OfferCard } from "@/components/ui/OfferCard";
import { prisma } from "@/lib/prisma";
import { OfferType } from "@prisma/client";
import { notFound } from "next/navigation";

// -- ÉCO-CONCEPTION & PERFORMANCE : Static Site Generation (SSG) --
// On indique à Next.js à l'avance quelles pages de catégories existent.
// Il va les pré-générer en HTML statique lors du build. C'est ultra-rapide !
export async function generateStaticParams() {
  return [
    { category: "objets" },
    { category: "services" },
    { category: "connaissances" },
  ];
}

interface CategoryPageProps {
  params: { category: string }; // ex: 'objets', 'services'...
  searchParams: { [key: string]: string | undefined }; // ex: { postalCode: '75001' }
}

// Mappage pour la conversion et l'affichage
const categoryMap = {
  objets: {
    type: OfferType.OBJET,
    title: "Objets à prêter",
  },
  services: {
    type: OfferType.SERVICE,
    title: "Services proposés",
  },
  connaissances: {
    type: OfferType.CONNAISSANCE,
    title: "Connaissances à partager",
  },
};

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const categorySlug = params.category;
  const categoryInfo = categoryMap[categorySlug as keyof typeof categoryMap];

  // Si l'URL ne correspond à aucune catégorie connue, on affiche une page 404.
  if (!categoryInfo) {
    notFound();
  }

  // TODO: Remplacer par la vraie logique de session NextAuth
  const session = null;
  const userPostalCode = session ? "75001" : undefined;

  const postalCodeFilter = searchParams.postalCode || userPostalCode;
  const tagsFilter = searchParams.tags
    ?.split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // -- ÉCO-CONCEPTION : Requête ciblée et paginée --
  const offers = await prisma.offer.findMany({
    where: {
      type: categoryInfo.type, // Filtre sur le bon type d'offre
      ...(postalCodeFilter && { postalCode: postalCodeFilter }),
      ...(tagsFilter &&
        tagsFilter.length > 0 && {
          tags: { hasSome: tagsFilter },
        }),
    },
    include: {
      author: {
        select: { pseudo: true }, // On ne récupère que le pseudo de l'auteur
      },
    },
    take: 20, // On limite le nombre de résultats pour ne pas surcharger la page
    orderBy: { createdAt: "desc" },
  });

  return (
    <section aria-labelledby="page-title">
      <header className="mb-8">
        <h1 id="page-title" className="text-3xl font-bold">
          {categoryInfo.title}
        </h1>
      </header>

      <FilterBar />

      <div className="mt-8">
        {offers.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              // On passe un type `OfferWithAuthor` pour que le composant ait accès à l'auteur
              <OfferCard key={offer.id} offer={offer as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-medium text-gray-700">
              Aucune offre ne correspond à vos critères.
            </p>
            <p className="text-gray-500 mt-2">
              Essayez d'élargir votre recherche ou revenez plus tard !
            </p>
          </div>
        )}
      </div>

      {/* TODO: Implémenter un bouton "Charger plus" pour la pagination infinie */}
    </section>
  );
}
