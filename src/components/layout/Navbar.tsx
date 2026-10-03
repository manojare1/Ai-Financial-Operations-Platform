import React, { useState } from 'react';
import { Menu, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NotificationDropdown } from './NotificationDropdown';
import { UserDropdown } from './UserDropdown';
import { useFinanceData } from '../../context/FinanceDataContext';

interface NavbarProps {
  onMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { transactions } = useFinanceData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Derive breadcrumbs based on pathname
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path.startsWith('/manager/transactions')) {
      return { section: 'Operations', title: 'Transaction Management' };
    }
    if (path.startsWith('/manager/reports')) {
      return { section: 'Operations', title: 'Financial Reports' };
    }
    if (path.startsWith('/manager')) {
      return { section: 'Management', title: 'Manager Dashboard' };
    }
    if (path.startsWith('/transactions')) {
      return { section: 'Banking', title: 'Transactions Ledger' };
    }
    if (path.startsWith('/payments')) {
      return { section: 'Banking', title: 'Payments & Transfers' };
    }
    if (path.startsWith('/analytics')) {
      return { section: 'Treasury', title: 'Financial Analytics' };
    }
    if (path.startsWith('/profile')) {
      return { section: 'Account', title: 'Profile & Settings' };
    }
    if (path.startsWith('/support')) {
      return { section: 'Operations', title: 'AI Customer Support & Disputes' };
    }
    return { section: 'Banking', title: 'Customer Dashboard' };
  };

  const breadcrumbs = getBreadcrumbs();

  // Search filter results
  const searchResults = searchQuery.trim()
    ? transactions
        .filter(
          tx =>
            tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.counterparty.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 4)
    : [];

  return (
    <header className="h-16 px-4 sm:px-6 bg-white border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left zone: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-lg lg:hidden"
          aria-label="Toggle navigation menu"
          type="button"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
          <span className="hidden sm:inline font-medium text-slate-400">
            {breadcrumbs.section}
          </span>
          <span className="hidden sm:inline text-slate-300" aria-hidden="true">/</span>
          <span className="font-semibold text-slate-900 truncate">
            {breadcrumbs.title}
          </span>
        </div>
      </div>

      {/* Middle zone: Search bar with live quick results */}
      <div className="flex-1 max-w-md mx-2 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search payments, reference #, recipients..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-2xs"
          />
        </div>

        {/* Search quick results flyout */}
        {isSearchFocused && searchQuery.trim() && (
          <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 bg-slate-50 border-b border-slate-100 uppercase tracking-wider">
              Matching Records
            </div>
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No matching transactions found
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {searchResults.map(tx => (
                  <div
                    key={tx.id}
                    onMouseDown={() => {
                      navigate('/transactions');
                      setSearchQuery('');
                    }}
                    className="p-2.5 hover:bg-slate-50 flex items-center justify-between gap-3 cursor-pointer text-xs"
                  >
                    <div>
                      <div className="font-medium text-slate-900 truncate max-w-xs">
                        {tx.description}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <span>{tx.referenceNumber}</span>
                        <span>·</span>
                        <span>{tx.counterparty}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-semibold tabular-nums ${
                          tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'
                        }`}
                      >
                        {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-400">{tx.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right zone: Notifications & User profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[11px] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>FIDC Protected Node</span>
        </div>

        <NotificationDropdown />
        <div className="h-5 w-px bg-slate-200" aria-hidden="true" />
        <UserDropdown />
      </div>
    </header>
  );
};
