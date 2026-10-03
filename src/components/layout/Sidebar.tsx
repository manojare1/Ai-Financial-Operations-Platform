import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Send,
  PieChart,
  UserCheck,
  LifeBuoy,
  ShieldAlert,
  FileText,
  Sliders,
  Sparkles,
  Building2,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, switchRole, currentUser } = useAuth();
  const location = useLocation();

  const customerNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
    { name: 'Payments', path: '/payments', icon: Send },
    { name: 'Analytics', path: '/analytics', icon: PieChart },
    { name: 'Profile', path: '/profile', icon: UserCheck },
    { name: 'Support & Disputes', path: '/support', icon: LifeBuoy }
  ];

  const managerNav = [
    { name: 'Manager Overview', path: '/manager', icon: Sliders },
    { name: 'Transaction Ops', path: '/manager/transactions', icon: ShieldAlert },
    { name: 'Financial Reports', path: '/manager/reports', icon: FileText }
  ];

  const handleRoleChange = (newRole: UserRole) => {
    switchRole(newRole);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
                FinOps AI
              </span>
              <span className="text-[10px] font-medium text-blue-600 block uppercase tracking-wider">
                Enterprise Banking
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg lg:hidden"
            aria-label="Close sidebar"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Quick Switcher Banner */}
        <div className="p-3 mx-3 my-2.5 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="font-semibold text-slate-600 uppercase tracking-wider">
              Active Persona
            </span>
            <span className="font-mono text-blue-600 text-[10px] bg-blue-50 px-1.5 py-0.2 rounded font-medium">
              Demo Switch
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <button
              onClick={() => handleRoleChange('customer')}
              className={`px-2 py-1 rounded-md text-left font-medium transition-colors text-xs cursor-pointer ${
                role === 'customer'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => handleRoleChange('manager')}
              className={`px-2 py-1 rounded-md text-left font-medium transition-colors text-xs cursor-pointer ${
                role === 'manager'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Manager
            </button>
          </div>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {/* Customer Section */}
          <div>
            <div className="px-3 mb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Customer Portal
            </div>
            <nav className="space-y-0.5">
              {customerNav.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-blue-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Operations & Management Section */}
          <div>
            <div className="px-3 mb-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>Operations & Risk</span>
              <span className="text-[10px] text-blue-600 font-normal">Internal</span>
            </div>
            <nav className="space-y-0.5">
              {managerNav.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-blue-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* AI Platform Assistant Info Box */}
          <div className="p-3 bg-gradient-to-b from-blue-50/60 to-slate-50 border border-blue-100 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI Operations Shield</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal mb-2">
              Automated AML rule checking, fraud mitigation and customer dispute copilot active.
            </p>
            <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-time Risk Guard Active</span>
            </div>
          </div>
        </div>

        {/* User profile footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center text-xs shrink-0">
              {currentUser?.name
                ?.split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2) || 'SC'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-900 truncate">
                {currentUser?.name || 'Sarah Chen'}
              </div>
              <div className="text-[11px] text-slate-500 truncate capitalize">
                {currentUser?.role === 'customer'
                  ? 'Corporate Platinum'
                  : currentUser?.role === 'manager'
                  ? 'Treasury Manager'
                  : 'Operations Analyst'}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
