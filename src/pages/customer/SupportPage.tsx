import React, { useState } from 'react';
import {
  LifeBuoy,
  Plus,
  Send,
  Sparkles,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Bot,
  User,
  MessageSquare
} from 'lucide-react';
import { useFinanceData } from '../../context/FinanceDataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { SupportTicket } from '../../types';

export const SupportPage: React.FC = () => {
  const { supportTickets, addSupportTicket, replyToTicket } = useFinanceData();
  const { currentUser } = useAuth();

  const [selectedTicketId, setSelectedTicketId] = useState<string>(supportTickets[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);

  // New ticket form
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<any>('Transaction Dispute');
  const [newPriority, setNewPriority] = useState<any>('high');
  const [newMessage, setNewMessage] = useState('');

  const activeTicket = supportTickets.find(t => t.id === selectedTicketId) || supportTickets[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;
    replyToTicket(activeTicket.id, replyText);
    setReplyText('');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newMessage) return;
    const created = addSupportTicket({
      subject: newSubject,
      category: newCategory,
      priority: newPriority,
      initialMessage: newMessage
    });
    setSelectedTicketId(created.id);
    setNewTicketModalOpen(false);
    setNewSubject('');
    setNewMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              AI Support Desk & Dispute Center
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              AI Copilot Triaged
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Resolve billing inquiries, contest unfamiliar charges, and collaborate directly with operations analysts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setNewTicketModalOpen(true)}
          >
            Create New Inquiry
          </Button>
        </div>
      </div>

      {/* Main Support Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Ticket List */}
        <div className="lg:col-span-5 space-y-3">
          <Card title="Active Inquiries & Disputes" subtitle={`${supportTickets.length} cases in system`} noPadding>
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {supportTickets.map(tkt => {
                const isSelected = tkt.id === activeTicket?.id;
                return (
                  <div
                    key={tkt.id}
                    onClick={() => setSelectedTicketId(tkt.id)}
                    className={`p-4 transition-colors cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-blue-50/70 border-l-4 border-l-blue-600'
                        : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-[11px] font-semibold text-slate-500">
                        {tkt.ticketNumber}
                      </span>
                      <StatusBadge status={tkt.status} size="sm" />
                    </div>

                    <h3 className="font-semibold text-slate-900 truncate mb-1">
                      {tkt.subject}
                    </h3>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{tkt.category}</span>
                      <span>Updated {tkt.lastUpdated}</span>
                    </div>

                    {tkt.priority === 'urgent' || tkt.priority === 'high' ? (
                      <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>High Priority Escalation</span>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right column: Active Ticket Conversation */}
        <div className="lg:col-span-7">
          {activeTicket ? (
            <Card
              title={activeTicket.subject}
              subtitle={`Case ${activeTicket.ticketNumber} · Created ${activeTicket.createdAt} · Assigned to ${activeTicket.assignedTo || 'Unassigned'}`}
              noPadding
              className="flex flex-col h-full min-h-[550px]"
            >
              {/* AI Diagnostic Resolution Banner */}
              {activeTicket.aiSuggestedResolution && (
                <div className="p-3.5 bg-blue-50/70 border-b border-blue-100 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-blue-950 block mb-0.5">
                      AI Triage & Anomaly Diagnostic
                    </span>
                    <p className="text-blue-900/80 leading-relaxed text-[11px]">
                      {activeTicket.aiSuggestedResolution}
                    </p>
                  </div>
                </div>
              )}

              {/* Messages scroll area */}
              <div className="p-4 flex-1 overflow-y-auto space-y-4 max-h-[380px] bg-slate-50/40">
                {activeTicket.messages.map(msg => {
                  const isUser = msg.sender === 'user';
                  const isAi = msg.sender === 'ai_assistant';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isUser ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-500">
                        {isAi ? (
                          <Bot className="w-3.5 h-3.5 text-blue-600" />
                        ) : isUser ? (
                          <User className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        <span className="font-semibold text-slate-700">
                          {msg.senderName}
                        </span>
                        <span>·</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-md rounded-xl p-3 text-xs leading-relaxed shadow-2xs ${
                          isUser
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : isAi
                            ? 'bg-white border border-blue-200 text-slate-800 rounded-tl-none'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <form
                onSubmit={handleSendReply}
                className="p-3 border-t border-slate-200 bg-white flex items-center gap-2 mt-auto"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your response to the operations analyst..."
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 focus:bg-white"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon={Send}
                  disabled={!replyText.trim()}
                >
                  Send
                </Button>
              </form>
            </Card>
          ) : (
            <Card className="text-center py-12">
              <p className="text-xs text-slate-500">Select a ticket from the list</p>
            </Card>
          )}
        </div>
      </div>

      {/* Create New Ticket Modal */}
      {newTicketModalOpen && (
        <Modal
          isOpen={newTicketModalOpen}
          onClose={() => setNewTicketModalOpen(false)}
          title="Open Support Inquiry or Dispute"
          subtitle="Submit directly to our AI triaged queue"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setNewTicketModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateTicket}>
                Submit Inquiry
              </Button>
            </>
          }
        >
          <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                value={newSubject}
                onChange={e => setNewSubject(e.target.value)}
                placeholder="e.g. Wire TX-9810 routing inquiry"
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Transaction Dispute">Transaction Dispute</option>
                  <option value="Payment Failure">Payment Failure</option>
                  <option value="Account Security">Account Security</option>
                  <option value="Fee Inquiry">Fee Inquiry</option>
                  <option value="General Query">General Query</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Priority
                </label>
                <select
                  value={newPriority}
                  onChange={e => setNewPriority(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent Escalation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Detailed Message
              </label>
              <textarea
                rows={4}
                required
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Provide transaction references, error codes, or context..."
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
