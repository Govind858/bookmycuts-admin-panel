// Dashboard.tsx
import React from 'react';
import {
  Calendar,
  Crown,
  ShoppingBag,
  Store,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const Dashboard = () => {
  // Sample data
  const stats = [
    { label: 'Total Users', value: '12,543', icon: Users, color: 'from-blue-500 to-blue-600', change: '+12.5%' },
    { label: 'Total Shops', value: '847', icon: Store, color: 'from-purple-500 to-purple-600', change: '+8.2%' },
    { label: 'Total Shop Owners', value: '423', icon: Crown, color: 'from-pink-500 to-pink-600', change: '+5.7%' },
    { label: "Today's Bookings", value: '156', icon: Calendar, color: 'from-green-500 to-green-600', change: '+23.1%' },
  ];

  const growthData = [
    { month: 'Jan', users: 4000, bookings: 2400, shops: 240 },
    { month: 'Feb', users: 5200, bookings: 3200, shops: 280 },
    { month: 'Mar', users: 6800, bookings: 4100, shops: 340 },
    { month: 'Apr', users: 8100, bookings: 5200, shops: 420 },
    { month: 'May', users: 9800, bookings: 6400, shops: 520 },
    { month: 'Jun', users: 11200, bookings: 7800, shops: 680 },
    { month: 'Jul', users: 12543, bookings: 8900, shops: 847 },
  ];

  return (
    <div className="p-5 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Dashboard Overview
          </h2>
          <p className="mt-1 text-gray-600">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
                <p className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">
              Growth Analytics
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Platform growth over the last few months
            </p>
          </div>

          <div className="h-80 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorShops" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#colorUsers)"
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  fill="url(#colorBookings)"
                />
                <Area
                  type="monotone"
                  dataKey="shops"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  fill="url(#colorShops)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-gray-700 font-medium">Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-gray-700 font-medium">Bookings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-700 font-medium">Shops</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;