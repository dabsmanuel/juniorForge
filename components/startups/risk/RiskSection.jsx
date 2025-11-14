'use client'
import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const RiskSection = () => {
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  // Animation variants for the image section
  const imageVariants = {
    hidden: { 
      opacity: 0, 
      x: -50
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  // Animation variants for the accent bar
  const accentBarVariants = {
    hidden: { 
      opacity: 0, 
      width: 0
    },
    visible: {
      opacity: 1,
      width: '31.25rem',
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  // Animation variants for text content
  const textVariants = {
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
    <section className='lg:pt-0 relative z-20 lg:-top-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-12'>
      <motion.div 
        className='grid lg:grid-cols-2 grid-cols-1 gap-6 mx-auto '
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      >
        <motion.div 
          className='lg:mt-0 mt-12 px-0'
          variants={imageVariants}
        >
          <motion.div 
            className='max-w-[31.25rem] h-12 bg-[#37ffb7] relative top-12 lg:block hidden'
            variants={accentBarVariants}
          ></motion.div>
          <Image
            src='/images/start.png'
            alt='picture'
            width={500}
            height={800}
          />
        </motion.div>
        <motion.div 
          className='lg:top-36 relative lg:mt-0 mt-6'
          variants={containerVariants}
        >
          <motion.p 
            className='max-w-lg lg:mt-10'
            variants={textVariants}
          >
            Early-stage startups struggle to hire because senior talent is on the high side, the hiring process takes too long and bad hires can set them back significantly.
          </motion.p>
          <motion.h2 
            className='lg:text-6xl text-4xl font-bold lg:my-24 my-6'
            variants={textVariants}
          >
            We make hiring fast, affordable and risk-free.
          </motion.h2>
          <motion.p 
            className='max-w-2xl'
            variants={textVariants}
          >
            <span className='font-bold'>JuniorForge </span>solves this by providing pre-vetted, affordable junior talent ready to interview within 72 hours, helping startups hire faster and smarter.
          </motion.p>

          <div className='mt-8 flex items-center'>
            <Link href='/hiring-calculator' className='text-[#12895E] underline font-medium ml-4'>
              Or try our Hiring Cost Calculator
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default RiskSection