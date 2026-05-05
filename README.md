# AEO Analytics Platform

Diagnose the visibility of your Amazon listings across major Large Language Models (LLMs). This platform allows you to see if models like ChatGPT, Claude, and Gemini are recommending your products for relevant search queries.

## Features

- **Product Management:** Add and manage Amazon products you want to track.
- **LLM Visibility Testing:** Generate prompts and query multiple LLMs to see if they mention your product.
- **Visibility Scoring:** Get a clear view of how well your products perform in generative search.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Make sure to set up your environment variables based on the `.env.example` file.

- `OPENAI_API_KEY`: API Key for OpenAI models.
- `ANTHROPIC_API_KEY`: API Key for Anthropic models.
- `GEMINI_API_KEY`: API Key for Google Gemini models.
