"use client";

import { useActionState, useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createOffer, type FormState } from "@/app/_actions";
import { OfferType } from "@prisma/client";
import { Camera, X } from "lucide-react";

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending || disabled}
      disabled={pending || disabled}
      className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-2xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      {pending ? "Publication en cours..." : "Publier mon offre"}
    </button>
  );
}

export function CreateOfferForm() {
  const initialState: FormState = { message: "", errors: {} };
  const [state, formAction] = useActionState(createOffer, initialState);
  
  const [offerPhoto, setOfferPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide.');
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La taille de l\'image ne doit pas dépasser 5MB.');
        return;
      }

      setOfferPhoto(file);
      
      // Créer une preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setOfferPhoto(null);
    setPhotoPreview(null);
    setUploadedPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-offer-photo', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        return url;
      } else {
        console.error('Erreur lors de l\'upload de la photo');
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      return null;
    }
  };

  // Fonction pour gérer l'upload de photo avant soumission
  const handleFormSubmit = async (formData: FormData) => {
    if (offerPhoto && !uploadedPhotoUrl) {
      setIsUploadingPhoto(true);
      
      try {
        const photoUrl = await uploadPhoto(offerPhoto);
        if (!photoUrl) {
          alert("Erreur lors de l'upload de la photo. Veuillez réessayer.");
          setIsUploadingPhoto(false);
          return;
        }
        
        setUploadedPhotoUrl(photoUrl);
        formData.set('photoUrl', photoUrl);
        
        // Appeler l'action serveur avec l'URL de la photo
        formAction(formData);
      } catch (error) {
        console.error("Erreur:", error);
        alert("Une erreur est survenue lors de l'upload. Veuillez réessayer.");
      } finally {
        setIsUploadingPhoto(false);
      }
    } else {
      // Si pas de photo ou photo déjà uploadée, soumettre directement
      if (uploadedPhotoUrl) {
        formData.set('photoUrl', uploadedPhotoUrl);
      }
      formAction(formData);
    }
  };

  return (
    <form
      action={handleFormSubmit}
      className="space-y-6"
      aria-label="Formulaire de création d'offre d'entraide"
    >
      {/* Photo de l'offre */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-black dark:text-white">
          Photo de l&apos;offre (optionnelle)
        </label>
        
        <div className="flex items-center space-x-4">
          {photoPreview ? (
            <div className="relative">
              <img
                src={photoPreview}
                alt="Aperçu de la photo de l'offre"
                className="w-20 h-20 rounded-xl object-cover border-2 border-gray-300"
              />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                aria-label="Supprimer la photo"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div 
              className="w-20 h-20 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors border-2 border-dashed border-gray-400"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={20} className="text-gray-500" />
            </div>
          )}

          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
              aria-label="Sélectionner une photo pour l'offre"
            />
            
            {!photoPreview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-md text-green-600 hover:text-green-700 underline"
              >
                Ajouter une photo
              </button>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-md text-green-600 hover:text-green-700 underline"
              >
                Changer la photo
              </button>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Formats acceptés: JPG, PNG, GIF (max 5MB)
            </p>
          </div>
        </div>
        
        {/* Champ caché pour l'URL de la photo */}
        <input type="hidden" name="photoUrl" value={uploadedPhotoUrl || ''} />
      </div>

      {/* Titre et prix facultatif*/}
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-black dark:text-white"
        >
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
            <p className="mt-1 text-sm text-red-600">
              {state.errors.title.join(", ")}
            </p>
          )}
        </div>
      </div>

      {/* Prix (facultatif) */}
      <div className="space-y-2">
        <label
          htmlFor="price"
          className="block text-sm font-semibold text-black dark:text-white"
        >
          Prix (facultatif)
        </label>
        <input
          type="number"
          id="price"
          name="price"
          min={0}
          step="0.01"
          placeholder="ex: 10.00"
          aria-describedby="price-helper"
          className="block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-black shadow-sm focus:border-green-600 focus:ring-2 focus:ring-green-600 dark:border-gray-600 dark:bg-black dark:text-white"
        />
        <p
          id="price-helper"
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          Entrez un prix en euros (facultatif).
        </p>
      </div>

      {/* Description (full width) */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-black dark:text-white"
        >
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
            <p className="mt-1 text-sm text-red-600">
              {state.errors.description.join(", ")}
            </p>
          )}
        </div>
      </div>

      {/* Grille 2 colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Type d'offre */}
        <div className="space-y-2">
          <label
            htmlFor="type"
            className="block text-sm font-semibold text-black dark:text-white"
          >
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
              <p className="mt-1 text-sm text-red-600">
                {state.errors.type.join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label
            htmlFor="tags"
            className="block text-sm font-semibold text-black dark:text-white"
          >
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
          <p
            id="tags-helper"
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            Séparez les tags par une virgule.
          </p>
        </div>
      </div>

      {/* Grille 2 colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ville */}
        <div className="space-y-2">
          <label
            htmlFor="city"
            className="block text-sm font-semibold text-black dark:text-white"
          >
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
              <p className="mt-1 text-sm text-red-600">
                {state.errors.city.join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Code Postal */}
        <div className="space-y-2">
          <label
            htmlFor="postalCode"
            className="block text-sm font-semibold text-black dark:text-white"
          >
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
              <p className="mt-1 text-sm text-red-600">
                {state.errors.postalCode.join(", ")}
              </p>
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
        <label
          htmlFor="acceptTerms"
          className="text-sm text-black dark:text-white"
        >
          J&apos;accepte en cochant cette case que mes informations personnelles
          soient affichées dans l&apos;offre
        </label>
      </div>

      {/* Message d'erreur pour la case (si besoin) */}
      <div id="acceptTerms-error" aria-live="polite" aria-atomic="true" />

      {/* Messages d'erreur globaux */}
      {state.message && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-600">{state.message}</p>
        </div>
      )}

      {/* Bouton */}
      <SubmitButton disabled={isUploadingPhoto} />
      
      {isUploadingPhoto && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Upload de la photo en cours...
        </p>
      )}
    </form>
  );
}