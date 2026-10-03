import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans antialiased">
      {/* Sidebar for navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content wrapper */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar onMenuToggle={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Clean enterprise footer */}
        <footer className="py-4 px-6 border-t border-slate-200 bg-white text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">FinOps AI Platform</span>
            <span>·</span>
            <span>v1.0-RC Enterprise Edition</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>SOC2 Type II Certified</span>
            <span>·</span>
            <span>AI Risk Governance Compliant</span>
            <span>·</span>
            <span>256-bit TLS Encryption</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
