import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Star,
  Target,
  Lightbulb,
  ArrowLeft,
  Users,
  Award,
  Zap,
  Brain,
  BarChart3,
  FileText,
  Lock,
  Calendar,
} from "lucide-react";
import { QuizData, BusinessPath } from "../types";
import { generatePersonalizedPaths } from "../utils/quizLogic";
import { AIService } from "../utils/aiService";
import { useNavigate } from "react-router-dom";
import { usePaywall } from "../contexts/PaywallContext";
import { PaywallModal, LockedCardOverlay } from "./PaywallModals";

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

interface IncomeDistributionGraphProps {
  businessModel: string;
}

const IncomeDistributionGraph: React.FC<IncomeDistributionGraphProps> = ({ businessModel }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 600, height: 350 }); // Increased height from 300 to 350
  const containerRef = React.useRef<HTMLDivElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  // Responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newWidth = Math.max(400, Math.min(800, containerWidth - 48)); // 48px for padding
        const newHeight = Math.max(300, newWidth * 0.45); // Increased aspect ratio from 0.4 to 0.45
        setDimensions({ width: newWidth, height: newHeight });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(dimensions.width, event.clientX - rect.left));
      const y = event.clientY - rect.top;
      setMousePosition({ x, y });
    }
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const getIncomeAtPosition = (x: number) => {
    // More realistic income distribution curve
    const percentage = x / dimensions.width;
    const minIncome = 0;
    const maxIncome = 25000;
    
    // Use exponential curve for more realistic income distribution
    const income = minIncome + (maxIncome - minIncome) * Math.pow(percentage, 1.8);
    return Math.round(income);
  };

  const getCurveY = (x: number) => {
    // Bell curve formula: peak at center, tapering to edges
    const center = dimensions.width * 0.4; // Peak slightly left of center (typical income)
    const width = dimensions.width * 0.25;
    const height = dimensions.height * 0.5; // Adjusted for new height
    const baseY = dimensions.height * 0.75; // Adjusted for new height
    
    const bellValue = Math.exp(-Math.pow(x - center, 2) / (2 * Math.pow(width, 2)));
    return baseY - (height * bellValue);
  };

  // Generate smooth curve path
  const generateCurvePath = () => {
    const points = [];
    const step = dimensions.width / 100;
    
    for (let x = 0; x <= dimensions.width; x += step) {
      points.push(`${x},${getCurveY(x)}`);
    }
    
    return `M ${points.join(' L ')}`;
  };

  // Generate gradient area path
  const generateAreaPath = () => {
    const points = [];
    const step = dimensions.width / 100;
    const baseY = dimensions.height * 0.75; // Adjusted for new height
    
    points.push(`0,${baseY}`); // Start at bottom left
    
    for (let x = 0; x <= dimensions.width; x += step) {
      points.push(`${x},${getCurveY(x)}`);
    }
    
    points.push(`${dimensions.width},${baseY}`); // End at bottom right
    points.push(`0,${baseY}`); // Close path
    
    return `M ${points.join(' L ')} Z`;
  };

  const formatIncome = (income: number) => {
    if (income >= 1000) {
      return `$${(income / 1000).toFixed(1)}K`;
    }
    return `$${income}`;
  };

  const getTooltipPosition = () => {
    const tooltipWidth = 120;
    const tooltipHeight = 40;
    const padding = 10;
    
    let left = mousePosition.x + padding;
    let top = mousePosition.y - tooltipHeight - padding;
    
    // Keep tooltip within bounds
    if (left + tooltipWidth > dimensions.width) {
      left = mousePosition.x - tooltipWidth - padding;
    }
    if (top < 0) {
      top = mousePosition.y + padding;
    }
    
    return { left, top };
  };

  const tooltipPos = getTooltipPosition();

  return (
    <div className="relative" ref={containerRef}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Income Potential Distribution
        </h3>
        <p className="text-gray-600 text-sm">
          This shows the distribution of realistic monthly income ranges for {businessModel}
        </p>
      </div>
      
      <div className="relative bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="cursor-crosshair w-full h-auto"
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient
              id="incomeDistributionGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="40%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06d6a0" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient
              id="curveGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="40%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06d6a0" />
            </linearGradient>
          </defs>

          {/* Subtle grid lines */}
          <g opacity="0.08">
            {Array.from({ length: 5 }, (_, i) => {
              const x = (dimensions.width / 4) * i;
              return (
                <line
                  key={`v-${i}`}
                  x1={x}
                  y1={dimensions.height * 0.1}
                  x2={x}
                  y2={dimensions.height * 0.75}
                  stroke="#6b7280"
                  strokeWidth="1"
                />
              );
            })}
            {Array.from({ length: 4 }, (_, i) => {
              const y = dimensions.height * 0.1 + (dimensions.height * 0.65 / 3) * i;
              return (
                <line
                  key={`h-${i}`}
                  x1={0}
                  y1={y}
                  x2={dimensions.width}
                  y2={y}
                  stroke="#6b7280"
                  strokeWidth="1"
                />
              );
            })}
          </g>

          {/* Area under curve */}
          <path
            d={generateAreaPath()}
            fill="url(#incomeDistributionGradient)"
          />

          {/* Bell curve line */}
          <path
            d={generateCurvePath()}
            fill="none"
            stroke="url(#curveGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive elements */}
          {isHovering && (
            <>
              {/* Vertical line */}
              <line
                x1={mousePosition.x}
                y1={dimensions.height * 0.1}
                x2={mousePosition.x}
                y2={dimensions.height * 0.75}
                stroke="#8b5cf6"
                strokeWidth="2"
                strokeDasharray="4,4"
                opacity="0.8"
              />
              {/* Dot on curve */}
              <circle
                cx={mousePosition.x}
                cy={getCurveY(mousePosition.x)}
                r="6"
                fill="#8b5cf6"
                stroke="white"
                strokeWidth="3"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
              />
            </>
          )}

          {/* Y-axis labels */}
          <text
            x={-10}
            y={dimensions.height * 0.15}
            textAnchor="end"
            className="text-xs fill-gray-500 font-medium"
          >
            High
          </text>
          <text
            x={-10}
            y={dimensions.height * 0.7}
            textAnchor="end"
            className="text-xs fill-gray-500 font-medium"
          >
            Low
          </text>

          {/* X-axis labels - keeping same position as requested */}
          <g transform={`translate(0, ${dimensions.height * 0.82})`}>
            <text x={0} textAnchor="start" className="text-xs fill-gray-500 font-medium">
              $0
            </text>
            <text x={dimensions.width * 0.2} textAnchor="middle" className="text-xs fill-gray-500 font-medium">
              $1K
            </text>
            <text x={dimensions.width * 0.4} textAnchor="middle" className="text-xs fill-gray-600 font-semibold">
              $5K
            </text>
            <text x={dimensions.width * 0.7} textAnchor="middle" className="text-xs fill-gray-500 font-medium">
              $15K
            </text>
            <text x={dimensions.width} textAnchor="end" className="text-xs fill-gray-500 font-medium">
              $25K+
            </text>
          </g>

          {/* Removed "Typical" label as requested */}

          {/* Axis titles with increased spacing */}
          <text
            x={dimensions.width / 2}
            y={dimensions.height - 15} // Moved down to maintain same padding from bottom
            textAnchor="middle"
            className="text-sm fill-gray-700 font-medium"
          >
            Income Range
          </text>
          <text
            x={-dimensions.height / 2}
            y={15}
            textAnchor="middle"
            transform={`rotate(-90, 15, ${dimensions.height / 2})`}
            className="text-sm fill-gray-700 font-medium"
          >
            Likelihood
          </text>
        </svg>

        {/* Tooltip */}
        {isHovering && (
          <div
            className="absolute bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium pointer-events-none z-10 shadow-xl border border-gray-700"
            style={{
              left: tooltipPos.left,
              top: tooltipPos.top,
              transform: 'translateZ(0)', // Force hardware acceleration
            }}
          >
            {formatIncome(getIncomeAtPosition(mousePosition.x))}/month
          </div>
        )}
      </div>
    </div>
  );
};

const Results: React.FC<ResultsProps> = ({ quizData, onBack, userEmail }) => {
  const [personalizedPaths, setPersonalizedPaths] = useState<BusinessPath[]>(
    [],
  );
  const [insights, setInsights] = useState<PersonalizedInsights | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(true);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [paywallType, setPaywallType] = useState<
    "business-model" | "learn-more" | "full-report"
  >("business-model");
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");
  const navigate = useNavigate();
  const { hasUnlockedAnalysis, setHasUnlockedAnalysis } = usePaywall();

  useEffect(() => {
    console.log("Results component received quizData:", quizData);
    if (quizData) {
      const paths = generatePersonalizedPaths(quizData);
      console.log("Generated personalized paths:", paths);
      setPersonalizedPaths(paths);
      generateInsights(quizData, paths);
    }
  }, [quizData]);

  const generateInsights = async (
    data: QuizData,
    paths: BusinessPath[],
  ): Promise<void> => {
    try {
      setIsGeneratingInsights(true);
      const aiService = AIService.getInstance();
      const topPaths = paths.slice(0, 3);
      const generatedInsights = await aiService.generatePersonalizedInsights(
        data,
        topPaths,
      );
      setInsights(generatedInsights);
    } catch (error) {
      console.error("Error generating insights:", error);
      setInsights(generateFallbackInsights(data, paths));
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const generateFallbackInsights = (
    data: QuizData,
    paths: BusinessPath[],
  ): PersonalizedInsights => {
    const topPath = paths[0];
    return {
      personalizedSummary: `Based on your comprehensive assessment, ${topPath.name} emerges as your top match with a ${topPath.fitScore}% compatibility score. Your unique combination of goals, personality traits, and available resources align perfectly with this business model's requirements and potential outcomes.`,
      customRecommendations: [
        "Start with proven tools and systems to minimize learning curve",
        "Focus on systematic execution rather than trying to reinvent approaches",
        "Leverage your natural strengths while gradually building new skills",
        "Set realistic 90-day milestones to maintain motivation and track progress",
        "Join online communities in your chosen field for support and networking",
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

  const handleBusinessCardClick = (businessId: string) => {
    if (hasUnlockedAnalysis) {
      // User has paid, navigate directly to business model detail page
      navigate(`/business/${businessId}`);
    } else {
      // User hasn't paid, show paywall
      setSelectedBusinessId(businessId);
      setPaywallType("business-model");
      setShowPaywallModal(true);
    }
  };

  const handleLearnMore = (businessId: string) => {
    if (hasUnlockedAnalysis) {
      // User has paid, navigate directly to business model detail page
      navigate(`/business/${businessId}`);
    } else {
      // User hasn't paid, show paywall
      setSelectedBusinessId(businessId);
      setPaywallType("learn-more");
      setShowPaywallModal(true);
    }
  };

  const handleViewFullReport = (businessId: string) => {
    if (hasUnlockedAnalysis) {
      // User has paid, show full report
      navigate("/full-report", { state: { quizData, businessId } });
    } else {
      // User hasn't paid, show paywall
      setSelectedBusinessId(businessId);
      setPaywallType("full-report");
      setShowPaywallModal(true);
    }
  };

  const handlePaywallUnlock = () => {
    // Simulate payment processing
    setHasUnlockedAnalysis(true);
    setShowPaywallModal(false);

    // Navigate based on the paywall type
    if (paywallType === "full-report") {
      navigate("/full-report", { state: { quizData, businessId: selectedBusinessId } });
    } else {
      // For business-model and learn-more, navigate to business model detail page
      navigate(`/business/${selectedBusinessId}`);
    }
  };

  const handlePaywallClose = () => {
    setShowPaywallModal(false);
    setSelectedBusinessId("");
  };

  if (!quizData || personalizedPaths.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your personalized results...</p>
        </div>
      </div>
    );
  }

  const topPath = personalizedPaths[0];
  const secondPath = personalizedPaths[1];
  const thirdPath = personalizedPaths[2];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={onBack}
              className="absolute left-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Personalized Business Blueprint
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Based on your responses, we've identified the perfect business paths
            for your unique situation, goals, and personality.
          </p>
          {userEmail && (
            <p className="text-sm text-gray-500 mt-2">
              Results sent to: {userEmail}
            </p>
          )}
        </motion.div>

        {/* AI Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-200"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              AI Analysis Summary
            </h2>
          </div>

          {isGeneratingInsights ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : (
            <div className="prose prose-lg text-gray-700">
              <p>{insights?.personalizedSummary}</p>
            </div>
          )}
        </motion.div>

        {/* Best Fit Business Model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🎯 Your Best Fit
            </h2>
            <p className="text-lg text-gray-600">
              This business model is perfectly tailored to your profile
            </p>
          </div>

          <div className="relative">
            <BusinessCard
              business={topPath}
              onLearnMore={handleLearnMore}
              onGetStarted={handleBusinessCardClick}
              onViewFullReport={handleViewFullReport}
              isTopMatch={true}
              showIncomeGraph={true}
            />
          </div>
        </motion.div>

        {/* Other Strong Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Other Strong Matches
            </h2>
            <p className="text-lg text-gray-600">
              Alternative paths that also align well with your profile
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative">
              <BusinessCard
                business={secondPath}
                onLearnMore={handleLearnMore}
                onGetStarted={handleBusinessCardClick}
                onViewFullReport={handleViewFullReport}
                isTopMatch={false}
              />
              {!hasUnlockedAnalysis && <LockedCardOverlay onUnlock={() => handleBusinessCardClick(secondPath.id)} />}
            </div>
            <div className="relative">
              <BusinessCard
                business={thirdPath}
                onLearnMore={handleLearnMore}
                onGetStarted={handleBusinessCardClick}
                onViewFullReport={handleViewFullReport}
                isTopMatch={false}
              />
              {!hasUnlockedAnalysis && <LockedCardOverlay onUnlock={() => handleBusinessCardClick(thirdPath.id)} />}
            </div>
          </div>
        </motion.div>

        {/* Personalized Insights */}
        {insights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-2 gap-8 mb-12"
          >
            {/* Custom Recommendations */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Lightbulb className="h-6 w-6 mr-3 text-yellow-500" />
                Personalized Recommendations
              </h3>
              <ul className="space-y-3">
                {insights.customRecommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Success Strategies */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Target className="h-6 w-6 mr-3 text-blue-500" />
                Success Strategies
              </h3>
              <ul className="space-y-3">
                {insights.successStrategies.map((strategy, index) => (
                  <li key={index} className="flex items-start">
                    <Star className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Action Plan */}
        {insights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-12"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Calendar className="h-6 w-6 mr-3 text-purple-500" />
              Your Personalized Action Plan
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(insights.personalizedActionPlan).map(
                ([timeframe, tasks], index) => (
                  <div key={timeframe} className="space-y-3">
                    <h4 className="font-bold text-gray-900 text-lg capitalize">
                      {timeframe.replace(/(\d+)/, "$1 ")}
                    </h4>
                    <ul className="space-y-2">
                      {tasks.map((task, taskIndex) => (
                        <li
                          key={taskIndex}
                          className="text-sm text-gray-600 flex items-start"
                        >
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              )}
            </div>
          </motion.div>
        )}

        {/* Potential Challenges */}
        {insights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-orange-50 rounded-2xl p-8 mb-12 border border-orange-200"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertTriangle className="h-6 w-6 mr-3 text-orange-500" />
              Potential Challenges to Watch For
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {insights.potentialChallenges.map((challenge, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{challenge}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Motivational Message */}
        {insights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-center text-white mb-12"
          >
            <Award className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">You're Ready to Succeed!</h3>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              {insights.motivationalMessage}
            </p>
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleBusinessCardClick(topPath.id)}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Start with {topPath.name}
            </button>
            <button
              onClick={() => navigate("/explore")}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
            >
              Explore All Options
            </button>
          </div>
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

// Business Card Component
interface BusinessCardProps {
  business: BusinessPath;
  onLearnMore: (businessId: string) => void;
  onGetStarted: (businessId: string) => void;
  onViewFullReport: (businessId: string) => void;
  isTopMatch?: boolean;
  showIncomeGraph?: boolean;
}

const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  onLearnMore,
  onGetStarted,
  onViewFullReport,
  isTopMatch = false,
  showIncomeGraph = false,
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

  return (
    <motion.div
      className={`relative bg-white rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl border-2 group max-w-4xl mx-auto ${
        isTopMatch
          ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 transform hover:scale-[1.02]"
          : "border-gray-200 hover:border-blue-300 hover:scale-[1.02]"
      }`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Badge for Best Match */}
      {isTopMatch && (
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

      {/* Card Content Container */}
      <div className="h-full p-8 flex flex-col">
        {/* Header Section */}
        <div className="flex items-center mb-6">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 ${
              isTopMatch ? "bg-yellow-500" : "bg-blue-600"
            }`}
          >
            <span className="text-white text-xl">📊</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-gray-900">
                {business.name}
              </h3>
              <div
                className={`text-5xl font-bold ${
                  isTopMatch ? "text-yellow-600" : "text-blue-600"
                }`}
              >
                {business.fitScore}%
              </div>
            </div>
            <div className="flex items-center gap-3">
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

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed flex-shrink-0">
          {business.description}
        </p>

        {/* Income Graph for Top Match */}
        {showIncomeGraph && isTopMatch && (
          <div className="mb-6">
            <IncomeDistributionGraph businessModel={business.name} />
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 flex-shrink-0">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Time to Profit
              </span>
            </div>
            <div className="font-bold text-gray-900">{business.timeToProfit}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Startup Cost
              </span>
            </div>
            <div className="font-bold text-gray-900">{business.startupCost}</div>
          </div>
        </div>

        {/* Potential Income Highlight */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 flex-shrink-0">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Potential Income
            </span>
          </div>
          <div className="text-2xl font-bold text-green-700">
            {business.potentialIncome}
          </div>
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden flex-grow"
            >
              {/* Top Benefits */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Top Benefits
                </h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  {business.pros.slice(0, 3).map((pro, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-2 text-xs">•</span>
                      <span className="leading-tight">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Potential Challenges */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                  Potential Challenges
                </h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  {business.cons.slice(0, 2).map((con, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-orange-500 mr-2 text-xs">•</span>
                      <span className="leading-tight">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Skills Section */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getSkillsToShow().map((skill, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </motion.span>
                  ))}

                  {/* Show More Skills Button */}
                  {!showAllSkills && remainingSkillsCount > 0 && (
                    <button
                      onClick={handleSkillsToggle}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      +{remainingSkillsCount} more
                    </button>
                  )}

                  {/* Show Less Skills Button */}
                  {showAllSkills && business.skills.length > 4 && (
                    <button
                      onClick={handleSkillsToggle}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      Show less
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spacer to push buttons to bottom */}
        {!isExpanded && <div className="flex-grow"></div>}

        {/* Action Buttons - Fixed at Bottom */}
        <div
          className="mt-auto pt-6 space-y-3 flex-shrink-0"
          style={{ position: "sticky", bottom: 0 }}
        >
          {/* Primary Action Buttons */}
          <div className="space-y-3">
            {/* View Full Report Button */}
            <button
              onClick={() => onViewFullReport(business.id)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform group-hover:scale-[1.02] flex items-center justify-center"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View Full Report
            </button>

            {/* Get Started Button */}
            <button
              onClick={() => onGetStarted(business.id)}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 transform group-hover:scale-[1.02] flex items-center justify-center"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              I want to get started with {business.name}
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="flex items-center justify-between pt-2">
            {/* Show More/Less Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
            >
              {isExpanded ? "Show Less" : "Show More Details"}
            </button>

            {/* Learn More Link */}
            <button
              onClick={() => onLearnMore(business.id)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-all duration-300 flex items-center group"
            >
              Learn more about {business.name} for you
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Results;