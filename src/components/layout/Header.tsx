// src/components/layout/Header.tsx
"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react"

export function Header() {
  const { data: session, status } = useSession() // Pour utiliser la session : {session.user?.name}

  // Gestion du loading accessible
  if (status === "loading") {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-gray-800">
              Aide-un-étudiant
            </div>
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
    )
  }

  return (
    // -- ACCESSIBILITÉ: La balise <header> est un "landmark" (point de repère) majeur --
    <header className="bg-white border-b border-[color:var(--border)] sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex md:flex-row flex-col items-start py-4 gap-2">
          {/* Logo / Nom du site */}
          <div className="w-full flex items-center justify-center">
            <Link
              href="/"
              className="text-4xl font-bold text-black"
              aria-label="Retour à la page d'accueil de Aide-un-étudiant"
            >
              Aide-un-étudiant
            </Link>
          </div>

          {/* -- ACCESSIBILITÉ: La balise <nav> est le landmark pour la navigation principale -- */}
          <nav
            aria-label="Navigation principale"
            className="w-full flex justify-center"
          >
            {/* -- ACCESSIBILITÉ: Une liste est la structure sémantique correcte pour un menu -- */}
            <ul className="flex items-center gap-6">
              <li>
                <Link
                  href="/creer-offre"
                  className="text-black hover:text-[color:var(--accent)] focus:text-[color:var(--accent)] transition-colors"
                >
                  Créer une offre
                  <span id="creer-offre-desc" className="sr-only">
                    Proposer un objet, service ou connaissance à partager
                  </span>
                </Link>
              </li>

              {/* Logique d'affichage conditionnelle : Connexion ou Profil */}
              <li>
                {session ? (
                  <div className="flex items-center gap-4">  
                    <button
                      onClick={() => signOut({
                        callbackUrl: '/',
                        redirect: true
                      })}
                      className="bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
                      aria-label="Se déconnecter de la session"
                    >
                      Se déconnecter
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => signIn('custom-provider', {
                      callbackUrl: '/',
                      redirect: true
                    })}
                    className="bg-[color:var(--accent)] text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] transition-colors"
                  >
                    Se connecter
                  </button>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}