'use client'
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const Form = () => {
  const [tab, setTab] = useState('startups')
  const [cvFile, setCvFile] = useState(null)
  const [coverLetterFile, setCoverLetterFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState({ type: '', message: '' })
  
  // Form states for controlled inputs
  const [startupForm, setStartupForm] = useState({
    fullName: '',
    companyName: '',
    email: '',
    website: '',
    aboutStartup: '',
    roleDescription: '',
    hiringTimeline: ''
  })
  
  const [talentForm, setTalentForm] = useState({
    fullName: '',
    email: '',
    linkedIn: '',
    preferredRole: '',
    availability: ''
  })

  const handleCvUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.size > 10 * 1024 * 1024) { // 10MB limit
      setSubmitMessage({ type: 'error', message: 'File size must be less than 10MB' })
      return
    }
    setCvFile(file)
    setSubmitMessage({ type: '', message: '' })
  }

  const handleCoverLetterUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.size > 10 * 1024 * 1024) { // 10MB limit
      setSubmitMessage({ type: 'error', message: 'File size must be less than 10MB' })
      return
    }
    setCoverLetterFile(file)
    setSubmitMessage({ type: '', message: '' })
  }

  const handleStartupInputChange = (field, value) => {
    setStartupForm(prev => ({ ...prev, [field]: value }))
  }

  const handleTalentInputChange = (field, value) => {
    setTalentForm(prev => ({ ...prev, [field]: value }))
  }

  const handleTalentSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage({ type: '', message: '' })

    // Validation
    if (!talentForm.fullName || !talentForm.email) {
      setSubmitMessage({ type: 'error', message: 'Please fill in all required fields' })
      setIsSubmitting(false)
      return
    }

    if (!cvFile) {
      setSubmitMessage({ type: 'error', message: 'CV file is required' })
      setIsSubmitting(false)
      return
    }

    const formData = new FormData()
    formData.append('fullName', talentForm.fullName)
    formData.append('email', talentForm.email)
    formData.append('linkedIn', talentForm.linkedIn)
    formData.append('preferredRole', talentForm.preferredRole)
    formData.append('availability', talentForm.availability)
    if (cvFile) formData.append('cvFile', cvFile)
    if (coverLetterFile) formData.append('coverLetterFile', coverLetterFile)
  
    try {
      const response = await fetch('http://localhost:5000/api/form/talent', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSubmitMessage({ 
          type: 'success', 
          message: 'Application submitted successfully! Check your email for confirmation.' 
        })
        // Reset form
        setTalentForm({
          fullName: '',
          email: '',
          linkedIn: '',
          preferredRole: '',
          availability: ''
        })
        setCvFile(null)
        setCoverLetterFile(null)
        // Reset file inputs
        const fileInputs = document.querySelectorAll('input[type="file"]')
        fileInputs.forEach(input => input.value = '')
      } else {
        setSubmitMessage({ 
          type: 'error', 
          message: data.message || 'Form submission failed. Please try again.' 
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitMessage({ 
        type: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStartupSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage({ type: '', message: '' })
    
    // Validation
    if (!startupForm.fullName || !startupForm.companyName || !startupForm.email || 
        !startupForm.aboutStartup || !startupForm.roleDescription) {
      setSubmitMessage({ type: 'error', message: 'Please fill in all required fields' })
      setIsSubmitting(false)
      return
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/form/startup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(startupForm)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSubmitMessage({ 
          type: 'success', 
          message: 'Application submitted successfully! Check your email for confirmation.' 
        })
        // Reset form
        setStartupForm({
          fullName: '',
          companyName: '',
          email: '',
          website: '',
          aboutStartup: '',
          roleDescription: '',
          hiringTimeline: ''
        })
      } else {
        setSubmitMessage({ 
          type: 'error', 
          message: data.message || 'Form submission failed. Please try again.' 
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitMessage({ 
        type: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  }

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const formVariants = {
    hidden: { 
      opacity: 0, 
      x: 20,
      scale: 0.98
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      x: -20,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  }

  const inputVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }
  
  return (
    <motion.section 
      className='bg-[#16252D] max-w-5xl mx-auto lg:rounded-2xl lg:my-16 lg:px-0 px-4'
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.2 }}
    >
      <div className='lg:px-8 py-12 px-4'>
        {/* Tab Navigation */}
        <motion.div 
          className='flex gap-4 mb-16 w-full bg-white rounded-full'
          variants={tabVariants}
        >
          <button
            onClick={() => {
              setTab('startups')
              setSubmitMessage({ type: '', message: '' })
            }}
            className={`lg:px-12 px-8 py-3 rounded-full font-medium transition-colors w-full ${
              tab === 'startups'
                ? 'bg-[#12895E] text-white border-2 border-[#c1eddd]'
                : 'text-black'
            }`}
          >
            For Startups
          </button>
          <button
            onClick={() => {
              setTab('talents')
              setSubmitMessage({ type: '', message: '' })
            }}
            className={`lg:px-12 px-8 py-3 rounded-full font-medium transition-colors w-full ${
              tab === 'talents'
                ? 'bg-[#12895E] text-white border-2 border-[#c1eddd]'
                : 'text-black '
            }`}
          >
            For Talents
          </button>
        </motion.div>

        {/* Submit Message */}
        {submitMessage.message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              submitMessage.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {submitMessage.message}
          </motion.div>
        )}

        <div className='mt-6'>
          <AnimatePresence mode="wait">
            {tab === 'startups' && (
              <motion.div
                key="startups"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <form className='space-y-6' onSubmit={handleStartupSubmit}>
                  <motion.div variants={inputVariants}>
                    <input
                      type='text'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#12895E]'
                      placeholder='Full name*'
                      value={startupForm.fullName}
                      onChange={(e) => handleStartupInputChange('fullName', e.target.value)}
                      required
                    />
                  </motion.div>
                  <motion.div variants={inputVariants}>
                    <input
                      type='text'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#12895E]'
                      placeholder='Company name*'
                      value={startupForm.companyName}
                      onChange={(e) => handleStartupInputChange('companyName', e.target.value)}
                      required
                    />
                  </motion.div>
                  <motion.div variants={inputVariants}>
                    <input
                      type='email'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#12895E]'
                      placeholder='Email address*'
                      value={startupForm.email}
                      onChange={(e) => handleStartupInputChange('email', e.target.value)}
                      required
                    />
                  </motion.div>
                  <motion.div variants={inputVariants}>
                    <input
                      type='text'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#12895E]'
                      placeholder='Website'
                      value={startupForm.website}
                      onChange={(e) => handleStartupInputChange('website', e.target.value)}
                    />
                  </motion.div>
                  <motion.div variants={inputVariants}>
                    <textarea
                      rows='3'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#12895E]'
                      placeholder='Tell us about your startup*'
                      value={startupForm.aboutStartup}
                      onChange={(e) => handleStartupInputChange('aboutStartup', e.target.value)}
                      required
                    ></textarea>
                  </motion.div>

                  <motion.div variants={inputVariants}>
                    <textarea
                      rows='4'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#12895E]'
                      placeholder='Role description*'
                      value={startupForm.roleDescription}
                      onChange={(e) => handleStartupInputChange('roleDescription', e.target.value)}
                      required
                    ></textarea>
                  </motion.div>

                  <motion.div variants={inputVariants}>
                    <input
                      type='text'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#12895E]'
                      placeholder='Hiring timeline'
                      value={startupForm.hiringTimeline}
                      onChange={(e) => handleStartupInputChange('hiringTimeline', e.target.value)}
                    />
                  </motion.div>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full lg:w-fit py-3 px-10 rounded-full font-medium transition-all border border-[#c1eddd] ${
                      isSubmitting 
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                        : 'bg-[#12895E] text-white hover:bg-[#37ffb7] hover:text-black'
                    }`}
                    variants={inputVariants}
                    whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                  >
                    {isSubmitting ? 'Submitting...' : 'Find Talents'}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {tab === 'talents' && (
              <motion.div
                key="talents"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <form className='space-y-6' onSubmit={handleTalentSubmit}>
                  <motion.div variants={inputVariants}>
                    <input
                      type='text'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-[#12895E]'
                      placeholder='Full name*'
                      value={talentForm.fullName}
                      onChange={(e) => handleTalentInputChange('fullName', e.target.value)}
                      required
                    />
                  </motion.div>
                  <motion.div variants={inputVariants}>
                    <input
                      type='email'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-[#12895E]'
                      placeholder='Email address*'
                      value={talentForm.email}
                      onChange={(e) => handleTalentInputChange('email', e.target.value)}
                      required
                    />
                  </motion.div>
                  <motion.div variants={inputVariants}>
                    <input
                      type='text'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-[#12895E]'
                      placeholder='LinkedIn Profile/Portfolio Link'
                      value={talentForm.linkedIn}
                      onChange={(e) => handleTalentInputChange('linkedIn', e.target.value)}
                    />
                  </motion.div>
                  <motion.div variants={inputVariants}>
                    <input
                      type='text'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-[#12895E]'
                      placeholder='Preferred Role'
                      value={talentForm.preferredRole}
                      onChange={(e) => handleTalentInputChange('preferredRole', e.target.value)}
                    />
                  </motion.div>
                  <motion.div variants={inputVariants}>
                    <input
                      type='text'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-[#12895E]'
                      placeholder='Availability'
                      value={talentForm.availability}
                      onChange={(e) => handleTalentInputChange('availability', e.target.value)}
                    />
                  </motion.div>
                  
                  {/* CV Upload */}
                  <motion.div variants={inputVariants}>
                    <label className='block text-white text-sm font-medium mb-2'>
                      Upload CV*
                    </label>
                    <div className='relative'>
                      <input
                        type='file'
                        accept='.pdf,.doc,.docx'
                        onChange={handleCvUpload}
                        className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                        required
                      />
                      <div className={`w-full px-4 py-3 bg-white border-2 rounded-lg cursor-pointer transition-colors ${
                        cvFile ? 'border-[#12895E] text-[#12895E]' : 'border-[#c1eddd] text-gray-400 hover:border-[#12895E]'
                      }`}>
                        {cvFile ? cvFile.name : 'Choose CV file (PDF, DOC, DOCX)'}
                      </div>
                    </div>
                  </motion.div>

                  {/* Cover Letter Upload */}
                  <motion.div variants={inputVariants}>
                    <label className='block text-white text-sm font-medium mb-2'>
                      Upload Cover Letter
                    </label>
                    <div className='relative'>
                      <input
                        type='file'
                        accept='.pdf,.doc,.docx'
                        onChange={handleCoverLetterUpload}
                        className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                      />
                      <div className={`w-full px-4 py-3 bg-white border-2 rounded-lg cursor-pointer transition-colors ${
                        coverLetterFile ? 'border-[#12895E] text-[#12895E]' : 'border-[#c1eddd] text-gray-400 hover:border-[#12895E]'
                      }`}>
                        {coverLetterFile ? coverLetterFile.name : 'Choose cover letter file (PDF, DOC, DOCX)'}
                      </div>
                    </div>
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full lg:w-fit py-3 px-10 rounded-full font-medium transition-all border border-[#c1eddd] ${
                      isSubmitting 
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                        : 'bg-[#12895E] text-white hover:bg-[#37ffb7] hover:text-black'
                    }`}
                    variants={inputVariants}
                    whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                  >
                    {isSubmitting ? 'Submitting...' : 'Apply Now'}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  )
}

export default Form