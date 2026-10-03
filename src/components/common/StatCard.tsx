import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  isNeutral?: boolean;
  subtext?: string;
  icon?: LucideIcon;
  badgeText?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  isNeutral = false,
  subtext,
  icon: Icon,
  badgeText,
  className = ''
}) => {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition-all hover:border-slate-300 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-slate-500 tracking-wide uppercase">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2.5">
        <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
          {value}
        </div>
      </div>

      {(change || subtext || badgeText) && (
        <div className="mt-3 flex items-center gap-2 text-xs flex-wrap">
          {change && (
            <div
              className={`inline-flex items-center gap-1 font-semibold tabular-nums ${
                isNeutral
                  ? 'text-slate-600'
                  : isPositive
                  ? 'text-emerald-600'
                  : 'text-rose-600'
              }`}
            >
              {isNeutral ? (
                <Minus className="w-3.5 h-3.5" />
              ) : isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{change}</span>
            </div>
          )}

          {change && subtext && <span className="text-slate-300" aria-hidden="true">·</span>}

          {subtext && <span className="text-slate-500">{subtext}</span>}

          {badgeText && (
            <span className="ml-auto text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
