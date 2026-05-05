# AEO Analytics Platform - Design Document

## 1. Overview
The AEO (Answer Engine Optimization) Analytics Platform is a diagnostic tool designed to evaluate the visibility of Amazon listings across major Large Language Models (LLMs) used as search engines. 

As traditional SEO evolves into AEO, sellers need to know if models like ChatGPT, Claude, and Gemini are recommending their products to users querying for solutions (e.g., "What is the best magnesium supplement for seniors?").

## 2. Core Workflow

1. **User Input:**
   - **Amazon Product Link (or ASIN):** The product the user wants to diagnose.
   - **Target Query:** The search prompt the user wants to test (e.g., "best budget running shoes for flat feet").
   - *(Optional)* **Target Brand Name:** To easily identify if the brand was mentioned.

2. **Product Extraction:**
   - Fetch basic details from the provided Amazon URL (Product Title, Brand, ASIN) to understand the target product.

3. **LLM Query Engine:**
   - Asynchronously send the **Target Query** to multiple LLM APIs:
     - OpenAI (GPT-4o)
     - Anthropic (Claude 3.5 Sonnet)
     - Google (Gemini 1.5 Pro)
   - Prompt engineering will be required to simulate a standard user asking for product recommendations, asking the models to return specific, ranked lists of products.

4. **Response Parsing & Entity Extraction:**
   - Analyze the textual output from each LLM.
   - Extract recommended brands and products.
   - Check if the **Target Product/Brand** is present in the recommendations.
   - Determine the rank/position of the target product in the LLM's response.

5. **Scoring & Report Card Generation:**
   - **Visibility Score Calculation:** Based on presence across the 3 models, and the rank within the model's response (e.g., Mentioned 1st = highest points, Mentioned 5th = lower points, Not mentioned = 0 points).
   - **Competitor Analysis:** Aggregate the most frequently recommended competitors across the models.
   - **Report Card Output:** Present the user with a dashboard showing their score, breakdown per AI, and top competitors dominating the query.

## 3. Technology Stack

- **Framework:** Next.js (App Router) with TypeScript.
- **Styling:** TailwindCSS for a minimal, clean, light-theme-only design (no dark mode).
- **Database:** MongoDB (via Mongoose) to store products, generated prompts, and visibility analysis results.
- **LLM Integrations:**
  - Object-Oriented design: All LLM models will be abstracted into their own classes (e.g., `GeminiModel`, `ClaudeModel`).
  - Initially, we will only implement and run the **Gemini** model for analysis.
- **Data Flow:**
  - Products are stored in MongoDB.
  - The system automatically generates 5-10 user-like search prompts for a given product.
  - The LLM classes run these prompts, compute the visibility score (is the product present?), and save the results back to MongoDB.

## 4. Application Structure & UI

1. **Home Page (`/`)**:
   - A landing page describing the project.
   - A "Test" button that navigates to the core application (Product Listing).

2. **Product Listing Page (`/products`)**:
   - Displays a row/grid of products from the database.
   - Each product card has a button:
     - **"Check Analytics"**: If analysis is already complete, clicking this views the results.
     - **"Start Analysis"**: If not analyzed yet, this triggers the pipeline (generate prompts -> run prompts across LLMs -> compute score).

3. **Product Details & Analysis Page (`/products/[id]`)**:
   - Shows the product details.
   - Displays a list of the 5-10 generated prompts.
   - For each prompt, it shows its own analysis (e.g., did Gemini mention the product for this prompt? Rank?).

## 5. Phase 1 Implementation Plan (MVP)

1. **Setup Project Structure:** 
   - Initialize Next.js in the root directory.
   - Configure TailwindCSS for a strict light theme.
   - Set up MongoDB connection (`mongoose`).
2. **Backend Services & Classes:**
   - Create the base `LLMModel` class and the specific `GeminiModel` subclass.
   - Create MongoDB schemas for `Product`, `Prompt`, and `AnalysisResult`.
3. **API Endpoints (Server Actions / API Routes):**
   - Endpoints to fetch products, generate prompts, and execute the analysis pipeline.
4. **Frontend Implementation:**
   - Build the Home page, Product Listing, and Product Details pages with minimal styling.
