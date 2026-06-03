import { Router } from 'express';
import {
  getArtworks,
  getArtworkById,
  getCategories,
  createArtwork,
  updateArtworkWithoutImage,
  updateArtworkWithImage,
  deleteArtwork,
} from '../controllers/artwork.controllers.js';
import { jwtCheck, jwtParse } from '../middlewares/validateToken.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { uploadToCloudinary } from '../middlewares/uploadImage.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { artworkSchema, artworkUpdateSchema } from '../schemas/artwork.schemas.js';
import { validateId } from '../middlewares/validateId.js';

const router = Router();

// Rutas públicas
router.get('/', getArtworks);
router.get('/categories', getCategories);
router.get('/:id', validateId, getArtworkById);

// Solo admin
router.post('/', jwtCheck, jwtParse, isAdmin, uploadToCloudinary, validateSchema(artworkSchema), createArtwork);
router.put('/:id', validateId, jwtCheck, jwtParse, isAdmin, validateSchema(artworkUpdateSchema), updateArtworkWithoutImage);
router.put('/updatewithimage/:id', validateId, jwtCheck, jwtParse, isAdmin, uploadToCloudinary, validateSchema(artworkSchema), updateArtworkWithImage);
router.delete('/:id', validateId, jwtCheck, jwtParse, isAdmin, deleteArtwork);

export default router;
