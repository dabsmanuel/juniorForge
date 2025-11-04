'use client'
import { motion } from 'framer-motion'
import { faqs } from '@/data/db'

const FAQ = () => {
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  // Animation variants for the header
  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  // Animation variants for each FAQ card
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: -30
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.section 
      className='mt-32 lg:mb-6 mb-16 max-w-6xl mx-auto lg:px-6 px-4'
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
    >
      <motion.div 
        className='text-center mb-12'
        variants={headerVariants}
      >
        <h2 className='text-5xl font-bold pb-4'>Frequently Asked Questions</h2>
        <p className='lg:text-xl'>Quick answers to questions you may have.</p>
      </motion.div>

      <div className='space-y-6'>
        {faqs.map((faq) => (
          <motion.div
            key={faq.id}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            className={`border-l-32 ${faq.borderColor} border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition-shadow`}
          >
            <h3 className='font-bold text-xl lg:text-2xl mb-3'>{faq.question}</h3>
            <p className='text-gray-700 lg:text-lg'>{faq.answer}</p>
            {faq.steps && (
              <ol className='mt-3 space-y-2'>
                {faq.steps.map((step, index) => (
                  <li key={index} className='text-gray-700 lg:text-lg'>
                    <span className='font-semibold'>{index + 1}.</span> {step}
                  </li>
                ))}
              </ol>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

export default FAQ