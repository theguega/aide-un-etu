import { CategoryCard } from "@/components/ui/CategoryCard";
import { OfferType } from "@prisma/client";

export default function HomePage() {
  return (
    <main
      className="bg-white px-4 sm:px-8 lg:px-16 lg:pt-10"
      lang="fr"
      aria-label="Page d'accueil de la plateforme d'entraide"
    >
      <section className="max-w-3xl mx-auto text-center ld:mb-16 mb-8">
        <h1 className="text-4xl font-extrabold mb-4 text-black leading-tight tracking-tight">
          Bienvenue sur <span className="text-green-700">Aide-un-étu</span>
        </h1>
        <p className="text-lg text-gray-800 leading-relaxed max-w-xl mx-auto">
          La plateforme qui facilite l&apos;entraide près de chez vous, pour partager
          objets, services ou connaissances en toute simplicité.
        </p>
      </section>

      <section aria-labelledby="categories-title" className="max-w-5xl mx-auto">
        <h2 id="categories-title" className="sr-only">
          Catégories d&apos;entraide
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
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
    </main>
  );
}
