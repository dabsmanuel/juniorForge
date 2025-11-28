'use client'
import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Clock, Trophy, Award, ChevronRight, BarChart3, Target } from 'lucide-react';
import Image from 'next/image';

const BACKEND_URL =  'https://juniorforge.onrender.com/api/vetting' || 'http://localhost:5000/api/vetting' ;

const DevelopmentCourseInterface = () => {
  const [courseToken, setCourseToken] = useState('');
  const [course, setCourse] = useState(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [status, setStatus] = useState('login');
  const [loading, setLoading] = useState(false);
  const [studyStartTime, setStudyStartTime] = useState(null);

  // Extract token from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl) {
      setCourseToken(tokenFromUrl);
      loadCourseWithToken(tokenFromUrl);
    }
  }, []);

  const loadCourseWithToken = async (token) => {
    if (!token.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/course/by-token/${token}`);
      const data = await res.json();
      if (data.success) {
        setCourse(data.data);
        setStatus('course');
        // Resume from last incomplete module
        const lastModule = data.data.modules.findIndex(m => m.progress?.percentageComplete < 100);
        if (lastModule !== -1) {
          setCurrentModule(lastModule);
          // Find first incomplete lesson in that module
          const firstIncomplete = data.data.modules[lastModule].lessons.findIndex(l => !l.completed);
          if (firstIncomplete !== -1) setCurrentLesson(firstIncomplete);
        }
      } else {
        alert(data.message || 'Invalid course token');
      }
    } catch (err) {
      alert('Cannot reach server. Is backend running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  const loadCourse = () => loadCourseWithToken(courseToken);

  const startLesson = () => {
    setStudyStartTime(Date.now());
  };

  const completeLesson = async (quizScore = null) => {
    const durationMinutes = studyStartTime ? Math.round((Date.now() - studyStartTime) / 60000) : 5;
    
    try {
      const module = course.modules[currentModule];
      const lesson = module.lessons[currentLesson];
      
      const res = await fetch(
        `${BACKEND_URL}/course/${course._id}/modules/${module._id}/lessons/${lesson._id}/complete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quizScore })
        }
      );
      
      const data = await res.json();
      if (data.success) {
        await loadCourseWithToken(courseToken);
        
        if (data.courseComplete) {
          setStatus('completed');
        } else {
          if (currentLesson < module.lessons.length - 1) {
            setCurrentLesson(currentLesson + 1);
          } else if (currentModule < course.modules.length - 1) {
            setCurrentModule(currentModule + 1);
            setCurrentLesson(0);
          }
        }
        
        setShowQuiz(false);
        setQuizAnswers({});
        setStudyStartTime(null);
      }
    } catch (err) {
      console.error('Error completing lesson:', err);
    }
  };

  const submitQuiz = () => {
    const module = course.modules[currentModule];
    const lesson = module.lessons[currentLesson];
    const quiz = lesson.quiz;
    
    let correct = 0;
    quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) correct++;
    });
    
    const score = Math.round((correct / quiz.length) * 100);
    completeLesson(score);
  };

  const triggerReassessment = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/course/${course._id}/trigger-reassessment`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Reassessment Created!\n\nYour Access Token:\n${data.data.accessToken}\n\nUse this token in the assessment portal to take your reassessment.`);
      }
    } catch (err) {
      alert('Error creating reassessment');
    } finally {
      setLoading(false);
    }
  };

  // LOGIN SCREEN
  if (status === 'login') return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <Image 
          src="/images/greenlogo.png"
          alt="JuniorForge Logo"
          width={96}
          height={96}
          className="mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold mb-4">Development Course</h1>
        <p className="text-gray-600 mb-8">Enter your course access token to continue your learning journey</p>
        <input
          value={courseToken}
          onChange={e => setCourseToken(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && loadCourse()}
          placeholder="Enter course token"
          className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl text-lg focus:border-purple-500 outline-none mb-6"
        />
        <button onClick={loadCourse} disabled={loading || !courseToken.trim()}
          className="w-full py-4 bg-purple-600 text-white text-xl font-bold rounded-xl hover:bg-purple-700 disabled:bg-gray-400 transition">
          {loading ? 'Loading...' : 'Access Course'}
        </button>
      </div>
    </div>
  );

  // COURSE COMPLETE - REASSESSMENT READY
  if (status === 'completed' || (course?.reassessmentEligible && !course?.reassessmentTriggered)) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-8">
      <div className="max-w-3xl mx-auto text-center">
        <Trophy className="w-32 h-32 mx-auto mb-8 text-yellow-500 animate-bounce" />
        <h1 className="text-6xl font-bold mb-6">Congratulations! 🎉</h1>
        <p className="text-2xl mb-4">You've completed all {course.progress.totalLessons} lessons</p>
        <p className="text-xl text-gray-600 mb-12">across {course.progress.totalModules} modules</p>
        
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-8">
          <div className="mb-8">
            <div className="text-6xl font-bold text-purple-600 mb-2">{course.progress.percentageComplete}%</div>
            <p className="text-gray-600">Course Completion</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-purple-50 rounded-xl p-6">
              <Clock className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-3xl font-bold text-purple-900">{course.totalStudyMinutes}</div>
              <div className="text-sm text-gray-600">Minutes Studied</div>
            </div>
            <div className="bg-green-50 rounded-xl p-6">
              <Award className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-3xl font-bold text-green-900">{course.progress.completedLessons}</div>
              <div className="text-sm text-gray-600">Lessons Completed</div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4">Ready for Reassessment?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Take the reassessment to demonstrate your progress and potentially qualify for Tier 1!
          </p>
          <button 
            onClick={triggerReassessment}
            disabled={loading || course?.reassessmentTriggered}
            className="px-12 py-6 bg-green-600 text-white text-2xl font-bold rounded-xl hover:bg-green-700 disabled:bg-gray-400 transition shadow-lg"
          >
            {course?.reassessmentTriggered ? 'Reassessment Token Sent' : 'Generate Reassessment'}
          </button>
        </div>

        {course?.reassessmentTriggered && (
          <div className="bg-blue-50 rounded-xl p-6">
            <p className="text-lg text-blue-800">
              ✅ Your reassessment has been created! Check your email for the access token.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // MAIN COURSE INTERFACE
  if (status === 'course' && course) {
    const module = course.modules[currentModule];
    const lesson = module?.lessons[currentLesson];

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-md sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold">{course.courseTitle}</h1>
                <p className="text-gray-600">{course.talentName}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-purple-600">{course.progress.percentageComplete}%</div>
                <div className="text-sm text-gray-600">{course.progress.completedLessons}/{course.progress.totalLessons} Lessons</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-purple-600 h-3 rounded-full transition-all duration-500" style={{width: `${course.progress.percentageComplete}%`}}></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 grid grid-cols-12 gap-6">
          {/* Sidebar - Module List */}
          <div className="col-span-3 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="bg-white rounded-xl p-4 mb-4 sticky top-0">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <Target className="w-5 h-5" />
                <span className="font-bold">Course Progress</span>
              </div>
              <div className="text-2xl font-bold">{course.progress.completedModules}/{course.progress.totalModules}</div>
              <div className="text-sm text-gray-600">Modules Complete</div>
            </div>

            {course.modules.map((mod, idx) => (
              <div key={mod._id} 
                className={`bg-white rounded-xl p-4 cursor-pointer border-2 transition-all ${
                  idx === currentModule ? 'border-purple-600 shadow-lg' : 'border-transparent hover:border-purple-300'
                }`}
                onClick={() => { setCurrentModule(idx); setCurrentLesson(0); }}
              >
                <div className="flex items-start gap-3">
                  {mod.progress?.percentageComplete === 100 ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex-shrink-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">{idx + 1}</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-1 leading-tight">{mod.title}</h3>
                    <div className="text-xs text-gray-600 mb-2">{mod.progress?.completedLessons || 0}/{mod.lessons.length} lessons</div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{width: `${mod.progress?.percentageComplete || 0}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {!showQuiz ? (
              <div className="bg-white rounded-xl shadow-lg p-10">
                <div className="mb-6">
                  <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-bold">
                    Module {currentModule + 1} • Lesson {currentLesson + 1}
                  </span>
                </div>
                
                <h2 className="text-4xl font-bold mb-4">{lesson.title}</h2>
                <p className="text-xl text-gray-600 mb-8">{lesson.description}</p>
                
                <div className="flex items-center gap-6 mb-8 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{lesson.estimatedMinutes} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span>{lesson.skillsCovered?.join(', ')}</span>
                  </div>
                </div>

                <div className="prose max-w-none mb-8">
                  <div className="text-lg leading-relaxed whitespace-pre-wrap">{lesson.content}</div>
                </div>

                {lesson.resources && lesson.resources.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                      Learning Resources
                    </h3>
                    <div className="space-y-3">
                      {lesson.resources.map((res, idx) => (
                        <a key={idx} href={res.url} target="_blank" rel="noopener noreferrer"
                          className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow border border-blue-200">
                          <div className="font-bold text-blue-600 flex items-center gap-2">
                            {res.title}
                            <ChevronRight className="w-4 h-4" />
                          </div>
                          <div className="text-sm text-gray-600 capitalize">{res.type}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-6 border-t">
                  <button 
                    onClick={() => {
                      if (currentLesson > 0) {
                        setCurrentLesson(currentLesson - 1);
                      } else if (currentModule > 0) {
                        setCurrentModule(currentModule - 1);
                        setCurrentLesson(course.modules[currentModule - 1].lessons.length - 1);
                      }
                    }}
                    disabled={currentModule === 0 && currentLesson === 0}
                    className="px-8 py-4 bg-gray-300 rounded-xl font-medium disabled:opacity-50 hover:bg-gray-400 transition"
                  >
                    ← Previous
                  </button>

                  {lesson.completed ? (
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="text-green-600 font-bold">Completed</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        if (!studyStartTime) startLesson();
                        if (lesson.quiz && lesson.quiz.length > 0) {
                          setShowQuiz(true);
                        } else {
                          completeLesson();
                        }
                      }}
                      className="px-12 py-4 bg-purple-600 text-white text-xl font-bold rounded-xl hover:bg-purple-700 transition shadow-lg"
                    >
                      {lesson.quiz && lesson.quiz.length > 0 ? 'Take Quiz' : 'Complete Lesson'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-10">
                <div className="flex items-center gap-3 mb-8">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                  <h2 className="text-3xl font-bold">Knowledge Check</h2>
                </div>
                <div className="space-y-8">
                  {lesson.quiz.map((q, idx) => (
                    <div key={idx} className="border-b pb-6 last:border-b-0">
                      <h3 className="text-xl font-bold mb-4">Question {idx + 1}: {q.question}</h3>
                      <div className="space-y-3">
                        {q.options.map((opt, optIdx) => (
                          <button key={optIdx}
                            onClick={() => setQuizAnswers({...quizAnswers, [idx]: opt})}
                            className={`w-full p-4 text-left border-2 rounded-xl transition-all ${
                              quizAnswers[idx] === opt 
                                ? 'border-purple-600 bg-purple-50 shadow-md' 
                                : 'border-gray-300 hover:border-purple-400'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                quizAnswers[idx] === opt ? 'border-purple-600 bg-purple-600' : 'border-gray-400'
                              }`}>
                                {quizAnswers[idx] === opt && <CheckCircle className="w-4 h-4 text-white" />}
                              </div>
                              <span>{opt}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <button onClick={() => setShowQuiz(false)}
                    className="px-8 py-4 bg-gray-300 rounded-xl font-medium hover:bg-gray-400 transition">
                    ← Back to Lesson
                  </button>
                  <button 
                    onClick={submitQuiz}
                    disabled={Object.keys(quizAnswers).length < lesson.quiz.length}
                    className="px-12 py-4 bg-green-600 text-white text-xl font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 transition shadow-lg"
                  >
                    Submit Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DevelopmentCourseInterface;