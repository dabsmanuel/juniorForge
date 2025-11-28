'use client'

import React, { useState, useEffect } from 'react';
import { BarChart3, Users, TrendingUp, Calendar, RefreshCw, Shield, Clock, XCircle, CheckCircle } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { authApi } from '../../lib/util';
import LoadingSpinner from './layout/LoadingSpinner';

// --- Brand Colors ---
const BRAND_PRIMARY = '#685EFC';
const BRAND_SUCCESS = '#12895E';
const BRAND_DARK = '#16252D';
const BRAND_NEUTRAL_SOFT = '#A49595';
const BRAND_BRIGHT_ACCENT = '#37ffb7';
const BRAND_LIGHT_ACCENT = '#c1eddd';

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
  const totalAdmins = stats?.totalAdmins || 0;
  
  // Adjusted colors for status distribution to align with brand
  const chartData = [
    { name: 'Approved', value: statusStats.approved || 0, color: BRAND_SUCCESS }, // Green
    { name: 'Pending', value: statusStats.pending || 0, color: '#F59E0B' }, // Amber/Yellow
    { name: 'Rejected', value: statusStats.rejected || 0, color: '#EF4444' }, // Red
    { name: 'Suspended', value: statusStats.suspended || 0, color: BRAND_NEUTRAL_SOFT } // Soft Grey
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));
  const superAdminPercentage = totalAdmins > 0 ? ((roleStats.super_admin || 0) / totalAdmins) * 100 : 0;

  // --- Utility Card Component for reusability and cleaner rendering ---
  const StatCard = ({ title, value, subText, icon: Icon, iconBg, iconColor, valueColor = BRAND_DARK }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className={`text-3xl font-bold text-[${valueColor}]`}>{value}</p>
          {subText && <p className="text-xs text-gray-500 mt-1">{subText}</p>}
        </div>
        <div className={`p-3 rounded-xl`} style={{ backgroundColor: iconBg }}>
          <Icon className="w-7 h-7" style={{ color: iconColor }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className=" space-y-8 bg-gray-50 min-h-screen">
      
      {/* 1. Header & Action */}
      <div className="flex items-center justify-between border-b pb-4 border-gray-200">
        <div>
          <h1 className={`text-3xl font-extrabold text-[${BRAND_DARK}]`}>
            <BarChart3 className="inline-block w-7 h-7 mr-2 mb-1" style={{ color: BRAND_PRIMARY }} /> Administrative Analytics
          </h1>
          <p className="text-gray-500 mt-1">Real-time data and metrics for admin accounts.</p>
        </div>
        <button
          onClick={loadStats}
          disabled={loading}
          className={`flex items-center space-x-2 px-5 py-2 bg-[${BRAND_PRIMARY}] text-white rounded-xl shadow-md font-medium hover:bg-[#5a4ef0] transition duration-200 disabled:opacity-50`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Updating...' : 'Refresh Data'}</span>
        </button>
      </div>

      {/* 2. Key Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Admins" 
          value={totalAdmins} 
          icon={Users} 
          iconBg={BRAND_LIGHT_ACCENT}
          iconColor={BRAND_PRIMARY}
          valueColor={BRAND_PRIMARY}
        />
        <StatCard 
          title="Active Admins" 
          value={statusStats.approved || 0} 
          icon={CheckCircle} 
          iconBg={'#ccfbf1'} // Light teal
          iconColor={BRAND_SUCCESS}
          valueColor={BRAND_SUCCESS}
        />
        <StatCard 
          title="New Signups" 
          value={stats?.recentAdmins || 0} 
          subText="Last 30 days"
          icon={TrendingUp} 
          iconBg={'#eff6ff'} // Light Blue
          iconColor={BRAND_BRIGHT_ACCENT}
          valueColor={BRAND_BRIGHT_ACCENT}
        />
        <StatCard 
          title="Super Admin Ratio" 
          value={`${superAdminPercentage.toFixed(1)}%`} 
          subText={`(${roleStats.super_admin || 0} accounts)`}
          icon={Shield} 
          iconBg={'#ede9fe'} // Light Purple
          iconColor={'#8b5cf6'} 
        />
      </div>

      {/* 3. Detailed Visualizations (Bar Chart and Role Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Distribution (Bar Chart Visualization) - Takes 2/3 width */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className={`text-xl font-semibold text-[${BRAND_DARK}] mb-6`}>Admin Status Breakdown</h3>
          <p className="text-sm text-gray-500 mb-6">Visual representation of account lifecycle status.</p>
          
          <div className="space-y-6">
            {chartData.map((item, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className={`text-sm font-medium text-[${BRAND_DARK}]`}>{item.name}</span>
                  </div>
                  <span className={`text-sm font-bold text-[${BRAND_DARK}] w-8 text-right`}>{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: maxValue > 0 ? `${(item.value / maxValue) * 100}%` : '0%',
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={`border-t border-[${BRAND_NEUTRAL_SOFT}]/50 mt-6 pt-4`}>
            <div className="flex justify-between items-center">
              <span className={`text-md font-bold text-[${BRAND_DARK}]`}>TOTAL ACCOUNTS</span>
              <span className={`text-xl font-extrabold text-[${BRAND_PRIMARY}]`}>
                {totalAdmins}
              </span>
            </div>
          </div>
        </div>

        {/* Role Distribution (Pie/Donut Chart Visualization) - Takes 1/3 width */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center">
          <h3 className={`text-xl font-semibold text-[${BRAND_DARK}] mb-6 w-full`}>Admin Role Distribution</h3>
          <div className="relative inline-flex items-center justify-center w-40 h-40 mb-6">
            {/* Donut Chart SVG (same functional code, better colors) */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={BRAND_PRIMARY}
                strokeWidth="3"
                strokeDasharray={`${superAdminPercentage}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold text-[${BRAND_PRIMARY}]`}>
                  {Math.round(superAdminPercentage)}%
                </div>
                <div className="text-sm text-gray-500">Super Admins</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 w-full">
            <div className={`flex justify-between items-center p-3 rounded-lg border-l-4 border-[${BRAND_PRIMARY}]`} style={{ backgroundColor: BRAND_LIGHT_ACCENT }}>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" style={{ color: BRAND_PRIMARY }} />
                <span className={`text-sm font-semibold text-[${BRAND_DARK}]`}>Super Admins</span>
              </div>
              <span className={`text-lg font-bold text-[${BRAND_PRIMARY}]`}>{roleStats.super_admin || 0}</span>
            </div>
            
            <div className={`flex justify-between items-center p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400`}>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className={`text-sm font-semibold text-[${BRAND_DARK}]`}>Regular Admins</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{roleStats.admin || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Detailed Status Overview (Grid) */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className={`text-xl font-semibold text-[${BRAND_DARK}] mb-6`}>Status Metrics Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          
          {/* Approved */}
          <div className={`text-center p-5 rounded-xl border-t-4 border-[${BRAND_SUCCESS}]`} style={{ backgroundColor: '#f0fff4' }}>
            <CheckCircle className="w-6 h-6 mx-auto mb-2" style={{ color: BRAND_SUCCESS }} />
            <div className={`text-3xl font-extrabold text-[${BRAND_SUCCESS}] mb-1`}>
              {statusStats.approved || 0}
            </div>
            <div className="text-sm font-semibold text-gray-700">Approved</div>
          </div>

          {/* Pending */}
          <div className={`text-center p-5 rounded-xl border-t-4 border-yellow-400`} style={{ backgroundColor: '#fffdf0' }}>
            <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
            <div className="text-3xl font-extrabold text-yellow-600 mb-1">
              {statusStats.pending || 0}
            </div>
            <div className="text-sm font-semibold text-gray-700">Pending Approval</div>
          </div>

          {/* Rejected */}
          <div className={`text-center p-5 rounded-xl border-t-4 border-red-400`} style={{ backgroundColor: '#fff5f5' }}>
            <XCircle className="w-6 h-6 mx-auto mb-2 text-red-500" />
            <div className="text-3xl font-extrabold text-red-600 mb-1">
              {statusStats.rejected || 0}
            </div>
            <div className="text-sm font-semibold text-gray-700">Rejected</div>
          </div>

          {/* Suspended */}
          <div className={`text-center p-5 rounded-xl border-t-4 border-[${BRAND_NEUTRAL_SOFT}]`} style={{ backgroundColor: '#f9f9fb' }}>
            <Users className="w-6 h-6 mx-auto mb-2" style={{ color: BRAND_NEUTRAL_SOFT }} />
            <div className={`text-3xl font-extrabold text-[${BRAND_NEUTRAL_SOFT}] mb-1`}>
              {statusStats.suspended || 0}
            </div>
            <div className="text-sm font-semibold text-gray-700">Suspended</div>
          </div>
        </div>
      </div>
      
      {/* API Error Notification */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg fixed bottom-4 right-4 shadow-xl z-50">
          <p className="font-medium">API Error</p>
          <p className="text-sm">Could not fetch statistics. Please try refreshing.</p>
        </div>
      )}

    </div>
  );
};

export default AdminStats;