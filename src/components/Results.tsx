import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Star,
  Zap,
  Users,
  Target,
  Brain,
  Award,
  Lightbulb,
  BarChart3,
  FileText,
  Download,
  Share2,
  BookOpen,
  Play,
  ExternalLink,
} from "lucide-react";
import { QuizData, BusinessPath } from "../types";
import { generatePersonalizedPaths } from "../utils/quizLogic";
import { AIService } from "../utils/aiService";
import BusinessCardGrid from "./BusinessCardGrid";
import { usePaywall } from "../contexts/PaywallContext";
import { PaywallModal } from "./PaywallModals";

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
  const navigate = useNavigate();
  const [personalizedPaths, setPersonalizedPaths] = useState<BusinessPath[]>([]);
  const [insights, setInsights] = useState<PersonalizedInsights | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [paywallType, setPaywallType] = useState<"business-model" | "learn-more" | "full-report">("business-model");
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");
  
  const { hasUnlockedAnalysis, setHasUnlockedAnalysis, canAccessBusinessModel } = usePaywall();

  useEffect(() => {
    console.log("Results component received quizData:", quizData);
    if (quizData) {
      const paths = generatePersonalizedPaths(quizData);
      console.log("Generated personalized paths:", paths);
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
    const topPath = paths[0];
    return {
      personalizedSummary: `Based on your comprehensive assessment, ${topPath.name} achieves a ${topPath.fitScore}% compatibility score with your unique profile. Your goals, personality traits, and available resources align perfectly with this business model's requirements and potential outcomes.`,
      customRecommendations: [
        "Start with proven tools and systems to minimize learning curve",
        "Focus on systematic execution rather than trying to reinvent approaches",
        "Leverage your natural strengths while gradually building new skills",
        "Set realistic 90-day milestones to maintain motivation and track progress",
        "Join online communities in your chosen field for support and networking",
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
      motivationalMessage: "Your unique combination of skills, motivation, and strategic thinking creates the perfect foundation for entrepreneurial success. Trust in your abilities, stay consistent with your efforts, and remember that every successful entrepreneur started exactly where you are now."
    };
  };

  const handleLearnMore = (businessId: string) => {
    // Check if user can access business model details (has paid)
    if (canAccessBusinessModel(businessId)) {
      // User has paid, navigate directly to business model detail page
      navigate(`/business/${businessId}`);
    } else {
      // User hasn't paid, show paywall
      setSelectedBusinessId(businessId);
      setPaywallType("learn-more");
      setShowPaywallModal(true);
    }
  };

  const handleGetStarted = (businessId: string) => {
    // Check if user can access business model details (has paid)
    if (canAccessBusinessModel(businessId)) {
      // User has paid, navigate directly to business model detail page with get-started hash
      navigate(`/business/${businessId}#get-started`);
    } else {
      // User hasn't paid, show paywall
      setSelectedBusinessId(businessId);
      setPaywallType("business-model");
      setShowPaywallModal(true);
    }
  };

  const handleViewFullReport = (businessId: string) => {
    // Check if user can access business model details (has paid)
    if (canAccessBusinessModel(businessId)) {
      // User has paid, navigate directly to business model detail page
      navigate(`/business/${businessId}`);
    } else {
      // User hasn't paid, show paywall
      setSelectedBusinessId(businessId);
      setPaywallType("full-report");
      setShowPaywallModal(true);
    }
  };

  const handlePaywallUnlock = () => {
    // Simulate payment and unlock access
    setHasUnlockedAnalysis(true);
    setShowPaywallModal(false);
    
    // Navigate to the appropriate page based on the paywall type
    if (paywallType === "learn-more" || paywallType === "full-report") {
      navigate(`/business/${selectedBusinessId}`);
    } else if (paywallType === "business-model") {
      navigate(`/business/${selectedBusinessId}#get-started`);
    }
  };

  const handlePaywallClose = () => {
    setShowPaywallModal(false);
    setSelectedBusinessId("");
  };

  const topPath = personalizedPaths[0];
  const secondPath = personalizedPaths[1];
  const thirdPath = personalizedPaths[2];

  const tabs = [
    { id: "overview", label: "Overview", icon: Target },
    { id: "insights", label: "AI Insights", icon: Brain },
    { id: "action-plan", label: "Action Plan", icon: BookOpen },
  ];

  if (!topPath) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Generating Your Results...
          </h1>
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Best Fit Section */}
              <div className="mb-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    🎯 Your Best Fit
                  </h2>
                  <p className="text-xl text-gray-600">
                    Based on your responses, here's your top business match
                  </p>
                </div>

                {/* Best Fit Business Card */}
                <div className="max-w-4xl mx-auto mb-8">
                  <div className="relative bg-white rounded-3xl shadow-2xl border-4 border-transparent bg-gradient-to-r from-yellow-400 to-orange-500 p-1">
                    <div className="bg-white rounded-3xl p-8">
                      {/* Top Badge */}
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
                          <Star className="h-4 w-4 mr-2" />
                          BEST MATCH
                        </div>
                      </div>

                      {/* Header */}
                      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6 pt-4">
                        <div className="flex items-center flex-1">
                          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mr-6">
                            <TrendingUp className="h-8 w-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                              {topPath.name}
                            </h3>
                            <p className="text-gray-600 text-lg">{topPath.description}</p>
                          </div>
                        </div>
                        <div className="text-center md:text-right">
                          <div className="text-5xl md:text-6xl font-bold text-yellow-600 mb-2">
                            {topPath.fitScore}%
                          </div>
                          <div className="text-sm text-gray-500 font-medium">Perfect Match</div>
                        </div>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                          <div className="text-sm text-gray-600 mb-1">Time to Profit</div>
                          <div className="font-bold text-gray-900">{topPath.timeToProfit}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                          <div className="text-sm text-gray-600 mb-1">Startup Cost</div>
                          <div className="font-bold text-gray-900">{topPath.startupCost}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                          <div className="text-sm text-gray-600 mb-1">Income Potential</div>
                          <div className="font-bold text-green-700">{topPath.potentialIncome}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <Zap className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                          <div className="text-sm text-gray-600 mb-1">Difficulty</div>
                          <div className="font-bold text-gray-900">{topPath.difficulty}</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <button
                          onClick={() => handleViewFullReport(topPath.id)}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                        >
                          <FileText className="h-5 w-5 mr-2 inline" />
                          View Full Report
                        </button>
                        
                        <button
                          onClick={() => handleGetStarted(topPath.id)}
                          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-[1.02]"
                        >
                          <Play className="h-5 w-5 mr-2 inline" />
                          I want to get started with {topPath.name}
                        </button>

                        <div className="text-center pt-2">
                          <button
                            onClick={() => handleLearnMore(topPath.id)}
                            className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 inline-flex items-center group"
                          >
                            Learn more about {topPath.name} for you
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Income Distribution Graph for Best Fit */}
                <div className="max-w-4xl mx-auto mb-12">
                  <IncomeDistributionGraph businessModel={topPath.name} />
                </div>
              </div>

              {/* Other Strong Matches */}
              {personalizedPaths.length > 1 && (
                <div className="mb-12">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Other Strong Matches
                    </h2>
                    <p className="text-xl text-gray-600">
                      These business models also align well with your profile
                    </p>
                  </div>

                  <BusinessCardGrid
                    businesses={personalizedPaths.slice(1, 4).map(path => ({
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
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "insights" && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* AI Insights Content */}
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Personalized Summary */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Brain className="h-6 w-6 mr-3 text-blue-600" />
                    Your Personalized Analysis
                  </h3>
                  {isGeneratingInsights ? (
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ) : (
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {insights?.personalizedSummary}
                    </p>
                  )}
                </div>

                {/* Custom Recommendations */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Lightbulb className="h-6 w-6 mr-3 text-yellow-600" />
                    Custom Recommendations
                  </h3>
                  {isGeneratingInsights ? (
                    <div className="animate-pulse space-y-3">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {insights?.customRecommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Success Strategies vs Challenges */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
                      Success Strategies
                    </h3>
                    {isGeneratingInsights ? (
                      <div className="animate-pulse space-y-3">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="h-4 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {insights?.successStrategies.map((strategy, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700">{strategy}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <AlertTriangle className="h-6 w-6 mr-3 text-orange-600" />
                      Potential Challenges
                    </h3>
                    {isGeneratingInsights ? (
                      <div className="animate-pulse space-y-3">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="h-4 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {insights?.potentialChallenges.map((challenge, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700">{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Motivational Message */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
                  <h3 className="text-2xl font-bold mb-4">Your Success Message</h3>
                  {isGeneratingInsights ? (
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-white/20 rounded mx-auto w-3/4"></div>
                      <div className="h-4 bg-white/20 rounded mx-auto w-1/2"></div>
                    </div>
                  ) : (
                    <p className="text-lg leading-relaxed opacity-95">
                      {insights?.motivationalMessage}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "action-plan" && (
            <motion.div
              key="action-plan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Action Plan Content */}
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Your Personalized Action Plan
                  </h2>
                  <p className="text-xl text-gray-600">
                    Step-by-step roadmap to launch your {topPath.name} business
                  </p>
                </div>

                {isGeneratingInsights ? (
                  <div className="space-y-8">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl p-8 shadow-lg animate-pulse">
                        <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Week 1 */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-blue-500">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                          1
                        </div>
                        Week 1: Foundation
                      </h3>
                      <ul className="space-y-3">
                        {insights?.personalizedActionPlan.week1.map((task, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Month 1 */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-green-500">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                          2
                        </div>
                        Month 1: Launch
                      </h3>
                      <ul className="space-y-3">
                        {insights?.personalizedActionPlan.month1.map((task, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Month 3 */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-purple-500">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                          3
                        </div>
                        Month 3: Optimize
                      </h3>
                      <ul className="space-y-3">
                        {insights?.personalizedActionPlan.month3.map((task, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Month 6 */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-orange-500">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                          4
                        </div>
                        Month 6: Scale
                      </h3>
                      <ul className="space-y-3">
                        {insights?.personalizedActionPlan.month6.map((task, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="text-center mt-12 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/quiz")}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => navigate("/explore")}
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Explore All Business Models
            </button>
          </div>
        </div>
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