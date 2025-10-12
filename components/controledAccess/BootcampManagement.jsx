'use client'
import { useEffect, useState } from 'react';
import { useBootcamp } from '../../hooks/useBootcamps';
import { 
  Plus, Building2, Mail, Phone, Globe, Users, Trash2, Eye, 
  RefreshCw, X, Check, Edit, MapPin, Calendar, FileText, 
  BarChart3, UserCheck, GraduationCap, User, Briefcase,
  DollarSign, Star, FileCheck, Clock, AlertCircle
} from 'lucide-react';

const BootcampManagement = ({ token }) => {
  const {
    bootcamps,
    selectedBootcamp,
    bootcampTalents,
    loading,
    error,
    fetchBootcamps,
    fetchBootcampById,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    fetchBootcampTalents,
    updateBootcampStats
  } = useBootcamp(token);

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showTalents, setShowTalents] = useState(false);
  const [editingBootcamp, setEditingBootcamp] = useState(null);
  const [activeFormSection, setActiveFormSection] = useState('basic');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    type: 'Bootcamp',
    email: '',
    phoneNumber: '',
    website: '',
    
    // Location
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      isRemote: false
    },
    
    // Contact Person
    contactPerson: {
      name: '',
      email: '',
      phoneNumber: '',
      position: ''
    },
    
    // Partnership Details
    partnershipStatus: 'Prospective',
    partnershipStartDate: '',
    partnershipEndDate: '',
    
    // Programs
    programs: [{
      name: '',
      duration: '',
      focus: 'Software Development',
      description: ''
    }],
    
    // Specializations
    specializations: [],
    
    // Statistics
    statistics: {
      totalGraduates: 0,
      talentsPlaced: 0,
      averagePlacementRate: 0,
      currentStudents: 0
    },
    
    // Agreement
    agreement: {
      signed: false,
      signedDate: '',
      documentUrl: '',
      terms: ''
    },
    
    // Commission
    commission: {
      percentage: 0,
      type: 'None',
      amount: 0
    },
    
    // Notes & Rating
    internalNotes: '',
    rating: 0,
    
    // Status
    status: 'Active'
  });

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const admin = await authApi.getCurrentAdmin(token);
        setIsSuperAdmin(admin.role === 'superadmin');
      } catch (err) {
        console.error('Error fetching admin profile:', err);
      }
    };

    checkAdminRole();
    fetchBootcamps();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      alert('You do not have permission to perform this action.');
      return;
    }
    try {
      // Prepare data for submission
      const submissionData = {
        ...formData,
        partnershipStartDate: formData.partnershipStartDate || undefined,
        partnershipEndDate: formData.partnershipEndDate || undefined,
        'agreement.signedDate': formData.agreement.signedDate || undefined
      };

      if (editingBootcamp) {
        await updateBootcamp(editingBootcamp._id, submissionData);
        alert('Bootcamp updated successfully!');
      } else {
        await createBootcamp(submissionData);
        alert('Bootcamp created successfully!');
      }
      setShowForm(false);
      resetForm();
    } catch (err) {
      alert(`Error ${editingBootcamp ? 'updating' : 'creating'} bootcamp: ` + err.message);
    }
  };

  const handleEdit = (bootcamp) => {
    if (!isSuperAdmin) {
      alert('You do not have permission to perform this action.');
      return;
    }
    setEditingBootcamp(bootcamp);
    setFormData({
      name: bootcamp.name || '',
      type: bootcamp.type || 'Bootcamp',
      email: bootcamp.email || '',
      phoneNumber: bootcamp.phoneNumber || '',
      website: bootcamp.website || '',
      location: bootcamp.location || {
        address: '', city: '', state: '', country: '', isRemote: false
      },
      contactPerson: bootcamp.contactPerson || {
        name: '', email: '', phoneNumber: '', position: ''
      },
      partnershipStatus: bootcamp.partnershipStatus || 'Prospective',
      partnershipStartDate: bootcamp.partnershipStartDate ? 
        new Date(bootcamp.partnershipStartDate).toISOString().split('T')[0] : '',
      partnershipEndDate: bootcamp.partnershipEndDate ? 
        new Date(bootcamp.partnershipEndDate).toISOString().split('T')[0] : '',
      programs: bootcamp.programs || [{
        name: '', duration: '', focus: 'Software Development', description: ''
      }],
      specializations: bootcamp.specializations || [],
      statistics: bootcamp.statistics || {
        totalGraduates: 0, talentsPlaced: 0, averagePlacementRate: 0, currentStudents: 0
      },
      agreement: bootcamp.agreement || {
        signed: false, signedDate: '', documentUrl: '', terms: ''
      },
      commission: bootcamp.commission || {
        percentage: 0, type: 'None', amount: 0
      },
      internalNotes: bootcamp.internalNotes || '',
      rating: bootcamp.rating || 0,
      status: bootcamp.status || 'Active'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!isSuperAdmin) {
      alert('You do not have permission to perform this action.');
      return;
    }
    if (confirm('Are you sure you want to delete this bootcamp?')) {
      try {
        await deleteBootcamp(id);
        alert('Bootcamp deleted successfully!');
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }
  };

  const handleViewDetails = async (bootcampId) => {
    try {
      await fetchBootcampById(bootcampId);
      setShowDetails(true);
    } catch (err) {
      alert('Error fetching bootcamp details: ' + err.message);
    }
  };

  const handleViewTalents = async (bootcampId) => {
    try {
      await fetchBootcampTalents(bootcampId);
      setShowTalents(true);
    } catch (err) {
      alert('Error fetching talents: ' + err.message);
    }
  };

  // Form field handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleProgramChange = (index, field, value) => {
    const updatedPrograms = [...formData.programs];
    updatedPrograms[index] = {
      ...updatedPrograms[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      programs: updatedPrograms
    }));
  };

  const addProgram = () => {
    setFormData(prev => ({
      ...prev,
      programs: [
        ...prev.programs,
        { name: '', duration: '', focus: 'Software Development', description: '' }
      ]
    }));
  };

  const removeProgram = (index) => {
    if (formData.programs.length > 1) {
      setFormData(prev => ({
        ...prev,
        programs: prev.programs.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSpecializationChange = (specialization) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }));
  };

  const resetForm = () => {
    setEditingBootcamp(null);
    setActiveFormSection('basic');
    setFormData({
      name: '',
      type: 'Bootcamp',
      email: '',
      phoneNumber: '',
      website: '',
      location: { address: '', city: '', state: '', country: '', isRemote: false },
      contactPerson: { name: '', email: '', phoneNumber: '', position: '' },
      partnershipStatus: 'Prospective',
      partnershipStartDate: '',
      partnershipEndDate: '',
      programs: [{ name: '', duration: '', focus: 'Software Development', description: '' }],
      specializations: [],
      statistics: { totalGraduates: 0, talentsPlaced: 0, averagePlacementRate: 0, currentStudents: 0 },
      agreement: { signed: false, signedDate: '', documentUrl: '', terms: '' },
      commission: { percentage: 0, type: 'None', amount: 0 },
      internalNotes: '',
      rating: 0,
      status: 'Active'
    });
  };

  const handleFormClose = () => {
    setShowForm(false);
    resetForm();
  };

  const handleDetailsClose = () => {
    setShowDetails(false);
  };

  const handleTalentsClose = () => {
    setShowTalents(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-[#12895E] text-white';
      case 'Prospective': return 'bg-[#685EFC] text-white';
      case 'Inactive': return 'bg-[#A49595] text-white';
      case 'Paused': return 'bg-[#16252D] text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const specializationOptions = [
    'Frontend Development',
    'Backend Development',
    'Full Stack Development',
    'Mobile Development',
    'Data Analytics',
    'UI/UX Design',
    'Digital Marketing',
    'Product Management',
    'Business Analysis',
    'Other'
  ];

  const programFocusOptions = [
    'Software Development',
    'Data Science',
    'UX/UI Design',
    'Digital Marketing',
    'Business Operations',
    'Other'
  ];

  const commissionTypes = ['Per Placement', 'Monthly', 'Quarterly', 'Annual', 'None'];

  if (loading && bootcamps.length === 0) return (
    <div className="min-h-screen bg-gradient-to-br from-[#16252D] to-[#0a1419] flex items-center justify-center">
      <div className="text-[#37ffb7] text-xl">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#16252D] to-[#0a1419] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Bootcamp Management</h1>
          <p className="text-[#c1eddd]">Manage your bootcamp partnerships and track performance</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#16252D] border border-[#37ffb7]/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{bootcamps.length}</p>
                <p className="text-[#c1eddd] text-sm">Total Bootcamps</p>
              </div>
              <Building2 className="text-[#37ffb7]" size={24} />
            </div>
          </div>
          <div className="bg-[#16252D] border border-[#37ffb7]/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  {bootcamps.filter(b => b.partnershipStatus === 'Active').length}
                </p>
                <p className="text-[#c1eddd] text-sm">Active Partnerships</p>
              </div>
              <UserCheck className="text-[#12895E]" size={24} />
            </div>
          </div>
          <div className="bg-[#16252D] border border-[#37ffb7]/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  {bootcamps.reduce((total, b) => total + (b.statistics?.totalGraduates || 0), 0)}
                </p>
                <p className="text-[#c1eddd] text-sm">Total Graduates</p>
              </div>
              <GraduationCap className="text-[#685EFC]" size={24} />
            </div>
          </div>
          <div className="bg-[#16252D] border border-[#37ffb7]/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  {bootcamps.reduce((total, b) => total + (b.statistics?.talentsPlaced || 0), 0)}
                </p>
                <p className="text-[#c1eddd] text-sm">Talents Placed</p>
              </div>
              <BarChart3 className="text-[#FF6B35]" size={24} />
            </div>
          </div>
        </div>

        {/* Add Button */}
        {isSuperAdmin && (
          <button 
            onClick={() => setShowForm(true)}
            className="mb-8 bg-[#685EFC] hover:bg-[#5749d4] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Add New Bootcamp
          </button>
        )}

        {/* Bootcamp Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#16252D] rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#37ffb7]/20">
              <div className="sticky top-0 bg-[#16252D] border-b border-[#37ffb7]/20 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                  {editingBootcamp ? 'Edit Bootcamp' : 'Add New Bootcamp'}
                </h2>
                <button onClick={handleFormClose} className="text-[#A49595] hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              {/* Form Navigation */}
              <div className="border-b border-[#37ffb7]/20">
                <div className="flex overflow-x-auto">
                  {['basic', 'contact', 'partnership', 'programs', 'financial', 'additional'].map(section => (
                    <button
                      key={section}
                      onClick={() => setActiveFormSection(section)}
                      className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                        activeFormSection === section
                          ? 'border-[#37ffb7] text-[#37ffb7]'
                          : 'border-transparent text-[#c1eddd] hover:text-white'
                      }`}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  {/* Basic Information Section */}
                  {activeFormSection === 'basic' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                      
                      <div>
                        <label className="block text-[#c1eddd] mb-2 text-sm font-medium">Bootcamp Name *</label>
                        <input
                          type="text"
                          placeholder="Enter bootcamp name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full bg-[#0a1419] border border-[#37ffb7]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[#c1eddd] mb-2 text-sm font-medium">Type *</label>
                        <select
                          value={formData.type}
                          onChange={(e) => handleInputChange('type', e.target.value)}
                          className="w-full bg-[#0a1419] border border-[#37ffb7]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                        >
                          <option value="Bootcamp">Bootcamp</option>
                          <option value="Training Center">Training Center</option>
                          <option value="University">University</option>
                          <option value="Online Platform">Online Platform</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#c1eddd] mb-2 text-sm font-medium">Email *</label>
                        <input
                          type="email"
                          placeholder="contact@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full bg-[#0a1419] border border-[#37ffb7]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#c1eddd] mb-2 text-sm font-medium">Phone Number</label>
                          <input
                            type="tel"
                            placeholder="+1234567890"
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            className="w-full bg-[#0a1419] border border-[#37ffb7]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[#c1eddd] mb-2 text-sm font-medium">Website</label>
                          <input
                            type="url"
                            placeholder="https://example.com"
                            value={formData.website}
                            onChange={(e) => handleInputChange('website', e.target.value)}
                            className="w-full bg-[#0a1419] border border-[#37ffb7]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact Information Section */}
                  {activeFormSection === 'contact' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                      
                      <div className="bg-[#0a1419] border border-[#37ffb7]/10 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                          <User className="text-[#37ffb7]" size={16} />
                          Contact Person
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[#c1eddd] mb-2 text-sm">Name</label>
                            <input
                              type="text"
                              placeholder="Contact person name"
                              value={formData.contactPerson.name}
                              onChange={(e) => handleNestedInputChange('contactPerson', 'name', e.target.value)}
                              className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[#c1eddd] mb-2 text-sm">Position</label>
                            <input
                              type="text"
                              placeholder="Position"
                              value={formData.contactPerson.position}
                              onChange={(e) => handleNestedInputChange('contactPerson', 'position', e.target.value)}
                              className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[#c1eddd] mb-2 text-sm">Email</label>
                            <input
                              type="email"
                              placeholder="person@example.com"
                              value={formData.contactPerson.email}
                              onChange={(e) => handleNestedInputChange('contactPerson', 'email', e.target.value)}
                              className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[#c1eddd] mb-2 text-sm">Phone</label>
                            <input
                              type="tel"
                              placeholder="+1234567890"
                              value={formData.contactPerson.phoneNumber}
                              onChange={(e) => handleNestedInputChange('contactPerson', 'phoneNumber', e.target.value)}
                              className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#0a1419] border border-[#37ffb7]/10 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                          <MapPin className="text-[#37ffb7]" size={16} />
                          Location
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label className="block text-[#c1eddd] mb-2 text-sm">Address</label>
                            <input
                              type="text"
                              placeholder="Street address"
                              value={formData.location.address}
                              onChange={(e) => handleNestedInputChange('location', 'address', e.target.value)}
                              className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[#c1eddd] mb-2 text-sm">City</label>
                            <input
                              type="text"
                              placeholder="City"
                              value={formData.location.city}
                              onChange={(e) => handleNestedInputChange('location', 'city', e.target.value)}
                              className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[#c1eddd] mb-2 text-sm">State</label>
                            <input
                              type="text"
                              placeholder="State"
                              value={formData.location.state}
                              onChange={(e) => handleNestedInputChange('location', 'state', e.target.value)}
                              className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[#c1eddd] mb-2 text-sm">Country</label>
                            <input
                              type="text"
                              placeholder="Country"
                              value={formData.location.country}
                              onChange={(e) => handleNestedInputChange('location', 'country', e.target.value)}
                              className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="flex items-center gap-2 text-[#c1eddd] text-sm">
                              <input
                                type="checkbox"
                                checked={formData.location.isRemote}
                                onChange={(e) => handleNestedInputChange('location', 'isRemote', e.target.checked)}
                                className="rounded border-[#37ffb7]/30 bg-[#16252D] text-[#37ffb7] focus:ring-[#37ffb7]"
                              />
                              This is a remote bootcamp
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Partnership Section */}
                  {activeFormSection === 'partnership' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Partnership Details</h3>
                      
                      <div>
                        <label className="block text-[#c1eddd] mb-2 text-sm font-medium">Partnership Status</label>
                        <select
                          value={formData.partnershipStatus}
                          onChange={(e) => handleInputChange('partnershipStatus', e.target.value)}
                          className="w-full bg-[#0a1419] border border-[#37ffb7]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                        >
                          <option value="Prospective">Prospective</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Paused">Paused</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#c1eddd] mb-2 text-sm">Start Date</label>
                          <input
                            type="date"
                            value={formData.partnershipStartDate}
                            onChange={(e) => handleInputChange('partnershipStartDate', e.target.value)}
                            className="w-full bg-[#0a1419] border border-[#37ffb7]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[#c1eddd] mb-2 text-sm">End Date</label>
                          <input
                            type="date"
                            value={formData.partnershipEndDate}
                            onChange={(e) => handleInputChange('partnershipEndDate', e.target.value)}
                            className="w-full bg-[#0a1419] border border-[#37ffb7]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                          />
                        </div>
                      </div>

                      <div className="bg-[#0a1419] border border-[#37ffb7]/10 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                          <FileCheck className="text-[#37ffb7]" size={16} />
                          Agreement Details
                        </h4>
                        <div className="space-y-4">
                          <label className="flex items-center gap-2 text-[#c1eddd] text-sm">
                            <input
                              type="checkbox"
                              checked={formData.agreement.signed}
                              onChange={(e) => handleNestedInputChange('agreement', 'signed', e.target.checked)}
                              className="rounded border-[#37ffb7]/30 bg-[#16252D] text-[#37ffb7] focus:ring-[#37ffb7]"
                            />
                            Agreement Signed
                          </label>
                          
                          {formData.agreement.signed && (
                            <div>
                              <label className="block text-[#c1eddd] mb-2 text-sm">Signed Date</label>
                              <input
                                type="date"
                                value={formData.agreement.signedDate}
                                onChange={(e) => handleNestedInputChange('agreement', 'signedDate', e.target.value)}
                                className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                              />
                            </div>
                          )}
                          
                          <div>
                            <label className="block text-[#c1eddd] mb-2 text-sm">Document URL</label>
                            <input
                              type="url"
                              placeholder="https://example.com/agreement.pdf"
                              value={formData.agreement.documentUrl}
                              onChange={(e) => handleNestedInputChange('agreement', 'documentUrl', e.target.value)}
                              className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-[#c1eddd] mb-2 text-sm">Terms & Conditions</label>
                            <textarea
                              placeholder="Agreement terms and conditions"
                              value={formData.agreement.terms}
                              onChange={(e) => handleNestedInputChange('agreement', 'terms', e.target.value)}
                              rows="3"
                              className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Programs Section */}
                  {activeFormSection === 'programs' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Programs & Specializations</h3>
                      
                      <div className="bg-[#0a1419] border border-[#37ffb7]/10 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                          <Briefcase className="text-[#37ffb7]" size={16} />
                          Programs Offered
                        </h4>
                        <div className="space-y-4">
                          {formData.programs.map((program, index) => (
                            <div key={index} className="border border-[#37ffb7]/20 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-3">
                                <h5 className="text-white font-medium">Program {index + 1}</h5>
                                {formData.programs.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeProgram(index)}
                                    className="text-red-500 hover:text-red-400 text-sm"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[#c1eddd] mb-2 text-sm">Program Name</label>
                                  <input
                                    type="text"
                                    placeholder="e.g., Full Stack Development"
                                    value={program.name}
                                    onChange={(e) => handleProgramChange(index, 'name', e.target.value)}
                                    className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[#c1eddd] mb-2 text-sm">Duration</label>
                                  <input
                                    type="text"
                                    placeholder="e.g., 12 weeks, 6 months"
                                    value={program.duration}
                                    onChange={(e) => handleProgramChange(index, 'duration', e.target.value)}
                                    className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[#c1eddd] mb-2 text-sm">Focus Area</label>
                                  <select
                                    value={program.focus}
                                    onChange={(e) => handleProgramChange(index, 'focus', e.target.value)}
                                    className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                                  >
                                    {programFocusOptions.map(option => (
                                      <option key={option} value={option}>{option}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-[#c1eddd] mb-2 text-sm">Description</label>
                                  <textarea
                                    placeholder="Program description"
                                    value={program.description}
                                    onChange={(e) => handleProgramChange(index, 'description', e.target.value)}
                                    rows="2"
                                    className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addProgram}
                            className="w-full border-2 border-dashed border-[#37ffb7]/30 text-[#37ffb7] py-3 rounded-lg hover:border-[#37ffb7] hover:bg-[#37ffb7]/10 transition-colors"
                          >
                            + Add Another Program
                          </button>
                        </div>
                      </div>

                      <div className="bg-[#0a1419] border border-[#37ffb7]/10 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-white mb-3">Specializations</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {specializationOptions.map(specialization => (
                            <label key={specialization} className="flex items-center gap-2 text-[#c1eddd] text-sm">
                              <input
                                type="checkbox"
                                checked={formData.specializations.includes(specialization)}
                                onChange={() => handleSpecializationChange(specialization)}
                                className="rounded border-[#37ffb7]/30 bg-[#16252D] text-[#37ffb7] focus:ring-[#37ffb7]"
                              />
                              {specialization}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Financial Section */}
                  {activeFormSection === 'financial' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Financial Details</h3>
                      
                      <div className="bg-[#0a1419] border border-[#37ffb7]/10 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                          <DollarSign className="text-[#37ffb7]" size={16} />
                          Commission Structure
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[#c1eddd] mb-2 text-sm">Commission Type</label>
                            <select
                              value={formData.commission.type}
                              onChange={(e) => handleNestedInputChange('commission', 'type', e.target.value)}
                              className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                            >
                              {commissionTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[#c1eddd] mb-2 text-sm">Percentage (%)</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              placeholder="0"
                              value={formData.commission.percentage}
                              onChange={(e) => handleNestedInputChange('commission', 'percentage', parseFloat(e.target.value) || 0)}
                              className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[#c1eddd] mb-2 text-sm">Fixed Amount</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              value={formData.commission.amount}
                              onChange={(e) => handleNestedInputChange('commission', 'amount', parseFloat(e.target.value) || 0)}
                              className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#0a1419] border border-[#37ffb7]/10 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                          <BarChart3 className="text-[#37ffb7]" size={16} />
                          Statistics
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[#c1eddd] mb-2 text-sm">Total Graduates</label>
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={formData.statistics.totalGraduates}
                              onChange={(e) => handleNestedInputChange('statistics', 'totalGraduates', parseInt(e.target.value) || 0)}
                              className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[#c1eddd] mb-2 text-sm">Talents Placed</label>
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={formData.statistics.talentsPlaced}
                              onChange={(e) => handleNestedInputChange('statistics', 'talentsPlaced', parseInt(e.target.value) || 0)}
                              className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[#c1eddd] mb-2 text-sm">Placement Rate (%)</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="0"
                              value={formData.statistics.averagePlacementRate}
                              onChange={(e) => handleNestedInputChange('statistics', 'averagePlacementRate', parseFloat(e.target.value) || 0)}
                              className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[#c1eddd] mb-2 text-sm">Current Students</label>
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={formData.statistics.currentStudents}
                              onChange={(e) => handleNestedInputChange('statistics', 'currentStudents', parseInt(e.target.value) || 0)}
                              className="w-full bg-[#16252D] border border-[#37ffb7]/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Information Section */}
                  {activeFormSection === 'additional' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Additional Information</h3>
                      
                      <div>
                        <label className="block text-[#c1eddd] mb-2 text-sm font-medium">Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          className="w-full bg-[#0a1419] border border-[#37ffb7]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Pending Review">Pending Review</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#c1eddd] mb-2 text-sm font-medium">Rating</label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => handleInputChange('rating', star)}
                              className="text-2xl focus:outline-none"
                            >
                              <Star
                                className={star <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}
                                size={24}
                              />
                            </button>
                          ))}
                          <span className="text-[#c1eddd] ml-2">{formData.rating}/5</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#c1eddd] mb-2 text-sm font-medium">Internal Notes</label>
                        <textarea
                          placeholder="Any internal notes or comments about this bootcamp..."
                          value={formData.internalNotes}
                          onChange={(e) => handleInputChange('internalNotes', e.target.value)}
                          rows="4"
                          className="w-full bg-[#0a1419] border border-[#37ffb7]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#37ffb7] transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* Form Navigation and Submit */}
                  <div className="flex justify-between items-center pt-6 border-t border-[#37ffb7]/20">
                    <div className="flex gap-2">
                      {activeFormSection !== 'basic' && (
                        <button
                          type="button"
                          onClick={() => {
                            const sections = ['basic', 'contact', 'partnership', 'programs', 'financial', 'additional'];
                            const currentIndex = sections.indexOf(activeFormSection);
                            setActiveFormSection(sections[currentIndex - 1]);
                          }}
                          className="bg-[#A49595] hover:bg-[#8a7d7d] text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Previous
                        </button>
                      )}
                      {activeFormSection !== 'additional' && (
                        <button
                          type="button"
                          onClick={() => {
                            const sections = ['basic', 'contact', 'partnership', 'programs', 'financial', 'additional'];
                            const currentIndex = sections.indexOf(activeFormSection);
                            setActiveFormSection(sections[currentIndex + 1]);
                          }}
                          className="bg-[#685EFC] hover:bg-[#5749d4] text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Next
                        </button>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        type="button"
                        onClick={handleFormClose}
                        className="px-6 py-2 border border-[#A49595] text-[#A49595] rounded-lg hover:bg-[#A49595] hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="bg-[#12895E] hover:bg-[#0f6d4b] text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 font-medium"
                      >
                        <Check size={20} />
                        {editingBootcamp ? 'Update Bootcamp' : 'Create Bootcamp'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Bootcamp Details Modal */}
        {showDetails && selectedBootcamp && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#16252D] rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-[#37ffb7]/20">
              <div className="sticky top-0 bg-[#16252D] border-b border-[#37ffb7]/20 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Bootcamp Details</h2>
                <button onClick={handleDetailsClose} className="text-[#A49595] hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-[#685EFC] to-[#5749d4] rounded-lg p-6 mb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Building2 className="text-white" size={48} />
                      <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{selectedBootcamp.name}</h1>
                        <div className="flex items-center gap-4 text-[#c1eddd]">
                          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                            {selectedBootcamp.type}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedBootcamp.partnershipStatus)}`}>
                            {selectedBootcamp.partnershipStatus}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            selectedBootcamp.status === 'Active' 
                              ? 'bg-[#12895E] text-white' 
                              : selectedBootcamp.status === 'Inactive'
                              ? 'bg-[#A49595] text-white'
                              : 'bg-[#FF6B35] text-white'
                          }`}>
                            {selectedBootcamp.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    {selectedBootcamp.rating > 0 && (
                      <div className="flex items-center gap-1 bg-black/20 px-3 py-2 rounded-full">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            size={16}
                            className={star <= selectedBootcamp.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Contact Information */}
                    <div className="bg-[#0a1419] border border-[#37ffb7]/10 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Mail className="text-[#37ffb7]" size={20} />
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Mail size={16} className="text-[#37ffb7]" />
                            <div>
                              <p className="text-[#c1eddd] text-sm">Email</p>
                              <p className="text-white">{selectedBootcamp.email}</p>
                            </div>
                          </div>
                          {selectedBootcamp.phoneNumber && (
                            <div className="flex items-center gap-3">
                              <Phone size={16} className="text-[#37ffb7]" />
                              <div>
                                <p className="text-[#c1eddd] text-sm">Phone</p>
                                <p className="text-white">{selectedBootcamp.phoneNumber}</p>
                              </div>
                            </div>
                          )}
                          {selectedBootcamp.website && (
                            <div className="flex items-center gap-3">
                              <Globe size={16} className="text-[#37ffb7]" />
                              <div>
                                <p className="text-[#c1eddd] text-sm">Website</p>
                                <a 
                                  href={selectedBootcamp.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[#37ffb7] hover:underline break-all"
                                >
                                  {selectedBootcamp.website}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Contact Person */}
                        {selectedBootcamp.contactPerson && selectedBootcamp.contactPerson.name && (
                          <div className="space-y-3">
                            <h4 className="text-md font-semibold text-white flex items-center gap-2">
                              <User className="text-[#37ffb7]" size={16} />
                              Contact Person
                            </h4>
                            <div>
                              <p className="text-white font-medium">{selectedBootcamp.contactPerson.name}</p>
                              {selectedBootcamp.contactPerson.position && (
                                <p className="text-[#c1eddd] text-sm">{selectedBootcamp.contactPerson.position}</p>
                              )}
                              {selectedBootcamp.contactPerson.email && (
                                <p className="text-[#c1eddd] text-sm">{selectedBootcamp.contactPerson.email}</p>
                              )}
                              {selectedBootcamp.contactPerson.phoneNumber && (
                                <p className="text-[#c1eddd] text-sm">{selectedBootcamp.contactPerson.phoneNumber}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Location Information */}
                    {selectedBootcamp.location && (
                      <div className="bg-[#0a1419] border border-[#37ffb7]/10 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <MapPin className="text-[#37ffb7]" size={20} />
                          Location
                        </h3>
                        <div className="space-y-2">
                          {selectedBootcamp.location.address && (
                            <p className="text-white">{selectedBootcamp.location.address}</p>
                          )}
                          <div className="flex gap-2 text-[#c1eddd] text-sm">
                            {selectedBootcamp.location.city && <span>{selectedBootcamp.location.city}</span>}
                            {selectedBootcamp.location.state && <span>, {selectedBootcamp.location.state}</span>}
                            {selectedBootcamp.location.country && <span>, {selectedBootcamp.location.country}</span>}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <div className={`w-3 h-3 rounded-full ${selectedBootcamp.location.isRemote ? 'bg-[#12895E]' : 'bg-[#685EFC]'}`}></div>
                            <span className="text-[#c1eddd] text-sm">
                              {selectedBootcamp.location.isRemote ? 'Remote' : 'On-site'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Programs & Specializations */}
                    {(selectedBootcamp.programs?.length > 0 || selectedBootcamp.specializations?.length > 0) && (
                      <div className="space-y-4">
                        {/* Programs */}
                        {selectedBootcamp.programs?.length > 0 && (
                          <div className="bg-[#0a1419] border border-[#37ffb7]/10 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                              <Briefcase className="text-[#37ffb7]" size={20} />
                              Programs Offered
                            </h3>
                            <div className="space-y-3">
                              {selectedBootcamp.programs.map((program, index) => (
                                <div key={index} className="border-l-4 border-[#37ffb7] pl-4 py-2">
                                  <p className="font-semibold text-white">{program.name}</p>
                                  <p className="text-[#c1eddd] text-sm">{program.duration} • {program.focus}</p>
                                  {program.description && (
                                    <p className="text-[#c1eddd] text-sm mt-1">{program.description}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Specializations */}
                        {selectedBootcamp.specializations?.length > 0 && (
                          <div className="bg-[#0a1419] border border-[#37ffb7]/10 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Specializations</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedBootcamp.specializations.map((spec, index) => (
                                <span 
                                  key={index}
                                  className="bg-[#685EFC]/20 text-[#685EFC] px-3 py-1 rounded-full text-sm border border-[#685EFC]/30"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Internal Notes */}
                    {selectedBootcamp.internalNotes && (
                      <div className="bg-[#0a1419] border border-[#37ffb7]/10 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <FileText className="text-[#37ffb7]" size={20} />
                          Internal Notes
                        </h3>
                        <p className="text-[#c1eddd] whitespace-pre-wrap">{selectedBootcamp.internalNotes}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Statistics */}
                    <div className="bg-[#0a1419] border border-[#37ffb7]/10 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="text-[#37ffb7]" size={20} />
                        Statistics
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-[#37ffb7]">{selectedBootcamp.statistics?.totalGraduates || 0}</p>
                          <p className="text-[#c1eddd] text-sm">Total Graduates</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-[#12895E]">{selectedBootcamp.statistics?.talentsPlaced || 0}</p>
                          <p className="text-[#c1eddd] text-sm">Talents Placed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-[#685EFC]">{selectedBootcamp.statistics?.averagePlacementRate || 0}%</p>
                          <p className="text-[#c1eddd] text-sm">Placement Rate</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-[#FF6B35]">{selectedBootcamp.statistics?.currentStudents || 0}</p>
                          <p className="text-[#c1eddd] text-sm">Current Students</p>
                        </div>
                      </div>
                    </div>

                    {/* Partnership Details */}
                    <div className="bg-[#0a1419] border border-[#37ffb7]/10 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FileCheck className="text-[#37ffb7]" size={20} />
                        Partnership
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-[#c1eddd]">Status:</span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(selectedBootcamp.partnershipStatus)}`}>
                            {selectedBootcamp.partnershipStatus}
                          </span>
                        </div>
                        {selectedBootcamp.partnershipStartDate && (
                          <div className="flex justify-between">
                            <span className="text-[#c1eddd]">Start Date:</span>
                            <span className="text-white">{formatDate(selectedBootcamp.partnershipStartDate)}</span>
                          </div>
                        )}
                        {selectedBootcamp.partnershipEndDate && (
                          <div className="flex justify-between">
                            <span className="text-[#c1eddd]">End Date:</span>
                            <span className="text-white">{formatDate(selectedBootcamp.partnershipEndDate)}</span>
                          </div>
                        )}
                        {selectedBootcamp.agreement && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-[#c1eddd]">Agreement:</span>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${selectedBootcamp.agreement.signed ? 'bg-[#12895E] text-white' : 'bg-[#A49595] text-white'}`}>
                                {selectedBootcamp.agreement.signed ? 'Signed' : 'Not Signed'}
                              </span>
                            </div>
                            {selectedBootcamp.agreement.signedDate && (
                              <div className="flex justify-between">
                                <span className="text-[#c1eddd]">Signed Date:</span>
                                <span className="text-white">{formatDate(selectedBootcamp.agreement.signedDate)}</span>
                              </div>
                            )}
                            {selectedBootcamp.agreement.documentUrl && (
                              <div className="flex justify-between">
                                <span className="text-[#c1eddd]">Document:</span>
                                <a 
                                  href={selectedBootcamp.agreement.documentUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[#37ffb7] hover:underline text-sm"
                                >
                                  View
                                </a>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Commission Details */}
                    {selectedBootcamp.commission && selectedBootcamp.commission.type !== 'None' && (
                      <div className="bg-[#0a1419] border border-[#37ffb7]/10 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <DollarSign className="text-[#37ffb7]" size={20} />
                          Commission
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-[#c1eddd]">Type:</span>
                            <span className="text-white">{selectedBootcamp.commission.type}</span>
                          </div>
                          {selectedBootcamp.commission.percentage > 0 && (
                            <div className="flex justify-between">
                              <span className="text-[#c1eddd]">Percentage:</span>
                              <span className="text-white">{selectedBootcamp.commission.percentage}%</span>
                            </div>
                          )}
                          {selectedBootcamp.commission.amount > 0 && (
                            <div className="flex justify-between">
                              <span className="text-[#c1eddd]">Amount:</span>
                              <span className="text-white">${selectedBootcamp.commission.amount}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Timestamps */}
                    <div className="bg-[#0a1419] border border-[#37ffb7]/10 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Clock className="text-[#37ffb7]" size={20} />
                        Timestamps
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#c1eddd]">Created:</span>
                          <span className="text-white">{formatDate(selectedBootcamp.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#c1eddd]">Last Updated:</span>
                          <span className="text-white">{formatDate(selectedBootcamp.updatedAt)}</span>
                        </div>
                        {selectedBootcamp.addedBy && (
                          <div className="flex justify-between">
                            <span className="text-[#c1eddd]">Added By:</span>
                            <span className="text-white">
                              {selectedBootcamp.addedBy.firstName} {selectedBootcamp.addedBy.lastName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Talents Modal */}
        {showTalents && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#16252D] rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-[#37ffb7]/20">
              <div className="sticky top-0 bg-[#16252D] border-b border-[#37ffb7]/20 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Users className="text-[#37ffb7]" />
                  Talents from {selectedBootcamp?.name}
                  <span className="bg-[#685EFC] text-white px-2 py-1 rounded-full text-sm">
                    {bootcampTalents.length}
                  </span>
                </h2>
                <button onClick={handleTalentsClose} className="text-[#A49595] hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6">
                {bootcampTalents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bootcampTalents.map(talent => (
                      <div key={talent._id} className="bg-[#0a1419] border border-[#37ffb7]/10 rounded-lg p-4 hover:border-[#37ffb7]/30 transition-colors">
                        <p className="font-semibold text-white text-lg">{talent.fullName}</p>
                        <p className="text-[#c1eddd] text-sm mt-1">{talent.preferredRole}</p>
                        <p className="text-[#c1eddd] text-sm">{talent.email}</p>
                        <div className="flex justify-between items-center mt-3">
                          <span className={`text-xs px-2 py-1 rounded ${
                            talent.status === 'Placed' 
                              ? 'bg-[#12895E] text-white' 
                              : talent.status === 'Vetted'
                              ? 'bg-[#685EFC] text-white'
                              : 'bg-[#A49595] text-white'
                          }`}>
                            {talent.status}
                          </span>
                          {talent.placementDate && (
                            <span className="text-[#c1eddd] text-xs">
                              {formatDate(talent.placementDate)}
                            </span>
                          )}
                        </div>
                        {talent.vettedBy && (
                          <div className="mt-2 pt-2 border-t border-[#37ffb7]/10">
                            <p className="text-[#c1eddd] text-xs">
                              Vetted by: {talent.vettedBy.firstName} {talent.vettedBy.lastName}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="mx-auto text-[#A49595]" size={48} />
                    <p className="text-[#c1eddd] text-lg mt-4">No talents found for this bootcamp</p>
                    <p className="text-[#A49595] text-sm mt-2">Talents will appear here once they are added to the system</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bootcamps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bootcamps.map(bootcamp => (
            <div key={bootcamp._id} className="bg-[#16252D] border border-[#37ffb7]/20 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#37ffb7]/40 transition-all duration-300">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-[#685EFC] to-[#5749d4] p-6">
                <div className="flex items-start justify-between mb-2">
                  <Building2 className="text-white" size={32} />
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(bootcamp.partnershipStatus)}`}>
                    {bootcamp.partnershipStatus}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{bootcamp.name}</h3>
                <p className="text-[#c1eddd] text-sm">{bootcamp.type}</p>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#c1eddd] text-sm">
                    <Mail size={16} className="text-[#37ffb7]" />
                    <span className="truncate">{bootcamp.email}</span>
                  </div>
                  {bootcamp.phoneNumber && (
                    <div className="flex items-center gap-2 text-[#c1eddd] text-sm">
                      <Phone size={16} className="text-[#37ffb7]" />
                      <span>{bootcamp.phoneNumber}</span>
                    </div>
                  )}
                  {bootcamp.website && (
                    <div className="flex items-center gap-2 text-[#c1eddd] text-sm">
                      <Globe size={16} className="text-[#37ffb7]" />
                      <a href={bootcamp.website} target="_blank" rel="noopener noreferrer" className="hover:text-[#37ffb7] transition-colors truncate">
                        {bootcamp.website}
                      </a>
                    </div>
                  )}
                </div>

                {/* Statistics */}
                {bootcamp.statistics && (
                  <div className="bg-[#0a1419] rounded-lg p-4 border border-[#37ffb7]/10">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-2xl font-bold text-[#37ffb7]">{bootcamp.statistics.totalGraduates}</p>
                        <p className="text-xs text-[#A49595]">Graduates</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#12895E]">{bootcamp.statistics.talentsPlaced}</p>
                        <p className="text-xs text-[#A49595]">Placed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#685EFC]">{bootcamp.statistics.averagePlacementRate}%</p>
                        <p className="text-xs text-[#A49595]">Rate</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button 
                    onClick={() => handleViewDetails(bootcamp._id)}
                    className="bg-[#685EFC]/10 hover:bg-[#685EFC]/20 text-[#685EFC] px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors border border-[#685EFC]/20"
                  >
                    <Eye size={16} />
                    Details
                  </button>
                  <button 
                    onClick={() => handleViewTalents(bootcamp._id)}
                    className="bg-[#12895E]/10 hover:bg-[#12895E]/20 text-[#12895E] px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors border border-[#12895E]/20"
                  >
                    <Users size={16} />
                    Talents
                  </button>
                  {isSuperAdmin && (
                    <button 
                      onClick={() => handleEdit(bootcamp)}
                      className="bg-[#37ffb7]/10 hover:bg-[#37ffb7]/20 text-[#37ffb7] px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors border border-[#37ffb7]/20"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                  )}
                  {isSuperAdmin && (
                    <button 
                      onClick={() => handleDelete(bootcamp._id)}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors border border-red-500/20"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {bootcamps.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building2 className="mx-auto text-[#A49595]" size={64} />
            <p className="text-[#c1eddd] text-xl mt-4">No bootcamps found</p>
            <p className="text-[#A49595] mt-2">Get started by adding your first bootcamp partnership</p>
            {isSuperAdmin && (
              <button 
                onClick={() => setShowForm(true)}
                className="mt-6 bg-[#685EFC] hover:bg-[#5749d4] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 mx-auto"
              >
                <Plus size={20} />
                Add New Bootcamp
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BootcampManagement;