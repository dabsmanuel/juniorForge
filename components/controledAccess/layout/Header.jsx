'use client'

import React, { useState } from 'react';
import { Bell, Search, User, LogOut, Settings, ChevronDown, Menu } from 'lucide-react';

const DashboardHeader = ({ admin, onLogout, onMenuToggle }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Mobile menu and Search */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Mobile Menu Button */}
          <button 
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-sm lg:max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 lg:pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#685EFC] focus:border-transparent text-sm lg:text-base"
              />
            </div>
          </div>
        </div>

        {/* Right side - Notifications and Profile */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2 lg:space-x-3 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-[#685EFC] rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium truncate max-w-32">
                  {admin?.firstName} {admin?.lastName}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {admin?.role?.replace('_', ' ')}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 hidden sm:block" />
            </button>

            {showProfileDropdown && (
              <>
                {/* Mobile Dropdown Overlay */}
                <div 
                  className="fixed inset-0 z-40 lg:hidden"
                  onClick={() => setShowProfileDropdown(false)}
                />
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {admin?.firstName} {admin?.lastName}
                      </div>
                      <div className="text-sm text-gray-500 truncate">{admin?.email}</div>
                    </div>
                    
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    
                    <div className="border-t border-gray-100 mt-2">
                      <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;