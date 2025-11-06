'use client'
import { talentstapge } from '@/data/db'
import Image from 'next/image'
import { motion } from 'framer-motion'


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
          JuniorForge  connects early-stage startups with ready-to-grow junior talents. We exist to close the experience gap and create opportunity where it matters most.
        </motion.p>
      </motion.div>
      <motion.div 
        className='grid grid-cols-2 lg:grid-cols-4 lg:gap-6 gap-4'
        variants={gridVariants}
      >
        {
          talentstapge.map((startup) =>{
            return (
              <motion.div 
                key={startup.id}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={startup.photo}
                  alt={startup.alt}
                  width={500}
                  height={400}
                  className='rounded-[50px] object-cover border-2 border-black'
                />
              </motion.div>
            ) 
          })
        }
      </motion.div>
    </motion.section>
  )
}

export default Brand