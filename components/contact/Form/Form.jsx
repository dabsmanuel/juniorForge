'use client'
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const Form = () => {
  const [tab, setTab] = useState('startups')
  const [cvFile, setCvFile] = useState(null)
  const [coverLetterFile, setCoverLetterFile] = useState(null)

  const handleCvUpload = (e) => {
    const file = e.target.files[0]
    setCvFile(file)
  }

  const handleCoverLetterUpload = (e) => {
    const file = e.target.files[0]
    setCoverLetterFile(file)
  }

  const handleTalentSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('CV File:', cvFile)
    console.log('Cover Letter File:', coverLetterFile)
    // Add your form submission logic
  }

  const handleStartupSubmit = (e) => {
    e.preventDefault()
    // Handle startup form submission
    console.log('Startup form submitted')
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
            onClick={() => setTab('startups')}
            className={`lg:px-12 px-8 py-3 rounded-full font-medium transition-colors w-full ${
              tab === 'startups'
                ? 'bg-[#12895E] text-white border-2 border-[#c1eddd]'
                : 'text-black'
            }`}
          >
            For Startups
          </button>
          <button
            onClick={() => setTab('talents')}
            className={`lg:px-12 px-8 py-3 rounded-full font-medium transition-colors w-full ${
              tab === 'talents'
                ? 'bg-[#12895E] text-white border-2 border-[#c1eddd]'
                : 'text-black '
            }`}
          >
            For Talents
          </button>
        </motion.div>

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
                <div className='space-y-6' onSubmit={handleStartupSubmit}>
                  <motion.div variants={inputVariants}>
                    <input
                      type='text'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                      placeholder='Full name*'
                      required
                    />
                  </motion.div>
                  <motion.div variants={inputVariants}>
                    <input
                      type='text'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                      placeholder='Company name*'
                      required
                    />
                  </motion.div>
                  <motion.div variants={inputVariants}>
                    <input
                      type='email'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                      placeholder='Email address*'
                      required
                    />
                  </motion.div>
                  <motion.div variants={inputVariants}>
                    <input
                      type='text'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                      placeholder='Website:'
                    />
                  </motion.div>
                  <motion.div variants={inputVariants}>
                    <textarea
                      rows='3'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                      placeholder='Tell us about your startup*'
                      required
                    ></textarea>
                  </motion.div>

                  <motion.div variants={inputVariants}>
                    <textarea
                      rows='4'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                      placeholder='Role description*'
                      required
                    ></textarea>
                  </motion.div>

                  <motion.div variants={inputVariants}>
                    <input
                      type='text'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                      placeholder='Hiring timeline:*'
                    />
                  </motion.div>
                  <motion.button
                    onClick={handleStartupSubmit}
                    className='w-full lg:w-fit bg-[#12895E] text-white py-3 px-10 rounded-full font-medium hover:bg-[#37ffb7] hover:text-black transition-colors border border-[#c1eddd]'
                    variants={inputVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Find Talents
                  </motion.button>
                </div>
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
                <div className='space-y-6' onSubmit={handleTalentSubmit}>
                  <motion.div variants={inputVariants}>
                    <input
                      type='text'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                      placeholder='Full name*'
                      required
                    />
                  </motion.div>
                  <motion.div variants={inputVariants}>
                    <input
                      type='email'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                      placeholder='Email address'
                    />
                  </motion.div>
                  <motion.div variants={inputVariants}>
                    <input
                      type='text'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                      placeholder='LinkedIn Profile/Portfolio Link'
                    />
                  </motion.div>
                  <motion.div variants={inputVariants}>
                    <input
                      type='text'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                      placeholder='Preferred Role'
                    />
                  </motion.div>
                  <motion.div variants={inputVariants}>
                    <input
                      type='text'
                      className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                      placeholder='Availability'
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
                      <div className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg text-gray-400 cursor-pointer hover:border-[#12895E] transition-colors'>
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
                      <div className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg text-gray-400 cursor-pointer hover:border-[#12895E] transition-colors'>
                        {coverLetterFile ? coverLetterFile.name : 'Choose cover letter file (PDF, DOC, DOCX)'}
                      </div>
                    </div>
                  </motion.div>

                  <motion.button
                    onClick={handleTalentSubmit}
                    className='w-full lg:w-fit bg-[#12895E] text-white py-3 px-10 rounded-full border border-[#c1eddd] font-medium hover:bg-[#37ffb7] hover:text-black transition-colors'
                    variants={inputVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Apply Now
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  )
}

export default Form