"use client"

import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function CompleteProfilePage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()

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
  })

  useEffect(() => {
    const email = searchParams.get("mail")
    const pseudo = searchParams.get("pseudo")

    setFormData((prev) => ({
      ...prev,
      email: session?.user?.email || email || "",
      pseudo: session?.user?.name || pseudo || ""
    }))
  }, [session, searchParams])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.acceptCGU) {
      alert("Vous devez accepter les conditions générales d'utilisation.")
      return
    }

    const res = await fetch("/api/complete-profile", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    })

    if (res.ok) {
      await signIn("custom-provider", { callbackUrl: "/" })
    }
  }

  return (
    <div
      className="max-w-lg mx-auto p-6 mt-2 bg-white rounded-2xl shadow-xl text-black
                 dark:bg-black dark:text-white border border-gray-300"
    >
      <h1 className="text-2xl font-bold mb-6">Compléter votre profil</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6"
        aria-label="Formulaire de complétion de profil"
      >
        {/* Pseudo */}
        <div className="flex flex-col">
          <label htmlFor="pseudo" className="mb-1 font-semibold">
            Pseudo <span aria-hidden="true" className="text-red-600">*</span>
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
            className="w-full p-2 rounded-2xl border border-gray-300 dark:border-gray-600"
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
            Description <span aria-hidden="true" className="text-red-600">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Parlez un peu de vous ou de qui vous êtes, ce que vous proposez..."
            required
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 rounded-2xl border border-gray-300 resize-y dark:border-gray-600"
          />
        </div>

        {/* Ville */}
        <div className="flex flex-col">
          <label htmlFor="city" className="mb-1 font-semibold">
            Ville <span aria-hidden="true" className="text-red-600">*</span>
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
            Code postal <span aria-hidden="true" className="text-red-600">*</span>
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
            checked={formData.acceptCGU}
            onChange={handleChange}
            className="mt-1 mr-2 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            required
          />
          <label htmlFor="acceptCGU" className="text-sm select-none">
            J'accepte les{" "}
            <a
              href="/cgu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 underline hover:text-green-700"
            >
              conditions générales d'utilisation
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
            className="w-full bg-green-600 hover:bg-green-700 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
            aria-label="Envoyer le formulaire de complétion du profil"
          >
            Envoyer
          </Button>
        </div>
      </form>
    </div>
  )
}
