"use server";
import { z } from "zod";
import { OfferType } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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
  price: z.string().optional(),
  city: z.string().min(2, { message: "La ville est requise." }),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, { message: "Le code postal doit contenir 5 chiffres." }),
});

// Validation du fichier photo
const PhotoSchema = z.object({
  size: z.number().max(5 * 1024 * 1024, { message: "La photo ne doit pas dépasser 5MB." }),
  type: z.string().refine(
    (type) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(type),
    { message: "Seuls les formats JPEG, PNG et WebP sont acceptés." }
  ),
});

export type FormState = {
  errors?: {
    title?: string[];
    description?: string[];
    type?: string[];
    city?: string[];
    postalCode?: string[];
    price?: string[];
    tags?: string[];
    photo?: string[];
  };
  message?: string;
};

async function savePhoto(file: File): Promise<string> {
  // Créer le dossier s'il n'existe pas
  const uploadDir = path.join(process.cwd(), "public/uploads/offer-photos");
  await mkdir(uploadDir, { recursive: true });

  // Générer un nom unique pour le fichier
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
  const filePath = path.join(uploadDir, fileName);

  // Convertir le fichier en buffer et l'écrire
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filePath, buffer);

  // Retourner l'URL relative pour la base de données
  return `/uploads/offer-photos/${fileName}`;
}

export async function createOffer(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return {
      message: "Vous devez être connecté pour créer une offre.",
      errors: { title: ["Veuillez vous connecter."] },
    };
  }

  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return {
      message: "Utilisateur introuvable. Veuillez vous reconnecter.",
      errors: { title: ["Utilisateur introuvable."] },
    };
  }

  // Validation des champs du formulaire
  const validatedFields = CreateOfferSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    tags: formData.get("tags"),
    price: formData.get("price"),
    city: formData.get("city"),
    postalCode: formData.get("postalCode"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Veuillez corriger les erreurs dans le formulaire.",
    };
  }

  // Gestion de la photo (optionnelle)
  let photoUrl: string | null = null;
  const photoFile = formData.get("photo") as File;
  
  if (photoFile && photoFile.size > 0) {
    // Validation de la photo
    const photoValidation = PhotoSchema.safeParse({
      size: photoFile.size,
      type: photoFile.type,
    });

    if (!photoValidation.success) {
      return {
        errors: {
          photo: photoValidation.error.flatten().fieldErrors.size || 
                 photoValidation.error.flatten().fieldErrors.type || 
                 ["Format de photo invalide."]
        },
        message: "Veuillez corriger les erreurs dans le formulaire.",
      };
    }

    try {
      photoUrl = await savePhoto(photoFile);
    } catch (error) {
      return {
        message: "Erreur lors de l'upload de la photo.",
        errors: { photo: ["Impossible de sauvegarder la photo."] },
      };
    }
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
        price: validatedFields.data.price
          ? parseFloat(validatedFields.data.price)
          : null,
        photoUrl: photoUrl,
        authorId: userId,
      },
    });
  } catch (error) {
    return {
      message:
        "Une erreur est survenue lors de la création de l'offre : " + error,
    };
  }

  revalidatePath("/(categories)/objets");
  revalidatePath("/(categories)/services");
  revalidatePath("/(categories)/connaissances");
  redirect("/");
}