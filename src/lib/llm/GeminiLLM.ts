import { BaseLLM } from './BaseLLM';
import { GoogleGenAI } from '@google/genai';

export class GeminiLLM extends BaseLLM {
  private ai: GoogleGenAI;

  constructor() {
    super('Gemini 1.5 Pro');
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async executePrompt(prompt: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || '';
  }

  async executePromptJson<T>(prompt: string): Promise<T> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    try {
      return JSON.parse(response.text || '{}') as T;
    } catch (e) {
      console.error('Failed to parse JSON from LLM:', e);
      throw new Error('Invalid JSON response from LLM');
    }
  }
}
