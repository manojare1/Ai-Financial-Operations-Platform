import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, ArrowRight, ShieldCheck, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('sarah.chen@acmeventures.io');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<'customer' | 'manager'>('customer');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, role);
      setLoading(false);
      if (role === 'manager') {
        navigate('/manager');
      } else {
        navigate('/dashboard');
      }
    }, 400);
  };

  const handleQuickDemoFill = (targetRole: 'customer' | 'manager') => {
    setRole(targetRole);
    if (targetRole === 'customer') {
      setEmail('sarah.chen@acmeventures.io');
    } else {
      setEmail('e.rostova@finops.internal');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-xs mb-3">
          <Building2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Sign in to FinOps AI
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Intelligent financial operations, payments, and risk management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Quick Demo Credentials Bar */}
        <div className="mb-4 p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Internship V1 Quick Demo Logins
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemoFill('customer')}
              className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                role === 'customer'
                  ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-medium'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="font-semibold text-xs">Customer Persona</div>
              <div className="text-[10px] text-slate-500 truncate">Sarah Chen (Founder)</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('manager')}
              className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                role === 'manager'
                  ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-medium'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="font-semibold text-xs">Manager Persona</div>
              <div className="text-[10px] text-slate-500 truncate">Elena Rostova (Risk)</div>
            </button>
          </div>
        </div>

        <Card noPadding className="border-slate-200 shadow-xs">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <a href="#forgot" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember this terminal</span>
              </label>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>2FA Protected</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={loading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In to Workspace
            </Button>
          </form>

          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an enterprise account?{' '}
            <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
              Sign up for Phase 1 V1
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
