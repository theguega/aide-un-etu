"use server";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Composant pour l'image de profil optimisée
const ProfileImage = ({
  src,
  alt,
  size = 64,
  className = "",
}: {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
}) => {
  if (!src) {
    // Avatar par défaut avec initiales
    const nameOnly = alt.replace(/^Photo de profil de \s*/i, "");
    const initials = nameOnly
      .split(" ")
      .map((name) => name[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
    return (
      <div
        className={`flex items-center justify-center bg-accent text-background font-bold rounded-full ${className}`}
        style={{ width: size, height: size, fontSize: `${size / 3}px` }}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-full border-2 border-theme shadow-sm ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="object-cover"
        quality={75}
        sizes={`${size}px`}
        priority={false}
      />
    </div>
  );
};

// Composant pour l'image de l'offre optimisée
const OfferImage = ({
  src,
  alt,
  className = "",
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) => {
  if (!src) {
    return (
      <div
        className={`bg-surface border-2 border-dashed border-theme flex items-center justify-center ${className}`}
      >
        <div className="text-center text-foreground/60">
          <svg
            className="mx-auto h-12 w-12 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm font-medium">Aucune image</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 hover:scale-105"
        quality={80}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 50vw"
        priority={true}
      />
    </div>
  );
};

const ImpactCard = ({ type }: { type: string }) => {
  const getImpactData = () => {
    switch (type.toLowerCase()) {
      case "objet":
        return {
          icon: "🌱",
          title: "Impact environnemental évité",
          stats: [
            {
              label: "Émissions CO2 évitées",
              value: "~6.5 kg CO2",
              description: "par rapport à un achat neuf moyen",
            },
            {
              label: "Économie réalisée",
              value: "40-70%",
              description: "du prix neuf en moyenne",
            },
          ],
          source: {
            text: "Source : ADEME - Impact environnemental du numérique",
            url: "https://www.ademe.fr/sites/default/files/assets/documents/guide-pratique-face-cachee-numerique.pdf",
          },
          tip: "En choisissant la seconde main, vous participez à l'économie circulaire et réduisez les déchets électroniques.",
        };

      case "service":
        return {
          icon: "💰",
          title: "Économies réalisées",
          stats: [
            {
              label: "Économie moyenne",
              value: "30-50%",
              description: "par rapport aux services professionnels moyens",
            },
            {
              label: "Échange de compétences",
              value: "Gratuit",
              description: "possibilité de troc de services",
            },
          ],
          source: {
            text: "Source : Étude sur l'économie collaborative - INSEE",
            url: "https://www.insee.fr/fr/statistiques/4238589",
          },
          tip: "Les services entre particuliers favorisent le lien social et l'entraide locale.",
        };

      case "connaissance":
        return {
          icon: "🧠",
          title: "Valeur de l'apprentissage",
          stats: [
            {
              label: "Coût formation évité",
              value: "50-200€",
              description: "par rapport aux formations payantes en moyenne",
            },
            {
              label: "Apprentissage personnalisé",
              value: "100%",
              description: "adapté à vos besoins spécifiques",
            },
          ],
          source: {
            text: "Source : Observatoire de la formation - Centre Inffo",
            url: "https://www.centre-inffo.fr/",
          },
          tip: "Partager ses connaissances renforce les compétences et crée du lien social.",
        };

      default:
        return {
          icon: "♻️",
          title: "Impact positif",
          stats: [
            {
              label: "Réduction des déchets",
              value: "Significative",
              description: "en donnant une seconde vie",
            },
            {
              label: "Économie locale",
              value: "Renforcée",
              description: "par les échanges de proximité",
            },
          ],
          source: {
            text: "Source : ADEME - Guide de l'économie circulaire",
            url: "https://www.ademe.fr/economie-circulaire",
          },
          tip: "Chaque geste compte pour un mode de vie plus durable.",
        };
    }
  };

  const impact = getImpactData();

  return (
    <section className="bg-gradient-to-br from-green-200 to-blue-200 rounded-xl shadow-sm border border-green-200 p-8 mb-10">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{impact.icon}</span>
        <h2 className="text-2xl font-bold text-green-900800">{impact.title}</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {impact.stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 border border-green-100"
          >
            <div className="text-2xl font-bold text-green-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm font-semibold text-gray-700 mb-1">
              {stat.label}
            </div>
            <div className="text-xs text-gray-600">{stat.description}</div>
          </div>
        ))}
      </div>

      <div className="bg-green-50 rounded-lg p-4 mb-4">
        <p className="text-sm text-black-800 font-medium">
          💡 <strong>Le saviez-vous ?</strong> {impact.tip}
        </p>
      </div>

      <div className="text-sm text-gray-600">
        <a
          href={impact.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-green-900 hover:underline"
        >
          {impact.source.text} ↗
        </a>
      </div>
    </section>
  );
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const offer = await prisma.offer.findUnique({
    where: { id: resolvedParams.id },
    include: { author: true },
  });

  const author = await prisma.user.findUnique({
    where: { id: offer?.authorId },
  });

  if (!offer) {
    return {
      title: "Offre introuvable",
    };
  }

  return {
    title: `${offer.title} ${offer.city} - ${author?.pseudo}`,
    description: offer.description?.slice(0, 150) || "Détail de l'annonce",
  };
}

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const offer = await prisma.offer.findUnique({
    where: { id: resolvedParams.id },
    include: { author: true },
  });

  if (!offer) {
    notFound();
  }

  const author = await prisma.user.findUnique({
    where: { id: offer.author.id },
  });

  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.id === offer.author.id;

  const type = offer.type.toLowerCase(); // 'objet', 'connaissance', 'service'
  const backLinkMap: Record<string, { href: string; label: string }> = {
    objet: { href: "/objets", label: "Retour à la liste des objets" },
    connaissance: {
      href: "/connaissances",
      label: "Retour à la liste des connaissances",
    },
    service: { href: "/services", label: "Retour à la liste des services" },
  };

  const backLink = backLinkMap[type] ?? {
    href: "/",
    label: "Retour à l'accueil",
  };

  return (
    <main className="container mx-auto max-w-6xl px-2 md:px-0">
      {/* Bouton retour */}
      <div className="mb-6">
        <Link
          href={backLink.href}
          className="inline-flex items-center text-accent hover:underline font-semibold"
          aria-label={backLink.label}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retour à la liste
        </Link>
      </div>

      <section className="relative mb-10">
        <div className="h-32 md:h-40 w-full rounded-2xl bg-surface flex items-end overflow-hidden shadow-sm">
          <div className="p-6 md:p-8">
            <span className="inline-block bg-accent text-background font-semibold px-4 py-1 rounded-full text-sm md:text-xs lg:mb-2 shadow-sm">
              {offer.type.charAt(0).toUpperCase() +
                offer.type.slice(1).toLowerCase()}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground drop-shadow-sm">
              {offer.title}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-sm md:text-base text-foreground/70">
              <svg
                width="16"
                height="16"
                fill="none"
                className="inline-block align-middle text-foreground/40"
                viewBox="0 0 16 16"
              >
                <path
                  d="M8 1.333A6.667 6.667 0 108 14.667 6.667 6.667 0 008 1.333zm0 12A5.333 5.333 0 118 2.667a5.333 5.333 0 010 10.666zm.667-8H7.333v4l3.5 2.1.667-1.1-3-1.8V5.333z"
                  fill="currentColor"
                />
              </svg>
              Publié le{" "}
              <time dateTime={offer.createdAt.toISOString()}>
                {formatDate(offer.createdAt)}
              </time>
            </div>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-6 gap-8 lg:gap-12">
        <div className="md:col-span-4 text-lg leading-relaxed">
          {offer.tags && (
            <div className="mb-6 flex flex-wrap gap-3">
              {offer.tags.split(",").map((tag) => (
                <span
                  key={tag}
                  className="bg-surface text-foreground/80 font-medium px-4 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <section className="bg-surface rounded-xl shadow-sm border border-theme p-8 mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-accent">Description</h2>
              <span
                className={`inline-block px-4 py-2 rounded-full font-semibold text-lg
                ${
                  offer.price === 0
                    ? "bg-green-100 text-green-900 border border-green-300"
                    : "bg-blue-100 text-blue-800 border border-blue-300"
                }
              `}
              >
                {offer.price === 0 ? "Gratuit" : `${offer.price} €`}
              </span>
            </div>
            <div className="space-y-6 text-foreground">
              {offer.description.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>

          {offer.photoUrl && (
            <section className="mb-8">
              <OfferImage
                src={offer.photoUrl}
                alt={`Photo de l'offre: ${offer.title}`}
                className="w-full h-64 md:h-80 rounded-xl shadow-lg border border-theme"
              />
            </section>
          )}

          <ImpactCard type={offer.type} />
        </div>

        <aside className="md:col-span-2">
          <div className="sticky top-24 bg-surface p-8 rounded-2xl border border-theme shadow-md flex flex-col">
            <h2 className="text-xl font-bold mb-6 text-accent flex items-center gap-3">
              <svg
                width="24"
                height="24"
                fill="none"
                className="text-accent"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="10"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M6 19c0-2.5 2.5-4 6-4s6 1.5 6 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Proposé par
            </h2>

            <div className="flex items-center gap-4 mb-6">
              <ProfileImage
                src={offer.author.profilePhotoUrl}
                alt={`Photo de profil de ${offer.author.pseudo}`}
                size={64}
              />
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {offer.author.pseudo}
                </p>
                <span className="inline-block bg-accent text-background font-medium px-3 py-1 rounded-full text-sm mt-1">
                  {offer.author.city}, {offer.author.postalCode}
                </span>
              </div>
            </div>

            {offer.author.description && (
              <blockquote className="text-base text-foreground mb-8 italic border-l-4 border-theme pl-5">
                {offer.author.description}
              </blockquote>
            )}

            <div className="mb-6 flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold text-sm border border-green-300">
                <span className="mr-1 text-lg">🤝</span>
                {author?.nb_people_helped || 0}
              </span>
              <span className="text-m text-foreground/70">
                Personnes aidées
              </span>
            </div>

            {isOwner ? (
              <div className="mb-4 space-y-5">
                <div className="text-base text-accent p-4 bg-surface rounded-md border-4 border-theme text-center font-semibold">
                  C&apos;est votre annonce.
                </div>
              </div>
            ) : session ? (
              <div className="mb-8 space-y-5">
                <div className="text-base space-y-3">
                  <h3 className="text-lg font-semibold text-accent">
                    Contacter {offer.author.pseudo}
                  </h3>
                  <a
                    href={`mailto:${offer.author.email}`}
                    className="text-base text-blue-600 hover:underline"
                  >
                    <strong>Email :</strong> {offer.author.email}
                  </a>
                  {offer.author.phone && (
                    <p>
                      <strong>Téléphone :</strong> {offer.author.phone}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-8 space-y-5">
                <div className="text-center p-6 border-2 border-dashed border-theme rounded-xl bg-background">
                  <p className="text-base text-accent">
                    <Link
                      href="/api/auth/signin"
                      className="font-bold text-accent hover:underline"
                    >
                      Connectez-vous
                    </Link>{" "}
                    pour voir les informations de contact.
                  </p>
                </div>
              </div>
            )}

            {isOwner && (
              <form
                action={`/api/delete-offer?id=${offer.id}`}
                method="POST"
                className="mt-auto"
              >
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-5 cursor-pointer rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label="Supprimer cette offre"
                >
                  Supprimer l&apos;offre
                </button>
              </form>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
