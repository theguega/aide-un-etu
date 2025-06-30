import { FilterBar } from "@/components/ui/FilterBar";
import { OfferCard } from "@/components/ui/OfferCard";
import { prisma } from "@/lib/prisma";
import { OfferType } from "@prisma/client";

interface CategoryPageProps {
  params: { category: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Fonction pour convertir le slug de l'URL en type d'offre
const getOfferType = (category: string): OfferType | undefined => {
  const typeMap: { [key: string]: OfferType } = {
    objets: OfferType.OBJET,
    services: OfferType.SERVICE,
    connaissances: OfferType.CONNAISSANCE,
  };
  return typeMap[category];
};

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const offerType = getOfferType(params.category);

  if (!offerType) {
    return <div>Catégorie non valide</div>;
  }

  // TODO: Récupérer la session de l'utilisateur avec NextAuth
  const session = null; // Remplacer par la vraie session
  const userPostalCode = session ? "75001" : undefined; // Simuler un utilisateur connecté

  const postalCodeFilter = searchParams?.postalCode || userPostalCode;

  // -- ÉCO-CONCEPTION: Requête optimisée. On ne récupère que ce qu'il faut --
  const offers = await prisma.offer.findMany({
    where: {
      type: offerType,
      // Le filtre s'applique s'il est présent dans l'URL, sinon on prend celui de l'user, sinon rien
      ...(postalCodeFilter && { postalCode: postalCodeFilter as string }),
    },
    take: 20, // -- ÉCO-CONCEPTION: Pagination! On ne charge pas tout d'un coup. --
    orderBy: { createdAt: "desc" },
  });

  const pageTitles = {
    OBJET: "Objets à prêter",
    SERVICE: "Services proposés",
    CONNAISSANCE: "Connaissances à partager",
  };

  return (
    <section aria-labelledby="page-title">
      <h1 id="page-title" className="text-3xl font-bold mb-8">
        {pageTitles[offerType]}
      </h1>

      <FilterBar />

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.length > 0 ? (
          offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)
        ) : (
          <p>Aucune offre ne correspond à vos critères pour le moment.</p>
        )}
      </div>

      {/* TODO: Ajouter un bouton "Charger plus" pour la pagination */}
    </section>
  );
}
