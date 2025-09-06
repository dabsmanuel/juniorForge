'use client'
import { motion } from "framer-motion"
import { whyWeAreDifferent } from "@/data/db"

const Different = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
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
        ease: "easeOut"
      }
    }
  }

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
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
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.1
      }
    }
  }

  return (
    <div className="overflow-x-hidden">
      <motion.section 
        className='max-w-6xl mx-auto px-4 lg:mt-16 mt-8 lg:mb-0 mb-8 bg-[#16252D] rounded-4xl py-16 w-[93%]'
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2 }}
      >
        <motion.div 
          className='lg:px-16 px-4 text-white text-center'
          variants={sectionVariants}
        >
          <motion.h2 
            className='text-4xl font-bold text-center mb-4'
            variants={headingVariants}
          >
            What Makes Us Different?
          </motion.h2>
          <motion.p 
            className='lg:w-[67%] mx-auto'
            variants={textVariants}
          >
            We go beyond standard talent matching. Our approach is designed to ensure quality, growth, and long-term success for both startups and junior professionals.
          </motion.p>
        </motion.div>

        <div className="px-4 lg:px-10 mt-12">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            variants={gridVariants}
          >
            {
              whyWeAreDifferent.map(({id, icon, title, description}) => (
                <motion.div 
                  className="flex lg:flex-row flex-col lg:items-start items-center gap-4 text-white lg:px-16" 
                  key={id}
                  variants={cardVariants}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <motion.div 
                    className="flex-shrink-0 p-3 bg-white rounded-full text-[#685EFC] lg:text-3xl text-6xl"
                    variants={iconVariants}
                  >
                    {icon}
                  </motion.div>
                  <div className="flex">
                    <p className="mb-2 lg:text-start text-center">
                      <span className="font-bold">{title}:</span> {description}
                    </p>
                  </div>
                </motion.div>
              ))
            } 
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}

export default Different