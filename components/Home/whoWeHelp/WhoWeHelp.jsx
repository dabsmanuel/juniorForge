'use client'
import { startup, talents } from "@/data/db"
import Link from "next/link"
import { motion } from "framer-motion"

const WhoWeHelp = () => {
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

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  const buttonHover = {
    scale: 1.05,
    transition: { duration: 0.2 }
  }

  const dividerVariants = {
    hidden: { scaleX: 0 },
    visible: { 
      scaleX: 1,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  return (
    <section className="bg-[#16252D] py-16 text-white">
      <motion.div 
        className='max-w-6xl mx-auto lg:px-0 px-6'
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      >
        <motion.h2 
          className='lg:text-4xl text-[32px] font-bold py-4'
          variants={itemVariants}
        >
          Who We Help
        </motion.h2>
        <motion.p 
          className='lg:w-3/5'
          variants={itemVariants}
        >
          We bridge the gap between fast-growing startups and ambitious talent, creating partnerships that drive innovation and career growth.
        </motion.p>
      </motion.div>

      <motion.div 
        className='border-b border-white py-8'
        variants={dividerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
        style={{ originX: 0 }}
      ></motion.div>

      <motion.div 
        className='max-w-6xl mx-auto pt-16 lg:px-0 px-6'
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        <motion.h2 
          className='text-4xl font-bold py-4 uppercase'
          variants={itemVariants}
        >
          For startups
        </motion.h2>
        <motion.ul 
          className="list-disc pl-6"
          variants={containerVariants}
        >
          {startup.map((item, index) => (
            <motion.li 
              key={index} 
              className='py-2'
              variants={listItemVariants}
              whileHover={{ x: 5, transition: { duration: 0.2 } }}
            >
              {item.text}
            </motion.li>
          ))}
        </motion.ul>
        <motion.div 
          className="mt-4"
          variants={itemVariants}
        >
          <motion.div whileHover={buttonHover} whileTap={{ scale: 0.95 }}>
            <Link href="/startups" className="text-[#16252D] bg-white px-6 py-2 rounded-full inline-block transition-all duration-300">
              See How it Works
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        className='border-b border-white py-8'
        variants={dividerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
        style={{ originX: 0 }}
      ></motion.div>

      <motion.div 
        className='max-w-6xl mx-auto pt-16 lg:px-0 px-6'
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        <motion.h2 
          className='text-4xl font-bold py-4 uppercase'
          variants={itemVariants}
        >
          For Talents
        </motion.h2>
        <motion.ul 
          className="list-disc pl-6"
          variants={containerVariants}
        >
          {talents.map((item, index) => (
            <motion.li 
              key={index} 
              className='py-2'
              variants={listItemVariants}
              whileHover={{ x: 5, transition: { duration: 0.2 } }}
            >
              {item.text}
            </motion.li>
          ))}
        </motion.ul>
        <motion.div 
          className="mt-4"
          variants={itemVariants}
        >
          <motion.div whileHover={buttonHover} whileTap={{ scale: 0.95 }}>
            <Link href="/talents" className="text-[#16252D] bg-white px-6 py-2 rounded-full inline-block transition-all duration-300">
              See How it Works
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default WhoWeHelp