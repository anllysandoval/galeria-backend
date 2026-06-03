import Cart from '../models/cart.models.js';
import Artwork from '../models/artwork.models.js';
import mongoose from 'mongoose';

// GET /api/cart — Obtener carrito del usuario autenticado
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.auth0Id });
    if (!cart) return res.json({ userId: req.auth0Id, items: [] });
    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ['Error al obtener el carrito'] });
  }
};

// POST /api/cart/add — Agregar obra al carrito
export const addToCart = async (req, res) => {
  try {
    const { artworkId } = req.body;

    const artwork = await Artwork.findById(artworkId);
    if (!artwork) return res.status(404).json({ message: ['Obra no encontrada'] });
    if (!artwork.available) return res.status(400).json({ message: ['Obra no disponible'] });

    let cart = await Cart.findOne({ userId: req.auth0Id });
    if (!cart) {
      cart = new Cart({ userId: req.auth0Id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.artworkId.toString() === artworkId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        artworkId: artwork._id,
        title: artwork.title,
        imageUrl: artwork.imageUrl,
        price: artwork.price,
        quantity: 1,
      });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ['Error al agregar al carrito'] });
  }
};

// DELETE /api/cart/remove/:artworkId — Eliminar obra del carrito
export const removeFromCart = async (req, res) => {
  try {
    const { artworkId } = req.params;
    const cart = await Cart.findOne({ userId: req.auth0Id });
    if (!cart) return res.status(404).json({ message: ['Carrito no encontrado'] });

    cart.items = cart.items.filter(
      (item) => item.artworkId.toString() !== artworkId
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ['Error al eliminar del carrito'] });
  }
};

// DELETE /api/cart/clear — Vaciar carrito
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.auth0Id });
    if (!cart) return res.json({ message: ['Carrito ya vacío'] });

    cart.items = [];
    await cart.save();
    res.json({ message: ['Carrito vaciado'] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ['Error al vaciar el carrito'] });
  }
};
