import React from 'react';
import { Building, User, Mail, Download, Trash2 } from 'lucide-react';

const SubmissionCard = ({ submission, onDelete, onDownload }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              submission.type === 'startup' ? 'bg-[#c1eddd]' : 'bg-[#e6e3ff]'
            }`}>
              {submission.type === 'startup' ? (
                <Building className="w-5 h-5 text-[#12895E]" />
              ) : (
                <User className="w-5 h-5 text-[#685EFC]" />
              )}
            </div>
            <div>
              <h4 className="font-semibold text-[#16252D]">
                {submission.fullName}
              </h4>
              <p className="text-sm text-[#A49595] flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                {submission.email}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              submission.type === 'startup' 
                ? 'bg-[#c1eddd] text-[#12895E]' 
                : 'bg-[#e6e3ff] text-[#685EFC]'
            }`}>
              {submission.type.toUpperCase()}
            </span>
          </div>
          
          {submission.type === 'startup' && (
            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              {submission.companyName && (
                <p className="text-[#A49595]">
                  <span className="font-medium">Company:</span> {submission.companyName}
                </p>
              )}
              {submission.website && (
                <p className="text-[#A49595]">
                  <span className="font-medium">Website:</span> {submission.website}
                </p>
              )}
            </div>
          )}
          
          {submission.type === 'talent' && (
            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              {submission.preferredRole && (
                <p className="text-[#A49595]">
                  <span className="font-medium">Role:</span> {submission.preferredRole}
                </p>
              )}
              {submission.availability && (
                <p className="text-[#A49595]">
                  <span className="font-medium">Availability:</span> {submission.availability}
                </p>
              )}
            </div>
          )}
          
          <p className="text-xs text-[#A49595]">
            Submitted: {new Date(submission.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {submission.type === 'talent' && (
            <>
              {submission.cvFile && (
                <button
                  onClick={() => onDownload(submission._id, 'cvFile')}
                  className="flex items-center space-x-1 px-3 py-2 bg-[#12895E] text-white rounded-lg hover:bg-[#0f7a52] transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>CV</span>
                </button>
              )}
              {submission.coverLetterFile && (
                <button
                  onClick={() => onDownload(submission._id, 'coverLetterFile')}
                  className="flex items-center space-x-1 px-3 py-2 bg-[#685EFC] text-white rounded-lg hover:bg-[#5a4ef0] transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Cover Letter</span>
                </button>
              )}
            </>
          )}
          <button
            onClick={() => onDelete(submission._id)}
            className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard;