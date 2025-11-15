'use client'
import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingDown, Clock, Users, Code, CheckCircle, ArrowRight } from 'lucide-react';

// Currency data
const currencies = {
  USD: { 
    symbol: '$', 
    name: 'US Dollar',
    country: 'United States'
  },
  NGN: { 
    symbol: '₦', 
    name: 'Nigerian Naira',
    country: 'Nigeria'
  },
  JPY: { 
    symbol: '¥', 
    name: 'Japanese Yen',
    country: 'Japan'
  },
  GBP: { 
    symbol: '£', 
    name: 'British Pound',
    country: 'United Kingdom'
  },
  EUR: { 
    symbol: '€', 
    name: 'Euro',
    country: 'Europe'
  },
  ZAR: { 
    symbol: 'R', 
    name: 'South African Rand',
    country: 'South Africa'
  },
  INR: { 
    symbol: '₹', 
    name: 'Indian Rupee',
    country: 'India'
  },
};

// Tech role salaries by currency (actual local market rates)
const techRolesByCurrency = {
  USD: {
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
  },
  NGN: {
    'Frontend Developer': { salary: 4800000, description: 'React, Vue, Angular, HTML/CSS' },
    'Backend Developer': { salary: 5400000, description: 'Node.js, Python, Java, PHP' },
    'Full Stack Developer': { salary: 6000000, description: 'Frontend + Backend development' },
    'Mobile Developer': { salary: 5100000, description: 'iOS, Android, React Native, Flutter' },
    'QA/Test Engineer': { salary: 3600000, description: 'Manual & automated testing' },
    'Data Analyst': { salary: 4200000, description: 'SQL, Python, data visualization' },
    'AI/ML Engineer': { salary: 7200000, description: 'Machine learning models, TensorFlow, PyTorch' },
    'DevOps Engineer': { salary: 6600000, description: 'CI/CD, cloud infrastructure' },
    'UI/UX Designer': { salary: 4500000, description: 'Product design, user research, wireframing' },
    'Graphic Designer': { salary: 4000000, description: 'Brand identity, marketing materials, visual design' },
    'Motion Graphics Designer': { salary: 3600000, description: 'Animation, video editing, After Effects' },
    'Product Manager': { salary: 7800000, description: 'Product strategy, roadmap' },
  },
  JPY: {
    'Frontend Developer': { salary: 5500000, description: 'React, Vue, Angular, HTML/CSS' },
    'Backend Developer': { salary: 6000000, description: 'Node.js, Python, Java, PHP' },
    'Full Stack Developer': { salary: 6500000, description: 'Frontend + Backend development' },
    'Mobile Developer': { salary: 5800000, description: 'iOS, Android, React Native, Flutter' },
    'QA/Test Engineer': { salary: 4500000, description: 'Manual & automated testing' },
    'Data Analyst': { salary: 5000000, description: 'SQL, Python, data visualization' },
    'AI/ML Engineer': { salary: 7500000, description: 'Machine learning models, TensorFlow, PyTorch' },
    'DevOps Engineer': { salary: 7000000, description: 'CI/CD, cloud infrastructure' },
    'UI/UX Designer': { salary: 5200000, description: 'Product design, user research, wireframing' },
    'Graphic Designer': { salary: 4200000, description: 'Brand identity, marketing materials, visual design' },
    'Motion Graphics Designer': { salary: 4800000, description: 'Animation, video editing, After Effects' },
    'Product Manager': { salary: 8000000, description: 'Product strategy, roadmap' },
  },
  GBP: {
    'Frontend Developer': { salary: 45000, description: 'React, Vue, Angular, HTML/CSS' },
    'Backend Developer': { salary: 50000, description: 'Node.js, Python, Java, PHP' },
    'Full Stack Developer': { salary: 55000, description: 'Frontend + Backend development' },
    'Mobile Developer': { salary: 48000, description: 'iOS, Android, React Native, Flutter' },
    'QA/Test Engineer': { salary: 38000, description: 'Manual & automated testing' },
    'Data Analyst': { salary: 42000, description: 'SQL, Python, data visualization' },
    'AI/ML Engineer': { salary: 65000, description: 'Machine learning models, TensorFlow, PyTorch' },
    'DevOps Engineer': { salary: 58000, description: 'CI/CD, cloud infrastructure' },
    'UI/UX Designer': { salary: 44000, description: 'Product design, user research, wireframing' },
    'Graphic Designer': { salary: 35000, description: 'Brand identity, marketing materials, visual design' },
    'Motion Graphics Designer': { salary: 40000, description: 'Animation, video editing, After Effects' },
    'Product Manager': { salary: 70000, description: 'Product strategy, roadmap' },
  },
  EUR: {
    'Frontend Developer': { salary: 50000, description: 'React, Vue, Angular, HTML/CSS' },
    'Backend Developer': { salary: 55000, description: 'Node.js, Python, Java, PHP' },
    'Full Stack Developer': { salary: 60000, description: 'Frontend + Backend development' },
    'Mobile Developer': { salary: 54000, description: 'iOS, Android, React Native, Flutter' },
    'QA/Test Engineer': { salary: 42000, description: 'Manual & automated testing' },
    'Data Analyst': { salary: 48000, description: 'SQL, Python, data visualization' },
    'AI/ML Engineer': { salary: 70000, description: 'Machine learning models, TensorFlow, PyTorch' },
    'DevOps Engineer': { salary: 65000, description: 'CI/CD, cloud infrastructure' },
    'UI/UX Designer': { salary: 47000, description: 'Product design, user research, wireframing' },
    'Graphic Designer': { salary: 38000, description: 'Brand identity, marketing materials, visual design' },
    'Motion Graphics Designer': { salary: 44000, description: 'Animation, video editing, After Effects' },
    'Product Manager': { salary: 75000, description: 'Product strategy, roadmap' },
  },
  ZAR: {
    'Frontend Developer': { salary: 420000, description: 'React, Vue, Angular, HTML/CSS' },
    'Backend Developer': { salary: 480000, description: 'Node.js, Python, Java, PHP' },
    'Full Stack Developer': { salary: 540000, description: 'Frontend + Backend development' },
    'Mobile Developer': { salary: 450000, description: 'iOS, Android, React Native, Flutter' },
    'QA/Test Engineer': { salary: 340000, description: 'Manual & automated testing' },
    'Data Analyst': { salary: 380000, description: 'SQL, Python, data visualization' },
    'AI/ML Engineer': { salary: 660000, description: 'Machine learning models, TensorFlow, PyTorch' },
    'DevOps Engineer': { salary: 600000, description: 'CI/CD, cloud infrastructure' },
    'UI/UX Designer': { salary: 390000, description: 'Product design, user research, wireframing' },
    'Graphic Designer': { salary: 400000, description: 'Brand identity, marketing materials, visual design' },
    'Motion Graphics Designer': { salary: 350000, description: 'Animation, video editing, After Effects' },
    'Product Manager': { salary: 720000, description: 'Product strategy, roadmap' },
  },
  INR: {
    'Frontend Developer': { salary: 800000, description: 'React, Vue, Angular, HTML/CSS' },
    'Backend Developer': { salary: 900000, description: 'Node.js, Python, Java, PHP' },
    'Full Stack Developer': { salary: 1000000, description: 'Frontend + Backend development' },
    'Mobile Developer': { salary: 850000, description: 'iOS, Android, React Native, Flutter' },
    'QA/Test Engineer': { salary: 600000, description: 'Manual & automated testing' },
    'Data Analyst': { salary: 700000, description: 'SQL, Python, data visualization' },
    'AI/ML Engineer': { salary: 1400000, description: 'Machine learning models, TensorFlow, PyTorch' },
    'DevOps Engineer': { salary: 1200000, description: 'CI/CD, cloud infrastructure' },
    'UI/UX Designer': { salary: 750000, description: 'Product design, user research, wireframing' },
    'Graphic Designer': { salary: 500000, description: 'Brand identity, marketing materials, visual design' },
    'Motion Graphics Designer': { salary: 600000, description: 'Animation, video editing, After Effects' },
    'Product Manager': { salary: 1600000, description: 'Product strategy, roadmap' },
  },
};

const HiringCalculator = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedRole, setSelectedRole] = useState('Frontend Developer');
  const [numHires, setNumHires] = useState(2);
  const [customSalary, setCustomSalary] = useState(70000);
  const [showResults, setShowResults] = useState(false);
  const [exchangeRates, setExchangeRates] = useState({});
  const [ratesLoading, setRatesLoading] = useState(true);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        setExchangeRates(data.rates);
        setRatesLoading(false);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        setExchangeRates({
          USD: 1,
          NGN: 1550,
          JPY: 149,
          GBP: 0.79,
          EUR: 0.92,
          ZAR: 18.5,
          INR: 83
        });
        setRatesLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  const getCurrentTechRoles = () => techRolesByCurrency[selectedCurrency];

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    const newRoles = techRolesByCurrency[currency];
    setCustomSalary(newRoles[selectedRole].salary);
    setShowResults(false);
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    const currentRoles = getCurrentTechRoles();
    setCustomSalary(currentRoles[role].salary);
    setShowResults(false);
  };

  const traditionalTimeToHire = 45;
  const traditionalReplacementRisk = 0.20;
  const juniorForgeTimeToHire = 3;
  const juniorForgeReplacementRisk = 0.05;
  const juniorForgeCostReduction = 0.40;

  const avgSalary = customSalary;
  const juniorForgeSalary = avgSalary * (1 - juniorForgeCostReduction);

  const getConvertedCost = (usdAmount) => {
    if (ratesLoading || !exchangeRates[selectedCurrency]) {
      return usdAmount;
    }
    return usdAmount * exchangeRates[selectedCurrency];
  };

  const baseJobBoardCost = 500;
  const baseScreeningCost = 2000;
  const traditionalCostPerHire = getConvertedCost(baseJobBoardCost + baseScreeningCost);
  const traditionalTotalCost = traditionalCostPerHire * numHires;

  const timeSavingsDays = (traditionalTimeToHire - juniorForgeTimeToHire) * numHires;
  const dailyProductivityCost = juniorForgeSalary / 260;
  const timeSavingsValue = timeSavingsDays * dailyProductivityCost;

  const replacementCost = avgSalary * 0.5;
  const traditionalReplacementCost = numHires * traditionalReplacementRisk * replacementCost;
  const juniorForgeReplacementCost = numHires * juniorForgeReplacementRisk * replacementCost;
  const replacementSavings = traditionalReplacementCost - juniorForgeReplacementCost;

  const hoursPerCandidate = 3;
  const avgCandidatesScreened = 20;
  const totalScreeningHours = numHires * avgCandidatesScreened * hoursPerCandidate;
  const baseHourlyRate = 50;
  const hourlyRate = getConvertedCost(baseHourlyRate);
  const screeningTimeSavings = totalScreeningHours * hourlyRate;

  const sixMonthSalarySavings = (avgSalary - juniorForgeSalary) * 0.5 * numHires;
  const totalSavings = traditionalTotalCost + timeSavingsValue + replacementSavings + screeningTimeSavings + sixMonthSalarySavings;

  const convertToUSD = (amount) => {
    if (ratesLoading || !exchangeRates[selectedCurrency]) {
      return amount;
    }
    return amount / exchangeRates[selectedCurrency];
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  const formatCurrency = (amount, currency = selectedCurrency, showDecimals = false) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(amount);
  };

  const formatDualCurrency = (amount) => {
    const primary = formatCurrency(amount);
    if (selectedCurrency === 'USD') {
      return primary;
    }
    const usdAmount = convertToUSD(amount);
    return (
      <span>
        {primary} <span className="text-sm opacity-70">({formatCurrency(usdAmount, 'USD')} USD)</span>
      </span>
    );
  };

  const getSalaryRange = () => {
    const currentRoles = getCurrentTechRoles();
    const salaries = Object.values(currentRoles).map(role => role.salary);
    const minSalary = Math.min(...salaries);
    const maxSalary = Math.max(...salaries);
    
    const rangeMin = Math.floor(minSalary * 0.6);
    const rangeMax = Math.ceil(maxSalary * 1.5);
    const rangeStep = Math.ceil((rangeMax - rangeMin) / 100);
    
    return {
      min: rangeMin,
      max: rangeMax,
      step: rangeStep
    };
  };

  const salaryRange = getSalaryRange();

  return (
    <div className="bg-gradient-to-b from-gray-50 via-white to-gray-50 py-20 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 mb-8 rounded-full shadow-sm border border-gray-100">
            <div className="w-2 h-2 bg-[#12895E] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">100% Free Service</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-[1.1] tracking-tight">
            Calculate your<br />hiring savings
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed font-light">
            See how much time and money you save with pre-vetted tech talent ready to interview in 72 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 space-y-8">
              
              {/* Currency Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-4 tracking-wider uppercase">
                  Select your currency
                </label>
                <div className="relative">
                  <select
                    value={selectedCurrency}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-5 py-4 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#685EFC] focus:bg-white focus:border-[#685EFC] cursor-pointer text-base appearance-none transition-all"
                  >
                    {Object.keys(currencies).map((code) => (
                      <option key={code} value={code}>
                        {currencies[code].symbol} {currencies[code].name} ({code})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                  Salaries adjusted for {currencies[selectedCurrency].country}
                </p>
              </div>

              {/* Role Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-4 tracking-wider uppercase">
                  What role are you hiring for?
                </label>
                <div className="relative">
                  <select
                    value={selectedRole}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-5 py-4 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#685EFC] focus:bg-white focus:border-[#685EFC] cursor-pointer text-base appearance-none transition-all"
                  >
                    {Object.keys(getCurrentTechRoles()).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                  {getCurrentTechRoles()[selectedRole].description}
                </p>
              </div>

              {/* Number of Hires */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-6 tracking-wider uppercase">
                  How many do you need?
                </label>
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={numHires}
                      onChange={(e) => {
                        setNumHires(parseInt(e.target.value));
                        setShowResults(false);
                      }}
                      className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #685EFC 0%, #685EFC ${(numHires - 1) * 11.11}%, #e5e7eb ${(numHires - 1) * 11.11}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                  <div className="bg-gradient-to-br from-[#685EFC] to-[#5449d4] text-white rounded-2xl px-6 py-3 min-w-[90px] text-center shadow-lg">
                    <span className="text-3xl font-bold">{numHires}</span>
                  </div>
                </div>
                <div className="flex justify-between mt-3 text-xs text-gray-400 font-medium px-1">
                  <span>1 hire</span>
                  <span>10 hires</span>
                </div>
              </div>

              {/* Salary Input */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase">
                    Expected annual salary
                  </label>
                  <span className="text-xs text-[#685EFC] font-semibold bg-purple-50 px-3 py-1.5 rounded-full">
                    Avg: {formatCurrency(getCurrentTechRoles()[selectedRole].salary)}
                  </span>
                </div>
                <div className="mb-5">
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">
                      {currencies[selectedCurrency].symbol}
                    </span>
                    <input
                      type="number"
                      value={customSalary}
                      onChange={(e) => {
                        setCustomSalary(parseInt(e.target.value) || 0);
                        setShowResults(false);
                      }}
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl pl-14 pr-5 py-5 text-3xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#685EFC] focus:bg-white focus:border-[#685EFC] transition-all"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={salaryRange.min}
                  max={salaryRange.max}
                  step={salaryRange.step}
                  value={customSalary}
                  onChange={(e) => {
                    setCustomSalary(parseInt(e.target.value));
                    setShowResults(false);
                  }}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #685EFC 0%, #685EFC ${((customSalary - salaryRange.min) / (salaryRange.max - salaryRange.min)) * 100}%, #e5e7eb ${((customSalary - salaryRange.min) / (salaryRange.max - salaryRange.min)) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between mt-3 text-xs text-gray-400 font-medium px-1">
                  <span>{formatCurrency(salaryRange.min)}</span>
                  <span>{formatCurrency(salaryRange.max)}</span>
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                className="w-full bg-gradient-to-r from-[#12895E] to-[#0f7a4b] hover:from-[#0f7a4b] hover:to-[#0c6340] text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                Calculate savings
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className={`lg:col-span-3 transition-all duration-500 ${showResults ? 'opacity-100' : 'opacity-30'}`}>
            {showResults ? (
              <div className="space-y-8">
                {/* Main Savings Card */}
                <div className="bg-gradient-to-br from-[#685EFC] via-[#685EFC] to-[#5449d4] text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">
                  <p className="text-xs sm:text-sm font-semibold mb-3 opacity-90 uppercase tracking-wide">Total savings with JuniorForge</p>
                  <p className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight break-words">
                    {formatDualCurrency(totalSavings)}
                  </p>
                  <p className="text-base sm:text-lg opacity-90 mb-6 sm:mb-8 font-light">
                    For hiring {numHires} {selectedRole}{numHires > 1 ? 's' : ''}
                  </p>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
                    <p className="text-xs sm:text-sm font-semibold mb-3 opacity-90 uppercase tracking-wide">Your monthly cost per {selectedRole}</p>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 break-words">
                      {formatDualCurrency(Math.round(juniorForgeSalary / 12))}
                    </p>
                    <p className="text-xs sm:text-sm opacity-80 mt-3 font-light">
                      vs {formatDualCurrency(Math.round(customSalary / 12))} market rate — Save 40% on talent costs
                    </p>
                  </div>
                </div>

                {/* Breakdown Section */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 sm:mb-6 px-2">
                    Savings Breakdown
                  </h3>
                  
                  <div className="space-y-4 sm:space-y-5">
                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#37ffb7] to-[#12895E] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-gray-500 mb-2 font-medium">Lower salary costs (first 6 months)</p>
                          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 break-words">
                            {formatDualCurrency(sixMonthSalarySavings)}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            Pay 40% below market rate for pre-vetted talent. That's {formatDualCurrency(Math.round(juniorForgeSalary / 12))}/month vs {formatDualCurrency(Math.round(customSalary / 12))} market rate.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#685EFC] to-[#5449d4] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-gray-500 mb-2 font-medium">Time-to-hire savings</p>
                          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 break-words">
                            {formatDualCurrency(timeSavingsValue)}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            Get candidates in 72 hours instead of waiting {traditionalTimeToHire} days. That's {timeSavingsDays} days of productivity you keep.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#37ffb7] to-[#12895E] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-gray-500 mb-2 font-medium">Team time saved</p>
                          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 break-words">
                            {formatDualCurrency(screeningTimeSavings)}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            Your team saves {totalScreeningHours} hours. No resume screening, no initial calls—just final interviews with pre-vetted talent.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#685EFC] to-[#5449d4] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-gray-500 mb-2 font-medium">Reduced bad hire risk</p>
                          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 break-words">
                            {formatDualCurrency(replacementSavings)}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            Our vetting process plus 90-day guarantee reduces replacement costs by 75%.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#37ffb7] to-[#12895E] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Code className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-gray-500 mb-2 font-medium">Job boards & recruiting costs</p>
                          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 break-words">
                            {formatDualCurrency(traditionalTotalCost)}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            No job board fees, no agency placement fees. JuniorForge is completely free.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 border border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    <span className="font-semibold text-gray-900">Note:</span> These calculations are based on industry averages for traditional hiring in {currencies[selectedCurrency].country}. Your actual savings may vary based on your specific situation, but the time and quality advantages remain consistent.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-12">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Calculator className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-xl text-gray-400 leading-relaxed font-light">
                    Fill in your hiring details and click calculate to see your potential savings
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Benefits Section */}
        {showResults && (
          <>
            <div className="mt-16 sm:mt-20 lg:mt-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              <div className="group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#12895E] to-[#0f7a4b] rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">72-hour turnaround</h4>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Skip weeks of sourcing and screening. Get qualified candidates ready for final interviews within three days.
                </p>
              </div>
              <div className="group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#12895E] to-[#0f7a4b] rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Rigorously pre-vetted</h4>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Technical assessments, portfolio reviews, and culture fit screening completed before you meet them.
                </p>
              </div>
              <div className="group sm:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#12895E] to-[#0f7a4b] rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                  <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Completely free</h4>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  No placement fees, no agency costs, no hidden charges. You only pay the talent's salary.
                </p>
              </div>
            </div>

            {/* Hidden Value Section */}
            <div className="mt-16 sm:mt-20 lg:mt-24 bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl border border-gray-100">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                What the calculator doesn't include
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10 leading-relaxed max-w-3xl">
                The real value goes beyond the numbers. Here's what you also get with JuniorForge:
              </p>
              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="flex gap-4 sm:gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#37ffb7] to-[#12895E] rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 mb-2 text-base sm:text-lg">Quality of hire</h4>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      Pre-vetted means better cultural and technical fit from day one
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 sm:gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#37ffb7] to-[#12895E] rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 mb-2 text-base sm:text-lg">Reduced stress</h4>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      Hiring is draining; we handle the hard parts so you can focus on building
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 sm:gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#37ffb7] to-[#12895E] rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 mb-2 text-base sm:text-lg">Faster onboarding</h4>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      Better matches mean quicker ramp-up time and earlier productivity
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 sm:gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#37ffb7] to-[#12895E] rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 mb-2 text-base sm:text-lg">Long-term retention</h4>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      Good matches from the start means people stay longer and grow with your company
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #685EFC;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(104, 94, 252, 0.4);
          transition: all 0.2s;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(104, 94, 252, 0.5);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #685EFC;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(104, 94, 252, 0.4);
          transition: all 0.2s;
        }
        
        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(104, 94, 252, 0.5);
        }
      `}</style>
    </div>
  );
};

export default HiringCalculator;