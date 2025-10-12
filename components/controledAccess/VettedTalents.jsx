'use client'
import { useEffect, useState } from 'react';
import { submissionsApi, talentApi } from '../../lib/util';
import { Search, Filter, ChevronLeft, ChevronRight, User, Mail, Phone, Briefcase, MapPin, CheckCircle, Eye, X, Download, Users, TrendingUp } from 'lucide-react';

const VettedTalentsView = ({ token, admin }) => {
  const [vettedTalents, setVettedTalents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [filteredTalents, setFilteredTalents] = useState([]);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    fromSubmissions: 0,
    fromTalentDb: 0,
    byStatus: {}
  });

  useEffect(() => {
    loadVettedTalents();
  }, []);

  useEffect(() => {
    filterTalents();
    calculateStats();
  }, [vettedTalents, searchTerm, statusFilter, sourceFilter]);

  const loadVettedTalents = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch vetted submissions
      const vettedSubmissionsResponse = await submissionsApi.getVettedSubmissions(token, { type: 'talent' });
      const vettedSubmissions = (vettedSubmissionsResponse.data || []).map(sub => ({
        ...sub,
        sourceType: 'submission'
      }));

      // Fetch vetted talents from main database
      const vettedTalentsResponse = await talentApi.getAllTalents(token, { vetted: 'true' });
      const vettedTalentsDb = (vettedTalentsResponse.data || []).map(talent => ({
        ...talent,
        sourceType: 'talent'
      }));

      // Combine both sources
      const allVetted = [...vettedSubmissions, ...vettedTalentsDb];
      setVettedTalents(allVetted);
    } catch (err) {
      setError(err.message);
      console.error('Error loading vetted talents:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterTalents = () => {
    let filtered = vettedTalents;

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(talent =>
        talent.fullName.toLowerCase().includes(search) ||
        talent.email.toLowerCase().includes(search) ||
        (talent.preferredRole && talent.preferredRole.toLowerCase().includes(search))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(talent => talent.status === statusFilter);
    }

    // Source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(talent => talent.sourceType === sourceFilter);
    }

    setFilteredTalents(filtered);
  };

  const calculateStats = () => {
    const total = vettedTalents.length;
    const fromSubmissions = vettedTalents.filter(t => t.sourceType === 'submission').length;
    const fromTalentDb = vettedTalents.filter(t => t.sourceType === 'talent').length;
    
    const byStatus = {};
    vettedTalents.forEach(talent => {
      const status = talent.status || 'Available';
      byStatus[status] = (byStatus[status] || 0) + 1;
    });

    setStats({ total, fromSubmissions, fromTalentDb, byStatus });
  };

  const handleViewDetails = (talent) => {
    setSelectedTalent(talent);
    setShowDetailModal(true);
  };

  const handleDownloadFile = async (talentId, fileType, filename) => {
    try {
      const response = await submissionsApi.downloadFile(token, talentId, fileType);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `${fileType}_${talentId}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Failed to download file: ${error.message}`);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Available': 'bg-green-100 text-green-800',
      'In Review': 'bg-blue-100 text-blue-800',
      'Shortlisted': 'bg-purple-100 text-purple-800',
      'Placed': 'bg-gray-100 text-gray-800',
      'Unavailable': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 font-bold';
    if (score >= 6) return 'text-blue-600 font-semibold';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#685EFC] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#685EFC] to-[#12895E] p-8 shadow-lg">
        <h1 className="text-4xl font-bold text-white mb-2">Vetted Talents</h1>
        <p className="text-white/90">All vetted talents from submissions and main database</p>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#685EFC]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Vetted</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="w-12 h-12 text-[#685EFC] opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#12895E]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">From Submissions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.fromSubmissions}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-[#12895E] opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">From Talent DB</p>
                <p className="text-3xl font-bold text-gray-900">{stats.fromTalentDb}</p>
              </div>
              <Briefcase className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available</p>
                <p className="text-3xl font-bold text-gray-900">{stats.byStatus['Available'] || 0}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#685EFC] focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#685EFC] focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="Available">Available</option>
                <option value="In Review">In Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Placed">Placed</option>
                <option value="Unavailable">Unavailable</option>
              </select>

              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#685EFC] focus:border-transparent"
              >
                <option value="all">All Sources</option>
                <option value="submission">From Submissions</option>
                <option value="talent">From Talent DB</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex space-x-6 text-sm text-gray-600">
            <div>Showing: {filteredTalents.length} of {stats.total}</div>
          </div>
        </div>

        {/* Talents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTalents.map(talent => (
            <div
              key={`${talent.sourceType}-${talent._id}`}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  {talent.profilePhoto ? (
                    <img
                      src={talent.profilePhoto.url}
                      alt={talent.fullName}
                      className="w-16 h-16 rounded-full border-2 border-[#685EFC]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#685EFC] to-[#12895E] flex items-center justify-center">
                      <User size={32} className="text-white" />
                    </div>
                  )}
                  <CheckCircle
                    className="absolute -bottom-1 -right-1 text-green-600 bg-white rounded-full"
                    size={20}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 truncate mb-1">{talent.fullName}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(talent.status || 'Available')}`}>
                      {talent.status || 'Available'}
                    </span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      talent.sourceType === 'submission' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {talent.sourceType === 'submission' ? 'Submission' : 'Talent DB'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <Briefcase size={16} className="text-[#685EFC]" />
                  <span className="truncate">{talent.preferredRole}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <Mail size={16} className="text-[#685EFC]" />
                  <span className="truncate">{talent.email}</span>
                </div>
                {talent.phoneNumber && (
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <Phone size={16} className="text-[#685EFC]" />
                    <span>{talent.phoneNumber}</span>
                  </div>
                )}
                {talent.bootcamp && (
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <MapPin size={16} className="text-[#685EFC]" />
                    <span className="truncate">{talent.bootcamp.name}</span>
                  </div>
                )}
              </div>

              {talent.assessmentScores && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Assessment Scores</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Tech:</span>{' '}
                      <span className={getScoreColor(talent.assessmentScores.technicalSkills)}>
                        {talent.assessmentScores.technicalSkills}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Comm:</span>{' '}
                      <span className={getScoreColor(talent.assessmentScores.communication)}>
                        {talent.assessmentScores.communication}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Problem:</span>{' '}
                      <span className={getScoreColor(talent.assessmentScores.problemSolving)}>
                        {talent.assessmentScores.problemSolving}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className="text-gray-500 text-xs">Overall:</span>{' '}
                    <span className={`text-lg font-bold ${getScoreColor(talent.assessmentScores.overall)}`}>
                      {talent.assessmentScores.overall}/10
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={() => handleViewDetails(talent)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#685EFC] hover:bg-[#5548d4] text-white rounded-lg text-sm font-semibold transition-all"
              >
                <Eye size={16} />
                <span>View Details</span>
              </button>
            </div>
          ))}
        </div>

        {filteredTalents.length === 0 && !loading && (
          <div className="bg-white rounded-xl p-12 text-center shadow-md">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No vetted talents found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || sourceFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Vetted talents will appear here'}
            </p>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedTalent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-start gap-4">
                    {selectedTalent.profilePhoto ? (
                      <img
                        src={selectedTalent.profilePhoto.url}
                        alt={selectedTalent.fullName}
                        className="w-20 h-20 rounded-full border-2 border-[#685EFC]"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#685EFC] to-[#12895E] flex items-center justify-center">
                        <User size={40} className="text-white" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedTalent.fullName}</h2>
                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedTalent.status || 'Available')}`}>
                          {selectedTalent.status || 'Available'}
                        </span>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedTalent.sourceType === 'submission' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {selectedTalent.sourceType === 'submission' ? 'Submission' : 'Talent DB'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={16} className="text-[#685EFC]" />
                      <span className="text-gray-700">{selectedTalent.email}</span>
                    </div>
                    {selectedTalent.phoneNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={16} className="text-[#685EFC]" />
                        <span className="text-gray-700">{selectedTalent.phoneNumber}</span>
                      </div>
                    )}
                    {selectedTalent.linkedIn && (
                      <div className="flex items-center gap-2 text-sm">
                        <User size={16} className="text-[#685EFC]" />
                        <a href={selectedTalent.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Preferred Role</label>
                      <p className="text-gray-900">{selectedTalent.preferredRole}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Availability</label>
                      <p className="text-gray-900">{selectedTalent.availability}</p>
                    </div>
                    {selectedTalent.source && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Source</label>
                        <p className="text-gray-900">{selectedTalent.source}</p>
                      </div>
                    )}
                    {selectedTalent.bootcamp && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Bootcamp</label>
                        <p className="text-gray-900">{selectedTalent.bootcamp.name}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vetting Information */}
                {selectedTalent.assessmentScores && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center mb-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <h3 className="font-semibold text-green-900">Vetting Assessment</h3>
                    </div>
                    
                    {selectedTalent.vettingNotes && (
                      <div className="mb-4">
                        <label className="text-sm font-medium text-gray-700">Notes</label>
                        <p className="text-gray-800 text-sm mt-1">{selectedTalent.vettingNotes}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Technical Skills</p>
                        <p className={`text-2xl font-bold ${getScoreColor(selectedTalent.assessmentScores.technicalSkills)}`}>
                          {selectedTalent.assessmentScores.technicalSkills}/10
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Communication</p>
                        <p className={`text-2xl font-bold ${getScoreColor(selectedTalent.assessmentScores.communication)}`}>
                          {selectedTalent.assessmentScores.communication}/10
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Problem Solving</p>
                        <p className={`text-2xl font-bold ${getScoreColor(selectedTalent.assessmentScores.problemSolving)}`}>
                          {selectedTalent.assessmentScores.problemSolving}/10
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Cultural Fit</p>
                        <p className={`text-2xl font-bold ${getScoreColor(selectedTalent.assessmentScores.culturalFit)}`}>
                          {selectedTalent.assessmentScores.culturalFit}/10
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Motivation</p>
                        <p className={`text-2xl font-bold ${getScoreColor(selectedTalent.assessmentScores.motivation)}`}>
                          {selectedTalent.assessmentScores.motivation}/10
                        </p>
                      </div>
                      <div className="bg-[#685EFC] rounded-lg p-3">
                        <p className="text-xs text-white mb-1">Overall Score</p>
                        <p className="text-2xl font-bold text-white">
                          {selectedTalent.assessmentScores.overall}/10
                        </p>
                      </div>
                    </div>

                    {selectedTalent.vettedBy && (
                      <div className="mt-3 pt-3 border-t border-green-300">
                        <p className="text-xs text-gray-600">
                          Vetted by: <span className="font-medium">{selectedTalent.vettedBy.fullName || selectedTalent.vettedBy.email}</span>
                        </p>
                        {selectedTalent.vettedAt && (
                          <p className="text-xs text-gray-600">
                            Date: <span className="font-medium">{new Date(selectedTalent.vettedAt).toLocaleDateString()}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Files */}
                {(admin?.permissions?.downloadFiles || admin?.role === 'super_admin') && 
                 (selectedTalent.cvFile || selectedTalent.coverLetterFile) && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Documents</h3>
                    <div className="space-y-2">
                      {selectedTalent.cvFile && (
                        <button
                          onClick={() => handleDownloadFile(selectedTalent._id, 'cv', selectedTalent.cvFile.filename)}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <Download size={16} />
                          <span>Download CV ({selectedTalent.cvFile.filename})</span>
                        </button>
                      )}
                      {selectedTalent.coverLetterFile && (
                        <button
                          onClick={() => handleDownloadFile(selectedTalent._id, 'coverLetter', selectedTalent.coverLetterFile.filename)}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <Download size={16} />
                          <span>Download Cover Letter ({selectedTalent.coverLetterFile.filename})</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Source Badge */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Source Database</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedTalent.sourceType === 'submission' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {selectedTalent.sourceType === 'submission' ? 'Form Submission' : 'Main Talent Database'}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VettedTalentsView;