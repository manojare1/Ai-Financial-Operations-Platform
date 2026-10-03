import React from 'react';

export interface LoadingStateProps {
  rows?: number;
  type?: 'table' | 'cards' | 'spinner';
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  rows = 5,
  type = 'table',
  message = 'Loading financial records...',
  className = ''
}) => {
  if (type === 'spinner') {
    return (
      <div className={`flex flex-col items-center justify-center p-12 ${className}`}>
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-500 font-medium">{message}</p>
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse ${className}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 bg-slate-100 rounded-xl border border-slate-200" />
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-3 animate-pulse p-4 ${className}`}>
      <div className="h-9 bg-slate-100 rounded-lg w-full mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-100">
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-4 bg-slate-100 rounded w-1/4" />
          <div className="h-4 bg-slate-100 rounded w-1/6" />
          <div className="h-4 bg-slate-200 rounded w-1/6 ml-auto" />
        </div>
      ))}
    </div>
  );
};
