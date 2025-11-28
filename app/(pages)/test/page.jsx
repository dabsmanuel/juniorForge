'use client'
import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, BookOpen, TrendingUp, Award, BarChart3, ArrowRight, Code, Bug, AlertCircle } from 'lucide-react';
import Image from 'next/image';

const BACKEND_URL = 'https://juniorforge.onrender.com/api/vetting' || 'http://localhost:5000/api/vetting' ;

const TalentAssessmentInterface = () => {
  const [accessToken, setAccessToken] = useState('');
  const [assessment, setAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [status, setStatus] = useState('login');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [codeAnswer, setCodeAnswer] = useState('');

  useEffect(() => {
    if (status === 'active' && assessment) {
      const handleVisibilityChange = () => {
        if (document.hidden) handleAutoSubmit('Tab switched');
      };
      const handleBeforeUnload = (e) => {
        handleAutoSubmit('Page closed');
        e.preventDefault();
        e.returnValue = '';
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [status, assessment]);

  useEffect(() => {
    if (status === 'active' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoSubmit('Time expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, timeRemaining]);

  const handleAutoSubmit = async (reason) => {
    console.log('Auto-submit:', reason);
    await submitAssessment();
  };

  const loadAssessment = async () => {
    if (!accessToken.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/assessment/${accessToken}`);
      const data = await res.json();
      if (data.success) {
        if (data.status === 'completed' || data.status === 'expired') {
          setStatus('completed');
          setResults(data.data);
        } else {
          setAssessment(data.data);
          setTimeRemaining(data.data.timeRemaining || data.data.durationMinutes * 60);
          setStatus(data.data.startedAt ? 'active' : 'ready');
          const saved = {};
          data.data.responses?.forEach(r => { saved[r.questionIndex] = r.answer; });
          setAnswers(saved);
          setCurrentQuestion(data.data.responses?.length || 0);
        }
      } else {
        alert(data.message || 'Invalid token');
      }
    } catch (err) {
      alert('Cannot reach server. Is backend running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = async () => {
    const res = await fetch(`${BACKEND_URL}/assessment/${accessToken}/start`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      setStatus('active');
      setTimeRemaining(data.data.timeRemaining);
    }
  };

  const submitAnswer = async (qIndex, answer) => {
    await fetch(`${BACKEND_URL}/assessment/${accessToken}/submit-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionIndex: qIndex, answer, timeSpent: 30 })
    });
  };

  const handleAnswerSelect = async (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
    await submitAnswer(currentQuestion, answer);
    if (currentQuestion < assessment.totalQuestions - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    }
  };

  const handleCodeSubmit = async () => {
    if (!codeAnswer.trim()) return;
    setAnswers({ ...answers, [currentQuestion]: codeAnswer });
    await submitAnswer(currentQuestion, codeAnswer);
    setCodeAnswer('');
    if (currentQuestion < assessment.totalQuestions - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    }
  };

  const submitAssessment = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/assessment/${accessToken}/submit`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStatus('completed');
        setResults(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  const getProficiencyColor = (level) => {
    const colors = {
      'Critical Gap': 'bg-red-100 text-red-800 border-red-300',
      'Needs Development': 'bg-orange-100 text-orange-800 border-orange-300',
      'Developing': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Proficient': 'bg-green-100 text-green-800 border-green-300'
    };
    return colors[level] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // LOGIN SCREEN
  if (status === 'login') return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-24 h-24 bg-[#685EFC] rounded-full flex items-center justify-center mx-auto mb-4 p-2">
            <Image
              src="/images/juniorforge.png"
              alt="JuniorForge Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold mb-2">JuniorForge Assessment</h1>
          <p className="text-gray-600">Enter your unique access token to begin</p>
        </div>
        <input
          value={accessToken}
          onChange={e => setAccessToken(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && loadAssessment()}
          placeholder="Enter your access token"
          className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl text-lg focus:border-blue-500 outline-none mb-6"
        />
        <button onClick={loadAssessment} disabled={loading || !accessToken.trim()}
          className="w-full py-4 bg-[#685EFC] text-white text-xl font-bold rounded-xl hover:bg-[#574ED8] disabled:bg-gray-400 transition">
          {loading ? 'Loading...' : 'Start Assessment'}
        </button>
      </div>
    </div>
  );

  // READY SCREEN
  if (status === 'ready') return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome, {assessment?.talentName}!</h1>
        <div className="inline-block px-6 py-3 bg-purple-100 text-purple-800 rounded-full font-bold text-xl mb-8">
          {assessment?.techStack}
        </div>
        <p className="text-xl text-gray-600 mb-10">Rigorous {assessment?.role} assessment with real-world challenges</p>
        
        <div className="space-y-6 text-left mb-12">
          <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-xl">
            <Clock className="w-8 h-8 text-[#685EFC]" />
            <div>
              <div className="font-bold text-lg">{assessment?.durationMinutes} minutes</div>
              <div className="text-sm text-gray-600">Complete duration</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-green-50 rounded-xl">
            <CheckCircle className="w-8 h-8 text-[#12895E]" />
            <div>
              <div className="font-bold text-lg">{assessment?.totalQuestions} questions</div>
              <div className="text-sm text-gray-600">Multiple choice & coding challenges</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-purple-50 rounded-xl">
            <Code className="w-8 h-8 text-[#685EFC]" />
            <div>
              <div className="font-bold text-lg">Practical coding exercises</div>
              <div className="text-sm text-gray-600">Write real code to solve problems</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-red-50 rounded-xl">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <div className="font-bold text-lg">No tab switching</div>
              <div className="text-sm text-gray-600">Assessment will auto-submit if you leave</div>
            </div>
          </div>
        </div>
        
        <button onClick={startAssessment} 
          className="w-full py-6 bg-[#685EFC] text-white text-2xl font-bold rounded-xl hover:bg-[#574ED8] transition shadow-lg">
          Start Now
        </button>
      </div>
    </div>
  );

  // ACTIVE ASSESSMENT
  if (status === 'active') {
    if (!assessment?.questions || !assessment.questions[currentQuestion]) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading question...</p>
          </div>
        </div>
      );
    }

    const q = assessment.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / assessment.totalQuestions) * 100;
    const isCodingQuestion = q.questionType === 'coding';

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 sticky top-4 z-10">
            <div className="flex justify-between items-center mb-3">
              <div className="text-lg font-bold">Question {currentQuestion + 1} / {assessment.totalQuestions}</div>
              <div className={`text-3xl font-bold ${timeRemaining < 300 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
                {formatTime(timeRemaining)}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-blue-600 h-4 rounded-full transition-all duration-300" style={{width: `${progress}%`}}></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-10 mb-6">
            <div className="mb-6 flex items-center gap-3">
              {isCodingQuestion && <Code className="w-6 h-6 text-purple-600" />}
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                isCodingQuestion 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {q.skillCategory || 'General'} {isCodingQuestion && '• Coding Challenge'}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold mb-8 leading-relaxed whitespace-pre-wrap">{q.questionText || 'Loading question...'}</h2>
            
            {isCodingQuestion ? (
              <div className="space-y-4">
                <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Write your solution:</p>
                  <textarea
                    value={codeAnswer}
                    onChange={e => setCodeAnswer(e.target.value)}
                    placeholder="// Write your code here..."
                    className="w-full h-64 p-4 font-mono text-sm bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                    disabled={!!answers[currentQuestion]}
                  />
                </div>
                
                {q.testCases && q.testCases.length > 0 && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <p className="font-bold text-blue-900 mb-2">Test Cases:</p>
                    {q.testCases.map((tc, i) => (
                      <div key={i} className="text-sm text-blue-800 mb-1">
                        <span className="font-mono">Input: {tc.input}</span>
                        <span className="mx-2">→</span>
                        <span className="font-mono">Expected: {tc.expected}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <button
                  onClick={handleCodeSubmit}
                  disabled={!codeAnswer.trim() || !!answers[currentQuestion]}
                  className="w-full py-4 bg-purple-600 text-white text-lg font-bold rounded-xl hover:bg-purple-700 disabled:bg-gray-400 transition"
                >
                  {answers[currentQuestion] ? 'Code Submitted ✓' : 'Submit Code'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {(q.options || []).map((opt, i) => (
                  <button key={i} onClick={() => handleAnswerSelect(opt)} disabled={!!answers[currentQuestion]}
                    className={`w-full p-6 text-left text-lg border-2 rounded-xl transition-all ${
                      answers[currentQuestion] === opt 
                        ? 'border-blue-600 bg-blue-50 shadow-md' 
                        : 'border-gray-300 hover:border-blue-400 hover:shadow'
                    }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestion] === opt ? 'border-blue-600 bg-blue-600' : 'border-gray-400'
                      }`}>
                        {answers[currentQuestion] === opt && <CheckCircle className="w-5 h-5 text-white" />}
                      </div>
                      <span>{opt}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 flex justify-between sticky bottom-0">
            <button onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0}
              className="px-8 py-4 bg-gray-300 rounded-xl font-medium disabled:opacity-50 hover:bg-gray-400 transition">
              ← Previous
            </button>
            {currentQuestion === assessment.totalQuestions - 1 ? (
              <button onClick={submitAssessment} disabled={loading}
                className="px-12 py-4 bg-green-600 text-white text-xl font-bold rounded-xl hover:bg-green-700 transition shadow-lg">
                {loading ? 'Submitting...' : 'Submit Assessment'}
              </button>
            ) : (
              <button onClick={() => setCurrentQuestion(currentQuestion + 1)} disabled={!answers[currentQuestion]}
                className="px-12 py-4 bg-blue-600 text-white text-xl font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition shadow-lg">
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // RESULTS SCREEN
  if (status === 'completed' && results) {
    const tier = results.score?.tier || results.tier;
    const skillGaps = results.skillGaps || [];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-8 text-gray-900">Assessment Complete!</h1>
            <div className="inline-block">
              <div className="text-7xl font-bold text-[#685EFC] mb-4">{results.score?.percentage}%</div>
              <div className={`inline-block px-8 py-4 rounded-full text-4xl font-bold ${
                tier === 'Tier 1' ? 'bg-green-100 text-[#12895E]' : 
                tier === 'Tier 2' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {tier}
              </div>
            </div>
          </div>

          {tier === 'Tier 1' && (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-10 mb-12 text-center">
              <Award className="w-20 h-20 mx-auto mb-6 text-[#12895E]" />
              <h2 className="text-4xl font-bold text-green-900 mb-4">Congratulations!</h2>
              <p className="text-2xl text-[#12895E]">You've been added to our talent pool. We'll be in touch soon!</p>
            </div>
          )}

          {skillGaps.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-10 mb-12">
              <div className="flex items-center gap-4 mb-8">
                <BarChart3 className="w-10 h-10 text-[#685EFC]" />
                <h2 className="text-3xl font-bold">Detailed Skill Analysis</h2>
              </div>
              
              <div className="grid gap-8">
                {skillGaps.map((gap, idx) => (
                  <div key={idx} className="border-2 rounded-xl p-6 hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-[#685EFC]" />
                        <h3 className="text-2xl font-bold">{gap.skill || 'Unknown Skill'}</h3>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getProficiencyColor(gap.proficiencyLevel)}`}>
                        {gap.proficiencyLevel || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Questions</p>
                        <p className="text-3xl font-bold text-gray-900">{gap.questionsAttempted ?? 0}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Correct</p>
                        <p className="text-3xl font-bold text-[#12895E]">{gap.questionsCorrect ?? 0}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Your Score</p>
                        <p className="text-3xl font-bold text-[#685EFC]">{gap.percentageScore ?? 0}%</p>
                      </div>
                    </div>

                    <div className="relative w-full bg-gray-200 rounded-full h-4 mb-6">
                      <div 
                        className={`absolute top-0 left-0 h-4 rounded-full transition-all ${
                          (gap.percentageScore ?? 0) >= 75 ? 'bg-[#12895E]' :
                          (gap.percentageScore ?? 0) >= 60 ? 'bg-yellow-600' :
                          (gap.percentageScore ?? 0) >= 40 ? 'bg-orange-600' : 'bg-red-600'
                        }`}
                        style={{width: `${gap.percentageScore ?? 0}%`}}
                      ></div>
                    </div>

                    {gap.specificGaps && gap.specificGaps.length > 0 && (
                      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <p className="font-bold text-red-900">Specific Gaps Identified:</p>
                        </div>
                        <ul className="space-y-2">
                          {gap.specificGaps.map((specificGap, i) => (
                            <li key={i} className="flex items-start gap-2 text-red-800">
                              <Bug className="w-4 h-4 mt-1 flex-shrink-0" />
                              <span className="text-sm font-medium">{specificGap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {gap.missedQuestions && gap.missedQuestions.length > 0 && (
                      <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                        <p className="font-bold text-orange-900 mb-3">Questions You Missed:</p>
                        <div className="space-y-3">
                          {gap.missedQuestions.slice(0, 3).map((mq, i) => (
                            <div key={i} className="text-sm border-l-4 border-orange-400 pl-3">
                              <p className="text-orange-900 font-medium mb-1">{mq.questionText}</p>
                              <p className="text-orange-700">
                                <span className="font-semibold">Gap: </span>{mq.specificGap}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tier === 'Tier 2' && results.developmentTrackAssigned && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-10 text-center">
              <BookOpen className="w-20 h-20 mx-auto mb-6 text-yellow-600" />
              <h2 className="text-4xl font-bold text-yellow-900 mb-4">Development Course Unlocked!</h2>
              <p className="text-xl text-yellow-800 mb-8">
                Based on your specific skill gaps, we've created a personalized hands-on learning path with real coding exercises!
              </p>
              {results.developmentCourseToken && (
                <a 
                  href={`/course/${results.developmentCourseToken}`}
                  className="inline-flex items-center gap-3 px-12 py-6 bg-yellow-600 text-white text-2xl font-bold rounded-xl hover:bg-yellow-700 transition shadow-lg"
                >
                  Start Your Learning Journey
                  <ArrowRight className="w-8 h-8" />
                </a>
              )}
            </div>
          )}

          {tier === 'Tier 3' && (
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-bold text-red-900 mb-4">Keep Building Your Skills!</h2>
              <p className="text-xl text-red-800 mb-6">
                This assessment identified specific areas for improvement. Focus on the gaps highlighted above.
              </p>
              <p className="text-lg text-red-700">
                Review the specific concepts you missed and practice with hands-on projects. You can retake the assessment once you've improved!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default TalentAssessmentInterface;