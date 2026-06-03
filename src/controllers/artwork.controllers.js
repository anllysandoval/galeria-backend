import Artwork from '../models/artwork.models.js';
import { v2 as cloudinary } from 'cloudinary';

// GET /api/artworks — Lista todas las obras (público)
export const getArtworks = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const artworks = await Artwork.find(filter).sort({ createdAt: -1 });
    res.json(artworks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ['Error al obtener obras'] });
  }
};

// GET /api/artworks/categories — Lista categorías únicas (público)
export const getCategories = async (req, res) => {
  try {
    const categories = await Artwork.distinct('category');
    res.json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ['Error al obtener categorías'] });
  }
};

// GET /api/artworks/:id — Detalle de una obra (público)
export const getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: ['Obra no encontrada'] });
    res.json(artwork);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ['Error al obtener la obra'] });
  }
};

// POST /api/artworks — Crear obra (solo admin)
export const createArtwork = async (req, res) => {
  try {
    const { title, artist, category, description, price } = req.body;

    if (!req.urlImage)
      return res.status(400).json({ message: ['Se requiere una imagen'] });

    const artwork = new Artwork({
      title,
      artist,
      category,
      description,
      price,
      imageUrl: req.urlImage,
      user: req.userId,
    });
    await artwork.save();
    res.status(201).json(artwork);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ['Error al crear la obra'] });
  }
};

// PUT /api/artworks/:id — Actualizar obra sin cambiar imagen (solo admin)
export const updateArtworkWithoutImage = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: ['Obra no encontrada'] });

    const dataArtwork = {
      title: req.body.title,
      artist: req.body.artist,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      available: req.body.available,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    };

    const updatedArtwork = await Artwork.findByIdAndUpdate(req.params.id, dataArtwork, { new: true });
    res.json(updatedArtwork);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ['Error al actualizar la obra'] });
  }
};

// PUT /api/artworks/updatewithimage/:id — Actualizar obra cambiando imagen (solo admin)
export const updateArtworkWithImage = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: ['Obra no encontrada'] });

    if (!req.urlImage)
      return res.status(400).json({ message: ['No se encontró la imagen'] });

    // Eliminar imagen anterior de Cloudinary
    const imageUrl = artwork.imageUrl;
    const urlArray = imageUrl.split('/');
    const image = urlArray[urlArray.length - 1];
    const imageName = image.split('.')[0];
    await cloudinary.uploader.destroy(imageName);

    const dataArtwork = {
      title: req.body.title,
      artist: req.body.artist,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      available: req.body.available,
      imageUrl: req.urlImage,
      user: req.userId,
    };

    const updatedArtwork = await Artwork.findByIdAndUpdate(req.params.id, dataArtwork, { new: true });
    res.json(updatedArtwork);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ['Error al actualizar la obra'] });
  }
};

// DELETE /api/artworks/:id — Eliminar obra (solo admin)
export const deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: ['Obra no encontrada'] });

    // Eliminar imagen de Cloudinary
    const imageUrl = artwork.imageUrl;
    const urlArray = imageUrl.split('/');
    const image = urlArray[urlArray.length - 1];
    const imageName = image.split('.')[0];
    const result = await cloudinary.uploader.destroy(imageName);
    console.log('Cloudinary result:', result);

    const deletedArtwork = await Artwork.findByIdAndDelete(req.params.id);
    if (!deletedArtwork)
      return res.status(404).json({ message: ['Obra no encontrada'] });

    return res.json(deletedArtwork);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ['Error al eliminar la obra'] });
  }
};
