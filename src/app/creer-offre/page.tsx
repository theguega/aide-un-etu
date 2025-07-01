"use client";

import { CreateOfferForm } from "@/components/CreateOfferForm";
import { useEffect } from "react";

export default function CreateOfferPage() {
  useEffect(() => {
    document.title = "Créer une offre d'entraide - Aide-un-étudiant";
  }, []);

  return (
    <section className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">
          Publier une nouvelle offre d&#39;entraide
        </h1>
        <p className="text-gray-600 mt-2">
          Partagez avec la communauté étudiante !
        </p>
      </div>

      <CreateOfferForm />
    </section>
  );
}
