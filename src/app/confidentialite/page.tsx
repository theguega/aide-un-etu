// src/app/confidentialite/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité - Aide-un-étudiant",
  description:
    "Notre engagement concernant la protection de vos données personnelles sur Aide-un-étudiant.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ConfidentialitePage() {
  return (
    <main className="container mx-auto max-w-3xl py-12">
      <div className="space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold">Politique de Confidentialité</h1>
          <p className="mt-2 text-muted-foreground">
            Votre confiance est notre priorité.
          </p>
        </header>

        <section aria-labelledby="collecte-title">
          <h2
            id="collecte-title"
            className="text-2xl font-semibold mb-4 border-b pb-2"
          >
            1. Données collectées
          </h2>
          <p>
            Dans le cadre de l&lsquo;utilisation de la plateforme &lsquo;Aide-un-étudiant&lsquo;,
            nous collectons les données suivantes, dans le respect du principe
            de minimisation des données :
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>
              <strong>Données d&lsquo;authentification :</strong> Les informations
              fournies par le service d&lsquo;authentification de l&lsquo;UTC (nom, prénom,
              e-mail).
            </li>
            <li>
              <strong>Données de profil :</strong> Les informations que vous
              ajoutez volontairement pour compléter votre profil (pseudo, code
              postal, description).
            </li>
            <li>
              <strong>Données de contenu :</strong> Les informations que vous
              publiez dans vos offres (titre, description, tags).
            </li>
          </ul>
          <p className="mt-4">
            Nous n&lsquo;utilisons aucun cookie de suivi ou d&lsquo;analyse tiers. Les seuls
            cookies utilisés sont strictement nécessaires au fonctionnement de
            la session d&lsquo;authentification.
          </p>
        </section>

        <section aria-labelledby="utilisation-title">
          <h2
            id="utilisation-title"
            className="text-2xl font-semibold mb-4 border-b pb-2"
          >
            2. Utilisation de vos données
          </h2>
          <p>Vos données sont utilisées dans le seul but de :</p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>
              Permettre le bon fonctionnement de la plateforme (affichage de
              votre pseudo, filtrage par code postal).
            </li>
            <li>Faciliter la mise en contact entre les utilisateurs.</li>
            <li>Assurer la sécurité de la plateforme.</li>
          </ul>
          <p className="mt-4 font-semibold">
            Vos données ne seront jamais vendues, partagées ou utilisées à des
            fins commerciales ou publicitaires.
          </p>
        </section>

        <section aria-labelledby="duree-title">
          <h2
            id="duree-title"
            className="text-2xl font-semibold mb-4 border-b pb-2"
          >
            3. Durée de conservation et Droit à l&lsquo;oubli
          </h2>
          <p>
            Nous appliquons une politique de conservation des données stricte,
            fondée sur le principe de minimisation et le droit à l&lsquo;oubli :
          </p>
          <ul className="list-disc list-inside mt-4 space-y-3">
            <li>
              <strong>Suppression manuelle :</strong> Vous pouvez à tout moment
              demander la suppression complète de votre compte et de toutes les
              données qui y sont associées en nous contactant à [Votre adresse
              e-mail de contact].
            </li>
            <li>
              <strong>Suppression automatique pour inactivité :</strong> Pour ne
              pas conserver indéfiniment les données des utilisateurs inactifs,
              tout compte n&lsquo;ayant enregistré aucune connexion pendant une
              période continue de six (6) mois sera automatiquement et
              définitivement supprimé de nos systèmes.
            </li>
            <li>
              <strong>Anonymisation des offres :</strong> Les offres associées à
              un compte supprimé seront également supprimées ou anonymisées pour
              ne plus être rattachées à une personne identifiable.
            </li>
          </ul>
          <p className="mt-4 bg-muted text-muted-foreground p-3 rounded-md text-sm">
            Cette politique de suppression automatique garantit que nous ne
            stockons que les données pertinentes et nécessaires au
            fonctionnement actuel de la communauté.
          </p>
        </section>

        <section aria-labelledby="droits-title">
          <h2
            id="droits-title"
            className="text-2xl font-semibold mb-4 border-b pb-2"
          >
            4. Vos droits
          </h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données
            (RGPD), vous disposez d&nbsp;un droit d&nbsp;accès, de
            rectification, de suppression et de portabilité de vos données
            personnelles.
          </p>
          <p className="mt-2">
            Pour exercer ces droits ou pour toute question relative à la gestion
            de vos données, veuillez nous contacter par e-mail à l&nbsp;adresse
            suivante :{" "}
            <a
              href="mailto:theo.guegan@etu.utc.fr"
              className="font-semibold text-primary"
            >
              theo.guegan@etu.utc.fr
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
