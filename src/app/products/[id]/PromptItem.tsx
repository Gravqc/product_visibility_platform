'use client';

import { useState } from 'react';

export default function PromptItem({ prompt, result }: { prompt: any, result: any }) {
  const [expanded, setExpanded] = useState(false);

  // In the future this might be calculated over multiple models.
  // For now, it's 1 out of 1 if mentioned, or 0 out of 1 if not.
  const scoreText = result ? (result.mentionsTarget ? "1/1 (100%)" : "0/1 (0%)") : "0/0 (0%)";

  return (
    <div className="border-b border-gray-100 last:border-0 py-4">
      <div 
        className="flex justify-between items-center cursor-pointer hover:bg-gray-50 -mx-4 px-4 py-2 rounded transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-base">"{prompt.text}"</p>
          <div className="flex items-center space-x-3 mt-1">
            <span 
              className={`text-xs tracking-wide uppercase font-semibold ${
                prompt.status === 'COMPLETED' ? 'text-green-600' : 
                prompt.status === 'RUNNING' ? 'text-yellow-600' : 
                prompt.status === 'FAILED' ? 'text-red-600' : 
                'text-gray-500'
              }`}
              title={prompt.status === 'FAILED' ? "LLM Server didn't respond or request failed" : undefined}
            >
              {prompt.status}
            </span>
            {result && (
              <span className="text-sm text-gray-500">
                Visibility Score: <span className="font-semibold text-gray-800">{scoreText}</span>
              </span>
            )}
          </div>
        </div>
        <div className="text-gray-400">
          {expanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          )}
        </div>
      </div>

      {expanded && result && (
        <div className="mt-4 pl-4 border-l-2 border-gray-200">
          <div className="flex items-center space-x-4 mb-3">
            <span className="text-sm text-gray-600">Model: <strong>{result.llmName}</strong></span>
            <span className={`text-sm font-medium px-2 py-0.5 rounded ${result.mentionsTarget ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {result.mentionsTarget ? 'Target Mentioned' : 'Not Mentioned'}
            </span>
          </div>
          {result.rawResponse && (
            <div className="text-sm text-gray-800 bg-gray-50/80 p-5 rounded max-h-[500px] overflow-y-auto whitespace-pre-wrap leading-relaxed border border-gray-100">
              {result.rawResponse}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
