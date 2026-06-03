import mongoose, { Schema } from 'mongoose';

const cartItemSchema = new Schema({
  artworkId: { type: Schema.Types.ObjectId, ref: 'Artwork', required: true },
  title:     { type: String, required: true },
  imageUrl:  { type: String, required: true },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true, default: 1 },
});

const cartSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    items:  { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('Cart', cartSchema);
