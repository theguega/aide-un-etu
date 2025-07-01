// pages/api/upload-profile-photo.ts
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "profile-photos");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const form = formidable({
      uploadDir: uploadsDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: ({ mimetype }) => {
        return mimetype?.startsWith("image/") || false;
      },
    });

    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ error: "Aucun fichier trouvé" });
    }

    const timestamp = Date.now();
    const originalName = file.originalFilename || "photo";
    const extension = path.extname(originalName);
    const newFileName = `profile-${timestamp}${extension}`;
    const newFilePath = path.join(uploadsDir, newFileName);

    fs.renameSync(file.filepath, newFilePath);

    const photoUrl = `/uploads/profile-photos/${newFileName}`;
    
    res.status(200).json({ 
      url: photoUrl,
      filename: newFileName 
    });

  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    res.status(500).json({ error: "Erreur lors de l'upload du fichier" });
  }
}