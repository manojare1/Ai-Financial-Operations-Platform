import React, { useState, useMemo } from 'react';
import { Download, Filter as FilterIcon, ArrowUpDown, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';
import { useFinanceData } from '../../context/FinanceDataContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterGroup, SegmentedFilter } from '../../components/common/Filter';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Transaction } from '../../types';

export const TransactionsPage: React.FC = () => {
  const { transactions, disputeTransaction } = useFinanceData();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach(t => set.add(t.category));
    return Array.from(set);
  }, [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Search
      const matchesSearch =
        !search ||
        tx.description.toLowerCase().includes(search.toLowerCase()) ||
        tx.counterparty.toLowerCase().includes(search.toLowerCase()) ||
        tx.referenceNumber.toLowerCase().includes(search.toLowerCase());

      // Status
      const matchesStatus =
        statusFilter === 'all' || tx.status === statusFilter;

      // Type
      const matchesType =
        typeFilter === 'all' ||
        (typeFilter === 'inflow' && tx.amount > 0) ||
        (typeFilter === 'outflow' && tx.amount < 0) ||
        (typeFilter === 'transfers' && tx.type === 'transfer');

      // Category
      const matchesCategory =
        categoryFilter === 'all' || tx.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesType && matchesCategory;
    });
  }, [transactions, search, statusFilter, typeFilter, categoryFilter]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Reference', 'Date', 'Description', 'Counterparty', 'Category', 'Type', 'Amount', 'Currency', 'Status', 'PaymentMethod'];
    const rows = filteredTransactions.map(t => [
      t.referenceNumber,
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.counterparty.replace(/"/g, '""')}"`,
      t.category,
      t.type,
      t.amount,
      t.currency,
      t.status,
      t.paymentMethod
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `finops_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDisputeSubmit = () => {
    if (!selectedTx || !disputeReason) return;
    disputeTransaction(selectedTx.id, disputeReason);
    setDisputeOpen(false);
    setSelectedTx(null);
    setDisputeReason('');
  };

  const columns: Column<Transaction>[] = [
    {
      key: 'referenceNumber',
      header: 'Reference',
      width: '130px',
      sortable: true,
      render: tx => (
        <span className="font-mono text-slate-800 font-semibold text-[11px]">
          {tx.referenceNumber}
        </span>
      )
    },
    {
      key: 'date',
      header: 'Date & Time',
      width: '140px',
      sortable: true,
      render: tx => (
        <div className="text-slate-600">
          <div>{tx.date}</div>
          <div className="text-[10px] text-slate-400 font-mono">{tx.timestamp}</div>
        </div>
      )
    },
    {
      key: 'description',
      header: 'Description & Beneficiary',
      render: tx => (
        <div>
          <div className="font-semibold text-slate-900 truncate max-w-sm">
            {tx.description}
          </div>
          <div className="text-[11px] text-slate-500">
            {tx.counterparty}
          </div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: tx => (
        <span className="text-slate-700 font-medium">{tx.category}</span>
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
      sortable: true,
      render: tx => <StatusBadge status={tx.status} size="sm" />
    },
    {
      key: 'amount',
      header: 'Amount (USD)',
      align: 'right',
      sortable: true,
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
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Transactions Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-currency settlement history and compliance tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card noPadding className="p-4 bg-white space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-between">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by vendor, reference number, description..."
            className="w-full md:max-w-md"
            shortcutHint="/"
          />

          <div className="flex items-center gap-2 flex-wrap">
            <SegmentedFilter
              options={[
                { label: 'All Activity', value: 'all' },
                { label: 'Inflows', value: 'inflow' },
                { label: 'Outflows', value: 'outflow' },
                { label: 'Transfers', value: 'transfers' }
              ]}
              selectedValue={typeFilter}
              onChange={setTypeFilter}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <FilterGroup
              label="Status"
              options={[
                { label: 'All Statuses', value: 'all' },
                { label: 'Completed', value: 'completed' },
                { label: 'Pending', value: 'pending' },
                { label: 'Under Review', value: 'under_review' },
                { label: 'Flagged (Risk)', value: 'flagged' }
              ]}
              selectedValue={statusFilter}
              onChange={setStatusFilter}
            />

            <FilterGroup
              label="Category"
              options={[
                { label: 'All Categories', value: 'all' },
                ...categories.map(c => ({ label: c, value: c }))
              ]}
              selectedValue={categoryFilter}
              onChange={setCategoryFilter}
            />
          </div>

          {(search || statusFilter !== 'all' || typeFilter !== 'all' || categoryFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setTypeFilter('all');
                setCategoryFilter('all');
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
          onRowClick={tx => setSelectedTx(tx)}
          pageSize={8}
          emptyTitle="No transactions match your search"
          emptyDescription="Try clearing your search terms or adjusting the category filters."
        />
      </Card>

      {/* Transaction Details Modal */}
      {selectedTx && !disputeOpen && (
        <Modal
          isOpen={Boolean(selectedTx) && !disputeOpen}
          onClose={() => setSelectedTx(null)}
          title="Transaction Audit Record"
          subtitle={`Reference: ${selectedTx.referenceNumber}`}
          footer={
            <>
              {selectedTx.amount < 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDisputeOpen(true)}
                >
                  Dispute Charge
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedTx(null)}
              >
                Done
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block">Settled Amount</span>
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

            <div className="grid grid-cols-2 gap-3 text-slate-700">
              <div>
                <span className="text-slate-400 block">Counterparty</span>
                <span className="font-semibold text-slate-900">{selectedTx.counterparty}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Category</span>
                <span className="font-medium">{selectedTx.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Execution Timestamp</span>
                <span className="font-mono">{selectedTx.date} {selectedTx.timestamp}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Payment Method</span>
                <span className="font-mono">{selectedTx.paymentMethod}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Risk Score Assessment</span>
                <span className="font-mono font-semibold">
                  {selectedTx.riskScore} / 100
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Internal Clearing State</span>
                <span className="font-mono text-emerald-600">Settled to General Ledger</span>
              </div>
            </div>

            {selectedTx.flagReason && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                <span className="font-semibold block mb-0.5">Automated Risk Engine Diagnostic:</span>
                <span>{selectedTx.flagReason}</span>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Dispute Modal */}
      {disputeOpen && selectedTx && (
        <Modal
          isOpen={disputeOpen}
          onClose={() => setDisputeOpen(false)}
          title="Initiate Customer Dispute"
          subtitle={`Dispute transaction ${selectedTx.referenceNumber}`}
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDisputeOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDisputeSubmit}
                disabled={!disputeReason.trim()}
              >
                Submit Dispute
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              Please describe why you are contesting this charge of{' '}
              <strong>${Math.abs(selectedTx.amount).toFixed(2)}</strong>.
            </p>
            <textarea
              rows={3}
              value={disputeReason}
              onChange={e => setDisputeReason(e.target.value)}
              placeholder="State the discrepancy (e.g., unauthorized charge, canceled subscription, duplicate payment)..."
              className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
