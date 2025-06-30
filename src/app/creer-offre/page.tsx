// src/app/creer-offre/page.tsx
"use client";

import { CreateOfferForm } from "@/components/CreateOfferForm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function CreateOfferPage() {
  const { data: session } = useSession();

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/creer-offre");
  }

  return (
    <section className="max-w-2xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold">
          Publier une nouvelle offre d&#39;entraide
        </h1>
        <p className="text-gray-600 mt-2">
          Partagez avec la communauté étudiante !
        </p>
      </header>

      <CreateOfferForm />
    </section>
  );
}
