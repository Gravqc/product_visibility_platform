'use client';

import { useState, useEffect, useRef } from 'react';
import { runFullAnalysis } from '@/app/actions/analysis';
import { useRouter } from 'next/navigation';

export default function AnalysisControl({ productId, hasPrompts, autoStart }: { productId: string, hasPrompts: boolean, autoStart?: boolean }) {
  const [loading, setLoading] = useState(!!autoStart);
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    if (autoStart && !initialized.current) {
      initialized.current = true;
      handleRunAnalysis();
    }
  }, [autoStart]);

  async function handleRunAnalysis() {
    setLoading(true);
    try {
      await runFullAnalysis(productId);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Failed to run analysis');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleRunAnalysis}
      disabled={loading}
      className="rounded bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
    >
      {loading ? 'Processing...' : (hasPrompts ? 'Re-run Analysis' : 'Start Analysis')}
    </button>
  );
}
