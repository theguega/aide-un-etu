"use client";

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

export default async function OfferDetailPage({ params }: { params: { id: string } }) {
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
    <main className="container mx-auto max-w-6xl py-8 px-2 md:px-0">
      {/* Bouton retour */}
      <div className="mb-6">
        <Link
          href="/objets"
          className="inline-flex items-center text-accent hover:underline font-semibold"
          aria-label="Retour à la liste des objets"
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Retour à la liste
        </Link>
      </div>

      <section className="relative mb-10">
        <div className="h-32 md:h-40 w-full rounded-2xl bg-surface flex items-end overflow-hidden shadow-sm">
          <div className="p-6 md:p-8">
            <span className="inline-block bg-accent text-background font-semibold px-4 py-1 rounded-full text-sm md:text-xs mb-2 shadow-sm">
              {offer.type.charAt(0).toUpperCase() + offer.type.slice(1).toLowerCase()}
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
            <h2 className="text-2xl font-bold mb-6 text-accent">Description</h2>
            <div className="space-y-6 text-foreground">
              {offer.description.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>
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

            <div className="flex items-center gap-5 mb-6">
              {/* Optionnel : image de profil si dispo */}
              {/* {offer.author.image && (
                <img
                  src={offer.author.image}
                  alt={`Photo de profil de ${offer.author.pseudo}`}
                  className="w-16 h-16 rounded-full border border-blue-200 shadow-sm"
                />
              )} */}
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

              {isOwner ? (
                <div className="mb-4 space-y-5">
                  <div className="text-base text-accent p-4 bg-surface rounded-md border-4 border-theme text-center font-semibold">
                    C'est votre annonce.
                  </div>
                </div>
              ) : session ? (
                <div className="mb-8 space-y-5">
                  <div className="text-base space-y-3">
                    <h3 className="text-lg font-semibold text-accent">
                      Contacter {offer.author.pseudo}
                    </h3>
                    <p>
                      <strong>Email :</strong> {offer.author.email}
                    </p>
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
                        href="/auth/signin"
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
                  onClick={(e) => {
                    if (
                      !confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")
                    ) {
                      e.preventDefault();
                    }
                  }}
                >
                  Supprimer l'offre
                </button>
              </form>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}