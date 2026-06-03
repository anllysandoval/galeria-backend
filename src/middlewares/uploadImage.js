import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('image');

export const uploadToCloudinary = async (req, res, next) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  try {
    upload(req, res, async (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: ['El archivo es demasiado grande, el límite es de 5MB'] });
        }
        return res.status(400).json({ message: ['Error al subir la imagen'] });
      }

      if (!req.file) {
        return res.status(400).json({ message: ['No se encontró la imagen'] });
      }

      if (!allowedMimes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: ['Tipo de archivo no permitido, solo jpeg, jpg, png y webp'] });
      }

      const base64Image = Buffer.from(req.file.buffer).toString('base64');
      const dataUri = 'data:' + req.file.mimetype + ';base64,' + base64Image;

      const uploadResponse = await cloudinary.uploader.upload(dataUri, {
        folder: 'galeria-arte',
      });
      req.urlImage = uploadResponse.secure_url;

      next();
    });
  } catch (error) {
    return res.status(400).json({ message: [error.message] });
  }
};
