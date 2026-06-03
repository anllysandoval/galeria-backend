import Order from '../models/order.models.js';
import Artwork from '../models/artwork.models.js';

// POST /api/order — Crear orden (usuario autenticado)
export const createOrder = async (req, res) => {
    try {
        const { items, paymentMethod, subTotal, iva, total, totalProducts } = req.body;

        // Validar que las obras existan y estén disponibles
        for (const item of items) {
            const artwork = await Artwork.findById(item.artworkId);
            if (!artwork)
                return res.status(400).json({ message: [`Obra ${item.artworkId} no encontrada`] });
            if (!artwork.available)
                return res.status(400).json({ message: [`La obra "${artwork.title}" no está disponible`] });
        }

        const order = await Order.create({
            user: req.userId,
            items: items.map(item => ({
                artworkId: item.artworkId,
                title:     item.title,
                imageUrl:  item.imageUrl,
                quantity:  item.quantity,
                price:     item.price,
            })),
            subTotal,
            iva,
            total,
            totalProducts,
            paymentMethod,
            status: 'received',
        });

        res.status(201).json(order);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: ['Error al crear la orden'] });
    }
};

// PUT /api/order/:id — Actualizar status (admin)
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['received', 'confirmed', 'cancelled', 'delivered'].includes(status))
            return res.status(400).json({ message: ['Estado no válido'] });

        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!order)
            return res.status(404).json({ message: ['Orden no encontrada'] });

        res.json(order);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: ['Error al actualizar la orden'] });
    }
};

// GET /api/order — Todas las órdenes (admin)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate('user', 'email name');
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: ['Error al obtener las órdenes'] });
    }
};

// GET /api/order/getuserorders — Órdenes del usuario autenticado
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: ['Error al obtener las órdenes del usuario'] });
    }
};

// GET /api/order/:id — Orden por ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'email name');
        if (!order)
            return res.status(404).json({ message: ['Orden no encontrada'] });
        res.json(order);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: ['Error al obtener la orden'] });
    }
};

// DELETE /api/order/:id — Eliminar orden cancelada (admin)
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order)
            return res.status(404).json({ message: ['Orden no encontrada'] });
        if (order.status !== 'cancelled')
            return res.status(400).json({ message: ['Solo se pueden eliminar órdenes canceladas'] });

        await Order.findByIdAndDelete(req.params.id);
        res.json(order);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: ['Error al eliminar la orden'] });
    }
};