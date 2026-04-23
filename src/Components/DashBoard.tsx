import { useEffect, useState } from 'react';
import {
  Calendar,
  Crown,
  DollarSign,
  Loader2,
  Store,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { type AdminStats, fetchStats } from '../Apis/Admin-Api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AdminStats | null>(null);

  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await fetchStats();
        if (response.success) {
          setData(response.stats);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    getStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  const statsCards = [
    { 
      label: 'Total Users', 
      value: data?.usersCount.toLocaleString() || '0', 
      icon: Users, 
      color: 'from-blue-500 to-blue-600', 
      change: 'Lifetime' 
    },
    { 
      label: 'Total Shops', 
      value: data?.shopsCount.toLocaleString() || '0', 
      icon: Store, 
      color: 'from-purple-500 to-purple-600', 
      change: 'Global' 
    },
    { 
      label: 'Shop Owners', 
      value: data?.shopOwnersCount.toLocaleString() || '0', 
      icon: Crown, 
      color: 'from-pink-500 to-pink-600', 
      change: 'Verified' 
    },
    { 
      label: "Today's Bookings", 
      value: data?.todayBookingsCount.toLocaleString() || '0', 
      icon: Calendar, 
      color: 'from-green-500 to-green-600', 
      change: 'Active' 
    },
  ];

  const financialData = [
    { name: 'Total Sales', value: data?.todaysTotalSalesValue || 0, color: '#3b82f6' },
    { name: 'Transactions', value: data?.todaysTransactionAmount || 0, color: '#a855f7' },
    { name: 'Platform Fees', value: data?.todaysPlatformFees || 0, color: '#22c55e' },
  ];

  return (
    <div className="p-5 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Dashboard Overview
            </h2>
            <p className="mt-1 text-gray-600">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div className="hidden sm:block">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
              <TrendingUp size={16} className="mr-2" />
              Live Updates
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 mb-8">
          {statsCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg transition-transform group-hover:scale-110`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-100">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</h3>
                <p className="mt-1 text-3xl font-extrabold text-gray-900">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Financial Overview Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Today's Financial Overview
                </h3>
                <p className="text-sm text-gray-500">Comparing revenue, transactions, and fees</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign size={20} className="text-green-600" />
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 13 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      padding: '12px'
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[8, 8, 0, 0]} 
                    barSize={60}
                  >
                    {financialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Insights Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Performance Summary</h3>
              <p className="text-indigo-100 text-sm mb-8">Quick breakdown of today's key performance indicators.</p>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <TrendingUp size={18} />
                    </div>
                    <span>Total Sales</span>
                  </div>
                  <span className="font-bold text-lg">₹{data?.todaysTotalSalesValue.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <DollarSign size={18} />
                    </div>
                    <span>Net Profit</span>
                  </div>
                  <span className="font-bold text-lg">₹{(data?.todaysPlatformFees || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-indigo-100">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Live Data Monitoring Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;