import Link from "next/link";
import { OfferType } from "@prisma/client";
import { ToolCase, Users, BookOpen } from "lucide-react";

interface CategoryCardProps {
  type: OfferType;
  title: string;
  description: string;
}

const typeToPathMap: Record<OfferType, string> = {
  OBJET: "/objets",
  SERVICE: "/services",
  CONNAISSANCE: "/connaissances",
};

const typeToIconMap: Record<OfferType, React.ReactNode> = {
  OBJET: <ToolCase className="w-10 h-10 text-green-700" aria-hidden="true" />,
  SERVICE: <Users className="w-10 h-10 text-green-700" aria-hidden="true" />,
  CONNAISSANCE: <BookOpen className="w-10 h-10 text-green-700" aria-hidden="true" />,
};

export function CategoryCard({ type, title, description }: CategoryCardProps) {
  const href = typeToPathMap[type];
  const Icon = typeToIconMap[type];

  return (
    <Link
      href={href}
      className="block p-6 bg-white border border-green-700 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
      aria-label={`Accéder à la catégorie ${title}`}
    >
      <article className="flex flex-col items-start gap-4">
        {Icon}
        <h3 className="text-2xl font-semibold text-black">{title}</h3>
        <p className="text-gray-800 leading-relaxed">{description}</p>
      </article>
    </Link>
  );
}
