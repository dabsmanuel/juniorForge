'use client'
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

const Header = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const floatAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  const buttonHover = {
    scale: 1.05,
    transition: { duration: 0.2 }
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  return (
    <main className="relative mt-20 overflow-hidden">
      <motion.div 
        className='text-center py-12 flex flex-col items-center justify-center max-w-6xl mx-auto relative px-4'
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        <motion.div 
          className='lg:text-7xl md:text-5xl text-4xl font-bold'
          variants={itemVariants}
        >
          <h2>Building Careers,</h2>
          <h2>Powering Startups.</h2>
        </motion.div>
        
        <motion.div 
          className="absolute top-18 right-34 hidden md:block"
          animate={{
              rotate: [0, 10, -10, 0],
              ...floatAnimation
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          viewport={{ once: false }}
        >
          <Image
            src='/images/topbolt.png'
            alt="bolt"
            width={80}
            height={80}
          />
        </motion.div>
        
        <motion.div 
          className='lg:w-full w-[95%] mx-auto'
          variants={itemVariants}
        >
          <p className='py-4 lg:text-2xl md:text-xl text-lg px-2'>We connect high-potential talent with innovative startups ready to grow.</p>
          <motion.div 
            className="absolute top-44 left-18 right-0 hidden sm:block"
            animate={{
              rotate: [0, 10, -10, 0],
              ...floatAnimation
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            viewport={{ once: false }}
          >
            <Image
              src='/images/bluebolt.png'
              alt="bolt"
              width={80}
              height={80}
            />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className='mt-2 flex gap-4 items-center justify-center flex-wrap'
          variants={itemVariants}
        >
          <motion.div whileHover={buttonHover} whileTap={{ scale: 0.95 }}>
            <Link href='/contact' className='bg-[#685EFC] md:text-2xl text-base cursor-pointer text-white md:px-18 px-8 py-4 rounded-full transition-all duration-300 min-w-[160px] text-center block'>
              Find Talents
            </Link>
          </motion.div>
          <motion.div whileHover={buttonHover} whileTap={{ scale: 0.95 }}>
            <Link href='/contact' className='bg-[#12895E] md:text-2xl text-base hover:bg-[#37ffb7] cursor-pointer hover:text-black text-white md:px-10 px-8 py-4 rounded-full transition-all duration-300 min-w-[160px] text-center block'>
              Apply as a Talent
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Background Logo - positioned behind image container but in front of text section */}
      <motion.div 
        className="absolute inset-x-0 top-[40%] h-[50%] pointer-events-none z-20"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 0.9, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        viewport={{ once: false }}
      >
        <Image
          src="/images/green.png" 
          alt="Background Logo"
          width={500}
          height={500}
          className="w-full max-w-sm h-auto object-contain opacity-0 lg:opacity-90"
        />
      </motion.div>

      {/* image container */}
      <motion.div 
        className="lg:px-4 px-6 relative z-30 max-w-6xl mx-auto"
        variants={imageVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      >
        <Image
          src="/images/merge.png"
          alt="JuniorForge Logo"
          width={500}
          height={500}
          className="w-full h-auto object-cover"
        />
      </motion.div>

      {/* Text section */}
      <motion.div 
        className='py-12 lg:px-0 px-6 relative z-10 max-w-6xl mx-auto'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className='flex md:flex-row flex-col-reverse justify-between gap-8'>
          <motion.div 
            className='w-full h-full'
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: false }}
          >
            <Image
              src="/images/girl.png"
              alt="JuniorForge Logo"
              width={500}
              height={500}
              className="w-full h-auto object-cover"
            />
          </motion.div>
          
          <motion.div 
            className='lg:w-auto w-full lg:pt-10 text-center lg:text-left relative'
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: false }}
          >
            <h2 className='lg:text-4xl md:text-3xl text-2xl font-bold pb-4 px-2 md:px-0'>Built by Startup Builders for Startup Builders</h2>
            
            <motion.div 
              className="absolute top-8 right-16 hidden lg:block"
              animate={floatAnimation}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              viewport={{ once: false }}
            >
              <Image
                src='/images/star.png'
                alt="star"
                width={80}
                height={80}
              />
            </motion.div>
            
            <div className="lg:w-[76%] w-full px-2 md:px-0">
              <motion.p 
                className="text-base md:text-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: false }}
              >
                JuniorForge connects early-stage startups with ready-to-grow junior talents. We exist to close the experience gap and create opportunity where it matters most.
              </motion.p>
              
              <motion.div 
                className='mt-8'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: false }}
              >
                <motion.div whileHover={buttonHover} whileTap={{ scale: 0.95 }}>
                  <Link href='/about' className='bg-[#12895E] text-white lg:px-12 px-6 py-4 rounded-full transition-all duration-300 lg:inline-block block lg:w-auto w-full border border-[#c1eddd] text-center'>
                    Learn more...
                  </Link>
                </motion.div>
              </motion.div>
            </div>
            
            <motion.div 
              className="absolute top-60 right-32 mt-20 mr-32 hidden lg:block"
              animate={{
                rotate: [0, -15, 15, 0],
                ...floatAnimation
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              viewport={{ once: false }}
            >
              <Image
                src='/images/bottombolt.png'
                alt="bolt"
                width={80}
                height={80}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  )
}

export default Header