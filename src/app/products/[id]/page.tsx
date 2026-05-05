import { getProductById } from '@/app/actions/product';
import { getPromptsForProduct, getAnalysisResultsForProduct } from '@/app/actions/analysis';
import Link from 'next/link';
import AnalysisControl from './AnalysisControl';
import PromptItem from './PromptItem';
import DeleteProductButton from './DeleteProductButton';

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await getProductById(id);
  
  if (!product) {
    return <div className="p-12">Product not found</div>;
  }

  const prompts = await getPromptsForProduct(id);
  const results = await getAnalysisResultsForProduct(id);

  // Calculate some basic stats
  const completedAnalyses = results.length;
  const targetMentions = results.filter((r: any) => r.mentionsTarget).length;
  const score = completedAnalyses > 0 ? Math.round((targetMentions / completedAnalyses) * 100) : 0;

  return (
    <main className="min-h-screen p-8 lg:p-16 bg-white text-gray-900 font-sans tracking-tight">
      <div className="max-w-3xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <Link href="/products" className="text-gray-400 hover:text-gray-900 transition-colors text-sm font-medium inline-block">
              ← Back to Dashboard
            </Link>
            <DeleteProductButton productId={id} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">{product.title}</h1>
          <p className="text-lg text-gray-500 font-serif">Brand: {product.brand} {product.asin && `| ASIN: ${product.asin}`}</p>
        </div>

        {/* Stats Section */}
        <section>
          <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold">Visibility Analysis</h2>
            <AnalysisControl productId={id} hasPrompts={prompts.length > 0} autoStart={prompts.length === 0} />
          </div>

          {prompts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-1">Overall Score</p>
                <p className="text-5xl font-extrabold text-blue-600">{score}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-1">Prompts Tested</p>
                <p className="text-5xl font-extrabold text-gray-900">{prompts.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-1">Mentions</p>
                <p className="text-5xl font-extrabold text-gray-900">{targetMentions}</p>
              </div>
            </div>
          )}

          {/* Prompts Section */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold mb-6">Generated Queries</h3>
            {prompts.length === 0 ? (
              <p className="text-gray-500 text-lg font-serif italic">No queries generated yet. Processing should start automatically...</p>
            ) : (
              <div className="border-t border-gray-100">
                {prompts.map((prompt: any) => {
                  const result = results.find((r: any) => r.promptId === prompt._id);
                  return <PromptItem key={prompt._id} prompt={prompt} result={result} />;
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
