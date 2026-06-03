import { Router } from 'express';
import { jwtCheck, jwtParse } from '../middlewares/validateToken.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { validateId } from '../middlewares/validateId.js';
import { orderSchema } from '../schemas/order.schema.js';
import {
    createOrder,
    updateOrderStatus,
    getAllOrders,
    getUserOrders,
    getOrderById,
    deleteOrder,
} from '../controllers/order.controllers.js';

const router = Router();

// Crear orden (usuario autenticado)
router.post('/', jwtCheck, jwtParse, validateSchema(orderSchema), createOrder);

// Actualizar status (admin)
router.put('/:id', validateId, jwtCheck, jwtParse, isAdmin, updateOrderStatus);

// Todas las órdenes (admin)
router.get('/', jwtCheck, jwtParse, isAdmin, getAllOrders);

// Órdenes del usuario autenticado
router.get('/getuserorders', jwtCheck, jwtParse, getUserOrders);

// Orden por ID
router.get('/:id', validateId, jwtCheck, jwtParse, getOrderById);

// Eliminar orden cancelada (admin)
router.delete('/:id', validateId, jwtCheck, jwtParse, isAdmin, deleteOrder);

export default router;