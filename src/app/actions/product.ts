'use server';

import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import { revalidatePath } from 'next/cache';

export async function createProduct(data: { title: string; brand: string; asin: string; url: string }) {
  await connectToDatabase();
  const product = await Product.create(data);
  revalidatePath('/products');
  return JSON.parse(JSON.stringify(product));
}

export async function getProducts() {
  await connectToDatabase();
  const products = await Product.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(products));
}

export async function getProductById(id: string) {
  await connectToDatabase();
  const product = await Product.findById(id);
  return JSON.parse(JSON.stringify(product));
}

export async function deleteProduct(productId: string) {
  await connectToDatabase();
  
  // Also delete associated prompts and results
  const Prompt = (await import('@/models/Prompt')).default;
  const AnalysisResult = (await import('@/models/AnalysisResult')).default;

  const prompts = await Prompt.find({ productId });
  const promptIds = prompts.map((p: any) => p._id);
  
  await AnalysisResult.deleteMany({ promptId: { $in: promptIds } });
  await Prompt.deleteMany({ productId });
  await Product.findByIdAndDelete(productId);
  
  revalidatePath('/products');
}
