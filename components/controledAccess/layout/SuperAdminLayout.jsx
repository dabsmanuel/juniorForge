'use client'

import React, { useState, useEffect } from 'react';
import SuperAdminSidebar from '../layout/SuperAdminSidebar';
import DashboardHeader from '../layout/Header';
import SuperAdminDashboard from '../superAdmin/SuperAdminDashboard';
import SubmissionsView from '../SubmissionsView';
import DownloadsView from '../DownloadsView';
import PendingAdmins from '../PendingAdmins';
import AllAdmins from '../AllAdmins';
import AdminStats from '../AdminStats';
// import Settings from '../Settings'; 
import { useApi } from '../../../hooks/useApi';
import { authApi, submissionsApi } from '../../../lib/util';

const SuperAdminLayout = ({ admin, token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const { loading, error, executeAsync } = useApi();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, submissionsResponse] = await Promise.all([
        executeAsync(() => authApi.getAdminStats(token)),
        executeAsync(() => submissionsApi.getAllSubmissions(token))
      ]);

      setDashboardData({
        adminStats: statsResponse.data,
        submissionStats: {
          total: submissionsResponse.data?.length || 0,
          startups: submissionsResponse.data?.filter(s => s.type === 'startup').length || 0,
          talent: submissionsResponse.data?.filter(s => s.type === 'talent').length || 0,
          recentSubmissions: submissionsResponse.data?.slice(0, 5) || []
        }
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <SuperAdminDashboard data={dashboardData} loading={loading} />;
      case 'submissions':
        return <SubmissionsView admin={admin} token={token} />;
      case 'downloads':
        return <DownloadsView admin={admin} token={token} />;
      case 'pendingAdmins':
        return <PendingAdmins admin={admin} token={token} onDataChange={loadDashboardData} />;
      case 'allAdmins':
        return <AllAdmins admin={admin} token={token} onDataChange={loadDashboardData} />;
      case 'adminStats':
        return <AdminStats admin={admin} token={token} />;
      // case 'settings':
      //   return <Settings admin={admin} token={token} />;
      default:
        return <SuperAdminDashboard data={dashboardData} loading={loading} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SuperAdminSidebar 
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

export default SuperAdminLayout;