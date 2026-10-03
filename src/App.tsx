import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FinanceDataProvider } from './context/FinanceDataContext';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';

// Customer Pages
import { CustomerDashboardPage } from './pages/customer/CustomerDashboardPage';
import { TransactionsPage } from './pages/customer/TransactionsPage';
import { PaymentsPage } from './pages/customer/PaymentsPage';
import { AnalyticsPage } from './pages/customer/AnalyticsPage';
import { ProfilePage } from './pages/customer/ProfilePage';
import { SupportPage } from './pages/customer/SupportPage';

// Manager Pages
import { ManagerDashboardPage } from './pages/manager/ManagerDashboardPage';
import { TransactionManagementPage } from './pages/manager/TransactionManagementPage';
import { ReportsPage } from './pages/manager/ReportsPage';

export default function App() {
  return (
    <AuthProvider>
      <FinanceDataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Authenticated Dashboard Layout Routes */}
            <Route element={<DashboardLayout />}>
              {/* Customer Routes */}
              <Route path="/" element={<CustomerDashboardPage />} />
              <Route path="/dashboard" element={<CustomerDashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/support" element={<SupportPage />} />

              {/* Manager & Operations Routes */}
              <Route path="/manager" element={<ManagerDashboardPage />} />
              <Route path="/manager/dashboard" element={<ManagerDashboardPage />} />
              <Route path="/manager/transactions" element={<TransactionManagementPage />} />
              <Route path="/manager/reports" element={<ReportsPage />} />
            </Route>

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </FinanceDataProvider>
    </AuthProvider>
  );
}
