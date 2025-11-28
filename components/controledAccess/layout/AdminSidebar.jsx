'use client'

import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Download,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  X,
  Users,
  TestTubes,
  VerifiedIcon
} from 'lucide-react';

const AdminSidebar = ({ 
  activeTab, 
  setActiveTab, 
  collapsed, 
  setCollapsed, 
  mobileOpen, 
  setMobileOpen, 
  admin 
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      permission: null
    },
    {
      id: 'submissions',
      label: 'Submissions',
      icon: FileText,
      permission: 'viewSubmissions'
    },
    {
      id: 'downloads',
      label: 'Downloads',
      icon: Download,
      permission: 'downloadFiles'
    },
    {
      id: 'vetted-talents',
      label: 'Vetted Talents',
      icon: VerifiedIcon,
      permission: null
    },
    {
      id: 'assessment-settings',
      label: 'Assessment Settings',
      icon: TestTubes,
      permission: null
    }
  ];

  // Filter menu items based on permissions
  const availableMenuItems = menuItems.filter(item => {
    if (!item.permission) return true;
    return admin?.permissions?.[item.permission] || admin?.role === 'super_admin';
  });

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-[#16252D] text-white transition-transform duration-300
        lg:hidden flex flex-col h-screen
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64
      `}>
        {/* Mobile Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold">Junior Forge</h2>
            <p className="text-sm text-gray-400">Admin Panel</p>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation - Scrollable */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {availableMenuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-[#12895E] text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Permissions Info */}
        <div className="p-4 flex-shrink-0">
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="text-xs text-gray-400 mb-2">Your Permissions:</div>
            <div className="space-y-1">
              {admin?.permissions?.viewSubmissions && (
                <div className="text-xs text-green-400">✓ View Submissions</div>
              )}
              {admin?.permissions?.deleteSubmissions && (
                <div className="text-xs text-green-400">✓ Delete Submissions</div>
              )}
              {admin?.permissions?.downloadFiles && (
                <div className="text-xs text-green-400">✓ Download Files</div>
              )}
              {admin?.permissions?.manageAdmins && (
                <div className="text-xs text-green-400">✓ Manage Admins</div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="p-4 border-t border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#12895E] rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="text-sm">
              <div className="font-medium">{admin?.firstName} {admin?.lastName}</div>
              <div className="text-gray-400 capitalize">{admin?.role?.replace('_', ' ')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={`
        bg-[#16252D] text-white transition-all duration-300 hidden lg:flex flex-col h-screen
        ${collapsed ? 'w-16' : 'w-64'}
      `}>
        {/* Desktop Header */}
        <div className="p-4 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div>
                <h2 className="text-xl font-bold">Junior Forge</h2>
                <p className="text-sm text-gray-400">Admin Panel</p>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Desktop Navigation - Scrollable */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {availableMenuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-[#12895E] text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="flex-1 text-left">{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Permissions Info */}
        {!collapsed && (
          <div className="p-4 flex-shrink-0">
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="text-xs text-gray-400 mb-2">Your Permissions:</div>
              <div className="space-y-1">
                {admin?.permissions?.viewSubmissions && (
                  <div className="text-xs text-green-400">✓ View Submissions</div>
                )}
                {admin?.permissions?.deleteSubmissions && (
                  <div className="text-xs text-green-400">✓ Delete Submissions</div>
                )}
                {admin?.permissions?.downloadFiles && (
                  <div className="text-xs text-green-400">✓ Download Files</div>
                )}
                {admin?.permissions?.manageAdmins && (
                  <div className="text-xs text-green-400">✓ Manage Admins</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Desktop Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-gray-700 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#12895E] rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="text-sm">
                <div className="font-medium">{admin?.firstName} {admin?.lastName}</div>
                <div className="text-gray-400 capitalize">{admin?.role?.replace('_', ' ')}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminSidebar;