import { z } from 'zod';

const orderItemSchema = z.object({
    artworkId:    z.string().min(1, 'artworkId requerido'),
    title:        z.string().optional(),
    imageUrl:     z.string().optional(),
    quantity:     z.number().int().positive('La cantidad debe ser mayor a 0'),
    price:        z.number().positive('El precio debe ser mayor a 0'),
});

const cardPaymentSchema = z.object({
    method: z.literal('card'),
    cardDetails: z.object({
        cardName:       z.string().min(2, 'Nombre requerido'),
        cardNumber:     z.string().min(12, 'Número de tarjeta inválido'),
        expirationDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Formato MM/YY'),
        ccv:            z.string().regex(/^\d{3,4}$/, 'CCV inválido'),
    }),
    shippingAddress: z.object({
        name:    z.string().min(2, 'Nombre requerido'),
        address: z.string().min(10, 'Dirección requerida'),
        phone:   z.string().min(10, 'Teléfono inválido'),
    }),
});

const pickupPaymentSchema = z.object({
    method:   z.literal('pickup'),
    userName: z.string().min(2, 'Nombre requerido'),
});

export const orderSchema = z.object({
    items:         z.array(orderItemSchema).min(1, 'Se requiere al menos una obra'),
    paymentMethod: z.discriminatedUnion('method', [cardPaymentSchema, pickupPaymentSchema]),
    subTotal:      z.number().positive(),
    iva:           z.number().nonnegative(),
    total:         z.number().positive(),
    totalProducts: z.number().int().positive(),
});