'use client'
import React from 'react'
import { motion } from "framer-motion"

const Mission = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.3
      }
    }
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  }

  const headingVariants = {
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

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        delay: 0.2
      }
    }
  }

  return (
    <div className="overflow-hidden">
      <motion.section 
        className='flex lg:justify-end justify-center w-full lg:mt-16 mt-8 px-4 lg:p-0'
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.3 }}
      >
        <motion.div 
          className='flex flex-col justify-center items-end bg-[#16252D] lg:w-[90%] rounded-l-[32px] py-10 lg:py-0'
          variants={sectionVariants}
        >
          <div className='p-10 w-full mx-auto text-center'>
            <motion.h2 
              className='text-4xl font-bold text-white'
              variants={headingVariants}
            >
              Our Mission:
            </motion.h2>
            <motion.p 
              className='mt-4 text-lg text-gray-300 max-w-[52rem] mx-auto text-center'
              variants={textVariants}
            >
              JuniorForge believes talent is universal, but opportunity is not. We discover, develop, and deploy exceptional entry level talent from everywhere for startups going anywhere - championing diversity, gender equality, and creating economic mobility through rigorous vetting and human development pathway.
            </motion.p>
          </div>
        </motion.div>
      </motion.section>
    </div>
  )
}

export default Mission