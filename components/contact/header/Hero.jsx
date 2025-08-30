const Hero = () => {
  return (
    <section className="relative h-[75vh] overflow-hidden bg-fixed">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 startup"
        style={{
          backgroundImage: `url('/images/contact.png')`
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-20 min-h-screen flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl lg:px-16 lg:text-start text-center tracking-tighter">
            {/* Heading */}
            <div className="text-[40px] sm:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight">
              <h2>Contact Us</h2>
            </div>
            
            {/* Description */}
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-8 leading-tight">
              You're a form away from your goal
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;