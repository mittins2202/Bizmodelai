import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Star, 
  Brain, 
  Target, 
  Lightbulb,
  ChevronDown
} from 'lucide-react';
import { QuizData, BusinessPath } from '../types';
import { AIService } from '../utils/aiService';
import BusinessCardGrid from './BusinessCardGrid';

interface FullReportProps {
  quizData: QuizData;
  topPaths: BusinessPath[];
  onBack: () => void;
  userEmail?: string | null;
}

interface PersonalizedInsights {
  personalizedSummary: string;
  customRecommendations: string[];
  potentialChallenges: string[];
  successStrategies: string[];
  personalizedActionPlan: {
    week1: string[];
    month1: string[];
    month3: string[];
    month6: string[];
  };
  motivationalMessage: string;
}

const FullReport: React.FC<FullReportProps> = ({ 
  quizData, 
  topPaths, 
  onBack, 
  userEmail 
}) => {
  const [personalizedInsights, setPersonalizedInsights] = useState<PersonalizedInsights | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(true);

  // Scroll to analysis section
  const scrollToAnalysis = () => {
    const analysisSection = document.getElementById('ai-analysis-section');
    if (analysisSection) {
      analysisSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    const generateInsights = async () => {
      try {
        setIsGeneratingInsights(true);
        const aiService = AIService.getInstance();
        const insights = await aiService.generatePersonalizedInsights(quizData, topPaths);
        setPersonalizedInsights(insights);
      } catch (error) {
        console.error('Error generating personalized insights:', error);
        // Set fallback insights
        setPersonalizedInsights({
          personalizedSummary: "Based on your comprehensive assessment, you have excellent potential for entrepreneurial success. Your unique combination of skills, motivation, and strategic thinking creates the perfect foundation for building a thriving business.",
          customRecommendations: [
            "Start with your top-ranked business model to maximize your chances of success",
            "Focus on building one core skill deeply rather than spreading yourself thin",
            "Set realistic 90-day milestones to maintain motivation and track progress",
            "Join online communities in your chosen field for support and networking",
            "Create a dedicated workspace to maintain focus and professionalism",
            "Track your time and energy to optimize your most productive hours"
          ],
          potentialChallenges: [
            "Managing time effectively between learning and doing while building momentum",
            "Overcoming perfectionism that might delay launching and getting feedback",
            "Building confidence to position yourself as an expert in your chosen field",
            "Staying motivated during the initial period when results may be slow"
          ],
          successStrategies: [
            "Leverage your analytical nature by tracking metrics and making data-driven decisions",
            "Use your natural communication skills to build strong customer relationships",
            "Focus on solving real problems for people rather than just making money",
            "Build systems and processes early to create scalable business operations",
            "Invest in continuous learning to stay ahead of market changes",
            "Network strategically with others in your industry for partnerships and opportunities"
          ],
          personalizedActionPlan: {
            week1: [
              "Research your chosen business model and successful case studies",
              "Set up your workspace and basic tools needed to get started",
              "Define your specific target market and ideal customer profile"
            ],
            month1: [
              "Launch your minimum viable product or service offering",
              "Create your first marketing materials and online presence",
              "Reach out to potential customers and gather initial feedback",
              "Establish basic business processes and tracking systems"
            ],
            month3: [
              "Optimize your offering based on customer feedback and results",
              "Scale your marketing efforts and expand your reach",
              "Build strategic partnerships or collaborations",
              "Develop systems for consistent delivery and customer service"
            ],
            month6: [
              "Analyze your business performance and identify growth opportunities",
              "Consider expanding your product or service offerings",
              "Build a team or outsource tasks to focus on high-value activities",
              "Plan your next phase of growth and set new goals"
            ]
          },
          motivationalMessage: "Your unique combination of skills and drive positions you perfectly for entrepreneurial success. Trust in your abilities and take that first step."
        });
      } finally {
        setIsGeneratingInsights(false);
      }
    };

    generateInsights();
  }, [quizData, topPaths]);

  const handleLearnMore = (businessId: string) => {
    // Navigate to business model detail page
    window.location.href = `/business/${businessId}`;
  };

  const handleGetStarted = (businessId: string) => {
    // Navigate to business model detail page with get started hash
    window.location.href = `/business/${businessId}#get-started`;
  };

  const handleViewFullReport = (businessId: string) => {
    // Navigate to business model detail page
    window.location.href = `/business/${businessId}`;
  };

  // Get personality insights based on quiz data
  const getPersonalityInsights = () => {
    const insights = [];
    
    if (quizData.selfMotivationLevel >= 4) {
      insights.push({ trait: "Self-Motivated", score: quizData.selfMotivationLevel, description: "You have strong internal drive" });
    }
    if (quizData.riskComfortLevel >= 4) {
      insights.push({ trait: "Risk-Tolerant", score: quizData.riskComfortLevel, description: "You're comfortable with uncertainty" });
    }
    if (quizData.creativeWorkEnjoyment >= 4) {
      insights.push({ trait: "Creative", score: quizData.creativeWorkEnjoyment, description: "You enjoy creative problem-solving" });
    }
    if (quizData.directCommunicationEnjoyment >= 4) {
      insights.push({ trait: "Communicative", score: quizData.directCommunicationEnjoyment, description: "You excel at interpersonal interaction" });
    }
    if (quizData.techSkillsRating >= 4) {
      insights.push({ trait: "Tech-Savvy", score: quizData.techSkillsRating, description: "You're comfortable with technology" });
    }
    
    return insights.slice(0, 5); // Show top 5 traits
  };

  const personalityInsights = getPersonalityInsights();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Results
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Complete
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Business Blueprint
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              A comprehensive analysis of your entrepreneurial potential, personalized recommendations, 
              and a step-by-step roadmap to build your ideal business.
            </p>
          </div>

          {/* Scroll Arrow Button */}
          <motion.button
            onClick={scrollToAnalysis}
            className="group inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border-2 border-purple-200 hover:border-purple-400"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll to AI-Generated Analysis section"
            title="View your personalized analysis"
          >
            <ChevronDown className="h-8 w-8 text-purple-600 group-hover:text-purple-700 transition-colors animate-bounce" />
          </motion.button>

          {/* User Info */}
          {userEmail && (
            <div className="mt-8 text-sm text-gray-500">
              Report generated for: {userEmail}
            </div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{topPaths[0]?.fitScore}%</div>
            <div className="text-gray-600 text-sm">Best Match Score</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{topPaths.length}</div>
            <div className="text-gray-600 text-sm">Business Matches</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{quizData.weeklyTimeCommitment}</div>
            <div className="text-gray-600 text-sm">Hours/Week Available</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">${quizData.successIncomeGoal?.toLocaleString()}</div>
            <div className="text-gray-600 text-sm">Income Goal</div>
          </div>
        </motion.div>

        {/* Your Top Business Matches */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Top Business Matches
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Based on your comprehensive assessment, these business models are perfectly tailored to your goals, personality, and resources.
            </p>
          </div>

          <BusinessCardGrid
            businesses={topPaths.map(path => ({
              id: path.id,
              name: path.name,
              description: path.description,
              fitScore: path.fitScore,
              difficulty: path.difficulty as 'Easy' | 'Medium' | 'Hard',
              timeToProfit: path.timeToProfit,
              startupCost: path.startupCost,
              potentialIncome: path.potentialIncome,
              pros: path.pros,
              cons: path.cons,
              skills: path.skills,
              icon: path.icon
            }))}
            onLearnMore={handleLearnMore}
            onGetStarted={handleGetStarted}
            onViewFullReport={handleViewFullReport}
          />
        </motion.section>

        {/* AI-Generated Analysis Section */}
        <motion.section
          id="ai-analysis-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Brain className="h-10 w-10 mr-4 text-purple-600" />
              Your AI-Generated Analysis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI has analyzed your responses to provide personalized insights and recommendations.
            </p>
          </div>

          {isGeneratingInsights ? (
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="animate-pulse space-y-6">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          ) : personalizedInsights && (
            <div className="space-y-8">
              {/* Personalized Summary */}
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Entrepreneurial Profile</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {personalizedInsights.personalizedSummary}
                </p>
                
                {/* Personality Traits */}
                {personalityInsights.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Key Strengths</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {personalityInsights.map((insight, index) => (
                        <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">{insight.trait}</span>
                            <span className="text-sm font-bold text-blue-600">{insight.score}/5</span>
                          </div>
                          <p className="text-sm text-gray-600">{insight.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Recommendations */}
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Lightbulb className="h-6 w-6 mr-3 text-yellow-500" />
                  Personalized Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {personalizedInsights.customRecommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Challenges and Strategies */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Potential Challenges */}
                <div className="bg-white rounded-3xl p-8 shadow-xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <AlertTriangle className="h-6 w-6 mr-3 text-orange-500" />
                    Potential Challenges
                  </h3>
                  <ul className="space-y-4">
                    {personalizedInsights.potentialChallenges.map((challenge, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Success Strategies */}
                <div className="bg-white rounded-3xl p-8 shadow-xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <CheckCircle className="h-6 w-6 mr-3 text-green-500" />
                    Success Strategies
                  </h3>
                  <ul className="space-y-4">
                    {personalizedInsights.successStrategies.map((strategy, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Personalized Action Plan */}
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Target className="h-6 w-6 mr-3 text-purple-500" />
                  Your Personalized Action Plan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(personalizedInsights.personalizedActionPlan).map(([timeframe, tasks]) => (
                    <div key={timeframe} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4 capitalize">
                        {timeframe.replace(/(\d+)/, '$1 ')}
                      </h4>
                      <ul className="space-y-2">
                        {tasks.map((task, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Motivational Message */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white text-center">
                <Star className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
                <h3 className="text-2xl font-bold mb-4">You're Ready to Succeed!</h3>
                <p className="text-xl leading-relaxed opacity-90">
                  {personalizedInsights.motivationalMessage}
                </p>
              </div>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default FullReport;