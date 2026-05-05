import mongoose, { Schema, Document } from 'mongoose';

export interface IPrompt extends Document {
  productId: mongoose.Types.ObjectId;
  text: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

const PromptSchema: Schema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    text: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Prompt || mongoose.model<IPrompt>('Prompt', PromptSchema);
