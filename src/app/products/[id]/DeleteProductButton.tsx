'use client';

import { useState } from 'react';
import { deleteProduct } from '@/app/actions/product';
import { useRouter } from 'next/navigation';

export default function DeleteProductButton({ productId }: { productId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this product and all its analysis data?')) return;
    
    setIsDeleting(true);
    try {
      await deleteProduct(productId);
      router.push('/products');
    } catch (e) {
      console.error(e);
      alert('Failed to delete product');
      setIsDeleting(false);
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting} 
      className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors disabled:opacity-50 inline-flex items-center"
    >
      {isDeleting ? 'Deleting...' : 'Delete Product'}
    </button>
  );
}
