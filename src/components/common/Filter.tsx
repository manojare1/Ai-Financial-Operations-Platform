import React from 'react';
import { Filter as FilterIcon, ChevronDown } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroupProps {
  label: string;
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({
  label,
  options,
  selectedValue,
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="text-xs font-medium text-slate-500 hidden sm:inline whitespace-nowrap">
        {label}:
      </span>
      <div className="relative inline-block">
        <select
          value={selectedValue}
          onChange={e => onChange(e.target.value)}
          className="appearance-none text-xs font-medium bg-white border border-slate-200 text-slate-700 pl-2.5 pr-7 py-1.5 rounded-lg hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors cursor-pointer"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
};

export interface SegmentedFilterProps {
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const SegmentedFilter: React.FC<SegmentedFilterProps> = ({
  options,
  selectedValue,
  onChange,
  className = '',
  size = 'sm'
}) => {
  return (
    <div
      className={`inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80 overflow-x-auto max-w-full ${className}`}
    >
      {options.map(opt => {
        const isActive = opt.value === selectedValue;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
            } ${
              isActive
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            type="button"
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
