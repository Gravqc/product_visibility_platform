'use server';

import connectToDatabase from '@/lib/db';
import Prompt from '@/models/Prompt';
import AnalysisResult from '@/models/AnalysisResult';
import Product from '@/models/Product';
import { OpenAILLM } from '@/lib/llm/OpenAILLM';
import { LLMAnalysisResponse } from '@/lib/llm/BaseLLM';
import { GENERATE_QUERIES_PROMPT, ANALYSIS_PROMPT } from '@/lib/llm/prompts';
import { revalidatePath } from 'next/cache';

// Generate prompts for the product using LLM
export async function generatePromptsForProduct(productId: string) {
  await connectToDatabase();
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');

  const llm = new OpenAILLM();
  const promptStr = GENERATE_QUERIES_PROMPT.replace('{product_title}', product.title).replace('{product_brand}', product.brand);
  
  let generatedQueries: string[] = [];
  try {
    const result = await llm.executePromptJson<{ queries: string[] }>(promptStr);
    generatedQueries = result.queries || [];
  } catch (err) {
    console.error('Failed to generate queries via LLM', err);
    // Fallback if LLM fails
    generatedQueries = [
      `What are the best ${product.brand} products?`,
      `Can you recommend a good alternative to ${product.title}?`,
      `Is ${product.title} worth it?`,
    ];
  }

  const prompts = await Promise.all(
    generatedQueries.map(async (text) => {
      return await Prompt.create({
        productId,
        text,
        status: 'PENDING',
      });
    })
  );

  revalidatePath(`/products/${productId}`);
  return JSON.parse(JSON.stringify(prompts));
}

export async function getPromptsForProduct(productId: string) {
  await connectToDatabase();
  const prompts = await Prompt.find({ productId }).sort({ createdAt: 1 });
  return JSON.parse(JSON.stringify(prompts));
}

export async function getAnalysisResultsForProduct(productId: string) {
  await connectToDatabase();
  const prompts = await Prompt.find({ productId });
  const promptIds = prompts.map(p => p._id);
  
  const results = await AnalysisResult.find({ promptId: { $in: promptIds } });
  return JSON.parse(JSON.stringify(results));
}

export async function runAnalysisForPrompt(promptId: string) {
  await connectToDatabase();
  const prompt = await Prompt.findById(promptId).populate('productId');
  if (!prompt || !prompt.productId) throw new Error('Prompt or Product not found');

  // Update status to running
  prompt.status = 'RUNNING';
  await prompt.save();

  try {
    const product = prompt.productId as any;
    const llm = new OpenAILLM();
    
    // Use structured JSON prompting for analysis
    const llmPrompt = ANALYSIS_PROMPT.replace('{user_query}', prompt.text);
    
    const jsonResponse = await llm.executePromptJson<LLMAnalysisResponse>(llmPrompt);
    const analysisData = llm.analyzeResponse(jsonResponse, product.title, product.brand);

    await AnalysisResult.create({
      promptId: prompt._id,
      llmName: llm.getName(),
      ...analysisData
    });

    prompt.status = 'COMPLETED';
    await prompt.save();
    
    revalidatePath(`/products/${product._id.toString()}`);
  } catch (error) {
    console.error('Analysis failed:', error);
    prompt.status = 'FAILED';
    await prompt.save();
  }
}

export async function runFullAnalysis(productId: string, forceReRun = false) {
  await connectToDatabase();
  
  if (forceReRun) {
    const prompts = await Prompt.find({ productId });
    const promptIds = prompts.map(p => p._id);
    await AnalysisResult.deleteMany({ promptId: { $in: promptIds } });
    await Prompt.updateMany({ productId }, { status: 'PENDING' });
  }

  // 1. Generate if not exist
  const existingPrompts = await Prompt.find({ productId });
  if (existingPrompts.length === 0) {
    await generatePromptsForProduct(productId);
  }

  const promptsToRun = await Prompt.find({ 
    productId, 
    status: { $in: ['PENDING', 'FAILED'] } 
  });
  
  // 2. Run analysis in batches of 3
  const chunkSize = 3;
  for (let i = 0; i < promptsToRun.length; i += chunkSize) {
    const chunk = promptsToRun.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(prompt => runAnalysisForPrompt(prompt._id.toString()))
    );
  }

  revalidatePath(`/products/${productId}`);
}
