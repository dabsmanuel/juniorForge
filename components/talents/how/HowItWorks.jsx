'use client'
import { motion } from 'framer-motion';

const HowItWorks = () => {
  // Container animation that orchestrates the wave
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Creates the wave delay between steps
        delayChildren: 0.2
      }
    }
  }

  // Header animation
  const headerVariants = {
    hidden: { 
      opacity: 0, 
      x: -50,
      y: 20
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  // Step animation variants - each step flows in from left
  const stepVariants = {
    hidden: { 
      opacity: 0, 
      x: -80,
      y: 30,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  // Mobile container with faster wave
  const mobileContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Faster wave on mobile
        delayChildren: 0.2
      }
    }
  }

  return (
    <section className="mb-16 bg-cover bg-center bg-no-repeat bg-[url('/images/rectangle.png')] py-12 text-white">
      <motion.div 
        className='max-w-6xl mx-auto lg:px-6 px-4 leading-tight py-32 lg:mt-0 mt-12 lg:block hidden'
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      >
        <motion.h2 
          className='lg:text-[48px] text-[32px] font-bold tracking-tighter lg:text-start text-center lg:relative lg:-top-12'
          variants={headerVariants}
        >
          How it works
        </motion.h2>
        <div className='flex lg:flex-row flex-col lg:space-y-0 space-y-8 justify-between mt-6'>
          <motion.div 
            className=''
            variants={stepVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            <motion.h2 
              className='lg:text-[48px] text-[32px] font-bold text-center'
              initial={{ rotateY: -90 }}
              whileInView={{ rotateY: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              1
            </motion.h2>
            <ul>
              <li className='lg:text-2xl font-bold lg:text-start text-center list-disc list-inside'>Apply Once</li>
            </ul>
          </motion.div>
          <motion.div
            variants={stepVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            <motion.h2 
              className='lg:text-[48px] text-[32px] font-bold text-center'
              initial={{ rotateY: -90 }}
              whileInView={{ rotateY: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              3
            </motion.h2>
            <ul>
              <li className='lg:text-2xl font-bold lg:text-start text-center list-disc list-inside'>Get Matched</li>
            </ul>
          </motion.div>
        </div>

        <motion.div 
          className='text-center mt-6'
          variants={stepVariants}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
        >
          <motion.h2 
            className='lg:text-[48px] text-[32px] font-bold'
            initial={{ rotateY: -90 }}
            whileInView={{ rotateY: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            2
          </motion.h2>
          <ul>
            <li className='lg:text-2xl font-bold list-disc list-inside'>Get Vetted</li>
          </ul>
        </motion.div>
      </motion.div>

      {/* mobile view */}
      <motion.div 
        className='max-w-6xl mx-auto lg:px-6 px-4 leading-tight py-32 lg:mt-0 mt-12 lg:hidden block'
        variants={mobileContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      >
        <motion.h2 
          className='lg:text-[48px] text-[32px] font-bold tracking-tighter lg:text-start text-center lg:relative lg:-top-12'
          variants={headerVariants}
        >
          How it works
        </motion.h2>
        <div className='flex lg:flex-row flex-col lg:space-y-0 space-y-8 justify-between mt-6'>
          <motion.div 
            className=''
            variants={stepVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            <motion.h2 
              className='lg:text-[48px] text-[32px] font-bold text-center mb-2'
              initial={{ rotateY: -90 }}
              whileInView={{ rotateY: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              1
            </motion.h2>
            <ul>
              <li className='lg:text-2xl font-bold lg:text-start text-center list-disc list-inside'>Apply Once</li>
            </ul>
          </motion.div>

          <motion.div 
            className=''
            variants={stepVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            <motion.h2 
              className='lg:text-[48px] text-[32px] font-bold text-center mb-2'
              initial={{ rotateY: -90 }}
              whileInView={{ rotateY: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              2
            </motion.h2>
            <ul>
              <li className='lg:text-2xl font-bold lg:text-start text-center list-disc list-inside'>Get Vetted</li>
            </ul>
          </motion.div>
          <motion.div
            variants={stepVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            <motion.h2 
              className='lg:text-[48px] text-[32px] font-bold text-center mb-2'
              initial={{ rotateY: -90 }}
              whileInView={{ rotateY: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              3
            </motion.h2>
            <ul>
              <li className='lg:text-2xl font-bold lg:text-start text-center list-disc list-inside'>Get Matched</li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HowItWorks;