export type UserRole = 'customer' | 'analyst' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone: string;
  accountNumber?: string;
  tier?: string;
  kycStatus: 'verified' | 'pending' | 'action_required';
  department?: string;
  lastLogin: string;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'refund' | 'fee';

export type TransactionStatus = 'completed' | 'pending' | 'under_review' | 'flagged' | 'rejected' | 'refunded';

export type TransactionCategory =
  | 'Income & Salary'
  | 'Software & Cloud'
  | 'Office & Equipment'
  | 'Travel & Lodging'
  | 'Client Services'
  | 'Utilities & Facilities'
  | 'Operations'
  | 'Transfers';

export interface Transaction {
  id: string;
  referenceNumber: string;
  date: string;
  timestamp: string;
  description: string;
  counterparty: string;
  counterpartyAccount?: string;
  category: TransactionCategory;
  type: TransactionType;
  amount: number; // positive for credit/inflow, negative for debit/outflow
  currency: string;
  status: TransactionStatus;
  riskScore: number; // 0 - 100
  flagReason?: string;
  reviewedBy?: string;
  notes?: string;
  paymentMethod: 'ACH' | 'Wire' | 'Card' | 'Instant Sepa';
}

export interface BankAccount {
  id: string;
  name: string;
  type: 'Checking' | 'Savings' | 'Business Treasury' | 'Escrow Reserve';
  accountNumber: string;
  routingNumber: string;
  balance: number;
  availableBalance: number;
  currency: string;
  status: 'active' | 'frozen';
}

export interface PaymentRecipient {
  id: string;
  name: string;
  email: string;
  accountNumber: string;
  bankName: string;
  routingNumber: string;
  type: 'vendor' | 'contractor' | 'employee' | 'other';
  lastPaymentDate?: string;
}

export interface ScheduledPayment {
  id: string;
  recipientName: string;
  amount: number;
  frequency: 'one-time' | 'weekly' | 'bi-weekly' | 'monthly';
  nextDate: string;
  category: string;
  status: 'active' | 'paused';
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: 'Transaction Dispute' | 'Payment Failure' | 'Account Security' | 'Fee Inquiry' | 'General Query';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  createdAt: string;
  lastUpdated: string;
  assignedTo?: string;
  aiSuggestedResolution?: string;
  messages: {
    id: string;
    sender: 'user' | 'agent' | 'ai_assistant';
    senderName: string;
    timestamp: string;
    content: string;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface FinancialMetric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  actorRole: UserRole;
  targetId: string;
  targetType: 'transaction' | 'account' | 'user' | 'ticket';
  timestamp: string;
  details: string;
}

export interface ReportSummary {
  id: string;
  title: string;
  period: string;
  type: 'reconciliation' | 'compliance' | 'liquidity' | 'executive';
  generatedDate: string;
  fileSize: string;
  status: 'ready' | 'processing';
  summaryStats: {
    totalVolume: number;
    transactionCount: number;
    reconciledRate: number;
    discrepancyCount: number;
  };
}
