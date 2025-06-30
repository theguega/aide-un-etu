// src/app/auth/signin/page.tsx
"use client";

import { getProviders, signIn, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");
  const callbackUrl = searchParams?.get("callbackUrl") || "/";

  useEffect(() => {
    // Récupération éco-optimisée des providers
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();

    // Vérifier si déjà connecté
    getSession().then((session) => {
      if (session) {
        router.push(callbackUrl);
      }
    });
  }, [router, callbackUrl]);

  const handleSignIn = async (providerId: string) => {
    setIsLoading(true);
    try {
      await signIn(providerId, {
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setIsLoading(false);
    }
  };

  // Messages d'erreur accessibles
  const getErrorMessage = (error: string) => {
    switch (error) {
      case "OAuthSignin":
        return "Erreur lors de l'initialisation de la connexion";
      case "OAuthCallback":
        return "Erreur lors du retour de connexion";
      case "OAuthCreateAccount":
        return "Impossible de créer le compte";
      case "EmailCreateAccount":
        return "Impossible de créer le compte avec cet email";
      case "Callback":
        return "Erreur lors de la connexion";
      case "OAuthAccountNotLinked":
        return "Ce compte est déjà associé à un autre utilisateur";
      case "EmailSignin":
        return "Impossible d'envoyer l'email de connexion";
      case "CredentialsSignin":
        return "Identifiants incorrects";
      case "SessionRequired":
        return "Veuillez vous connecter pour accéder à cette page";
      default:
        return "Une erreur s'est produite lors de la connexion";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* En-tête accessible */}
        <div className="text-center">
          <Link
            href="/"
            className="text-3xl font-bold text-blue-800 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            aria-label="Retour à l'accueil de Aide-un-étudiant"
          >
            Aide-un-étudiant
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            Connexion à votre espace
          </h1>
          <p className="mt-2 text-gray-600">
            Connectez-vous avec votre compte étudiant pour accéder à la
            plateforme d&apos;entraide
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-gray-200 sm:rounded-lg sm:px-10">
          {/* Affichage des erreurs accessible */}
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md"
            >
              <div className="flex">
                <svg
                  className="h-5 w-5 text-red-400 mt-0.5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-sm text-red-700">
                  <p className="font-medium">Erreur de connexion</p>
                  <p>{getErrorMessage(error)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Formulaire de connexion */}
          <div>
            {providers &&
              Object.values(providers).map((provider: any) => (
                <div key={provider.name} className="mb-4">
                  <button
                    onClick={() => handleSignIn(provider.id)}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-describedby="signin-description"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Connexion en cours...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Se connecter avec {provider.name}
                      </>
                    )}
                  </button>

                  <p
                    id="signin-description"
                    className="mt-2 text-xs text-gray-500 text-center"
                  >
                    Vous serez redirigé vers le portail de connexion sécurisé
                  </p>
                </div>
              ))}
          </div>

          {/* Informations supplémentaires */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="text-xs text-gray-500 text-center space-y-2">
              <p>
                🌱 <strong>Plateforme éco-responsable</strong> : connexion
                optimisée pour réduire l&#39;impact environnemental
              </p>
              <p>
                ♿ <strong>Accessible à tous</strong> : interface conçue pour
                être utilisable par tous les étudiants
              </p>
            </div>
          </div>

          {/* Navigation de retour */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1"
            >
              ← Retour à l&#39;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
