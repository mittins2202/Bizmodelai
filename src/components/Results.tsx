import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Clock,
  DollarSign,
  Star,
  Award,
  Target,
  Lightbulb,
  Users,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Zap,
  Brain,
  Heart,
  BarChart3,
  FileText,
  Download,
  Share2,
  Bookmark,
} from "lucide-react";
import { QuizData, BusinessPath } from "../types";
import { generatePersonalizedPaths } from "../utils/quizLogic";
import { AIService } from "../utils/aiService";
import BusinessCardGrid from "./BusinessCardGrid";
import { PaywallModal } from "./PaywallModals";
import { usePaywall } from "../contexts/PaywallContext";

interface ResultsProps {
  quizData: QuizData;
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

interface TraitData {
  label: string;
  value: number;
  description: string;
  color: string;
}

const Results: React.FC<ResultsProps> = ({ quizData, onBack, userEmail }) => {
  const navigate = useNavigate();
  const { hasCompletedQuiz, canAccessBusinessModel, setHasUnlockedAnalysis } = usePaywall();
  const [personalizedPaths, setPersonalizedPaths] = useState<BusinessPath[]>([]);
  const [insights, setInsights] = useState<PersonalizedInsights | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(true);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [paywallType, setPaywallType] = useState<"quiz-required" | "learn-more">("quiz-required");
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");

  useEffect(() => {
    if (quizData) {
      const paths = generatePersonalizedPaths(quizData);
      setPersonalizedPaths(paths);
      generateInsights(quizData, paths);
    }
  }, [quizData]);

  const generateInsights = async (data: QuizData, paths: BusinessPath[]) => {
    try {
      setIsGeneratingInsights(true);
      const aiService = AIService.getInstance();
      const topPaths = paths.slice(0, 3);
      const generatedInsights = await aiService.generatePersonalizedInsights(data, topPaths);
      setInsights(generatedInsights);
    } catch (error) {
      console.error("Error generating insights:", error);
      setInsights(generateFallbackInsights(data, paths));
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const generateFallbackInsights = (data: QuizData, paths: BusinessPath[]): PersonalizedInsights => {
    return {
      personalizedSummary: `Based on your comprehensive assessment, you show strong entrepreneurial potential with a ${paths[0]?.fitScore || 85}% match to ${paths[0]?.name || 'your top business model'}. Your unique combination of skills, motivation, and goals creates excellent opportunities for success.`,
      customRecommendations: [
        "Start with your highest-scoring business model to maximize early success",
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
    };
  };

  const handleLearnMore = (businessId: string) => {
    if (!hasCompletedQuiz) {
      setPaywallType("quiz-required");
      setShowPaywallModal(true);
      return;
    }

    if (canAccessBusinessModel(businessId)) {
      navigate(`/business/${businessId}`);
    } else {
      setSelectedBusinessId(businessId);
      setPaywallType("learn-more");
      setShowPaywallModal(true);
    }
  };

  const handleGetStarted = (businessId: string) => {
    if (!hasCompletedQuiz) {
      setPaywallType("quiz-required");
      setShowPaywallModal(true);
      return;
    }

    if (canAccessBusinessModel(businessId)) {
      navigate(`/business/${businessId}#get-started`);
    } else {
      setSelectedBusinessId(businessId);
      setPaywallType("learn-more");
      setShowPaywallModal(true);
    }
  };

  const handleViewFullReport = (businessId: string) => {
    if (!hasCompletedQuiz) {
      setPaywallType("quiz-required");
      setShowPaywallModal(true);
      return;
    }

    if (canAccessBusinessModel(businessId)) {
      navigate(`/business/${businessId}`);
    } else {
      setSelectedBusinessId(businessId);
      setPaywallType("learn-more");
      setShowPaywallModal(true);
    }
  };

  const handlePaywallUnlock = () => {
    if (paywallType === "quiz-required") {
      navigate("/quiz");
    } else if (paywallType === "learn-more") {
      setHasUnlockedAnalysis(true);
      setShowPaywallModal(false);
      navigate(`/business/${selectedBusinessId}`);
    }
  };

  const handlePaywallClose = () => {
    setShowPaywallModal(false);
    setSelectedBusinessId("");
  };

  // Generate trait data from quiz responses
  const generateTraitData = (data: QuizData): TraitData[] => {
    return [
      {
        label: "Risk Tolerance",
        value: (data.riskComfortLevel || 3) * 20,
        description: data.riskComfortLevel >= 4 ? "High risk tolerance - comfortable with uncertainty" : 
                    data.riskComfortLevel >= 3 ? "Moderate risk tolerance - balanced approach" : 
                    "Conservative approach - prefers stability",
        color: "from-red-500 to-orange-500"
      },
      {
        label: "Tech Comfort",
        value: (data.techSkillsRating || 3) * 20,
        description: data.techSkillsRating >= 4 ? "Tech-savvy - quick to adopt new tools" : 
                    data.techSkillsRating >= 3 ? "Comfortable with technology" : 
                    "Prefers simple, proven tools",
        color: "from-blue-500 to-purple-500"
      },
      {
        label: "Self Motivation",
        value: (data.selfMotivationLevel || 3) * 20,
        description: data.selfMotivationLevel >= 4 ? "Highly self-motivated - drives own success" : 
                    data.selfMotivationLevel >= 3 ? "Good self-motivation with some structure" : 
                    "Benefits from external accountability",
        color: "from-green-500 to-emerald-500"
      },
      {
        label: "Communication",
        value: (data.directCommunicationEnjoyment || 3) * 20,
        description: data.directCommunicationEnjoyment >= 4 ? "Excellent communicator - enjoys interaction" : 
                    data.directCommunicationEnjoyment >= 3 ? "Good communication skills" : 
                    "Prefers written or minimal communication",
        color: "from-purple-500 to-pink-500"
      },
      {
        label: "Creativity",
        value: (data.creativeWorkEnjoyment || 3) * 20,
        description: data.creativeWorkEnjoyment >= 4 ? "Highly creative - thrives on innovation" : 
                    data.creativeWorkEnjoyment >= 3 ? "Enjoys creative challenges" : 
                    "Prefers structured, systematic work",
        color: "from-yellow-500 to-orange-500"
      }
    ];
  };

  const traitData = generateTraitData(quizData);
  const topThreePaths = personalizedPaths.slice(0, 3);

  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Quiz Data Found</h1>
          <p className="text-gray-600 mb-6">Please take the quiz first to see your results.</p>
          <button
            onClick={() => navigate("/quiz")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Take Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
              <Award className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Your Business Blueprint
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                Personalized recommendations based on your unique profile
              </p>
            </div>
          </div>

          {userEmail && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-green-800 text-sm">
                ✅ Results saved to {userEmail}
              </p>
            </div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {topThreePaths[0]?.fitScore || 0}%
            </div>
            <div className="text-gray-600 text-sm">Best Match</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {topThreePaths[0]?.potentialIncome || "N/A"}
            </div>
            <div className="text-gray-600 text-sm">Income Potential</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {topThreePaths[0]?.timeToProfit || "N/A"}
            </div>
            <div className="text-gray-600 text-sm">Time to Profit</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {topThreePaths[0]?.startupCost || "N/A"}
            </div>
            <div className="text-gray-600 text-sm">Startup Cost</div>
          </div>
        </motion.div>

        {/* Personalized Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Brain className="h-6 w-6 mr-3 text-blue-600" />
            Your Personalized Analysis
          </h2>
          
          {isGeneratingInsights ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : (
            <div className="prose prose-lg text-gray-700">
              <p>{insights?.personalizedSummary}</p>
            </div>
          )}
        </motion.div>

        {/* Trait Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <BarChart3 className="h-6 w-6 mr-3 text-purple-600" />
            Your Entrepreneurial Profile
          </h2>
          
          <div className="space-y-6">
            {traitData.map((trait, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">{trait.label}</span>
                  <span className="text-sm text-gray-600">{trait.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className={`h-3 rounded-full bg-gradient-to-r ${trait.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${trait.value}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>
                <p className="text-sm text-gray-600">{trait.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Business Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Your Top Business Matches
          </h2>
          
          <BusinessCardGrid
            businesses={topThreePaths.map(path => ({
              id: path.id,
              name: path.name,
              description: path.description,
              fitScore: path.fitScore,
              difficulty: path.difficulty,
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
        </motion.div>

        {/* Insights Grid */}
        {insights && !isGeneratingInsights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid md:grid-cols-2 gap-8 mb-12"
          >
            {/* Success Strategies */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
                Success Strategies
              </h3>
              <ul className="space-y-3">
                {insights.successStrategies.slice(0, 4).map((strategy, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Potential Challenges */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-3 text-orange-600" />
                Potential Challenges
              </h3>
              <ul className="space-y-3">
                {insights.potentialChallenges.map((challenge, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Action Plan */}
        {insights && !isGeneratingInsights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-lg mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Lightbulb className="h-6 w-6 mr-3 text-yellow-600" />
              Your Personalized Action Plan
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Week 1", tasks: insights.personalizedActionPlan.week1, color: "blue" },
                { title: "Month 1", tasks: insights.personalizedActionPlan.month1, color: "green" },
                { title: "Month 3", tasks: insights.personalizedActionPlan.month3, color: "purple" },
                { title: "Month 6", tasks: insights.personalizedActionPlan.month6, color: "orange" }
              ].map((phase, index) => (
                <div key={index} className="space-y-4">
                  <h3 className={`text-lg font-bold text-${phase.color}-600`}>{phase.title}</h3>
                  <ul className="space-y-2">
                    {phase.tasks.slice(0, 3).map((task, taskIndex) => (
                      <li key={taskIndex} className="text-sm text-gray-700 flex items-start">
                        <div className={`w-1.5 h-1.5 bg-${phase.color}-500 rounded-full mt-2 mr-2 flex-shrink-0`}></div>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Motivational Message */}
        {insights && !isGeneratingInsights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-12"
          >
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl font-bold mb-4">You've Got This!</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              {insights.motivationalMessage}
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => navigate("/quiz")}
            className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowRight className="h-5 w-5 mr-2" />
            Retake Quiz
          </button>
          
          <button
            onClick={() => navigate("/explore")}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Users className="h-5 w-5 mr-2" />
            Explore All Business Models
          </button>
        </motion.div>
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywallModal}
        onClose={handlePaywallClose}
        onUnlock={handlePaywallUnlock}
        type={paywallType}
        title={selectedBusinessId ? personalizedPaths.find(p => p.id === selectedBusinessId)?.name : undefined}
      />
    </div>
  );
};

export default Results;