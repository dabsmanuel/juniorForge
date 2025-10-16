'use client'
import { useState, useCallback } from 'react';
import { accountingApi, handleApiError } from '../lib/util';

export const useAccounting = (token) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = () => setError(null);

  // Dashboard Stats
  const getDashboardStats = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.getDashboardStats(token, params);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getRecentActivity = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.getRecentActivity(token, params);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Placements
  const getPlacements = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.getPlacements(token, params);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createPlacement = useCallback(async (placementData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.createPlacement(token, placementData);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updatePlacement = useCallback(async (id, placementData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.updatePlacement(token, id, placementData);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const deletePlacement = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.deletePlacement(token, id);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getPlacementById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.getPlacementById(token, id);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const transitionPlacement = useCallback(async (id, body = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.transitionPlacement(token, id, body);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const terminatePlacement = useCallback(async (id, body = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.terminatePlacement(token, id, body);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const generatePlacementRevenues = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.generatePlacementRevenues(token, id);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const generateAllPlacementRevenues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.generateAllPlacementRevenues(token);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Revenues
  const getRevenues = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.getRevenues(token, params);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createRevenue = useCallback(async (revenueData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.createRevenue(token, revenueData);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateRevenue = useCallback(async (id, revenueData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.updateRevenue(token, id, revenueData);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const deleteRevenue = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.deleteRevenue(token, id);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getRevenueById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.getRevenueById(token, id);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const approveRevenue = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.approveRevenue(token, id);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Expenses
  const getExpenses = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.getExpenses(token, params);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createExpense = useCallback(async (expenseData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.createExpense(token, expenseData);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateExpense = useCallback(async (id, expenseData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.updateExpense(token, id, expenseData);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const deleteExpense = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.deleteExpense(token, id);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getExpenseById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.getExpenseById(token, id);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const approveExpense = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.approveExpense(token, id);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Equity Grants
  const getEquityGrants = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.getEquityGrants(token, params);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createEquityGrant = useCallback(async (equityData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.createEquityGrant(token, equityData);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateEquityGrant = useCallback(async (id, equityData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.updateEquityGrant(token, id, equityData);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const deleteEquityGrant = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.deleteEquityGrant(token, id);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getEquityGrantById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.getEquityGrantById(token, id);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const completeEquityMilestone = useCallback(async (id, body = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.completeEquityMilestone(token, id, body);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Analytics
  const getPlacementAnalytics = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.getPlacementAnalytics(token, params);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Reports
  // In your useAccounting hook, update getReports function
const getReports = useCallback(async (params = {}) => {
  setLoading(true);
  setError(null);
  try {
    console.log('Fetching reports with params:', params);
    const data = await accountingApi.getReports(token, params);
    console.log('Reports API response:', data);
    return data;
  } catch (err) {
    console.error('Reports API error:', err);
    const errorMessage = handleApiError(err);
    setError(errorMessage);
    throw err;
  } finally {
    setLoading(false);
  }
}, [token]);

  const exportReport = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.exportReport(token, params);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Currency - FIXED
  const getExchangeRates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.getExchangeRates(token);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getExchangeRate = useCallback(async (from, to) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.getExchangeRate(token, from, to);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const convertCurrency = useCallback(async (amount, from, to) => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountingApi.convertCurrency(token, amount, from, to);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    loading,
    error,
    clearError,
    // Dashboard
    getDashboardStats,
    getRecentActivity,
    // Placements
    getPlacements,
    createPlacement,
    updatePlacement,
    deletePlacement,
    getPlacementById,
    transitionPlacement,
    terminatePlacement,
    generatePlacementRevenues,
    generateAllPlacementRevenues,
    // Revenues
    getRevenues,
    createRevenue,
    updateRevenue,
    deleteRevenue,
    getRevenueById,
    approveRevenue,
    // Expenses
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenseById,
    approveExpense,
    // Equity Grants
    getEquityGrants,
    createEquityGrant,
    updateEquityGrant,
    deleteEquityGrant,
    getEquityGrantById,
    completeEquityMilestone,
    // Analytics
    getPlacementAnalytics,
    // Reports
    getReports,
    exportReport,
    // Currency - FIXED
    getExchangeRates,
    getExchangeRate,
    convertCurrency,
  };
};