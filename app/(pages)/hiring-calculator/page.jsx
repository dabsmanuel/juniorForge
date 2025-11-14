'use client'
import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingDown, Clock, Users, Code } from 'lucide-react';

const HiringCalculator = () => {
  // Tech role data with industry standard salaries
  const techRoles = {
    'Frontend Developer': { salary: 70000, description: 'React, Vue, Angular, HTML/CSS' },
    'Backend Developer': { salary: 75000, description: 'Node.js, Python, Java, PHP' },
    'Full Stack Developer': { salary: 80000, description: 'Frontend + Backend development' },
    'Mobile Developer': { salary: 75000, description: 'iOS, Android, React Native, Flutter' },
    'QA/Test Engineer': { salary: 60000, description: 'Manual & automated testing' },
    'Data Analyst': { salary: 65000, description: 'SQL, Python, data visualization' },
    'AI/ML Engineer': { salary: 85000, description: 'Machine learning models, TensorFlow, PyTorch' },
    'DevOps Engineer': { salary: 80000, description: 'CI/CD, cloud infrastructure' },
    'UI/UX Designer': { salary: 65000, description: 'Product design, user research, wireframing' },
    'Graphic Designer': { salary: 55000, description: 'Brand identity, marketing materials, visual design' },
    'Motion Graphics Designer': { salary: 60000, description: 'Animation, video editing, After Effects' },
    'Product Manager': { salary: 85000, description: 'Product strategy, roadmap' },
  };

  const [selectedRole, setSelectedRole] = useState('Frontend Developer');
  const [numHires, setNumHires] = useState(2);
  const [customSalary, setCustomSalary] = useState(techRoles['Frontend Developer'].salary);
  const [showResults, setShowResults] = useState(false);

  // Update custom salary when role changes
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setCustomSalary(techRoles[role].salary);
    setShowResults(false);
  };

  // Traditional hiring costs (without JuniorForge)
  const traditionalJobBoardCost = 500;
  const traditionalScreeningTimeCost = 2000;
  const traditionalTimeToHire = 45;
  const traditionalReplacementRisk = 0.20;

  // JuniorForge advantages
  const juniorForgeTimeToHire = 7;
  const juniorForgeReplacementRisk = 0.05;
  
  // Calculate costs
  const avgSalary = customSalary;
  
  const traditionalCostPerHire = traditionalJobBoardCost + traditionalScreeningTimeCost;
  const traditionalTotalCost = traditionalCostPerHire * numHires;

  const timeSavingsDays = (traditionalTimeToHire - juniorForgeTimeToHire) * numHires;
  const dailyProductivityCost = avgSalary / 260;
  const timeSavingsValue = timeSavingsDays * dailyProductivityCost;

  const replacementCost = avgSalary * 0.5;
  const traditionalReplacementCost = numHires * traditionalReplacementRisk * replacementCost;
  const juniorForgeReplacementCost = numHires * juniorForgeReplacementRisk * replacementCost;
  const replacementSavings = traditionalReplacementCost - juniorForgeReplacementCost;

  const hoursPerCandidate = 3;
  const avgCandidatesScreened = 20;
  const totalScreeningHours = numHires * avgCandidatesScreened * hoursPerCandidate;
  const hourlyRate = 50;
  const screeningTimeSavings = totalScreeningHours * hourlyRate;

  const totalSavings = traditionalTotalCost + timeSavingsValue + replacementSavings + screeningTimeSavings;

  const handleCalculate = () => {
    setShowResults(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white py-16 px-4 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-block bg-[#685EFC] px-4 py-1.5 mb-6 rounded-2xl border border-[#c1eddd]">
            <span className="text-sm font-semibold text-white">100% FREE SERVICE</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Calculate your hiring savings
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            See how much time and money you save with pre-vetted tech talent ready to interview in 72 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <div className="mb-10">
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                What role are you hiring for?
              </label>
              <select
                value={selectedRole}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full bg-white border-2 border-gray-900 px-4 py-4 text-gray-900 font-medium focus:outline-none focus:border-[#685EFC] cursor-pointer text-base"
              >
                {Object.keys(techRoles).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                {techRoles[selectedRole].description}
              </p>
            </div>

            <div className="mb-10">
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                How many do you need?
              </label>
              <div className="flex items-center gap-6">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={numHires}
                  onChange={(e) => {
                    setNumHires(parseInt(e.target.value));
                    setShowResults(false);
                  }}
                  className="flex-1 h-1 bg-gray-200 appearance-none cursor-pointer accent-[#685EFC]"
                  style={{
                    background: `linear-gradient(to right, #685EFC 0%, #685EFC ${(numHires - 1) * 11.11}%, #e5e7eb ${(numHires - 1) * 11.11}%, #e5e7eb 100%)`
                  }}
                />
                <span className="text-4xl font-bold text-gray-900 min-w-[60px] text-right">{numHires}</span>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>1</span>
                <span>10</span>
              </div>
            </div>

            <div className="mb-12">
              <div className="flex items-baseline justify-between mb-4">
                <label className="block text-sm font-semibold text-gray-900">
                  Expected annual salary
                </label>
                <span className="text-xs text-gray-500">Industry avg: {formatCurrency(techRoles[selectedRole].salary)}</span>
              </div>
              <div className="mb-4">
                <input
                  type="number"
                  value={customSalary}
                  onChange={(e) => {
                    setCustomSalary(parseInt(e.target.value) || 0);
                    setShowResults(false);
                  }}
                  className="w-full bg-white border-2 border-gray-900 px-4 py-4 text-3xl font-bold text-gray-900 focus:outline-none focus:border-[#685EFC]"
                />
              </div>
              <input
                type="range"
                min="40000"
                max="120000"
                step="5000"
                value={customSalary}
                onChange={(e) => {
                  setCustomSalary(parseInt(e.target.value));
                  setShowResults(false);
                }}
                className="w-full h-1 bg-gray-200 appearance-none cursor-pointer accent-[#685EFC]"
                style={{
                  background: `linear-gradient(to right, #685EFC 0%, #685EFC ${((customSalary - 40000) / 80000) * 100}%, #e5e7eb ${((customSalary - 40000) / 80000) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>$40k</span>
                <span>$120k</span>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              className="w-full bg-[#12895E] hover:bg-[#0f7a4b] text-white font-semibold py-5 px-8 transition-colors duration-200 text-lg"
            >
              Calculate savings
            </button>
          </div>

          {/* Results Section */}
          <div className={`lg:col-span-3 transition-opacity duration-300 ${showResults ? 'opacity-100' : 'opacity-30'}`}>
            {showResults ? (
              <div>
                <div className="bg-[#685EFC] text-white p-8 mb-8">
                  <p className="text-sm font-medium mb-3 opacity-90">Total savings with JuniorForge</p>
                  <p className="text-6xl lg:text-7xl font-bold mb-4">{formatCurrency(totalSavings)}</p>
                  <p className="text-lg opacity-90">
                    For hiring {numHires} {selectedRole}{numHires > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">
                    Breakdown
                  </h3>
                  
                  <div className="border-l-4 border-[#37ffb7] pl-6 py-2">
                    <p className="text-sm text-gray-500 mb-1">Time-to-hire savings</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(timeSavingsValue)}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Get candidates in 72 hours instead of waiting {traditionalTimeToHire} days. That's {timeSavingsDays} days of productivity you keep.
                    </p>
                  </div>

                  <div className="border-l-4 border-[#685EFC] pl-6 py-2">
                    <p className="text-sm text-gray-500 mb-1">Team time saved</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(screeningTimeSavings)}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Your team saves {totalScreeningHours} hours. No resume screening, no initial calls—just final interviews with pre-vetted talent.
                    </p>
                  </div>

                  <div className="border-l-4 border-[#37ffb7] pl-6 py-2">
                    <p className="text-sm text-gray-500 mb-1">Reduced bad hire risk</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(replacementSavings)}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Our vetting process plus 90-day guarantee reduces replacement costs by 75%.
                    </p>
                  </div>

                  <div className="border-l-4 border-[#685EFC] pl-6 py-2">
                    <p className="text-sm text-gray-500 mb-1">Job boards & recruiting costs</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(traditionalTotalCost)}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      No job board fees, no agency placement fees. JuniorForge is completely free.
                    </p>
                  </div>
                </div>

                <div className="mt-12 bg-gray-50 p-6">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    These calculations are based on industry averages for traditional hiring. Your actual savings may vary based on your specific situation, but the time and quality advantages remain consistent.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-12">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calculator className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg text-gray-500 leading-relaxed">
                    Fill in your hiring details and click calculate to see your potential savings
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        {showResults && (
          <div className="mt-20 grid md:grid-cols-3 gap-12 max-w-6xl">
            <div>
              <div className="w-12 h-12 bg-[#12895E] flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">72-hour turnaround</h4>
              <p className="text-gray-600 leading-relaxed">
                Skip weeks of sourcing and screening. Get qualified candidates ready for final interviews within three days.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-[#12895E] flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Rigorously pre-vetted</h4>
              <p className="text-gray-600 leading-relaxed">
                Technical assessments, portfolio reviews, and culture fit screening completed before you meet them.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-[#12895E] flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Completely free</h4>
              <p className="text-gray-600 leading-relaxed">
                No placement fees, no agency costs, no hidden charges. You only pay the talent's salary.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HiringCalculator;