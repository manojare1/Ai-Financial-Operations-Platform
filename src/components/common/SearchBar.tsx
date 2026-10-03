import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  shortcutHint?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search by keyword, reference, counterparty...',
  className = '',
  shortcutHint
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-600 rounded transition-colors"
          title="Clear search"
          type="button"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
      {!value && shortcutHint && (
        <span className="hidden sm:inline-block absolute right-3 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded">
          {shortcutHint}
        </span>
      )}
    </div>
  );
};
