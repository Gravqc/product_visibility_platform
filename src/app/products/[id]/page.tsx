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

  // Compute Leaderboard
  const brandMentions: Record<string, { count: number, citations: string[], originalName: string }> = {};
  results.forEach((r: any) => {
    if (r.brandsData && r.brandsData.length > 0) {
      r.brandsData.forEach((b: any) => {
        const brandName = b.brand_name.toLowerCase();
        if (!brandMentions[brandName]) {
          brandMentions[brandName] = { count: 0, citations: [], originalName: b.brand_name };
        }
        brandMentions[brandName].count++;
        b.citations.forEach((c: string) => {
          if (!brandMentions[brandName].citations.includes(c)) {
            brandMentions[brandName].citations.push(c);
          }
        });
      });
    } else if (r.recommendedBrands) {
      r.recommendedBrands.forEach((name: string) => {
        const brandName = name.toLowerCase();
        if (!brandMentions[brandName]) {
          brandMentions[brandName] = { count: 0, citations: [], originalName: name };
        }
        brandMentions[brandName].count++;
      });
    }
  });

  const leaderboard = Object.values(brandMentions).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <main className="min-h-screen p-6 md:p-12 bg-white text-gray-900 font-sans tracking-tight">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Header Section */}
        <header>
          <div className="flex justify-between items-center mb-8">
            <Link href="/products" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium inline-flex items-center">
              <span className="mr-1">←</span> Dashboard
            </Link>
            <DeleteProductButton productId={id} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-gray-900 leading-tight">{product.title}</h1>
          <p className="text-base text-gray-500">
            {product.brand} {product.asin && <span className="ml-3 pl-3 border-l border-gray-200">{product.asin}</span>}
          </p>
        </header>

        {/* Stats Section */}
        <section>
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-900">Visibility Report</h2>
            <AnalysisControl productId={id} hasPrompts={prompts.length > 0} autoStart={prompts.length === 0} />
          </div>

          {prompts.length > 0 && (
            <div className="flex flex-wrap gap-12 mb-10">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Score</p>
                <p className="text-3xl font-bold text-blue-600">{score}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Prompts</p>
                <p className="text-3xl font-bold text-gray-900">{prompts.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Mentions</p>
                <p className="text-3xl font-bold text-gray-900">{targetMentions}</p>
              </div>
            </div>
          )}

          {/* Competitor Leaderboard */}
          {leaderboard.length > 0 && (
            <div className="mb-10 p-6 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Top Recommended Brands</h3>
              <div className="space-y-4">
                {leaderboard.map((item, index) => (
                  <div key={index} className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center mb-2 md:mb-0">
                      <span className="text-gray-400 font-bold mr-4">#{index + 1}</span>
                      <span className={`font-semibold ${item.originalName.toLowerCase().includes(product.brand.toLowerCase()) ? 'text-blue-600' : 'text-gray-900'}`}>
                        {item.originalName} {item.originalName.toLowerCase().includes(product.brand.toLowerCase()) && '(You)'}
                      </span>
                    </div>
                    <div className="flex flex-col md:items-end text-sm">
                      <span className="text-gray-600 font-medium">Mentioned {item.count} times</span>
                      {item.citations.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1 max-w-xs md:max-w-md truncate">
                          {item.citations.filter(c => c.startsWith('http')).map((c, i) => (
                            <a key={i} href={c} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mr-2">Link {i+1}</a>
                          ))}
                          {item.citations.filter(c => !c.startsWith('http')).length > 0 && (
                            <span className="italic" title={item.citations.filter(c => !c.startsWith('http')).join(' | ')}>+ snippets</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompts Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Generated Queries</h3>
            {prompts.length === 0 ? (
              <p className="text-gray-500 text-base italic">No queries generated yet. Processing should start automatically...</p>
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
