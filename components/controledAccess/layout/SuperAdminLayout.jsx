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
import VettedTalentsView from '../VettedTalents';
import AccountingDashboard from '../Accounting';
import AssessmentSettingsView from '../VettingAssessment';

import { useApi } from '../../../hooks/useApi';
import { authApi, submissionsApi, talentApi, bootcampApi } from '../../../lib/util';


const SuperAdminLayout = ({ admin, token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const { loading, error, executeAsync } = useApi();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, submissionsResponse, talentStatsResponse, bootcampStatsResponse] = await Promise.all([
        executeAsync(() => authApi.getAdminStats(token)),
        executeAsync(() => submissionsApi.getAllSubmissions(token)),
        executeAsync(() => talentApi.getTalentStats(token)).catch(() => ({ data: null })),
        executeAsync(() => bootcampApi.getBootcampStats(token)).catch(() => ({ data: null }))
      ]);

      setDashboardData({
        adminStats: statsResponse.data,
        submissionStats: {
          total: submissionsResponse.data?.length || 0,
          startups: submissionsResponse.data?.filter(s => s.type === 'startup').length || 0,
          talent: submissionsResponse.data?.filter(s => s.type === 'talent').length || 0,
          recentSubmissions: submissionsResponse.data?.slice(0, 5) || []
        },
        talentStats: talentStatsResponse?.data || null,
        bootcampStats: bootcampStatsResponse?.data || null
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
      case 'vetted-talents':
        return <VettedTalentsView admin={admin} token={token} />;
      case 'assessment-settings':
                return <AssessmentSettingsView admin={admin} token={token} />;
      case 'account':
        return <AccountingDashboard admin={admin} token={token} />;
      default:
        return <SuperAdminDashboard data={dashboardData} loading={loading} />;
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false); // Close mobile sidebar when tab is selected
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      
      <SuperAdminSidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        admin={admin}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader 
          admin={admin} 
          onLogout={onLogout}
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
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