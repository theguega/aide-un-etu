import { FilterBar } from "@/components/ui/FilterBar";
import { OfferCard } from "@/components/ui/OfferCard";
import { prisma } from "@/lib/prisma";
import { OfferType, Offer } from "@prisma/client";
import { Prisma } from "@prisma/client";

export const metadata = {
  title: "Connaissances à partager - Aide-un-étudiant",
  description: "Découvrez les connaissances partagées entre étudiants : tutorat, formations, conseils académiques et expertise dans différents domaines d'études.",
};

type OfferWithAuthor = Offer & {
  author: {
    pseudo: string;
  };
};

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams?: Promise<Record<string, string | undefined>>;
}

export default async function ConnaissancesPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = await searchParams;

  const postalCodeFilter = resolvedSearchParams?.postalCode;
  const itemName = resolvedSearchParams?.itemName;
  const tagsQuery = resolvedSearchParams?.tags;
  const tagsFilter = tagsQuery
    ? tagsQuery
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const whereClause: Prisma.OfferWhereInput = {
    type: OfferType.CONNAISSANCE,
    ...(postalCodeFilter && { postalCode: postalCodeFilter }),
    ...(itemName && {
      title: {
        contains: itemName,
        //mode: "insensitive",
      },
    }),
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
      <h1 id="page-title" className="text-2xl font-bold mb-6">
        Connaissances à partager
      </h1>
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
              Aucune connaissance ne correspond à vos critères.
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