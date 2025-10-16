'use client';
import React, { useState, useEffect } from 'react';
import { DollarSign, Users, TrendingUp, Calendar, Plus, FileText,  X, Edit, Trash2, RefreshCw, CheckCircle, AlertTriangle, BarChart2, FileDown, Clock, Printer, TrendingDown, Activity, DollarSignIcon, FileTextIcon } from 'lucide-react';
import { useAccounting } from '../../hooks/useAccounting';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const JuniorForgeAccounting = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({ USD: 1, NGN: 1600, GBP: 0.79 });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [equityGrants, setEquityGrants] = useState([]);
  const [placementAnalytics, setPlacementAnalytics] = useState(null);
  const [reports, setReports] = useState(null);
  const [reportType, setReportType] = useState('pl');
  const [reportStart, setReportStart] = useState('2025-01-01');
  const [reportEnd, setReportEnd] = useState(new Date().toISOString().split('T')[0]);
  const [exportFormat, setExportFormat] = useState('csv');
  const [analyticsStart, setAnalyticsStart] = useState('');
  const [analyticsEnd, setAnalyticsEnd] = useState('');
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
    getPlacementById: fetchPlacementByIdApi,
    transitionPlacement: transitionPlacementApi,
    terminatePlacement: terminatePlacementApi,
    generatePlacementRevenues: generatePlacementRevenuesApi,
    generateAllPlacementRevenues: generateAllPlacementRevenuesApi,
    getRevenues: fetchRevenuesApi,
    createRevenue: createRevenueApi,
    updateRevenue: updateRevenueApi,
    deleteRevenue: deleteRevenueApi,
    getRevenueById: fetchRevenueByIdApi,
    approveRevenue: approveRevenueApi,
    getExpenses: fetchExpensesApi,
    createExpense: createExpenseApi,
    updateExpense: updateExpenseApi,
    deleteExpense: deleteExpenseApi,
    getExpenseById: fetchExpenseByIdApi,
    approveExpense: approveExpenseApi,
    getEquityGrants: fetchEquityGrantsApi,
    createEquityGrant: createEquityGrantApi,
    updateEquityGrant: updateEquityGrantApi,
    deleteEquityGrant: deleteEquityGrantApi,
    getEquityGrantById: fetchEquityGrantByIdApi,
    completeEquityMilestone: completeEquityMilestoneApi,
    getPlacementAnalytics: fetchPlacementAnalyticsApi,
    getReports: fetchReportsApi,
    exportReport: exportReportApi,
    getExchangeRates: fetchExchangeRatesApi,
    getExchangeRate,
    convertCurrency
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

  // Re-fetch exchange rates when currency changes
  useEffect(() => {
    if (token) {
      fetchExchangeRates();
    }
  }, [currency, token]);

  const fetchData = async () => {
    if (!token) return;

    try {
      clearError();
      switch (activeTab) {
        case 'dashboard':
          await fetchDashboardStats();
          await fetchRecentActivity();
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
        case 'equity':
          await fetchEquityGrants();
          break;
        case 'analytics':
          await fetchPlacementAnalytics({ startDate: analyticsStart, endDate: analyticsEnd });
          break;
        case 'reports':
          // Reports fetched on demand
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchPlacements = async () => {
    const response = await fetchPlacementsApi();
    const data = response?.data || response?.placements || response || [];
    setPlacements(Array.isArray(data) ? data : []);
  };

  const fetchRevenues = async () => {
    const response = await fetchRevenuesApi();
    const data = response?.data || response?.revenues || response || [];
    setRevenues(Array.isArray(data) ? data : []);
  };

  const fetchExpenses = async () => {
    const response = await fetchExpensesApi();
    const data = response?.data || response?.expenses || response || [];
    setExpenses(Array.isArray(data) ? data : []);
  };

  const fetchDashboardStats = async () => {
    const response = await fetchDashboardStatsApi();
    const data = response?.data || response || {};
    setDashboardStats(data);
  };

  const fetchRecentActivity = async () => {
    const response = await fetchRecentActivityApi();
    const data = response?.data || response || [];
    setRecentActivity(Array.isArray(data) ? data : []);
  };

  const fetchEquityGrants = async () => {
    const response = await fetchEquityGrantsApi();
    const data = response?.data || response || [];
    setEquityGrants(Array.isArray(data) ? data : []);
  };

  const fetchPlacementAnalytics = async (params = {}) => {
    const response = await fetchPlacementAnalyticsApi(params);
    const data = response?.data || response || {};
    setPlacementAnalytics(data);
  };

  const fetchReports = async (params = {}) => {
    const response = await fetchReportsApi(params);
    const data = response?.data || response || {};
    setReports(data);
  };

  const handleExportReport = async () => {
  try {
    const params = { 
      type: reportType, 
      start: reportStart, 
      end: reportEnd, 
      format: exportFormat 
    };
    
    const response = await fetch(`${API_BASE}/accounting/reports/export?${new URLSearchParams(params)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (exportFormat === 'csv') {
      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `report-${reportType}-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      // Handle other formats
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
    }
  } catch (err) {
    console.error('Export failed:', err);
    setError('Failed to export report: ' + err.message);
  }
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

  // Convert amount amount from a given currency to USD
  const toUSD = (amount, fromCurrency) => {
    if (isNaN(amount) || amount === null || amount === undefined) return 0;
    return amount / exchangeRates[fromCurrency];
  };

  // Convert amount from USD to the target currency
  const fromUSD = (amount, toCurrency) => {
    if (isNaN(amount) || amount === null || amount === undefined) return 0;
    return amount * exchangeRates[toCurrency];
  };

  // Improved currency formatting that respects original amounts
  const formatCurrency = (amountInUSD, originalCurrency = null, originalAmount = null) => {
    if (originalCurrency && originalAmount !== null && originalCurrency === currency) {
      if (currency === 'NGN') {
        return `₦${originalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else if (currency === 'GBP') {
        return `£${originalAmount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      return `$${originalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    const converted = fromUSD(amountInUSD, currency);
    
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

  
  const handleCurrencyChange = async (newCurrency) => {
    setCurrency(newCurrency);
  };

  // Calculations - these now return raw numbers in USD for the formatCurrency function to handle
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
      monthlyClientPayment: toUSD(parseFloat(formData.get('monthlyClientPayment')), currency),
      talentSalary: toUSD(parseFloat(formData.get('talentSalary')), currency),
      annualSalary: toUSD(parseFloat(formData.get('annualSalary')), currency),
      feePercentage: parseFloat(formData.get('feePercentage')),
      retentionBonusPercent: parseFloat(formData.get('retentionBonusPercent')),
      status: formData.get('status') || 'active',
      monthsCompleted: parseInt(formData.get('monthsCompleted')) || 0,
      retentionBonusEligible: formData.get('retentionBonusEligible') === 'on'
    };

    try {
      clearError();
      if (editingItem) {
        await updatePlacementApi(editingItem._id || editingItem.id, placementData);
      } else {
        await createPlacementApi(placementData);
      }
      await fetchPlacements();
      closeModal();
    } catch (error) {
      console.error('Error saving placement:', error);
    }
  };

  const handleTransitionPlacement = async (id) => {
    if (!confirm('Are you sure you want to transition this placement?')) return;
    try {
      await transitionPlacementApi(id);
      await fetchPlacements();
    } catch (error) {
      console.error('Error transitioning placement:', error);
    }
  };

  const handleTerminatePlacement = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      reason: formData.get('reason'),
      endDate: formData.get('endDate')
    };
    try {
      await terminatePlacementApi(editingItem._id || editingItem.id, data);
      await fetchPlacements();
      closeModal();
    } catch (error) {
      console.error('Error terminating placement:', error);
    }
  };

  const handleGeneratePlacementRevenues = async (id) => {
    if (!confirm('Generate revenues for this placement?')) return;
    try {
      await generatePlacementRevenuesApi(id);
      await fetchPlacements();
      await fetchRevenues();
      await fetchDashboardStats();
    } catch (error) {
      console.error('Error generating revenues:', error);
    }
  };

  const handleGenerateAllPlacementRevenues = async () => {
    if (!confirm('Generate revenues for all active placements?')) return;
    try {
      await generateAllPlacementRevenuesApi();
      await fetchData();
    } catch (error) {
      console.error('Error generating all revenues:', error);
    }
  };

  const handleAddRevenue = async (e) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData(e.target);
  const revenueData = {
    type: formData.get('type'),
    amount: parseFloat(formData.get('amount')), // Store in USD for calculations
    originalAmount: parseFloat(formData.get('amount')), // Keep original
    originalCurrency: currency, // Store the currency when created
    currency: 'USD', // Always store calculated amounts in USD
    date: formData.get('date'),
    client: formData.get('client'),
    description: formData.get('description'),
    status: formData.get('status'),
    paymentMethod: formData.get('paymentMethod') || undefined,
    referenceNumber: formData.get('referenceNumber') || undefined
  };

  // Convert to USD for storage if not already in USD
  if (currency !== 'USD') {
    revenueData.amount = toUSD(revenueData.originalAmount, currency);
  }

    Object.keys(revenueData).forEach(key => 
      revenueData[key] === undefined && delete revenueData[key]
    );

    try {
      clearError();
      if (editingItem) {
        await updateRevenueApi(editingItem._id || editingItem.id, revenueData);
      } else {
        await createRevenueApi(revenueData);
      }
      await fetchRevenues();
      closeModal();
    } catch (error) {
      console.error('Error saving revenue:', error);
    }
  };

  const handleApproveRevenue = async (id) => {
    if (!confirm('Approve this revenue?')) return;
    try {
      await approveRevenueApi(id);
      await fetchRevenues();
    } catch (error) {
      console.error('Error approving revenue:', error);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData(e.target);
    const expenseData = {
      category: formData.get('category'),
      description: formData.get('description'),
      amount: toUSD(parseFloat(formData.get('amount')), currency),
      date: formData.get('date'),
      paymentMethod: formData.get('paymentMethod'),
      vendor: formData.get('vendor') || undefined,
      referenceNumber: formData.get('referenceNumber') || undefined
    };

    Object.keys(expenseData).forEach(key => 
      expenseData[key] === undefined && delete expenseData[key]
    );

    try {
      clearError();
      if (editingItem) {
        await updateExpenseApi(editingItem._id || editingItem.id, expenseData);
      } else {
        await createExpenseApi(expenseData);
      }
      await fetchExpenses();
      closeModal();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleApproveExpense = async (id) => {
    if (!confirm('Approve this expense?')) return;
    try {
      await approveExpenseApi(id);
      await fetchExpenses();
    } catch (error) {
      console.error('Error approving expense:', error);
    }
  };

  const handleAddEquityGrant = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const equityData = {
      placementId: formData.get('placementId'),
      recipient: formData.get('recipient'),
      percentage: parseFloat(formData.get('percentage')),
      grantDate: formData.get('grantDate'),
      vestingSchedule: formData.get('vestingSchedule'),
      milestone: formData.get('milestone'),
      estimatedValue: toUSD(parseFloat(formData.get('estimatedValue') || 0), currency)
    };

    try {
      if (editingItem) {
        await updateEquityGrantApi(editingItem._id || editingItem.id, equityData);
      } else {
        await createEquityGrantApi(equityData);
      }
      await fetchEquityGrants();
      closeModal();
    } catch (error) {
      console.error('Error saving equity grant:', error);
    }
  };

  const handleCompleteEquityMilestone = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      completionDate: formData.get('completionDate'),
      notes: formData.get('notes')
    };
    try {
      await completeEquityMilestoneApi(editingItem._id || editingItem.id, data);
      await fetchEquityGrants();
      closeModal();
    } catch (error) {
      console.error('Error completing milestone:', error);
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    if (!token) return;

    try {
      clearError();
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
        case 'equity':
          await deleteEquityGrantApi(id);
          await fetchEquityGrants();
          break;
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleGenerateReports = async () => {
    await fetchReports({ type: reportType, start: reportStart, end: reportEnd });
  };

  // Dashboard Component
  const Dashboard = () => (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      <button 
        onClick={handleGenerateAllPlacementRevenues}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
        disabled={loading}
      >
        <RefreshCw size={20} /> Generate All Revenues
      </button>
      
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
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No activity yet. Start by adding placements, revenue, or expenses.</p>
            ) : (
              recentActivity.map(r => (
                <div key={r._id || r.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium">{r.type} - {r.client}</p>
                    <p className="text-xs text-gray-500">{r.date}</p>
                  </div>
                  <span className={`font-bold ${r.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {formatCurrency(r.amount)}
                  </span>
                </div>
              ))
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
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Placements</h2>
        <div className="flex gap-2">
          <button 
            onClick={handleGenerateAllPlacementRevenues}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
            disabled={loading}
          >
            <RefreshCw size={20} /> Generate All
          </button>
          <button 
            onClick={() => openModal('placement')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            disabled={loading}
          >
            <Plus size={20} /> Add Placement
          </button>
        </div>
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
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Talent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Months</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {placements.map(placement => (
                <tr key={placement._id || placement.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{placement.talentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{placement.clientName}</td>
                  <td className="px-6 py-4">{placement.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{placement.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                    {formatCurrency(placement.monthlyClientPayment * ((placement.feePercentage || 20) / 100))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{placement.monthsCompleted}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      placement.status === 'active' ? 'bg-green-100 text-green-800' :
                      placement.status === 'transitioned' ? 'bg-blue-100 text-blue-800' :
                      placement.status === 'terminated' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {placement.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <button 
                      onClick={() => openModal('placement', placement)}
                      className="text-blue-600 hover:text-blue-800"
                      disabled={loading}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete('placement', placement._id || placement.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={loading}
                    >
                      <Trash2 size={18} />
                    </button>
                    {placement.status === 'active' && placement.monthsCompleted >= 6 && (
                      <button 
                        onClick={() => handleTransitionPlacement(placement._id || placement.id)}
                        className="text-purple-600 hover:text-purple-800"
                        disabled={loading}
                      >
                        <CheckCircle size={18} /> Transition
                      </button>
                    )}
                    {placement.status !== 'terminated' && (
                      <button 
                        onClick={() => openModal('terminate', placement)}
                        className="text-orange-600 hover:text-orange-800"
                        disabled={loading}
                      >
                        <AlertTriangle size={18} /> Terminate
                      </button>
                    )}
                    <button 
                      onClick={() => handleGeneratePlacementRevenues(placement._id || placement.id)}
                      className="text-green-600 hover:text-green-800"
                      disabled={loading}
                    >
                      <RefreshCw size={18} /> Generate
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
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client/Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {revenues.map(revenue => (
                <tr key={revenue._id || revenue.id}>
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
                    {revenue.approvedBy ? <CheckCircle size={18} className="text-green-600" /> : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <button 
                      onClick={() => openModal('revenue', revenue)}
                      className="text-blue-600 hover:text-blue-800"
                      disabled={loading}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete('revenue', revenue._id || revenue.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={loading}
                    >
                      <Trash2 size={18} />
                    </button>
                    {!revenue.approvedBy && (
                      <button 
                        onClick={() => handleApproveRevenue(revenue._id || revenue.id)}
                        className="text-green-600 hover:text-green-800"
                        disabled={loading}
                      >
                        <CheckCircle size={18} /> Approve
                      </button>
                    )}
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
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expenses.map(expense => (
                <tr key={expense._id || expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{expense.category}</td>
                  <td className="px-6 py-4">{expense.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-red-600">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {expense.approvedBy ? <CheckCircle size={18} className="text-green-600" /> : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <button 
                      onClick={() => openModal('expense', expense)}
                      className="text-blue-600 hover:text-blue-800"
                      disabled={loading}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete('expense', expense._id || expense.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={loading}
                    >
                      <Trash2 size={18} />
                    </button>
                    {!expense.approvedBy && (
                      <button 
                        onClick={() => handleApproveExpense(expense._id || expense.id)}
                        className="text-green-600 hover:text-green-800"
                        disabled={loading}
                      >
                        <CheckCircle size={18} /> Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Equity Grants Component
  const Equity = () => (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Equity Grants</h2>
        <button 
          onClick={() => openModal('equity')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
          disabled={loading}
        >
          <Plus size={20} /> Add Equity Grant
        </button>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <RefreshCw size={48} className="mx-auto text-gray-400 mb-4 animate-spin" />
          <p className="text-gray-500">Loading equity grants...</p>
        </div>
      ) : equityGrants.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">No equity grants yet</p>
          <button 
            onClick={() => openModal('equity')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Add Your First Equity Grant
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Talent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grant Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {equityGrants.map(grant => (
                <tr key={grant._id || grant.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{grant.placementId?.talentName || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{grant.placementId?.clientName || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{grant.recipient}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{grant.percentage}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">{grant.grantDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      grant.status === 'granted' ? 'bg-blue-100 text-blue-800' :
                      grant.status === 'vested' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {grant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <button 
                      onClick={() => openModal('equity', grant)}
                      className="text-blue-600 hover:text-blue-800"
                      disabled={loading}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete('equity', grant._id || grant.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={loading}
                    >
                      <Trash2 size={18} />
                    </button>
                    {!grant.milestoneCompleted && grant.milestone && (
                      <button 
                        onClick={() => openModal('completeMilestone', grant)}
                        className="text-green-600 hover:text-green-800"
                        disabled={loading}
                      >
                        <CheckCircle size={18} /> Complete Milestone
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Analytics Component
  const Analytics = () => {
    const [chartData, setChartData] = useState([]);

    // Process analytics data for charts
    useEffect(() => {
      if (placementAnalytics) {
        // Revenue by type chart data
        const revenueByType = revenues.reduce((acc, revenue) => {
          const type = revenue.type;
          if (!acc[type]) acc[type] = 0;
          acc[type] += revenue.amount;
          return acc;
        }, {});
        
        setChartData(Object.entries(revenueByType).map(([type, amount]) => ({
          name: type,
          value: amount
        })));
      }
    }, [placementAnalytics, revenues]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        
        {/* Date Filter */}
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={(e) => { e.preventDefault(); fetchPlacementAnalytics({ startDate: analyticsStart, endDate: analyticsEnd }); }} 
                className="flex flex-col sm:flex-row gap-4 mb-6">
            <input 
              type="date" 
              value={analyticsStart}
              onChange={(e) => setAnalyticsStart(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Start Date"
            />
            <input 
              type="date" 
              value={analyticsEnd}
              onChange={(e) => setAnalyticsEnd(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="End Date"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <BarChart2 size={20} /> Refresh Analytics
            </button>
          </form>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw size={32} className="animate-spin text-gray-400" />
            </div>
          ) : placementAnalytics ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue by Type Pie Chart */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-4 text-center">Revenue by Type</h3>
                <PieChart width={400} height={300}>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
                </PieChart>
              </div>

              {/* Placements by Status */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-4 text-center">Placements by Status</h3>
                <BarChart width={400} height={300} data={placementAnalytics.byStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </div>

              {/* Key Metrics */}
              <div className="col-span-1 lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-blue-600">Total Revenue</p>
                  <p className="text-xl font-bold">{formatCurrency(calculateTotalRevenue())}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-green-600">Active Placements</p>
                  <p className="text-xl font-bold">{getActivePlacements()}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-purple-600">Retention Rate</p>
                  <p className="text-xl font-bold">{placementAnalytics.retentionRate}%</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-orange-600">Avg Transition</p>
                  <p className="text-xl font-bold">{Math.round(placementAnalytics.avgTimeToTransition)} days</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Select dates and refresh to view analytics.</p>
          )}
        </div>
      </div>
    );
  };

const Reports = () => {
  const [generatedReport, setGeneratedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [reportType, setReportType] = useState('pl');
  const [error, setError] = useState(null);
  const [reportStart, setReportStart] = useState('2024-01-01');
  const [reportEnd, setReportEnd] = useState(new Date().toISOString().split('T')[0]);

  const { 
    loading,
    error: hookError,
    getReports,
    exportReport,
    clearError
  } = useAccounting(token);

  const handleGenerateReports = async () => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    setIsGenerating(true);
    setError(null);
    clearError?.();
    
    try {
      const params = { 
        type: reportType, 
        start: reportStart, 
        end: reportEnd 
      };
      
      console.log('Generating report with params:', params);
      
      const response = await getReports(params);
      
      console.log('Full report response:', response);
      
      if (response && response.success && response.data) {
        setGeneratedReport(response.data);
      } else if (response && response.data) {
        setGeneratedReport(response.data);
      } else {
        throw new Error('Invalid response structure from server');
      }
    } catch (err) {
      console.error('Report generation failed:', err);
      setError(`Failed to generate report: ${err.message}`);
      setGeneratedReport(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const API_BASE = "http://juniorforge.onrender.com/api"; 
  const handleExportReport = async () => {
  if (!generatedReport) {
    setError('Please generate a report first');
    return;
  }

  try {
    const params = { 
      type: reportType, 
      start: reportStart, 
      end: reportEnd,
      format: exportFormat 
    };
    
    // For CSV, handle the file download
    if (exportFormat === 'csv') {
      const response = await fetch(`${API_BASE}/accounting/reports/export?${new URLSearchParams(params)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Export failed');
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `financial-report-${reportType}-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      // For other formats, use the existing API call
      await exportReport(params);
      // Show success message for PDF/XLSX (when implemented)
      setError('Export completed successfully!');
    }
  } catch (err) {
    console.error('Export failed:', err);
    setError(`Export failed: ${err.message}`);
  }
};

  // Helper function to format numbers with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num || 0);
  };

  // Helper function to calculate percentages
  const calculatePercentage = (part, total) => {
    if (!total || total === 0) return '0%';
    return `${((part / total) * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle size={20} className="mr-2" />
            {error}
          </div>
        </div>
      )}
      
      {hookError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle size={20} className="mr-2" />
            {hookError}
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Reports</h2>
          <p className="text-gray-600 mt-1">Generate comprehensive financial reports and analytics</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={16} />
          <span>Report Period: {reportStart} to {reportEnd}</span>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        {/* Report Controls */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pl">Profit & Loss Statement</option>
              <option value="cashflow">Cash Flow Statement</option>
              <option value="balance">Balance Sheet</option>
              <option value="revenue">Revenue Analysis</option>
              <option value="expense">Expense Analysis</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input 
              type="date" 
              value={reportStart}
              onChange={(e) => setReportStart(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input 
              type="date" 
              value={reportEnd}
              onChange={(e) => setReportEnd(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <select 
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="csv">CSV Format</option>
              <option value="pdf">PDF Document</option>
              <option value="xlsx">Excel Workbook</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={handleGenerateReports} 
              disabled={isGenerating || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 justify-center hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 transition-all duration-200 shadow-md"
            >
              {(isGenerating || loading) ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <BarChart2 size={20} />
              )}
              {(isGenerating || loading) ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>

        {/* Report Display */}
        {generatedReport ? (
          <div className="border-2 border-gray-200 rounded-xl bg-white overflow-hidden">
            {/* Report Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{generatedReport.type}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{generatedReport.period}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>Generated: {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleExportReport}
                    disabled={!generatedReport || loading}
                    className="bg-green-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:bg-gray-400 transition-colors shadow-md"
                  >
                    <FileDown size={18} /> Export {exportFormat.toUpperCase()}
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="bg-gray-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors shadow-md"
                  >
                    <Printer size={18} /> Print
                  </button>
                </div>
              </div>
            </div>

            {/* Profit & Loss Report */}
            {reportType === 'pl' && (
              <div className="p-6 space-y-8">
                {/* Executive Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-700 mt-1">
                          {formatCurrency(generatedReport.totals?.totalRevenue || 0)}
                        </p>
                      </div>
                      <TrendingUp className="text-green-600" size={32} />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-600">Total Expenses</p>
                        <p className="text-2xl font-bold text-red-700 mt-1">
                          {formatCurrency(generatedReport.totals?.totalExpenses || 0)}
                        </p>
                      </div>
                      <TrendingDown className="text-red-600" size={32} />
                    </div>
                  </div>
                  
                  <div className={`p-6 rounded-xl border ${
                    (generatedReport.totals?.grossProfit || 0) >= 0 
                      ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' 
                      : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${
                          (generatedReport.totals?.grossProfit || 0) >= 0 ? 'text-blue-600' : 'text-orange-600'
                        }`}>
                          Gross Profit
                        </p>
                        <p className={`text-2xl font-bold mt-1 ${
                          (generatedReport.totals?.grossProfit || 0) >= 0 ? 'text-blue-700' : 'text-orange-700'
                        }`}>
                          {formatCurrency(generatedReport.totals?.grossProfit || 0)}
                        </p>
                      </div>
                      <Activity className={
                        (generatedReport.totals?.grossProfit || 0) >= 0 ? 'text-blue-600' : 'text-orange-600'
                      } size={32} />
                    </div>
                  </div>
                  
                  <div className={`p-6 rounded-xl border ${
                    (generatedReport.totals?.netProfit || 0) >= 0 
                      ? 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200' 
                      : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${
                          (generatedReport.totals?.netProfit || 0) >= 0 ? 'text-purple-600' : 'text-orange-600'
                        }`}>
                          Net Profit
                        </p>
                        <p className={`text-2xl font-bold mt-1 ${
                          (generatedReport.totals?.netProfit || 0) >= 0 ? 'text-purple-700' : 'text-orange-700'
                        }`}>
                          {formatCurrency(generatedReport.totals?.netProfit || 0)}
                        </p>
                        <p className={`text-xs mt-1 ${
                          (generatedReport.totals?.netProfit || 0) >= 0 ? 'text-purple-600' : 'text-orange-600'
                        }`}>
                          Margin: {calculatePercentage(generatedReport.totals?.netProfit || 0, generatedReport.totals?.totalRevenue || 1)}
                        </p>
                      </div>
                      <DollarSignIcon className={
                        (generatedReport.totals?.netProfit || 0) >= 0 ? 'text-purple-600' : 'text-orange-600'
                      } size={32} />
                    </div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Revenue Details */}
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-green-50 px-6 py-4 border-b border-green-200">
                      <h4 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                        <TrendingUp size={20} />
                        Revenue Breakdown
                      </h4>
                    </div>
                    <div className="p-6">
                      {generatedReport.revenues && generatedReport.revenues.length > 0 ? (
                        <div className="space-y-4">
                          {generatedReport.revenues.map((revenue, index) => (
                            <div key={revenue._id || index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 capitalize">{revenue._id}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {calculatePercentage(revenue.total, generatedReport.totals?.totalRevenue)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-green-600 text-lg">
                                  {formatCurrency(revenue.total)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <FileTextIcon size={48} className="mx-auto mb-3 opacity-50" />
                          <p className="text-lg">No revenue data available</p>
                          <p className="text-sm mt-1">for the selected period</p>
                        </div>
                      )}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900 text-lg">Total Revenue</span>
                          <span className="font-bold text-green-600 text-xl">
                            {formatCurrency(generatedReport.totals?.totalRevenue || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expense Details */}
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-red-50 px-6 py-4 border-b border-red-200">
                      <h4 className="text-lg font-semibold text-red-800 flex items-center gap-2">
                        <TrendingDown size={20} />
                        Expense Breakdown
                      </h4>
                    </div>
                    <div className="p-6">
                      {generatedReport.expenses && generatedReport.expenses.length > 0 ? (
                        <div className="space-y-4">
                          {generatedReport.expenses.map((expense, index) => (
                            <div key={expense._id || index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 capitalize">{expense._id}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {calculatePercentage(expense.total, generatedReport.totals?.totalExpenses)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-red-600 text-lg">
                                  {formatCurrency(expense.total)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <FileTextIcon size={48} className="mx-auto mb-3 opacity-50" />
                          <p className="text-lg">No expense data available</p>
                          <p className="text-sm mt-1">for the selected period</p>
                        </div>
                      )}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900 text-lg">Total Expenses</span>
                          <span className="font-bold text-red-600 text-xl">
                            {formatCurrency(generatedReport.totals?.totalExpenses || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profitability Analysis */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <BarChart2 size={20} />
                    Profitability Analysis
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-blue-600 font-medium">Gross Profit Margin</p>
                      <p className={`text-2xl font-bold mt-1 ${
                        (generatedReport.totals?.grossProfit || 0) >= 0 ? 'text-blue-700' : 'text-orange-600'
                      }`}>
                        {calculatePercentage(generatedReport.totals?.grossProfit || 0, generatedReport.totals?.totalRevenue || 1)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-600 font-medium">Net Profit Margin</p>
                      <p className={`text-2xl font-bold mt-1 ${
                        (generatedReport.totals?.netProfit || 0) >= 0 ? 'text-purple-700' : 'text-orange-600'
                      }`}>
                        {calculatePercentage(generatedReport.totals?.netProfit || 0, generatedReport.totals?.totalRevenue || 1)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-600 font-medium">Expense Ratio</p>
                      <p className="text-2xl font-bold text-red-700 mt-1">
                        {calculatePercentage(generatedReport.totals?.totalExpenses || 0, generatedReport.totals?.totalRevenue || 1)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cash Flow Report */}
            {reportType === 'cashflow' && (
              <div className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 text-center">
                    <DollarSign className="mx-auto text-green-600 mb-3" size={40} />
                    <p className="text-sm font-medium text-green-600">Cash Inflows</p>
                    <p className="text-3xl font-bold text-green-700 mt-2">
                      {formatCurrency(generatedReport.inflows || 0)}
                    </p>
                    <p className="text-xs text-green-600 mt-2">Operating Activities</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200 text-center">
                    <TrendingDown className="mx-auto text-red-600 mb-3" size={40} />
                    <p className="text-sm font-medium text-red-600">Cash Outflows</p>
                    <p className="text-3xl font-bold text-red-700 mt-2">
                      {formatCurrency(generatedReport.outflows || 0)}
                    </p>
                    <p className="text-xs text-red-600 mt-2">Operating Activities</p>
                  </div>
                  
                  <div className={`p-6 rounded-xl border text-center ${
                    (generatedReport.netCash || 0) >= 0 
                      ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' 
                      : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'
                  }`}>
                    <Activity className={`mx-auto mb-3 ${
                      (generatedReport.netCash || 0) >= 0 ? 'text-blue-600' : 'text-orange-600'
                    }`} size={40} />
                    <p className={`text-sm font-medium ${
                      (generatedReport.netCash || 0) >= 0 ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      Net Cash Flow
                    </p>
                    <p className={`text-3xl font-bold mt-2 ${
                      (generatedReport.netCash || 0) >= 0 ? 'text-blue-700' : 'text-orange-700'
                    }`}>
                      {formatCurrency(generatedReport.netCash || 0)}
                    </p>
                    <p className={`text-xs mt-2 ${
                      (generatedReport.netCash || 0) >= 0 ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      {(generatedReport.netCash || 0) >= 0 ? 'Positive' : 'Negative'} Cash Position
                    </p>
                  </div>
                </div>

                {/* Cash Flow Details */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Cash Flow Details</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Cash from Operations</span>
                      <span className="font-semibold text-green-600">{formatCurrency(generatedReport.inflows || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Cash used in Operations</span>
                      <span className="font-semibold text-red-600">{formatCurrency(generatedReport.outflows || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 font-bold">
                      <span className="text-gray-900">Net Cash from Operations</span>
                      <span className={`${
                        (generatedReport.netCash || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(generatedReport.netCash || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Balance Sheet Report */}
            {reportType === 'balance' && (
              <div className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 text-center">
                    <Wallet className="mx-auto text-green-600 mb-3" size={40} />
                    <p className="text-sm font-medium text-green-600">Total Assets</p>
                    <p className="text-3xl font-bold text-green-700 mt-2">
                      {formatCurrency(generatedReport.assets?.totalAssets || 0)}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200 text-center">
                    <Scale className="mx-auto text-red-600 mb-3" size={40} />
                    <p className="text-sm font-medium text-red-600">Total Liabilities</p>
                    <p className="text-3xl font-bold text-red-700 mt-2">
                      {formatCurrency(generatedReport.liabilities?.totalLiabilities || 0)}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 text-center">
                    <Users className="mx-auto text-blue-600 mb-3" size={40} />
                    <p className="text-sm font-medium text-blue-600">Owner's Equity</p>
                    <p className="text-3xl font-bold text-blue-700 mt-2">
                      {formatCurrency(generatedReport.equity || 0)}
                    </p>
                  </div>
                </div>

                {/* Balance Sheet Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Assets */}
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-green-50 px-6 py-4 border-b border-green-200">
                      <h4 className="text-lg font-semibold text-green-800">Assets</h4>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700">Cash & Equivalents</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(generatedReport.assets?.cash || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700">Accounts Receivable</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(generatedReport.assets?.accountsReceivable || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-t border-gray-200 font-bold">
                        <span className="text-gray-900">Total Assets</span>
                        <span className="text-green-600">{formatCurrency(generatedReport.assets?.totalAssets || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Liabilities & Equity */}
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-red-50 px-6 py-4 border-b border-red-200">
                      <h4 className="text-lg font-semibold text-red-800">Liabilities & Equity</h4>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700">Total Liabilities</span>
                        <span className="font-semibold text-red-600">{formatCurrency(generatedReport.liabilities?.totalLiabilities || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700">Owner's Equity</span>
                        <span className="font-semibold text-blue-600">{formatCurrency(generatedReport.equity || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-t border-gray-200 font-bold">
                        <span className="text-gray-900">Total Liabilities & Equity</span>
                        <span className="text-gray-900">
                          {formatCurrency(
                            (generatedReport.liabilities?.totalLiabilities || 0) + 
                            (generatedReport.equity || 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
            <BarChart2 size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Report Generated</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Select your report parameters and click "Generate Report" to create a comprehensive financial analysis.
            </p>
            <div className="flex justify-center gap-3">
              <FileText size={20} className="text-gray-400" />
              <TrendingUp size={20} className="text-gray-400" />
              <PieChart size={20} className="text-gray-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

  // Modal Component
  const Modal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">
              {modalType === 'terminate' ? 'Terminate Placement' :
               modalType === 'completeMilestone' ? 'Complete Milestone' :
               editingItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
            </h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700" disabled={loading}>
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {modalType === 'placement' && (
            <form onSubmit={handleAddPlacement} className="space-y-4">
              {/* ... existing placement form ... */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input 
                    name="startDate" 
                    type="date" 
                    required 
                    defaultValue={editingItem?.startDate?.split('T')[0]}
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Client Payment ({getCurrencySymbol()}) *
                  </label>
                  <input 
                    name="monthlyClientPayment" 
                    type="number" 
                    step="0.01"
                    required 
                    defaultValue={editingItem ? fromUSD(editingItem.monthlyClientPayment, currency) : ''}
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
                    defaultValue={editingItem ? fromUSD(editingItem.talentSalary, currency) : ''}
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
                    defaultValue={editingItem ? fromUSD(editingItem.annualSalary, currency) : ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
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

          {modalType === 'terminate' && (
            <form onSubmit={handleTerminatePlacement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                <input 
                  name="endDate" 
                  type="date" 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea 
                  name="reason" 
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                >
                  Terminate
                </button>
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {modalType === 'revenue' && (
            <form onSubmit={handleAddRevenue} className="space-y-4">
              {/* ... existing revenue form ... */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount ({getCurrencySymbol()}) *
                  </label>
                  <input 
                    name="amount" 
                    type="number" 
                    step="0.01"
                    required 
                    defaultValue={editingItem ? fromUSD(editingItem.amount, currency) : ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input 
                    name="date" 
                    type="date" 
                    required 
                    defaultValue={editingItem?.date?.split('T')[0]}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
              {/* ... existing expense form ... */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    defaultValue={editingItem?.date?.split('T')[0]}
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
                  defaultValue={editingItem ? fromUSD(editingItem.amount, currency) : ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
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

          {modalType === 'equity' && (
            <form onSubmit={handleAddEquityGrant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Placement *</label>
                <select 
                  name="placementId" 
                  required 
                  defaultValue={editingItem?.placementId?._id || editingItem?.placementId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select placement...</option>
                  {placements.map(p => (
                    <option key={p._id || p.id} value={p._id || p.id}>
                      {p.clientName} - {p.talentName} ({p.role})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient *</label>
                <select 
                  name="recipient" 
                  required 
                  defaultValue={editingItem?.recipient}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select recipient...</option>
                  <option value="talent">Talent</option>
                  <option value="juniorforge">JuniorForge</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Percentage (%) *</label>
                  <input 
                    name="percentage" 
                    type="number" 
                    step="0.01"
                    min="0"
                    max="5"
                    required 
                    defaultValue={editingItem?.percentage}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grant Date *</label>
                  <input 
                    name="grantDate" 
                    type="date" 
                    required 
                    defaultValue={editingItem?.grantDate?.split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vesting Schedule *</label>
                <input 
                  name="vestingSchedule" 
                  type="text" 
                  required 
                  defaultValue={editingItem?.vestingSchedule}
                  placeholder="e.g., 25% per year over 4 years"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Milestone</label>
                <input 
                  name="milestone" 
                  type="text" 
                  defaultValue={editingItem?.milestone}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Value ({getCurrencySymbol()})
                </label>
                <input 
                  name="estimatedValue" 
                  type="number" 
                  step="0.01"
                  defaultValue={editingItem ? fromUSD(editingItem.estimatedValue, currency) : ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  {editingItem ? 'Update' : 'Add'} Equity Grant
                </button>
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {modalType === 'completeMilestone' && (
            <form onSubmit={handleCompleteEquityMilestone} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Completion Date *</label>
                <input 
                  name="completionDate" 
                  type="date" 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea 
                  name="notes" 
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Complete Milestone
                </button>
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
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
      <div className="bg-[#685EFC] text-white p-4 sm:p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">JuniorForge Accounting System</h1>
            <p className="text-blue-100 mt-1">Manage placements, revenue, and expenses</p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="bg-[#16252D] px-3 sm:px-4 py-2 rounded-lg flex-1 sm:flex-none">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <label className="text-sm font-medium">Currency:</label>
                <select 
                  value={currency}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  className="bg-[#685EFC] text-white border border-blue-500 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
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
              className="bg-[#16252D] text-white p-2 rounded-lg hover:bg-blue-800 disabled:bg-blue-500"
              title="Refresh data"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto">
            {['dashboard', 'placements', 'revenue', 'expenses', 'equity', 'analytics', 'reports'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
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

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'placements' && <Placements />}
        {activeTab === 'revenue' && <Revenue />}
        {activeTab === 'expenses' && <Expenses />}
        {activeTab === 'equity' && <Equity />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'reports' && <Reports />}
      </div>

      <Modal />
    </div>
  );
};

export default JuniorForgeAccounting;