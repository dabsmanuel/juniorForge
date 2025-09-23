import React, { useState, useEffect } from 'react';
import { FileText, Search, Building, User, Mail, Download, Trash2 } from 'lucide-react';
import { submissionsApi } from '../../lib/util';
import LoadingSpinner from '../shared/LoadingSpinner';
import EmptyState from '../shared/EmptyState';
import SubmissionCard from './SubmissionCard';
import SubmissionsFilter from './SubmissionsFilter';

const SubmissionsView = ({ token }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const result = filter === 'all' 
        ? await submissionsApi.getAllSubmissions(token)
        : await submissionsApi.getSubmissionsByType(token, filter);
      setSubmissions(result.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmission = async (id) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    
    try {
      await submissionsApi.deleteSubmission(token, id);
      fetchSubmissions(); // Refresh list
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  const handleDownloadFile = async (submissionId, fileType) => {
    try {
      const submission = submissions.find(s => s._id === submissionId);
      const fileUrl = submission[fileType]?.url;
      if (!fileUrl) throw new Error('File URL not found');
      window.open(fileUrl, '_blank');
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  
  const filteredSubmissions = submissions.filter(submission =>
    submission.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner text="Loading submissions..." />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#16252D] flex items-center">
            <FileText className="w-5 h-5 mr-2 text-[#685EFC]" />
            Submissions ({filteredSubmissions.length})
          </h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A49595]" />
              <input
                type="text"
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#685EFC] focus:border-transparent"
              />
            </div>
            <SubmissionsFilter filter={filter} onFilterChange={setFilter} />
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {filteredSubmissions.length === 0 ? (
          <EmptyState 
            icon={FileText}
            title="No submissions found"
            description="No submissions match your current filters."
          />
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <SubmissionCard
                key={submission._id}
                submission={submission}
                onDelete={handleDeleteSubmission}
                onDownload={handleDownloadFile}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionsView;
