// seed-artworks.js
// Uso: npm run seed
// Inserta obras de ejemplo usando la misma conexión MongoDB del .env

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../db.js';

dotenv.config();

await connectDB();

// Obtener modelos
const Role = mongoose.model('Role', new mongoose.Schema({ role: String }));
const User = mongoose.model('User', new mongoose.Schema({
  auth0Id: String,
  email: String,
  name: String,
  role: mongoose.Schema.Types.ObjectId,
}));
const Artwork = mongoose.model('Artwork', new mongoose.Schema({
  title: String,
  artist: String,
  category: String,
  description: String,
  price: Number,
  imageUrl: String,
  available: Boolean,
  user: mongoose.Schema.Types.ObjectId,
}, { timestamps: true }));

const admin = await User.findOne();
if (!admin) {
  console.log('ERROR: No se encontró ningún usuario. Ejecuta primero: npm run setup');
  process.exit(1);
}

console.log('Usando usuario admin: ' + admin.email + ' (' + admin._id + ')');

await Artwork.deleteMany({});
console.log('Obras anteriores eliminadas.');

const artworks = [
  {
    title: 'Amanecer en el Desierto',
    artist: 'Elena Vargas',
    category: 'Pintura',
    description: 'Óleo sobre lienzo que captura los tonos naranjas y dorados del amanecer en el desierto de Sonora. Una obra de gran serenidad y fuerza.',
    price: 12500,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    available: true,
    user: admin._id,
  },
  {
    title: 'Fragmentos de Identidad',
    artist: 'Marco Reyes',
    category: 'Arte Abstracto',
    description: 'Acrílico sobre tela. Una exploración visual de la identidad fragmentada en la era digital, con texturas geométricas y colores contrastantes.',
    price: 8900,
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
    available: true,
    user: admin._id,
  },
  {
    title: 'La Vendedora de Flores',
    artist: 'Sofía Mendoza',
    category: 'Fotografía',
    description: 'Fotografía artística en blanco y negro intervenida con acuarela. Retrato de una vendedora en el mercado de Jamaica, Ciudad de México.',
    price: 4200,
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88df5691cc82?w=800',
    available: true,
    user: admin._id,
  },
  {
    title: 'Raíces',
    artist: 'Carlos Ibáñez',
    category: 'Escultura',
    description: 'Escultura en madera de mezquite tallada a mano. Representa la conexión del ser humano con la tierra y sus orígenes ancestrales. Pieza única.',
    price: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800',
    available: true,
    user: admin._id,
  },
  {
    title: 'Mercado de Colores',
    artist: 'Ana Lucía Torres',
    category: 'Pintura',
    description: 'Acuarela de gran formato que retrata la vida y el color de un mercado tradicional mexicano. Técnica mixta con pigmentos naturales.',
    price: 6800,
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    available: true,
    user: admin._id,
  },
  {
    title: 'Nebulosa Interior',
    artist: 'Diego Fuentes',
    category: 'Arte Digital',
    description: 'Impresión giclée de alta resolución sobre papel de algodón 300g. Visualización generativa de estructuras neuronales inspiradas en nebulosas espaciales.',
    price: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800',
    available: true,
    user: admin._id,
  },
  {
    title: 'El Abrazo',
    artist: 'Valentina Cruz',
    category: 'Escultura',
    description: 'Bronce fundido a la cera perdida. Dos figuras entrelazadas en un abrazo eterno. Edición limitada de 5 piezas numeradas y firmadas.',
    price: 35000,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    available: false,
    user: admin._id,
  },
  {
    title: 'Luz de Madrugada',
    artist: 'Roberto Salinas',
    category: 'Fotografía',
    description: 'Serie de 3 fotografías de larga exposición tomadas entre las 3 y 5am en distintas ciudades de México. Impresión sobre aluminio dibond.',
    price: 7200,
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
    available: true,
    user: admin._id,
  },
  {
    title: 'Geometría Sagrada',
    artist: 'Daniela Ortiz',
    category: 'Arte Abstracto',
    description: 'Óleo y pan de oro sobre madera. Composición geométrica basada en proporciones áureas y patrones de la geometría sagrada mesoamericana.',
    price: 15800,
    imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800',
    available: true,
    user: admin._id,
  },
  {
    title: 'Retrato de mi Abuela',
    artist: 'Luis Herrera',
    category: 'Pintura',
    description: 'Carboncillo y sanguina sobre papel Fabriano. Retrato hiperrealista de una anciana zapoteca. Premio nacional de dibujo 2023.',
    price: 9400,
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
    available: true,
    user: admin._id,
  },
];

const result = await Artwork.insertMany(artworks);
console.log('✅ ' + result.length + ' obras insertadas correctamente.');
console.log('Categorías: Pintura, Arte Abstracto, Fotografía, Escultura, Arte Digital');
process.exit(0);