import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  Lock,
  Key,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Bell,
  Smartphone,
  Save
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';

export const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();

  const [name, setName] = useState(currentUser?.name || 'Sarah Chen');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 234-8901');
  const [email] = useState(currentUser?.email || 'sarah.chen@acmeventures.io');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Preference switches
  const [twoFactor, setTwoFactor] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [wireConfirmations, setWireConfirmations] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Account Profile & Governance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your authorized corporate credentials, security protocols, and operational limits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status="verified" label="KYC Level 3 Verified" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Personal info & Company */}
        <div className="lg:col-span-8 space-y-6">
          <Card title="Corporate Identity & Contact Information" subtitle="Authorized signatory on general ledger accounts">
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Signatory Legal Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Corporate Email (SSO Identity)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 text-xs cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mobile Phone (MFA Authenticator)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Registered Enterprise
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      disabled
                      value="Acme Financial Ventures Inc."
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 text-xs cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <Button type="submit" variant="primary" size="sm" icon={Save}>
                  Save Profile Changes
                </Button>
                {savedSuccess && (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Credentials updated successfully
                  </span>
                )}
              </div>
            </form>
          </Card>

          {/* Account Tier & Operational Thresholds */}
          <Card title="Disbursement & Clearing Limits" subtitle="Tier 2 Commercial Banking Schedule">
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Daily ACH Outflow Limit</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums block mt-1">
                    $100,000.00
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium">Available: $85,800.00</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Single Wire Threshold</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums block mt-1">
                    $500,000.00
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Dual Approval: &gt; $20,000</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Corporate Card Daily Cap</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums block mt-1">
                    $25,000.00
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium">Active Token Protection</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                Need to raise your transfer threshold? Submit a formal limit increase request via our AI Support Desk with attached quarterly financial statements.
              </p>
            </div>
          </Card>

          {/* Compliance & KYC Documents */}
          <Card title="Verified Enterprise Documents" subtitle="FIDC & FinCEN compliance record">
            <div className="space-y-2 text-xs">
              {[
                { name: 'Certificate of Corporate Incorporation (Delaware)', date: 'Verified 2024-03-12', size: '2.4 MB PDF' },
                { name: 'FinCEN Beneficial Ownership Information (BOI)', date: 'Verified 2025-01-15', size: '1.1 MB PDF' },
                { name: 'Form W-9 Tax Identification Form', date: 'Verified 2026-01-08', size: '420 KB PDF' }
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">{doc.name}</div>
                      <div className="text-[11px] text-slate-500">{doc.date} · {doc.size}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Compliant
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Security Controls & Notifications */}
        <div className="lg:col-span-4 space-y-6">
          {/* Security & Authentication */}
          <Card title="Security & Authentication" subtitle="Multi-layer account security">
            <div className="space-y-4 text-xs">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="font-semibold text-slate-900">Two-Factor Authentication</div>
                  <div className="text-[11px] text-slate-500">
                    Enforced for all wire disbursements
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={e => setTwoFactor(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 mt-1 cursor-pointer"
                />
              </div>

              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="font-semibold text-slate-900">Email Settlement Receipts</div>
                  <div className="text-[11px] text-slate-500">
                    Notify when incoming ACH clears
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={e => setEmailAlerts(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 mt-1 cursor-pointer"
                />
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">High-Risk Fraud Alerts</div>
                  <div className="text-[11px] text-slate-500">
                    Instant SMS for blocked transactions
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={wireConfirmations}
                  onChange={e => setWireConfirmations(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 mt-1 cursor-pointer"
                />
              </div>
            </div>
          </Card>

          {/* Active Terminals & Sessions */}
          <Card title="Authorized Active Terminals" subtitle="Session access logs">
            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">MacBook Pro (Chrome)</span>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                    Current
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  IP: 198.51.100.4 · New York, USA
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">iPhone 16 Pro (Mobile App)</span>
                  <span className="text-[10px] text-slate-400">2h ago</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  IP: 172.56.21.88 · New York, USA
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
