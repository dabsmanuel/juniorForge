'use client'
import { useEffect, useState } from 'react';
import { useTalent } from '../../hooks/useTalents';
import { createTalentFormData } from '../../lib/util';
import { Search, Plus, X, Filter, ChevronLeft, ChevronRight, User, Mail, Phone, Briefcase, MapPin, CheckCircle, Eye, Trash2, Edit } from 'lucide-react';

const TalentManagement = ({ token }) => {
  const {
    talents,
    selectedTalent,
    pagination,
    filters,
    loading,
    error,
    fetchTalents,
    fetchTalentById,
    createTalent,
    updateTalent,
    deleteTalent,
    vetTalent,
    updateFilters,
    clearFilters,
    goToPage,
    setSelectedTalent
  } = useTalent(token);

  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [mode, setMode] = useState('create'); // 'create' or 'edit'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    preferredRole: '',
    availability: '',
    source: ''
  });
  const [files, setFiles] = useState({
    profilePhoto: null,
    cvFile: null,
    coverLetterFile: null
  });
  const [currentFiles, setCurrentFiles] = useState({
    profilePhoto: null,
    cvFile: null,
    coverLetterFile: null
  });
  const [showVettingModal, setShowVettingModal] = useState(false);
  const [vettableTalent, setVettableTalent] = useState(null);
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
    fetchTalents();
  }, []);

  useEffect(() => {
    if (selectedTalent && mode === 'edit') {
      setFormData({
        fullName: selectedTalent.fullName || '',
        email: selectedTalent.email || '',
        phoneNumber: selectedTalent.phoneNumber || '',
        preferredRole: selectedTalent.preferredRole || '',
        availability: selectedTalent.availability || '',
        source: selectedTalent.source || ''
      });
      setCurrentFiles({
        profilePhoto: selectedTalent.profilePhoto,
        cvFile: selectedTalent.cvFile,
        coverLetterFile: selectedTalent.coverLetterFile
      });
      setFiles({
        profilePhoto: null,
        cvFile: null,
        coverLetterFile: null
      });
      setShowForm(true);
    }
  }, [selectedTalent, mode]);

  const handleSubmit = async () => {
    try {
      const talentFormData = createTalentFormData(formData, files);
      if (mode === 'create') {
        await createTalent(talentFormData);
        alert('Talent created successfully!');
      } else {
        await updateTalent(selectedTalent._id, talentFormData);
        alert('Talent updated successfully!');
      }
      setShowForm(false);
      resetForm();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleVetSubmit = async () => {
    try {
      await vetTalent(vettableTalent._id, vettingForm);
      alert('Talent vetted successfully!');
      setShowVettingModal(false);
      resetVettingForm();
      fetchTalents(); // Ensure refresh
      if (selectedTalent) {
        fetchTalentById(selectedTalent._id); // Refresh selected if open
      }
    } catch (err) {
      alert('Error vetting talent: ' + err.message);
    }
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    setFiles(prev => ({ ...prev, [fileType]: file }));
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this talent?')) {
      try {
        await deleteTalent(id);
        alert('Talent deleted successfully!');
      } catch (err) {
        alert('Error deleting talent: ' + err.message);
      }
    }
  };

  const startEdit = () => {
    setMode('edit');
  };

  const startVet = (talent) => {
    setVettableTalent(talent);
    setShowVettingModal(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      preferredRole: '',
      availability: '',
      source: ''
    });
    setFiles({
      profilePhoto: null,
      cvFile: null,
      coverLetterFile: null
    });
    setCurrentFiles({
      profilePhoto: null,
      cvFile: null,
      coverLetterFile: null
    });
    setMode('create');
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
  };

  const getStatusColor = (status) => {
    const colors = {
      'Available': 'bg-[#37ffb7] text-[#16252D]',
      'In Review': 'bg-[#685EFC] text-white',
      'Shortlisted': 'bg-[#12895E] text-white',
      'Placed': 'bg-[#c1eddd] text-[#16252D]',
      'Unavailable': 'bg-[#A49595] text-white'
    };
    return colors[status] || 'bg-gray-500 text-white';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#16252D] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#685EFC] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#16252D] text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#685EFC] to-[#12895E] p-8">
        <h1 className="text-4xl font-bold mb-2">Talent Management</h1>
        <p className="text-white/80">Manage and track your talent pipeline</p>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Search and Actions Bar */}
        <div className="bg-[#1a2f3a] rounded-xl p-6 mb-6 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A49595]" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={filters.search}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-[#16252D] border border-[#37ffb7]/20 rounded-lg text-white placeholder-[#A49595] focus:outline-none focus:border-[#37ffb7] transition-colors"
                />
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-[#16252D] hover:bg-[#685EFC] border border-[#685EFC] rounded-lg transition-all duration-200"
              >
                <Filter size={20} />
                <span>Filters</span>
              </button>
              <button
                onClick={() => { setMode('create'); resetForm(); setShowForm(true); }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#685EFC] to-[#12895E] hover:opacity-90 rounded-lg font-semibold transition-all duration-200 shadow-lg"
              >
                <Plus size={20} />
                <span>Add Talent</span>
              </button>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[#37ffb7]/20">
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={filters.status}
                  onChange={(e) => updateFilters({ status: e.target.value })}
                  className="flex-1 px-4 py-3 bg-[#16252D] border border-[#37ffb7]/20 rounded-lg text-white focus:outline-none focus:border-[#37ffb7]"
                >
                  <option value="">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="In Review">In Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Placed">Placed</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
                
                <button
                  onClick={() => fetchTalents()}
                  className="px-6 py-3 bg-[#12895E] hover:bg-[#12895E]/80 rounded-lg font-semibold transition-all"
                >
                  Apply
                </button>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-[#16252D] hover:bg-[#A49595] border border-[#A49595] rounded-lg transition-all"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create/Edit Talent Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a2f3a] rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#37ffb7]">{mode === 'create' ? 'Add New Talent' : 'Edit Talent'}</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-[#16252D] rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#c1eddd]">Full Name *</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-4 py-3 bg-[#16252D] border border-[#37ffb7]/20 rounded-lg text-white focus:outline-none focus:border-[#37ffb7]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#c1eddd]">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-[#16252D] border border-[#37ffb7]/20 rounded-lg text-white focus:outline-none focus:border-[#37ffb7]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#c1eddd]">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="w-full px-4 py-3 bg-[#16252D] border border-[#37ffb7]/20 rounded-lg text-white focus:outline-none focus:border-[#37ffb7]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#c1eddd]">Preferred Role *</label>
                    <select
                      value={formData.preferredRole}
                      onChange={(e) => setFormData({...formData, preferredRole: e.target.value})}
                      className="w-full px-4 py-3 bg-[#16252D] border border-[#37ffb7]/20 rounded-lg text-white focus:outline-none focus:border-[#37ffb7]"
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="Junior Software Developer">Junior Software Developer</option>
                      <option value="Frontend Developer">Frontend Developer</option>
                      <option value="Backend Developer">Backend Developer</option>
                      <option value="Full Stack Developer">Full Stack Developer</option>
                      <option value="Mobile Developer">Mobile Developer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#c1eddd]">Availability *</label>
                    <select
                      value={formData.availability}
                      onChange={(e) => setFormData({...formData, availability: e.target.value})}
                      className="w-full px-4 py-3 bg-[#16252D] border border-[#37ffb7]/20 rounded-lg text-white focus:outline-none focus:border-[#37ffb7]"
                      required
                    >
                      <option value="">Select Availability</option>
                      <option value="Immediately">Immediately</option>
                      <option value="Within 2 weeks">Within 2 weeks</option>
                      <option value="Within 1 month">Within 1 month</option>
                      <option value="Within 3 months">Within 3 months</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#c1eddd]">Source *</label>
                    <select
                      value={formData.source}
                      onChange={(e) => setFormData({...formData, source: e.target.value})}
                      className="w-full px-4 py-3 bg-[#16252D] border border-[#37ffb7]/20 rounded-lg text-white focus:outline-none focus:border-[#37ffb7]"
                      required
                    >
                      <option value="">Select Source</option>
                      <option value="Direct Application">Direct Application</option>
                      <option value="Bootcamp">Bootcamp</option>
                      <option value="Training Center">Training Center</option>
                      <option value="University">University</option>
                      <option value="Referral">Referral</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#c1eddd]">Profile Photo</label>
                    {currentFiles.profilePhoto && (
                      <div className="mb-2">
                        <img src={currentFiles.profilePhoto.url} alt="Current Profile" className="w-20 h-20 rounded-full" />
                        <span className="ml-2 text-[#c1eddd]">Current: {currentFiles.profilePhoto.filename}</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'profilePhoto')}
                      className="w-full px-4 py-3 bg-[#16252D] border border-[#37ffb7]/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#685EFC] file:text-white hover:file:bg-[#685EFC]/80 file:cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#c1eddd]">CV</label>
                    {currentFiles.cvFile && (
                      <div className="mb-2 text-[#c1eddd]">Current: {currentFiles.cvFile.filename}</div>
                    )}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, 'cvFile')}
                      className="w-full px-4 py-3 bg-[#16252D] border border-[#37ffb7]/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#685EFC] file:text-white hover:file:bg-[#685EFC]/80 file:cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#c1eddd]">Cover Letter</label>
                    {currentFiles.coverLetterFile && (
                      <div className="mb-2 text-[#c1eddd]">Current: {currentFiles.coverLetterFile.filename}</div>
                    )}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, 'coverLetterFile')}
                      className="w-full px-4 py-3 bg-[#16252D] border border-[#37ffb7]/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#685EFC] file:text-white hover:file:bg-[#685EFC]/80 file:cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 py-3 bg-gradient-to-r from-[#685EFC] to-[#12895E] hover:opacity-90 rounded-lg font-semibold transition-all"
                  >
                    {mode === 'create' ? 'Create Talent' : 'Update Talent'}
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 bg-[#16252D] hover:bg-[#A49595] border border-[#A49595] rounded-lg font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vetting Modal */}
        {showVettingModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a2f3a] rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#37ffb7]">Vet Talent: {vettableTalent.fullName}</h2>
                <button
                  onClick={() => setShowVettingModal(false)}
                  className="p-2 hover:bg-[#16252D] rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#c1eddd]">Vetting Notes</label>
                  <textarea
                    value={vettingForm.vettingNotes}
                    onChange={(e) => setVettingForm({...vettingForm, vettingNotes: e.target.value})}
                    className="w-full px-4 py-3 bg-[#16252D] border border-[#37ffb7]/20 rounded-lg text-white focus:outline-none focus:border-[#37ffb7] min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#c1eddd]">Technical Skills (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={vettingForm.assessmentScores.technicalSkills}
                      onChange={(e) => setVettingForm({
                        ...vettingForm,
                        assessmentScores: {...vettingForm.assessmentScores, technicalSkills: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-4 py-3 bg-[#16252D] border border-[#37ffb7]/20 rounded-lg text-white focus:outline-none focus:border-[#37ffb7]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#c1eddd]">Communication (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={vettingForm.assessmentScores.communication}
                      onChange={(e) => setVettingForm({
                        ...vettingForm,
                        assessmentScores: {...vettingForm.assessmentScores, communication: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-4 py-3 bg-[#16252D] border border-[#37ffb7]/20 rounded-lg text-white focus:outline-none focus:border-[#37ffb7]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#c1eddd]">Problem Solving (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={vettingForm.assessmentScores.problemSolving}
                      onChange={(e) => setVettingForm({
                        ...vettingForm,
                        assessmentScores: {...vettingForm.assessmentScores, problemSolving: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-4 py-3 bg-[#16252D] border border-[#37ffb7]/20 rounded-lg text-white focus:outline-none focus:border-[#37ffb7]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#c1eddd]">Cultural Fit (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={vettingForm.assessmentScores.culturalFit}
                      onChange={(e) => setVettingForm({
                        ...vettingForm,
                        assessmentScores: {...vettingForm.assessmentScores, culturalFit: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-4 py-3 bg-[#16252D] border border-[#37ffb7]/20 rounded-lg text-white focus:outline-none focus:border-[#37ffb7]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#c1eddd]">Motivation (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={vettingForm.assessmentScores.motivation}
                      onChange={(e) => setVettingForm({
                        ...vettingForm,
                        assessmentScores: {...vettingForm.assessmentScores, motivation: parseInt(e.target.value) || 0}
                      })}
                      className="w-full px-4 py-3 bg-[#16252D] border border-[#37ffb7]/20 rounded-lg text-white focus:outline-none focus:border-[#37ffb7]"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={handleVetSubmit}
                    className="flex-1 py-3 bg-gradient-to-r from-[#685EFC] to-[#12895E] hover:opacity-90 rounded-lg font-semibold transition-all"
                  >
                    Submit Vetting
                  </button>
                  <button
                    onClick={() => setShowVettingModal(false)}
                    className="flex-1 py-3 bg-[#16252D] hover:bg-[#A49595] border border-[#A49595] rounded-lg font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Talent Detail Modal */}
        {selectedTalent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a2f3a] rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#37ffb7]">Talent Details: {selectedTalent.fullName}</h2>
                <button
                  onClick={() => setSelectedTalent(null)}
                  className="p-2 hover:bg-[#16252D] rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  {selectedTalent.profilePhoto ? (
                    <img src={selectedTalent.profilePhoto.url} alt={selectedTalent.fullName} className="w-24 h-24 rounded-full" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#685EFC] to-[#12895E] flex items-center justify-center">
                      <User size={48} />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold">{selectedTalent.fullName}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedTalent.status)}`}>
                      {selectedTalent.status}
                    </span>
                    {selectedTalent.vetted && <CheckCircle className="text-[#37ffb7] ml-2" size={20} />}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2"><Mail size={16} className="text-[#37ffb7]" /> {selectedTalent.email}</div>
                  {selectedTalent.phoneNumber && <div className="flex items-center gap-2"><Phone size={16} className="text-[#37ffb7]" /> {selectedTalent.phoneNumber}</div>}
                  <div className="flex items-center gap-2"><Briefcase size={16} className="text-[#37ffb7]" /> {selectedTalent.preferredRole}</div>
                  <div>Availability: {selectedTalent.availability}</div>
                  <div>Source: {selectedTalent.source}</div>
                  {selectedTalent.bootcamp && <div className="flex items-center gap-2"><MapPin size={16} className="text-[#37ffb7]" /> {selectedTalent.bootcamp.name}</div>}
                </div>

                <div>
                  <h4 className="font-bold mb-2">Documents</h4>
                  {selectedTalent.cvFile && <a href={selectedTalent.cvFile.url} target="_blank" rel="noopener noreferrer" className="block text-[#37ffb7] hover:underline">View CV ({selectedTalent.cvFile.filename})</a>}
                  {selectedTalent.coverLetterFile && <a href={selectedTalent.coverLetterFile.url} target="_blank" rel="noopener noreferrer" className="block text-[#37ffb7] hover:underline">View Cover Letter ({selectedTalent.coverLetterFile.filename})</a>}
                </div>

                {selectedTalent.vetted && (
                  <div>
                    <h4 className="font-bold mb-2">Vetting Information</h4>
                    <p>Notes: {selectedTalent.vettingNotes}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>Technical: {selectedTalent.assessmentScores.technicalSkills}</div>
                      <div>Communication: {selectedTalent.assessmentScores.communication}</div>
                      <div>Problem Solving: {selectedTalent.assessmentScores.problemSolving}</div>
                      <div>Cultural Fit: {selectedTalent.assessmentScores.culturalFit}</div>
                      <div>Motivation: {selectedTalent.assessmentScores.motivation}</div>
                      <div>Overall: {selectedTalent.assessmentScores.overall}</div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4 border-t border-[#37ffb7]/20">
                  <button
                    onClick={startEdit}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#685EFC] hover:bg-[#685EFC]/80 rounded-lg text-sm font-semibold transition-all"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                  {!selectedTalent.vetted && (
                    <button
                      onClick={() => startVet(selectedTalent)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#12895E] hover:bg-[#12895E]/80 rounded-lg text-sm font-semibold transition-all"
                    >
                      <CheckCircle size={16} />
                      <span>Vet</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedTalent._id)}
                    className="px-3 py-2 bg-[#16252D] hover:bg-red-500 border border-red-500/50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Talents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {talents.map(talent => (
            <div
              key={talent._id}
              className="bg-[#1a2f3a] rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-[#37ffb7]/10"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  {talent.profilePhoto ? (
                    <img
                      src={talent.profilePhoto.url}
                      alt={talent.fullName}
                      className="w-16 h-16 rounded-full border-2 border-[#37ffb7]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#685EFC] to-[#12895E] flex items-center justify-center">
                      <User size={32} />
                    </div>
                  )}
                  {talent.vetted && (
                    <CheckCircle
                      className="absolute -bottom-1 -right-1 text-[#37ffb7] bg-[#16252D] rounded-full"
                      size={20}
                    />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-white truncate mb-1">{talent.fullName}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(talent.status)}`}>
                    {talent.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-[#c1eddd] text-sm">
                  <Briefcase size={16} className="text-[#37ffb7]" />
                  <span className="truncate">{talent.preferredRole}</span>
                </div>
                <div className="flex items-center gap-2 text-[#c1eddd] text-sm">
                  <Mail size={16} className="text-[#37ffb7]" />
                  <span className="truncate">{talent.email}</span>
                </div>
                {talent.phoneNumber && (
                  <div className="flex items-center gap-2 text-[#c1eddd] text-sm">
                    <Phone size={16} className="text-[#37ffb7]" />
                    <span>{talent.phoneNumber}</span>
                  </div>
                )}
                {talent.bootcamp && (
                  <div className="flex items-center gap-2 text-[#c1eddd] text-sm">
                    <MapPin size={16} className="text-[#37ffb7]" />
                    <span className="truncate">{talent.bootcamp.name}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-[#37ffb7]/20">
                <button
                  onClick={() => fetchTalentById(talent._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#685EFC] hover:bg-[#685EFC]/80 rounded-lg text-sm font-semibold transition-all"
                >
                  <Eye size={16} />
                  <span>View</span>
                </button>
                {!talent.vetted && (
                  <button
                    onClick={() => startVet(talent)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#12895E] hover:bg-[#12895E]/80 rounded-lg text-sm font-semibold transition-all"
                  >
                    <CheckCircle size={16} />
                    <span>Vet</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(talent._id)}
                  className="px-3 py-2 bg-[#16252D] hover:bg-red-500 border border-red-500/50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="bg-[#1a2f3a] rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <button
              onClick={() => goToPage(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="flex items-center gap-2 px-4 py-2 bg-[#16252D] hover:bg-[#685EFC] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
            >
              <ChevronLeft size={20} />
              <span>Previous</span>
            </button>
            
            <span className="text-[#c1eddd]">
              Page <span className="text-[#37ffb7] font-semibold">{pagination.page}</span> of{' '}
              <span className="text-[#37ffb7] font-semibold">{pagination.pages}</span>
            </span>
            
            <button
              onClick={() => goToPage(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="flex items-center gap-2 px-4 py-2 bg-[#16252D] hover:bg-[#685EFC] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
            >
              <span>Next</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentManagement;