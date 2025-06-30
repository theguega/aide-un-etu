// src/app/creer-offre/page.tsx

import { CreateOfferForm } from "@/components/CreateOfferForm";
import { redirect } from "next/navigation";

export default async function CreateOfferPage() {
  // --- SÉCURITÉ & UX : Protection de la route ---
  // TODO: Remplacer par la vraie logique de session NextAuth
  // const session = await getSession();
  // if (!session) {
  //   redirect('/api/auth/signin?callbackUrl=/creer-offre');
  // }

  return (
    <section className="max-w-2xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold">
          Publier une nouvelle offre d'entraide
        </h1>
        <p className="text-gray-600 mt-2">
          Partagez avec la communauté étudiante !
        </p>
      </header>

      <CreateOfferForm />
    </section>
  );
}
