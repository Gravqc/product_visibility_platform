'use client';

import { useState } from 'react';
import { createProduct } from '@/app/actions/product';
import { useRouter } from 'next/navigation';

export default function AddProductForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const brand = formData.get('brand') as string;
    const asin = formData.get('asin') as string;
    const url = formData.get('url') as string;

    try {
      const product = await createProduct({ title, brand, asin, url });
      router.push(`/products/${product._id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input required name="title" type="text" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500" placeholder="e.g. Optimum Nutrition Gold Standard 100% Whey" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Brand</label>
        <input required name="brand" type="text" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500" placeholder="e.g. Optimum Nutrition" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ASIN <span className="text-gray-400 font-normal">(Optional)</span></label>
        <input name="asin" type="text" className="mt-1 block w-full rounded border border-gray-200 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. B000QSNYGI" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amazon URL <span className="text-gray-400 font-normal">(Optional)</span></label>
        <input name="url" type="url" className="mt-1 block w-full rounded border border-gray-200 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="https://amazon.com/dp/B000QSNYGI" />
      </div>
      <div className="md:col-span-2 flex justify-end mt-2">
        <button 
          type="submit" 
          disabled={loading}
          className="rounded bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}
