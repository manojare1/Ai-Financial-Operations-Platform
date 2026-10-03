import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Shield, ChevronDown, Check, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const UserDropdown: React.FC = () => {
  const { currentUser, role, switchRole, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSelect = (newRole: UserRole) => {
    switchRole(newRole);
    setIsOpen(false);
    if (newRole === 'manager') {
      navigate('/manager');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials =
    currentUser?.name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2) || 'SC';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 pl-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-left"
        type="button"
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center text-xs shadow-2xs">
          {initials}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-xs font-semibold text-slate-800 leading-tight">
            {currentUser?.name || 'Sarah Chen'}
          </div>
          <div className="text-[10px] text-slate-500 font-medium capitalize">
            {role === 'customer' ? 'Customer' : 'Manager'}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden py-1">
          {/* User info */}
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <p className="text-xs font-semibold text-slate-900">{currentUser?.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>KYC Verified · 2FA Active</span>
            </div>
          </div>

          {/* Quick Persona Switcher for V1 Demo */}
          <div className="p-2 border-b border-slate-100">
            <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Switch Demo Persona
            </div>
            <button
              onClick={() => handleRoleSelect('customer')}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Customer (Sarah Chen)</span>
              </div>
              {role === 'customer' && <Check className="w-3.5 h-3.5 text-blue-600" />}
            </button>
            <button
              onClick={() => handleRoleSelect('manager')}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-600" />
                <span>Manager (Elena Rostova)</span>
              </div>
              {role === 'manager' && <Check className="w-3.5 h-3.5 text-blue-600" />}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-1">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/profile');
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <UserCircle className="w-4 h-4 text-slate-400" />
              <span>Account Settings & Profile</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/support');
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Shield className="w-4 h-4 text-slate-400" />
              <span>Security & Support Desk</span>
            </button>
          </div>

          {/* Sign out */}
          <div className="p-1 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
