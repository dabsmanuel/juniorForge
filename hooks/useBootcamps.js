'use client'
import { useState } from 'react';
import { bootcampApi } from '../lib/util';
import { useApi } from './useApi';

export const useBootcamp = (token) => {
  const { loading, error, executeAsync, clearError } = useApi();
  const [bootcamps, setBootcamps] = useState([]);
  const [selectedBootcamp, setSelectedBootcamp] = useState(null);
  const [bootcampTalents, setBootcampTalents] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 20
  });
  const [filters, setFilters] = useState({
    type: '',
    partnershipStatus: '',
    status: '',
    search: ''
  });

  // Fetch all bootcamps with filters
  const fetchBootcamps = async (params = {}) => {
    try {
      const result = await executeAsync(() => 
        bootcampApi.getAllBootcamps(token, { ...filters, ...params })
      );
      setBootcamps(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      console.error('Error fetching bootcamps:', err);
      throw err;
    }
  };

  // Fetch single bootcamp
  const fetchBootcampById = async (id) => {
    try {
      const result = await executeAsync(() => 
        bootcampApi.getBootcampById(token, id)
      );
      setSelectedBootcamp(result.data);
      return result.data;
    } catch (err) {
      console.error('Error fetching bootcamp:', err);
      throw err;
    }
  };

  // Create new bootcamp
  const createBootcamp = async (bootcampData) => {
    try {
      const result = await executeAsync(() => 
        bootcampApi.createBootcamp(token, bootcampData)
      );
      // Refresh bootcamp list after creation
      await fetchBootcamps();
      return result;
    } catch (err) {
      console.error('Error creating bootcamp:', err);
      throw err;
    }
  };

  // Update bootcamp
  const updateBootcamp = async (id, bootcampData) => {
    try {
      const result = await executeAsync(() => 
        bootcampApi.updateBootcamp(token, id, bootcampData)
      );
      // Update selected bootcamp if it's the one being updated
      if (selectedBootcamp && selectedBootcamp._id === id) {
        setSelectedBootcamp(result.data);
      }
      // Refresh bootcamp list
      await fetchBootcamps();
      return result;
    } catch (err) {
      console.error('Error updating bootcamp:', err);
      throw err;
    }
  };

  // Delete bootcamp
  const deleteBootcamp = async (id) => {
    try {
      const result = await executeAsync(() => 
        bootcampApi.deleteBootcamp(token, id)
      );
      // Clear selected bootcamp if it was deleted
      if (selectedBootcamp && selectedBootcamp._id === id) {
        setSelectedBootcamp(null);
      }
      // Refresh bootcamp list
      await fetchBootcamps();
      return result;
    } catch (err) {
      console.error('Error deleting bootcamp:', err);
      throw err;
    }
  };

  // Get bootcamp talents
  const fetchBootcampTalents = async (bootcampId, params = {}) => {
    try {
      const result = await executeAsync(() => 
        bootcampApi.getBootcampTalents(token, bootcampId, params)
      );
      setBootcampTalents(result.data);
      return result;
    } catch (err) {
      console.error('Error fetching bootcamp talents:', err);
      throw err;
    }
  };

  // Update bootcamp statistics
  const updateBootcampStats = async (id) => {
    try {
      const result = await executeAsync(() => 
        bootcampApi.updateBootcampStatistics(token, id)
      );
      // Update selected bootcamp with new stats
      if (selectedBootcamp && selectedBootcamp._id === id) {
        setSelectedBootcamp(result.data);
      }
      return result;
    } catch (err) {
      console.error('Error updating bootcamp stats:', err);
      throw err;
    }
  };

  // Get bootcamp statistics
  const fetchBootcampStats = async () => {
    try {
      const result = await executeAsync(() => 
        bootcampApi.getBootcampStats(token)
      );
      return result.data;
    } catch (err) {
      console.error('Error fetching bootcamp stats:', err);
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
      type: '',
      partnershipStatus: '',
      status: '',
      search: ''
    });
  };

  // Pagination handlers
  const goToPage = (page) => {
    fetchBootcamps({ page });
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
    bootcamps,
    selectedBootcamp,
    bootcampTalents,
    pagination,
    filters,
    loading,
    error,
    fetchBootcamps,
    fetchBootcampById,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    fetchBootcampTalents,
    updateBootcampStats,
    fetchBootcampStats,
    updateFilters,
    clearFilters,
    clearError,
    setSelectedBootcamp,
    goToPage,
    nextPage,
    previousPage
  };
};