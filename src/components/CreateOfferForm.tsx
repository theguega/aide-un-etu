// src/components/CreateOfferForm.tsx
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createOffer, type FormState } from "@/app/_actions";
import { OfferType } from "@prisma/client";

// Petit composant pour le bouton de soumission, pour gérer l'état "pending"
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {pending ? "Publication en cours..." : "Publier mon offre"}
    </button>
  );
}

export function CreateOfferForm() {
  const initialState: FormState = { message: "", errors: {} };
  const [state, dispatch] = useActionState(createOffer, initialState);

  return (
    <form action={dispatch} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-800"
        >
          Titre de l'offre
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
          aria-describedby="title-error"
        />
        <div id="title-error" aria-live="polite" aria-atomic="true">
          {state.errors?.title && (
            <p className="mt-2 text-sm text-red-600">
              {state.errors.title.join(", ")}
            </p>
          )}
        </div>
      </div>

      {/* ... Répétez cette structure pour chaque champ ... */}

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-800"
        >
          Description détaillée
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
          aria-describedby="description-error"
        />
        <div id="description-error" aria-live="polite" aria-atomic="true">
          {state.errors?.description && (
            <p className="mt-2 text-sm text-red-600">
              {state.errors.description.join(", ")}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-800"
          >
            Type d'offre
          </label>
          <select
            id="type"
            name="type"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            defaultValue=""
            required
            aria-describedby="type-error"
          >
            <option value="" disabled>
              Sélectionnez un type...
            </option>
            {Object.values(OfferType).map((type) => (
              <option key={type} value={type}>
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <div id="type-error" aria-live="polite" aria-atomic="true">
            {state.errors?.type && (
              <p className="mt-2 text-sm text-red-600">
                {state.errors.type.join(", ")}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-800"
          >
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            placeholder="ex: bricolage, cours, python"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            aria-describedby="tags-helper"
          />
          <p id="tags-helper" className="text-xs text-gray-500">
            Séparez les tags par une virgule.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-800"
          >
            Ville
          </label>
          <input
            type="text"
            id="city"
            name="city"
            required
            aria-describedby="city-error"
            className="block w-full border-gray-300 rounded-md shadow-sm"
          />
          <div id="city-error" aria-live="polite" aria-atomic="true">
            {state.errors?.city && (
              <p className="mt-2 text-sm text-red-600">
                {state.errors.city.join(", ")}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-gray-800"
          >
            Code Postal
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            pattern="\d{5}"
            maxLength={5}
            required
            aria-describedby="postalCode-error"
            className="block w-full border-gray-300 rounded-md shadow-sm"
          />
          <div id="postalCode-error" aria-live="polite" aria-atomic="true">
            {state.errors?.postalCode && (
              <p className="mt-2 text-sm text-red-600">
                {state.errors.postalCode.join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
