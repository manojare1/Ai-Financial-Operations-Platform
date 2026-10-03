import React, { createContext, useContext, useState } from 'react';
import {
  BankAccount,
  Transaction,
  PaymentRecipient,
  ScheduledPayment,
  SupportTicket,
  AuditLog,
  ReportSummary,
  TransactionStatus
} from '../types';
import {
  INITIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_RECIPIENTS,
  INITIAL_SCHEDULED_PAYMENTS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_AUDIT_LOGS,
  INITIAL_REPORTS
} from '../data/mockData';
import { useAuth } from './AuthContext';

interface FinanceDataContextType {
  accounts: BankAccount[];
  transactions: Transaction[];
  recipients: PaymentRecipient[];
  scheduledPayments: ScheduledPayment[];
  supportTickets: SupportTicket[];
  auditLogs: AuditLog[];
  reports: ReportSummary[];
  sendPayment: (params: {
    accountId: string;
    recipientName: string;
    amount: number;
    category: any;
    paymentMethod: 'ACH' | 'Wire' | 'Card' | 'Instant Sepa';
    description: string;
    notes?: string;
  }) => { success: boolean; transaction: Transaction };
  updateTransactionStatus: (
    transactionId: string,
    newStatus: TransactionStatus,
    reason?: string
  ) => void;
  disputeTransaction: (transactionId: string, disputeReason: string) => string;
  addRecipient: (recipient: Omit<PaymentRecipient, 'id'>) => void;
  deleteRecipient: (id: string) => void;
  addScheduledPayment: (payment: Omit<ScheduledPayment, 'id'>) => void;
  toggleScheduledPayment: (id: string) => void;
  addSupportTicket: (ticket: {
    subject: string;
    category: any;
    priority: any;
    initialMessage: string;
  }) => SupportTicket;
  replyToTicket: (ticketId: string, message: string) => void;
  generateReport: (title: string, type: any, period: string) => ReportSummary;
}

const FinanceDataContext = createContext<FinanceDataContextType | undefined>(undefined);

export const FinanceDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [accounts, setAccounts] = useState<BankAccount[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [recipients, setRecipients] = useState<PaymentRecipient[]>(INITIAL_RECIPIENTS);
  const [scheduledPayments, setScheduledPayments] = useState<ScheduledPayment[]>(INITIAL_SCHEDULED_PAYMENTS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [reports, setReports] = useState<ReportSummary[]>(INITIAL_REPORTS);

  const sendPayment = ({
    accountId,
    recipientName,
    amount,
    category,
    paymentMethod,
    description,
    notes
  }: {
    accountId: string;
    recipientName: string;
    amount: number;
    category: any;
    paymentMethod: 'ACH' | 'Wire' | 'Card' | 'Instant Sepa';
    description: string;
    notes?: string;
  }) => {
    // Determine risk score dynamically: higher amount -> risk check
    const isHighValue = amount >= 20000;
    const isMediumValue = amount >= 10000;
    const initialStatus: TransactionStatus = isHighValue
      ? 'under_review'
      : isMediumValue
      ? 'pending'
      : 'completed';

    const riskScore = isHighValue ? 68 : isMediumValue ? 35 : Math.floor(Math.random() * 10) + 2;

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      referenceNumber: `TX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' UTC',
      description: description || `Transfer to ${recipientName}`,
      counterparty: recipientName,
      category: category || 'Operations',
      type: 'payment',
      amount: -Math.abs(amount),
      currency: 'USD',
      status: initialStatus,
      riskScore,
      paymentMethod,
      notes,
      flagReason: isHighValue ? 'Threshold policy exceeded: requires dual manager approval' : undefined
    };

    // Update account balances
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id === accountId) {
          return {
            ...acc,
            availableBalance: acc.availableBalance - Math.abs(amount),
            balance: initialStatus === 'completed' ? acc.balance - Math.abs(amount) : acc.balance
          };
        }
        return acc;
      })
    );

    // Prepend to transactions
    setTransactions(prev => [newTx, ...prev]);

    // Append audit log
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      action: 'PAYMENT_INITIATED',
      actor: currentUser?.name || 'Authorized User',
      actorRole: currentUser?.role || 'customer',
      targetId: newTx.referenceNumber,
      targetType: 'transaction',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      details: `Initiated ${paymentMethod} payment of $${amount.toFixed(2)} to ${recipientName}. Status: ${initialStatus}`
    };
    setAuditLogs(prev => [log, ...prev]);

    return { success: true, transaction: newTx };
  };

  const updateTransactionStatus = (
    transactionId: string,
    newStatus: TransactionStatus,
    reason?: string
  ) => {
    setTransactions(prev =>
      prev.map(tx => {
        if (tx.id === transactionId) {
          return {
            ...tx,
            status: newStatus,
            reviewedBy: currentUser?.name,
            notes: reason ? `${tx.notes ? tx.notes + ' | ' : ''}${reason}` : tx.notes
          };
        }
        return tx;
      })
    );

    const targetTx = transactions.find(t => t.id === transactionId);
    if (targetTx) {
      const log: AuditLog = {
        id: `log_${Date.now()}`,
        action: `TRANSACTION_${newStatus.toUpperCase()}`,
        actor: currentUser?.name || 'Operations Analyst',
        actorRole: currentUser?.role || 'analyst',
        targetId: targetTx.referenceNumber,
        targetType: 'transaction',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        details: `Updated status from ${targetTx.status} to ${newStatus}. ${reason ? 'Reason: ' + reason : ''}`
      };
      setAuditLogs(prev => [log, ...prev]);
    }
  };

  const disputeTransaction = (transactionId: string, disputeReason: string): string => {
    const targetTx = transactions.find(t => t.id === transactionId);
    if (!targetTx) return '';

    // Mark tx under review
    updateTransactionStatus(transactionId, 'under_review', `Disputed by user: ${disputeReason}`);

    // Create a support ticket
    const ticketId = `tkt_${Date.now()}`;
    const newTicket: SupportTicket = {
      id: ticketId,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: `Dispute: ${targetTx.description} (${targetTx.referenceNumber})`,
      category: 'Transaction Dispute',
      priority: 'high',
      status: 'open',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      lastUpdated: 'Just now',
      assignedTo: 'Marcus Vance (Ops Analyst)',
      aiSuggestedResolution: `AI Intake: Client flagged charge of $${Math.abs(targetTx.amount).toFixed(2)}. Provisional hold recommended pending merchant receipt verification.`,
      messages: [
        {
          id: `msg_${Date.now()}`,
          sender: 'user',
          senderName: currentUser?.name || 'Customer',
          timestamp: 'Just now',
          content: `I would like to dispute transaction ${targetTx.referenceNumber} for $${Math.abs(targetTx.amount).toFixed(2)}. Reason: ${disputeReason}`
        },
        {
          id: `msg_${Date.now() + 1}`,
          sender: 'ai_assistant',
          senderName: 'FinOps AI Copilot',
          timestamp: 'Just now',
          content: `Your dispute for ${targetTx.referenceNumber} has been received. Our automated risk protection model has isolated this charge and notified our Financial Operations team for review within 4 business hours.`
        }
      ]
    };

    setSupportTickets(prev => [newTicket, ...prev]);
    return ticketId;
  };

  const addRecipient = (recipient: Omit<PaymentRecipient, 'id'>) => {
    const newRec: PaymentRecipient = {
      ...recipient,
      id: `rec_${Date.now()}`,
      lastPaymentDate: 'Never'
    };
    setRecipients(prev => [newRec, ...prev]);
  };

  const deleteRecipient = (id: string) => {
    setRecipients(prev => prev.filter(r => r.id !== id));
  };

  const addScheduledPayment = (payment: Omit<ScheduledPayment, 'id'>) => {
    const newPayment: ScheduledPayment = {
      ...payment,
      id: `sch_${Date.now()}`
    };
    setScheduledPayments(prev => [...prev, newPayment]);
  };

  const toggleScheduledPayment = (id: string) => {
    setScheduledPayments(prev =>
      prev.map(p => (p.id === id ? { ...p, status: p.status === 'active' ? 'paused' : 'active' } : p))
    );
  };

  const addSupportTicket = ({
    subject,
    category,
    priority,
    initialMessage
  }: {
    subject: string;
    category: any;
    priority: any;
    initialMessage: string;
  }): SupportTicket => {
    const ticketId = `tkt_${Date.now()}`;
    const newTicket: SupportTicket = {
      id: ticketId,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject,
      category,
      priority,
      status: 'open',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      lastUpdated: 'Just now',
      assignedTo: 'Marcus Vance (Ops Analyst)',
      aiSuggestedResolution: 'AI Triaging Engine: Priority categorized as ' + priority + '. Suggested canned response available in analyst workspace.',
      messages: [
        {
          id: `msg_${Date.now()}`,
          sender: 'user',
          senderName: currentUser?.name || 'Customer',
          timestamp: 'Just now',
          content: initialMessage
        },
        {
          id: `msg_${Date.now() + 1}`,
          sender: 'ai_assistant',
          senderName: 'FinOps AI Copilot',
          timestamp: 'Just now',
          content: 'Thank you for reaching out. We have logged your request. Our automated routing system has dispatched this to an operations specialist based on your account priority.'
        }
      ]
    };

    setSupportTickets(prev => [newTicket, ...prev]);
    return newTicket;
  };

  const replyToTicket = (ticketId: string, message: string) => {
    const isCustomer = currentUser?.role === 'customer';
    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: isCustomer ? ('user' as const) : ('agent' as const),
      senderName: currentUser?.name || 'User',
      timestamp: 'Just now',
      content: message
    };

    setSupportTickets(prev =>
      prev.map(tkt => {
        if (tkt.id === ticketId) {
          return {
            ...tkt,
            lastUpdated: 'Just now',
            status: isCustomer ? 'open' : 'waiting_customer',
            messages: [...tkt.messages, newMsg]
          };
        }
        return tkt;
      })
    );
  };

  const generateReport = (title: string, type: any, period: string): ReportSummary => {
    const newReport: ReportSummary = {
      id: `rep_${Date.now()}`,
      title,
      period,
      type,
      generatedDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
      fileSize: '1.2 MB PDF',
      status: 'ready',
      summaryStats: {
        totalVolume: 420800.0,
        transactionCount: 88,
        reconciledRate: 99.8,
        discrepancyCount: 0
      }
    };
    setReports(prev => [newReport, ...prev]);
    return newReport;
  };

  return (
    <FinanceDataContext.Provider
      value={{
        accounts,
        transactions,
        recipients,
        scheduledPayments,
        supportTickets,
        auditLogs,
        reports,
        sendPayment,
        updateTransactionStatus,
        disputeTransaction,
        addRecipient,
        deleteRecipient,
        addScheduledPayment,
        toggleScheduledPayment,
        addSupportTicket,
        replyToTicket,
        generateReport
      }}
    >
      {children}
    </FinanceDataContext.Provider>
  );
};

export const useFinanceData = () => {
  const context = useContext(FinanceDataContext);
  if (!context) {
    throw new Error('useFinanceData must be used within a FinanceDataProvider');
  }
  return context;
};
