"use client";

import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import Image from "next/image";

function CompleteProfileForm() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    email: "",
    pseudo: "",
    phone: "",
    age: "",
    gender: "",
    description: "",
    city: "",
    postalCode: "",
    acceptCGU: false,
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const email = searchParams?.get("mail");
    const pseudo = searchParams?.get("pseudo");

    setFormData((prev) => ({
      ...prev,
      email: session?.user?.email || email || "",
      pseudo: session?.user?.name || pseudo || "",
    }));
  }, [session, searchParams]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

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

      setProfilePhoto(file);
      
      // Créer une preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setProfilePhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-profile-photo', {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptCGU) {
      alert("Vous devez accepter les conditions générales d'utilisation.");
      return;
    }

    setIsUploading(true);

    try {
      let profilePhotoUrl = null;
      
      // Upload de la photo si présente
      if (profilePhoto) {
        profilePhotoUrl = await uploadPhoto(profilePhoto);
        if (!profilePhotoUrl) {
          alert("Erreur lors de l'upload de la photo. Veuillez réessayer.");
          setIsUploading(false);
          return;
        }
      }

      // Envoi des données du profil
      const profileData = {
        ...formData,
        profilePhotoUrl,
      };

      const res = await fetch("/api/complete-profile", {
        method: "POST",
        body: JSON.stringify(profileData),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        await signIn("custom-provider", { callbackUrl: "/" });
      } else {
        alert("Erreur lors de la création du profil. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="max-w-lg mx-auto p-6 mt-2 bg-white rounded-2xl shadow-xl text-black
                 dark:bg-black dark:text-white border border-gray-300"
    >
      <h1 className="text-2xl font-bold mb-6">Compléter votre profil</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        aria-label="Formulaire de complétion de profil"
      >
        {/* Photo de profil */}
        <div className="flex flex-col items-center">
          <label className="mb-2 font-semibold">Photo de profil (optionnelle)</label>
          
          <div className="relative">
            {photoPreview ? (
              <div className="relative">
                <Image
                  src={photoPreview}
                  alt="Aperçu de la photo de profil"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
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
                className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={24} className="text-gray-500" />
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoSelect}
            className="hidden"
            aria-label="Sélectionner une photo de profil"
          />
          
          {!photoPreview && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-sm text-green-600 hover:text-green-700 underline"
            >
              Ajouter une photo
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
          {/* Pseudo */}
          <div className="flex flex-col">
            <label htmlFor="pseudo" className="mb-1 font-semibold">
              Pseudo{" "}
              <span aria-hidden="true" className="text-red-600">
                *
              </span>
            </label>
            <Input
              id="pseudo"
              name="pseudo"
              type="text"
              required
              placeholder="Votre pseudo"
              value={formData.pseudo}
              onChange={handleChange}
              aria-required="true"
            />
          </div>

          {/* Téléphone */}
          <div className="flex flex-col">
            <label htmlFor="phone" className="mb-1 font-semibold">
              Téléphone
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Ex : +33 6 12 34 56 78"
              value={formData.phone}
              onChange={handleChange}
              aria-describedby="phone-desc"
            />
          </div>

          {/* Âge */}
          <div className="flex flex-col">
            <label htmlFor="age" className="mb-1 font-semibold">
              Âge
            </label>
            <Input
              id="age"
              name="age"
              type="number"
              min={0}
              max={120}
              placeholder="Votre âge"
              value={formData.age}
              onChange={handleChange}
            />
          </div>

          {/* Genre */}
          <div className="flex flex-col">
            <label htmlFor="gender" className="mb-1 font-semibold">
              Genre
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-black"
              aria-describedby="gender-desc"
            >
              <option value="">-- Sélectionnez --</option>
              <option value="female">Femme</option>
              <option value="male">Homme</option>
              <option value="other">Autre / Préfère ne pas dire</option>
            </select>
          </div>

          {/* Description - prend les 2 colonnes */}
          <div className="flex flex-col col-span-1 sm:col-span-2">
            <label htmlFor="description" className="mb-1 font-semibold">
              Description{" "}
              <span aria-hidden="true" className="text-red-600">
                *
              </span>
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Parlez un peu de vous ou de qui vous êtes, ce que vous proposez..."
              required
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 rounded-2xl border border-gray-300 resize-y dark:border-gray-600 bg-white dark:bg-black"
            />
          </div>

          {/* Ville */}
          <div className="flex flex-col">
            <label htmlFor="city" className="mb-1 font-semibold">
              Ville{" "}
              <span aria-hidden="true" className="text-red-600">
                *
              </span>
            </label>
            <Input
              id="city"
              name="city"
              type="text"
              required
              placeholder="Votre ville"
              value={formData.city}
              onChange={handleChange}
              aria-required="true"
            />
          </div>

          {/* Code postal */}
          <div className="flex flex-col">
            <label htmlFor="postalCode" className="mb-1 font-semibold">
              Code postal{" "}
              <span aria-hidden="true" className="text-red-600">
                *
              </span>
            </label>
            <Input
              id="postalCode"
              name="postalCode"
              type="text"
              required
              placeholder="Code postal"
              value={formData.postalCode}
              onChange={handleChange}
              aria-required="true"
            />
          </div>

          {/* Case à cocher CGU - prend les 2 colonnes */}
          <div className="flex items-start col-span-1 sm:col-span-2">
            <input
              id="acceptCGU"
              name="acceptCGU"
              type="checkbox"
              className="mt-1 mr-2 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              required
              checked={formData.acceptCGU}
              onChange={handleChange}
            />
            <label htmlFor="acceptCGU" className="text-sm select-none">
              J&apos;accepte les{" "}
              <a
                href="/cgu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline hover:text-green-700"
              >
                conditions générales d&apos;utilisation
              </a>{" "}
              et la{" "}
              <a
                href="/rgpd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline hover:text-green-700"
              >
                politique de confidentialité (RGPD)
              </a>
              .
            </label>
          </div>

          {/* Bouton - prend les 2 colonnes */}
          <div className="col-span-1 sm:col-span-2">
            <Button
              type="submit"
              disabled={isUploading}
              className="w-full bg-green-600 hover:bg-green-700 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Envoyer le formulaire de complétion du profil"
            >
              {isUploading ? "Création en cours..." : "Envoyer"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CompleteProfilePage() {
  useEffect(() => {
    document.title = "Création profil - Aide-un-étudiant";
  }, []);

  return (
    <Suspense fallback={
      <div className="max-w-lg mx-auto p-6 mt-2 bg-white rounded-2xl shadow-xl text-black dark:bg-black dark:text-white border border-gray-300">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <CompleteProfileForm />
    </Suspense>
  );
}