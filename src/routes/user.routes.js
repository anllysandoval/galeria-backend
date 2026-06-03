import { Router } from 'express';
import { createUser, updateUser, getUser } from '../controllers/user.controllers.js';
import { jwtCheck, jwtParse } from '../middlewares/validateToken.js';

const router = Router();

// Crear usuario tras el login de Auth0 (requiere token válido de Auth0)
router.post('/', jwtCheck, createUser);

// Actualizar nombre del usuario autenticado
router.put('/', jwtCheck, jwtParse, updateUser);

// Obtener datos del usuario autenticado
router.get('/', jwtCheck, jwtParse, getUser);

export default router;
