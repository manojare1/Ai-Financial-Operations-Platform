import {
  User,
  BankAccount,
  Transaction,
  PaymentRecipient,
  ScheduledPayment,
  SupportTicket,
  NotificationItem,
  AuditLog,
  ReportSummary
} from '../types';

export const DEMO_USERS: Record<string, User> = {
  customer: {
    id: 'usr_cust_01',
    name: 'Sarah Chen',
    email: 'sarah.chen@acmeventures.io',
    role: 'customer',
    phone: '+1 (555) 234-8901',
    accountNumber: '•••• 4920',
    tier: 'Corporate Platinum',
    kycStatus: 'verified',
    lastLogin: '2026-10-01 09:14 AM'
  },
  analyst: {
    id: 'usr_ops_02',
    name: 'Marcus Vance',
    email: 'm.vance@finops.internal',
    role: 'analyst',
    phone: '+1 (555) 412-9082',
    department: 'Fraud & Financial Operations',
    kycStatus: 'verified',
    lastLogin: '2026-10-01 08:30 AM'
  },
  manager: {
    id: 'usr_mgr_03',
    name: 'Elena Rostova',
    email: 'e.rostova@finops.internal',
    role: 'manager',
    phone: '+1 (555) 890-1294',
    department: 'Treasury & Risk Governance',
    kycStatus: 'verified',
    lastLogin: '2026-10-01 08:05 AM'
  }
};

export const INITIAL_ACCOUNTS: BankAccount[] = [
  {
    id: 'acc_01',
    name: 'Operating Checking',
    type: 'Checking',
    accountNumber: '984029414920',
    routingNumber: '021000021',
    balance: 142850.45,
    availableBalance: 138350.45,
    currency: 'USD',
    status: 'active'
  },
  {
    id: 'acc_02',
    name: 'Treasury Yield Reserve',
    type: 'Business Treasury',
    accountNumber: '984029418831',
    routingNumber: '021000021',
    balance: 520400.00,
    availableBalance: 520400.00,
    currency: 'USD',
    status: 'active'
  },
  {
    id: 'acc_03',
    name: 'Tax & Escrow Provision',
    type: 'Escrow Reserve',
    accountNumber: '984029411099',
    routingNumber: '021000021',
    balance: 48920.80,
    availableBalance: 48920.80,
    currency: 'USD',
    status: 'active'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_101',
    referenceNumber: 'TX-2026-9812',
    date: '2026-09-30',
    timestamp: '16:42:10 UTC',
    description: 'Stripe Merchant Payout - Enterprise Settlement',
    counterparty: 'Stripe Payments UK',
    category: 'Income & Salary',
    type: 'deposit',
    amount: 34500.00,
    currency: 'USD',
    status: 'completed',
    riskScore: 6,
    paymentMethod: 'ACH'
  },
  {
    id: 'tx_102',
    referenceNumber: 'TX-2026-9811',
    date: '2026-09-30',
    timestamp: '14:20:05 UTC',
    description: 'Amazon Web Services Cloud Infrastructure Q3',
    counterparty: 'Amazon Web Services Inc',
    category: 'Software & Cloud',
    type: 'payment',
    amount: -4280.50,
    currency: 'USD',
    status: 'completed',
    riskScore: 12,
    paymentMethod: 'Card'
  },
  {
    id: 'tx_103',
    referenceNumber: 'TX-2026-9810',
    date: '2026-09-29',
    timestamp: '19:10:44 UTC',
    description: 'Wire Transfer - Apex Global Hardware Ltd',
    counterparty: 'Apex Global Hardware Ltd',
    category: 'Office & Equipment',
    type: 'transfer',
    amount: -18500.00,
    currency: 'USD',
    status: 'under_review',
    riskScore: 78,
    flagReason: 'Velocity surge & cross-border recipient mismatch',
    paymentMethod: 'Wire',
    notes: 'Triggered AI anomaly model: New international beneficiary account.'
  },
  {
    id: 'tx_104',
    referenceNumber: 'TX-2026-9809',
    date: '2026-09-29',
    timestamp: '11:05:12 UTC',
    description: 'Client Retainer Deposit - Meridian Group',
    counterparty: 'Meridian Capital Partners',
    category: 'Client Services',
    type: 'deposit',
    amount: 12000.00,
    currency: 'USD',
    status: 'completed',
    riskScore: 4,
    paymentMethod: 'Wire'
  },
  {
    id: 'tx_105',
    referenceNumber: 'TX-2026-9808',
    date: '2026-09-28',
    timestamp: '15:30:00 UTC',
    description: 'Commercial Office Lease - Midtown Tower 14',
    counterparty: 'Midtown Commercial Realty',
    category: 'Utilities & Facilities',
    type: 'payment',
    amount: -8400.00,
    currency: 'USD',
    status: 'completed',
    riskScore: 8,
    paymentMethod: 'ACH'
  },
  {
    id: 'tx_106',
    referenceNumber: 'TX-2026-9807',
    date: '2026-09-28',
    timestamp: '10:14:22 UTC',
    description: 'Software Subscription - Figma Organization Team',
    counterparty: 'Figma Inc',
    category: 'Software & Cloud',
    type: 'payment',
    amount: -720.00,
    currency: 'USD',
    status: 'completed',
    riskScore: 5,
    paymentMethod: 'Card'
  },
  {
    id: 'tx_107',
    referenceNumber: 'TX-2026-9806',
    date: '2026-09-27',
    timestamp: '22:45:18 UTC',
    description: 'High Value Liquidity Transfer to Treasury Reserve',
    counterparty: 'Internal Treasury Yield #8831',
    category: 'Transfers',
    type: 'transfer',
    amount: -50000.00,
    currency: 'USD',
    status: 'completed',
    riskScore: 10,
    paymentMethod: 'ACH'
  },
  {
    id: 'tx_108',
    referenceNumber: 'TX-2026-9805',
    date: '2026-09-27',
    timestamp: '09:00:11 UTC',
    description: 'Suspicious Offshore Card Terminal Attempt',
    counterparty: 'Global Digital Mart N.V.',
    category: 'Operations',
    type: 'payment',
    amount: -9600.00,
    currency: 'USD',
    status: 'flagged',
    riskScore: 92,
    flagReason: 'Known high-risk merchant code & geo-mismatch',
    paymentMethod: 'Card',
    notes: 'Blocked by automated risk rules. Requires manual compliance signoff.'
  },
  {
    id: 'tx_109',
    referenceNumber: 'TX-2026-9804',
    date: '2026-09-26',
    timestamp: '13:12:30 UTC',
    description: 'Legal & Compliance Audit Retainer',
    counterparty: 'Vanguard Legal Advisory LLC',
    category: 'Operations',
    type: 'payment',
    amount: -5500.00,
    currency: 'USD',
    status: 'completed',
    riskScore: 9,
    paymentMethod: 'ACH'
  },
  {
    id: 'tx_110',
    referenceNumber: 'TX-2026-9803',
    date: '2026-09-25',
    timestamp: '17:08:40 UTC',
    description: 'Executive Travel - Delta Air Lines Flight',
    counterparty: 'Delta Air Lines',
    category: 'Travel & Lodging',
    type: 'payment',
    amount: -1450.20,
    currency: 'USD',
    status: 'completed',
    riskScore: 7,
    paymentMethod: 'Card'
  },
  {
    id: 'tx_111',
    referenceNumber: 'TX-2026-9802',
    date: '2026-09-24',
    timestamp: '11:45:00 UTC',
    description: 'Customer Invoice Settlement #INV-4921',
    counterparty: 'Kensington Data Systems',
    category: 'Client Services',
    type: 'deposit',
    amount: 18750.00,
    currency: 'USD',
    status: 'completed',
    riskScore: 3,
    paymentMethod: 'ACH'
  },
  {
    id: 'tx_112',
    referenceNumber: 'TX-2026-9801',
    date: '2026-09-24',
    timestamp: '08:22:15 UTC',
    description: 'Contractor Payment - Senior Security Architect',
    counterparty: 'David Sterling Consulting',
    category: 'Operations',
    type: 'payment',
    amount: -6200.00,
    currency: 'USD',
    status: 'pending',
    riskScore: 18,
    paymentMethod: 'ACH'
  },
  {
    id: 'tx_113',
    referenceNumber: 'TX-2026-9800',
    date: '2026-09-23',
    timestamp: '14:50:19 UTC',
    description: 'Disputed Duplicate Charge - Cloudflare Inc',
    counterparty: 'Cloudflare Network Ops',
    category: 'Software & Cloud',
    type: 'refund',
    amount: 320.00,
    currency: 'USD',
    status: 'completed',
    riskScore: 5,
    paymentMethod: 'Card'
  },
  {
    id: 'tx_114',
    referenceNumber: 'TX-2026-9799',
    date: '2026-09-22',
    timestamp: '19:40:02 UTC',
    description: 'Wire Transfer Outflow - Quantum Hardware Dist',
    counterparty: 'Quantum Hardware Dist Ltd',
    category: 'Office & Equipment',
    type: 'transfer',
    amount: -24100.00,
    currency: 'USD',
    status: 'pending',
    riskScore: 65,
    flagReason: 'Dual authorization threshold exceeded ($20k+)',
    paymentMethod: 'Wire',
    notes: 'Awaiting secondary manager authorization.'
  }
];

export const INITIAL_RECIPIENTS: PaymentRecipient[] = [
  {
    id: 'rec_01',
    name: 'Amazon Web Services Inc',
    email: 'billing@aws.amazon.com',
    accountNumber: '•••• 8912',
    bankName: 'JPMorgan Chase Bank',
    routingNumber: '021000021',
    type: 'vendor',
    lastPaymentDate: '2026-09-30'
  },
  {
    id: 'rec_02',
    name: 'Apex Global Hardware Ltd',
    email: 'finance@apexglobal.co.uk',
    accountNumber: '•••• 4410',
    bankName: 'HSBC International',
    routingNumber: '011000138',
    type: 'vendor',
    lastPaymentDate: '2026-09-29'
  },
  {
    id: 'rec_03',
    name: 'David Sterling Consulting',
    email: 'david@sterlingsecurity.io',
    accountNumber: '•••• 1928',
    bankName: 'Silicon Valley Bank / First Citizens',
    routingNumber: '121140399',
    type: 'contractor',
    lastPaymentDate: '2026-09-24'
  },
  {
    id: 'rec_04',
    name: 'Midtown Commercial Realty',
    email: 'leasing@midtownprop.com',
    accountNumber: '•••• 6032',
    bankName: 'Bank of America',
    routingNumber: '026009593',
    type: 'vendor',
    lastPaymentDate: '2026-09-28'
  },
  {
    id: 'rec_05',
    name: 'Vanguard Legal Advisory LLC',
    email: 'accounts@vanguardlegal.com',
    accountNumber: '•••• 7721',
    bankName: 'Citibank N.A.',
    routingNumber: '021000089',
    type: 'vendor',
    lastPaymentDate: '2026-09-26'
  }
];

export const INITIAL_SCHEDULED_PAYMENTS: ScheduledPayment[] = [
  {
    id: 'sch_01',
    recipientName: 'Midtown Commercial Realty',
    amount: 8400.00,
    frequency: 'monthly',
    nextDate: '2026-10-28',
    category: 'Utilities & Facilities',
    status: 'active'
  },
  {
    id: 'sch_02',
    recipientName: 'Amazon Web Services Inc',
    amount: 4500.00,
    frequency: 'monthly',
    nextDate: '2026-10-30',
    category: 'Software & Cloud',
    status: 'active'
  },
  {
    id: 'sch_03',
    recipientName: 'David Sterling Consulting',
    amount: 6200.00,
    frequency: 'bi-weekly',
    nextDate: '2026-10-08',
    category: 'Operations',
    status: 'active'
  }
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt_201',
    ticketNumber: 'TKT-8841',
    subject: 'Wire transfer TX-2026-9810 pending verification inquiry',
    category: 'Payment Failure',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2026-09-29 19:45',
    lastUpdated: '2026-09-30 08:30',
    assignedTo: 'Marcus Vance (Ops Analyst)',
    aiSuggestedResolution: 'Beneficiary bank IBAN checksum passed. Risk model triggered due to first-time beneficiary wire > $15,000. Recommend manual approval upon 2FA phone confirmation.',
    messages: [
      {
        id: 'msg_01',
        sender: 'user',
        senderName: 'Sarah Chen',
        timestamp: 'Sep 29, 2026 19:45',
        content: 'Hello, our supplier Apex Global Hardware notified us that the $18,500 wire has not arrived yet. The dashboard shows "Under Review". Can you expedite this transfer?'
      },
      {
        id: 'msg_02',
        sender: 'ai_assistant',
        senderName: 'FinOps AI Copilot',
        timestamp: 'Sep 29, 2026 19:46',
        content: 'Automated Diagnostic: The transfer TX-2026-9810 was routed to our enhanced due diligence queue because it exceeds $15,000 to a newly added overseas account. A finance operations analyst has been assigned. Estimated SLA resolution: under 2 hours.'
      },
      {
        id: 'msg_03',
        sender: 'agent',
        senderName: 'Marcus Vance (Ops Analyst)',
        timestamp: 'Sep 30, 2026 08:30',
        content: 'Hi Sarah, I am verifying the SWIFT routing instructions now. We just need to confirm you initiated this from your verified IP in New York. Once confirmed, we will release the hold.'
      }
    ]
  },
  {
    id: 'tkt_202',
    ticketNumber: 'TKT-8842',
    subject: 'Dispute request: Unknown card charge from Global Digital Mart',
    category: 'Transaction Dispute',
    priority: 'urgent',
    status: 'open',
    createdAt: '2026-09-28 10:30',
    lastUpdated: '2026-09-28 11:15',
    assignedTo: 'Marcus Vance (Ops Analyst)',
    aiSuggestedResolution: 'AI Fraud Detection: Charge matched known card-not-present fraud campaign in Curacao. Card token has been frozen. Immediate provisional credit recommended.',
    messages: [
      {
        id: 'msg_11',
        sender: 'user',
        senderName: 'Sarah Chen',
        timestamp: 'Sep 28, 2026 10:30',
        content: 'I noticed an attempted charge of $9,600 from Global Digital Mart N.V. on our corporate card. We never authorized this transaction. Please cancel and lock card.'
      },
      {
        id: 'msg_12',
        sender: 'ai_assistant',
        senderName: 'FinOps AI Copilot',
        timestamp: 'Sep 28, 2026 10:31',
        content: 'AI Risk Engine blocked this transaction automatically prior to clearing (Risk Score: 92/100). No funds left your account. The virtual card ending in 4920 has been temporarily locked to prevent re-attempts.'
      }
    ]
  },
  {
    id: 'tkt_203',
    ticketNumber: 'TKT-8843',
    subject: 'Request to increase daily ACH withdrawal limit to $250,000',
    category: 'General Query',
    priority: 'medium',
    status: 'waiting_customer',
    createdAt: '2026-09-25 14:10',
    lastUpdated: '2026-09-26 16:00',
    assignedTo: 'Elena Rostova (Manager)',
    aiSuggestedResolution: 'Client account is in good standing for 18 months with 0 overdrafts. Annual revenue > $2M. Meets pre-qualification criteria for Tier 3 ACH underwriting.',
    messages: [
      {
        id: 'msg_21',
        sender: 'user',
        senderName: 'Sarah Chen',
        timestamp: 'Sep 25, 2026 14:10',
        content: 'We are scaling up vendor operations next month and require our daily ACH limit to be raised from $100k to $250k.'
      },
      {
        id: 'msg_22',
        sender: 'agent',
        senderName: 'Elena Rostova (Manager)',
        timestamp: 'Sep 26, 2026 16:00',
        content: 'Sarah, we have reviewed your company liquidity profile and are happy to approve this. Please upload the Q3 board resolution in your Profile > Documents tab to finalize.'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    title: 'Wire Hold Alert',
    message: 'Wire transfer TX-2026-9810 ($18,500.00) is awaiting compliance verification.',
    type: 'warning',
    timestamp: '10 min ago',
    read: false,
    actionUrl: '/support'
  },
  {
    id: 'notif_02',
    title: 'Settlement Credited',
    message: 'Stripe Merchant Payout for $34,500.00 settled successfully into Operating Checking.',
    type: 'success',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: '/transactions'
  },
  {
    id: 'notif_03',
    title: 'Security Alert Blocked',
    message: 'An unauthorized charge of $9,600.00 was blocked by AI Fraud Shield.',
    type: 'error',
    timestamp: '1 day ago',
    read: true,
    actionUrl: '/manager/transactions'
  },
  {
    id: 'notif_04',
    title: 'Monthly Statement Ready',
    message: 'September 2026 consolidated treasury statement is ready for download.',
    type: 'info',
    timestamp: '2 days ago',
    read: true,
    actionUrl: '/manager/reports'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_01',
    action: 'FLAG_TRANSACTION_REVIEW',
    actor: 'System AI Engine',
    actorRole: 'analyst',
    targetId: 'TX-2026-9810',
    targetType: 'transaction',
    timestamp: '2026-09-29 19:10:45 UTC',
    details: 'Flagged wire transfer $18,500 due to beneficiary velocity discrepancy.'
  },
  {
    id: 'log_02',
    action: 'AUTOMATED_CARD_BLOCK',
    actor: 'FinOps AI Fraud Defense',
    actorRole: 'analyst',
    targetId: 'TX-2026-9805',
    targetType: 'transaction',
    timestamp: '2026-09-27 09:00:15 UTC',
    details: 'Declined card attempt $9,600. High-risk offshore merchant code.'
  },
  {
    id: 'log_03',
    action: 'LIMIT_INCREASE_REVIEW',
    actor: 'Elena Rostova',
    actorRole: 'manager',
    targetId: 'usr_cust_01',
    targetType: 'user',
    timestamp: '2026-09-26 15:58:12 UTC',
    details: 'Requested corporate verification documents for ACH limit increase.'
  },
  {
    id: 'log_04',
    action: 'DISPUTE_PROVISIONAL_CREDIT',
    actor: 'Marcus Vance',
    actorRole: 'analyst',
    targetId: 'TX-2026-9800',
    targetType: 'transaction',
    timestamp: '2026-09-23 15:10:00 UTC',
    details: 'Approved duplicate charge refund of $320.00 to card balance.'
  }
];

export const INITIAL_REPORTS: ReportSummary[] = [
  {
    id: 'rep_01',
    title: 'Q3 Treasury & Cash Flow Reconciliation',
    period: 'Jul 1, 2026 – Sep 30, 2026',
    type: 'reconciliation',
    generatedDate: '2026-10-01 02:00',
    fileSize: '4.8 MB PDF',
    status: 'ready',
    summaryStats: {
      totalVolume: 1845200.00,
      transactionCount: 342,
      reconciledRate: 99.4,
      discrepancyCount: 2
    }
  },
  {
    id: 'rep_02',
    title: 'AML & Fraud Risk Mitigation Ledger',
    period: 'Sep 1, 2026 – Sep 30, 2026',
    type: 'compliance',
    generatedDate: '2026-09-30 23:30',
    fileSize: '2.1 MB PDF',
    status: 'ready',
    summaryStats: {
      totalVolume: 492000.00,
      transactionCount: 118,
      reconciledRate: 100.0,
      discrepancyCount: 0
    }
  },
  {
    id: 'rep_03',
    title: 'Operations SLA & Ticket Velocity Report',
    period: 'Sep 1, 2026 – Sep 30, 2026',
    type: 'executive',
    generatedDate: '2026-09-30 21:00',
    fileSize: '1.4 MB PDF',
    status: 'ready',
    summaryStats: {
      totalVolume: 0,
      transactionCount: 48,
      reconciledRate: 98.2,
      discrepancyCount: 1
    }
  },
  {
    id: 'rep_04',
    title: 'Daily Interbank Settlement Audit',
    period: 'Sep 30, 2026',
    type: 'liquidity',
    generatedDate: '2026-10-01 00:05',
    fileSize: '890 KB CSV',
    status: 'ready',
    summaryStats: {
      totalVolume: 84210.50,
      transactionCount: 24,
      reconciledRate: 100.0,
      discrepancyCount: 0
    }
  }
];

export const MONTHLY_CASH_FLOW = [
  { month: 'Apr', income: 72000, expenses: 45000, netFlow: 27000 },
  { month: 'May', income: 84000, expenses: 51000, netFlow: 33000 },
  { month: 'Jun', income: 91000, expenses: 62000, netFlow: 29000 },
  { month: 'Jul', income: 105000, expenses: 68000, netFlow: 37000 },
  { month: 'Aug', income: 118000, expenses: 74000, netFlow: 44000 },
  { month: 'Sep', income: 126000, expenses: 69500, netFlow: 56500 }
];

export const CATEGORY_SPENDING = [
  { name: 'Software & Cloud', value: 24800, percentage: 35, color: '#2563EB' },
  { name: 'Office & Facilities', value: 16800, percentage: 24, color: '#3B82F6' },
  { name: 'Operations & Payroll', value: 14200, percentage: 20, color: '#60A5FA' },
  { name: 'Travel & Dining', value: 7800, percentage: 11, color: '#93C5FD' },
  { name: 'Client Retainers', value: 6900, percentage: 10, color: '#BFDBFE' }
];

export const DAILY_TRANSACTION_TRENDS = [
  { date: '09/24', volume: 24950, count: 18 },
  { date: '09/25', volume: 18750, count: 14 },
  { date: '09/26', volume: 14200, count: 11 },
  { date: '09/27', volume: 59600, count: 22 },
  { date: '09/28', volume: 18720, count: 16 },
  { date: '09/29', volume: 48900, count: 26 },
  { date: '09/30', volume: 38780, count: 20 }
];

export const MANAGER_METRICS = {
  totalProcessedVolume: '$1,845,200.00',
  volumeGrowth: '+18.4% vs last mo',
  activeCustomers: '1,420',
  settlementSuccessRate: '99.82%',
  pendingReviewCount: 3,
  flaggedRiskCount: 2,
  averageResolutionTimeHours: '1.4 hrs',
  disputeRate: '0.12%'
};
