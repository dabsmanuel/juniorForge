'use client';
import React, { useState, useEffect } from 'react';
import { DollarSign, Users, TrendingUp, Calendar, Plus, FileText, Search, Filter, X, Edit, Trash2, RefreshCw } from 'lucide-react';
import { useAccounting } from '../../hooks/useAccounting';

const JuniorForgeAccounting = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({ USD: 1, NGN: 1600, GBP: 0.79 });
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const [token, setToken] = useState(null);
  const [placements, setPlacements] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);

  const { 
    loading, 
    error,
    clearError,
    getDashboardStats: fetchDashboardStatsApi,
    getRecentActivity: fetchRecentActivityApi,
    getPlacements: fetchPlacementsApi,
    createPlacement: createPlacementApi,
    updatePlacement: updatePlacementApi,
    deletePlacement: deletePlacementApi,
    getRevenues: fetchRevenuesApi,
    createRevenue: createRevenueApi,
    updateRevenue: updateRevenueApi,
    deleteRevenue: deleteRevenueApi,
    getExpenses: fetchExpensesApi,
    createExpense: createExpenseApi,
    updateExpense: updateExpenseApi,
    deleteExpense: deleteExpenseApi,
    getExchangeRates: fetchExchangeRatesApi
  } = useAccounting(token);

  // Initialize token from localStorage
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      setToken(adminToken);
    }
  }, []);

  // Fetch data when tab changes or token is available
  useEffect(() => {
    if (token) {
      fetchData();
      fetchExchangeRates();
    }
  }, [activeTab, token]);

  const fetchData = async () => {
    if (!token) return;

    try {
      clearError();
      switch (activeTab) {
        case 'dashboard':
          await fetchDashboardStats();
          break;
        case 'placements':
          await fetchPlacements();
          break;
        case 'revenue':
          await fetchRevenues();
          break;
        case 'expenses':
          await fetchExpenses();
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchPlacements = async () => {
    const data = await fetchPlacementsApi();
    setPlacements(Array.isArray(data) ? data : (data?.placements || []));
  };

  const fetchRevenues = async () => {
    const data = await fetchRevenuesApi();
    setRevenues(Array.isArray(data) ? data : (data?.revenues || []));
  };

  const fetchExpenses = async () => {
    const data = await fetchExpensesApi();
    setExpenses(Array.isArray(data) ? data : (data?.expenses || []));
  };

  const fetchDashboardStats = async () => {
    const data = await fetchDashboardStatsApi();
    setDashboardStats(data || {});
  };

  const fetchExchangeRates = async () => {
    try {
      const data = await fetchExchangeRatesApi();
      if (data.success && data.data.rates) {
        setExchangeRates(data.data.rates);
        setLastUpdated(data.data.lastUpdated);
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      // Use fallback rates
      setExchangeRates({ USD: 1, NGN: 1600, GBP: 0.79 });
    }
  };

  // Enhanced currency conversion helper
  const convertAmount = (amount, fromCurrency = 'USD') => {
    if (!amount || isNaN(amount)) return 0;
    if (currency === fromCurrency) {
      return amount;
    }
    
    // Convert from source currency to USD first, then to target currency
    const amountInUSD = amount / exchangeRates[fromCurrency];
    const convertedAmount = amountInUSD * exchangeRates[currency];
    
    return convertedAmount;
  };

  // Universal currency formatting function
  const formatCurrency = (amount, fromCurrency = 'USD') => {
    const converted = convertAmount(amount, fromCurrency);
    
    if (currency === 'NGN') {
      return `₦${converted.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (currency === 'GBP') {
      return `£${converted.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Get currency symbol for labels
  const getCurrencySymbol = () => {
    if (currency === 'NGN') return '₦';
    if (currency === 'GBP') return '£';
    return '$';
  };

  // Get currency code for display
  const getCurrencyCode = () => {
    return currency;
  };

  const handleCurrencyChange = async (newCurrency) => {
    setCurrency(newCurrency);
    // Refresh exchange rates when currency changes
    await fetchExchangeRates();
  };

  // Calculations - these now return raw numbers for the formatCurrency function to handle
  const calculateTotalRevenue = () => {
    if (dashboardStats?.totalRevenue !== undefined) return dashboardStats.totalRevenue;
    return revenues.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0);
  };

  const calculatePendingRevenue = () => {
    if (dashboardStats?.pendingRevenue !== undefined) return dashboardStats.pendingRevenue;
    return revenues.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);
  };

  const calculateExpectedRevenue = () => {
    if (dashboardStats?.expectedRevenue !== undefined) return dashboardStats.expectedRevenue;
    return revenues.filter(r => r.status === 'expected').reduce((sum, r) => sum + r.amount, 0);
  };

  const calculateTotalExpenses = () => {
    if (dashboardStats?.totalExpenses !== undefined) return dashboardStats.totalExpenses;
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  };

  const calculateNetProfit = () => {
    if (dashboardStats?.netProfit !== undefined) return dashboardStats.netProfit;
    return calculateTotalRevenue() - calculateTotalExpenses();
  };

  const calculateExpectedRetentionBonuses = () => {
    if (dashboardStats?.expectedRetentionBonuses !== undefined) return dashboardStats.expectedRetentionBonuses;
    return placements
      .filter(p => p.retentionBonusEligible && p.monthsCompleted >= 6 && p.monthsCompleted < 12)
      .reduce((sum, p) => sum + (p.annualSalary * ((p.retentionBonusPercent || 17.5) / 100)), 0);
  };

  const getActivePlacements = () => {
    if (dashboardStats?.activePlacements !== undefined) return dashboardStats.activePlacements;
    return placements.filter(p => p.status === 'active').length;
  };

  // Modal handlers
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
  };

  const handleAddPlacement = async (e) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData(e.target);
    const placementData = {
      talentName: formData.get('talentName'),
      clientName: formData.get('clientName'),
      role: formData.get('role'),
      startDate: formData.get('startDate'),
      monthlyClientPayment: parseFloat(formData.get('monthlyClientPayment')),
      talentSalary: parseFloat(formData.get('talentSalary')),
      annualSalary: parseFloat(formData.get('annualSalary')),
      feePercentage: parseFloat(formData.get('feePercentage')),
      retentionBonusPercent: parseFloat(formData.get('retentionBonusPercent')),
      status: editingItem ? formData.get('status') : 'active',
      monthsCompleted: editingItem ? parseInt(formData.get('monthsCompleted')) : 0,
      retentionBonusEligible: formData.get('retentionBonusEligible') === 'on'
    };

    try {
      if (editingItem) {
        await updatePlacementApi(editingItem.id, placementData);
      } else {
        await createPlacementApi(placementData);
      }
      await fetchPlacements();
      closeModal();
    } catch (error) {
      console.error('Error saving placement:', error);
    }
  };

  const handleAddRevenue = async (e) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData(e.target);
    const revenueData = {
      type: formData.get('type'),
      amount: parseFloat(formData.get('amount')),
      date: formData.get('date'),
      client: formData.get('client'),
      description: formData.get('description'),
      status: formData.get('status'),
      paymentMethod: formData.get('paymentMethod') || undefined,
      referenceNumber: formData.get('referenceNumber') || undefined
    };

    Object.keys(revenueData).forEach(key => 
      revenueData[key] === undefined && delete revenueData[key]
    );

    try {
      if (editingItem) {
        await updateRevenueApi(editingItem.id, revenueData);
      } else {
        await createRevenueApi(revenueData);
      }
      await fetchRevenues();
      closeModal();
    } catch (error) {
      console.error('Error saving revenue:', error);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData(e.target);
    const expenseData = {
      category: formData.get('category'),
      description: formData.get('description'),
      amount: parseFloat(formData.get('amount')),
      date: formData.get('date'),
      paymentMethod: formData.get('paymentMethod'),
      vendor: formData.get('vendor') || undefined,
      referenceNumber: formData.get('referenceNumber') || undefined
    };

    Object.keys(expenseData).forEach(key => 
      expenseData[key] === undefined && delete expenseData[key]
    );

    try {
      if (editingItem) {
        await updateExpenseApi(editingItem.id, expenseData);
      } else {
        await createExpenseApi(expenseData);
      }
      await fetchExpenses();
      closeModal();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    if (!token) return;

    try {
      switch (type) {
        case 'placement':
          await deletePlacementApi(id);
          await fetchPlacements();
          break;
        case 'revenue':
          await deleteRevenueApi(id);
          await fetchRevenues();
          break;
        case 'expense':
          await deleteExpenseApi(id);
          await fetchExpenses();
          break;
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Dashboard Component
  const Dashboard = () => (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue (Paid)</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(calculateTotalRevenue())}</p>
            </div>
            <DollarSign className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(calculateTotalExpenses())}</p>
            </div>
            <TrendingUp className="text-red-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(calculateNetProfit())}</p>
            </div>
            <FileText className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Placements</p>
              <p className="text-2xl font-bold text-purple-600">{getActivePlacements()}</p>
            </div>
            <Users className="text-purple-600" size={32} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Revenue Pipeline</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <span className="text-sm font-medium">Paid Revenue</span>
              <span className="font-bold text-green-600">{formatCurrency(calculateTotalRevenue())}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
              <span className="text-sm font-medium">Pending Revenue</span>
              <span className="font-bold text-yellow-600">{formatCurrency(calculatePendingRevenue())}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <span className="text-sm font-medium">Expected Revenue</span>
              <span className="font-bold text-blue-600">{formatCurrency(calculateExpectedRevenue())}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
              <span className="text-sm font-medium">Expected Retention Bonuses</span>
              <span className="font-bold text-purple-600">{formatCurrency(calculateExpectedRetentionBonuses())}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {revenues.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No activity yet. Start by adding placements, revenue, or expenses.</p>
            ) : (
              <>
                {[...revenues.slice(-3).reverse()].map(r => (
                  <div key={r.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium">{r.type} - {r.client}</p>
                      <p className="text-xs text-gray-500">{r.date}</p>
                    </div>
                    <span className={`font-bold ${r.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {formatCurrency(r.amount)}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Placements Component
  const Placements = () => (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Placements</h2>
        <button 
          onClick={() => openModal('placement')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          disabled={loading}
        >
          <Plus size={20} /> Add Placement
        </button>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <RefreshCw size={48} className="mx-auto text-gray-400 mb-4 animate-spin" />
          <p className="text-gray-500">Loading placements...</p>
        </div>
      ) : placements.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">No placements yet</p>
          <button 
            onClick={() => openModal('placement')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Your First Placement
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Talent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {placements.map(placement => (
                <tr key={placement.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{placement.talentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{placement.clientName}</td>
                  <td className="px-6 py-4">{placement.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{placement.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                    {formatCurrency(placement.monthlyClientPayment * ((placement.feePercentage || 20) / 100))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      placement.status === 'active' ? 'bg-green-100 text-green-800' :
                      placement.status === 'transitioned' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {placement.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => openModal('placement', placement)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      disabled={loading}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete('placement', placement.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={loading}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Revenue Component
  const Revenue = () => (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Revenue</h2>
        <button 
          onClick={() => openModal('revenue')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
          disabled={loading}
        >
          <Plus size={20} /> Add Revenue
        </button>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <RefreshCw size={48} className="mx-auto text-gray-400 mb-4 animate-spin" />
          <p className="text-gray-500">Loading revenue...</p>
        </div>
      ) : revenues.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">No revenue recorded yet</p>
          <button 
            onClick={() => openModal('revenue')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Add Your First Revenue
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client/Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {revenues.map(revenue => (
                <tr key={revenue.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{revenue.type}</td>
                  <td className="px-6 py-4">{revenue.client || revenue.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{revenue.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-green-600">
                    {formatCurrency(revenue.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      revenue.status === 'paid' ? 'bg-green-100 text-green-800' :
                      revenue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {revenue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => openModal('revenue', revenue)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      disabled={loading}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete('revenue', revenue.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={loading}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Expenses Component
  const Expenses = () => (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Expenses</h2>
        <button 
          onClick={() => openModal('expense')}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700"
          disabled={loading}
        >
          <Plus size={20} /> Add Expense
        </button>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <RefreshCw size={48} className="mx-auto text-gray-400 mb-4 animate-spin" />
          <p className="text-gray-500">Loading expenses...</p>
        </div>
      ) : expenses.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">No expenses recorded yet</p>
          <button 
            onClick={() => openModal('expense')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Add Your First Expense
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expenses.map(expense => (
                <tr key={expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{expense.category}</td>
                  <td className="px-6 py-4">{expense.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-red-600">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => openModal('expense', expense)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      disabled={loading}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete('expense', expense.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={loading}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Modal Component with universal currency support
  const Modal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">
              {editingItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
            </h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700" disabled={loading}>
              <X size={24} />
            </button>
          </div>

          {modalType === 'placement' && (
            <form onSubmit={handleAddPlacement} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Talent Name *</label>
                  <input 
                    name="talentName" 
                    type="text" 
                    required 
                    defaultValue={editingItem?.talentName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                  <input 
                    name="clientName" 
                    type="text" 
                    required 
                    defaultValue={editingItem?.clientName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <input 
                  name="role" 
                  type="text" 
                  required 
                  defaultValue={editingItem?.role}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input 
                    name="startDate" 
                    type="date" 
                    required 
                    defaultValue={editingItem?.startDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select 
                    name="status" 
                    defaultValue={editingItem?.status || 'active'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="transitioned">Transitioned</option>
                    <option value="completed">Completed</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Client Payment ({getCurrencySymbol()}) *
                  </label>
                  <input 
                    name="monthlyClientPayment" 
                    type="number" 
                    step="0.01"
                    required 
                    defaultValue={editingItem?.monthlyClientPayment}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Talent Salary ({getCurrencySymbol()}) *
                  </label>
                  <input 
                    name="talentSalary" 
                    type="number" 
                    step="0.01"
                    required 
                    defaultValue={editingItem?.talentSalary}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Salary ({getCurrencySymbol()}) *
                  </label>
                  <input 
                    name="annualSalary" 
                    type="number" 
                    step="0.01"
                    required 
                    defaultValue={editingItem?.annualSalary}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee Percentage (%) *</label>
                  <input 
                    name="feePercentage" 
                    type="number" 
                    step="0.1"
                    min="0"
                    max="100"
                    defaultValue={editingItem?.feePercentage || 20}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Retention Bonus (%) *</label>
                  <input 
                    name="retentionBonusPercent" 
                    type="number" 
                    step="0.1"
                    min="0"
                    max="100"
                    defaultValue={editingItem?.retentionBonusPercent || 17.5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Months Completed</label>
                  <input 
                    name="monthsCompleted" 
                    type="number" 
                    min="0"
                    defaultValue={editingItem?.monthsCompleted || 0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input 
                  name="retentionBonusEligible" 
                  type="checkbox" 
                  defaultChecked={editingItem?.retentionBonusEligible !== false}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Retention Bonus Eligible
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : (editingItem ? 'Update' : 'Add') + ' Placement'}
                </button>
                <button 
                  type="button" 
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {modalType === 'revenue' && (
            <form onSubmit={handleAddRevenue} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select 
                    name="type" 
                    required 
                    defaultValue={editingItem?.type}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select type...</option>
                    <option value="Placement Fee">Placement Fee</option>
                    <option value="Retention Bonus">Retention Bonus</option>
                    <option value="Subscription">Subscription</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Training">Training</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select 
                    name="status" 
                    required 
                    defaultValue={editingItem?.status || 'pending'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="expected">Expected</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount ({getCurrencySymbol()}) *
                  </label>
                  <input 
                    name="amount" 
                    type="number" 
                    step="0.01"
                    required 
                    defaultValue={editingItem?.amount}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input 
                    name="date" 
                    type="date" 
                    required 
                    defaultValue={editingItem?.date}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <input 
                  name="client" 
                  type="text" 
                  defaultValue={editingItem?.client}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  name="description" 
                  rows="3"
                  defaultValue={editingItem?.description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select 
                    name="paymentMethod" 
                    defaultValue={editingItem?.paymentMethod}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select method...</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Check">Check</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Wire Transfer">Wire Transfer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                  <input 
                    name="referenceNumber" 
                    type="text" 
                    defaultValue={editingItem?.referenceNumber}
                    placeholder="e.g., Check #123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : (editingItem ? 'Update' : 'Add') + ' Revenue'}
                </button>
                <button 
                  type="button" 
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {modalType === 'expense' && (
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select 
                    name="category" 
                    required 
                    defaultValue={editingItem?.category}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select category...</option>
                    <option value="Personnel">Personnel</option>
                    <option value="Technology">Technology</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operational">Operational</option>
                    <option value="Legal">Legal</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input 
                    name="date" 
                    type="date" 
                    required 
                    defaultValue={editingItem?.date}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor/Payee</label>
                <input 
                  name="vendor" 
                  type="text" 
                  defaultValue={editingItem?.vendor}
                  placeholder="Who was this paid to?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea 
                  name="description" 
                  required 
                  rows="3"
                  defaultValue={editingItem?.description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ({getCurrencySymbol()}) *
                </label>
                <input 
                  name="amount" 
                  type="number" 
                  step="0.01"
                  required 
                  defaultValue={editingItem?.amount}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                  <select 
                    name="paymentMethod" 
                    required 
                    defaultValue={editingItem?.paymentMethod}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select method...</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Check">Check</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Wire Transfer">Wire Transfer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                  <input 
                    name="referenceNumber" 
                    type="text" 
                    defaultValue={editingItem?.referenceNumber}
                    placeholder="e.g., Check #123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : (editingItem ? 'Update' : 'Add') + ' Expense'}
                </button>
                <button 
                  type="button" 
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access the accounting system.</p>
          <p className="text-sm text-gray-500 mb-4">
            You need to be logged into the admin system first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">JuniorForge Accounting System</h1>
            <p className="text-blue-100 mt-1">Manage placements, revenue, and expenses</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-blue-700 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Currency:</label>
                <select 
                  value={currency}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  className="bg-blue-600 text-white border border-blue-500 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="USD">USD ($)</option>
                  <option value="NGN">NGN (₦)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              {currency !== 'USD' && (
                <div className="text-xs text-blue-200 mt-1 flex items-center gap-1">
                  <span>Rate: $1 = {currency === 'NGN' ? '₦' : '£'}{exchangeRates[currency]?.toFixed(2)}</span>
                  <button 
                    onClick={fetchExchangeRates}
                    disabled={loading}
                    className="hover:text-white"
                    title="Refresh exchange rates"
                  >
                    <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                  </button>
                </div>
              )}
              {lastUpdated && (
                <div className="text-xs text-blue-200 mt-1">
                  Updated: {new Date(lastUpdated).toLocaleTimeString()}
                </div>
              )}
            </div>
            <button 
              onClick={fetchData}
              disabled={loading}
              className="bg-blue-700 text-white p-2 rounded-lg hover:bg-blue-800 disabled:bg-blue-500"
              title="Refresh data"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {['dashboard', 'placements', 'revenue', 'expenses'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'placements' && <Placements />}
        {activeTab === 'revenue' && <Revenue />}
        {activeTab === 'expenses' && <Expenses />}
      </div>

      <Modal />
    </div>
  );
};

export default JuniorForgeAccounting;