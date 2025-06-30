import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, pseudo, phone, age, gender, description, city, postalCode } =
    req.body;

  try {
    const user = await prisma.user.create({
      data: {
        email,
        pseudo,
        phone,
        age: parseInt(age),
        gender,
        description,
        city,
        postalCode,
      },
    });

    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
}
