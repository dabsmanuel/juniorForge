'use client'
import { motion } from "framer-motion"
import Image from "next/image"

const Story = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.3
      }
    }
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const textVariants = {
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

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const staggerTextVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <section className="lg:-mt-0 -mt-8">
      <div className="max-w-5xl mx-auto">
        {/* First Row */}
        <motion.div 
          className="flex lg:gap-4 gap-6 lg:flex-row flex-col-reverse"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2 }}
        >
          <motion.div 
            className="flex-1"
            variants={imageVariants}
          >
            <Image
              src='/images/about1.png'
              height={500}
              width={500}
              className="h-full w-full lg:rounded-2xl"
              alt="about1"
            />
          </motion.div>
          <div className='mt-30 flex-1 px-4 lg:px-0'>
            <motion.div 
              className='mb-6 lg:text-start text-center lg:block hidden'
              variants={headingVariants}
            >
              <h2 className='text-4xl md:text-6xl font-bold'>Our Story:</h2>
              <h2 className='text-[32px] md:text-6xl font-bold'>Where it all started from</h2>
            </motion.div>
            <motion.div 
              className='mb-8 lg:text-start text-center lg:hidden block'
              variants={headingVariants}
            >
              <h2 className='text-4xl md:text-6xl font-bold'>Our Story: Where it all started from</h2>
            </motion.div>
            <motion.div 
              className='mt-6'
              variants={cardVariants}
            >
              <p className='px-8 py-10 bg-[#685EFC] rounded-2xl text-white text-lg md:text-xl lg:text-start text-center'>
                At JuniorForge, we believe startups and young professionals are two sides of the same coin - both driven by ambition, creativity, and the hunger to grow.
              </p>  
            </motion.div>
          </div>
        </motion.div>

        {/* Second Row */}
        <motion.div 
          className="flex lg:gap-4 gap-6 lg:flex-row flex-col mt-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2 }}
        >
          <motion.div 
            className='flex-1 py-16 bg-[#685EFC] rounded-2xl text-white text-lg md:text-xl lg:text-start text-center lg:mx-0 mx-4'
            variants={cardVariants}
          >
            <motion.div
              variants={staggerTextVariants}
            >
              <motion.p 
                className='px-4'
                variants={paragraphVariants}
              >
                We started with a simple question: What if we could make it easier for startups to find the right people and for talents to find the right opportunities no matter where they are in the world?
              </motion.p>  
              <motion.p 
                className="font-bold py-8 px-4"
                variants={paragraphVariants}
              >
                Today, we are building that bridge - One match at a time.
              </motion.p>
              <motion.p 
                className='px-4'
                variants={paragraphVariants}
              >
                We connect cost-conscious startups with vetted, inexperienced but proven tech talents who have demonstrated their skills through personal projects, hackathon, or open-source contributions.
              </motion.p>
            </motion.div>
          </motion.div>
          <motion.div 
            className="flex-1"
            variants={imageVariants}
          >
            <Image
              src='/images/about2.png'
              height={500}
              width={500}
              className="h-full w-full lg:rounded-2xl"
              alt="about1"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Story