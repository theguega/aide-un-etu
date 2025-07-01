"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function FilterBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [itemName, setItemName] = useState(searchParams?.get("itemName") ?? "");
  const [postalCode, setPostalCode] = useState(searchParams?.get("postalCode") ?? "");
  const [tags, setTags] = useState(searchParams?.get("tags") ?? "");

  const getLabelAndPlaceholder = () => {
    if (pathname?.startsWith("/services")) {
      return {
        label: "Nom du service",
        placeholder: "cours de maths, aide au ménage, etc.",
      };
    } else if (pathname?.startsWith("/connaissances")) {
      return {
        label: "Nom de la connaissance",
        placeholder: "électronique, couture, jardinage, etc.",
      };
    } else {
      return {
        label: "Nom de l'objet",
        placeholder: "ordinateur, vélo, perceuse, etc.",
      };
    }
  };

  const { label, placeholder } = getLabelAndPlaceholder();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (itemName.trim()) {
      params.set("itemName", itemName.trim());
    }
    if (postalCode.trim().length === 5) {
      params.set("postalCode", postalCode.trim());
    }
    if (tags.trim()) {
      params.set("tags", tags.trim());
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-4 items-end bg-white border border-[color:var(--border)] p-4 rounded-lg"
    >
      <fieldset className="flex flex-wrap gap-4 w-full">
        <legend className="text-xl font-semibold text-black w-full mb-4">
          Filtres de recherche
        </legend>

        {/* Champ nom de l'objet/service/connaissance */}
        <div>
          <label
            htmlFor="itemName"
            className="block text-sm font-medium text-black mb-1"
          >
            {label}
          </label>
          <input
            type="text"
            id="itemName"
            name="itemName"
            placeholder={placeholder}
            className="p-2 border border-[color:var(--border)] rounded-md text-black bg-white focus:ring-2 focus:ring-[color:var(--accent)] focus:outline-none"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>

        {/* Champ code postal */}
        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-black mb-1"
          >
            Code postal
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            placeholder="75001"
            maxLength={5}
            className="p-2 border border-[color:var(--border)] rounded-md text-black bg-white focus:ring-2 focus:ring-[color:var(--accent)] focus:outline-none"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>

        {/* Champ tags */}
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-black mb-1"
          >
            Mots-clés
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            placeholder="bricolage, réparation, aide..."
            className="p-2 border border-[color:var(--border)] rounded-md text-black bg-white focus:ring-2 focus:ring-[color:var(--accent)] focus:outline-none"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
      </fieldset>

      {/* Bouton invisible pour permettre la soumission via "Entrée" */}
      <button type="submit" className="hidden" aria-hidden="true"></button>

      {/* Info "Appuyer sur Entrée" */}
      <p className="text-sm text-gray-500 w-full mt-2">
        Appuyez sur <strong>Entrée</strong> pour lancer la recherche.
      </p>
    </form>
  );
}
