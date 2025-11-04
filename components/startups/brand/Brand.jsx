'use client'
import { motion } from 'framer-motion'
import { startups } from '@/data/db'
import Image from 'next/image'

const Brand = () => {
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

  // Animation variants for each startup card
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
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  return (
    <motion.section 
      className='my-16 max-w-6xl mx-auto lg:px-6 px-4'
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
    >
      <motion.div 
        className='mb-6'
        variants={headerVariants}
      >
        <motion.h2 
          className='text-3xl font-bold pb-4 tracking-tight'
          variants={headerVariants}
        >
          Why Brands Trusts Us?
        </motion.h2>
        <motion.p 
          className='tracking-tight lg:text-2xl pb-4'
          variants={headerVariants}
        >
          JuniorForge delivers pre-vetted talent quickly through a transparent, flexible process built for startup growth. We create lasting partnership that help startups scale and talent thrive.
        </motion.p>
      </motion.div>
      
      <motion.div 
        className='grid grid-cols-1 lg:grid-cols-4 lg:gap-6 gap-4'
        variants={gridVariants}
      >
        {startups.map((startup, index) => {
          return (
            <motion.div 
              key={startup.id}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#c1eddd] rounded-lg p-4"
            >
              <h2 className="text-white bg-black text-lg rounded-full w-fit py-1 px-4 mb-2">{startup.id}</h2>
              <h2 className='font-bold px-3 lg:text-[32px] text-2xl pb-6'>{startup.title}</h2>
              <p className='px-3 lg:text-2xl pb-12'>{startup.text}</p>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.section>
  )
}

export default Brand