'use client'
import React from 'react'
import { motion } from "framer-motion"

const Impact = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  }

  const headingVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  }

  const descriptionVariants = {
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

  return (
    <motion.div 
      className='bg-[#685EFC] lg:rounded-4xl py-24 lg:px-16 text-center lg:text-start lg:max-w-6xl lg:mx-auto lg:mt-16 lg:mb-16'
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3 }}
    >
      <motion.h2 
        className='lg:text-[48px] text-[32px] text-white font-bold lg:px-0 px-16'
        variants={headingVariants}
      >
        Let's Build Something Impactful Together
      </motion.h2>
      <motion.p 
        className='text-white pt-4 lg:text-2xl lg:w-[68%] lg:px-0 px-16'
        variants={descriptionVariants}
      >
        Whether you are hiring or job-hunting, JuniorForge is here to make the match easy.
      </motion.p>
    </motion.div>
  )
}

export default Impact