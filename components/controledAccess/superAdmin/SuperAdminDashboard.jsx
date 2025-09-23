'use client'

import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Shield, TrendingUp, Calendar, Clock } from 'lucide-react';
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
      title: 'Total Admins',
      value: totalRegularAdmins,
      icon: Users,
      color: 'bg-blue-500',
      change: `+${growth}%`
    },
    {
      title: 'Approved Admins',
      value: statusStats.approved || 0,
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      title: 'Pending Approval',
      value: statusStats.pending || 0,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Super Admins',
      value: roleStats.super_admin || 0,
      icon: Shield,
      color: 'bg-purple-500'
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
      case 'registration': return <UserCheck className="w-4 h-4 text-blue-500" />;
      case 'approval': return <UserCheck className="w-4 h-4 text-green-500" />;
      case 'suspension': return <UserX className="w-4 h-4 text-red-500" />;
      case 'update': return <TrendingUp className="w-4 h-4 text-yellow-500" />;
      default: return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#685EFC] to-[#16252D] p-6 rounded-lg text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Super Admin!</h1>
        <p className="text-gray-200">Here's what's happening in your admin panel today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.change && <p className="text-sm text-green-600 mt-1">{stat.change}</p>}
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Calendar className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.user}</p>
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <UserCheck className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Manage All Admins</p>
                  <p className="text-sm text-gray-500">
                    View and manage {totalRegularAdmins} total admins
                  </p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-medium text-gray-900">View Admin Stats</p>
                  <p className="text-sm text-gray-500">Detailed analytics and reports</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Status Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{statusStats.approved || 0}</div>
            <div className="text-sm text-green-700">Approved</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{statusStats.pending || 0}</div>
            <div className="text-sm text-yellow-700">Pending</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{statusStats.rejected || 0}</div>
            <div className="text-sm text-red-700">Rejected</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{statusStats.suspended || 0}</div>
            <div className="text-sm text-gray-700">Suspended</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;