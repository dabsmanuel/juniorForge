'use client'
import React from 'react';
import Link from 'next/link';
import { motion } from "framer-motion"

const TalentHero = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        staggerChildren: 0.3
      }
    }
  }

  const headingVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.9,
        ease: "easeOut"
      }
    }
  }

  const descriptionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const statsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
        delayChildren: 0.5
      }
    }
  }

  const statItemVariants = {
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
    <section className="relative lg:h-screen h-[80vh] overflow-hidden bg-fixed">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 startup sm:bg-[url('/images/startuphero.png')] bg-[#12895E]"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }}
      />
      
      {/* Additional dark overlay for text readability */}
      <div className="lg:absolute lg:inset-0 lg:bg-black/40 z-15" />
      
      {/* Content Container - Changed items-center to items-end */}
      <div className="relative z-20 h-full flex items-center pb-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            className="max-w-6xl lg:px-16 lg:text-start text-center tracking-tighter"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.3 }}
          >
            {/* Heading */}
            <motion.div 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white lg:mb-4 mb-8 lg:mt-0 mt-6 leading-tight max-w-3xl"
              variants={headingVariants}
            >
              <h2>Hire Pre-Vetted Junior Tech Talents at Less Cost.</h2>
            </motion.div>
            
            {/* Description */}
            <motion.p 
              className="text-lg sm:text-xl lg:text-2xl text-white mb-8 leading-tight font-medium max-w-2xl"
              variants={descriptionVariants}
            >
              Get start-up ready Junior Tech Talents who can contribute from day one.
            </motion.p>
            
            {/* CTA Button */}
            <motion.div variants={buttonVariants}>
              <Link 
                href='/contact' 
                className="inline-flex items-center px-8 sm:px-16 lg:px-32 py-3 sm:py-4 lg:bg-[#12895E] bg-white lg:hover:bg-[#0f7a4b] hover:bg-gray-100 lg:text-white text-black font-semibold text-base sm:text-lg rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl border border-[#37ffb7]"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  Request Talents
                </motion.span>
              </Link>
            </motion.div>

            <motion.div
              className='flex gap-6 items-center text-white mt-8'
              variants={statsContainerVariants}
            >
              <motion.div variants={statItemVariants}>
                <h2 className='lg:text-4xl text-2xl font-bold'>200+</h2>
                <p className='lg:text-xl'>Vetted Talents</p>
              </motion.div>
              <motion.div variants={statItemVariants}>
                <h2 className='lg:text-4xl text-2xl font-bold'>48Hrs</h2>
                <p className='lg:text-xl'>Avg. Match Time</p>
              </motion.div>
              <motion.div variants={statItemVariants}>
                <h2 className='lg:text-4xl text-2xl font-bold'>95%</h2>
                <p className='lg:text-xl'>Success Rate</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TalentHero;