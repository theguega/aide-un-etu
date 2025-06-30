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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow-xl rounded-2xl dark:bg-black text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Compléter votre profil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="pseudo"
          placeholder="Pseudo"
          required
          value={formData.pseudo}
          onChange={handleChange}
        />
        <Input name="phone" placeholder="Téléphone" onChange={handleChange} />
        <Input name="age" type="number" placeholder="Âge" onChange={handleChange} />
        <Input name="gender" placeholder="Genre" onChange={handleChange} />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 rounded-2xl border-1 border-gray-300"
          onChange={handleChange}
        ></textarea>
        <Input name="city" placeholder="Ville" onChange={handleChange} />
        <Input name="postalCode" placeholder="Code postal" onChange={handleChange} />
        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
          Envoyer
        </Button>
      </form>
    </div>
  )
}
