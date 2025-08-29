import Image from "next/image"

const Header = () => {
  return (
    <div className="px-4 lg:px-0 lg:mt-44 mt-32 mb-16 relative">
      <div className='bg-[#12895E] text-white max-w-6xl mx-auto lg:rounded-4xl rounded-2xl lg:px-16 px-14 lg:h-[500px]  lg:text-start text-center relative'>
        <div className='lg:flex relative h-full items-center py-12 lg:py-0 z-50'>
          {/* first div - positioned to the left */}
          <div className='lg:w-[60%] flex-shrink-0 relative z-30 tracking-tighter'>
            <h2 className='lg:text-[80px] text-[32px] font-bold leading-none pb-2'>Forging the future of work.</h2>
            <p className='lg:text-2xl'>We exist to close the experience gap and create opportunity where it matters most.</p>
          </div>
        </div>
        
        {/* image container - positioned absolutely within the card but allowed to overflow */}
        <div className="absolute top-0 right-0 h-full lg:block hidden" style={{width: 'calc(40% + 100px)'}}>
          {/* Background image - appears behind */}
          <Image
            src='/images/jforge.png'
            alt="background"
            width={500}
            height={500}
            className="h-[115%] w-auto object-cover absolute -top-20 right-24 z0"
          />
          {/* Foreground image - appears on top */}
          <Image
            src='/images/jforgegreen.png'
            alt="logo"
            width={200}
            height={300}
            className="h-full w-full object-cover absolute top-0 right-14 z-"
          />
        </div>
      </div>
    </div>
  )
}

export default Header;