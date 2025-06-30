// src/components/ui/CategoryCard.tsx

import Link from "next/link";
import { OfferType } from "@prisma/client";

interface CategoryCardProps {
  type: OfferType;
  title: string;
  description: string;
}

const typeToPathMap: { [key in OfferType]: string } = {
  OBJET: "/objets",
  SERVICE: "/services",
  CONNAISSANCE: "/connaissances",
};

export function CategoryCard({ type, title, description }: CategoryCardProps) {
  const href = typeToPathMap[type];

  return (
    <Link
      href={href}
      className="block p-6 bg-white border border-[color:var(--border)] rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] focus:ring-offset-2"
    >
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-black">
        {title}
      </h2>
      <p className="font-normal text-black">{description}</p>
    </Link>
  );
}
