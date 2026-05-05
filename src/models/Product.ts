import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  brand: string;
  asin?: string;
  url?: string;
  competitors?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    brand: { type: String, required: true },
    asin: { type: String, required: false },
    url: { type: String, required: false },
    competitors: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
