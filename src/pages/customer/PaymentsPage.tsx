import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Plus,
  Users,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  CreditCard,
  Trash2
} from 'lucide-react';
import { useFinanceData } from '../../context/FinanceDataContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PaymentRecipient } from '../../types';

export const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    accounts,
    recipients,
    scheduledPayments,
    sendPayment,
    addRecipient,
    deleteRecipient,
    toggleScheduledPayment
  } = useFinanceData();

  // Form State
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');
  const [selectedRecipientId, setSelectedRecipientId] = useState(recipients[0]?.id || 'new');
  const [customRecipientName, setCustomRecipientName] = useState('');
  const [customRecipientEmail, setCustomRecipientEmail] = useState('');
  const [customRecipientBank, setCustomRecipientBank] = useState('');
  const [customRecipientAccount, setCustomRecipientAccount] = useState('');
  const [customRecipientRouting, setCustomRecipientRouting] = useState('');

  const [amount, setAmount] = useState<string>('4500.00');
  const [paymentMethod, setPaymentMethod] = useState<'ACH' | 'Wire' | 'Card' | 'Instant Sepa'>('ACH');
  const [category, setCategory] = useState('Software & Cloud');
  const [description, setDescription] = useState('Quarterly Software License Renewal');
  const [notes, setNotes] = useState('');

  // Confirmation Modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [lastPaymentResult, setLastPaymentResult] = useState<any>(null);

  // Add Recipient Modal
  const [addRecipientModalOpen, setAddRecipientModalOpen] = useState(false);
  const [newRecName, setNewRecName] = useState('');
  const [newRecEmail, setNewRecEmail] = useState('');
  const [newRecBank, setNewRecBank] = useState('');
  const [newRecAccount, setNewRecAccount] = useState('');
  const [newRecRouting, setNewRecRouting] = useState('');
  const [newRecType, setNewRecType] = useState<'vendor' | 'contractor' | 'employee'>('vendor');

  const selectedAccount = accounts.find(a => a.id === selectedAccountId) || accounts[0];
  const parsedAmount = parseFloat(amount) || 0;
  const isHighValue = parsedAmount >= 20000;

  const currentRecipient =
    selectedRecipientId === 'new'
      ? { name: customRecipientName || 'Custom Beneficiary', bankName: customRecipientBank || 'Beneficiary Bank' }
      : recipients.find(r => r.id === selectedRecipientId);

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAmount <= 0) return;
    setConfirmModalOpen(true);
  };

  const handleConfirmPayment = () => {
    const recipientName =
      selectedRecipientId === 'new' ? customRecipientName : currentRecipient?.name || 'Beneficiary';

    // If new recipient, save it
    if (selectedRecipientId === 'new' && customRecipientName) {
      addRecipient({
        name: customRecipientName,
        email: customRecipientEmail,
        bankName: customRecipientBank || 'International Bank',
        accountNumber: customRecipientAccount || '•••• 5001',
        routingNumber: customRecipientRouting || '021000021',
        type: 'vendor'
      });
    }

    const result = sendPayment({
      accountId: selectedAccountId,
      recipientName,
      amount: parsedAmount,
      category,
      paymentMethod,
      description: description || `Payment to ${recipientName}`,
      notes
    });

    setConfirmModalOpen(false);
    setLastPaymentResult(result.transaction);
    setSuccessModalOpen(true);
  };

  const handleAddRecipientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecName) return;
    addRecipient({
      name: newRecName,
      email: newRecEmail,
      bankName: newRecBank,
      accountNumber: newRecAccount || '•••• 8821',
      routingNumber: newRecRouting || '021000021',
      type: newRecType
    });
    setAddRecipientModalOpen(false);
    setNewRecName('');
    setNewRecEmail('');
    setNewRecBank('');
    setNewRecAccount('');
    setNewRecRouting('');
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Payments & Domestic/Wire Transfers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Initiate corporate payments, manage saved vendors, and track automated disbursement schedules
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={() => setAddRecipientModalOpen(true)}
          >
            Add New Beneficiary
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payment Initiation Form */}
        <div className="lg:col-span-7">
          <Card title="Initiate Financial Disbursement" subtitle="Authorized FIDC wire and ACH payment portal">
            <form onSubmit={handleInitiatePayment} className="space-y-4 text-xs">
              {/* Source Account */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Source Settlement Account
                </label>
                <select
                  value={selectedAccountId}
                  onChange={e => setSelectedAccountId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-xs cursor-pointer"
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} — Balance: ${acc.availableBalance.toLocaleString()} ({acc.type})
                    </option>
                  ))}
                </select>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>Available Liquidity:</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    ${selectedAccount?.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Recipient Selector */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700">
                    Beneficiary / Recipient
                  </label>
                  <button
                    type="button"
                    onClick={() => setAddRecipientModalOpen(true)}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    + Add New
                  </button>
                </div>
                <select
                  value={selectedRecipientId}
                  onChange={e => setSelectedRecipientId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-xs cursor-pointer"
                >
                  {recipients.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.bankName} - {r.accountNumber})
                    </option>
                  ))}
                  <option value="new">+ Enter One-Time Beneficiary</option>
                </select>
              </div>

              {/* If one-time recipient selected */}
              {selectedRecipientId === 'new' && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
                  <div className="font-semibold text-[11px] text-slate-700">
                    Beneficiary Banking Coordinates
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={customRecipientName}
                      onChange={e => setCustomRecipientName(e.target.value)}
                      placeholder="Beneficiary Legal Name"
                      className="p-2 border border-slate-200 rounded-md bg-white text-xs"
                    />
                    <input
                      type="email"
                      value={customRecipientEmail}
                      onChange={e => setCustomRecipientEmail(e.target.value)}
                      placeholder="Billing Email"
                      className="p-2 border border-slate-200 rounded-md bg-white text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={customRecipientBank}
                      onChange={e => setCustomRecipientBank(e.target.value)}
                      placeholder="Bank Name"
                      className="p-2 border border-slate-200 rounded-md bg-white text-xs"
                    />
                    <input
                      type="text"
                      value={customRecipientRouting}
                      onChange={e => setCustomRecipientRouting(e.target.value)}
                      placeholder="Routing / SWIFT"
                      className="p-2 border border-slate-200 rounded-md bg-white text-xs"
                    />
                    <input
                      type="text"
                      value={customRecipientAccount}
                      onChange={e => setCustomRecipientAccount(e.target.value)}
                      placeholder="Account Number"
                      className="p-2 border border-slate-200 rounded-md bg-white text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Amount with quick chips */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Disbursement Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-base font-bold text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 tabular-nums"
                  />
                </div>
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {['250', '1000', '4500', '15000', '25000'].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val + '.00')}
                      className="px-2 py-0.5 text-[11px] font-mono bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition-colors cursor-pointer"
                    >
                      ${val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Settlement Rail
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ACH', name: 'ACH Transfer', fee: 'Free · 1-2 Days' },
                    { id: 'Wire', name: 'FedWire Outflow', fee: '$15.00 · Same Day' },
                    { id: 'Instant Sepa', name: 'RTP Instant', fee: '$2.50 · Real-Time' }
                  ].map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                        paymentMethod === method.id
                          ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-semibold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="text-xs">{method.name}</div>
                      <div className="text-[10px] text-slate-500">{method.fee}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Accounting Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white text-xs cursor-pointer"
                  >
                    <option value="Software & Cloud">Software & Cloud</option>
                    <option value="Office & Equipment">Office & Equipment</option>
                    <option value="Operations">Operations</option>
                    <option value="Client Services">Client Services</option>
                    <option value="Travel & Lodging">Travel & Lodging</option>
                    <option value="Transfers">Internal Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Invoice / Reference Memo
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="e.g. INV-2026-Q3 Settlement"
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* AI Risk engine alert when high amount */}
              {isHighValue && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-amber-900 text-[11px] leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Governance Threshold Triggered:</span> Transfers over $20,000.00 will enter the Operations Manager queue for dual-authorization before release.
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 mt-2"
                icon={Send}
                disabled={parsedAmount <= 0}
              >
                Review & Authorize Payment (${parsedAmount.toFixed(2)})
              </Button>
            </form>
          </Card>
        </div>

        {/* Right column: Scheduled Payments & Saved Recipients */}
        <div className="lg:col-span-5 space-y-6">
          {/* Scheduled Payments */}
          <Card
            title="Automated Scheduled Payments"
            subtitle="Recurring vendor disbursements"
          >
            <div className="space-y-3">
              {scheduledPayments.map(sch => (
                <div
                  key={sch.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{sch.recipientName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span className="capitalize">{sch.frequency}</span>
                      <span>·</span>
                      <span>Next: {sch.nextDate}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 tabular-nums">
                      ${sch.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleScheduledPayment(sch.id)}
                      className={`text-[10px] font-medium underline cursor-pointer ${
                        sch.status === 'active' ? 'text-slate-600 hover:text-slate-900' : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      {sch.status === 'active' ? 'Pause' : 'Resume'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Saved Beneficiaries */}
          <Card
            title="Verified Beneficiaries"
            subtitle={`${recipients.length} saved accounts`}
            action={
              <button
                onClick={() => setAddRecipientModalOpen(true)}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                + Add
              </button>
            }
          >
            <div className="space-y-2.5">
              {recipients.map(r => (
                <div
                  key={r.id}
                  className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-2 hover:border-slate-300 transition-colors text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">{r.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {r.bankName} · {r.accountNumber}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRecipientId(r.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800"
                    >
                      Pay
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteRecipient(r.id)}
                      className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                      title="Remove Beneficiary"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <Modal
          isOpen={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          title="Confirm Financial Disbursement"
          subtitle="Please verify transaction parameters before digital signature"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setConfirmModalOpen(false)}>
                Modify Parameters
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmPayment}>
                Digitally Authorize & Release
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <span className="text-slate-500 block">Total Release Amount</span>
              <span className="text-2xl font-bold text-slate-900 tabular-nums">
                ${parsedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-700">
              <div>
                <span className="text-slate-400 block">Source Account</span>
                <span className="font-semibold text-slate-900">{selectedAccount?.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Beneficiary</span>
                <span className="font-semibold text-slate-900">{currentRecipient?.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Settlement Rail</span>
                <span className="font-mono">{paymentMethod}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Category</span>
                <span>{category}</span>
              </div>
            </div>

            {isHighValue && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11px]">
                ℹ️ This transaction exceeds standard instant clearing and will be held in "Under Review" state until signed off by the Operations Manager.
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Success Modal */}
      {successModalOpen && lastPaymentResult && (
        <Modal
          isOpen={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          title="Payment Successfully Initiated"
          subtitle={`Reference: ${lastPaymentResult.referenceNumber}`}
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSuccessModalOpen(false);
                  navigate('/transactions');
                }}
              >
                View General Ledger
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSuccessModalOpen(false)}
              >
                Done
              </Button>
            </>
          }
        >
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Disbursement Registered
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              ${Math.abs(lastPaymentResult.amount).toFixed(2)} has been queued via {lastPaymentResult.paymentMethod}.
            </p>
            <div className="inline-block">
              <StatusBadge status={lastPaymentResult.status} />
            </div>
          </div>
        </Modal>
      )}

      {/* Add Recipient Modal */}
      {addRecipientModalOpen && (
        <Modal
          isOpen={addRecipientModalOpen}
          onClose={() => setAddRecipientModalOpen(false)}
          title="Register New Beneficiary"
          subtitle="Add a vendor, contractor or corporate entity to your approved payees"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setAddRecipientModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleAddRecipientSubmit}>
                Save Beneficiary
              </Button>
            </>
          }
        >
          <form onSubmit={handleAddRecipientSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Legal Entity Name
              </label>
              <input
                type="text"
                required
                value={newRecName}
                onChange={e => setNewRecName(e.target.value)}
                placeholder="e.g. Acme Cloud Corp"
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={newRecEmail}
                onChange={e => setNewRecEmail(e.target.value)}
                placeholder="finance@acmecloud.com"
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  required
                  value={newRecBank}
                  onChange={e => setNewRecBank(e.target.value)}
                  placeholder="e.g. JPMorgan Chase"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Recipient Type
                </label>
                <select
                  value={newRecType}
                  onChange={e => setNewRecType(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                >
                  <option value="vendor">Vendor</option>
                  <option value="contractor">Contractor</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Routing / SWIFT
                </label>
                <input
                  type="text"
                  required
                  value={newRecRouting}
                  onChange={e => setNewRecRouting(e.target.value)}
                  placeholder="021000021"
                  className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  required
                  value={newRecAccount}
                  onChange={e => setNewRecAccount(e.target.value)}
                  placeholder="9840294100"
                  className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
