'use client'

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../layout/AdminSidebar';
import DashboardHeader from '../layout/Header';
import AdminDashboard from '../admin/AdminDashboard';
import SubmissionsView from '../SubmissionsView';
import DownloadsView from '../DownloadsView';
// import Settings from './Settings';
import { useApi } from '../../../hooks/useApi';
import { submissionsApi } from '../../../lib/util';

const AdminLayout = ({ admin, token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const { loading, error, executeAsync } = useApi();

  useEffect(() => {
    if (admin?.permissions?.viewSubmissions || admin?.role === 'super_admin') {
      loadDashboardData();
    }
  }, [admin]);

  const loadDashboardData = async () => {
    try {
      const submissions = await executeAsync(() => submissionsApi.getAllSubmissions(token));
      setDashboardData({
        totalSubmissions: submissions.data?.length || 0,
        startupSubmissions: submissions.data?.filter(s => s.type === 'startup').length || 0,
        talentSubmissions: submissions.data?.filter(s => s.type === 'talent').length || 0,
        recentSubmissions: submissions.data?.slice(0, 5) || []
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard data={dashboardData} loading={loading} admin={admin} />;
      case 'submissions':
        return <SubmissionsView admin={admin} token={token} />;
      case 'downloads':
        return <DownloadsView admin={admin} token={token} />;
      case 'settings':
        return <Settings admin={admin} token={token} />;
      default:
        return <AdminDashboard data={dashboardData} loading={loading} admin={admin} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        admin={admin}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader admin={admin} onLogout={onLogout} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;