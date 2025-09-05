'use client'
import React from 'react'
import { motion } from "framer-motion"

const Contact = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  }

  const headingVariants = {
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

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  }

  const contactItemVariants = {
    hidden: { opacity: 0, x: -20 },
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
    <motion.div 
      className='lg:max-w-[90%] lg:rounded-e-[56px] bg-[#12895E] px-8 pt-10 pb-26 lg:my-16 text-white'
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3 }}
    >
      <div className='max-w-5xl mx-auto'>
        <motion.h2 
          className='font-bold lg:text-[48px] text-[32px]'
          variants={headingVariants}
        >
          Contact Information
        </motion.h2>

        <motion.div 
          className='bg-[#16252D] p-8 rounded-4xl mt-8 flex flex-col space-y-8'
          variants={cardVariants}
        >
          <motion.p variants={contactItemVariants}>
            Email Address: juniorforgeltd@gmail.com
          </motion.p>
          <motion.p variants={contactItemVariants}>
            Phone Number: +1 (234) 567-8901
          </motion.p>
          <motion.p variants={contactItemVariants}>
            Social Media:
          </motion.p>
        </motion.div>      
      </div>
    </motion.div>
  )
}

export default Contact