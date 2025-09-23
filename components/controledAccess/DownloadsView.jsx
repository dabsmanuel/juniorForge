'use client'

import React, { useState, useEffect } from 'react';
import { Download, FileText, Search, Calendar, User, AlertTriangle, Info } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { submissionsApi, formatDate, formatFileSize } from '../../lib/util';
import LoadingSpinner from './layout/LoadingSpinner';

const DownloadsView = ({ admin, token }) => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [legacyFilesCount, setLegacyFilesCount] = useState(0);
  const { loading, error, executeAsync } = useApi();

  useEffect(() => {
    loadTalentSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, searchTerm]);

  const loadTalentSubmissions = async () => {
    try {
      const response = await executeAsync(() => submissionsApi.getSubmissionsByType(token, 'talent'));
      // Only get submissions that have files
      const submissionsWithFiles = (response.data || []).filter(
        submission => submission.cvFile || submission.coverLetterFile
      );
      
      // Count legacy files (files without URLs)
      const legacyCount = submissionsWithFiles.reduce((count, submission) => {
        let legacyFiles = 0;
        if (submission.cvFile && (!submission.cvFile.url || submission.cvFile.url === null)) {
          legacyFiles++;
        }
        if (submission.coverLetterFile && (!submission.coverLetterFile.url || submission.coverLetterFile.url === null)) {
          legacyFiles++;
        }
        return count + legacyFiles;
      }, 0);
      
      setLegacyFilesCount(legacyCount);
      setSubmissions(submissionsWithFiles);
    } catch (error) {
      console.error('Error loading talent submissions:', error);
    }
  };

  const filterSubmissions = () => {
    let filtered = submissions;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(submission =>
        submission.fullName.toLowerCase().includes(search) ||
        submission.email.toLowerCase().includes(search) ||
        submission.preferredRole.toLowerCase().includes(search)
      );
    }

    setFilteredSubmissions(filtered);
  };

  // Enhanced handleDownload with better error handling
  const handleDownload = async (submissionId, fileType, fileName) => {
    try {
      console.log('Downloading:', { submissionId, fileType, fileName });
      
      const response = await submissionsApi.downloadFile(token, submissionId, fileType);
      
      // Get the blob from response
      const blob = await response.blob();
      
      // Create object URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `${fileType}_${submissionId}`;
      
      // Append to body, click, and cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading file:', error);
      
      // Enhanced error handling with specific messages
      if (error.message.includes('legacy_file_lost')) {
        alert(`This file is no longer available. It was uploaded before the current storage system was configured and cannot be recovered.\n\nFile: ${fileName}\nPlease contact the applicant to resubmit their documents.`);
      } else if (error.message.includes('file_not_found_in_storage')) {
        alert(`File not found in storage. It may have been deleted or moved.\n\nFile: ${fileName}\nPlease contact support for assistance.`);
      } else if (error.message.includes('storage_service_error')) {
        alert(`Storage service error. Please try again later.\n\nFile: ${fileName}\nIf the problem persists, contact support.`);
      } else {
        alert(`Failed to download file: ${error.message}\n\nFile: ${fileName}`);
      }
    }
  };

  // Check if a file is likely a legacy file
  const isLegacyFile = (fileInfo) => {
    return fileInfo && (!fileInfo.url || fileInfo.url === null);
  };

  // Get file status for display
  const getFileStatus = (fileInfo) => {
    if (!fileInfo) return 'missing';
    if (isLegacyFile(fileInfo)) return 'legacy';
    return 'available';
  };

  if (loading && submissions.length === 0) {
    return <LoadingSpinner message="Loading downloadable files..." />;
  }

  const totalFiles = submissions.reduce((count, submission) => {
    let fileCount = 0;
    if (submission.cvFile) fileCount++;
    if (submission.coverLetterFile) fileCount++;
    return count + fileCount;
  }, 0);

  const availableFiles = totalFiles - legacyFilesCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Downloads</h1>
        <p className="text-gray-600">Access and download uploaded files from talent applications</p>
      </div>

      {/* Legacy Files Warning */}
      {legacyFilesCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Legacy Files Detected</h3>
              <p className="text-sm text-yellow-700 mt-1">
                {legacyFilesCount} file{legacyFilesCount !== 1 ? 's' : ''} from older submissions may no longer be available for download. 
                These files were uploaded before the current storage system was configured.
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Files marked with a warning icon may not be downloadable. Please contact affected applicants to resubmit their documents if needed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div className="flex space-x-6 text-sm text-gray-600">
            <div>Applications with files: {filteredSubmissions.length}</div>
            <div>Total files: {totalFiles}</div>
            <div className="text-green-600">Available: {availableFiles}</div>
            {legacyFilesCount > 0 && <div className="text-yellow-600">Legacy: {legacyFilesCount}</div>}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, or preferred role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12895E] focus:border-transparent"
          />
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSubmissions.map((submission) => (
          <div key={submission._id} className="bg-white p-6 rounded-lg shadow-sm border">
            {/* Applicant Info */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{submission.fullName}</h3>
                <p className="text-sm text-gray-500">{submission.email}</p>
              </div>
            </div>

            {/* Application Details */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Preferred Role:</span>
                  <span className="ml-2 text-gray-600">{submission.preferredRole}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Availability:</span>
                  <span className="ml-2 text-gray-600">{submission.availability}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-gray-600">Applied {formatDate(submission.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Files */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Available Files:</h4>
              
              {submission.cvFile && (
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <FileText className="w-5 h-5 text-blue-500" />
                      {isLegacyFile(submission.cvFile) && (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" title="Legacy file - may not be available" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                        <span>CV/Resume</span>
                        {isLegacyFile(submission.cvFile) && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Legacy</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{submission.cvFile.filename}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(submission._id, 'cv', submission.cvFile.filename)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isLegacyFile(submission.cvFile)
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">
                      {isLegacyFile(submission.cvFile) ? 'Try Download' : 'Download'}
                    </span>
                  </button>
                </div>
              )}

              {submission.coverLetterFile && (
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <FileText className="w-5 h-5 text-green-500" />
                      {isLegacyFile(submission.coverLetterFile) && (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" title="Legacy file - may not be available" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                        <span>Cover Letter</span>
                        {isLegacyFile(submission.coverLetterFile) && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Legacy</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{submission.coverLetterFile.filename}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(submission._id, 'coverLetter', submission.coverLetterFile.filename)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isLegacyFile(submission.coverLetterFile)
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">
                      {isLegacyFile(submission.coverLetterFile) ? 'Try Download' : 'Download'}
                    </span>
                  </button>
                </div>
              )}

              {/* Quick Actions */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex space-x-2">
                  {submission.cvFile && submission.coverLetterFile && (
                    <button
                      onClick={async () => {
                        if (submission.cvFile) {
                          await handleDownload(submission._id, 'cv', submission.cvFile.filename);
                        }
                        if (submission.coverLetterFile) {
                          // Small delay between downloads
                          await new Promise(resolve => setTimeout(resolve, 1000));
                          await handleDownload(submission._id, 'coverLetter', submission.coverLetterFile.filename);
                        }
                      }}
                      className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                    >
                      Download All
                    </button>
                  )}
                  {submission.linkedIn && (
                    <a
                      href={submission.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      View LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSubmissions.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Download className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No files available</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'No applications match your search criteria' 
              : 'No talent applications with files have been submitted yet'}
          </p>
        </div>
      )}

      {/* Bulk Download Section - Only show if there are available files */}
      {availableFiles > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={async () => {
                const cvSubmissions = filteredSubmissions.filter(s => s.cvFile && !isLegacyFile(s.cvFile));
                for (const submission of cvSubmissions) {
                  await handleDownload(submission._id, 'cv', submission.cvFile.filename);
                  // Add small delay between downloads
                  await new Promise(resolve => setTimeout(resolve, 1000));
                }
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download All Available CVs</span>
            </button>

            <button
              onClick={async () => {
                const coverLetterSubmissions = filteredSubmissions.filter(s => s.coverLetterFile && !isLegacyFile(s.coverLetterFile));
                for (const submission of coverLetterSubmissions) {
                  await handleDownload(submission._id, 'coverLetter', submission.coverLetterFile.filename);
                  // Add small delay between downloads
                  await new Promise(resolve => setTimeout(resolve, 1000));
                }
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download All Available Cover Letters</span>
            </button>
          </div>
          
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p>Files will be downloaded one by one with a small delay between each download.</p>
                {legacyFilesCount > 0 && (
                  <p className="mt-1">Legacy files (marked with warning icons) will be skipped in bulk downloads.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legacy Files Information */}
      {legacyFilesCount > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-medium text-gray-900 mb-3">About Legacy Files</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>Legacy files are from submissions made before the current storage system was properly configured.</p>
            <p>These files may not be downloadable because:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>The storage URLs were not properly saved</li>
              <li>Files may have been lost during system migrations</li>
              <li>The Cloudinary integration was not active when they were uploaded</li>
            </ul>
            <p className="mt-3 font-medium">
              If you need these files, please contact the applicants directly to resubmit their documents.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadsView;