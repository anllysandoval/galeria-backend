import { z } from 'zod';

export const artworkSchema = z.object({
  title: z.string('Título de la obra requerido').min(1, { error: 'El título es requerido' }),
  artist: z.string('Nombre del artista requerido').min(1, { error: 'El artista es requerido' }),
  category: z.string('Categoría requerida').min(1, { error: 'La categoría es requerida' }),
  description: z.string('Descripción requerida').min(1, { error: 'La descripción es requerida' }),
  price: z
    .string()
    .transform((val) => parseFloat(val))
    .pipe(
      z
        .number('Precio requerido')
        .positive('El precio debe ser mayor a 0')
        .refine((val) => !isNaN(val), { error: 'El precio debe ser un número válido' })
    ),
});

export const artworkUpdateSchema = z.object({
  title: z.string('Título de la obra requerido').optional(),
  artist: z.string('Nombre del artista requerido').optional(),
  category: z.string('Categoría requerida').optional(),
  description: z.string('Descripción requerida').optional(),
  price: z
    .number('Precio requerido')
    .positive('El precio debe ser mayor a 0')
    .optional(),
  imageUrl: z.string('URL de imagen requerida').optional(),
  available: z.boolean().optional(),
});
