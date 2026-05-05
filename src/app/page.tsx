import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white text-gray-900">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
          AEO Analytics Platform
        </h1>
        <p className="text-xl text-gray-600">
          Diagnose the visibility of your Amazon listings across major Large Language Models (LLMs).
          See if models like ChatGPT, Claude, and Gemini are recommending your products.
        </p>
        <div className="pt-8">
          <Link 
            href="/products" 
            className="rounded-md bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
          >
            Start Testing Now
          </Link>
        </div>
      </div>
    </main>
  );
}
