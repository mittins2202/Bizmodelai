import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Brain,
  Target,
  Lightbulb,
  Award,
  CheckCircle,
  AlertTriangle,
  Star,
  Zap,
  BarChart3,
  FileText,
  ArrowRight,
  Lock,
} from "lucide-react";
import { QuizData, BusinessPath } from "../types";
import { generatePersonalizedPaths } from "../utils/quizLogic";
import { AIService } from "../utils/aiService";
import { useNavigate } from "react-router-dom";
import { usePaywall } from "../contexts/PaywallContext";
import { PaywallModal, LockedCardOverlay } from "../components/PaywallModals";

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

const Results: React.FC<ResultsProps> = ({ quizData, onBack, userEmail }) => {
  const [personalizedPaths, setPersonalizedPaths] = useState<BusinessPath[]>(
    [],
  );
  const [personalizedInsights, setPersonalizedInsights] =
    useState<PersonalizedInsights | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(true);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [paywallType, setPaywallType] = useState<
    "business-model" | "learn-more" | "full-report"
  >("business-model");
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");
  const navigate = useNavigate();
  const { hasUnlockedAnalysis, setHasUnlockedAnalysis } = usePaywall();

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
      const insights = await aiService.generatePersonalizedInsights(
        data,
        paths.slice(0, 3),
      );
      setPersonalizedInsights(insights);
    } catch (error) {
      console.error("Error generating insights:", error);
      setPersonalizedInsights(generateFallbackInsights(data, paths));
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const generateFallbackInsights = (
    data: QuizData,
    paths: BusinessPath[],
  ): PersonalizedInsights => {
    return {
      personalizedSummary: `Based on your comprehensive assessment, you're well-suited for entrepreneurial success. Your unique combination of goals, skills, and preferences creates strong alignment with several proven business models.`,
      customRecommendations: [
        "Start with your highest-scoring business model to maximize early success",
        "Focus on building one core skill deeply rather than spreading yourself thin",
        "Set realistic 90-day milestones to maintain motivation and track progress",
        "Join online communities in your chosen field for support and networking",
        "Create a dedicated workspace to maintain focus and professionalism",
        "Track your time and energy to optimize your most productive hours",
      ],
      potentialChallenges: [
        "Managing time effectively between learning and doing while building momentum",
        "Overcoming perfectionism that might delay launching and getting feedback",
        "Building confidence to position yourself as an expert in your chosen field",
        "Staying motivated during the initial period when results may be slow",
      ],
      successStrategies: [
        "Leverage your analytical nature by tracking metrics and making data-driven decisions",
        "Use your natural communication skills to build strong customer relationships",
        "Focus on solving real problems for people rather than just making money",
        "Build systems and processes early to create scalable business operations",
        "Invest in continuous learning to stay ahead of market changes",
        "Network strategically with others in your industry for partnerships and opportunities",
      ],
      personalizedActionPlan: {
        week1: [
          "Research your chosen business model and successful case studies",
          "Set up your workspace and basic tools needed to get started",
          "Define your specific target market and ideal customer profile",
        ],
        month1: [
          "Launch your minimum viable product or service offering",
          "Create your first marketing materials and online presence",
          "Reach out to potential customers and gather initial feedback",
          "Establish basic business processes and tracking systems",
        ],
        month3: [
          "Optimize your offering based on customer feedback and results",
          "Scale your marketing efforts and expand your reach",
          "Build strategic partnerships or collaborations",
          "Develop systems for consistent delivery and customer service",
        ],
        month6: [
          "Analyze your business performance and identify growth opportunities",
          "Consider expanding your product or service offerings",
          "Build a team or outsource tasks to focus on high-value activities",
          "Plan your next phase of growth and set new goals",
        ],
      },
      motivationalMessage:
        "Your unique combination of skills, motivation, and strategic thinking creates the perfect foundation for entrepreneurial success. Trust in your abilities, stay consistent with your efforts, and remember that every successful entrepreneur started exactly where you are now.",
    };
  };

  const handleLearnMore = (businessId: string) => {
    if (hasUnlockedAnalysis) {
      navigate(`/business/${businessId}`);
    } else {
      setSelectedBusinessId(businessId);
      setPaywallType("learn-more");
      setShowPaywallModal(true);
    }
  };

  const handleGetStarted = (businessId: string) => {
    if (hasUnlockedAnalysis) {
      navigate(`/business/${businessId}#get-started`);
    } else {
      setSelectedBusinessId(businessId);
      setPaywallType("business-model");
      setShowPaywallModal(true);
    }
  };

  const handleViewFullReport = (businessId: string) => {
    if (hasUnlockedAnalysis) {
      navigate(`/business/${businessId}`);
    } else {
      setSelectedBusinessId(businessId);
      setPaywallType("full-report");
      setShowPaywallModal(true);
    }
  };

  const handlePaywallUnlock = () => {
    setHasUnlockedAnalysis(true);
    setShowPaywallModal(false);
    if (selectedBusinessId) {
      navigate(`/business/${selectedBusinessId}`);
    }
  };

  const handlePaywallClose = () => {
    setShowPaywallModal(false);
    setSelectedBusinessId("");
  };

  const topPaths = personalizedPaths.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
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
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Your Business Path Results
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

        {/* Personalized Summary */}
        {personalizedInsights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your Personalized Analysis
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            </div>

            <div className="prose prose-lg text-gray-700 max-w-none text-center mb-8">
              <p className="text-xl leading-relaxed">
                {personalizedInsights.personalizedSummary}
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Your Success Message
              </h3>
              <p className="text-gray-700 italic">
                "{personalizedInsights.motivationalMessage}"
              </p>
            </div>
          </motion.div>
        )}

        {/* Top Business Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Top 3 Business Matches
            </h2>
            <p className="text-xl text-gray-600">
              AI-powered recommendations tailored specifically for you
            </p>
          </div>

          <div className="space-y-8">
            {topPaths.map((path, index) => (
              <BusinessCard
                key={path.id}
                business={path}
                index={index}
                onLearnMore={handleLearnMore}
                onGetStarted={handleGetStarted}
                onViewFullReport={handleViewFullReport}
                isLocked={!hasUnlockedAnalysis && index > 0}
                hasUnlockedAnalysis={hasUnlockedAnalysis}
              />
            ))}
          </div>
        </motion.div>

        {/* Action Plan Preview */}
        {personalizedInsights && hasUnlockedAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-3xl shadow-xl p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Your Personalized Action Plan
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Week 1",
                  items: personalizedInsights.personalizedActionPlan.week1,
                  color: "blue",
                },
                {
                  title: "Month 1",
                  items: personalizedInsights.personalizedActionPlan.month1,
                  color: "green",
                },
                {
                  title: "Month 3",
                  items: personalizedInsights.personalizedActionPlan.month3,
                  color: "purple",
                },
                {
                  title: "Month 6",
                  items: personalizedInsights.personalizedActionPlan.month6,
                  color: "orange",
                },
              ].map((phase, index) => (
                <div
                  key={index}
                  className={`bg-${phase.color}-50 rounded-2xl p-6 border border-${phase.color}-200`}
                >
                  <h3
                    className={`text-xl font-bold text-${phase.color}-800 mb-4`}
                  >
                    {phase.title}
                  </h3>
                  <ul className="space-y-2">
                    {phase.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className={`text-sm text-${phase.color}-700 flex items-start`}
                      >
                        <span
                          className={`text-${phase.color}-500 mr-2 flex-shrink-0`}
                        >
                          •
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors mx-auto"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
        </div>
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywallModal}
        onClose={handlePaywallClose}
        onUnlock={handlePaywallUnlock}
        type={paywallType}
        title={
          selectedBusinessId
            ? topPaths.find((p) => p.id === selectedBusinessId)?.name
            : undefined
        }
      />
    </div>
  );
};

// Business Card Component with locked/unlocked states
const BusinessCard: React.FC<{
  business: BusinessPath;
  index: number;
  onLearnMore: (businessId: string) => void;
  onGetStarted: (businessId: string) => void;
  onViewFullReport: (businessId: string) => void;
  isLocked: boolean;
  hasUnlockedAnalysis: boolean;
}> = ({
  business,
  index,
  onLearnMore,
  onGetStarted,
  onViewFullReport,
  isLocked,
  hasUnlockedAnalysis,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSkillsToShow = () => {
    const maxSkillsToShow = 4;
    if (showAllSkills || business.skills.length <= maxSkillsToShow) {
      return business.skills;
    }
    return business.skills.slice(0, maxSkillsToShow);
  };

  const remainingSkillsCount = Math.max(0, business.skills.length - 4);

  const handleSkillsToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAllSkills(!showAllSkills);
  };

  const handleUnlock = () => {
    onViewFullReport(business.id);
  };

  // Determine card width based on locked state
  const cardWidth = isLocked ? "max-w-md" : "max-w-4xl";
  const cardLayout = isLocked ? "flex-col" : "flex-col lg:flex-row";

  return (
    <motion.div
      className={`relative bg-white rounded-3xl shadow-xl transition-all duration-500 hover:shadow-2xl border-2 group ${cardWidth} mx-auto ${
        index === 0
          ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50"
          : "border-gray-200 hover:border-blue-300"
      }`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isExpanded ? 1.02 : 1,
      }}
      transition={{
        duration: 0.5,
        layout: { duration: 0.4, ease: "easeInOut" },
      }}
      whileHover={{ y: -5 }}
    >
      {/* Top Badge for Best Match */}
      {index === 0 && (
        <motion.div
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
            <Star className="h-4 w-4 mr-2" />
            AI RECOMMENDED
          </div>
        </motion.div>
      )}

      {/* Locked Overlay */}
      {isLocked && <LockedCardOverlay onUnlock={handleUnlock} />}

      {/* Card Content Container */}
      <div className={`p-6 md:p-8 h-full flex ${cardLayout}`}>
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="flex items-center flex-1">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0 ${
                  index === 0 ? "bg-yellow-500" : "bg-blue-600"
                }`}
              >
                <span className="text-white text-xl">📊</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 truncate">
                  {business.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(business.difficulty)}`}
                  >
                    {business.difficulty}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    AI Match
                  </span>
                </div>
              </div>
            </div>

            {/* Fit Score */}
            <div className="text-center sm:text-right flex-shrink-0">
              <div
                className={`text-4xl md:text-5xl font-bold ${
                  index === 0 ? "text-yellow-600" : "text-blue-600"
                }`}
              >
                {business.fitScore}%
              </div>
              <div className="text-sm text-gray-500 font-medium">Match</div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {business.description}
          </p>

          {/* Key Metrics Grid - Only show if not locked or if it's the first card */}
          {(!isLocked || index === 0) && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">
                      Time to Profit
                    </span>
                  </div>
                  <div className="font-bold text-gray-900 text-sm md:text-base">
                    {business.timeToProfit}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">
                      Startup Cost
                    </span>
                  </div>
                  <div className="font-bold text-gray-900 text-sm md:text-base">
                    {business.startupCost}
                  </div>
                </div>
              </div>

              {/* Potential Income Highlight */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium text-green-800">
                    Potential Income
                  </span>
                </div>
                <div className="text-xl md:text-2xl font-bold text-green-700">
                  {business.potentialIncome}
                </div>
              </div>
            </>
          )}

          {/* Expandable Content - Only for unlocked cards */}
          {!isLocked && (
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  {/* Benefits and Challenges Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Top Benefits */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Top Benefits
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        {business.pros.slice(0, 3).map((pro, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-green-500 mr-2 text-xs flex-shrink-0 mt-1">
                              •
                            </span>
                            <span className="leading-tight">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Potential Challenges */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <AlertTriangle className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0" />
                        Potential Challenges
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        {business.cons.slice(0, 2).map((con, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-orange-500 mr-2 text-xs flex-shrink-0 mt-1">
                              •
                            </span>
                            <span className="leading-tight">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Required Skills Section */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {getSkillsToShow().map((skill, skillIndex) => (
                        <motion.span
                          key={`${skill}-${skillIndex}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{
                            duration: 0.2,
                            delay: skillIndex * 0.05,
                          }}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </motion.span>
                      ))}

                      {/* Show More/Less Skills Button */}
                      {business.skills.length > 4 && (
                        <button
                          onClick={handleSkillsToggle}
                          className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {showAllSkills
                            ? "Show less"
                            : `+${remainingSkillsCount} more`}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Spacer to push buttons to bottom when not expanded */}
          {!isExpanded && <div className="flex-grow"></div>}

          {/* Action Buttons - Only show for unlocked cards or first card */}
          {(!isLocked || index === 0) && (
            <div className="mt-auto pt-6 space-y-3">
              {/* Primary Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => onViewFullReport(business.id)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
                >
                  <TrendingUp className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>View Full Report</span>
                </button>

                <button
                  onClick={() => onGetStarted(business.id)}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 flex items-center justify-center"
                >
                  <TrendingUp className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">
                    I want to get started with {business.name}
                  </span>
                </button>
              </div>

              {/* Secondary Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
                >
                  {isExpanded ? "Show Less" : "Show Details"}
                </button>

                <button
                  onClick={() => onLearnMore(business.id)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-all duration-300 flex items-center group"
                >
                  <span>Learn more about {business.name} for you</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Results;