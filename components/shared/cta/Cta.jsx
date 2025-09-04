"use client"
import Link from "next/link"
import { motion } from "framer-motion"

const Cta = () => {
  // Animation variants for different elements
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

  const itemVariants = {
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

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
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
      viewport={{ once: false, amount: 0.3 }}
    >
      <motion.h2 
        className='lg:text-5xl text-[32px] text-white font-bold lg:px-0 px-16'
        variants={itemVariants}
      >
        Ready to Forge Your Next Move?
      </motion.h2>
      
      <motion.p 
        className='text-white pt-4 lg:text-2xl lg:w-[60%] lg:px-0 px-16'
        variants={itemVariants}
      >
        Whether you are hiring or job-hunting, we're here to make the match easy.
      </motion.p>
      
      <motion.div 
        className='mt-6 flex gap-4 justify-center lg:justify-start items-center'
        variants={itemVariants}
      >
        <motion.div variants={buttonVariants}>
          <Link 
            href='/contact' 
            className='bg-white lg:text-xl text-gray-900 lg:px-28 cursor-pointer px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 inline-block'
          >
            Find Talents
          </Link>
        </motion.div>
        
        <motion.div variants={buttonVariants}>
          <Link 
            href='/contact' 
            className='bg-[#16252D] text-white lg:text-xl lg:px-28 cursor-pointer px-8 py-4 border-2 border-[#c1eddd] rounded-full hover:bg-[#1f1f1f] transition-all duration-300 inline-block'
          >
            Explore Roles
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Cta