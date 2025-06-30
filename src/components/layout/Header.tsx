// src/components/layout/Header.tsx

import Link from "next/link";
// import { getSession, signOut } from 'next-auth/react'; // Exemple pour plus tard

export async function Header() {
  // TODO: Remplacer ceci par la vraie logique de session avec NextAuth
  // const session = await getSession(); // Exemple de comment on récupèrera la session
  const session = null; // Pour l'instant, on simule un utilisateur non connecté

  return (
    // -- ACCESSIBILITÉ: La balise <header> est un "landmark" (point de repère) majeur --
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-start py-4 gap-2">
          {/* Logo / Nom du site */}
          <div className="w-full flex items-center justify-center">
            <Link
              href="/"
              className="text-4xl font-bold text-gray-800"
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
                  className="text-gray-600 hover:text-gray-900"
                >
                  Créer une offre
                </Link>
              </li>

              {/* Logique d'affichage conditionnelle : Connexion ou Profil */}
              <li>
                {session ? (
                  <div className="flex items-center gap-4">
                    <span>{/* Bonjour, {session.user?.name} */}</span>
                    <button
                      /* onClick={() => signOut()} */ className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Déconnexion
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/api/auth/signin"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Connexion
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
