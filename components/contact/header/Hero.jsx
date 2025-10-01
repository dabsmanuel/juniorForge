'use client'
import { motion } from "framer-motion"

const Hero = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        staggerChildren: 0.3
      }
    }
  }

  const headingVariants = {
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

  const descriptionVariants = {
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

  return (
    <section className="relative h-[50vh] sm:h-[75vh] overflow-hidden bg-fixed">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-no-repeat z-0 startup"
        style={{
          backgroundImage: `url('/images/contact.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }}
      />
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: `linear-gradient(135deg, #37ffb7 0%, #c1eddd 100%)`,
          mixBlendMode: 'overlay',
          opacity: 0.7
        }}
      />
      
      {/* Additional dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/20 z-15" />
      
      {/* Content Container */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-6xl lg:px-16 lg:text-start text-center tracking-tighter"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.3 }}
          >
            {/* Heading */}
            <motion.div 
              className="text-[40px] sm:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight"
              variants={headingVariants}
            >
              <h2>Contact Us</h2>
            </motion.div>
            
            {/* Description */}
            <motion.p 
              className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-8 leading-tight"
              variants={descriptionVariants}
            >
              You're a form away from your goal
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;