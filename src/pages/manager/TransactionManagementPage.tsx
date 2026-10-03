import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileSpreadsheet,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useFinanceData } from '../../context/FinanceDataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterGroup, SegmentedFilter } from '../../components/common/Filter';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Transaction, TransactionStatus } from '../../types';

export const TransactionManagementPage: React.FC = () => {
  const { transactions, updateTransactionStatus } = useFinanceData();
  const { currentUser } = useAuth();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Review modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewDecision, setReviewDecision] = useState<'approve' | 'reject' | 'flag'>('approve');
  const [reviewNotes, setReviewNotes] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch =
        !search ||
        tx.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
        tx.description.toLowerCase().includes(search.toLowerCase()) ||
        tx.counterparty.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || tx.status === statusFilter;

      const matchesRisk =
        riskFilter === 'all' ||
        (riskFilter === 'high' && tx.riskScore >= 70) ||
        (riskFilter === 'medium' && tx.riskScore >= 30 && tx.riskScore < 70) ||
        (riskFilter === 'low' && tx.riskScore < 30);

      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [transactions, search, statusFilter, riskFilter]);

  const handleOpenReview = (tx: Transaction, decision: 'approve' | 'reject' | 'flag') => {
    setSelectedTx(tx);
    setReviewDecision(decision);
    setReviewNotes(
      decision === 'approve'
        ? 'Secondary manual review confirmed beneficiary integrity.'
        : decision === 'reject'
        ? 'Declined due to anomalous outbound velocity & non-verified counterparty.'
        : 'Flagged for further AML KYC investigation.'
    );
    setReviewModalOpen(true);
  };

  const handleConfirmDecision = () => {
    if (!selectedTx) return;
    const newStatus: TransactionStatus =
      reviewDecision === 'approve'
        ? 'completed'
        : reviewDecision === 'reject'
        ? 'rejected'
        : 'flagged';

    updateTransactionStatus(selectedTx.id, newStatus, reviewNotes);
    setReviewModalOpen(false);
    setSelectedTx(null);
  };

  const columns: Column<Transaction>[] = [
    {
      key: 'referenceNumber',
      header: 'Reference',
      width: '120px',
      sortable: true,
      render: tx => (
        <span className="font-mono text-slate-800 font-semibold text-[11px]">
          {tx.referenceNumber}
        </span>
      )
    },
    {
      key: 'description',
      header: 'Transaction & Counterparty',
      render: tx => (
        <div>
          <div className="font-semibold text-slate-900 truncate max-w-xs">{tx.description}</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
            <span>{tx.counterparty}</span>
            <span>·</span>
            <span className="font-mono text-[10px]">{tx.paymentMethod}</span>
          </div>
        </div>
      )
    },
    {
      key: 'date',
      header: 'Timestamp',
      sortable: true,
      render: tx => (
        <div className="text-slate-600 text-[11px]">
          <div>{tx.date}</div>
          <div className="text-[10px] text-slate-400 font-mono">{tx.timestamp}</div>
        </div>
      )
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      sortable: true,
      render: tx => (
        <span
          className={`font-semibold tabular-nums text-xs ${
            tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'
          }`}
        >
          {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      key: 'riskScore',
      header: 'Risk Score',
      align: 'center',
      sortable: true,
      render: tx => {
        const isHigh = tx.riskScore >= 70;
        const isMed = tx.riskScore >= 30 && tx.riskScore < 70;
        return (
          <span
            className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
              isHigh
                ? 'bg-rose-100 text-rose-800'
                : isMed
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {tx.riskScore}/100
          </span>
        );
      }
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: tx => <StatusBadge status={tx.status} size="sm" />
    },
    {
      key: 'actions',
      header: 'Operations Action',
      align: 'right',
      render: tx => (
        <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
          {tx.status === 'under_review' || tx.status === 'flagged' || tx.status === 'pending' ? (
            <>
              <button
                onClick={() => handleOpenReview(tx, 'approve')}
                className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded font-medium text-[11px] transition-colors cursor-pointer"
                title="Authorize transfer"
                type="button"
              >
                Authorize
              </button>
              <button
                onClick={() => handleOpenReview(tx, 'reject')}
                className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded font-medium text-[11px] transition-colors cursor-pointer"
                title="Reject transfer"
                type="button"
              >
                Decline
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setSelectedTx(tx);
                setReviewDecision('flag');
                setReviewNotes('Flagged for retrospective compliance check.');
                setReviewModalOpen(true);
              }}
              className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
              type="button"
            >
              Audit Note
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Transaction Operations & AML Risk Governance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise anomalous wire patterns, manage clearance holds, and enforce dual-control authorization
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={FileSpreadsheet}
            onClick={() => {
              const csvContent =
                'data:text/csv;charset=utf-8,' +
                [
                  'Reference,Date,Description,Counterparty,Amount,RiskScore,Status',
                  ...filteredTransactions.map(t =>
                    `${t.referenceNumber},${t.date},"${t.description.replace(/"/g, '""')}","${t.counterparty.replace(/"/g, '""')}",${t.amount},${t.riskScore},${t.status}`
                  )
                ].join('\n');
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', `finops_operations_audit_${Date.now()}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            Export Operations Ledger
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card noPadding className="p-4 bg-white space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-between">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by reference, account holder, counterparty..."
            className="w-full md:max-w-md"
            shortcutHint="/"
          />

          <div className="flex items-center gap-2 flex-wrap">
            <SegmentedFilter
              options={[
                { label: 'All Transactions', value: 'all' },
                { label: 'Under Review', value: 'under_review' },
                { label: 'Flagged (High Risk)', value: 'flagged' },
                { label: 'Pending Settlement', value: 'pending' }
              ]}
              selectedValue={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <FilterGroup
              label="Risk Model Tier"
              options={[
                { label: 'All Risk Tiers', value: 'all' },
                { label: 'High Risk (Score ≥ 70)', value: 'high' },
                { label: 'Medium Risk (30-69)', value: 'medium' },
                { label: 'Low Risk (< 30)', value: 'low' }
              ]}
              selectedValue={riskFilter}
              onChange={setRiskFilter}
            />
          </div>

          {(search || statusFilter !== 'all' || riskFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setRiskFilter('all');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </Card>

      {/* Main Table */}
      <Card noPadding>
        <DataTable
          columns={columns}
          data={filteredTransactions}
          keyExtractor={tx => tx.id}
          onRowClick={tx => {
            setSelectedTx(tx);
            setReviewDecision('approve');
            setReviewModalOpen(true);
          }}
          pageSize={10}
        />
      </Card>

      {/* Review & Decision Modal */}
      {reviewModalOpen && selectedTx && (
        <Modal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          title="Operations Supervisory Review"
          subtitle={`Case: ${selectedTx.referenceNumber} · Risk Score: ${selectedTx.riskScore}/100`}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setReviewModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={reviewDecision === 'reject' ? 'danger' : 'primary'}
                size="sm"
                onClick={handleConfirmDecision}
              >
                Confirm {reviewDecision.toUpperCase()} Decision
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-slate-500 block">Transaction Reference</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {selectedTx.referenceNumber}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">Outflow Amount</span>
                <span className="font-bold text-slate-900 text-sm tabular-nums">
                  ${Math.abs(selectedTx.amount).toFixed(2)} USD
                </span>
              </div>
            </div>

            {selectedTx.flagReason && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900">
                <span className="font-semibold block mb-0.5">Automated Risk Anomaly:</span>
                <span>{selectedTx.flagReason}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Select Supervisory Determination
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setReviewDecision('approve')}
                  className={`p-2 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                    reviewDecision === 'approve'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Authorize Release
                </button>
                <button
                  type="button"
                  onClick={() => setReviewDecision('reject')}
                  className={`p-2 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                    reviewDecision === 'reject'
                      ? 'border-rose-600 bg-rose-50 text-rose-800 font-semibold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Decline / Void
                </button>
                <button
                  type="button"
                  onClick={() => setReviewDecision('flag')}
                  className={`p-2 rounded-lg border text-center font-medium transition-colors cursor-pointer ${
                    reviewDecision === 'flag'
                      ? 'border-amber-600 bg-amber-50 text-amber-800 font-semibold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Flag for Investigation
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Supervisory Audit Justification (Written to Immutable Log)
              </label>
              <textarea
                rows={3}
                value={reviewNotes}
                onChange={e => setReviewNotes(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
