export const GENERATE_QUERIES_PROMPT = `
You are an SEO/AEO expert. A user wants to test the visibility of their brand and product.
Generate 5 realistic, natural search queries that a typical consumer might ask an AI or search engine when looking for products in this category. These queries should be ones where the target brand/product OUGHT to show up if it had good visibility.
Refrain from generating queries that contain the brand name or product title or ASIN.

Target Product Title: {product_title}
Target Brand: {product_brand}

Provide the output strictly as a JSON object with a single key "queries" containing an array of 5 strings.
Example:
{
  "queries": [
    "What is the best whey protein for muscle gain?",
    "Can you recommend a high quality protein powder?",
    ...
  ]
}
`;

export const ANALYSIS_PROMPT = `
A user is asking the following query: "{user_query}"

First, generate a comprehensive, helpful response to this query as if you are an AI assistant recommending products to the user.
Then, extract the brands you explicitly mentioned in your response.

Return the result STRICTLY as a JSON object matching this exact schema:
{
  "full_llm_text": "Your full markdown response to the user's query",
  "brands": [
    {
      "brand_name": "Name of the brand",
      "citations": ["A URL or link you searched up to verify this brand. If no link is available, provide a snippet from your text"]
    }
  ]
}
`;
