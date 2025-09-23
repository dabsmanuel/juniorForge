'use client'

import React from 'react';
import { Users, UserCheck, UserX, Shield, TrendingUp, Calendar, Clock } from 'lucide-react';
import LoadingSpinner from '../layout/LoadingSpinner';

const SuperAdminDashboard = ({ data, loading }) => {
  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const getStatusStats = () => {
    if (!data?.data?.statusStats) return {};
    return data.data.statusStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});
  };

  const getRoleStats = () => {
    if (!data?.data?.roleStats) return {};
    return data.data.roleStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});
  };

  const statusStats = getStatusStats();
  const roleStats = getRoleStats();

  const statsCards = [
    {
      title: 'Total Admins',
      value: data?.data?.totalAdmins || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+2.5%'
    },
    {
      title: 'Approved Admins',
      value: statusStats.approved || 0,
      icon: UserCheck,
      color: 'bg-green-500',
      change: '+5.2%'
    },
    {
      title: 'Pending Approval',
      value: statusStats.pending || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '+12.3%'
    },
    {
      title: 'Super Admins',
      value: roleStats.super_admin || 0,
      icon: Shield,
      color: 'bg-purple-500',
      change: '0%'
    }
  ];

  const recentActivity = [
    { action: 'New admin registered', user: 'John Doe', time: '2 hours ago', type: 'registration' },
    { action: 'Admin approved', user: 'Jane Smith', time: '4 hours ago', type: 'approval' },
    { action: 'Admin suspended', user: 'Mike Johnson', time: '1 day ago', type: 'suspension' },
    { action: 'Permission updated', user: 'Sarah Wilson', time: '2 days ago', type: 'update' }
  ];

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
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
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
                    View and manage {data?.data?.totalAdmins || 0} total admins
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