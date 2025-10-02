import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Trash2, Eye, Building, User, Calendar, FileText, Mail, Clock, CheckSquare } from 'lucide-react';
import { submissionsApi, emailApi, formatDate } from '../../lib/util';
import { EmailModal, BulkEmailModal, EmailHistory } from './email/Email';

const SubmissionsView = ({ admin, token }) => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Email states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showBulkEmailModal, setShowBulkEmailModal] = useState(false);
  const [showEmailHistory, setShowEmailHistory] = useState(false);
  const [emailHistoryData, setEmailHistoryData] = useState([]);
  const [selectedForBulk, setSelectedForBulk] = useState([]);
  const [selectMode, setSelectMode] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, filterType, searchTerm]);

  const loadSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await submissionsApi.getAllSubmissions(token);
      setSubmissions(response.data || []);
    } catch (error) {
      setError(error.message);
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = submissions;

    if (filterType !== 'all') {
      filtered = filtered.filter(submission => submission.type === filterType);
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
      
      // Reload submissions to get updated email history
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
      
      // Clear selection and reload
      setSelectedForBulk([]);
      setSelectMode(false);
      await loadSubmissions();
      alert(`Email sent to ${bulkData.submissionIds.length} recipient(s) successfully!`);
    } catch (error) {
      throw new Error(error.message || 'Failed to send bulk email');
    }
  };

  const handleViewEmailHistory = async (submissionId) => {
    try {
      const response = await emailApi.getEmailHistory(token, submissionId);
      setEmailHistoryData(response.data || []);
      setShowEmailHistory(true);
    } catch (error) {
      alert(`Failed to load email history: ${error.message}`);
      console.error('Error loading email history:', error);
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
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
          <p className="text-gray-600">Manage form submissions from startups and talent</p>
        </div>
        
        {/* Bulk Email Controls */}
        <div className="flex items-center space-x-3">
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

      {/* Filters and Search */}
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
          </div>
        </div>

        <div className="mt-4 flex space-x-6 text-sm text-gray-600">
          <div>Total: {filteredSubmissions.length}</div>
          <div>Startups: {filteredSubmissions.filter(s => s.type === 'startup').length}</div>
          <div>Talent: {filteredSubmissions.filter(s => s.type === 'talent').length}</div>
        </div>
      </div>

      {/* Submissions Table */}
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
              {filteredSubmissions.map((submission) => (
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
                        <div className="text-sm font-medium text-gray-900">
                          {submission.fullName}
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
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your filters or search terms' 
                : 'Submissions will appear here once users start submitting forms'}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedSubmission.type === 'startup' ? 'Startup' : 'Talent'} Application Details
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedSubmission.fullName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedSubmission.email}</p>
                  </div>
                </div>

                {selectedSubmission.type === 'startup' ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company Name</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedSubmission.companyName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Website</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedSubmission.website}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">About Startup</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedSubmission.aboutStartup}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role Description</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedSubmission.roleDescription}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hiring Timeline</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedSubmission.hiringTimeline}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedSubmission.linkedIn}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Preferred Role</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedSubmission.preferredRole}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Availability</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedSubmission.availability}</p>
                    </div>
                    
                    {(admin?.permissions?.downloadFiles || admin?.role === 'super_admin') && (
                      <div className="border-t pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Files</label>
                        <div className="space-y-2">
                          {selectedSubmission.cvFile && (
                            <button
                              onClick={() => handleDownload(selectedSubmission._id, 'cv', selectedSubmission.cvFile.filename)}
                              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download CV ({selectedSubmission.cvFile.filename})</span>
                            </button>
                          )}
                          {selectedSubmission.coverLetterFile && (
                            <button
                              onClick={() => handleDownload(selectedSubmission._id, 'coverLetter', selectedSubmission.coverLetterFile.filename)}
                              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download Cover Letter ({selectedSubmission.coverLetterFile.filename})</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700">Submission Date</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedSubmission.createdAt)}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                {(admin?.permissions?.deleteSubmissions || admin?.role === 'super_admin') && (
                  <button
                    onClick={() => {
                      handleDelete(selectedSubmission._id);
                      closeModal();
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    Delete Submission
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Modals */}
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