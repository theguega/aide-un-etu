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
        <div className="flex flex-row items-center justify-between py-4 flex-wrap gap-4">
          {/* Nom du site à gauche */}
          <Link
            href="/"
            className="hidden md:block text-3xl font-extrabold text-black whitespace-nowrap"
            aria-label="Retour à la page d'accueil de Aide-un-étudiant"
          >
            Aide-un-étu
          </Link>

          {/* Navigation / boutons à droite */}
          <nav aria-label="Navigation principale" className="flex items-center gap-4 flex-wrap justify-end">
            <Link
              href="/creer-offre"
              className="text-black font-semibold hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 transition-colors whitespace-nowrap"
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
                  signIn("custom-provider", {
                    callbackUrl: "/",
                    redirect: true,
                  })
                }
                className="bg-green-700 text-white px-4 py-2 rounded-md whitespace-nowrap
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
