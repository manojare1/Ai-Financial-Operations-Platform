import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { SegmentedFilter } from '../../components/common/Filter';
import { MONTHLY_CASH_FLOW, CATEGORY_SPENDING, DAILY_TRANSACTION_TRENDS } from '../../data/mockData';

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6m');

  const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

  return (
    <div className="space-y-6">
      {/* Page Title & Time Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Treasury & Financial Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cash burn, category breakdown, liquidity velocity, and operating margins
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SegmentedFilter
            options={[
              { label: '30 Days', value: '30d' },
              { label: '6 Months', value: '6m' },
              { label: 'YTD 2026', value: 'ytd' }
            ]}
            selectedValue={timeRange}
            onChange={setTimeRange}
          />
        </div>
      </div>

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Average Monthly Inflow"
          value="$99,330"
          change="+12.4%"
          isPositive={true}
          subtext="Rolling 6-month avg"
          icon={TrendingUp}
        />
        <StatCard
          title="Average Monthly Burn"
          value="$61,580"
          change="-4.2%"
          isPositive={true}
          subtext="Disciplined OpEx"
          icon={TrendingDown}
        />
        <StatCard
          title="Net Cash Flow Velocity"
          value="+$37,750 / mo"
          change="+24.8%"
          isPositive={true}
          subtext="Net positive margin"
          icon={DollarSign}
        />
        <StatCard
          title="Estimated Capital Runway"
          value="18.4 Months"
          change="+2.1 mo"
          isPositive={true}
          subtext="Zero external financing"
          icon={Zap}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Income vs Expenses Bar Chart */}
        <div className="lg:col-span-8">
          <Card
            title="Operating Inflow vs. Operating Expenses"
            subtitle="Monthly breakdown of revenue settlements vs vendor disbursements (USD)"
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_CASH_FLOW} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748B"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={val => `$${val / 1000}k`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2.5 border border-slate-200 rounded-lg shadow-sm text-xs">
                            <p className="font-semibold text-slate-800 mb-1">{label} 2026</p>
                            <p className="text-blue-600 font-medium tabular-nums">
                              Income: ${payload[0]?.value?.toLocaleString()}
                            </p>
                            <p className="text-slate-600 font-medium tabular-nums">
                              Expenses: ${payload[1]?.value?.toLocaleString()}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    iconType="circle"
                  />
                  <Bar dataKey="income" name="Gross Inflow" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Total Outflow" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Expense Category Breakdown Donut */}
        <div className="lg:col-span-4">
          <Card
            title="Expense Allocation"
            subtitle="Distribution across operational categories"
          >
            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_SPENDING}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {CATEGORY_SPENDING.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Spent']}
                    contentStyle={{ fontSize: '11px', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
              {CATEGORY_SPENDING.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="text-slate-700 truncate">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Daily Transaction Volume & Health Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily settlement velocity line chart */}
        <div className="lg:col-span-8">
          <Card
            title="Daily Clearing & Settlement Volume"
            subtitle="7-day rolling clearing aggregate (USD)"
          >
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={DAILY_TRANSACTION_TRENDS} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748B"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={val => `$${val / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Daily Volume']}
                    contentStyle={{ fontSize: '11px', borderRadius: '8px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#2563EB' }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* AI Financial Health Scorecard */}
        <div className="lg:col-span-4">
          <Card
            title="Treasury Compliance Health"
            subtitle="Automated ledger reconciliation audit"
          >
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center justify-between font-semibold text-emerald-900 mb-0.5">
                  <span>General Ledger Alignment</span>
                  <span>100%</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-normal">
                  All clearing entries match external bank statement records with 0 unverified anomalies.
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between font-semibold text-blue-900 mb-0.5">
                  <span>Liquidity Ratio (Quick Ratio)</span>
                  <span>3.4x</span>
                </div>
                <p className="text-[11px] text-blue-700 leading-normal">
                  Exceeds tier-1 enterprise banking threshold of 1.5x minimum cash coverage.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between font-semibold text-slate-800 mb-0.5">
                  <span>Fraud & Chargeback Rate</span>
                  <span>0.04%</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Significantly below Visa/Mastercard 0.9% standard monitoring threshold.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
