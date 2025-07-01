"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export function Header() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-gray-800">Aide-un-étu</div>
            <div
              className="text-gray-600"
              aria-live="polite"
              aria-label="Chargement de la session utilisateur"
            >
              Chargement...
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-300 sticky top-0 z-10">
      <div className="w-full px-8">
        <div className="flex flex-row items-center sm:justify-between justify-center py-4 flex-wrap gap-4 w-full">
          {/* Nom du site à gauche */}
          <Link
            href="/"
            className="max-sm:hidden md:block text-3xl font-extrabold text-black whitespace-nowrap"
            aria-label="Retour à la page d'accueil de Aide-un-étudiant"
          >
            Aide-un-étu
          </Link>

          {/* Logo SVG au milieu (une planete) */}
          <Link
            href="/"
            className="flex items-center justify-center text-3xl font-extrabold text-black whitespace-nowrap"
            aria-label="Retour à la page d'accueil de Aide-un-étudiant"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              role="img"
              aria-labelledby="image de planète"
              className="size-10 h-10 w-10 text-green-900 hover:text-green-800 transition-colors"
            >
              <title id="planetTitle">Icône de planète</title>
              <desc id="planetDesc">
                Une planète verte représentant l&apos;engamenent de notre site
              </desc>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m20.893 13.393-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236a1.125 1.125 0 0 0 1.302-.795l.208-.73a1.125 1.125 0 0 0-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 0 1-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 0 1-1.458-1.137l1.411-2.353a2.25 2.25 0 0 0 .286-.76m11.928 9.869A9 9 0 0 0 8.965 3.525m11.928 9.868A9 9 0 1 1 8.965 3.525"
              />
            </svg>
          </Link>

          {/* Navigation / boutons à droite */}
          <nav
            aria-label="Navigation principale"
            className="flex items-center gap-4"
          >
            <Link
              href="/creer-offre"
              className="flex justify-center text-black font-semibold hover:text-green-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 transition-colors whitespace-nowrap"
            >
              Créer une offre
              <span id="creer-offre-desc" className="sr-only">
                Proposer un objet, service ou connaissance à partager
              </span>
            </Link>

            {session ? (
              <button
                onClick={() =>
                  signOut({
                    callbackUrl: "/",
                    redirect: true,
                  })
                }
                className="bg-red-600 text-white px-4 py-2 rounded-md whitespace-nowrap
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                  hover:bg-red-700 transition-colors"
                aria-label="Se déconnecter de la session"
              >
                Se déconnecter
              </button>
            ) : (
              <button
                onClick={() =>
                  signIn("dev-bypass", {
                    callbackUrl: "/",
                    redirect: true,
                  })
                }
                className="flex justify-center bg-green-700 text-white px-4 py-2 rounded-md whitespace-nowrap
                  hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 transition-colors"
                aria-label="Se connecter"
              >
                Se connecter
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
