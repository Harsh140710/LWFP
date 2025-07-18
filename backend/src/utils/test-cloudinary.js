import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// ✅ Get __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Load correct .env from root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Resolve image path correctly
const testImage = path.resolve(__dirname, '../../public/temp/IMG_20250221_213944_637.webp');

export const testUpload = async (localFilePath) => {
  try {
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'image',
    });
    console.log("✅ Upload Success:", res.secure_url);
  } catch (err) {
    console.error("❌ Upload Failed:", err.message);
  }
};

// testUpload();