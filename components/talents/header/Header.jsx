'use client'
import React from 'react';
import Link from 'next/link';
import { motion } from "framer-motion"

const Hero = () => {
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

  return (
    <section className="relative min-h-screen overflow-hidden bg-fixed">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 startup"
        style={{
          backgroundImage: `url('/images/talent.png')`
        }}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/35 z-10" />
      
      {/* Content Container */}
      <div className="relative z-20 min-h-screen flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-6xl lg:px-16 lg:text-start text-center tracking-tighter"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            {/* Heading */}
            <motion.div 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              variants={headingVariants}>
                <h2>Real World</h2>
                <h2>Experience Awaits You</h2>
            </motion.div>
            
            {/* Description */}
            <motion.p 
              className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-8 leading-tight"
              variants={descriptionVariants}
            >
              See current internship and entry-level positions from vetted startups.
            </motion.p>
            
            {/* CTA Button */}
            <motion.div variants={buttonVariants}>
              <Link 
                href='/contact' 
                className="inline-flex items-center px-32 py-4 bg-[#12895E] hover:bg-[#0f7a4b] text-white font-semibold text-lg rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl border border-[#37ffb7]"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  Apply Now
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;