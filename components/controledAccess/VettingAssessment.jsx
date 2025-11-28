import React, { useState, useEffect } from 'react';
import { Search, Plus, Download, Eye, CheckCircle, AlertCircle, Clock, BarChart3, TrendingDown, Award, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminVettingDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [activeTab, setActiveTab] = useState('submissions');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showSkillGapModal, setShowSkillGapModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedTechStack, setSelectedTechStack] = useState('');
  const [adminScores, setAdminScores] = useState({
    technicalSkills: 0,
    professionalReadiness: 0,
    culturalFit: 0,
    potentialLearningAgility: 0
  });

  // Pagination States
  const [currentPageSubmissions, setCurrentPageSubmissions] = useState(1);
  const [currentPageAssessments, setCurrentPageAssessments] = useState(1);
  const itemsPerPage = 10;

  // Custom Modal States
  const [customModal, setCustomModal] = useState({ show: false, title: '', message: '', type: 'info' }); // info, success, error
  const [creatingAssessment, setCreatingAssessment] = useState(false);

  const TECH_STACKS = [
    'Frontend Developer',
    'Backend Developer',
    'Fullstack Developer',
    'Data Analyst',
    'Data Scientist',
    'General Developer'
  ];

  useEffect(() => {
    if (activeTab === 'submissions') {
      fetchSubmissions();
      setCurrentPageSubmissions(1);
    } else {
      fetchAssessments();
      setCurrentPageAssessments(1);
    }
  }, [activeTab, filterTier]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://juniorforge.onrender.com/api/admin/submissions?type=talent', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
    setLoading(false);
  };

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const tierParam = filterTier !== 'all' ? `?tier=${filterTier}` : '';
      const response = await fetch(`https://juniorforge.onrender.com/api/vetting/admin/assessments${tierParam}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAssessments(data.data);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
    setLoading(false);
  };

  const createAssessment = async () => {
    if (!selectedTechStack) {
      setCustomModal({
        show: true,
        title: 'Missing Tech Stack',
        message: 'Please select a tech stack',
        type: 'error'
      });
      return;
    }

    setCreatingAssessment(true);

    try {
      const response = await fetch(`https://juniorforge.onrender.com/api/vetting/admin/assessment/${selectedSubmission._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ techStack: selectedTechStack })
      });
      const data = await response.json();
      
      if (data.success) {
        setCustomModal({
          show: true,
          title: 'Assessment Created!',
          message: (
            <div className="text-left">
              <p className="mb-3">Send this info to <strong>{data.data.talentName}</strong>:</p>
              <div className="bg-gray-100 p-4 rounded font-mono text-sm">
                <p><strong>Access Token:</strong> {data.data.accessToken}</p>
                <p><strong>Tech Stack:</strong> {data.data.techStack}</p>
                <p><strong>URL:</strong> <a href={data.data.accessUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{data.data.accessUrl}</a></p>
              </div>
            </div>
          ),
          type: 'success'
        });
        setShowCreateModal(false);
        setSelectedSubmission(null);
        setSelectedTechStack('');
        fetchSubmissions();
      } else {
        setCustomModal({
          show: true,
          title: 'Error',
          message: data.message || 'Something went wrong',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error creating assessment:', error);
      setCustomModal({
        show: true,
        title: 'Failed',
        message: 'Failed to create assessment',
        type: 'error'
      });
    } finally {
      setCreatingAssessment(false);
    }
  };

  const updateAdminScores = async (assessmentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/vetting/admin/assessment/${assessmentId}/scores`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminScores)
      });
      const data = await response.json();
      
      if (data.success) {
        setCustomModal({
          show: true,
          title: 'Success',
          message: 'Admin scores updated successfully!',
          type: 'success'
        });
        setShowScoreModal(false);
        fetchAssessments();
      }
    } catch (error) {
      console.error('Error updating scores:', error);
      setCustomModal({
        show: true,
        title: 'Error',
        message: 'Failed to update scores',
        type: 'error'
      });
    }
  };

  const getTierBadge = (tier) => {
    const colors = {
  'Tier 1': 'bg-green-100 text-green-800 border-green-300',
      'Tier 2': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Tier 3': 'bg-red-100 text-red-800 border-red-300'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[tier] || 'bg-gray-100 text-gray-800'}`}>
        {tier}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    const icons = {
      'completed': <CheckCircle className="w-4 h-4 text-green-600" />,
      'in-progress': <Clock className="w-4 h-4 text-blue-600" />,
      'active': <AlertCircle className="w-4 h-4 text-gray-600" />,
      'expired': <AlertCircle className="w-4 h-4 text-red-600" />
    };
    return icons[status] || null;
  };

  const getProficiencyColor = (level) => {
    const colors = {
      'Critical Gap': 'bg-red-100 text-red-800',
      'Needs Development': 'bg-orange-100 text-orange-800',
      'Developing': 'bg-yellow-100 text-yellow-800',
      'Proficient': 'bg-green-100 text-green-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  // Filtering
  const filteredSubmissions = submissions.filter(sub =>
    sub.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssessments = assessments.filter(assessment =>
    assessment.talentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.talentEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPageSubmissions - 1) * itemsPerPage,
    currentPageSubmissions * itemsPerPage
  );

  const paginatedAssessments = filteredAssessments.slice(
    (currentPageAssessments - 1) * itemsPerPage,
    currentPageAssessments * itemsPerPage
  );

  const totalPagesSubmissions = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const totalPagesAssessments = Math.ceil(filteredAssessments.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Vetting Dashboard</h1>
          <p className="text-gray-600">Manage talent assessments and development tracks</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('submissions')}
              className={`p-4 font-medium ${
                activeTab === 'submissions'
                  ? 'border-b-2 border-[#685EFC] text-[#685EFC]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Talent Submissions ({filteredSubmissions.length})
            </button>
            <button
              onClick={() => setActiveTab('assessments')}
              className={`p-4 font-medium ${
                activeTab === 'assessments'
                  ? 'border-b-2 border-[#685EFC] text-[#685EFC]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Assessments & Scores ({filteredAssessments.length})
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#685EFC] focus:border-[#685EFC]"
              />
            </div>
            {activeTab === 'assessments' && (
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#685EFC] focus:border-[#685EFC]"
              >
                <option value="all">All Tiers</option>
                <option value="Tier 1">Tier 1</option>
                <option value="Tier 2">Tier 2</option>
                <option value="Tier 3">Tier 3</option>
              </select>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        ) : (
          <>
            {/* Horizontal Scroll Wrapper */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <div className="min-w-[900px]">
                {activeTab === 'submissions' && (
                  <>
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Talent</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedSubmissions.map((submission) => (
                          <tr key={submission._id} className="hover:bg-gray-50">
                            <td className="p-4">
                              <div className="font-sm text-gray-900">{submission.fullName}</div>
                              <div className="text-xs text-gray-500">{submission.email}</div>
                            </td>
                            <td className="p-4 text-xs text-gray-900">{submission.preferredRole}</td>
                            <td className="p-4 text-xs text-gray-500">
                              {new Date(submission.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                submission.status === 'Converted to Talent' ? 'bg-green-100 text-green-800' :
                                submission.status === 'Vetted' ? 'bg-blue-100 text-[#685EFC]' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {submission.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {!submission.convertedToTalent && (
                                <button
                                  onClick={() => {
                                    setSelectedSubmission(submission);
                                    setShowCreateModal(true);
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 bg-[#685EFC] text-white rounded-lg hover:bg-[#574FDB] transition text-xs"
                                >
                                  <Plus className="w-4 h-4" />
                                  Create Assessment
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination for Submissions */}
                    {totalPagesSubmissions > 1 && (
                      <div className="px-6 py-4 border-t flex items-center justify-between bg-gray-50">
                        <p className="text-sm text-gray-700">
                          Showing {((currentPageSubmissions - 1) * itemsPerPage) + 1} to{' '}
                          {Math.min(currentPageSubmissions * itemsPerPage, filteredSubmissions.length)} of{' '}
                          {filteredSubmissions.length} results
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCurrentPageSubmissions(prev => Math.max(prev - 1, 1))}
                            disabled={currentPageSubmissions === 1}
                            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <span className="text-sm font-medium">
                            Page {currentPageSubmissions} of {totalPagesSubmissions}
                          </span>
                          <button
                            onClick={() => setCurrentPageSubmissions(prev => Math.min(prev + 1, totalPagesSubmissions))}
                            disabled={currentPageSubmissions === totalPagesSubmissions}
                            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'assessments' && (
                  <>
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Talent</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">AI Score</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin Score</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedAssessments.map((assessment) => (
                          <tr key={assessment._id} className="hover:bg-gray-50">
                            <td className="p-4">
                              <div className="font-sm text-gray-900">{assessment.talentName}</div>
                              <div className="text-xs text-gray-500">{assessment.talentEmail}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-400">{assessment.role}</span>
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                  {assessment.techStack}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(assessment.tokenStatus)}
                                <span className="text-xs capitalize">{assessment.tokenStatus}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-lg font-bold text-gray-900">
                                {assessment.score?.percentage || '-'}%
                              </div>
                              <div className="text-xs text-gray-500">
                                {assessment.score?.raw || 0}/100 pts
                              </div>
                            </td>
                            <td className="p-4">
                              {assessment.score?.tier ? getTierBadge(assessment.score.tier) : '-'}
                            </td>
                            <td className="p-4">
                              {assessment.adminScores?.overallAdjusted ? (
                                <div className="text-lg font-semibold text-[#685EFC]">
                                  {assessment.adminScores.overallAdjusted}/100
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">Not scored</span>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedAssessment(assessment);
                                    setShowSkillGapModal(true);
                                  }}
                                  className="px-3 py-1 bg-[#685EFC] text-white text-xs rounded hover:bg-[#574BDB] transition flex items-center gap-1"
                                >
                                  <BarChart3 className="w-4 h-4" />
                                  Skills
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedAssessment(assessment);
                                    setShowScoreModal(true);
                                    setAdminScores(assessment.adminScores || {
                                      technicalSkills: 0,
                                      professionalReadiness: 0,
                                      culturalFit: 0,
                                      potentialLearningAgility: 0
                                    });
                                  }}
                                  className="px-3 py-1 bg-[#16252D] text-white text-xs rounded hover:bg-[#0f1a24] transition"
                                >
                                  Score
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination for Assessments */}
                    {totalPagesAssessments > 1 && (
                      <div className="px-6 py-4 border-t flex items-center justify-between bg-gray-50">
                        <p className="text-sm text-gray-700">
                          Showing {((currentPageAssessments - 1) * itemsPerPage) + 1} to{' '}
                          {Math.min(currentPageAssessments * itemsPerPage, filteredAssessments.length)} of{' '}
                          {filteredAssessments.length} results
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCurrentPageAssessments(prev => Math.max(prev - 1, 1))}
                            disabled={currentPageAssessments === 1}
                            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <span className="text-sm font-medium">
                            Page {currentPageAssessments} of {totalPagesAssessments}
                          </span>
                          <button
                            onClick={() => setCurrentPageAssessments(prev => Math.min(prev + 1, totalPagesAssessments))}
                            disabled={currentPageAssessments === totalPagesAssessments}
                            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Empty State */}
            {(activeTab === 'submissions' && filteredSubmissions.length === 0) ||
             (activeTab === 'assessments' && filteredAssessments.length === 0) ? (
              <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow mt-6">
                No {activeTab === 'submissions' ? 'submissions' : 'assessments'} found
              </div>
            ) : null}
          </>
        )}

        {/* All Modals Below (unchanged) */}
        {/* Create Assessment Modal */}
        {showCreateModal && selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">Create Assessment</h2>
              
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900">{selectedSubmission.fullName}</p>
                <p className="text-sm text-blue-700">{selectedSubmission.email}</p>
                <p className="text-sm text-blue-600 mt-1">Role: {selectedSubmission.preferredRole}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Tech Stack *
                </label>
                <select
                  value={selectedTechStack}
                  onChange={(e) => setSelectedTechStack(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a tech stack...</option>
                  {TECH_STACKS.map(stack => (
                    <option key={stack} value={stack}>{stack}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  This determines the assessment questions and skills evaluated
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={createAssessment}
                  disabled={!selectedTechStack || creatingAssessment}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  {creatingAssessment ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Assessment'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedSubmission(null);
                    setSelectedTechStack('');
                  }}
                  disabled={creatingAssessment}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Skill Gap Modal */}
        {showSkillGapModal && selectedAssessment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Skill Gap Analysis</h2>
                <button
                  onClick={() => setShowSkillGapModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900">{selectedAssessment.talentName}</p>
                <p className="text-sm text-blue-700">{selectedAssessment.talentEmail}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-blue-600">Tech Stack: {selectedAssessment.techStack}</span>
                  <span className="text-sm text-blue-600">Overall Score: {selectedAssessment.score?.percentage}%</span>
                  {selectedAssessment.score?.tier && getTierBadge(selectedAssessment.score.tier)}
                </div>
              </div>

              {selectedAssessment.skillGaps && selectedAssessment.skillGaps.length > 0 ? (
                <div className="space-y-4">
                  {selectedAssessment.skillGaps.map((gap, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <TrendingDown className="w-5 h-5 text-orange-600" />
                          <h3 className="text-lg font-bold">{gap.skill}</h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProficiencyColor(gap.proficiencyLevel)}`}>
                          {gap.proficiencyLevel}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-600">Questions Attempted</p>
                          <p className="text-2xl font-bold text-gray-900">{gap.questionsAttempted}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Correct Answers</p>
                          <p className="text-2xl font-bold text-green-600">{gap.questionsCorrect}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Score</p>
                          <p className="text-2xl font-bold text-blue-600">{gap.percentageScore}%</p>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            gap.percentageScore >= 75 ? 'bg-green-600' :
                            gap.percentageScore >= 60 ? 'bg-yellow-600' :
                            gap.percentageScore >= 40 ? 'bg-orange-600' : 'bg-red-600'
                          }`}
                          style={{width: `${gap.percentageScore}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No skill gap data available
                </div>
              )}

              {selectedAssessment.developmentCourseId && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 font-medium">
                    <Award className="w-5 h-5" />
                    Development course assigned
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admin Scoring Modal */}
        {showScoreModal && selectedAssessment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Admin Scoring</h2>
              
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900">{selectedAssessment.talentName}</p>
                <p className="text-sm text-blue-700">{selectedAssessment.talentEmail}</p>
                <div className="mt-2">
                  <span className="text-sm text-blue-600">AI Assessment Score: </span>
                  <span className="font-bold text-blue-900">{selectedAssessment.score?.percentage}%</span>
                  {selectedAssessment.score?.tier && (
                    <span className="ml-2">{getTierBadge(selectedAssessment.score.tier)}</span>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { key: 'technicalSkills', label: 'Technical Skills', weight: '40%' },
                  { key: 'professionalReadiness', label: 'Professional Readiness', weight: '30%' },
                  { key: 'culturalFit', label: 'Cultural & Behavioral Fit', weight: '20%' },
                  { key: 'potentialLearningAgility', label: 'Potential & Learning Agility', weight: '10%' }
                ].map(({ key, label, weight }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {label} <span className="text-gray-500">({weight})</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={adminScores[key]}
                      onChange={(e) => setAdminScores({
                        ...adminScores,
                        [key]: parseInt(e.target.value) || 0
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => updateAdminScores(selectedAssessment._id)}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Save Scores
                </button>
                <button
                  onClick={() => setShowScoreModal(false)}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Alert Modal */}
        {customModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${customModal.type === 'success' ? 'text-green-600' : customModal.type === 'error' ? 'text-red-600' : 'text-blue-600'}`}>
                  {customModal.title}
                </h3>
                <button onClick={() => setCustomModal({ ...customModal, show: false })} className="text-gray-500 hover:text-gray-700">
                  ×
                </button>
              </div>
              <div className="text-gray-700 mb-6">
                {typeof customModal.message === 'string' ? customModal.message : customModal.message}
              </div>
              <button
                onClick={() => setCustomModal({ ...customModal, show: false })}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVettingDashboard;