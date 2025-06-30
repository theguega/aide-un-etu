// src/app/offre/[id]/page.tsx

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
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

export default async function OfferDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const offer = await prisma.offer.findUnique({
    where: { id: params.id },
    include: { author: true },
  });

  if (!offer) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.id === offer.author.id;

  return (
    <main className="container mx-auto max-w-4xl py-8 px-2 md:px-0">
      {/* HEADER VISUEL */}
      <section className="relative mb-10">
        <div className="h-32 md:h-40 w-full rounded-2xl bg-surface flex items-end overflow-hidden shadow-sm">
          <div className="p-6 md:p-8">
            <span className="inline-block bg-accent text-background font-semibold px-4 py-1 rounded-full text-xs mb-2 shadow-sm">
              {offer.type.charAt(0) + offer.type.slice(1).toLowerCase()}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground drop-shadow-sm">
              {offer.title}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-xs text-foreground/70">
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

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {/* Main Content Column (Offer Details) */}
        <div className="md:col-span-2">
          <article>
            {/* TAGS */}
            {offer.tags && offer.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {offer.tags.split(",").map((tag) => (
                  <span
                    key={tag}
                    className="bg-surface text-foreground/70 font-medium px-3 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* DESCRIPTION */}
            <section className="bg-surface rounded-xl shadow-sm border border-theme p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 text-accent">
                Description
              </h2>
              <div className="text-base leading-relaxed text-foreground space-y-4">
                {offer.description.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          </article>
        </div>

        {/* SIDEBAR AUTEUR & CONTACT */}
        <aside className="md:col-span-1">
          <div className="sticky top-24 bg-surface p-6 rounded-2xl border border-theme shadow-md">
            <h2 className="text-lg font-bold mb-4 text-accent flex items-center gap-2">
              <svg
                width="22"
                height="22"
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

            {/* --- Author's Identity --- */}
            <div className="flex items-center gap-4 mb-4">
              {/* Uncomment si image disponible */}
              {/* {offer.author.image && (
                <img
                  src={offer.author.image}
                  alt={`Photo de profil de ${offer.author.pseudo}`}
                  className="w-14 h-14 rounded-full border border-blue-200 shadow-sm"
                />
              )} */}
              <div>
                <p className="text-base font-semibold text-foreground">
                  {offer.author.pseudo}
                </p>
                <span className="inline-block bg-accent text-background font-medium px-2 py-0.5 rounded-full text-xs mt-1">
                  {offer.author.city}, {offer.author.postalCode}
                </span>
              </div>
            </div>

            {/* --- Author's personal description --- */}
            {offer.author.description && (
              <blockquote className="text-sm text-foreground mb-6 italic border-l-4 border-theme pl-4">
                {offer.author.description}
              </blockquote>
            )}

            {/* --- Author's Contact Information (with privacy logic) --- */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-accent">
                Contacter {offer.author.pseudo}
              </h3>
              {isOwner ? (
                <div className="text-sm text-accent p-3 bg-surface rounded-md border border-theme text-center">
                  C&apos;est votre annonce.
                </div>
              ) : session ? (
                // <-- User's contact info, shown only to logged-in users -->
                <div className="text-sm space-y-2">
                  <p>
                    <strong>Email :</strong> {offer.author.email}
                  </p>
                  {offer.author.phone && (
                    <p>
                      <strong>Téléphone :</strong> {offer.author.phone}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center p-4 border-2 border-dashed border-theme rounded-xl bg-background">
                  <p className="text-sm text-accent">
                    <Link
                      href="/auth/signin"
                      className="font-bold text-accent hover:underline"
                    >
                      Connectez-vous
                    </Link>{" "}
                    pour voir les informations de contact.
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
