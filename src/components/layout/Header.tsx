// src/components/layout/Header.tsx
"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react"

export function Header() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo / Nom du site */}
          <Link 
            href="/" 
            className="text-2xl font-bold text-blue-800 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
            aria-label="Retour à la page d'accueil de Aide-un-étudiant"
          >
            Aide-un-étudiant
          </Link>

          {/* Navigation principale */}
          <nav aria-label="Navigation principale">
            <ul className="flex items-center gap-6">
              <li>
                <Link 
                  href="/creer-offre" 
                  className="text-gray-700 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-3 py-2 transition-colors"
                  aria-describedby="creer-offre-desc"
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
                    <span 
                      className="text-gray-700 font-medium"
                      aria-label={`Connecté en tant que ${session.user?.name}`}
                    >
                      Bonjour, {session.user?.name}
                    </span>
                    
                    <button
                      onClick={() => signOut({
                        callbackUrl: '/',
                        redirect: true
                      })}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                      aria-label="Se déconnecter de la session"
                    >
                      Déconnexion
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => signIn('custom-provider', {
                      callbackUrl: '/',
                      redirect: true
                    })}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    aria-label="Se connecter avec votre compte étudiant"
                  >
                    Connexion
                  </button>
                )}
              </li>
            </ul>
          </nav>

          {/* Menu mobile (accessibilité) */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Ouvrir le menu de navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Menu mobile déroulant */}
        {isMenuOpen && (
          <nav 
            id="mobile-menu" 
            className="md:hidden pb-4"
            aria-label="Navigation mobile"
          >
            <ul className="flex flex-col gap-2">
              <li>
                <Link 
                  href="/creer-offre" 
                  className="block text-gray-700 hover:text-blue-800 py-2 px-4 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Créer une offre
                </Link>
              </li>
              <li>
                {session ? (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      signOut({ callbackUrl: '/' })
                    }}
                    className="block w-full text-left bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                  >
                    Déconnexion
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      signIn('custom-provider', { callbackUrl: '/' })
                    }}
                    className="block w-full text-left bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    Connexion
                  </button>
                )}
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}