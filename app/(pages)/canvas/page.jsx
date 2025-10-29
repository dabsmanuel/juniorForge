'use client';
import React from 'react';

export default function ModernCV() {
  const downloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Download Button */}
      <div className="max-w-4xl mx-auto mb-4 px-8">
        <button
          onClick={downloadPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 print:hidden"
        >
          📥 Download as PDF
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg print:shadow-none">
      {/* Header */}
      <header className="border-b-4 border-blue-600 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Dabobuboibi Emmanuel Oyibo
        </h1>
        <h2 className="text-xl text-blue-600 font-semibold mb-4">
          Tech Entrepreneur & Environmental Sustainability Leader
        </h2>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>📍 Port Harcourt, Nigeria</span>
          <span>📧 dabsoyibo@gmail.com</span>
          <span>📱 +2348158106602</span>
          <span>🌐 www.juniorforge.com</span>
        </div>
      </header>

      {/* Summary */}
      <section className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 border-b-2 border-gray-200 pb-2">
          Summary
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Tech entrepreneur and environmental professional bridging technology and sustainability. 
          Founded JuniorForge, a platform connecting emerging tech talent with opportunities while 
          driving innovation in talent acquisition. Proven track record in stakeholder engagement, 
          community development, and sustainable agriculture initiatives. Combines technical 
          expertise in web development with strategic leadership in environmental conservation 
          and community-centered solutions. Experienced in scaling organizations, building 
          cross-sector partnerships, and delivering measurable impact across technology and 
          environmental sectors.
        </p>
      </section>

      {/* Work Experience */}
      <section className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
          Work Experience
        </h3>

        {/* JuniorForge */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-lg font-bold text-gray-900">Founder & CEO</h4>
              <p className="text-gray-700">JuniorForge, Port Harcourt, Nigeria</p>
            </div>
            <span className="text-gray-600 font-semibold">July 2025 - Present</span>
          </div>
          <ul className="list-disc ml-5 text-gray-700 space-y-1">
            <li>Founded and scaled a talent platform connecting junior tech professionals with career opportunities</li>
            <li>Growing talent pool daily through strategic partnerships and community engagement</li>
            <li>Lead product development, business strategy, and organizational growth</li>
            <li>Built platform infrastructure supporting seamless talent acquisition and candidate management</li>
          </ul>
          <div className="mt-2 text-sm">
            <span className="font-semibold text-gray-700">Sector:</span>
            <span className="text-gray-600"> Technology / Talent Acquisition</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-700">Website:</span>
            <span className="text-blue-600"> www.juniorforge.com</span>
          </div>
        </div>

        {/* ImpactDriver */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-lg font-bold text-gray-900">Frontend Developer & Operations Lead</h4>
              <p className="text-gray-700">ImpactDriver, Port Harcourt, Nigeria</p>
            </div>
            <span className="text-gray-600 font-semibold">January 2025 - July 2025</span>
          </div>
          <ul className="list-disc ml-5 text-gray-700 space-y-1">
            <li>Led organizational staffing and team building initiatives during critical growth phase</li>
            <li>Developed and maintained frontend architecture for impact-driven platform</li>
            <li>Coordinated cross-functional teams to deliver technical solutions aligned with organizational goals</li>
            <li>Implemented responsive web interfaces enhancing user engagement and platform functionality</li>
          </ul>
          <div className="mt-2 text-sm">
            <span className="font-semibold text-gray-700">Sector:</span>
            <span className="text-gray-600"> Technology / Social Impact</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-700">Website:</span>
            <span className="text-blue-600"> www.impactdriver.org</span>
          </div>
        </div>

        {/* Prime Energy Resources */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-lg font-bold text-gray-900">Stakeholder Engagement Manager</h4>
              <p className="text-gray-700">Prime Energy Resources Ltd, Port Harcourt, Nigeria</p>
            </div>
            <span className="text-gray-600 font-semibold">March 2024 - December 2024</span>
          </div>
          <ul className="list-disc ml-5 text-gray-700 space-y-1">
            <li>Engaged farming communities affected by operations and developed community environmental programs</li>
            <li>Led initiatives reducing illegal oil exploration by 40%, introducing sustainable agriculture programs endorsed by local leadership</li>
            <li>Managed stakeholder relationships and supervised cross-functional team of environmental scientists, liaison officers, and agricultural extension workers</li>
          </ul>
          <div className="mt-2 text-sm">
            <span className="font-semibold text-gray-700">Sector:</span>
            <span className="text-gray-600"> Oil and Gas / Environmental Services</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-700">SDG Alignment:</span>
            <span className="text-gray-600"> 15 (Life on Land)</span>
          </div>
        </div>


      </section>

      {/* Education */}
      <section className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
          Education & Training
        </h3>

        <div className="mb-4">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-lg font-semibold text-gray-900">
              Certificate in Green Economy and Trade
            </h4>
            <span className="text-gray-600">November - December 2024</span>
          </div>
          <p className="text-gray-700">The One UN Climate Change Learning Partnership (UN CC:Learn)</p>
          <p className="text-sm text-gray-600 mt-1">
            Focused on trade-environment interface and policy design for green trade
          </p>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-lg font-semibold text-gray-900">
              Bachelor of Agriculture in Agricultural Economics and Extension
            </h4>
            <span className="text-gray-600">2015 - 2021</span>
          </div>
          <p className="text-gray-700">University of Port Harcourt, Nigeria</p>
          <p className="text-sm text-gray-600 mt-1">
            Specialized in Production Economics, Environmental Economics, Agricultural Project Management, and Resources and Environmental Economics
          </p>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-lg font-semibold text-gray-900">
              West African Senior School Certificate Examination
            </h4>
            <span className="text-gray-600">2008 - 2014</span>
          </div>
          <p className="text-gray-700">Obio Comprehensive High School, Rumuomasi, Nigeria</p>
        </div>
      </section>

      {/* Volunteer Experience */}
      <section className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
          Volunteer Experience & Civic Engagement
        </h3>

        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Agriformation Initiative</h4>
              <p className="text-gray-700 text-sm">Team Lead, Communications and Media</p>
            </div>
            <span className="text-gray-600">Present</span>
          </div>
          <ul className="list-disc ml-5 text-gray-700 text-sm space-y-1">
            <li>Lead communications strategy and media outreach for agricultural transformation initiatives</li>
            <li>Coordinate content creation and stakeholder messaging to amplify program impact</li>
          </ul>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Reef Revival</h4>
              <p className="text-gray-700 text-sm">Environmental Conservation Initiative</p>
            </div>
            <span className="text-gray-600">April 2024 - Present</span>
          </div>
          <ul className="list-disc ml-5 text-gray-700 text-sm space-y-1">
            <li>Develop and maintain database of 100+ sponsors, securing over $500,000 for coral reef conservation</li>
            <li>Support awareness campaigns about marine ecosystem protection</li>
          </ul>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Oore Africa</h4>
              <p className="text-gray-700 text-sm">Charitable Technology Platform</p>
            </div>
            <span className="text-gray-600">August 2023 - Present</span>
          </div>
          <ul className="list-disc ml-5 text-gray-700 text-sm space-y-1">
            <li>Developed responsive donation platform enabling over 5 million naira in contributions for education and healthcare</li>
            <li>Enhanced user experience, increasing donation conversions by 40%</li>
          </ul>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                Environmental Sanitation and Protection CDS
              </h4>
              <p className="text-gray-700 text-sm">National Youth Service Corps (NYSC), Nigeria</p>
            </div>
            <span className="text-gray-600">January - November 2023</span>
          </div>
          <ul className="list-disc ml-5 text-gray-700 text-sm space-y-1">
            <li>Organized tree-planting initiatives and waste management campaigns</li>
            <li>Negotiated partnerships for sustainable waste disposal services at Bukuru Market</li>
          </ul>
        </div>
      </section>

      {/* Skills */}
      <section className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
          Skills
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Leadership & Management</h4>
            <ul className="list-disc ml-5 text-gray-700 text-sm space-y-1">
              <li>Entrepreneurship & business development</li>
              <li>Team building and organizational staffing</li>
              <li>Stakeholder engagement and community relations</li>
              <li>Agricultural project design and implementation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Technical</h4>
            <ul className="list-disc ml-5 text-gray-700 text-sm space-y-1">
              <li>Frontend web development</li>
              <li>Platform architecture and design</li>
              <li>Data management and analysis</li>
              <li>User experience optimization</li>
            </ul>
          </div>
        </div>
        <div className="mt-3">
          <span className="font-semibold text-gray-900">Languages:</span>
          <span className="text-gray-700"> English (Fluent)</span>
        </div>
      </section>

      {/* References */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-2 border-b-2 border-gray-200 pb-2">
          References
        </h3>
        <p className="text-gray-700">Available upon request</p>
      </section>
    </div>
    </div>
  );
}