import React, { useState, useEffect } from 'react';
import { Search, Filter, User, UserX, RotateCcw, Trash2, Edit, Shield, Calendar, Mail, CheckCircle, Clock, XCircle, Slash } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { authApi, formatDate } from '../../lib/util';
import LoadingSpinner from './layout/LoadingSpinner';

// --- Brand Colors ---
const BRAND_PRIMARY = '#685EFC';
const BRAND_DARK = '#16252D';
const BRAND_LIGHT_ACCENT = '#c1eddd';
const BRAND_SUCCESS = '#12895E';
const BRAND_NEUTRAL_SOFT = '#A49595'; // Soft border/divider color

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
      // Logic for API calls (kept same)
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

      setShowActionModal(false);
      setSelectedAdmin(null);
      setActionType('');
      setActionReason('');
      onDataChange && onDataChange();
      
      // Reload data for all actions to reflect state change accurately
      loadAllAdmins();

    } catch (error) {
      console.error('Error performing admin action:', error);
    }
  };

  const openActionModal = (adminTarget, action) => {
    setSelectedAdmin(adminTarget);
    setActionType(action);
    setShowActionModal(true);
  };

  // --- REFINED STATUS/ROLE BADGES ---
  const getStatusBadge = (status) => {
    const badges = {
      approved: {
        bg: 'bg-green-100',
        text: `text-[${BRAND_SUCCESS}]`,
        icon: <CheckCircle className="w-3 h-3 mr-1" />
      },
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        icon: <Clock className="w-3 h-3 mr-1" />
      },
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: <XCircle className="w-3 h-3 mr-1" />
      },
      suspended: {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        icon: <Slash className="w-3 h-3 mr-1" />
      },
    };
    return badges[status] || badges.suspended; // Default fallback
  };

  const getRoleBadge = (role) => {
    return role === 'super_admin' 
      ? { 
          bg: `bg-[${BRAND_LIGHT_ACCENT}]`, 
          text: `text-[${BRAND_SUCCESS}]`, 
          icon: <Shield className="w-4 h-4 text-green-700" />
        } 
      : { 
          bg: 'bg-blue-100', 
          text: 'text-blue-700', 
          icon: <User className="w-4 h-4 text-blue-700" />
        };
  };

  const canPerformAction = (targetAdmin, action) => {
    // Keep original logic
    if (targetAdmin._id === admin._id) return false;
    if (targetAdmin.role === 'super_admin') return false;
    if (admin.role !== 'super_admin') return false;

    switch (action) {
      case 'suspend':
        return targetAdmin.status === 'approved';
      case 'reactivate':
        return targetAdmin.status === 'suspended';
      case 'delete':
        return targetAdmin.status !== 'approved' && targetAdmin.status !== 'pending'; // Added check to prevent deleting pending/approved for safety
      default:
        return false;
    }
  };

  // Calculate stats once
  const totalAdmins = allAdmins.length;
  const approvedCount = allAdmins.filter(a => a.status === 'approved').length;
  const suspendedCount = allAdmins.filter(a => a.status === 'suspended').length;
  const superAdminCount = allAdmins.filter(a => a.role === 'super_admin').length;

  if (loading && allAdmins.length === 0) {
    return <LoadingSpinner message="Loading admins..." />;
  }

  // --- UI RENDER START ---
  return (
    <div className="p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen">
      
      {/* 1. Header */}
      <div className="border-b pb-4 border-gray-200">
        <h1 className={`text-3xl font-extrabold text-[${BRAND_DARK}]`}>
          <Shield className="inline-block w-6 h-6 mr-2 mb-1" /> Admin Control Panel
        </h1>
        <p className="text-gray-500 mt-1">
          View and manage all administrator accounts and access levels.
        </p>
      </div>

      {/* 2. Stats and Quick Filters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Card - Total */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Admins</p>
          <p className={`text-3xl font-bold text-[${BRAND_DARK}] mt-1`}>{totalAdmins}</p>
        </div>
        {/* Stat Card - Approved */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Active</p>
          <p className={`text-3xl font-bold text-[${BRAND_SUCCESS}] mt-1`}>{approvedCount}</p>
        </div>
        {/* Stat Card - Suspended */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Suspended</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">{suspendedCount}</p>
        </div>
        {/* Stat Card - Super Admins */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Super Admins</p>
          <p className={`text-3xl font-bold text-[${BRAND_PRIMARY}] mt-1`}>{superAdminCount}</p>
        </div>
      </div>

      {/* 3. Filters and Search Bar */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          
          {/* Search Bar */}
          <div className="flex-1 relative w-full lg:w-auto">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-[${BRAND_NEUTRAL_SOFT}] w-5 h-5`} />
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-12 pr-4 py-3 w-full border border-gray-300 rounded-xl bg-gray-50 text-[${BRAND_DARK}] focus:ring-2 focus:ring-[${BRAND_PRIMARY}] focus:border-transparent transition duration-150 ease-in-out`}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-4 w-full lg:w-auto">
            
            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`appearance-none border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-[${BRAND_DARK}] bg-white hover:border-[${BRAND_PRIMARY}] focus:ring-2 focus:ring-[${BRAND_PRIMARY}] focus:border-transparent transition duration-150 ease-in-out`}
              >
                <option value="all">Status: All</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
              <Filter className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-[${BRAND_PRIMARY}] w-4 h-4 pointer-events-none`} />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className={`appearance-none border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-[${BRAND_DARK}] bg-white hover:border-[${BRAND_PRIMARY}] focus:ring-2 focus:ring-[${BRAND_PRIMARY}] focus:border-transparent transition duration-150 ease-in-out`}
              >
                <option value="all">Role: All</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
              <User className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-[${BRAND_PRIMARY}] w-4 h-4 pointer-events-none`} />
            </div>
          </div>
        </div>

        {/* Filter Summary */}
        <p className="mt-4 text-sm text-gray-500">
          Showing **{filteredAdmins.length}** result{filteredAdmins.length !== 1 ? 's' : ''} out of **{totalAdmins}** total admins.
        </p>
      </div>

      {/* 4. Admins Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`bg-[${BRAND_PRIMARY}]/10`}> {/* Light primary color for header background */}
              <tr>
                {['Admin', 'Role', 'Status', 'Details', 'Last Login', 'Actions'].map(header => (
                  <th 
                    key={header} 
                    className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[${BRAND_DARK}]`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredAdmins.map((adminItem) => {
                const role = getRoleBadge(adminItem.role);
                const status = getStatusBadge(adminItem.status);
                
                return (
                  <tr key={adminItem._id} className={`hover:bg-[${BRAND_LIGHT_ACCENT}]/50 transition duration-150 ease-in-out`}>
                    
                    {/* Admin Name/Email */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${role.bg}`}>
                          {adminItem.role === 'super_admin' ? <Shield className={`w-5 h-5 text-[${BRAND_SUCCESS}]`} /> : <User className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div className="ml-4">
                          <div className={`text-sm font-semibold text-[${BRAND_DARK}]`}>
                            {adminItem.firstName} {adminItem.lastName}
                            {adminItem._id === admin._id && (
                              <span className={`ml-2 text-xs font-medium text-[${BRAND_PRIMARY}]`}>(You)</span>
                            )}
                          </div>
                          <div className={`text-xs text-gray-500 flex items-center mt-0.5`}>
                            <Mail className="w-3 h-3 mr-1" />
                            {adminItem.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Role Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${role.bg} ${role.text}`}>
                        {adminItem.role === 'super_admin' ? 'Super Admin' : 'Standard Admin'}
                      </span>
                    </td>
                    
                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${status.bg} ${status.text}`}>
                        {status.icon}
                        {adminItem.status.charAt(0).toUpperCase() + adminItem.status.slice(1)}
                      </span>
                    </td>
                    
                    {/* Details */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        {adminItem.department && (
                          <div className="font-medium text-gray-700">{adminItem.department}</div>
                        )}
                        <div className="text-xs flex items-center mt-1">
                          <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                          Joined {formatDate(adminItem.createdAt)}
                        </div>
                      </div>
                    </td>
                    
                    {/* Last Login */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {adminItem.lastLogin ? formatDate(adminItem.lastLogin) : 'Never'}
                    </td>
                    
                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        {canPerformAction(adminItem, 'suspend') && (
                          <button
                            onClick={() => openActionModal(adminItem, 'suspend')}
                            className="p-1 rounded-full text-yellow-600 hover:bg-yellow-50 transition duration-150"
                            title="Suspend Admin"
                          >
                            <UserX className="w-5 h-5" />
                          </button>
                        )}
                        
                        {canPerformAction(adminItem, 'reactivate') && (
                          <button
                            onClick={() => openActionModal(adminItem, 'reactivate')}
                            className={`p-1 rounded-full text-[${BRAND_SUCCESS}] hover:bg-green-50 transition duration-150`}
                            title="Reactivate Admin"
                          >
                            <RotateCcw className="w-5 h-5" />
                          </button>
                        )}
                        
                        {canPerformAction(adminItem, 'delete') && (
                          <button
                            onClick={() => openActionModal(adminItem, 'delete')}
                            className="p-1 rounded-full text-red-600 hover:bg-red-50 transition duration-150"
                            title="Delete Admin"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredAdmins.length === 0 && !loading && (
          <div className="text-center py-16 bg-gray-50/50">
            <UserX className={`w-12 h-12 text-[${BRAND_NEUTRAL_SOFT}] mx-auto mb-4`} />
            <h3 className={`text-xl font-semibold text-[${BRAND_DARK}] mb-2`}>No Admins Found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {searchTerm || filterStatus !== 'all' || filterRole !== 'all'
                ? 'Your current filters returned no results. Try broadening your search or filter criteria.'
                : 'No administrators have been registered yet. Time to create your first admin account!'}
            </p>
          </div>
        )}
      </div>

      {/* 5. Action Modal (Refined) */}
      {showActionModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl transform scale-100 transition-all duration-300">
            <div className="p-8">
              <h2 className={`text-2xl font-bold mb-4 ${actionType === 'delete' ? 'text-red-600' : actionType === 'suspend' ? 'text-yellow-600' : `text-[${BRAND_PRIMARY}]`}`}>
                {actionType === 'suspend' && 'Confirm Suspension'}
                {actionType === 'reactivate' && 'Confirm Reactivation'}
                {actionType === 'delete' && 'Permanent Deletion'}
              </h2>
              <p className="text-gray-700 mb-6">
                You are about to **{actionType}** the account for **{selectedAdmin.firstName} {selectedAdmin.lastName}** (`{selectedAdmin.email}`). Please proceed with caution.
              </p>
              
              {actionType === 'delete' && (
                <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded mb-6">
                  <p className="font-semibold">Irreversible Action</p>
                  <p className="text-sm">This action will permanently remove the admin account and cannot be undone.</p>
                </div>
              )}
              
              {actionType === 'suspend' && (
                <div className="mb-6">
                  <label className={`block text-sm font-medium text-[${BRAND_DARK}] mb-2`}>
                    Reason for action (required):
                  </label>
                  <textarea
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    placeholder="E.g., Violation of policy, Temporary leave, Security audit failure..."
                    rows={4}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
                  />
                  <p className="text-xs text-gray-500 mt-1">This reason will be logged for audit purposes.</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    setActionReason('');
                  }}
                  className={`px-6 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition duration-150`}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdminAction}
                  disabled={loading || (actionType === 'suspend' && !actionReason.trim())}
                  className={`px-6 py-2 text-white rounded-xl text-sm font-medium transition duration-150 shadow-md 
                    ${actionType === 'suspend' ? 'bg-yellow-600 hover:bg-yellow-700' :
                      actionType === 'reactivate' ? `bg-[${BRAND_SUCCESS}] hover:bg-green-700` :
                      'bg-red-600 hover:bg-red-700'} 
                    disabled:opacity-50`}
                >
                  {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                  ) : 
                    `${actionType.charAt(0).toUpperCase() + actionType.slice(1)} Account`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* API Error Notification (Simple visibility improvement) */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg fixed bottom-4 right-4 shadow-xl z-50">
          <p className="font-medium">API Error</p>
          <p className="text-sm">Could not complete request. Please try again. ({error.message})</p>
        </div>
      )}

    </div>
  );
};

export default AllAdmins;