import React, { useState, useEffect } from 'react';
import { Search, Filter, User, UserX, RotateCcw, Trash2, Edit, Shield, Calendar, Mail } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { authApi, formatDate } from '../../lib/util';
import LoadingSpinner from './layout/LoadingSpinner';

const AllAdmins = ({ admin, token, onDataChange }) => {
  const [allAdmins, setAllAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionReason, setActionReason] = useState('');
  const { loading, error, executeAsync } = useApi();

  useEffect(() => {
    loadAllAdmins();
  }, []);

  useEffect(() => {
    filterAdmins();
  }, [allAdmins, filterStatus, filterRole, searchTerm]);

  const loadAllAdmins = async () => {
    try {
      const response = await executeAsync(() => authApi.getAllAdmins(token));
      setAllAdmins(response.data || []);
    } catch (error) {
      console.error('Error loading admins:', error);
    }
  };

  const filterAdmins = () => {
    let filtered = allAdmins;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(admin => admin.status === filterStatus);
    }

    // Filter by role
    if (filterRole !== 'all') {
      filtered = filtered.filter(admin => admin.role === filterRole);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(admin =>
        `${admin.firstName} ${admin.lastName}`.toLowerCase().includes(search) ||
        admin.email.toLowerCase().includes(search) ||
        (admin.department && admin.department.toLowerCase().includes(search))
      );
    }

    setFilteredAdmins(filtered);
  };

  const handleAdminAction = async () => {
    if (!selectedAdmin) return;

    try {
      switch (actionType) {
        case 'suspend':
          await executeAsync(() => authApi.suspendAdmin(token, selectedAdmin._id, actionReason));
          break;
        case 'reactivate':
          await executeAsync(() => authApi.reactivateAdmin(token, selectedAdmin._id));
          break;
        case 'delete':
          await executeAsync(() => authApi.deleteAdmin(token, selectedAdmin._id));
          break;
        default:
          return;
      }

      setAllAdmins(allAdmins.filter(a => a._id !== selectedAdmin._id || actionType !== 'delete'));
      setShowActionModal(false);
      setSelectedAdmin(null);
      setActionType('');
      setActionReason('');
      onDataChange && onDataChange();
      
      // Reload data for non-delete actions
      if (actionType !== 'delete') {
        loadAllAdmins();
      }
    } catch (error) {
      console.error('Error performing admin action:', error);
    }
  };

  const openActionModal = (adminTarget, action) => {
    setSelectedAdmin(adminTarget);
    setActionType(action);
    setShowActionModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      suspended: 'bg-gray-100 text-gray-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getRoleBadge = (role) => {
    return role === 'super_admin' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800';
  };

  const canPerformAction = (targetAdmin, action) => {
    // Can't perform actions on yourself
    if (targetAdmin._id === admin._id) return false;
    
    // Can't perform actions on other super admins
    if (targetAdmin.role === 'super_admin') return false;
    
    // Only super admins can perform these actions
    if (admin.role !== 'super_admin') return false;

    switch (action) {
      case 'suspend':
        return targetAdmin.status === 'approved';
      case 'reactivate':
        return targetAdmin.status === 'suspended';
      case 'delete':
        return targetAdmin.status !== 'approved';
      default:
        return false;
    }
  };

  if (loading && allAdmins.length === 0) {
    return <LoadingSpinner message="Loading admins..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Admins</h1>
        <p className="text-gray-600">Manage all administrator accounts</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#685EFC] focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#685EFC] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#685EFC] focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex space-x-6 text-sm text-gray-600">
          <div>Total: {filteredAdmins.length}</div>
          <div>Approved: {filteredAdmins.filter(a => a.status === 'approved').length}</div>
          <div>Pending: {filteredAdmins.filter(a => a.status === 'pending').length}</div>
          <div>Super Admins: {filteredAdmins.filter(a => a.role === 'super_admin').length}</div>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdmins.map((adminItem) => (
                <tr key={adminItem._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        adminItem.role === 'super_admin' 
                          ? 'bg-purple-100' 
                          : 'bg-blue-100'
                      }`}>
                        {adminItem.role === 'super_admin' ? (
                          <Shield className={`w-5 h-5 text-purple-600`} />
                        ) : (
                          <User className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {adminItem.firstName} {adminItem.lastName}
                          {adminItem._id === admin._id && (
                            <span className="ml-2 text-xs text-blue-600">(You)</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {adminItem.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(adminItem.role)}`}>
                      {adminItem.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(adminItem.status)}`}>
                      {adminItem.status.charAt(0).toUpperCase() + adminItem.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      {adminItem.department && (
                        <div className="font-medium">{adminItem.department}</div>
                      )}
                      {adminItem.phoneNumber && (
                        <div className="text-xs">{adminItem.phoneNumber}</div>
                      )}
                      <div className="text-xs flex items-center mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        Joined {formatDate(adminItem.createdAt)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {adminItem.lastLogin ? formatDate(adminItem.lastLogin) : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {canPerformAction(adminItem, 'suspend') && (
                        <button
                          onClick={() => openActionModal(adminItem, 'suspend')}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Suspend Admin"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      )}
                      
                      {canPerformAction(adminItem, 'reactivate') && (
                        <button
                          onClick={() => openActionModal(adminItem, 'reactivate')}
                          className="text-green-600 hover:text-green-900"
                          title="Reactivate Admin"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                      
                      {canPerformAction(adminItem, 'delete') && (
                        <button
                          onClick={() => openActionModal(adminItem, 'delete')}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Admin"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAdmins.length === 0 && !loading && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No admins found</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'all' || filterRole !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'No administrators have been registered yet'}
            </p>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {actionType === 'suspend' && 'Suspend Admin'}
                {actionType === 'reactivate' && 'Reactivate Admin'}
                {actionType === 'delete' && 'Delete Admin'}
              </h2>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-4">
                  You are about to {actionType} the admin account for <strong>{selectedAdmin.firstName} {selectedAdmin.lastName}</strong>.
                </p>
                
                {actionType === 'delete' && (
                  <p className="text-red-600 mb-4">This action is permanent and cannot be undone.</p>
                )}

                {actionType === 'suspend' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for suspension (required):
                    </label>
                    <textarea
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      placeholder="Please provide a reason for suspension..."
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    setActionReason('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdminAction}
                  disabled={loading || (actionType === 'suspend' && !actionReason.trim())}
                  className={`flex-1 px-4 py-2 text-white rounded-md text-sm font-medium 
                    ${actionType === 'suspend' ? 'bg-yellow-600 hover:bg-yellow-700' :
                      actionType === 'reactivate' ? 'bg-green-600 hover:bg-green-700' :
                      'bg-red-600 hover:bg-red-700'} 
                    disabled:opacity-50`}
                >
                  {loading ? `${actionType.charAt(0).toUpperCase() + actionType.slice(1)}ing...` : 
                    `${actionType.charAt(0).toUpperCase() + actionType.slice(1)} Admin`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAdmins;