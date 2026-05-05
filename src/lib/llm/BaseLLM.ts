export interface LLMAnalysisResponse {
  full_llm_text: string;
  brands: Array<{
    brand_name: string;
    citations: string[];
  }>;
}

export interface AnalysisData {
  mentionsTarget: boolean;
  targetRank: number | null;
  recommendedBrands: string[];
  recommendedProducts: string[];
  score: number;
  rawResponse: string;
}

export abstract class BaseLLM {
  protected modelName: string;

  constructor(modelName: string) {
    this.modelName = modelName;
  }

  getName(): string {
    return this.modelName;
  }

  /**
   * Executes the prompt and returns the raw string response from the LLM.
   */
  abstract executePrompt(prompt: string): Promise<string>;

  /**
   * Executes the prompt and returns a parsed JSON object.
   */
  abstract executePromptJson<T>(prompt: string): Promise<T>;

  /**
   * Analyzes the structured JSON response to determine visibility of the target product/brand.
   */
  analyzeResponse(jsonResponse: LLMAnalysisResponse, targetProduct: string, targetBrand: string): AnalysisData {
    const lowerResponse = jsonResponse.full_llm_text.toLowerCase();
    const lowerProduct = targetProduct.toLowerCase();
    const lowerBrand = targetBrand.toLowerCase();

    // Check if the target brand is in the extracted brands list
    const brandMentioned = jsonResponse.brands.some(b => b.brand_name.toLowerCase().includes(lowerBrand) || lowerBrand.includes(b.brand_name.toLowerCase()));
    
    // Also check the full text as a fallback
    const mentionsTarget = brandMentioned || lowerResponse.includes(lowerProduct) || lowerResponse.includes(lowerBrand);
    
    let score = 0;
    let targetRank = null;

    if (mentionsTarget) {
      score = 10;
      targetRank = 1; // Rank logic to be improved later
    }

    const recommendedBrands = jsonResponse.brands.map(b => b.brand_name);

    return {
      mentionsTarget,
      targetRank,
      recommendedBrands,
      recommendedProducts: [],
      score,
      rawResponse: jsonResponse.full_llm_text,
    };
  }
}
