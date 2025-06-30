import { FilterBar } from "@/components/ui/FilterBar";
import { OfferCard } from "@/components/ui/OfferCard";
import { prisma } from "@/lib/prisma";
import { OfferType, Offer } from "@prisma/client";
import { notFound } from "next/navigation";
import { Prisma } from "@prisma/client";

export const metadata = {
  title: "Aide-un-étudiant - Offres par catégorie",
  description:
    "Découvrez les offres d'entraide classées par catégorie : objets, services et connaissances. Trouvez facilement ce dont vous avez besoin ou proposez votre aide.",
};

type OfferWithAuthor = Offer & {
  author: {
    pseudo: string;
  };
};

export async function generateStaticParams() {
  return [
    { category: "objets" },
    { category: "services" },
    { category: "connaissances" },
  ];
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams?: Record<string, string | undefined>;
}) {
  const categoryMap = {
    objets: { type: OfferType.OBJET, title: "Objets à prêter" },
    services: { type: OfferType.SERVICE, title: "Services proposés" },
    connaissances: {
      type: OfferType.CONNAISSANCE,
      title: "Connaissances à partager",
    },
  };

  const categorySlug = params.category;
  const categoryInfo = categoryMap[categorySlug as keyof typeof categoryMap];

  if (!categoryInfo) notFound();

  const postalCodeFilter = searchParams?.postalCode;

  const tagsQuery = searchParams?.tags;
  const tagsFilter = tagsQuery
    ? tagsQuery
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const whereClause: Prisma.OfferWhereInput = {
    type: categoryInfo.type,
    ...(postalCodeFilter && { postalCode: postalCodeFilter }),
    ...(tagsFilter.length > 0 && {
      AND: tagsFilter.map((tag) => ({
        tags: {
          contains: tag,
        },
      })),
    }),
  };

  const offers: OfferWithAuthor[] = await prisma.offer.findMany({
    where: whereClause,
    include: {
      author: {
        select: { pseudo: true },
      },
    },
    take: 20,
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
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-muted rounded-lg">
            <p className="text-lg font-medium text-foreground">
              Aucune offre ne correspond à vos critères.
            </p>
            <p className="text-muted-foreground mt-2">
              Essayez d&apos;élargir votre recherche ou revenez plus tard !
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
