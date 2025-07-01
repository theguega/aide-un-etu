"use server";

import Link from "next/link";
import type { Offer } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

interface OfferCardProps {
  offer: Offer;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export async function OfferCard({ offer }: OfferCardProps) {
  const session = await getServerSession(authOptions);
  const offerUrl = `/offre/${offer.id}`;
  const isOwner = session?.user?.id === offer.authorId;

  return (
    <Link
      href={offerUrl}
      className="group relative flex flex-col h-full bg-surface border border-theme rounded-xl p-6 transition-shadow duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
    >
      {isOwner && (
        <div className="absolute top-6 right-6 bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
          Mon annonce
        </div>
      )}

      <div className="mb-2 relative">
        <h3 className="text-2xl font-extrabold text-foreground group-hover:underline mb-1 ml-1">
          {offer.title}
        </h3>
        <span className="inline-block bg-accent text-background font-medium px-3 py-0.5 mt-2 rounded-full text-base mb-1">
          {offer.city}, {offer.postalCode}
        </span>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {offer.tags.split(",").map((tag) => (
          <span
            key={tag}
            className="bg-gray-700 text-gray-100 font-medium px-3 py-1 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex-grow mb-4">
        <p className="text-foreground text-base leading-relaxed line-clamp-3">
          {offer.description}
        </p>
      </div>

      {offer.price ? (
        <div className="text-foreground font-semibold text-lg mb-2">
          {offer.price.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
          })}
        </div>
      ) : (
        <div className="text-foreground/70 italic mb-2">Gratuit</div>
      )}

      <footer className="mt-auto pt-4 border-t border-theme flex items-center justify-between text-xs text-foreground/60">
        <span className="italic flex items-center gap-1">
          <svg
            width="16"
            height="16"
            fill="none"
            className="inline-block align-middle text-foreground/30"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 1.333A6.667 6.667 0 108 14.667 6.667 6.667 0 008 1.333zm0 12A5.333 5.333 0 118 2.667a5.333 5.333 0 010 10.666zm.667-8H7.333v4l3.5 2.1.667-1.1-3-1.8V5.333z"
              fill="currentColor"
            />
          </svg>
          <time dateTime={offer.createdAt.toISOString()}>
            {formatDate(offer.createdAt)}
          </time>
        </span>
      </footer>
    </Link>
  );
}