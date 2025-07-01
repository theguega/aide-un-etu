// src/app/mentions-legales/page.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions Légales - Aide-un-étudiant',
  description: 'Consultez les mentions légales de la plateforme Aide-un-étudiant.',
  // -- ÉCO-CONCEPTION: On indique aux robots de ne pas indexer cette page,
  // car elle n'a pas de valeur de contenu pour les moteurs de recherche.
  robots: {
    index: false,
    follow: false,
  },
};

export default function MentionsLegalesPage() {
  return (
    <main className="container mx-auto max-w-3xl py-12">
      <div className="space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold">Mentions Légales</h1>
        </header>

        <section aria-labelledby="editeur-title">
          <h2 id="editeur-title" className="text-2xl font-semibold mb-4 border-b pb-2">
            1. Éditeur du Site
          </h2>
          <p>
            Le site "Aide-un-étudiant" est un projet réalisé dans le cadre du Hackathon UTC x mc2i. Il s'agit d'un prototype à but non-commercial et éducatif.
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li><strong>Responsables de la publication :</strong> [Votre Nom] et [Nom de votre coéquipier]</li>
            <li><strong>Contact :</strong> [Votre adresse e-mail de contact]</li>
          </ul>
        </section>

        <section aria-labelledby="hebergeur-title">
          <h2 id="hebergeur-title" className="text-2xl font-semibold mb-4 border-b pb-2">
            2. Hébergement
          </h2>
          <p>
            Ce projet est hébergé sur l'infrastructure GitLab de l'Université de Technologie de Compiègne (UTC), dans un souci de souveraineté numérique et de réduction de l'empreinte carbone liée au transport des données.
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li><strong>Hébergeur :</strong> Université de Technologie de Compiègne</li>
            <li><strong>Adresse :</strong> Rue du Docteur Schweitzer, 60200 Compiègne</li>
          </ul>
        </section>

        <section aria-labelledby="propriete-title">
          <h2 id="propriete-title" className="text-2xl font-semibold mb-4 border-b pb-2">
            3. Propriété Intellectuelle
          </h2>
          <p>
            Le code source et les éléments graphiques de ce projet sont la propriété de leurs auteurs. Le concept est destiné à être une démonstration et n'est pas voué à une exploitation commerciale.
          </p>
        </section>

        <section aria-labelledby="responsabilite-title">
          <h2 id="responsabilite-title" className="text-2xl font-semibold mb-4 border-b pb-2">
            4. Limitation de responsabilité
          </h2>
          <p>
            Les informations et offres présentes sur ce site sont publiées par les utilisateurs. Les créateurs du site ne sauraient être tenus responsables de la qualité, de la véracité ou de l'issue des échanges entre utilisateurs. La plateforme est fournie "en l'état" sans aucune garantie.
          </p>
        </section>
      </div>
    </main>
  );
}