'use client';
import React, { useState } from 'react';
import { AlertCircle, CheckCircle, BookOpen, TrendingUp, User, FileText } from 'lucide-react';

const TalentVettingSystem = () => {
  const [activeTab, setActiveTab] = useState('assessment');
  const [talentData, setTalentData] = useState({
    name: '',
    role: 'frontend',
    experience: '',
    technicalAnswers: {
      q1: '',
      q2: '',
      q3: ''
    }
  });
  const [vettingResult, setVettingResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const assessmentQuestions = {
    frontend: [
      { id: 'q1', question: 'Explain the concept of Virtual DOM in React and how it improves performance.' },
      { id: 'q2', question: 'What is the difference between controlled and uncontrolled components?' },
      { id: 'q3', question: 'How would you optimize a React application that is rendering slowly?' }
    ],
    backend: [
      { id: 'q1', question: 'Explain RESTful API design principles and best practices.' },
      { id: 'q2', question: 'What is database indexing and when should you use it?' },
      { id: 'q3', question: 'How do you handle authentication and authorization in a web application?' }
    ],
    fullstack: [
      { id: 'q1', question: 'Describe the complete flow of a user login from frontend to database.' },
      { id: 'q2', question: 'What are the key differences between SQL and NoSQL databases?' },
      { id: 'q3', question: 'How would you implement real-time features in a web application?' }
    ]
  };

  const handleInputChange = (field, value) => {
    setTalentData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnswerChange = (questionId, value) => {
    setTalentData(prev => ({
      ...prev,
      technicalAnswers: { ...prev.technicalAnswers, [questionId]: value }
    }));
  };

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis with realistic results
      // In production, this would call your backend API which then calls Claude
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      const mockResult = generateMockAnalysis(talentData);
      
      setVettingResult(mockResult);
      setActiveTab('results');
    } catch (error) {
      console.error('Analysis error:', error);
      setVettingResult({
        overallScore: 0,
        skillAssessment: { strengths: [], weaknesses: [] },
        knowledgeGaps: [],
        recommendations: [],
        feedback: 'Error analyzing responses. Please try again.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateMockAnalysis = (data) => {
    // This simulates what the AI would return
    // In production, replace this with actual API call to your backend
    const roleAnalysis = {
      frontend: {
        overallScore: 72,
        categoryScores: {
          technicalAccuracy: 75,
          depthOfUnderstanding: 68,
          problemSolving: 70,
          communication: 76
        },
        skillAssessment: {
          strengths: [
            "Good understanding of React component lifecycle and hooks",
            "Clear explanation of Virtual DOM benefits",
            "Demonstrates awareness of performance optimization techniques"
          ],
          weaknesses: [
            "Limited depth in explaining reconciliation algorithm details",
            "Could expand on real-world optimization scenarios",
            "Missing discussion of React 18+ concurrent features"
          ]
        },
        knowledgeGaps: [
          {
            area: "Advanced React Performance Optimization",
            severity: "high",
            description: "Limited understanding of React.memo, useMemo, and useCallback usage patterns",
            impact: "May create performance bottlenecks in large-scale applications"
          },
          {
            area: "Modern React Features (Concurrent Mode, Suspense)",
            severity: "medium",
            description: "Not familiar with React 18+ features like automatic batching and transitions",
            impact: "Missing out on latest React capabilities for better UX"
          },
          {
            area: "Testing React Components",
            severity: "medium",
            description: "No mention of testing strategies or tools like Jest and React Testing Library",
            impact: "May struggle with maintaining code quality in production"
          }
        ],
        recommendations: [
          {
            course: "React - The Complete Guide 2024 (incl. React Router & Redux)",
            provider: "Udemy",
            url: "https://www.udemy.com/course/react-the-complete-guide/",
            topics: ["Advanced Hooks", "Performance", "Testing", "React 18"],
            reason: "Comprehensive coverage of advanced React patterns and performance optimization",
            priority: "high",
            estimatedHours: 48
          },
          {
            course: "Testing React with Jest and Testing Library",
            provider: "Frontend Masters",
            url: "https://frontendmasters.com/courses/testing-react/",
            topics: ["Jest", "React Testing Library", "Integration Tests"],
            reason: "Addresses the testing knowledge gap with practical examples",
            priority: "high",
            estimatedHours: 5
          },
          {
            course: "React Performance Optimization",
            provider: "freeCodeCamp",
            url: "https://www.youtube.com/watch?v=KJP1E-Y-xyo",
            topics: ["Memoization", "Code Splitting", "Lazy Loading"],
            reason: "Free resource focused specifically on performance patterns",
            priority: "medium",
            estimatedHours: 3
          }
        ],
        feedback: "You've demonstrated a solid foundation in React fundamentals, with clear explanations of core concepts like the Virtual DOM and component patterns. Your understanding of why these features exist shows good conceptual thinking. However, to advance to the next level, focus on deepening your knowledge of performance optimization techniques—specifically when and how to use React.memo, useMemo, and useCallback effectively. Additionally, exploring React 18's concurrent features and building a strong testing practice will significantly enhance your capabilities as a frontend developer. Your communication skills are strong, which is a valuable asset. Keep building on this foundation with hands-on projects that challenge you to implement these advanced patterns."
      },
      backend: {
        overallScore: 68,
        categoryScores: {
          technicalAccuracy: 70,
          depthOfUnderstanding: 65,
          problemSolving: 68,
          communication: 71
        },
        skillAssessment: {
          strengths: [
            "Good grasp of RESTful API design principles",
            "Understanding of basic authentication concepts",
            "Clear articulation of database concepts"
          ],
          weaknesses: [
            "Limited knowledge of advanced database optimization",
            "Could expand on security best practices",
            "Missing discussion of scalability patterns"
          ]
        },
        knowledgeGaps: [
          {
            area: "Database Query Optimization",
            severity: "high",
            description: "Limited understanding of indexing strategies and query performance tuning",
            impact: "May create slow APIs as data grows"
          },
          {
            area: "API Security Best Practices",
            severity: "high",
            description: "Basic understanding of auth but missing OAuth, JWT best practices, and common vulnerabilities",
            impact: "Security vulnerabilities in production systems"
          },
          {
            area: "Microservices Architecture",
            severity: "medium",
            description: "No exposure to distributed systems and service-to-service communication",
            impact: "Limited ability to work on scalable backend systems"
          }
        ],
        recommendations: [
          {
            course: "SQL Performance Explained",
            provider: "Use The Index, Luke",
            url: "https://use-the-index-luke.com/",
            topics: ["Indexing", "Query Optimization", "Performance"],
            reason: "Essential free resource for database performance",
            priority: "high",
            estimatedHours: 10
          },
          {
            course: "Web Security Academy",
            provider: "PortSwigger",
            url: "https://portswigger.net/web-security",
            topics: ["SQL Injection", "XSS", "Authentication", "Authorization"],
            reason: "Comprehensive security training with hands-on labs",
            priority: "high",
            estimatedHours: 20
          },
          {
            course: "Microservices with Node.js and React",
            provider: "Udemy",
            url: "https://www.udemy.com/course/microservices-with-node-js-and-react/",
            topics: ["Microservices", "Docker", "Kubernetes"],
            reason: "Practical introduction to microservices architecture",
            priority: "medium",
            estimatedHours: 54
          }
        ],
        feedback: "You have a good understanding of backend development fundamentals, particularly in API design and basic database concepts. Your explanations show logical thinking and awareness of core principles. To grow as a backend developer, prioritize learning database optimization techniques—understanding when and how to use indexes effectively will dramatically improve your API performance. Security should be your other key focus area: dive deep into authentication best practices, learn about common vulnerabilities (OWASP Top 10), and understand how to implement secure authentication flows. As you progress, exploring microservices and distributed systems will open up opportunities to work on larger-scale applications. Your communication is clear, which will serve you well when collaborating with teams."
      },
      fullstack: {
        overallScore: 70,
        categoryScores: {
          technicalAccuracy: 72,
          depthOfUnderstanding: 67,
          problemSolving: 71,
          communication: 73
        },
        skillAssessment: {
          strengths: [
            "Broad understanding across frontend and backend",
            "Good grasp of the request-response cycle",
            "Awareness of different database types"
          ],
          weaknesses: [
            "Could go deeper on specialized topics",
            "Limited real-time feature implementation experience",
            "Missing discussion of deployment and DevOps"
          ]
        },
        knowledgeGaps: [
          {
            area: "Real-Time Communication (WebSockets)",
            severity: "high",
            description: "Limited understanding of WebSocket implementation and alternatives",
            impact: "Cannot build modern real-time features"
          },
          {
            area: "DevOps & Deployment",
            severity: "medium",
            description: "Missing knowledge of CI/CD, containerization, and cloud deployment",
            impact: "Difficulty shipping and maintaining applications"
          },
          {
            area: "State Management at Scale",
            severity: "medium",
            description: "Basic understanding but lacks experience with complex state scenarios",
            impact: "May struggle with large application architecture"
          }
        ],
        recommendations: [
          {
            course: "Full Stack Open 2024",
            provider: "University of Helsinki",
            url: "https://fullstackopen.com/",
            topics: ["React", "Node.js", "Testing", "GraphQL", "TypeScript"],
            reason: "Comprehensive free full-stack course with modern technologies",
            priority: "high",
            estimatedHours: 150
          },
          {
            course: "WebSockets Crash Course",
            provider: "YouTube - Traversy Media",
            url: "https://www.youtube.com/watch?v=jD7FnbI76Hg",
            topics: ["WebSockets", "Socket.io", "Real-time"],
            reason: "Quick introduction to real-time communication",
            priority: "high",
            estimatedHours: 1
          },
          {
            course: "Docker and Kubernetes: The Complete Guide",
            provider: "Udemy",
            url: "https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/",
            topics: ["Docker", "Kubernetes", "CI/CD"],
            reason: "Essential DevOps skills for modern full-stack development",
            priority: "medium",
            estimatedHours: 22
          }
        ],
        feedback: "As a full-stack developer, you've shown a well-rounded understanding of both frontend and backend concepts, which is excellent. Your ability to explain the complete flow of data through a system demonstrates good architectural thinking. To take your skills to the next level, focus on mastering real-time communication patterns—WebSockets and alternatives like Server-Sent Events will enable you to build modern, interactive applications. Additionally, gaining DevOps knowledge (Docker, CI/CD pipelines, cloud deployment) will make you much more effective at shipping and maintaining applications. Consider specializing slightly in one area while maintaining breadth; this will help you stand out. Your communication skills are strong, and your curiosity about different technologies is a great asset. Keep building full-stack projects that challenge you to integrate frontend, backend, and infrastructure concerns."
      }
    };

    return roleAnalysis[data.role] || roleAnalysis.fullstack;
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || colors.medium;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <User className="w-8 h-8" />
              JuniorForge Talent Vetting System
            </h1>
            <p className="mt-2 text-indigo-100">AI-Powered Technical Assessment & Learning Path Generator</p>
            <div className="mt-3 bg-indigo-500 bg-opacity-50 rounded p-2 text-sm">
              <strong>Demo Mode:</strong> Currently using simulated AI analysis. To enable real AI analysis, 
              create a backend API endpoint that calls Claude API (see code examples artifact).
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('assessment')}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === 'assessment'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Assessment
            </button>
            <button
              onClick={() => setActiveTab('results')}
              disabled={!vettingResult}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === 'results'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              Results & Recommendations
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'assessment' && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Candidate Name
                    </label>
                    <input
                      type="text"
                      value={talentData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={talentData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="frontend">Frontend Developer</option>
                      <option value="backend">Backend Developer</option>
                      <option value="fullstack">Full Stack Developer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level
                    </label>
                    <select
                      value={talentData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select level</option>
                      <option value="beginner">Beginner (0-1 years)</option>
                      <option value="junior">Junior (1-2 years)</option>
                      <option value="intermediate">Intermediate (2-3 years)</option>
                    </select>
                  </div>
                </div>

                {/* Technical Questions */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Technical Assessment Questions
                  </h2>
                  {assessmentQuestions[talentData.role].map((q, idx) => (
                    <div key={q.id} className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question {idx + 1}: {q.question}
                      </label>
                      <textarea
                        value={talentData.technicalAnswers[q.id]}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter your answer..."
                      />
                    </div>
                  ))}
                </div>

                {/* Analyze Button */}
                <button
                  onClick={analyzeWithAI}
                  disabled={!talentData.name || !talentData.experience || isAnalyzing}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5" />
                      Analyze & Generate Report
                    </>
                  )}
                </button>
              </div>
            )}

            {activeTab === 'results' && vettingResult && (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-6 rounded-lg">
                  <h2 className="text-2xl font-bold mb-2">Overall Assessment Score</h2>
                  <div className="flex items-center gap-4">
                    <div className="text-5xl font-bold">{vettingResult.overallScore}</div>
                    <div className="text-xl">/100</div>
                  </div>
                </div>

                {/* Skill Assessment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {vettingResult.skillAssessment.strengths.map((strength, idx) => (
                        <li key={idx} className="text-green-700 text-sm">• {strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {vettingResult.skillAssessment.weaknesses.map((weakness, idx) => (
                        <li key={idx} className="text-amber-700 text-sm">• {weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Knowledge Gaps */}
                <div className="bg-white border border-gray-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4 text-lg">Identified Knowledge Gaps</h3>
                  <div className="space-y-3">
                    {vettingResult.knowledgeGaps.map((gap, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(gap.severity)}`}>
                          {gap.severity}
                        </span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{gap.area}</div>
                          <div className="text-sm text-gray-600 mt-1">{gap.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Recommendations */}
                <div className="bg-white border border-gray-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Recommended Learning Path
                  </h3>
                  <div className="space-y-4">
                    {vettingResult.recommendations.map((rec, idx) => (
                      <div key={idx} className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-800">{rec.course}</h4>
                            <p className="text-sm text-gray-600">{rec.provider}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadge(rec.priority)}`}>
                            {rec.priority} priority
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{rec.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Feedback */}
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3 text-lg">Detailed Feedback</h3>
                  <p className="text-gray-700 leading-relaxed">{vettingResult.feedback}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentVettingSystem;