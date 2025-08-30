'use client'
import { useState } from "react"

const Form = () => {
  const [tab, setTab] = useState('startups')
  
  return (
    <section className='bg-[#16252D] max-w-5xl mx-auto lg:rounded-2xl my-16 lg:px-0 px-4'>
      <div className='lg:px-8 py-12 px-4'>
        {/* Tab Navigation */}
        <div className='flex gap-4 mb-16 w-full bg-white rounded-full'>
          <button
            onClick={() => setTab('startups')}
            className={`lg:px-12 px-8 py-3 rounded-full font-medium transition-colors w-full ${
              tab === 'startups'
                ? 'bg-[#12895E] text-white border-2 border-[#c1eddd]'
                : 'text-black'
            }`}
          >
            For Startups
          </button>
          <button
            onClick={() => setTab('talents')}
            className={`lg:px-12 px-8 py-3 rounded-full font-medium transition-colors w-full ${
              tab === 'talents'
                ? 'bg-[#12895E] text-white border-2 border-[#c1eddd]'
                : 'text-black '
            }`}
          >
            For Talents
          </button>
        </div>

        <div className='mt-6'>
          {tab === 'startups' && (
            <div>
              <form className='space-y-6'>
                <div>
                  <input
                    type='text'
                    className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                    placeholder='Full name*'
                    required
                  />
                </div>
                <div>
                  <input
                    type='text'
                    className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                    placeholder='Company name*'
                    required
                  />
                </div>
                <div>
                  <input
                    type='email'
                    className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                    placeholder='Email address*'
                    required
                  />
                </div>
                <div>
                  <input
                    type='text'
                    className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                    placeholder='Website:'
                  />
                </div>
                <div>
                  <textarea
                    rows='3'
                    className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                    placeholder='Tell us about your startup*'
                    required
                  ></textarea>
                </div>

                <div>
                  <textarea
                    rows='4'
                    className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                    placeholder='Role description*'
                    required
                  ></textarea>
                </div>

                <div>
                  <input
                    type='text'
                    className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                    placeholder='Hiring timeline:*'
                  />
                </div>
                <button
                  type='submit'
                  className='w-full lg:w-fit bg-[#12895E] text-white py-3 px-10 rounded-full font-medium hover:bg-[#37ffb7] hover:text-black transition-colors border border-[#c1eddd]'
                >
                  Find Talents
                </button>
              </form>
            </div>
          )}

          {tab === 'talents' && (
            <div>
              <form className='space-y-6'>
                <div>
                  <input
                    type='text'
                    className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                    placeholder='Full name*'
                    required
                  />
                </div>
                <div>
                  <input
                    type='email'
                    className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                    placeholder='Email address'
                  />
                </div>
                <div>
                  <input
                    type='text'
                    className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                    placeholder='LinkedIn Profile/Portfolio Link'
                  />
                </div>
                <div>
                  <input
                    type='text'
                    className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                    placeholder='Prefered Role'
                  />
                </div>
                <div>
                  <input
                    type='text'
                    className='w-full px-4 py-3 bg-white border-2 border-[#c1eddd] rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-[#c1eddd]'
                    placeholder='Availability'
                  />
                </div>
                <button
                  type='submit'
                  className='w-full lg:w-fit bg-[#12895E] text-white py-3 px-10 rounded-full border border-[#c1eddd] font-medium hover:bg-[#37ffb7] hover:text-black transition-colors'
                >
                  Apply Now
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Form