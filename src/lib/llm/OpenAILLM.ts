import { BaseLLM } from './BaseLLM';
import OpenAI from 'openai';

export class OpenAILLM extends BaseLLM {
  private openai: OpenAI;

  constructor() {
    super('OpenAI GPT-4o');
    // Using OPEN_API_KEY as per the .env file setup
    this.openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY });
  }

  async executePrompt(prompt: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content || '';
  }

  async executePromptJson<T>(prompt: string): Promise<T> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });
    
    try {
      return JSON.parse(response.choices[0].message.content || '{}') as T;
    } catch (e) {
      console.error('Failed to parse JSON from LLM:', e);
      throw new Error('Invalid JSON response from LLM');
    }
  }
}
