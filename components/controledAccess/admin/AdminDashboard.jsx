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
      color: 'bg-[#685EFC]',
      description: 'All form submissions'
    },
    {
      title: 'Startup Applications',
      value: data?.startupSubmissions || 0,
      icon: Users,
      color: 'bg-[#12895E]',
      description: 'Companies looking for talent'
    },
    {
      title: 'Talent Applications',
      value: data?.talentSubmissions || 0,
      icon: Users,
      color: 'bg-[#685EFC]',
      description: 'Job seekers'
    }
  ];

  if (admin?.permissions?.downloadFiles) {
    statsCards.push({
      title: 'Available Downloads',
      value: data?.talentSubmissions || 0,
      icon: Download,
      color: 'bg-[#37ffb7]',
      description: 'Files ready for download'
    });
  }

  return (
    <div className="space-y-8 
     min-h-screen">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#12895E] via-[#16252D] to-[#16252D] p-8 rounded-xl text-white shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#37ffb7]/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#685EFC]/10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {admin?.firstName} {admin?.lastName}!
          </h1>
          <p className="text-[#c1eddd] text-lg">Here's your admin dashboard overview.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#685EFC]/20 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-[#A49595] mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-[#16252D] mb-2">{stat.value}</p>
                <p className="text-sm text-[#A49595]">{stat.description}</p>
              </div>
              <div className={`${stat.color} p-4 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        {(admin?.permissions?.viewSubmissions || admin?.role === 'super_admin') && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#16252D]">Recent Submissions</h3>
              <div className="bg-[#685EFC]/10 p-2 rounded-lg">
                <Eye className="w-5 h-5 text-[#685EFC]" />
              </div>
            </div>
            <div className="space-y-3">
              {data?.recentSubmissions?.length > 0 ? (
                data.recentSubmissions.map((submission, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 hover:bg-gradient-to-r hover:from-[#c1eddd]/20 hover:to-transparent rounded-lg transition-all duration-200 border border-transparent hover:border-[#37ffb7]/30">
                    <div className="flex-shrink-0">
                      <div className={`w-4 h-4 rounded-full shadow-sm ${
                        submission.type === 'startup' ? 'bg-[#12895E]' : 'bg-[#685EFC]'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#16252D] truncate">{submission.fullName}</p>
                      <p className="text-sm text-[#A49595] capitalize">{submission.type} Application</p>
                    </div>
                    <div className="text-xs font-medium text-[#A49595] bg-gray-50 px-3 py-1 rounded-full">
                      {formatDate(submission.createdAt)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="bg-[#c1eddd]/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-[#A49595]" />
                  </div>
                  <p className="text-[#A49595] font-medium">No recent submissions</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Your Permissions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-[#16252D] mb-6">Your Permissions</h3>
          <div className="space-y-3">
            <div className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${
              admin?.permissions?.viewSubmissions || admin?.role === 'super_admin' 
                ? 'bg-gradient-to-r from-[#c1eddd]/30 to-[#37ffb7]/20 border border-[#12895E]/20' 
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className={`w-4 h-4 rounded-full shadow-sm ${
                admin?.permissions?.viewSubmissions || admin?.role === 'super_admin' 
                  ? 'bg-[#12895E]' 
                  : 'bg-[#A49595]'
              }`}></div>
              <span className={`font-medium ${
                admin?.permissions?.viewSubmissions || admin?.role === 'super_admin' 
                  ? 'text-[#16252D]' 
                  : 'text-[#A49595]'
              }`}>View Submissions</span>
            </div>
            
            <div className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${
              admin?.permissions?.deleteSubmissions || admin?.role === 'super_admin' 
                ? 'bg-gradient-to-r from-[#c1eddd]/30 to-[#37ffb7]/20 border border-[#12895E]/20' 
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className={`w-4 h-4 rounded-full shadow-sm ${
                admin?.permissions?.deleteSubmissions || admin?.role === 'super_admin' 
                  ? 'bg-[#12895E]' 
                  : 'bg-[#A49595]'
              }`}></div>
              <span className={`font-medium ${
                admin?.permissions?.deleteSubmissions || admin?.role === 'super_admin' 
                  ? 'text-[#16252D]' 
                  : 'text-[#A49595]'
              }`}>Delete Submissions</span>
            </div>
            
            <div className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${
              admin?.permissions?.downloadFiles || admin?.role === 'super_admin' 
                ? 'bg-gradient-to-r from-[#c1eddd]/30 to-[#37ffb7]/20 border border-[#12895E]/20' 
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className={`w-4 h-4 rounded-full shadow-sm ${
                admin?.permissions?.downloadFiles || admin?.role === 'super_admin' 
                  ? 'bg-[#12895E]' 
                  : 'bg-[#A49595]'
              }`}></div>
              <span className={`font-medium ${
                admin?.permissions?.downloadFiles || admin?.role === 'super_admin' 
                  ? 'text-[#16252D]' 
                  : 'text-[#A49595]'
              }`}>Download Files</span>
            </div>
            
            <div className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${
              admin?.permissions?.manageAdmins || admin?.role === 'super_admin' 
                ? 'bg-gradient-to-r from-[#c1eddd]/30 to-[#37ffb7]/20 border border-[#12895E]/20' 
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className={`w-4 h-4 rounded-full shadow-sm ${
                admin?.permissions?.manageAdmins || admin?.role === 'super_admin' 
                  ? 'bg-[#12895E]' 
                  : 'bg-[#A49595]'
              }`}></div>
              <span className={`font-medium ${
                admin?.permissions?.manageAdmins || admin?.role === 'super_admin' 
                  ? 'text-[#16252D]' 
                  : 'text-[#A49595]'
              }`}>Manage Admins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-[#16252D] mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(admin?.permissions?.viewSubmissions || admin?.role === 'super_admin') && (
            <button className="group text-left p-6 border-2 border-gray-100 rounded-xl hover:border-[#685EFC] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="bg-[#685EFC]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#685EFC] transition-colors duration-300">
                <FileText className="w-7 h-7 text-[#685EFC] group-hover:text-white transition-colors duration-300" />
              </div>
              <h4 className="font-bold text-[#16252D] mb-1">View All Submissions</h4>
              <p className="text-sm text-[#A49595]">Browse and manage submissions</p>
            </button>
          )}
          
          {(admin?.permissions?.downloadFiles || admin?.role === 'super_admin') && (
            <button className="group text-left p-6 border-2 border-gray-100 rounded-xl hover:border-[#12895E] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="bg-[#12895E]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#12895E] transition-colors duration-300">
                <Download className="w-7 h-7 text-[#12895E] group-hover:text-white transition-colors duration-300" />
              </div>
              <h4 className="font-bold text-[#16252D] mb-1">Download Files</h4>
              <p className="text-sm text-[#A49595]">Access uploaded documents</p>
            </button>
          )}
          
          <button className="group text-left p-6 border-2 border-gray-100 rounded-xl hover:border-[#685EFC] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="bg-[#685EFC]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#685EFC] transition-colors duration-300">
              <Clock className="w-7 h-7 text-[#685EFC] group-hover:text-white transition-colors duration-300" />
            </div>
            <h4 className="font-bold text-[#16252D] mb-1">Account Settings</h4>
            <p className="text-sm text-[#A49595]">Update your profile</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;