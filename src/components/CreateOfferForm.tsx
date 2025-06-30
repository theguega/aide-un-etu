"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createOffer, type FormState } from "@/app/_actions";
import { OfferType } from "@prisma/client";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-2xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      {pending ? "Publication en cours..." : "Publier mon offre"}
    </button>
  );
}

export function CreateOfferForm() {
  const initialState: FormState = { message: "", errors: {} };
  const [state, dispatch] = useActionState(createOffer, initialState);

  return (
    <form action={dispatch} className="space-y-6" aria-label="Formulaire de création d'offre d'entraide">
      {/* Titre */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-semibold text-black dark:text-white">
          Titre de l&apos;offre <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          aria-describedby="title-error"
          className="block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-black shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-600 dark:border-gray-600 dark:bg-black dark:text-white"
        />
        <div id="title-error" aria-live="polite" aria-atomic="true">
          {state.errors?.title && (
            <p className="mt-1 text-sm text-red-600">{state.errors.title.join(", ")}</p>
          )}
        </div>
      </div>

      {/* Description (full width) */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-semibold text-black dark:text-white">
          Description détaillée <span className="text-red-600">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          required
          aria-describedby="description-error"
          className="block w-full rounded-2xl border border-gray-300 bg-white p-3 text-black shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-600 resize-y dark:border-gray-600 dark:bg-black dark:text-white"
        />
        <div id="description-error" aria-live="polite" aria-atomic="true">
          {state.errors?.description && (
            <p className="mt-1 text-sm text-red-600">{state.errors.description.join(", ")}</p>
          )}
        </div>
      </div>

      {/* Grille 2 colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Type d'offre */}
        <div className="space-y-2">
          <label htmlFor="type" className="block text-sm font-semibold text-black dark:text-white">
            Type d&apos;offre <span className="text-red-600">*</span>
          </label>
          <select
            id="type"
            name="type"
            required
            defaultValue=""
            aria-describedby="type-error"
            className="block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-black shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-600 dark:border-gray-600 dark:bg-black dark:text-white"
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
              <p className="mt-1 text-sm text-red-600">{state.errors.type.join(", ")}</p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label htmlFor="tags" className="block text-sm font-semibold text-black dark:text-white">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            placeholder="ex: bricolage, cours, python"
            aria-describedby="tags-helper"
            className="block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-black shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-600 dark:border-gray-600 dark:bg-black dark:text-white"
          />
          <p id="tags-helper" className="text-xs text-gray-600 dark:text-gray-400">
            Séparez les tags par une virgule.
          </p>
        </div>
      </div>

      {/* Grille 2 colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ville */}
        <div className="space-y-2">
          <label htmlFor="city" className="block text-sm font-semibold text-black dark:text-white">
            Ville <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="city"
            name="city"
            required
            aria-describedby="city-error"
            className="block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-black shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-600 dark:border-gray-600 dark:bg-black dark:text-white"
          />
          <div id="city-error" aria-live="polite" aria-atomic="true">
            {state.errors?.city && (
              <p className="mt-1 text-sm text-red-600">{state.errors.city.join(", ")}</p>
            )}
          </div>
        </div>

        {/* Code Postal */}
        <div className="space-y-2">
          <label htmlFor="postalCode" className="block text-sm font-semibold text-black dark:text-white">
            Code Postal <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            pattern="\d{5}"
            maxLength={5}
            required
            aria-describedby="postalCode-error"
            className="block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-black shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-600 dark:border-gray-600 dark:bg-black dark:text-white"
          />
          <div id="postalCode-error" aria-live="polite" aria-atomic="true">
            {state.errors?.postalCode && (
              <p className="mt-1 text-sm text-red-600">{state.errors.postalCode.join(", ")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Case à cocher Conditions Générales */}
      <div className="flex items-start space-x-3">
        <input
          id="acceptTerms"
          name="acceptTerms"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
          aria-describedby="acceptTerms-error"
        />
        <label htmlFor="acceptTerms" className="text-sm text-black dark:text-white">
          J&apos;accepte en cochant cette case que mes informations personnelles soient affichées dans l'offre
        </label>
      </div>

      {/* Message d'erreur pour la case (si besoin) */}
      <div id="acceptTerms-error" aria-live="polite" aria-atomic="true" />

      {/* Bouton */}
      <SubmitButton />
    </form>
  );
}
