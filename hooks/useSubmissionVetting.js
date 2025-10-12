// hooks/useSubmissionVetting.js
'use client'
import { useState } from 'react';
import { submissionsApi } from '../lib/util';
import { useApi } from './useApi';

export const useSubmissionVetting = (token) => {
  const { loading, error, executeAsync, clearError } = useApi();
  const [submissions, setSubmissions] = useState([]);
  const [vettedSubmissions, setVettedSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Fetch all submissions with optional filters
  const fetchSubmissions = async (params = {}) => {
    try {
      const result = await executeAsync(() => 
        submissionsApi.getAllSubmissions(token, params)
      );
      setSubmissions(result.data);
      return result;
    } catch (err) {
      console.error('Error fetching submissions:', err);
      throw err;
    }
  };

  // Fetch submissions by type (talent or startup)
  const fetchSubmissionsByType = async (type, params = {}) => {
    try {
      const result = await executeAsync(() => 
        submissionsApi.getSubmissionsByType(token, type, params)
      );
      setSubmissions(result.data);
      return result;
    } catch (err) {
      console.error('Error fetching submissions:', err);
      throw err;
    }
  };

  // Fetch vetted submissions only
  const fetchVettedSubmissions = async (params = {}) => {
    try {
      const result = await executeAsync(() => 
        submissionsApi.getVettedSubmissions(token, params)
      );
      setVettedSubmissions(result.data);
      return result;
    } catch (err) {
      console.error('Error fetching vetted submissions:', err);
      throw err;
    }
  };

  // Fetch single submission
  const fetchSubmissionById = async (id) => {
    try {
      const result = await executeAsync(() => 
        submissionsApi.getSubmission(token, id)
      );
      setSelectedSubmission(result.data);
      return result.data;
    } catch (err) {
      console.error('Error fetching submission:', err);
      throw err;
    }
  };

  // Vet a talent submission
  const vetSubmission = async (submissionId, vettingData) => {
    try {
      const result = await executeAsync(() => 
        submissionsApi.vetSubmission(token, submissionId, vettingData)
      );
      
      // Update selected submission if it's the one being vetted
      if (selectedSubmission && selectedSubmission._id === submissionId) {
        setSelectedSubmission(result.data);
      }
      
      // Refresh submissions list
      await fetchSubmissions();
      
      return result;
    } catch (err) {
      console.error('Error vetting submission:', err);
      throw err;
    }
  };

  // Convert vetted submission to main talent database
  const convertToTalent = async (submissionId, additionalData = {}) => {
    try {
      const result = await executeAsync(() => 
        submissionsApi.convertToTalent(token, submissionId, additionalData)
      );
      
      // Update selected submission
      if (selectedSubmission && selectedSubmission._id === submissionId) {
        setSelectedSubmission(result.data.submission);
      }
      
      // Refresh submissions list
      await fetchSubmissions();
      
      return result;
    } catch (err) {
      console.error('Error converting to talent:', err);
      throw err;
    }
  };

  // Delete submission
  const deleteSubmission = async (submissionId) => {
    try {
      const result = await executeAsync(() => 
        submissionsApi.deleteSubmission(token, submissionId)
      );
      
      // Clear selected submission if it was deleted
      if (selectedSubmission && selectedSubmission._id === submissionId) {
        setSelectedSubmission(null);
      }
      
      // Refresh submissions list
      await fetchSubmissions();
      
      return result;
    } catch (err) {
      console.error('Error deleting submission:', err);
      throw err;
    }
  };

  // Download file from submission
  const downloadFile = async (submissionId, fileType) => {
    try {
      const response = await executeAsync(() => 
        submissionsApi.downloadFile(token, submissionId, fileType)
      );
      
      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileType}_${submissionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return true;
    } catch (err) {
      console.error('Error downloading file:', err);
      throw err;
    }
  };

  // Helper: Get talent submissions only
  const fetchTalentSubmissions = async (params = {}) => {
    return fetchSubmissionsByType('talent', params);
  };

  // Helper: Get unvetted talent submissions
  const fetchUnvettedTalents = async () => {
    return fetchSubmissionsByType('talent', { vetted: 'false' });
  };

  // Helper: Get vetted talent submissions only
  const fetchVettedTalents = async () => {
    return fetchVettedSubmissions({ type: 'talent' });
  };

  return {
    submissions,
    vettedSubmissions,
    selectedSubmission,
    loading,
    error,
    fetchSubmissions,
    fetchSubmissionsByType,
    fetchVettedSubmissions,
    fetchSubmissionById,
    vetSubmission,
    convertToTalent,
    deleteSubmission,
    downloadFile,
    fetchTalentSubmissions,
    fetchUnvettedTalents,
    fetchVettedTalents,
    clearError,
    setSelectedSubmission
  };
};