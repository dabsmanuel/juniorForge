'use client'
import Link from "next/link"
import { motion } from 'framer-motion'

const HowItWorks = () => {
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

  // Animation variants for the header content
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

  // Animation variants for each step card
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  // Animation variants for the grid container
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  // Animation variants for the button
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.6
      }
    }
  }

  return (
    <div className='bg-[#685EFC] lg:px-4'>
      <motion.div 
        className='max-w-6xl mx-auto lg:py-16 py-12 p-4'
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      >
        <motion.div 
          className='text-center text-white'
          variants={headerVariants}
        >
          <motion.h2 
            className='text-5xl font-bold pb-4'
            variants={headerVariants}
          >
            How it Works
          </motion.h2>
          <motion.p
            variants={headerVariants}
          >
            From role request to ready-to-work talent in just three (3) steps:
          </motion.p>
        </motion.div>

        <motion.div 
          className='grid lg:grid-cols-3 grid-cols-1 mt-12 gap-6'
          variants={gridVariants}
        >
          <motion.div 
            className='bg-white p-4 rounded-lg'
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <h3 className='text-white bg-black text-lg rounded-full w-fit py-2 px-5 mb-2'>1</h3>
            <h2 className='font-bold px-3 lg:text-[32px] text-2xl pb-6'>Tell us your Needs</h2>
            <p className='px-3 lg:text-2xl pb-12'>Share the role, required skills and your timeline.</p>
          </motion.div>

          <motion.div 
            className='bg-white p-4 rounded-lg'
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <h3 className='text-white bg-black text-lg rounded-full w-fit py-2 px-5 mb-2'>2</h3>
            <h2 className='font-bold px-3 lg:text-[32px] text-2xl pb-6'>Meet Pre-Vetted Talent</h2>
            <p className='px-3 lg:text-2xl pb-12'>Get matched and start interviews within 48 hours.</p>
          </motion.div>

          <motion.div 
            className='bg-white p-4 rounded-lg'
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <h3 className='text-white bg-black text-lg rounded-full w-fit py-2 px-5 mb-2'>3</h3>
            <h2 className='font-bold px-3 lg:text-[32px] text-2xl pb-6'>Onboard and Succeed </h2>
            <p className='px-3 lg:text-2xl pb-12'>Hire and start strong with our support.</p>
          </motion.div>
        </motion.div>

        <motion.div 
          className="flex items-center justify-center lg:mt-12 mt-6"
          variants={buttonVariants}
        >
          <Link href='/contact' className="bg-[#16252D] border border-[#c1eddd] lg:px-24 px-12 lg:py-4 py-2 text-white rounded-full transition ease-in-out hover:px-26">
            Get Started Now
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HowItWorks