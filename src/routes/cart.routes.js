import { Router } from 'express';
import { getCart, addToCart, removeFromCart, clearCart } from '../controllers/cart.controllers.js';
import { jwtCheck, jwtParse } from '../middlewares/validateToken.js';
import { validateId } from '../middlewares/validateId.js';

const router = Router();

router.get('/', jwtCheck, jwtParse, getCart);
router.post('/add', jwtCheck, jwtParse, addToCart);
router.delete('/remove/:artworkId', validateId, jwtCheck, jwtParse, removeFromCart);
router.delete('/clear', jwtCheck, jwtParse, clearCart);

export default router;
