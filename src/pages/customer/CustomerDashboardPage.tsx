import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowUpRight,
  Send,
  Plus,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  CreditCard
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useFinanceData } from '../../context/FinanceDataContext';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Transaction } from '../../types';
import { MONTHLY_CASH_FLOW } from '../../data/mockData';

export const CustomerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { accounts, transactions, disputeTransaction } = useFinanceData();

  const [copiedAcc, setCopiedAcc] = useState<string | null>(null);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  // Compute summary stats
  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  const totalAvailable = accounts.reduce((acc, curr) => acc + curr.availableBalance, 0);

  const thirtyDayInflow = transactions
    .filter(t => t.amount > 0 && t.status === 'completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const thirtyDayOutflow = transactions
    .filter(t => t.amount < 0 && t.status === 'completed')
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

  const pendingCount = transactions.filter(
    t => t.status === 'pending' || t.status === 'under_review'
  ).length;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAcc(id);
    setTimeout(() => setCopiedAcc(null), 1500);
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTx) return;
    disputeTransaction(selectedTx.id, disputeReason);
    setDisputeSubmitted(true);
    setTimeout(() => {
      setDisputeSubmitted(false);
      setDisputeModalOpen(false);
      setSelectedTx(null);
      setDisputeReason('');
      navigate('/support');
    }, 1200);
  };

  // Recent 6 transactions
  const recentTransactions = transactions.slice(0, 6);

  const columns: Column<Transaction>[] = [
    {
      key: 'description',
      header: 'Transaction Details',
      render: tx => (
        <div>
          <div className="font-semibold text-slate-900 truncate max-w-xs">{tx.description}</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
            <span>{tx.date}</span>
            <span>·</span>
            <span>{tx.counterparty}</span>
            <span>·</span>
            <span className="font-mono">{tx.referenceNumber}</span>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: tx => (
        <span className="text-slate-600 font-medium">{tx.category}</span>
      )
    },
    {
      key: 'paymentMethod',
      header: 'Method',
      render: tx => (
        <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
          {tx.paymentMethod}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: tx => <StatusBadge status={tx.status} size="sm" />
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: tx => (
        <span
          className={`font-semibold tabular-nums text-sm ${
            tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'
          }`}
        >
          {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Welcome back, {currentUser?.name || 'Sarah Chen'}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Account
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise Treasury Portfolio · Primary Settlement Account #{accounts[0]?.accountNumber.slice(-4) || '4920'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/transactions')}
          >
            All Ledger Records
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Send}
            onClick={() => navigate('/payments')}
          >
            Send Payment
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Liquid Balance"
          value={`$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change="+14.2%"
          isPositive={true}
          subtext="vs last month"
          icon={DollarSign}
        />
        <StatCard
          title="30-Day Inflow"
          value={`$${thirtyDayInflow.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          change="+8.6%"
          isPositive={true}
          subtext="Customer receipts"
          icon={TrendingUp}
        />
        <StatCard
          title="30-Day Outflow"
          value={`$${thirtyDayOutflow.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          change="-3.1%"
          isPositive={true}
          subtext="Vendor & payroll"
          icon={TrendingDown}
        />
        <StatCard
          title="Pending / Review Queue"
          value={pendingCount}
          change={pendingCount > 0 ? `${pendingCount} items` : 'Clear'}
          isNeutral={pendingCount === 0}
          isPositive={pendingCount === 0}
          subtext="Settlement velocity"
          icon={Clock}
        />
      </div>

      {/* Account Cards & AI Copilot Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {accounts.map(acc => (
          <Card key={acc.id} className="relative overflow-hidden hover:border-slate-300 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {acc.type}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">{acc.name}</h3>
              </div>
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                Active FIDC
              </span>
            </div>

            <div className="mt-4">
              <div className="text-2xl font-bold text-slate-900 tabular-nums">
                ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Available: <span className="font-semibold text-slate-700 tabular-nums">${acc.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1 font-mono text-[11px]">
                <span>Acc: ••••{acc.accountNumber.slice(-4)}</span>
                <button
                  onClick={() => handleCopy(acc.accountNumber, acc.id)}
                  className="p-1 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Copy full account number"
                  type="button"
                >
                  {copiedAcc === acc.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <span className="font-mono text-[11px]">Routing: {acc.routingNumber}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Cash Flow Visual & AI Copilot Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Area Chart */}
        <Card
          title="Cash Flow & Liquidity Trajectory"
          subtitle="Monthly inflow vs expense trends (USD)"
          action={
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowUpRight}
              iconPosition="right"
              onClick={() => navigate('/analytics')}
            >
              Full Analytics
            </Button>
          }
          className="lg:col-span-2"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_CASH_FLOW} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={val => `$${val / 1000}k`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-2.5 border border-slate-200 rounded-lg shadow-sm text-xs">
                          <p className="font-semibold text-slate-800 mb-1">{label} 2026</p>
                          <p className="text-blue-600 font-medium tabular-nums">
                            Income: ${payload[0]?.value?.toLocaleString()}
                          </p>
                          <p className="text-slate-600 font-medium tabular-nums">
                            Expenses: ${payload[1]?.value?.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#2563EB"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#incomeGrad)"
                  name="Income"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#64748B"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#expenseGrad)"
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>Operating Inflow</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span>Operating Expenses</span>
              </span>
            </div>
            <span className="font-semibold text-emerald-600 tabular-nums">
              Net Surplus: +$56,500.00
            </span>
          </div>
        </Card>

        {/* AI Operations Intelligence Panel */}
        <Card
          title="AI Financial Intelligence"
          subtitle="Real-time transaction surveillance"
          className="flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900 mb-1">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Working Capital Optimization</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Operating balance exceeds 30-day runway requirement. Recommend allocating $40,000 to the Treasury Yield Reserve for 4.85% APY return.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-900 mb-1">
                <span>Pending Compliance Clearance</span>
                <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.2 rounded">
                  TX-9810
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Wire transfer of $18,500.00 to Apex Global Hardware is undergoing automated dual-signature verification.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between"
              onClick={() => navigate('/support')}
            >
              <span>AI Support & Dispute Desk</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card
        title="Recent Transactions"
        subtitle="Latest ledger settlements and pending transfers"
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/transactions')}
          >
            View All ({transactions.length})
          </Button>
        }
        noPadding
      >
        <DataTable
          columns={columns}
          data={recentTransactions}
          keyExtractor={tx => tx.id}
          onRowClick={tx => setSelectedTx(tx)}
          pageSize={6}
          showPagination={false}
        />
      </Card>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <Modal
          isOpen={Boolean(selectedTx) && !disputeModalOpen}
          onClose={() => setSelectedTx(null)}
          title="Transaction Details"
          subtitle={`Reference: ${selectedTx.referenceNumber}`}
          footer={
            <>
              {selectedTx.amount < 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDisputeModalOpen(true)}
                >
                  Dispute Transaction
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedTx(null)}
              >
                Close
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block">Total Amount</span>
                <span
                  className={`text-xl font-bold tabular-nums ${
                    selectedTx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'
                  }`}
                >
                  {selectedTx.amount > 0 ? '+' : ''}${Math.abs(selectedTx.amount).toFixed(2)}{' '}
                  {selectedTx.currency}
                </span>
              </div>
              <StatusBadge status={selectedTx.status} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 block mb-0.5">Description</span>
                <span className="font-semibold text-slate-800">{selectedTx.description}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Counterparty</span>
                <span className="font-semibold text-slate-800">{selectedTx.counterparty}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Date & Timestamp</span>
                <span className="font-mono text-slate-700">
                  {selectedTx.date} {selectedTx.timestamp}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Payment Method</span>
                <span className="font-semibold text-slate-800">{selectedTx.paymentMethod}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Category</span>
                <span className="text-slate-800">{selectedTx.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">AI Risk Score</span>
                <span className="font-mono font-semibold text-slate-800">
                  {selectedTx.riskScore} / 100 ({selectedTx.riskScore > 50 ? 'High Risk' : 'Low Risk'})
                </span>
              </div>
            </div>

            {selectedTx.flagReason && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                <span className="font-semibold block mb-0.5">Automated Review Trigger:</span>
                <span className="text-amber-800">{selectedTx.flagReason}</span>
              </div>
            )}

            {selectedTx.notes && (
              <div className="p-3 bg-slate-100 rounded-lg text-slate-700">
                <span className="font-semibold block mb-0.5">Audit Note:</span>
                <span>{selectedTx.notes}</span>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Dispute Modal */}
      {disputeModalOpen && selectedTx && (
        <Modal
          isOpen={disputeModalOpen}
          onClose={() => setDisputeModalOpen(false)}
          title="Dispute Transaction"
          subtitle={`File a dispute for ${selectedTx.referenceNumber} ($${Math.abs(selectedTx.amount).toFixed(2)})`}
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDisputeModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDisputeSubmit}
                disabled={!disputeReason.trim() || disputeSubmitted}
              >
                {disputeSubmitted ? 'Dispute Filed...' : 'Submit to AI Dispute Desk'}
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
              <p className="leading-relaxed">
                Filing a dispute creates an immediate case in the AI Customer Support system. Our algorithm will freeze associated card tokens and assign an operations analyst to review the merchant response within 4 hours.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Reason for dispute
              </label>
              <textarea
                rows={3}
                value={disputeReason}
                onChange={e => setDisputeReason(e.target.value)}
                placeholder="e.g. Unrecognized merchant charge, duplicate billing, services not rendered..."
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
