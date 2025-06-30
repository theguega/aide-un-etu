// src/components/ui/FilterBar.tsx
"use client"; // Ce composant a besoin d'interactivité client

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function FilterBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // -- ÉCO-CONCEPTION: On attend 300ms après que l'utilisateur ait fini de taper pour lancer la recherche --
  const handleFilterChange = useDebouncedCallback(
    (term: string, name: string) => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set(name, term);
      } else {
        params.delete(name);
      }
      replace(`${pathname}?${params.toString()}`);
    },
    300,
  );

  return (
    <form className="flex flex-wrap gap-4 items-end bg-gray-50 p-4 rounded-lg">
      <fieldset className="flex flex-wrap gap-4">
        <legend className="sr-only">Filtres de recherche</legend>

        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Code postal
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            placeholder="75001"
            className="p-2 border rounded-md"
            onChange={(e) => handleFilterChange(e.target.value, "postalCode")}
            defaultValue={searchParams.get("postalCode")?.toString()}
          />
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tags (ex: bricolage, cours)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            placeholder="bricolage,..."
            className="p-2 border rounded-md"
            onChange={(e) => handleFilterChange(e.target.value, "tags")}
            defaultValue={searchParams.get("tags")?.toString()}
          />
        </div>
      </fieldset>
    </form>
  );
}
