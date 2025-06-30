// src/app/page.tsx
import { CategoryCard } from "@/components/ui/CategoryCard";
import { OfferType } from "@prisma/client";

export default function HomePage() {
  return (
    <div>
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">
          Bienvenue sur Aide-un-étudiant
        </h1>
        <p className="text-lg text-gray-600">
          La plateforme qui facilite l'entraide près de chez vous.
        </p>
      </section>

      <section aria-labelledby="categories-title">
        <h2 id="categories-title" className="sr-only">
          Catégories d'entraide
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <CategoryCard
            type={OfferType.OBJET}
            title="Prêter un Objet"
            description="Besoin d'une perceuse pour un après-midi ? Trouvez ou proposez des objets du quotidien."
          />
          <CategoryCard
            type={OfferType.SERVICE}
            title="Rendre un Service"
            description="Proposez un coup de main pour un déménagement ou trouvez quelqu'un pour garder votre plante."
          />
          <CategoryCard
            type={OfferType.CONNAISSANCE}
            title="Partager une Connaissance"
            description="Donnez ou recevez de l'aide pour un cours difficile, un projet ou pour apprendre une nouvelle compétence."
          />
        </div>
      </section>
    </div>
  );
}
