'use client'

import React from 'react';
import { FileText, Users, Download, Eye, Clock } from 'lucide-react';
import LoadingSpinner from '../layout/LoadingSpinner';
import { formatDate } from '../../../lib/util';

const AdminDashboard = ({ data, loading, admin }) => {
  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const statsCards = [
    {
      title: 'Total Submissions',
      value: data?.totalSubmissions || 0,
      icon: FileText,
      color: 'bg-blue-500',
      description: 'All form submissions'
    },
    {
      title: 'Startup Applications',
      value: data?.startupSubmissions || 0,
      icon: Users,
      color: 'bg-green-500',
      description: 'Companies looking for talent'
    },
    {
      title: 'Talent Applications',
      value: data?.talentSubmissions || 0,
      icon: Users,
      color: 'bg-purple-500',
      description: 'Job seekers'
    }
  ];

  if (admin?.permissions?.downloadFiles) {
    statsCards.push({
      title: 'Available Downloads',
      value: data?.talentSubmissions || 0,
      icon: Download,
      color: 'bg-orange-500',
      description: 'Files ready for download'
    });
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#12895E] to-[#16252D] p-6 rounded-lg text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {admin?.firstName} {admin?.lastName}!
        </h1>
        <p className="text-gray-200">Here's your admin dashboard overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
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
        {/* Recent Submissions */}
        {(admin?.permissions?.viewSubmissions || admin?.role === 'super_admin') && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Submissions</h3>
              <Eye className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {data?.recentSubmissions?.length > 0 ? (
                data.recentSubmissions.map((submission, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${
                        submission.type === 'startup' ? 'bg-green-500' : 'bg-purple-500'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{submission.fullName}</p>
                      <p className="text-sm text-gray-500 capitalize">{submission.type} Application</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(submission.createdAt)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No recent submissions</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Your Permissions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Permissions</h3>
          <div className="space-y-3">
            <div className={`flex items-center space-x-3 p-3 rounded-lg ${
              admin?.permissions?.viewSubmissions || admin?.role === 'super_admin' 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                admin?.permissions?.viewSubmissions || admin?.role === 'super_admin' 
                  ? 'bg-green-500' 
                  : 'bg-red-500'
              }`}></div>
              <span>View Submissions</span>
            </div>
            
            <div className={`flex items-center space-x-3 p-3 rounded-lg ${
              admin?.permissions?.deleteSubmissions || admin?.role === 'super_admin' 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                admin?.permissions?.deleteSubmissions || admin?.role === 'super_admin' 
                  ? 'bg-green-500' 
                  : 'bg-red-500'
              }`}></div>
              <span>Delete Submissions</span>
            </div>
            
            <div className={`flex items-center space-x-3 p-3 rounded-lg ${
              admin?.permissions?.downloadFiles || admin?.role === 'super_admin' 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                admin?.permissions?.downloadFiles || admin?.role === 'super_admin' 
                  ? 'bg-green-500' 
                  : 'bg-red-500'
              }`}></div>
              <span>Download Files</span>
            </div>
            
            <div className={`flex items-center space-x-3 p-3 rounded-lg ${
              admin?.permissions?.manageAdmins || admin?.role === 'super_admin' 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                admin?.permissions?.manageAdmins || admin?.role === 'super_admin' 
                  ? 'bg-green-500' 
                  : 'bg-red-500'
              }`}></div>
              <span>Manage Admins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(admin?.permissions?.viewSubmissions || admin?.role === 'super_admin') && (
            <button className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FileText className="w-8 h-8 text-blue-500 mb-2" />
              <h4 className="font-medium text-gray-900">View All Submissions</h4>
              <p className="text-sm text-gray-500">Browse and manage submissions</p>
            </button>
          )}
          
          {(admin?.permissions?.downloadFiles || admin?.role === 'super_admin') && (
            <button className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-8 h-8 text-green-500 mb-2" />
              <h4 className="font-medium text-gray-900">Download Files</h4>
              <p className="text-sm text-gray-500">Access uploaded documents</p>
            </button>
          )}
          
          <button className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Clock className="w-8 h-8 text-purple-500 mb-2" />
            <h4 className="font-medium text-gray-900">Account Settings</h4>
            <p className="text-sm text-gray-500">Update your profile</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;