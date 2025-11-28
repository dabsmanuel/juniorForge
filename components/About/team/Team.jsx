"use client"
import { team } from "../../../data/db"
import Image from "next/image"
import { motion } from "framer-motion"

const Team = () => {
  // Container animation variants
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

  // Individual team member card variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  // Header animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const subheaderVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className='max-w-6xl mx-auto my-12 py-6 px-4'>
      <div className='text-center'>
        <motion.h2 
          className='font-bold text-5xl mb-4'
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
        >
          Meet our Team
        </motion.h2>
        <motion.p 
          className='max-w-2xl mx-auto text-xl'
          variants={subheaderVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
        >
          Together, we strive to deliver the best solutions for our clients, while also supporting each other's growth and development.
        </motion.p>
      </div>
      
      <motion.div 
        className="gap-6 mt-10 w-full mx-auto flex lg:flex-row flex-col justify-center items-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
      >
        {
          team.map(({id, team, name, title}) => {
            return(
              <motion.div 
                key={id} 
                className=""
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="bg-[#f2f2ff] rounded-xl overflow-hidden"
                  whileHover={{
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    transition: { duration: 0.3 }
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Image
                      src={team}
                      alt={`${name} photo`}
                      width={500}
                      height={100}
                      className="transition-transform duration-300"
                    />
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="mt-4 lg:text-start text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <motion.p 
                    className="font-bold"
                    whileHover={{ color: "#6366f1" }}
                    transition={{ duration: 0.2 }}
                  >
                    {name}
                  </motion.p>
                  <p>{title}</p>
                </motion.div>
              </motion.div>
            )
          })
        }
      </motion.div>
    </div>
  )
}

export default Team