'use client'

import React, { useState, useEffect } from 'react';
import { BarChart3, Users, TrendingUp, Calendar, RefreshCw } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { authApi } from '../../lib/util';
import LoadingSpinner from './layout/LoadingSpinner';

const AdminStats = ({ admin, token }) => {
  const [stats, setStats] = useState(null);
  const { loading, error, executeAsync } = useApi();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await executeAsync(() => authApi.getAdminStats(token));
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
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

  if (loading && !stats) {
    return <LoadingSpinner message="Loading statistics..." />;
  }

  const statusStats = getStatusStats();
  const roleStats = getRoleStats();

  const chartData = [
    { name: 'Approved', value: statusStats.approved || 0, color: '#10B981' },
    { name: 'Pending', value: statusStats.pending || 0, color: '#F59E0B' },
    { name: 'Rejected', value: statusStats.rejected || 0, color: '#EF4444' },
    { name: 'Suspended', value: statusStats.suspended || 0, color: '#6B7280' }
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Statistics</h1>
          <p className="text-gray-600">Detailed analytics and reports</p>
        </div>
        <button
          onClick={loadStats}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-[#685EFC] text-white rounded-lg hover:bg-[#5a4ef0] disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Admins</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalAdmins || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent Signups</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.recentAdmins || 0}</p>
              <p className="text-sm text-gray-500">Last 30 days</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Super Admins</p>
              <p className="text-2xl font-bold text-gray-900">{roleStats.super_admin || 0}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Regular Admins</p>
              <p className="text-2xl font-bold text-gray-900">{roleStats.admin || 0}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Admin Status Distribution</h3>
          <div className="space-y-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: maxValue > 0 ? `${(item.value / maxValue) * 100}%` : '0%',
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-8">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Total */}
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">Total</span>
              <span className="text-lg font-bold text-gray-900">
                {chartData.reduce((sum, item) => sum + item.value, 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Role Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Role Distribution</h3>
          <div className="space-y-6">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                    strokeDasharray={`${((roleStats.super_admin || 0) / (stats?.totalAdmins || 1)) * 100}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {Math.round(((roleStats.super_admin || 0) / (stats?.totalAdmins || 1)) * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">Super Admin</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Super Admins</span>
                </div>
                <span className="text-sm font-bold">{roleStats.super_admin || 0}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Regular Admins</span>
                </div>
                <span className="text-sm font-bold">{roleStats.admin || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {statusStats.approved || 0}
            </div>
            <div className="text-sm font-medium text-green-800">Approved Admins</div>
            <div className="text-xs text-green-600 mt-1">
              Active and functional accounts
            </div>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {statusStats.pending || 0}
            </div>
            <div className="text-sm font-medium text-yellow-800">Pending Approval</div>
            <div className="text-xs text-yellow-600 mt-1">
              Waiting for review
            </div>
          </div>

          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {statusStats.rejected || 0}
            </div>
            <div className="text-sm font-medium text-red-800">Rejected</div>
            <div className="text-xs text-red-600 mt-1">
              Applications declined
            </div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-600 mb-2">
              {statusStats.suspended || 0}
            </div>
            <div className="text-sm font-medium text-gray-800">Suspended</div>
            <div className="text-xs text-gray-600 mt-1">
              Temporarily restricted
            </div>
          </div>
        </div>
      </div>

      {/* Growth Trends */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Growth Overview</h3>
          <Calendar className="w-5 h-5 text-gray-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {stats?.recentAdmins || 0}
            </div>
            <div className="text-sm font-medium text-gray-700">New This Month</div>
            <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {Math.round(((statusStats.approved || 0) / (stats?.totalAdmins || 1)) * 100)}%
            </div>
            <div className="text-sm font-medium text-gray-700">Approval Rate</div>
            <div className="text-xs text-gray-500 mt-1">Overall percentage</div>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {((roleStats.super_admin || 0) / (stats?.totalAdmins || 1) * 100).toFixed(1)}%
            </div>
            <div className="text-sm font-medium text-gray-700">Super Admin Ratio</div>
            <div className="text-xs text-gray-500 mt-1">Of total admins</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;