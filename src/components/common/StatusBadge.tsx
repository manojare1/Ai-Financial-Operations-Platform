import React from 'react';

export type StatusType =
  | 'completed'
  | 'pending'
  | 'under_review'
  | 'flagged'
  | 'rejected'
  | 'refunded'
  | 'active'
  | 'paused'
  | 'frozen'
  | 'verified'
  | 'action_required'
  | 'open'
  | 'in_progress'
  | 'waiting_customer'
  | 'resolved'
  | 'closed'
  | 'urgent'
  | 'high'
  | 'medium'
  | 'low';

export interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const statusConfig: Record<
  string,
  { label: string; dotColor: string; bg: string; text: string; border: string }
> = {
  completed: {
    label: 'Completed',
    dotColor: 'bg-emerald-500',
    bg: 'bg-emerald-50/70',
    text: 'text-emerald-800',
    border: 'border-emerald-200'
  },
  verified: {
    label: 'Verified',
    dotColor: 'bg-emerald-500',
    bg: 'bg-emerald-50/70',
    text: 'text-emerald-800',
    border: 'border-emerald-200'
  },
  active: {
    label: 'Active',
    dotColor: 'bg-emerald-500',
    bg: 'bg-emerald-50/70',
    text: 'text-emerald-800',
    border: 'border-emerald-200'
  },
  resolved: {
    label: 'Resolved',
    dotColor: 'bg-emerald-500',
    bg: 'bg-emerald-50/70',
    text: 'text-emerald-800',
    border: 'border-emerald-200'
  },
  pending: {
    label: 'Pending',
    dotColor: 'bg-amber-500',
    bg: 'bg-amber-50/70',
    text: 'text-amber-800',
    border: 'border-amber-200'
  },
  under_review: {
    label: 'Under Review',
    dotColor: 'bg-blue-500',
    bg: 'bg-blue-50/70',
    text: 'text-blue-800',
    border: 'border-blue-200'
  },
  in_progress: {
    label: 'In Progress',
    dotColor: 'bg-blue-500',
    bg: 'bg-blue-50/70',
    text: 'text-blue-800',
    border: 'border-blue-200'
  },
  flagged: {
    label: 'Flagged (Risk)',
    dotColor: 'bg-rose-500',
    bg: 'bg-rose-50/70',
    text: 'text-rose-800',
    border: 'border-rose-200'
  },
  urgent: {
    label: 'Urgent',
    dotColor: 'bg-rose-500',
    bg: 'bg-rose-50/70',
    text: 'text-rose-800',
    border: 'border-rose-200'
  },
  rejected: {
    label: 'Rejected',
    dotColor: 'bg-slate-500',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200'
  },
  refunded: {
    label: 'Refunded',
    dotColor: 'bg-indigo-500',
    bg: 'bg-indigo-50/70',
    text: 'text-indigo-800',
    border: 'border-indigo-200'
  },
  paused: {
    label: 'Paused',
    dotColor: 'bg-slate-400',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200'
  },
  open: {
    label: 'Open',
    dotColor: 'bg-emerald-500',
    bg: 'bg-emerald-50/70',
    text: 'text-emerald-800',
    border: 'border-emerald-200'
  },
  waiting_customer: {
    label: 'Awaiting User',
    dotColor: 'bg-amber-500',
    bg: 'bg-amber-50/70',
    text: 'text-amber-800',
    border: 'border-amber-200'
  },
  high: {
    label: 'High Priority',
    dotColor: 'bg-orange-500',
    bg: 'bg-orange-50/70',
    text: 'text-orange-800',
    border: 'border-orange-200'
  },
  medium: {
    label: 'Medium',
    dotColor: 'bg-blue-400',
    bg: 'bg-blue-50/70',
    text: 'text-blue-700',
    border: 'border-blue-200'
  },
  low: {
    label: 'Low',
    dotColor: 'bg-slate-400',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200'
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  className = ''
}) => {
  const normalizedKey = status.toLowerCase().replace(/\s+/g, '_');
  const config = statusConfig[normalizedKey] || {
    label: status.replace(/_/g, ' '),
    dotColor: 'bg-slate-400',
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200'
  };

  const displayLabel = label || config.label;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${
        config.bg
      } ${config.text} ${config.border} ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${className} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} shrink-0`} />
      <span>{displayLabel}</span>
    </span>
  );
};
