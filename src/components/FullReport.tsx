import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDown,
  Download,
  Mail,
  Share2,
  Clock,
  DollarSign,
  TrendingUp,
  Zap,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Users,
  Globe,
  Target,
  Lightbulb,
  Star,
  Award,
  Rocket,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import { QuizData, BusinessPath } from "../types";
import { AIService } from "../utils/aiService";
import { useNavigate } from "react-router-dom";

interface FullReportProps {
  quizData: QuizData;
  topPath: BusinessPath;
  allPaths: BusinessPath[];
  onBack: () => void;
}

interface TraitSliderProps {
  label: string;
  value: number;
  leftLabel: string;
  rightLabel: string;
}

interface AIInsights {
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
  strengthsWeaknesses: {
    strengths: string[];
    weaknesses: string[];
  };
  whyThisFits: string;
  personalizedPros: string[];
  personalizedCons: string[];
  strugglesAndSolutions: string;
  skillsAssessment: {
    hasSkills: string[];
    needsSkills: string[];
    developingSkills: string[];
  };
  alternativeReasons: string[];
  avoidReasons: string[];
}

const TraitSlider: React.FC<TraitSliderProps> = ({
  label,
  value,
  leftLabel,
  rightLabel,
}) => {
  const percentage = Math.round(value * 100);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">{percentage}%</span>
      </div>
      <div className="relative">
        <div className="w-full h-3 bg-gray-200 rounded-full">
          <div
            className="h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
          <div
            className="absolute top-0 w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-md transform -translate-y-0.5 transition-all duration-500"
            style={{ left: `calc(${percentage}% - 8px)` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">{leftLabel}</span>
          <span className="text-xs text-gray-500">{rightLabel}</span>
        </div>
      </div>
    </div>
  );
};

const IncomeGraph: React.FC<{ businessModel: string }> = ({
  businessModel,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Sample income curve data points
  const incomeData = [
    { month: 0, income: 0 },
    { month: 1, income: 200 },
    { month: 3, income: 800 },
    { month: 6, income: 2500 },
    { month: 12, income: 8000 },
    { month: 18, income: 15000 },
    { month: 24, income: 25000 },
  ];

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setMousePosition({ x, y });

      // Calculate income based on x position
      const percentage = x / rect.width;
      const maxIncome = 25000;
      const income = Math.round(maxIncome * Math.pow(percentage, 1.5));
      setMousePosition({
        x,
        y: rect.height - (income / maxIncome) * rect.height,
      });
    }
  };

  const getIncomeAtPosition = (x: number, width: number) => {
    const percentage = x / width;
    const maxIncome = 25000;
    return Math.round(maxIncome * Math.pow(percentage, 1.5));
  };

  return (
    <div className="relative">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Income Potential Over Time
      </h3>
      <div className="relative bg-white p-6 rounded-xl border border-gray-200">
        <svg
          ref={svgRef}
          width="100%"
          height="300"
          viewBox="0 0 400 300"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="cursor-crosshair"
        >
          {/* Grid lines */}
          <defs>
            <pattern
              id="grid"
              width="40"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 30"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Income curve */}
          <path
            d="M 0 300 Q 100 250 200 150 Q 300 80 400 50"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="3"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06d6a0" />
            </linearGradient>
          </defs>

          {/* Hover indicator */}
          {isHovering && (
            <>
              <line
                x1={mousePosition.x}
                y1="0"
                x2={mousePosition.x}
                y2="300"
                stroke="#6b7280"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
              <circle
                cx={mousePosition.x}
                cy={mousePosition.y}
                r="6"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
              />
            </>
          )}
        </svg>

        {/* Income tooltip */}
        {isHovering && (
          <div
            className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium pointer-events-none z-10"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 40,
              transform: mousePosition.x > 300 ? "translateX(-100%)" : "none",
            }}
          >
            ${getIncomeAtPosition(mousePosition.x, 400).toLocaleString()}/month
          </div>
        )}

        {/* Axis labels */}
        <div className="absolute bottom-2 left-0 text-xs text-gray-500">
          Month 0
        </div>
        <div className="absolute bottom-2 right-0 text-xs text-gray-500">
          Month 24
        </div>
        <div className="absolute top-2 left-0 text-xs text-gray-500 transform -rotate-90 origin-left">
          $25K
        </div>
        <div className="absolute bottom-2 left-0 text-xs text-gray-500">$0</div>
      </div>
    </div>
  );
};

const FullReport: React.FC<FullReportProps> = ({
  quizData,
  topPath,
  allPaths,
  onBack,
}) => {
  const [activeSection, setActiveSection] = useState("welcome");
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(true);
  const [showNav, setShowNav] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Calculate trait scores based on quiz data
  const traitScores = {
    socialComfort: calculateSocialComfort(quizData),
    consistency: calculateConsistency(quizData),
    riskTolerance: calculateRiskTolerance(quizData),
    techComfort: calculateTechComfort(quizData),
    motivation: calculateMotivation(quizData),
    feedbackResilience: calculateFeedbackResilience(quizData),
    structurePreference: calculateStructurePreference(quizData),
    creativity: calculateCreativity(quizData),
    communicationConfidence: calculateCommunicationConfidence(quizData),
  };

  const traitSliders = [
    {
      label: "Introvert ←→ Extrovert",
      trait: "socialComfort" as keyof typeof traitScores,
      leftLabel: "Introvert",
      rightLabel: "Extrovert",
    },
    {
      label: "Low Discipline ←→ High Discipline",
      trait: "consistency" as keyof typeof traitScores,
      leftLabel: "Low Discipline",
      rightLabel: "High Discipline",
    },
    {
      label: "Avoids Risks ←→ Embraces Risks",
      trait: "riskTolerance" as keyof typeof traitScores,
      leftLabel: "Avoids Risks",
      rightLabel: "Embraces Risks",
    },
    {
      label: "Low Tech Skills ←→ Tech Savvy",
      trait: "techComfort" as keyof typeof traitScores,
      leftLabel: "Low Tech Skills",
      rightLabel: "Tech Savvy",
    },
    {
      label: "Needs Structure ←→ Works Freely",
      trait: "structurePreference" as keyof typeof traitScores,
      leftLabel: "Needs Structure",
      rightLabel: "Works Freely",
    },
    {
      label: "Passive ←→ Self-Driven",
      trait: "motivation" as keyof typeof traitScores,
      leftLabel: "Passive",
      rightLabel: "Self-Driven",
    },
    {
      label: "Takes Feedback Personally ←→ Uses Feedback to Grow",
      trait: "feedbackResilience" as keyof typeof traitScores,
      leftLabel: "Takes Feedback Personally",
      rightLabel: "Uses Feedback to Grow",
    },
    {
      label: "Analytical ←→ Creative",
      trait: "creativity" as keyof typeof traitScores,
      leftLabel: "Analytical",
      rightLabel: "Creative",
    },
    {
      label: "Low Confidence ←→ High Confidence",
      trait: "communicationConfidence" as keyof typeof traitScores,
      leftLabel: "Low Confidence",
      rightLabel: "High Confidence",
    },
  ];

  const sections = [
    { id: "welcome", label: `${topPath.name} Overview`, icon: Star },
    { id: "ai-report", label: "AI Report", icon: BarChart3 },
    { id: "personality", label: "Personality Snapshot", icon: Users },
    {
      id: "business-overview",
      label: `${topPath.name} Overview`,
      icon: Target,
    },
    { id: "alternatives", label: "Other Options", icon: Lightbulb },
    { id: "actions", label: "Next Steps", icon: ArrowRight },
  ];

  const otherBestPaths = allPaths.slice(1, 4); // Next 3 best fits
  const worstPaths = allPaths.slice(-3).reverse(); // 3 worst fits

  useEffect(() => {
    generateAIInsights();
  }, []);

  const generateAIInsights = async () => {
    try {
      setIsGeneratingAI(true);
      const aiService = AIService.getInstance();
      const basicInsights = await aiService.generatePersonalizedInsights(
        quizData,
        [topPath],
      );

      // Generate additional insights for full report
      const extendedInsights = await generateExtendedInsights(basicInsights);
      setAiInsights(extendedInsights);
    } catch (error) {
      console.error("Error generating AI insights:", error);
      setAiInsights(generateFallbackInsights());
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generateExtendedInsights = async (
    basicInsights: any,
  ): Promise<AIInsights> => {
    try {
      const aiService = AIService.getInstance();

      // Generate 3 detailed paragraphs for why this business model fits
      const whyThisFitsPrompt = `
Based on this user's quiz responses and their top business match (${topPath.name}), generate exactly 3 detailed paragraphs explaining why this specific business model is the perfect fit for them.

User Profile Summary:
- Main Motivation: ${quizData.mainMotivation}
- Income Goal: $${quizData.successIncomeGoal}/month
- Time Commitment: ${quizData.weeklyTimeCommitment} hours/week
- Tech Skills: ${quizData.techSkillsRating}/5
- Risk Tolerance: ${quizData.riskComfortLevel}/5
- Communication Comfort: ${quizData.directCommunicationEnjoyment}/5
- Creative Enjoyment: ${quizData.creativeWorkEnjoyment}/5
- Work Structure Preference: ${quizData.workStructurePreference}
- Self Motivation: ${quizData.selfMotivationLevel}/5

Business Model: ${topPath.name}
Fit Score: ${topPath.fitScore}%

Generate exactly 3 paragraphs (separated by double line breaks) that explain:
1. How their personality traits and preferences align perfectly with this business model
2. Why their specific goals and timeline make this the ideal choice
3. How their skills and experience set them up for success in this field

Each paragraph should be 3-4 sentences and feel personal and specific to their profile.
      `;

      const whyThisFitsResponse = await aiService.makeOpenAIRequest(
        whyThisFitsPrompt,
        600,
        0.7,
      );

      return {
        ...basicInsights,
        strengthsWeaknesses: {
          strengths: [
            "Strong analytical thinking and problem-solving abilities",
            "High self-motivation and discipline",
            "Excellent communication skills",
            "Adaptable to new technologies and tools",
          ],
          weaknesses: [
            "May struggle with perfectionism and over-analysis",
            "Could benefit from more structured planning",
            "Might need to work on delegation skills",
            "Risk tolerance could be higher for faster growth",
          ],
        },
        whyThisFits:
          whyThisFitsResponse ||
          `${topPath.name} is your perfect match because it aligns with your analytical nature, allows for the flexibility you crave, and matches your income goals. Your strong communication skills and tech comfort make you well-suited for this path, while the scalability potential satisfies your growth ambitions.`,
        personalizedPros: [
          "Leverages your existing strengths in communication and analysis",
          "Provides the income potential you're seeking",
          "Offers flexibility that matches your lifestyle preferences",
          "Allows for gradual scaling as you build confidence",
        ],
        personalizedCons: [
          "May require pushing outside your comfort zone initially",
          "Income might be inconsistent in the early stages",
          "Requires consistent effort and self-discipline",
          "Could face increased competition as you scale",
        ],
        strugglesAndSolutions:
          "Based on your profile, you may struggle with perfectionism that delays launching. Combat this by setting 'good enough' standards and focusing on iteration over perfection. Your analytical nature might lead to over-research - set time limits for research phases and commit to action deadlines.",
        skillsAssessment: {
          hasSkills: [
            "Communication",
            "Analysis",
            "Problem-solving",
            "Time management",
          ],
          needsSkills: [
            "Advanced marketing",
            "Sales techniques",
            "Financial planning",
          ],
          developingSkills: ["Leadership", "Delegation", "Strategic planning"],
        },
        alternativeReasons: [
          "This business model offers similar income potential with different skill requirements",
          "Provides a good backup option if your primary choice faces challenges",
          "Could be combined with your main business for diversified income",
        ],
        avoidReasons: [
          "This model requires skills that don't align with your strengths",
          "The time commitment doesn't match your availability",
          "Risk level is higher than your comfort zone",
        ],
      };
    } catch (error) {
      console.error("Error generating extended insights:", error);
      return {
        ...basicInsights,
        strengthsWeaknesses: {
          strengths: [
            "Strong analytical thinking and problem-solving abilities",
            "High self-motivation and discipline",
            "Excellent communication skills",
            "Adaptable to new technologies and tools",
          ],
          weaknesses: [
            "May struggle with perfectionism and over-analysis",
            "Could benefit from more structured planning",
            "Might need to work on delegation skills",
            "Risk tolerance could be higher for faster growth",
          ],
        },
        whyThisFits: `${topPath.name} is your perfect match because it aligns with your analytical nature, allows for the flexibility you crave, and matches your income goals. Your strong communication skills and tech comfort make you well-suited for this path, while the scalability potential satisfies your growth ambitions.`,
        personalizedPros: [
          "Leverages your existing strengths in communication and analysis",
          "Provides the income potential you're seeking",
          "Offers flexibility that matches your lifestyle preferences",
          "Allows for gradual scaling as you build confidence",
        ],
        personalizedCons: [
          "May require pushing outside your comfort zone initially",
          "Income might be inconsistent in the early stages",
          "Requires consistent effort and self-discipline",
          "Could face increased competition as you scale",
        ],
        strugglesAndSolutions:
          "Based on your profile, you may struggle with perfectionism that delays launching. Combat this by setting 'good enough' standards and focusing on iteration over perfection. Your analytical nature might lead to over-research - set time limits for research phases and commit to action deadlines.",
        skillsAssessment: {
          hasSkills: [
            "Communication",
            "Analysis",
            "Problem-solving",
            "Time management",
          ],
          needsSkills: [
            "Advanced marketing",
            "Sales techniques",
            "Financial planning",
          ],
          developingSkills: ["Leadership", "Delegation", "Strategic planning"],
        },
        alternativeReasons: [
          "This business model offers similar income potential with different skill requirements",
          "Provides a good backup option if your primary choice faces challenges",
          "Could be combined with your main business for diversified income",
        ],
        avoidReasons: [
          "This model requires skills that don't align with your strengths",
          "The time commitment doesn't match your availability",
          "Risk level is higher than your comfort zone",
        ],
      };
    }
  };

  const generateFallbackInsights = (): AIInsights => {
    return {
      personalizedSummary: `Based on your comprehensive assessment, ${topPath.name} achieves a ${topPath.fitScore}% compatibility score with your unique profile.`,
      customRecommendations: [
        "Start with free tools to validate your concept",
        "Focus on building one core skill deeply",
        "Set realistic 90-day milestones",
        "Join online communities for support",
        "Create a dedicated workspace",
        "Track your time and energy patterns",
      ],
      potentialChallenges: [
        "Managing time effectively while building momentum",
        "Overcoming perfectionism that might delay progress",
        "Building confidence in your expertise",
        "Staying motivated during slow initial results",
      ],
      successStrategies: [
        "Leverage your analytical nature for data-driven decisions",
        "Use communication skills for strong customer relationships",
        "Focus on solving real problems for people",
        "Build systems early for scalability",
        "Invest in continuous learning",
        "Network strategically for partnerships",
      ],
      personalizedActionPlan: {
        week1: [
          "Research your chosen business model thoroughly",
          "Set up your workspace and basic tools",
          "Define your target market and ideal customer",
        ],
        month1: [
          "Launch your minimum viable offering",
          "Create basic marketing materials",
          "Reach out to potential customers",
          "Establish tracking systems",
        ],
        month3: [
          "Optimize based on feedback",
          "Scale marketing efforts",
          "Build strategic partnerships",
          "Develop delivery systems",
        ],
        month6: [
          "Analyze performance and growth opportunities",
          "Consider expanding offerings",
          "Build team or outsource tasks",
          "Plan next growth phase",
        ],
      },
      motivationalMessage:
        "Your unique combination of skills and strategic thinking creates the perfect foundation for entrepreneurial success.",
      strengthsWeaknesses: {
        strengths: [
          "Strong analytical and strategic thinking",
          "Excellent communication abilities",
          "High self-motivation and discipline",
          "Adaptable to new technologies",
        ],
        weaknesses: [
          "May overthink decisions",
          "Could benefit from more risk-taking",
          "Might need help with delegation",
          "Perfectionism could slow progress",
        ],
      },
      whyThisFits: `${topPath.name} perfectly matches your analytical nature, communication strengths, and income goals while providing the flexibility and growth potential you're seeking.`,
      personalizedPros: [
        "Aligns with your natural strengths",
        "Matches your income expectations",
        "Provides desired flexibility",
        "Offers scalability potential",
      ],
      personalizedCons: [
        "May require stepping outside comfort zone",
        "Income could be inconsistent initially",
        "Requires consistent self-discipline",
        "Competition may increase over time",
      ],
      strugglesAndSolutions:
        "You may struggle with perfectionism and over-analysis. Set clear deadlines for decisions and focus on 'good enough' to start, then iterate and improve.",
      skillsAssessment: {
        hasSkills: ["Communication", "Analysis", "Problem-solving"],
        needsSkills: ["Marketing", "Sales", "Financial planning"],
        developingSkills: ["Leadership", "Delegation", "Strategic planning"],
      },
      alternativeReasons: [
        "Offers similar income potential with different approach",
        "Good backup option for diversification",
        "Could complement your main business",
      ],
      avoidReasons: [
        "Doesn't align with your core strengths",
        "Time commitment doesn't match availability",
        "Risk level exceeds comfort zone",
      ],
    };
  };

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const handleLearnMoreAboutBusiness = (path: BusinessPath) => {
    navigate(`/business/${path.id}`);
  };

  const handleGetStarted = () => {
    navigate(`/business/${topPath.id}#get-started`);
  };

  // Email functionality
  const handleEmailResults = async () => {
    try {
      const subject = encodeURIComponent(
        `Your Complete Business Path Report - ${topPath.name}`,
      );
      const body = encodeURIComponent(
        `Hi there!\n\nYour complete business path analysis is ready!\n\nTop Match: ${topPath.name} (${topPath.fitScore}% fit)\n\nView your full report: ${window.location.href}\n\nBest regards,\nBusiness Path Team`,
      );

      window.location.href = `mailto:?subject=${subject}&body=${body}`;
      alert(
        "Email client opened! Your full report has been prepared for sending.",
      );
    } catch (error) {
      console.error("Error opening email client:", error);
      alert("Unable to open email client. Please copy the URL manually.");
    }
  };

  // Download functionality
  const handleDownloadResults = async () => {
    try {
      const reportText = `
COMPLETE BUSINESS PATH ANALYSIS REPORT
=====================================

Your Top Business Match: ${topPath.name}
Fit Score: ${topPath.fitScore}%
Difficulty: ${topPath.difficulty}
Time to Profit: ${topPath.timeToProfit}
Startup Cost: ${topPath.startupCost}
Potential Income: ${topPath.potentialIncome}

DETAILED DESCRIPTION:
${topPath.detailedDescription}

PERSONALITY ANALYSIS:
- Social Comfort: ${Math.round(traitScores.socialComfort * 100)}%
- Consistency: ${Math.round(traitScores.consistency * 100)}%
- Risk Tolerance: ${Math.round(traitScores.riskTolerance * 100)}%
- Tech Comfort: ${Math.round(traitScores.techComfort * 100)}%
- Motivation: ${Math.round(traitScores.motivation * 100)}%

TOP BENEFITS:
${topPath.pros.map((pro, i) => `${i + 1}. ${pro}`).join("\n")}

POTENTIAL CHALLENGES:
${topPath.cons.map((con, i) => `${i + 1}. ${con}`).join("\n")}

REQUIRED SKILLS:
${topPath.skills.join(", ")}

OTHER TOP MATCHES:
${allPaths
  .slice(1, 4)
  .map((path, i) => `${i + 2}. ${path.name} (${path.fitScore}% fit)`)
  .join("\n")}

Generated on: ${new Date().toLocaleDateString()}
Business Path Platform - Complete Analysis Report
      `;

      const blob = new Blob([reportText], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `complete-business-path-report-${topPath.name.toLowerCase().replace(/\s+/g, "-")}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert("Your complete report has been downloaded successfully!");
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Unable to download report. Please try again.");
    }
  };

  // Share functionality
  const handleShareResults = async () => {
    try {
      const shareData = {
        title: `My Complete Business Path Report - ${topPath.name}`,
        text: `I just got my complete business analysis! ${topPath.name} is a ${topPath.fitScore}% fit for my entrepreneurial goals.`,
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
        alert("Report shared successfully!");
      } else {
        const shareText = `${shareData.text}\n\nSee my complete report: ${shareData.url}`;
        await navigator.clipboard.writeText(shareText);
        alert("Share text copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing report:", error);

      const shareText = `Check out my complete business path report! ${topPath.name} is a ${topPath.fitScore}% fit for me. ${window.location.href}`;

      const shareModal = confirm(
        `Share your complete report?\n\nTwitter: Click OK to share on Twitter\nCancel: Copy link to clipboard`,
      );

      if (shareModal) {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(twitterUrl, "_blank");
      } else {
        try {
          await navigator.clipboard.writeText(shareText);
          alert("Share link copied to clipboard!");
        } catch (clipboardError) {
          alert("Unable to share. Please copy the URL manually.");
        }
      }
    }
  };

  // Toggle sidebar functionality
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation - Conditional rendering */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            className="w-64 bg-white shadow-lg fixed h-screen z-10 flex flex-col"
            initial={{ x: -256, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -256, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-6 border-b border-gray-200">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Results
              </button>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  Your Full Report
                </h2>
                <button
                  onClick={toggleSidebar}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                  aria-label="Hide menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <nav className="p-4 flex-1 overflow-y-auto pb-20">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg mb-2 transition-colors ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <IconComponent className="h-5 w-5 mr-3" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hamburger Menu Button when sidebar is hidden */}
      {!showSidebar && (
        <motion.button
          onClick={toggleSidebar}
          className="fixed top-24 left-6 z-20 bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50 transition-all duration-300 hover:shadow-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Show menu"
        >
          <div className="flex flex-col space-y-1">
            <div className="w-5 h-0.5 bg-gray-600"></div>
            <div className="w-5 h-0.5 bg-gray-600"></div>
            <div className="w-5 h-0.5 bg-gray-600"></div>
          </div>
        </motion.button>
      )}

      {/* Main Content */}
      <div
        className={`${showSidebar ? "ml-64" : "ml-0"} flex-1 transition-all duration-300`}
      >
        {/* Welcome Section - Increased top padding */}
        <section
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 text-white"
          style={{ paddingTop: "10vh", paddingBottom: "15vh" }}
        >
          <div className="text-center max-w-4xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Award className="h-12 w-12 text-white" />
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Welcome to Your Full Report!
              </h1>

              <p className="text-xl md:text-2xl text-blue-100 mb-16 leading-relaxed">
                Your personalized business blueprint is ready. Discover your
                AI-powered analysis, personality insights, and complete roadmap
                to success.
              </p>
            </motion.div>
          </div>
        </section>

        {/* AI Report Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Your AI-Generated Analysis
              </h2>
              <p className="text-xl text-gray-600">
                Personalized insights based on your unique profile
              </p>
            </div>
            {/* Personality Sliders */}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl
            p-8 mb-16"
            <div
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 mb-16"
              id="personality"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Your Personality Snapshot
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                {traitSliders.map((slider, index) => (
                  <TraitSlider
                    key={index}
                    label={slider.label}
                    value={traitScores[slider.trait]}
                    leftLabel={slider.leftLabel}
                    rightLabel={slider.rightLabel}
                  />
                ))}
              </div>
            </div>
            {/* Together, these traits heading */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">
                Together, these traits make you best suited for {topPath.name}.
              </h3>
            </div>
            {/* Why This Business Model Fits */}
            {aiInsights && (
              <div className="bg-blue-50 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Why {topPath.name} Is Best For You
                </h3>
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p>{aiInsights.whyThisFits}</p>
                </div>
              </div>
            )}
            {/* Get Started Button */}
            <div className="text-center mb-16">
              <button
                onClick={handleGetStarted}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center mx-auto"
              >
                <Rocket className="h-5 w-5 mr-3" />
                Get Started with {topPath.name}
                <ArrowRight className="ml-3 h-5 w-5" />
              </button>
            </div>
            {/* Strengths and Weaknesses */}
            {aiInsights && (
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="bg-green-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                    <CheckCircle className="h-6 w-6 mr-3" />
                    Your Strengths
                  </h3>
                  <ul className="space-y-3">
                    {aiInsights.strengthsWeaknesses.strengths.map(
                      (strength, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-green-700">{strength}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                <div className="bg-orange-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-orange-800 mb-6 flex items-center">
                    <AlertTriangle className="h-6 w-6 mr-3" />
                    Areas to Develop
                  </h3>
                  <ul className="space-y-3">
                    {aiInsights.strengthsWeaknesses.weaknesses.map(
                      (weakness, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-orange-700">{weakness}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Business Overview Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center">
              {topPath.name} Deep Dive
            </h2>

            {/* Income Graph and Description */}
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div>
                <IncomeGraph businessModel={topPath.name} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  About {topPath.name}
                </h3>
                <div className="prose prose-lg text-gray-700">
                  <p>{topPath.detailedDescription}</p>
                </div>
              </div>
            </div>

            {/* Market Size and Scalability */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Globe className="h-6 w-6 mr-3 text-blue-600" />
                  Current Market Size
                </h3>
                <p className="text-gray-700">{topPath.marketSize}</p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-3 text-green-600" />
                  Scalability Indicator
                </h3>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-3 mr-4">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                      style={{
                        width:
                          topPath.difficulty === "Easy"
                            ? "90%"
                            : topPath.difficulty === "Medium"
                              ? "70%"
                              : "50%",
                      }}
                    />
                  </div>
                  <span className="font-medium text-gray-900">High</span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6 mb-16">
              {[
                {
                  icon: Clock,
                  title: "Time to Start",
                  value: topPath.timeToProfit,
                  color: "blue",
                },
                {
                  icon: DollarSign,
                  title: "Initial Investment",
                  value: topPath.startupCost,
                  color: "green",
                },
                {
                  icon: TrendingUp,
                  title: "Potential Income",
                  value: topPath.potentialIncome,
                  color: "purple",
                },
                {
                  icon: Zap,
                  title: "Time Commitment",
                  value: "15-30 hrs/week",
                  color: "orange",
                },
              ].map((metric, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg text-center"
                >
                  <div
                    className={`w-12 h-12 bg-${metric.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <metric.icon
                      className={`h-6 w-6 text-${metric.color}-600`}
                    />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {metric.title}
                  </h4>
                  <p className="text-gray-700 font-medium">{metric.value}</p>
                </div>
              ))}
            </div>

            {/* Personalized Pros and Cons */}
            {aiInsights && (
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
                    Why This Works For You
                  </h3>
                  <ul className="space-y-3">
                    {aiInsights.personalizedPros.map((pro, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <AlertTriangle className="h-6 w-6 mr-3 text-orange-600" />
                    Potential Challenges
                  </h3>
                  <ul className="space-y-3">
                    {aiInsights.personalizedCons.map((con, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Struggles and Solutions */}
            {aiInsights && (
              <div className="bg-yellow-50 rounded-2xl p-8 mb-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Challenges You May Face
                </h3>
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p>{aiInsights.strugglesAndSolutions}</p>
                </div>
              </div>
            )}

            {/* Skills Assessment */}
            {aiInsights && (
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Required Skills Assessment
                </h3>
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-4">
                      ✅ Skills You Have
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {aiInsights.skillsAssessment.hasSkills.map(
                        (skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-4">
                      🔄 Skills to Develop
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {aiInsights.skillsAssessment.developingSkills.map(
                        (skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-800 mb-4">
                      📚 Skills to Learn
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {aiInsights.skillsAssessment.needsSkills.map(
                        (skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Get Started Button */}
            <div className="text-center">
              <a
                href="#getting-started"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Let's Get Started
                <ArrowRight className="ml-3 h-6 w-6" />
              </a>
            </div>
          </div>
        </section>

        {/* Alternatives Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Best Other Options */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Your Best Other Options
                </h2>
                <div className="space-y-8">
                  {otherBestPaths.map((path, index) => (
                    <div key={path.id} className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {path.name}
                          </h3>
                          <div className="text-blue-600 font-semibold mb-3">
                            {path.fitScore}% Match
                          </div>
                          <p className="text-gray-600 mb-4">
                            {path.description}
                          </p>
                        </div>
                      </div>
                      {aiInsights && (
                        <div className="bg-white rounded-lg p-4 mb-4">
                          <p className="text-gray-700 text-sm">
                            This business model is your{" "}
                            {index === 0
                              ? "second"
                              : index === 1
                                ? "third"
                                : "fourth"}{" "}
                            best fit after {topPath.name}.{" "}
                            {aiInsights.alternativeReasons[0]}
                          </p>
                        </div>
                      )}
                      <button
                        onClick={() => handleLearnMoreAboutBusiness(path)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                      >
                        Learn more about {path.name} for you
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* What to Avoid */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  What You Shouldn't Choose
                </h2>

                <div className="space-y-8">
                  {worstPaths.map((path, index) => (
                    <div key={path.id} className="bg-red-50 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {path.name}
                          </h3>
                          <div className="text-red-600 font-semibold mb-3">
                            {path.fitScore}% Match
                          </div>
                          <p className="text-gray-600 mb-4">
                            {path.description}
                          </p>
                        </div>
                      </div>
                      {aiInsights && (
                        <div className="bg-white rounded-lg p-4 mb-4">
                          <p className="text-gray-700 text-sm">
                            You should avoid this business model because{" "}
                            {aiInsights.avoidReasons[0]}
                          </p>
                        </div>
                      )}
                      <button
                        onClick={() => handleLearnMoreAboutBusiness(path)}
                        className="text-red-600 hover:text-red-800 font-medium flex items-center"
                      >
                        Learn why to avoid {path.name}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Actions Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Take Action on Your Results
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Your personalized business blueprint is complete. Now it's time to
              turn insights into action.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <button
                onClick={handleDownloadResults}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Download className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">
                  Download as PDF
                </h3>
                <p className="text-gray-600 text-sm">
                  Get your complete report as a PDF for offline reference
                </p>
              </button>

              <button
                onClick={handleEmailResults}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Mail className="h-8 w-8 text-green-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">
                  Email My Results
                </h3>
                <p className="text-gray-600 text-sm">
                  Send this report to your email for easy access
                </p>
              </button>

              <button
                onClick={handleShareResults}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Share2 className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">
                  Share My Results
                </h3>
                <p className="text-gray-600 text-sm">
                  Share your business match with friends and mentors
                </p>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Helper functions to calculate trait scores
function calculateSocialComfort(data: QuizData): number {
  let score = 0.5;
  if (data.directCommunicationEnjoyment)
    score = (data.directCommunicationEnjoyment - 1) / 4;
  if (data.brandFaceComfort)
    score = Math.max(score, (data.brandFaceComfort - 1) / 4);
  return Math.max(0, Math.min(1, score));
}

function calculateConsistency(data: QuizData): number {
  if (data.longTermConsistency) return (data.longTermConsistency - 1) / 4;
  if (data.selfMotivationLevel) return (data.selfMotivationLevel - 1) / 4;
  return 0.5;
}

function calculateRiskTolerance(data: QuizData): number {
  if (data.riskComfortLevel) return (data.riskComfortLevel - 1) / 4;
  return 0.5;
}

function calculateTechComfort(data: QuizData): number {
  if (data.techSkillsRating) return (data.techSkillsRating - 1) / 4;
  return 0.5;
}

function calculateMotivation(data: QuizData): number {
  if (data.selfMotivationLevel) return (data.selfMotivationLevel - 1) / 4;
  return 0.5;
}

function calculateFeedbackResilience(data: QuizData): number {
  if (data.feedbackRejectionResponse)
    return (data.feedbackRejectionResponse - 1) / 4;
  return 0.5;
}

function calculateStructurePreference(data: QuizData): number {
  let score = 0.5;
  if (data.workStructurePreference === "clear-steps") score = 0.9;
  else if (data.workStructurePreference === "some-structure") score = 0.7;
  else if (data.workStructurePreference === "mostly-flexible") score = 0.3;
  else if (data.workStructurePreference === "total-freedom") score = 0.1;
  return 1 - score; // Invert so high score means works freely
}

function calculateCreativity(data: QuizData): number {
  if (data.creativeWorkEnjoyment) return (data.creativeWorkEnjoyment - 1) / 4;
  return 0.5;
}

function calculateCommunicationConfidence(data: QuizData): number {
  let score = 0.5;
  if (data.directCommunicationEnjoyment)
    score = (data.directCommunicationEnjoyment - 1) / 4;
  if (data.brandFaceComfort)
    score = Math.max(score, (data.brandFaceComfort - 1) / 4);
  return score;
}

export default FullReport;
