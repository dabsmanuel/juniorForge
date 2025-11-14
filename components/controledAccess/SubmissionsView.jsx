import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Trash2, Eye, Building, User, Calendar, FileText, Mail, Clock, CheckSquare, RefreshCw, CheckCircle, X, Phone, Briefcase, Globe } from 'lucide-react';
import { submissionsApi, emailApi, formatDate } from '../../lib/util';
import { EmailModal, BulkEmailModal, EmailHistory } from './email/Email';

const SubmissionsView = ({ admin, token }) => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [vettingFilter, setVettingFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showBulkEmailModal, setShowBulkEmailModal] = useState(false);
  const [showEmailHistory, setShowEmailHistory] = useState(false);
  const [emailHistoryData, setEmailHistoryData] = useState([]);
  const [emailHistoryLoading, setEmailHistoryLoading] = useState(false);
  const [selectedForBulk, setSelectedForBulk] = useState([]);
  const [selectMode, setSelectMode] = useState(false);

  const [showVettingModal, setShowVettingModal] = useState(false);
  const [vettingSubmission, setVettingSubmission] = useState(null);
  const [vettingForm, setVettingForm] = useState({
    vettingNotes: '',
    assessmentScores: {
      technicalSkills: 5,
      communication: 5,
      problemSolving: 5,
      culturalFit: 5,
      motivation: 5
    }
  });

  useEffect(() => {
    loadSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, filterType, searchTerm, vettingFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, searchTerm, vettingFilter, itemsPerPage]);

  const loadSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await submissionsApi.getAllSubmissions(token);
      console.log('API Response:', response);
      console.log('Submissions data:', response.data);
      setSubmissions(response.data || []);
    } catch (error) {
      setError(error.message);
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const response = await submissionsApi.getAllSubmissions(token);
      setSubmissions(response.data || []);
    } catch (error) {
      setError(error.message);
      console.error('Error refreshing submissions:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = submissions;

    if (filterType !== 'all') {
      filtered = filtered.filter(submission => submission.type === filterType);
    }

    if (vettingFilter !== 'all') {
      if (vettingFilter === 'vetted') {
        filtered = filtered.filter(submission => submission.vetted === true);
      } else if (vettingFilter === 'unvetted') {
        filtered = filtered.filter(submission => !submission.vetted);
      }
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(submission =>
        submission.fullName.toLowerCase().includes(search) ||
        submission.email.toLowerCase().includes(search) ||
        (submission.companyName && submission.companyName.toLowerCase().includes(search))
      );
    }

    setFilteredSubmissions(filtered);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubmissions = filteredSubmissions.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleVetSubmission = async () => {
    try {
      await submissionsApi.vetSubmission(token, vettingSubmission._id, vettingForm);
      alert('Submission vetted successfully!');
      setShowVettingModal(false);
      resetVettingForm();
      await loadSubmissions();
    } catch (error) {
      alert(`Failed to vet submission: ${error.message}`);
      console.error('Error vetting submission:', error);
    }
  };

  const handleConvertToTalent = async (submissionId) => {
    if (!window.confirm('Are you sure you want to convert this vetted submission to the main talent database?')) {
      return;
    }

    try {
      await submissionsApi.convertToTalent(token, submissionId);
      alert('Submission converted to talent successfully!');
      await loadSubmissions();
    } catch (error) {
      alert(`Failed to convert to talent: ${error.message}`);
      console.error('Error converting to talent:', error);
    }
  };

  const startVetting = (submission) => {
    setVettingSubmission(submission);
    setShowVettingModal(true);
  };

  const resetVettingForm = () => {
    setVettingForm({
      vettingNotes: '',
      assessmentScores: {
        technicalSkills: 5,
        communication: 5,
        problemSolving: 5,
        culturalFit: 5,
        motivation: 5
      }
    });
    setVettingSubmission(null);
  };

  const handleDelete = async (submissionId) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    try {
      await submissionsApi.deleteSubmission(token, submissionId);
      setSubmissions(submissions.filter(s => s._id !== submissionId));
    } catch (error) {
      alert(`Failed to delete: ${error.message}`);
      console.error('Error deleting submission:', error);
    }
  };

  const handleDownload = async (submissionId, fileType, fileName) => {
    try {
      const response = await submissionsApi.downloadFile(token, submissionId, fileType);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `${fileType}_${submissionId}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Failed to download file: ${error.message}`);
      console.error('Error downloading file:', error);
    }
  };

  const handleSendEmail = async (emailData) => {
    try {
      await emailApi.sendEmailToSubmission(token, emailData.submissionId, {
        subject: emailData.subject,
        message: emailData.message
      });
      
      await loadSubmissions();
      alert('Email sent successfully!');
    } catch (error) {
      throw new Error(error.message || 'Failed to send email');
    }
  };

  const handleSendBulkEmail = async (bulkData) => {
    try {
      await emailApi.sendBulkEmail(token, {
        submissionIds: bulkData.submissionIds,
        subject: bulkData.subject,
        message: bulkData.message
      });
      
      setSelectedForBulk([]);
      setSelectMode(false);
      await loadSubmissions();
      alert(`Email sent to ${bulkData.submissionIds.length} recipient(s) successfully!`);
    } catch (error) {
      throw new Error(error.message || 'Failed to send bulk email');
    }
  };

  const handleViewEmailHistory = async (submissionId) => {
    setEmailHistoryLoading(true);
    setShowEmailHistory(true);
    setEmailHistoryData([]);
    
    try {
      const response = await emailApi.getEmailHistory(token, submissionId);
      setEmailHistoryData(response.data.emailHistory || []);
    } catch (error) {
      alert(`Failed to load email history: ${error.message}`);
      console.error('Error loading email history:', error);
      setShowEmailHistory(false);
    } finally {
      setEmailHistoryLoading(false);
    }
  };

  const toggleSelectForBulk = (submission) => {
    setSelectedForBulk(prev => {
      const isSelected = prev.some(s => s._id === submission._id);
      if (isSelected) {
        return prev.filter(s => s._id !== submission._id);
      } else {
        return [...prev, submission];
      }
    });
  };

  const openModal = (submission) => {
    console.log('=== MODAL DEBUG START ===');
    console.log('Full submission object:', submission);
    console.log('Phone value:', submission.phone, '| Type:', typeof submission.phone);
    console.log('Gender value:', submission.gender, '| Type:', typeof submission.gender);
    console.log('Email:', submission.email);
    console.log('Full Name:', submission.fullName);
    console.log('Submission Type:', submission.type);
    console.log('All keys:', Object.keys(submission));
    console.log('=== MODAL DEBUG END ===');
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedSubmission(null);
    setShowModal(false);
  };

  if (loading && submissions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#685EFC]"></div>
        <span className="ml-3 text-gray-600">Loading submissions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
          <p className="text-gray-600">Manage form submissions from startups and talent</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            title="Refresh submissions"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          
          {selectMode ? (
            <>
              <button
                onClick={() => {
                  setSelectMode(false);
                  setSelectedForBulk([]);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowBulkEmailModal(true)}
                disabled={selectedForBulk.length === 0}
                className="px-4 py-2 bg-[#685EFC] text-white rounded-lg text-sm font-medium hover:bg-[#5548d4] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>Send to {selectedForBulk.length}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setSelectMode(true)}
              className="px-4 py-2 bg-[#685EFC] text-white rounded-lg text-sm font-medium hover:bg-[#5548d4] flex items-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>Bulk Email</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#685EFC] focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#685EFC] focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="startup">Startups</option>
              <option value="talent">Talent</option>
            </select>

            <select
              value={vettingFilter}
              onChange={(e) => setVettingFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#685EFC] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="vetted">Vetted</option>
              <option value="unvetted">Unvetted</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-6 text-sm text-gray-600">
            <div>Total: {filteredSubmissions.length}</div>
            <div>Startups: {filteredSubmissions.filter(s => s.type === 'startup').length}</div>
            <div>Talent: {filteredSubmissions.filter(s => s.type === 'talent').length}</div>
            <div>Vetted: {filteredSubmissions.filter(s => s.vetted).length}</div>
            <div>Unvetted: {filteredSubmissions.filter(s => !s.vetted).length}</div>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Show:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-[#685EFC] focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">per page</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {selectMode && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSubmissions.map((submission) => (
                <tr key={submission._id} className="hover:bg-gray-50">
                  {selectMode && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedForBulk.some(s => s._id === submission._id)}
                        onChange={() => toggleSelectForBulk(submission)}
                        className="w-4 h-4 text-[#685EFC] border-gray-300 rounded focus:ring-[#685EFC]"
                      />
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        submission.type === 'startup' ? 'bg-green-100' : 'bg-purple-100'
                      }`}>
                        {submission.type === 'startup' ? (
                          <Building className="w-5 h-5 text-green-600" />
                        ) : (
                          <User className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {submission.fullName}
                          {submission.vetted && (
                            <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {submission.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      submission.type === 'startup' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {submission.type.charAt(0).toUpperCase() + submission.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      submission.vetted 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {submission.vetted ? 'Vetted' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {submission.type === 'startup' ? (
                      <div>
                        <div className="font-medium">{submission.companyName}</div>
                        <div className="text-xs">{submission.roleDescription?.substring(0, 50)}...</div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium">{submission.preferredRole}</div>
                        <div className="text-xs">Available: {submission.availability}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(submission.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal(submission)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {submission.type === 'talent' && !submission.vetted && (
                        <button
                          onClick={() => startVetting(submission)}
                          className="text-green-600 hover:text-green-900"
                          title="Vet Submission"
                        >
                          <CheckSquare className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setShowEmailModal(true);
                        }}
                        className="text-purple-600 hover:text-purple-900"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      
                      {submission.emailHistory && submission.emailHistory.length > 0 && (
                        <button
                          onClick={() => handleViewEmailHistory(submission._id)}
                          className="text-orange-600 hover:text-orange-900"
                          title="Email History"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      )}
                      
                      {(admin?.permissions?.downloadFiles || admin?.role === 'super_admin') && 
                       submission.type === 'talent' && submission.cvFile && (
                        <button
                          onClick={() => handleDownload(submission._id, 'cv', submission.cvFile.filename)}
                          className="text-green-600 hover:text-green-900"
                          title="Download CV"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      
                      {(admin?.permissions?.deleteSubmissions || admin?.role === 'super_admin') && (
                        <button
                          onClick={() => handleDelete(submission._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
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

        {filteredSubmissions.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
            <p className="text-gray-500">
              {searchTerm || filterType !== 'all' || vettingFilter !== 'all'
                ? 'Try adjusting your filters or search terms' 
                : 'Submissions will appear here once users start submitting forms'}
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredSubmissions.length > 0 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(endIndex, filteredSubmissions.length)}</span> of{' '}
                    <span className="font-medium">{filteredSubmissions.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? 'z-10 bg-[#685EFC] border-[#685EFC] text-white'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span
                            key={page}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showVettingModal && vettingSubmission && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="relative px-6 py-6 bg-gradient-to-r from-indigo-500 to-purple-600">
              <button
                onClick={() => {
                  setShowVettingModal(false);
                  resetVettingForm();
                }}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <CheckSquare className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Vet Talent</h2>
                  <p className="text-white/80 text-sm mt-1">{vettingSubmission.fullName}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
              {/* Notes Section */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vetting Notes
                </label>
                <textarea
                  value={vettingForm.vettingNotes}
                  onChange={(e) => setVettingForm({...vettingForm, vettingNotes: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[100px] resize-none"
                  placeholder="Add your assessment notes here..."
                />
              </div>

              {/* Assessment Scores */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Assessment Scores</h3>
                <div className="space-y-4">
                  {[
                    { key: 'technicalSkills', label: 'Technical Skills', icon: '💻' },
                    { key: 'communication', label: 'Communication', icon: '💬' },
                    { key: 'problemSolving', label: 'Problem Solving', icon: '🧩' },
                    { key: 'culturalFit', label: 'Cultural Fit', icon: '🤝' },
                    { key: 'motivation', label: 'Motivation', icon: '🎯' },
                  ].map(({ key, label, icon }) => (
                    <div key={key} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{icon}</span>
                          <label className="text-sm font-medium text-gray-700">{label}</label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={vettingForm.assessmentScores[key]}
                            onChange={(e) => setVettingForm({
                              ...vettingForm,
                              assessmentScores: {...vettingForm.assessmentScores, [key]: parseInt(e.target.value)}
                            })}
                            className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            style={{accentColor: '#6366f1'}}
                          />
                          <span className="text-lg font-bold text-indigo-600 w-8 text-right">
                            {vettingForm.assessmentScores[key]}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Poor</span>
                        <span>Excellent</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowVettingModal(false);
                    resetVettingForm();
                  }}
                  className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVetSubmission}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-sm hover:shadow"
                >
                  Submit Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header with gradient */}
            <div className={`relative px-6 py-6 ${
              selectedSubmission.type === 'startup' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : 'bg-gradient-to-r from-purple-500 to-indigo-600'
            }`}>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  {selectedSubmission.type === 'startup' ? (
                    <Building className="w-8 h-8 text-white" />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h2 className="text-2xl font-bold text-white">{selectedSubmission.fullName}</h2>
                    {selectedSubmission.vetted && (
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4 text-white" />
                        <span className="text-xs font-semibold text-white">Vetted</span>
                      </div>
                    )}
                  </div>
                  <p className="text-white/90 text-sm">{selectedSubmission.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-white/70 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(selectedSubmission.createdAt)}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      selectedSubmission.type === 'startup' 
                        ? 'bg-green-400/30 text-white' 
                        : 'bg-purple-400/30 text-white'
                    }`}>
                      {selectedSubmission.type.charAt(0).toUpperCase() + selectedSubmission.type.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
              {/* Vetting Status Card */}
              {selectedSubmission.vetted && (
                <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 mb-2">Assessment Scores</h3>
                      {selectedSubmission.vettingNotes && (
                        <p className="text-sm text-green-800 mb-3 italic">"{selectedSubmission.vettingNotes}"</p>
                      )}
                      {selectedSubmission.assessmentScores && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {Object.entries(selectedSubmission.assessmentScores).map(([key, value]) => (
                            <div key={key} className="bg-white rounded-lg p-2 border border-green-100">
                              <div className="text-xs text-gray-600 capitalize mb-1">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-green-500 h-1.5 rounded-full transition-all" 
                                    style={{ width: `${(value / 10) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-bold text-green-700">{value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3 bg-gray-50 rounded-xl p-4">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Email</div>
                      <div className="text-sm font-medium text-gray-900 break-all">{selectedSubmission.email}</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 bg-gray-50 rounded-xl p-4">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Phone</div>
                      <div className="text-sm font-medium text-gray-900">
                        {selectedSubmission.phone !== undefined && selectedSubmission.phone !== null 
                          ? String(selectedSubmission.phone) 
                          : 'Not provided'}
                      </div>
                    </div>
                  </div>
                  {selectedSubmission.gender && selectedSubmission.gender.trim() !== '' && (
                    <div className="flex items-start space-x-3 bg-gray-50 rounded-xl p-4">
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Gender</div>
                        <div className="text-sm font-medium text-gray-900 capitalize">{selectedSubmission.gender}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Type-specific content */}
              {selectedSubmission.type === 'startup' ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Company Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 bg-gray-50 rounded-xl p-4">
                        <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">Company Name</div>
                          <div className="text-sm font-medium text-gray-900">{selectedSubmission.companyName}</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 bg-gray-50 rounded-xl p-4">
                        <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">Website</div>
                          <a 
                            href={selectedSubmission.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            {selectedSubmission.website}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">About</h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">{selectedSubmission.aboutStartup}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Role Details</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-xs text-gray-500 mb-2">Role Description</div>
                        <p className="text-sm text-gray-700 leading-relaxed">{selectedSubmission.roleDescription}</p>
                      </div>
                      <div className="flex items-start space-x-3 bg-gray-50 rounded-xl p-4">
                        <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Hiring Timeline</div>
                          <div className="text-sm font-medium text-gray-900">{selectedSubmission.hiringTimeline}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Professional Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 bg-gray-50 rounded-xl p-4">
                        <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">Preferred Role</div>
                          <div className="text-sm font-medium text-gray-900">{selectedSubmission.preferredRole}</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 bg-gray-50 rounded-xl p-4">
                        <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">Availability</div>
                          <div className="text-sm font-medium text-gray-900">{selectedSubmission.availability}</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 bg-gray-50 rounded-xl p-4">
                        <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">LinkedIn Profile</div>
                          <a 
                            href={selectedSubmission.linkedIn} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            View Profile →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {(admin?.permissions?.downloadFiles || admin?.role === 'super_admin') && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Documents</h3>
                      <div className="space-y-2">
                        {selectedSubmission.cvFile && (
                          <button
                            onClick={() => handleDownload(selectedSubmission._id, 'cv', selectedSubmission.cvFile.filename)}
                            className="w-full flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl p-4 transition-all group"
                          >
                            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-sm font-medium text-gray-900">Resume / CV</div>
                              <div className="text-xs text-gray-500">{selectedSubmission.cvFile.filename}</div>
                            </div>
                            <Download className="w-5 h-5 text-blue-600" />
                          </button>
                        )}
                        {selectedSubmission.coverLetterFile && (
                          <button
                            onClick={() => handleDownload(selectedSubmission._id, 'coverLetter', selectedSubmission.coverLetterFile.filename)}
                            className="w-full flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl p-4 transition-all group"
                          >
                            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-sm font-medium text-gray-900">Cover Letter</div>
                              <div className="text-xs text-gray-500">{selectedSubmission.coverLetterFile.filename}</div>
                            </div>
                            <Download className="w-5 h-5 text-purple-600" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
              <div className="flex flex-wrap gap-2 justify-end">
                {selectedSubmission.type === 'talent' && !selectedSubmission.vetted && (
                  <button
                    onClick={() => {
                      closeModal();
                      startVetting(selectedSubmission);
                    }}
                    className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-sm hover:shadow flex items-center space-x-2"
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>Vet Submission</span>
                  </button>
                )}
                
                {selectedSubmission.type === 'talent' && selectedSubmission.vetted && (
                  <button
                    onClick={() => {
                      closeModal();
                      handleConvertToTalent(selectedSubmission._id);
                    }}
                    className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-purple-600 hover:to-indigo-700 transition-all shadow-sm hover:shadow flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Convert to Talent</span>
                  </button>
                )}

                <button
                  onClick={closeModal}
                  className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
                
                {(admin?.permissions?.deleteSubmissions || admin?.role === 'super_admin') && (
                  <button
                    onClick={() => {
                      handleDelete(selectedSubmission._id);
                      closeModal();
                    }}
                    className="px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-all shadow-sm hover:shadow"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showEmailModal && selectedSubmission && (
        <EmailModal
          submission={selectedSubmission}
          isOpen={showEmailModal}
          onClose={() => {
            setShowEmailModal(false);
            setSelectedSubmission(null);
          }}
          onSendEmail={handleSendEmail}
          admin={admin}
        />
      )}

      {showBulkEmailModal && (
        <BulkEmailModal
          selectedSubmissions={selectedForBulk}
          isOpen={showBulkEmailModal}
          onClose={() => setShowBulkEmailModal(false)}
          onSendBulkEmail={handleSendBulkEmail}
        />
      )}

      {showEmailHistory && (
        <EmailHistory
          history={emailHistoryData}
          isOpen={showEmailHistory}
          isLoading={emailHistoryLoading} // Add this prop
          onClose={() => {
          setShowEmailHistory(false);
          setEmailHistoryData([]);
          }}
        />
      )}
    </div>
  );
};

export default SubmissionsView;