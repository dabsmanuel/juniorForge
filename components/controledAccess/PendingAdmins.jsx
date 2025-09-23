'use client'

import React, { useState, useEffect } from 'react';
import { Check, X, User, Mail, Calendar, Building } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { authApi, formatDate } from '../../lib/util';
import LoadingSpinner from './layout/LoadingSpinner';

const PendingAdmins = ({ admin, token, onDataChange }) => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [customPermissions, setCustomPermissions] = useState({
    viewSubmissions: true,
    deleteSubmissions: false,
    manageAdmins: false,
    downloadFiles: true
  });
  const { loading, error, executeAsync } = useApi();

  useEffect(() => {
    loadPendingAdmins();
  }, []);

  const loadPendingAdmins = async () => {
    try {
      const response = await executeAsync(() => authApi.getPendingAdmins(token));
      setPendingAdmins(response.data || []);
    } catch (error) {
      console.error('Error loading pending admins:', error);
    }
  };

  const handleApprove = async () => {
    if (!selectedAdmin) return;

    try {
      await executeAsync(() => authApi.approveAdmin(token, selectedAdmin._id, customPermissions));
      setPendingAdmins(pendingAdmins.filter(admin => admin._id !== selectedAdmin._id));
      setShowApprovalModal(false);
      setSelectedAdmin(null);
      onDataChange && onDataChange();
    } catch (error) {
      console.error('Error approving admin:', error);
    }
  };

  const handleReject = async () => {
    if (!selectedAdmin || !rejectionReason.trim()) return;

    try {
      await executeAsync(() => authApi.rejectAdmin(token, selectedAdmin._id, rejectionReason));
      setPendingAdmins(pendingAdmins.filter(admin => admin._id !== selectedAdmin._id));
      setShowRejectionModal(false);
      setSelectedAdmin(null);
      setRejectionReason('');
      onDataChange && onDataChange();
    } catch (error) {
      console.error('Error rejecting admin:', error);
    }
  };

  const openApprovalModal = (adminToApprove) => {
    setSelectedAdmin(adminToApprove);
    setShowApprovalModal(true);
  };

  const openRejectionModal = (adminToReject) => {
    setSelectedAdmin(adminToReject);
    setShowRejectionModal(true);
  };

  if (loading && pendingAdmins.length === 0) {
    return <LoadingSpinner message="Loading pending admins..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pending Admin Approvals</h1>
        <p className="text-gray-600">Review and approve new admin registrations</p>
      </div>

      {/* Stats */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Pending: {pendingAdmins.length}</span>
          </div>
        </div>
      </div>

      {/* Pending Admins List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {pendingAdmins.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {pendingAdmins.map((pendingAdmin) => (
              <div key={pendingAdmin._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {pendingAdmin.firstName} {pendingAdmin.lastName}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{pendingAdmin.email}</span>
                        </div>
                        {pendingAdmin.department && (
                          <div className="flex items-center space-x-1">
                            <Building className="w-4 h-4" />
                            <span>{pendingAdmin.department}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Applied {formatDate(pendingAdmin.createdAt)}</span>
                        </div>
                      </div>
                      {pendingAdmin.phoneNumber && (
                        <p className="text-sm text-gray-500 mt-1">
                          Phone: {pendingAdmin.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openApprovalModal(pendingAdmin)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => openRejectionModal(pendingAdmin)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
            <p className="text-gray-500">All admin applications have been processed</p>
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Approve Admin Account
              </h2>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  You are about to approve <strong>{selectedAdmin.firstName} {selectedAdmin.lastName}</strong> 
                  as an admin.
                </p>
              </div>

              {/* Permission Settings */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Set Permissions:</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={customPermissions.viewSubmissions}
                      onChange={(e) => setCustomPermissions({
                        ...customPermissions,
                        viewSubmissions: e.target.checked
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">View Submissions</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={customPermissions.deleteSubmissions}
                      onChange={(e) => setCustomPermissions({
                        ...customPermissions,
                        deleteSubmissions: e.target.checked
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Delete Submissions</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={customPermissions.downloadFiles}
                      onChange={(e) => setCustomPermissions({
                        ...customPermissions,
                        downloadFiles: e.target.checked
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Download Files</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={customPermissions.manageAdmins}
                      onChange={(e) => setCustomPermissions({
                        ...customPermissions,
                        manageAdmins: e.target.checked
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Manage Admins</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Approving...' : 'Approve Admin'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Reject Admin Application
              </h2>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-4">
                  You are about to reject the application from <strong>{selectedAdmin.firstName} {selectedAdmin.lastName}</strong>.
                </p>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for rejection (required):
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowRejectionModal(false);
                    setRejectionReason('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={loading || !rejectionReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Rejecting...' : 'Reject Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingAdmins;