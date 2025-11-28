'use client'

import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Shield, TrendingUp, Calendar, Clock, Activity } from 'lucide-react';
import LoadingSpinner from '../layout/LoadingSpinner';
import { useApi } from '../../../hooks/useApi';
import { useAuth } from '../../../hooks/useAuth';
import { authApi } from '../../../lib/util';

const SuperAdminDashboard = () => {
  const { admin, token, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { executeAsync } = useApi();

  useEffect(() => {
    if (!authLoading && admin && token && admin.role === 'super_admin') {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [authLoading, admin, token]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsResponse, adminsResponse] = await Promise.all([
        executeAsync(() => authApi.getAdminStats(token)),
        executeAsync(() => authApi.getAllAdmins(token))
      ]);
      setStats(statsResponse.data);
      setAdmins(adminsResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const getStatusStats = () => {
    if (!stats?.statusStats) return {};
    return stats.statusStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});
  };

  const getRoleStats = () => {
    if (!stats?.roleStats) return {};
    return stats.roleStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});
  };

  if (authLoading || isLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (!admin || admin.role !== 'super_admin') {
    return <div className="text-center text-red-600">Not authorized to access this dashboard.</div>;
  }

  const statusStats = getStatusStats();
  const roleStats = getRoleStats();

  const totalRegularAdmins = (stats?.totalAdmins || 0) - (roleStats.super_admin || 0);
  const previousTotal = (totalRegularAdmins - stats?.recentAdmins) || 1;
  const growth = ((stats?.recentAdmins || 0) / previousTotal * 100).toFixed(1);

  const statsCards = [
    {
      title: 'Approved Admins',
      value: statusStats.approved || 0,
      icon: UserCheck,
      color: 'from-[#12895E] to-[#37ffb7]',
      iconBg: 'bg-[#12895E]'
    },
    {
      title: 'Total Admins',
      value: totalRegularAdmins,
      icon: Users,
      color: 'from-[#685EFC] to-[#9b93fc]',
      iconBg: 'bg-[#685EFC]',
      change: `+${growth}%`
    },
    {
      title: 'Pending Approval',
      value: statusStats.pending || 0,
      icon: Clock,
      color: 'from-[#A49595] to-[#c9bfbf]',
      iconBg: 'bg-[#A49595]'
    },
    {
      title: 'Super Admins',
      value: roleStats.super_admin || 0,
      icon: Shield,
      color: 'from-[#16252D] to-[#2d4450]',
      iconBg: 'bg-[#16252D]'
    }
  ];

  const recentActivity = admins
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4)
    .map((admin) => ({
      action: 'New admin registered',
      user: admin.name || admin.username || 'Anonymous',
      time: timeAgo(admin.createdAt),
      type: 'registration'
    }));

  const getActivityIcon = (type) => {
    switch (type) {
      case 'registration': return <UserCheck className="w-4 h-4 text-[#685EFC]" />;
      case 'approval': return <UserCheck className="w-4 h-4 text-[#12895E]" />;
      case 'suspension': return <UserX className="w-4 h-4 text-red-500" />;
      case 'update': return <TrendingUp className="w-4 h-4 text-[#A49595]" />;
      default: return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c1eddd]/20 via-white to-[#685EFC]/5 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#685EFC] via-[#685EFC] to-[#16252D] p-8 md:p-10 rounded-3xl shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#37ffb7] rounded-full filter blur-3xl opacity-20 -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#12895E] rounded-full filter blur-3xl opacity-20 -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">Welcome back, Super Admin! 👋</h1>
            <p className="text-[#c1eddd] text-lg">Here's what's happening in your admin panel today.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <div 
              key={index} 
              className="group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl" 
                   style={{ background: `linear-gradient(135deg, ${stat.iconBg} 0%, transparent 100%)` }}></div>
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.iconBg} p-3 rounded-xl shadow-md`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {stat.change && (
                  <div className="flex items-center space-x-1 bg-[#c1eddd] px-3 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3 text-[#12895E]" />
                    <span className="text-sm font-semibold text-[#12895E]">{stat.change}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-[#16252D]">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-[#685EFC] to-[#9b93fc] p-2 rounded-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#16252D]">Recent Activity</h3>
              </div>
              <Calendar className="w-5 h-5 text-[#A49595]" />
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-4 p-4 hover:bg-gradient-to-r hover:from-[#c1eddd]/30 hover:to-transparent rounded-xl transition-all duration-200 border border-transparent hover:border-[#c1eddd]"
                >
                  <div className="flex-shrink-0 bg-[#c1eddd]/50 p-2 rounded-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#16252D] truncate">{activity.action}</p>
                    <p className="text-sm text-[#A49595] truncate">{activity.user}</p>
                  </div>
                  <div className="text-xs font-medium text-[#A49595] whitespace-nowrap">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-[#12895E] to-[#37ffb7] p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#16252D]">Quick Actions</h3>
            </div>
            <div className="space-y-4">
              <button className="w-full group text-left p-5 border-2 border-gray-100 rounded-xl hover:border-[#685EFC] hover:bg-gradient-to-r hover:from-[#685EFC]/5 hover:to-transparent transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="bg-[#12895E] p-3 rounded-lg group-hover:scale-110 transition-transform">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#16252D] mb-1">Manage All Admins</p>
                    <p className="text-sm text-[#A49595]">
                      View and manage {totalRegularAdmins} total admins
                    </p>
                  </div>
                </div>
              </button>
              
              <button className="w-full group text-left p-5 border-2 border-gray-100 rounded-xl hover:border-[#685EFC] hover:bg-gradient-to-r hover:from-[#685EFC]/5 hover:to-transparent transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="bg-[#685EFC] p-3 rounded-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#16252D] mb-1">View Admin Stats</p>
                    <p className="text-sm text-[#A49595]">Detailed analytics and reports</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Admin Status Overview */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-[#16252D] to-[#2d4450] p-2 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#16252D]">Admin Status Overview</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-gradient-to-br from-[#12895E]/10 to-[#37ffb7]/10 rounded-2xl border border-[#12895E]/20 hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-[#12895E] mb-2">{statusStats.approved || 0}</div>
              <div className="text-sm font-semibold text-[#12895E]">Approved</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-[#A49595]/10 to-[#c9bfbf]/10 rounded-2xl border border-[#A49595]/20 hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-[#A49595] mb-2">{statusStats.pending || 0}</div>
              <div className="text-sm font-semibold text-[#A49595]">Pending</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border border-red-200 hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-red-600 mb-2">{statusStats.rejected || 0}</div>
              <div className="text-sm font-semibold text-red-700">Rejected</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-[#16252D]/10 to-[#2d4450]/10 rounded-2xl border border-[#16252D]/20 hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-[#16252D] mb-2">{statusStats.suspended || 0}</div>
              <div className="text-sm font-semibold text-[#16252D]">Suspended</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;