import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Sliders,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileCheck,
  UserCheck,
  History,
  XCircle,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useFinanceData } from '../../context/FinanceDataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DAILY_TRANSACTION_TRENDS } from '../../data/mockData';

export const ManagerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { transactions, updateTransactionStatus, auditLogs } = useFinanceData();

  // Transactions requiring review/flagged
  const actionQueue = transactions.filter(
    tx => tx.status === 'under_review' || tx.status === 'flagged' || tx.status === 'pending'
  );

  const completedCount = transactions.filter(tx => tx.status === 'completed').length;
  const flaggedCount = transactions.filter(tx => tx.status === 'flagged').length;
  const underReviewCount = transactions.filter(tx => tx.status === 'under_review').length;

  const handleApprove = (txId: string) => {
    updateTransactionStatus(txId, 'completed', 'Approved by Operations Manager after secondary compliance review.');
  };

  const handleReject = (txId: string) => {
    updateTransactionStatus(txId, 'rejected', 'Declined by Operations Manager: failed fraud screening invariants.');
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Manager Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Operations & Risk Command Center
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              Manager Tier Access
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Supervising treasury settlement liquidity, AML fraud isolation, and SLA queue resolution
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/manager/reports')}
          >
            Compliance Reports
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/manager/transactions')}
          >
            Full Transaction Queue
          </Button>
        </div>
      </div>

      {/* Top Manager KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Consolidated Volume (30D)"
          value="$1,845,200"
          change="+18.4%"
          isPositive={true}
          subtext="Processed gross flow"
          icon={DollarSign}
        />
        <StatCard
          title="Settlement Clearance Rate"
          value="99.82%"
          change="+0.14%"
          isPositive={true}
          subtext="Exceeds 99.5% target"
          icon={CheckCircle2}
        />
        <StatCard
          title="Active Review Queue"
          value={actionQueue.length}
          change={actionQueue.length > 0 ? `${actionQueue.length} Pending` : 'Zero backlog'}
          isPositive={actionQueue.length === 0}
          isNeutral={actionQueue.length > 0}
          subtext="Urgent action required"
          icon={Clock}
        />
        <StatCard
          title="High Risk Flagged"
          value={flaggedCount}
          change={flaggedCount > 0 ? 'Requires signoff' : 'Nominal'}
          isPositive={flaggedCount === 0}
          subtext="AML / Fraud alerts"
          icon={ShieldAlert}
        />
      </div>

      {/* Operations Action Queue: Immediate Decisions */}
      <Card
        title="Immediate Operations Decision Queue"
        subtitle="Items held for dual authorization, AML threshold breaches, or customer disputes"
        action={
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            {actionQueue.length} Pending Signoff
          </span>
        }
      >
        {actionQueue.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            All operations queues are currently cleared. No pending items require manager authorization.
          </div>
        ) : (
          <div className="space-y-3">
            {actionQueue.map(tx => (
              <div
                key={tx.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs transition-colors hover:border-slate-300"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-slate-800">
                      {tx.referenceNumber}
                    </span>
                    <StatusBadge status={tx.status} size="sm" />
                    <span className="font-mono text-[11px] text-slate-500">
                      Risk Score: {tx.riskScore}/100
                    </span>
                  </div>

                  <div className="font-semibold text-slate-900 text-sm">
                    {tx.description}
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>Beneficiary: {tx.counterparty}</span>
                    <span>·</span>
                    <span>Method: {tx.paymentMethod}</span>
                    <span>·</span>
                    <span>Date: {tx.date}</span>
                  </div>

                  {tx.flagReason && (
                    <div className="text-[11px] font-medium text-amber-800 bg-amber-50/80 border border-amber-200 p-2 rounded-md mt-1 inline-block">
                      ⚠️ Trigger: {tx.flagReason}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <div className="text-right">
                    <div className="text-base font-bold text-slate-900 tabular-nums">
                      ${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase">
                      {tx.type}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      icon={XCircle}
                      onClick={() => handleReject(tx.id)}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={CheckCircle2}
                      onClick={() => handleApprove(tx.id)}
                    >
                      Authorize
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Grid: Daily Settlement Volume & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily settlement volume */}
        <div className="lg:col-span-7">
          <Card
            title="Daily Clearing & Interbank Velocity"
            subtitle="Volume processed through FedACH and Wire gateways"
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DAILY_TRANSACTION_TRENDS} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748B"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={val => `$${val / 1000}k`}
                  />
                  <Tooltip
                    formatter={(val: any) => [`$${val.toLocaleString()}`, 'Daily Total']}
                    contentStyle={{ fontSize: '11px', borderRadius: '8px' }}
                  />
                  <Bar dataKey="volume" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Real-time Audit Trail */}
        <div className="lg:col-span-5">
          <Card
            title="System Audit & Governance Trail"
            subtitle="Immutable activity ledger for compliance"
          >
            <div className="space-y-3 max-h-64 overflow-y-auto text-xs pr-1">
              {auditLogs.map(log => (
                <div key={log.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 mb-1">
                    <span className="font-semibold text-slate-700">{log.action}</span>
                    <span>{log.timestamp.slice(11, 19)}</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug">
                    {log.details}
                  </p>
                  <div className="mt-1 text-[10px] text-slate-400">
                    Actor: <span className="font-semibold text-slate-600">{log.actor}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
