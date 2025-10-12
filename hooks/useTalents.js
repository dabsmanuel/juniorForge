'use client'
import { useState, useEffect } from 'react';
import { talentApi } from '../lib/util';
import { useApi } from './useApi';

export const useTalent = (token) => {
  const { loading, error, executeAsync, clearError } = useApi();
  const [talents, setTalents] = useState([]);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 20
  });
  const [filters, setFilters] = useState({
    status: '',
    preferredRole: '',
    bootcamp: '',
    vetted: '',
    source: '',
    search: ''
  });

  // Fetch all talents with filters
  const fetchTalents = async (params = {}) => {
    try {
      const result = await executeAsync(() => 
        talentApi.getAllTalents(token, { ...filters, ...params })
      );
      setTalents(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      console.error('Error fetching talents:', err);
      throw err;
    }
  };

  // Fetch single talent
  const fetchTalentById = async (id) => {
    try {
      const result = await executeAsync(() => 
        talentApi.getTalentById(token, id)
      );
      setSelectedTalent(result.data);
      return result.data;
    } catch (err) {
      console.error('Error fetching talent:', err);
      throw err;
    }
  };

  // Create new talent
  const createTalent = async (formData) => {
    try {
      const result = await executeAsync(() => 
        talentApi.createTalent(token, formData)
      );
      // Refresh talent list after creation
      await fetchTalents();
      return result;
    } catch (err) {
      console.error('Error creating talent:', err);
      throw err;
    }
  };

  // Update talent
  const updateTalent = async (id, formData) => {
    try {
      const result = await executeAsync(() => 
        talentApi.updateTalent(token, id, formData)
      );
      // Update selected talent if it's the one being updated
      if (selectedTalent && selectedTalent._id === id) {
        setSelectedTalent(result.data);
      }
      // Refresh talent list
      await fetchTalents();
      return result;
    } catch (err) {
      console.error('Error updating talent:', err);
      throw err;
    }
  };

  // Delete talent
  const deleteTalent = async (id) => {
    try {
      const result = await executeAsync(() => 
        talentApi.deleteTalent(token, id)
      );
      // Clear selected talent if it was deleted
      if (selectedTalent && selectedTalent._id === id) {
        setSelectedTalent(null);
      }
      // Refresh talent list
      await fetchTalents();
      return result;
    } catch (err) {
      console.error('Error deleting talent:', err);
      throw err;
    }
  };

  // Vet talent
  const vetTalent = async (id, vettingData) => {
    try {
      const result = await executeAsync(() => 
        talentApi.vetTalent(token, id, vettingData)
      );
      // Update selected talent
      if (selectedTalent && selectedTalent._id === id) {
        setSelectedTalent(result.data);
      }
      // Refresh talent list
      await fetchTalents();
      return result;
    } catch (err) {
      console.error('Error vetting talent:', err);
      throw err;
    }
  };

  // Get talent statistics
  const fetchTalentStats = async () => {
    try {
      const result = await executeAsync(() => 
        talentApi.getTalentStats(token)
      );
      return result.data;
    } catch (err) {
      console.error('Error fetching talent stats:', err);
      throw err;
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: '',
      preferredRole: '',
      bootcamp: '',
      vetted: '',
      source: '',
      search: ''
    });
  };

  // Pagination handlers
  const goToPage = (page) => {
    fetchTalents({ page });
  };

  const nextPage = () => {
    if (pagination.page < pagination.pages) {
      goToPage(pagination.page + 1);
    }
  };

  const previousPage = () => {
    if (pagination.page > 1) {
      goToPage(pagination.page - 1);
    }
  };

  return {
    talents,
    selectedTalent,
    pagination,
    filters,
    loading,
    error,
    fetchTalents,
    fetchTalentById,
    createTalent,
    updateTalent,
    deleteTalent,
    vetTalent,
    fetchTalentStats,
    updateFilters,
    clearFilters,
    clearError,
    setSelectedTalent,
    goToPage,
    nextPage,
    previousPage
  };
};