"use server";

import { z } from "zod";
import { OfferType } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const CreateOfferSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Le titre doit faire au moins 5 caractères." }),
  description: z
    .string()
    .min(5, { message: "La description doit faire au moins 5 caractères." }),
  type: z.nativeEnum(OfferType, {
    errorMap: () => ({ message: "Veuillez sélectionner un type valide." }),
  }),
  tags: z.string(),
  city: z.string().min(2, { message: "La ville est requise." }),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, { message: "Le code postal doit contenir 5 chiffres." }),
});

// État initial pour notre hook useActionState
export type FormState = {
  errors?: {
    title?: string[];
    description?: string[];
    type?: string[];
    city?: string[];
    postalCode?: string[];
    tags?: string[];
  };
  message?: string;
};

export async function createOffer(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // const session = await getSession();
  // if (!session) {
  //   return {
  //     message: "Vous devez être connecté pour créer une offre.",
  //     errors: { title: ["Veuillez vous connecter."] },
  //   };
  // }
  const fakeUserId = "user1"; // TODO: Remplacez par session.user.id plus tard

  // Vérifie si l'utilisateur existe avant de créer l'offre
  const user = await prisma.user.findUnique({
    where: { id: fakeUserId },
  });
  if (!user) {
    return {
      message: "Utilisateur introuvable. Veuillez vous reconnecter.",
      errors: { title: ["Utilisateur introuvable."] },
    };
  }

  const validatedFields = CreateOfferSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    tags: formData.get("tags"),
    city: formData.get("city"),
    postalCode: formData.get("postalCode"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Veuillez corriger les erreurs dans le formulaire.",
    };
  }

  try {
    await prisma.offer.create({
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        type: validatedFields.data.type,
        city: validatedFields.data.city,
        postalCode: validatedFields.data.postalCode,
        tags: validatedFields.data.tags,
        authorId: fakeUserId,
      },
    });
  } catch (error) {
    return {
      message:
        "Une erreur est survenue lors de la création de l'offre : " + error,
    };
  }

  // -- ÉCO-CONCEPTION: On invalide le cache des pages de listes pour qu'elles affichent la nouvelle offre
  revalidatePath("/(categories)/objets");
  revalidatePath("/(categories)/services");
  revalidatePath("/(categories)/connaissances");

  // On redirige l'utilisateur vers la page principale
  redirect("/");
}
