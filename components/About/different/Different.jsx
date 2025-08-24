import { whyWeAreDifferent } from "@/data/db"

const Different = () => {
  return (
    <section className='max-w-6xl mx-auto px-4 lg:mt-16 mt-8 lg:mb-0 mb-8 bg-[#16252D] rounded-4xl py-16 w-[93%]'>
      <div className='lg:px-16 px-4 text-white text-center'>
        <h2 className='text-4xl font-bold text-center mb-4'>What Makes Us Different:</h2>
        <p className='lg:w-[67%] mx-auto'>We go beyond standard talent matching. Our approach is designed to ensure quality, growth, and long-term success for both startups and junior professionals.</p>
      </div>

      <div className="px-4 lg:px-16 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {
            whyWeAreDifferent.map(({id, icon, title, description}) => (
              <div className="flex lg:flex-row flex-col lg:items-start items-center gap-4 text-white lg:px-16" key={id}>
                <div className="flex-shrink-0 p-3 bg-white rounded-full text-[#685EFC] lg:text-3xl text-6xl">
                  {icon}
                </div>
                <div className="flex">
                  <p className="mb-2 lg:text-start text-center"><span className="font-bold">{title}:</span> {description}</p>
                </div>
              </div>
            ))
          } 
        </div>
      </div>
    </section>
  )
}

export default Different