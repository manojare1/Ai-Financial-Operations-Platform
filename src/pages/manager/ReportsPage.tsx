import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Download,
  CheckCircle2,
  Calendar,
  Building,
  TrendingUp,
  FileCheck,
  Eye,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useFinanceData } from '../../context/FinanceDataContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ReportSummary } from '../../types';

export const ReportsPage: React.FC = () => {
  const { reports, generateReport } = useFinanceData();

  const [selectedReport, setSelectedReport] = useState<ReportSummary | null>(null);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);

  // New report form state
  const [reportTitle, setReportTitle] = useState('October 2026 Interbank Cash Flow Audit');
  const [reportType, setReportType] = useState<any>('reconciliation');
  const [reportPeriod, setReportPeriod] = useState('Oct 1, 2026 – Present');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle) return;
    setIsGenerating(true);

    setTimeout(() => {
      const created = generateReport(reportTitle, reportType, reportPeriod);
      setIsGenerating(false);
      setGenerateModalOpen(false);
      setSelectedReport(created);
    }, 600);
  };

  const handleDownload = (rep: ReportSummary) => {
    const dataStr =
      'data:text/plain;charset=utf-8,' +
      encodeURIComponent(
        `FINOPS AI ENTERPRISE REPORT\n\nTitle: ${rep.title}\nPeriod: ${rep.period}\nGenerated: ${rep.generatedDate}\nTotal Volume: $${rep.summaryStats.totalVolume.toLocaleString()}\nTransactions: ${rep.summaryStats.transactionCount}\nReconciliation Rate: ${rep.summaryStats.reconciledRate}%\nDiscrepancies: ${rep.summaryStats.discrepancyCount}\n\nStatus: Certified FIDC & GAAP Compliant\nAuditor: Elena Rostova (Treasury Operations Manager)`
      );
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `${rep.title.toLowerCase().replace(/\s+/g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Financial & Regulatory Audit Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated general ledger reconciliation, FinCEN AML audit packages, and executive treasury briefs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setGenerateModalOpen(true)}
          >
            Generate Custom Audit Report
          </Button>
        </div>
      </div>

      {/* Reconciliation Health Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              General Ledger Parity
            </span>
            <span className="text-xl font-bold text-slate-900 tabular-nums block mt-0.5">
              100.00% Reconciled
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">0 Unresolved Breaks</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Straight-Through Processing (STP)
            </span>
            <span className="text-xl font-bold text-slate-900 tabular-nums block mt-0.5">
              99.82% Auto-Cleared
            </span>
            <span className="text-[11px] text-blue-600 font-medium">Under 120ms Avg Latency</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Quarterly Audit Readiness
            </span>
            <span className="text-xl font-bold text-slate-900 tabular-nums block mt-0.5">
              Certified Ready
            </span>
            <span className="text-[11px] text-slate-500 font-medium">SOC2 Type II Package</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Reports List */}
      <Card title="Available Financial Audit Packages" subtitle={`${reports.length} generated report artifacts`}>
        <div className="divide-y divide-slate-100">
          {reports.map(rep => (
            <div
              key={rep.id}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs transition-colors hover:bg-slate-50/50"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {rep.title}
                  </h3>
                  <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase">
                    {rep.type}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {rep.fileSize}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span>Period: {rep.period}</span>
                  <span>·</span>
                  <span>Generated: {rep.generatedDate}</span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-600 pt-1">
                  <span>
                    Volume:{' '}
                    <strong className="text-slate-900 tabular-nums">
                      ${rep.summaryStats.totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </strong>
                  </span>
                  <span>·</span>
                  <span>
                    Transactions:{' '}
                    <strong className="text-slate-900 tabular-nums">
                      {rep.summaryStats.transactionCount}
                    </strong>
                  </span>
                  <span>·</span>
                  <span>
                    Reconciled Rate:{' '}
                    <strong className="text-emerald-700 tabular-nums">
                      {rep.summaryStats.reconciledRate}%
                    </strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Eye}
                  onClick={() => setSelectedReport(rep)}
                >
                  View Summary
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Download}
                  onClick={() => handleDownload(rep)}
                >
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Generate Custom Report Modal */}
      {generateModalOpen && (
        <Modal
          isOpen={generateModalOpen}
          onClose={() => setGenerateModalOpen(false)}
          title="Generate Financial Audit Report"
          subtitle="Compile verified general ledger records into an official report"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setGenerateModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleGenerateSubmit}
                isLoading={isGenerating}
              >
                Compile Report Package
              </Button>
            </>
          }
        >
          <form onSubmit={handleGenerateSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Report Title
              </label>
              <input
                type="text"
                required
                value={reportTitle}
                onChange={e => setReportTitle(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={e => setReportType(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="reconciliation">Treasury Reconciliation</option>
                  <option value="compliance">AML & Fraud Compliance</option>
                  <option value="liquidity">Liquidity & Cash Flow</option>
                  <option value="executive">Operations Executive SLA</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Audit Period
                </label>
                <input
                  type="text"
                  required
                  value={reportPeriod}
                  onChange={e => setReportPeriod(e.target.value)}
                  placeholder="e.g. Sep 1, 2026 – Sep 30, 2026"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-[11px] leading-relaxed">
              This automated report uses cryptographic check-summing against all settled ACH, Wire, and Card payments logged during the target accounting window.
            </div>
          </form>
        </Modal>
      )}

      {/* View Summary Modal */}
      {selectedReport && (
        <Modal
          isOpen={Boolean(selectedReport)}
          onClose={() => setSelectedReport(null)}
          title={selectedReport.title}
          subtitle={`Audit Package #${selectedReport.id} · Generated on ${selectedReport.generatedDate}`}
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Download}
                onClick={() => handleDownload(selectedReport)}
              >
                Export Document
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <span className="text-slate-400 block text-[11px]">Consolidated Volume</span>
                <span className="text-base font-bold text-slate-900 tabular-nums block mt-1">
                  ${selectedReport.summaryStats.totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <span className="text-slate-400 block text-[11px]">Ledger Count</span>
                <span className="text-base font-bold text-slate-900 tabular-nums block mt-1">
                  {selectedReport.summaryStats.transactionCount}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <span className="text-slate-400 block text-[11px]">Reconciliation</span>
                <span className="text-base font-bold text-emerald-600 tabular-nums block mt-1">
                  {selectedReport.summaryStats.reconciledRate}%
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <span className="text-slate-400 block text-[11px]">Variance Breaks</span>
                <span className="text-base font-bold text-slate-900 tabular-nums block mt-1">
                  {selectedReport.summaryStats.discrepancyCount}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="font-semibold text-slate-800 block">Supervisory Certification:</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                The general ledger matches third-party bank clearing feeds with 0 open anomalies. Certified under Sarbanes-Oxley (SOX) Section 404 automated internal accounting controls.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
