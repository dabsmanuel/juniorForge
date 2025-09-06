'use client'
import { motion } from "framer-motion"
import Image from "next/image";

const Header = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
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

  const headingVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  }

  const descriptionVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const imageVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const backgroundImageVariants = {
    hidden: { opacity: 0, x: 30, scale: 1.05 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div 
      className="px-4 lg:px-0 lg:mt-44 mt-32 lg:mb-16  relative -z-10"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3 }}
    >
      <motion.div 
        className="bg-[#12895E] text-white max-w-6xl mx-auto lg:rounded-4xl rounded-2xl lg:h-[500px] md:h-[450px] h-auto lg:text-start text-center relative"
        variants={cardVariants}
      >
        <div className="lg:px-16 px-14">
          <div className="lg:flex relative h-full items-center py-12 lg:py-0 z-50">
            {/* first div - positioned to the left */}
            <div className="lg:w-[60%] md:w-[55%] flex-shrink-0 relative z-30 tracking-tighter">
              <motion.div 
                className="lg:text-[80px] text-[32px] font-bold leading-none pb-2 lg:pt-26 pt-6"
                variants={headingVariants}
              >
                <h2>Forging the</h2>
                <h2>future of work.</h2>
              </motion.div>
              <motion.p 
                className="lg:text-2xl md:text-xl text-lg"
                variants={descriptionVariants}
              >
                We exist to close the experience gap and create opportunity where it
                matters most.
              </motion.p>
            </div>
          </div>

          {/* image container - positioned absolutely on large and medium screens */}
          <motion.div
            className="absolute top-0 right-0 h-full lg:block md:block hidden"
            style={{ width: "calc(45% + 50px)" }}
            variants={imageVariants}
          >
            {/* Background image - appears behind */}
            <motion.div variants={backgroundImageVariants}>
              <Image
                src="/images/jforge.png"
                alt="background"
                width={500}
                height={500}
                className="h-[116%] w-auto object-cover absolute md:-top-16 lg:-top-20 md:right-12 lg:right-24 z-0"
              />
            </motion.div>
            {/* Foreground image - appears on top */}
            <Image
              src="/images/jforgegreen.png"
              alt="logo"
              width={200}
              height={300}
              className="h-full w-full object-cover absolute top-0 md:right-6 lg:right-14 z-10"
            />
          </motion.div>
        </div>

        {/* image container for small screens */}
        <motion.div 
          className="lg:hidden md:hidden relative w-full h-[410px] mt-4"
          variants={imageVariants}
        >
          {/* Background image - appears behind */}
          <motion.div variants={backgroundImageVariants}>
            <Image
              src="/images/jforge.png"
              alt="background"
              width={500}
              height={500}
              className="h-[115%] w-full object-cover absolute -top-16 right-0 z-0"
            />
          </motion.div>
          {/* Foreground image - appears on top */}
          <Image
            src="/images/jforgegreen.png"
            alt="logo"
            width={500}
            height={500}
            className="h-full w-full object-cover absolute top-0 right-0 z-10"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Header;