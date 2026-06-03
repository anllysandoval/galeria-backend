import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        items: [
            {
                artworkId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Artwork'
                },
                title:    { type: String },
                imageUrl: { type: String },
                quantity: Number,
                price:    Number,
            }
        ],
        subTotal:      { type: Number, required: true },
        iva:           { type: Number, required: true },
        total:         { type: Number, required: true },
        totalProducts: { type: Number, required: true },
        paymentMethod: {
            method: {
                type: String,
                required: true,
                enum: ['card', 'pickup'],
                default: 'card'
            },
            cardDetails: {
                cardName: {
                    type: String, trim: true,
                    required: function () { return this.paymentMethod.method === 'card'; }
                },
                cardNumber: {
                    type: String, trim: true,
                    required: function () { return this.paymentMethod.method === 'card'; },
                    validate: {
                        validator: (v) => /^\d{12,19}$/.test(v.replace(/\s+/g, '')),
                        message: (p) => `${p.value} no es un número válido`
                    }
                },
                expirationDate: {
                    type: String, trim: true,
                    required: function () { return this.paymentMethod.method === 'card'; },
                    validate: {
                        validator: (v) => /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(v),
                        message: (p) => `${p.value} no es una fecha válida (MM/YY)`
                    }
                },
                ccv: {
                    type: String, trim: true,
                    required: function () { return this.paymentMethod.method === 'card'; },
                    validate: {
                        validator: (v) => /^\d{3,4}$/.test(v),
                        message: (p) => `${p.value} no es un CCV válido`
                    }
                },
            },
            shippingAddress: {
                name: {
                    type: String, trim: true,
                    required: function () { return this.paymentMethod.method === 'card'; }
                },
                address: {
                    type: String, trim: true,
                    required: function () { return this.paymentMethod.method === 'card'; }
                },
                phone: {
                    type: String, trim: true,
                    required: function () { return this.paymentMethod.method === 'card'; },
                    validate: {
                        validator: (v) => /^[\d\s\+\-\(\)]{7,20}$/.test(v),
                        message: (p) => `${p.value} no es un teléfono válido`
                    }
                },
            },
            userName: {
                type: String, trim: true,
                required: function () { return this.paymentMethod.method === 'pickup'; }
            },
        },
        status: {
            type: String,
            enum: ['received', 'confirmed', 'cancelled', 'delivered'],
            default: 'received'
        },
    },
    { timestamps: true }
);

export default mongoose.model('Order', OrderSchema);