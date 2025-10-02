'use client'
import React, { useState, useEffect } from 'react';
import { Mail, Send, X, Clock, CheckCircle, AlertCircle } from 'lucide-react';

// Email Modal Component for individual submissions
export const EmailModal = ({ submission, isOpen, onClose, onSendEmail, admin }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      setError('Please fill in both subject and message');
      return;
    }

    setSending(true);
    setError('');

    try {
      await onSendEmail({
        subject,
        message,
        submissionId: submission._id
      });
      
      // Reset form and close
      setSubject('');
      setMessage('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Mail className="w-6 h-6 text-[#685EFC]" />
              <h2 className="text-xl font-bold text-gray-900">Send Email</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={sending}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Recipient Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="text-sm text-gray-600">To:</div>
            <div className="font-medium text-gray-900">{submission.fullName}</div>
            <div className="text-sm text-gray-600">{submission.email}</div>
            <div className="text-xs text-gray-500 mt-1">
              {submission.type === 'startup' ? 'Startup Application' : 'Talent Application'}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#685EFC] focus:border-transparent"
                disabled={sending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message"
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#685EFC] focus:border-transparent resize-none"
                disabled={sending}
              />
              <div className="text-xs text-gray-500 mt-1">
                {message.length} characters
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={sending}
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={sending || !subject.trim() || !message.trim()}
              className="px-4 py-2 bg-[#685EFC] text-white rounded-lg text-sm font-medium hover:bg-[#5548d4] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Email</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Bulk Email Modal Component
export const BulkEmailModal = ({ selectedSubmissions, isOpen, onClose, onSendBulkEmail }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      setError('Please fill in both subject and message');
      return;
    }

    setSending(true);
    setError('');

    try {
      await onSendBulkEmail({
        subject,
        message,
        submissionIds: selectedSubmissions.map(s => s._id)
      });
      
      setSubject('');
      setMessage('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to send emails');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Mail className="w-6 h-6 text-[#685EFC]" />
              <h2 className="text-xl font-bold text-gray-900">Send Bulk Email</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={sending}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Recipients Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="text-sm text-gray-600 mb-2">
              Sending to {selectedSubmissions.length} recipient{selectedSubmissions.length !== 1 ? 's' : ''}
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {selectedSubmissions.slice(0, 5).map((sub) => (
                <div key={sub._id} className="text-xs text-gray-600">
                  • {sub.fullName} ({sub.email})
                </div>
              ))}
              {selectedSubmissions.length > 5 && (
                <div className="text-xs text-gray-500 italic">
                  ...and {selectedSubmissions.length - 5} more
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#685EFC] focus:border-transparent"
                disabled={sending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message (will be sent to all selected recipients)"
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#685EFC] focus:border-transparent resize-none"
                disabled={sending}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={sending}
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={sending || !subject.trim() || !message.trim()}
              className="px-4 py-2 bg-[#685EFC] text-white rounded-lg text-sm font-medium hover:bg-[#5548d4] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send to {selectedSubmissions.length}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Email History Component
export const EmailHistory = ({ history, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-6 h-6 text-[#685EFC]" />
              <h2 className="text-xl font-bold text-gray-900">Email History</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {history && history.length > 0 ? (
            <div className="space-y-4">
              {history.map((email, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-gray-900">{email.subject}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(email.sentAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    To: {email.sentTo}
                  </div>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {email.message}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No email history available</p>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};