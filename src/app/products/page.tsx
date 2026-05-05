import { getProducts } from '@/app/actions/product';
import Link from 'next/link';
import AddProductForm from './AddProductForm';

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen p-8 lg:p-16 bg-white text-gray-900 font-sans tracking-tight">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="flex justify-between items-end border-b border-gray-100 pb-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">Products</h1>
          <Link href="/" className="text-gray-400 hover:text-gray-900 transition-colors text-sm font-medium mb-2">← Back to Home</Link>
        </div>

        <section className="bg-gray-50/50 p-8 border border-gray-100 rounded-sm">
          <h2 className="text-xl font-bold mb-6">Track New Product</h2>
          <AddProductForm />
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-8">Your Tracked Products</h2>
          {products.length === 0 ? (
            <p className="text-gray-500 font-serif italic text-lg">No products added yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {products.map((product: any) => (
                <div key={product._id} className="group border border-gray-100 hover:border-gray-300 transition-colors flex flex-col justify-between p-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2" title={product.title}>{product.title}</h3>
                    <p className="text-md text-gray-500 font-serif mb-4">{product.brand}</p>
                    {product.asin && <p className="text-xs text-gray-400 mb-6 uppercase tracking-widest font-semibold">ASIN: {product.asin}</p>}
                  </div>
                  <div className="mt-auto pt-6">
                    <Link 
                      href={`/products/${product._id}`}
                      className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      View Report <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
