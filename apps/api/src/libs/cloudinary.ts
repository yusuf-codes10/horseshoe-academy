import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file: File, folder = "avatars") => {
  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (err, result) =>
        err || !result ? reject(err) : resolve(result),
      )
      .end(buffer);
  });
};

export { cloudinary };