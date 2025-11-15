'use client'
import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingDown, Clock, Users, Code } from 'lucide-react';

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

  // Fetch exchange rates from API
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        setExchangeRates(data.rates);
        setRatesLoading(false);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        // Fallback to hardcoded rates if API fails
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

  // Get current tech roles based on selected currency
  const getCurrentTechRoles = () => techRolesByCurrency[selectedCurrency];

  // Update custom salary when currency or role changes
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

  // Traditional hiring costs (without JuniorForge)
  const traditionalTimeToHire = 45;
  const traditionalReplacementRisk = 0.20;

  // JuniorForge advantages
  const juniorForgeTimeToHire = 3; // 72 hours = 3 days
  const juniorForgeReplacementRisk = 0.05;
  const juniorForgeCostReduction = 0.40; // 40% savings

  // Calculate costs in selected currency
  const avgSalary = customSalary;
  const juniorForgeSalary = avgSalary * (1 - juniorForgeCostReduction); // 40% cheaper

  // Base costs in USD, converted to local currency using API rates
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
  const dailyProductivityCost = juniorForgeSalary / 260; // Using JuniorForge salary for fair comparison
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

  // Salary savings over 6 months (first placement period)
  const sixMonthSalarySavings = (avgSalary - juniorForgeSalary) * 0.5 * numHires; // 6 months = 0.5 year

  const totalSavings = traditionalTotalCost + timeSavingsValue + replacementSavings + screeningTimeSavings + sixMonthSalarySavings;

  // Convert to USD for dual display
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

  // Get salary range for slider based on currency
  const getSalaryRange = () => {
    const currentRoles = getCurrentTechRoles();
    const salaries = Object.values(currentRoles).map(role => role.salary);
    const minSalary = Math.min(...salaries);
    const maxSalary = Math.max(...salaries);
    
    // Create wider range around min/max
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
                Select your currency
              </label>
              <select
                value={selectedCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-full bg-white border-2 border-gray-900 px-4 py-4 text-gray-900 font-medium focus:outline-none focus:border-[#685EFC] cursor-pointer text-base"
              >
                {Object.keys(currencies).map((code) => (
                  <option key={code} value={code}>
                    {currencies[code].symbol} {currencies[code].name} ({code})
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                Salaries adjusted for {currencies[selectedCurrency].country}
              </p>
            </div>

            <div className="mb-10">
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                What role are you hiring for?
              </label>
              <select
                value={selectedRole}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full bg-white border-2 border-gray-900 px-4 py-4 text-gray-900 font-medium focus:outline-none focus:border-[#685EFC] cursor-pointer text-base"
              >
                {Object.keys(getCurrentTechRoles()).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                {getCurrentTechRoles()[selectedRole].description}
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
                <span className="text-xs text-gray-500">
                  Industry avg: {formatCurrency(getCurrentTechRoles()[selectedRole].salary)}
                </span>
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
                min={salaryRange.min}
                max={salaryRange.max}
                step={salaryRange.step}
                value={customSalary}
                onChange={(e) => {
                  setCustomSalary(parseInt(e.target.value));
                  setShowResults(false);
                }}
                className="w-full h-1 bg-gray-200 appearance-none cursor-pointer accent-[#685EFC]"
                style={{
                  background: `linear-gradient(to right, #685EFC 0%, #685EFC ${((customSalary - salaryRange.min) / (salaryRange.max - salaryRange.min)) * 100}%, #e5e7eb ${((customSalary - salaryRange.min) / (salaryRange.max - salaryRange.min)) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>{formatCurrency(salaryRange.min)}</span>
                <span>{formatCurrency(salaryRange.max)}</span>
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
          <div className={`lg:col-span-3 transition-opacity duration-400 ${showResults ? 'opacity-100' : 'opacity-30'}`}>
            {showResults ? (
              <div>
                <div className="bg-[#685EFC] text-white p-8 mb-8">
                  <p className="text-sm font-medium mb-3 opacity-90">Total savings with JuniorForge</p>
                  <p className="text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                    {formatDualCurrency(totalSavings)}
                  </p>
                  <p className="text-lg opacity-90 mb-6">
                    For hiring {numHires} {selectedRole}{numHires > 1 ? 's' : ''}
                  </p>
                  <div className="border-t border-white/20 pt-6">
                    <p className="text-sm font-medium mb-2 opacity-90">Your monthly cost per {selectedRole} with JuniorForge</p>
                    <p className="text-3xl font-bold mb-1">
                      {formatDualCurrency(Math.round(juniorForgeSalary / 12))}
                    </p>
                    <p className="text-sm opacity-75 mt-2">
                      vs {formatDualCurrency(Math.round(customSalary / 12))} market rate — Save 40% on talent costs
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">
                    Breakdown
                  </h3>
                  
                  <div className="border-l-4 border-[#37ffb7] pl-6 py-2">
                    <p className="text-sm text-gray-500 mb-1">Lower salary costs (first 6 months)</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {formatDualCurrency(sixMonthSalarySavings)}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Pay 40% below market rate for pre-vetted talent. That's {formatDualCurrency(Math.round(juniorForgeSalary / 12))} monthly vs {formatDualCurrency(Math.round(customSalary / 12))} market rate.
                    </p>
                  </div>

                  <div className="border-l-4 border-[#685EFC] pl-6 py-2">
                    <p className="text-sm text-gray-500 mb-1">Time-to-hire savings</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {formatDualCurrency(timeSavingsValue)}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Get candidates in 72 hours instead of waiting {traditionalTimeToHire} days. That's {timeSavingsDays} days of productivity you keep.
                    </p>
                  </div>

                  <div className="border-l-4 border-[#37ffb7] pl-6 py-2">
                    <p className="text-sm text-gray-500 mb-1">Team time saved</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {formatDualCurrency(screeningTimeSavings)}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Your team saves {totalScreeningHours} hours. No resume screening, no initial calls—just final interviews with pre-vetted talent.
                    </p>
                  </div>

                  <div className="border-l-4 border-[#685EFC] pl-6 py-2">
                    <p className="text-sm text-gray-500 mb-1">Reduced bad hire risk</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {formatDualCurrency(replacementSavings)}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Our vetting process plus 90-day guarantee reduces replacement costs by 75%.
                    </p>
                  </div>

                  <div className="border-l-4 border-[#37ffb7] pl-6 py-2">
                    <p className="text-sm text-gray-500 mb-1">Job boards & recruiting costs</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {formatDualCurrency(traditionalTotalCost)}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      No job board fees, no agency placement fees. JuniorForge is completely free.
                    </p>
                  </div>
                </div>

                <div className="mt-12 bg-gray-50 p-6">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    These calculations are based on industry averages for traditional hiring in {currencies[selectedCurrency].country}. Your actual savings may vary based on your specific situation, but the time and quality advantages remain consistent.
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
          <>
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

            {/* What the Calculator Doesn't Include */}
            <div className="mt-20 bg-gray-50 p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                What the calculator doesn't include
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                The real value goes beyond the numbers. Here's what you also get with JuniorForge:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#37ffb7] rounded-full mt-1"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Quality of hire</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Pre-vetted means better cultural and technical fit from day one
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#37ffb7] rounded-full mt-1"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Reduced stress</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Hiring is draining; we handle the hard parts so you can focus on building
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#37ffb7] rounded-full mt-1"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Faster onboarding</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Better matches mean quicker ramp-up time and earlier productivity
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#37ffb7] rounded-full mt-1"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Long-term retention</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Good matches from the start means people stay longer and grow with your company
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HiringCalculator;