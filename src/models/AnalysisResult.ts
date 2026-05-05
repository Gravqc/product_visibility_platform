import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalysisResult extends Document {
  promptId: mongoose.Types.ObjectId;
  llmName: string;
  mentionsTarget: boolean;
  targetRank: number | null;
  recommendedBrands: string[];
  brandsData: {
    brand_name: string;
    citations: string[];
  }[];
  recommendedProducts: string[];
  score: number;
  rawResponse: string;
  createdAt: Date;
  updatedAt: Date;
}

const AnalysisResultSchema: Schema = new Schema(
  {
    promptId: { type: Schema.Types.ObjectId, ref: 'Prompt', required: true },
    llmName: { type: String, required: true },
    mentionsTarget: { type: Boolean, required: true, default: false },
    targetRank: { type: Number, default: null },
    recommendedBrands: [{ type: String }],
    brandsData: [{
      brand_name: { type: String },
      citations: [{ type: String }]
    }],
    recommendedProducts: [{ type: String }],
    score: { type: Number, required: true, default: 0 },
    rawResponse: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.AnalysisResult || mongoose.model<IAnalysisResult>('AnalysisResult', AnalysisResultSchema);
