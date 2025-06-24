import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  TrendingUp,
  Zap,
  Users,
  Package,
  CheckCircle,
  AlertTriangle,
  Star,
  Target,
  Lightbulb,
  ArrowRight,
  FileText,
  Award,
  Menu,
  X,
} from "lucide-react";
import { QuizData, BusinessPath } from "../types";
import { businessPaths } from "../data/businessPaths";
import { generatePersonalizedPaths } from "../utils/quizLogic";
import { AIService } from "../utils/aiService";
import Header from "./Header";
import Footer from "./Footer";

interface BusinessModelDetailProps {
  quizData?: QuizData | null;
}

interface IncomeDistributionGraphProps {
  businessModel: string;
}

interface AIPersonalizedAnalysis {
  fitDescription: string;
  personalizedPros: string[];
  personalizedCons: string[];
  strugglesAndSolutions: string;
  skillsAssessment: {
    hasSkills: string[];
    needsSkills: string[];
    developingSkills: string[];
  };
}

const IncomeDistributionGraph: React.FC<IncomeDistributionGraphProps> = ({ businessModel }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 600, height: 300 });
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newWidth = Math.max(400, Math.min(800, containerWidth - 48));
        const newHeight = Math.max(250, newWidth * 0.375);
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
    const percentage = x / dimensions.width;
    const minIncome = 0;
    const maxIncome = 25000;
    
    const income = minIncome + (maxIncome - minIncome) * Math.pow(percentage, 1.8);
    return Math.round(income);
  };

  const getCurveY = (x: number) => {
    const center = dimensions.width * 0.4;
    const width = dimensions.width * 0.25;
    const height = dimensions.height * 0.5;
    const baseY = dimensions.height * 0.75;
    
    const bellValue = Math.exp(-Math.pow(x - center, 2) / (2 * Math.pow(width, 2)));
    return baseY - (height * bellValue);
  };

  const generateCurvePath = () => {
    const points = [];
    const step = dimensions.width / 100;
    
    for (let x = 0; x <= dimensions.width; x += step) {
      points.push(`${x},${getCurveY(x)}`);
    }
    
    return `M ${points.join(' L ')}`;
  };

  const generateAreaPath = () => {
    const points = [];
    const step = dimensions.width / 100;
    const baseY = dimensions.height * 0.75;
    
    points.push(`0,${baseY}`);
    
    for (let x = 0; x <= dimensions.width; x += step) {
      points.push(`${x},${getCurveY(x)}`);
    }
    
    points.push(`${dimensions.width},${baseY}`);
    points.push(`0,${baseY}`);
    
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

          <path
            d={generateAreaPath()}
            fill="url(#incomeDistributionGradient)"
          />

          <path
            d={generateCurvePath()}
            fill="none"
            stroke="url(#curveGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {isHovering && (
            <>
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

        {isHovering && (
          <div
            className="absolute bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium pointer-events-none z-10 shadow-xl border border-gray-700"
            style={{
              left: tooltipPos.left,
              top: tooltipPos.top,
              transform: 'translateZ(0)',
            }}
          >
            {formatIncome(getIncomeAtPosition(mousePosition.x))}/month
          </div>
        )}
      </div>
    </div>
  );
};

const BusinessModelDetail: React.FC<BusinessModelDetailProps> = ({
  quizData,
}) => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [businessPath, setBusinessPath] = useState<BusinessPath | null>(null);
  const [personalizedPaths, setPersonalizedPaths] = useState<BusinessPath[]>(
    [],
  );
  const [aiAnalysis, setAiAnalysis] = useState<AIPersonalizedAnalysis | null>(
    null,
  );
  const [isGeneratingAI, setIsGeneratingAI] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (!businessId) return;

    const foundPath = businessPaths.find((path) => path.id === businessId);
    if (!foundPath) {
      navigate("/explore");
      return;
    }

    setBusinessPath(foundPath);

    if (quizData) {
      const paths = generatePersonalizedPaths(quizData);
      setPersonalizedPaths(paths);
      generateAIAnalysis(quizData, foundPath);
    } else {
      setIsGeneratingAI(false);
    }
  }, [businessId, quizData, navigate]);

  const generateAIAnalysis = async (data: QuizData, path: BusinessPath) => {
    try {
      setIsGeneratingAI(true);
      const aiService = AIService.getInstance();

      const fitDescription = await generateFitDescription(data, path);
      const { personalizedPros, personalizedCons } =
        await generatePersonalizedProsAndCons(data, path);
      const strugglesAndSolutions = await generateStrugglesAndSolutions(
        data,
        path,
      );
      const skillsAssessment = await generateSkillsAssessment(data, path);

      setAiAnalysis({
        fitDescription,
        personalizedPros,
        personalizedCons,
        strugglesAndSolutions,
        skillsAssessment,
      });
    } catch (error) {
      console.error("Error generating AI analysis:", error);
      setAiAnalysis(generateFallbackAnalysis(path));
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generateFitDescription = async (
    data: QuizData,
    path: BusinessPath,
  ): Promise<string> => {
    const prompt = `Based on this user's quiz responses, explain in one comprehensive paragraph why ${path.name} is a good fit for them. Consider their goals, personality, and preferences.

User Profile:
- Income Goal: $${data.successIncomeGoal}/month
- Time Commitment: ${data.weeklyTimeCommitment} hours/week
- Risk Tolerance: ${data.riskComfortLevel}/5
- Tech Skills: ${data.techSkillsRating}/5
- Communication Comfort: ${data.directCommunicationEnjoyment}/5
- Creative Enjoyment: ${data.creativeWorkEnjoyment}/5
- Self Motivation: ${data.selfMotivationLevel}/5

Write a personalized explanation of why this business model fits their specific profile.`;

    try {
      const aiService = AIService.getInstance();
      const response = await (aiService as any).makeOpenAIRequest(
        prompt,
        300,
        0.7,
      );
      return response || generateFallbackFitDescription(path);
    } catch (error) {
      return generateFallbackFitDescription(path);
    }
  };

  const generatePersonalizedProsAndCons = async (
    data: QuizData,
    path: BusinessPath,
  ): Promise<{ personalizedPros: string[]; personalizedCons: string[] }> => {
    const prompt = `Based on this user's quiz responses and the business model ${path.name}, generate 4 personalized pros and 3 personalized cons that are specific to their profile.

User Profile:
- Income Goal: $${data.successIncomeGoal}/month
- Time Commitment: ${data.weeklyTimeCommitment} hours/week
- Risk Tolerance: ${data.riskComfortLevel}/5
- Tech Skills: ${data.techSkillsRating}/5
- Communication Comfort: ${data.directCommunicationEnjoyment}/5
- Work Structure Preference: ${data.workStructurePreference}
- Learning Preference: ${data.learningPreference}

Format as:
PROS:
- Pro 1
- Pro 2
- Pro 3
- Pro 4

CONS:
- Con 1
- Con 2
- Con 3`;

    try {
      const aiService = AIService.getInstance();
      const response = await (aiService as any).makeOpenAIRequest(
        prompt,
        400,
        0.7,
      );
      return parseProsCons(response);
    } catch (error) {
      return generateFallbackProsCons(path);
    }
  };

  const generateStrugglesAndSolutions = async (
    data: QuizData,
    path: BusinessPath,
  ): Promise<string> => {
    const prompt = `Based on this user's profile, identify 6 specific challenges they'll face with ${path.name}. Format as bullet points without periods at the end.

User Profile:
- Self Motivation: ${data.selfMotivationLevel}/5
- Tech Skills: ${data.techSkillsRating}/5
- Risk Tolerance: ${data.riskComfortLevel}/5
- Time Commitment: ${data.weeklyTimeCommitment} hours/week
- Learning Preference: ${data.learningPreference}

Generate 6 bullet points, each one sentence without periods. Focus on their specific weaknesses and challenges they'll face.

Format as:
- Challenge 1 without period
- Challenge 2 without period
- Challenge 3 without period
- Challenge 4 without period
- Challenge 5 without period
- Challenge 6 without period`;

    try {
      const aiService = AIService.getInstance();
      const response = await (aiService as any).makeOpenAIRequest(
        prompt,
        400,
        0.7,
      );
      return response || generateFallbackStruggles(path);
    } catch (error) {
      return generateFallbackStruggles(path);
    }
  };

  const generateSkillsAssessment = async (
    data: QuizData,
    path: BusinessPath,
  ): Promise<{
    hasSkills: string[];
    needsSkills: string[];
    developingSkills: string[];
  }> => {
    const requiredSkills = path.skills || [];

    const hasSkills: string[] = [];
    const needsSkills: string[] = [];
    const developingSkills: string[] = [];

    requiredSkills.forEach((skill) => {
      const skillLower = skill.toLowerCase();

      if (
        skillLower.includes("communication") &&
        data.directCommunicationEnjoyment >= 4
      ) {
        hasSkills.push(skill);
      } else if (
        skillLower.includes("creative") &&
        data.creativeWorkEnjoyment >= 4
      ) {
        hasSkills.push(skill);
      } else if (skillLower.includes("tech") && data.techSkillsRating >= 4) {
        hasSkills.push(skill);
      } else if (
        skillLower.includes("organization") &&
        data.organizationLevel >= 4
      ) {
        hasSkills.push(skill);
      } else if (data.techSkillsRating >= 3 || data.selfMotivationLevel >= 3) {
        developingSkills.push(skill);
      } else {
        needsSkills.push(skill);
      }
    });

    return { hasSkills, needsSkills, developingSkills };
  };

  const parseProsCons = (
    response: string,
  ): { personalizedPros: string[]; personalizedCons: string[] } => {
    const lines = response
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    const pros: string[] = [];
    const cons: string[] = [];
    let currentSection = "";

    for (const line of lines) {
      if (line.toUpperCase().includes("PROS:")) {
        currentSection = "pros";
      } else if (line.toUpperCase().includes("CONS:")) {
        currentSection = "cons";
      } else if (line.startsWith("-") || line.startsWith("•")) {
        const item = line.replace(/^[-•]\s*/, "").trim();
        if (item.length > 10) {
          if (currentSection === "pros") {
            pros.push(item);
          } else if (currentSection === "cons") {
            cons.push(item);
          }
        }
      }
    }

    return {
      personalizedPros:
        pros.length > 0
          ? pros
          : generateFallbackProsCons(businessPath!).personalizedPros,
      personalizedCons:
        cons.length > 0
          ? cons
          : generateFallbackProsCons(businessPath!).personalizedCons,
    };
  };

  const generateFallbackAnalysis = (
    path: BusinessPath,
  ): AIPersonalizedAnalysis => {
    return {
      fitDescription: generateFallbackFitDescription(path),
      ...generateFallbackProsCons(path),
      strugglesAndSolutions: generateFallbackStruggles(path),
      skillsAssessment: {
        hasSkills: path.skills?.slice(0, 2) || ["Basic skills"],
        needsSkills: path.skills?.slice(2, 4) || ["Advanced skills"],
        developingSkills: path.skills?.slice(4, 6) || ["Intermediate skills"],
      },
    };
  };

  const generateFallbackFitDescription = (path: BusinessPath): string => {
    return `${path.name} aligns well with your goals and preferences based on your quiz responses. This business model offers the right balance of challenge and opportunity for your current situation, with income potential that matches your expectations and time requirements that fit your availability.`;
  };

  const generateFallbackProsCons = (
    path: BusinessPath,
  ): { personalizedPros: string[]; personalizedCons: string[] } => {
    return {
      personalizedPros: [
        "Matches your income goals and timeline expectations",
        "Aligns with your preferred work style and schedule",
        "Leverages your existing strengths and interests",
        "Provides growth opportunities in your comfort zone",
      ],
      personalizedCons: [
        "May require developing new skills outside your comfort zone",
        "Income might be inconsistent in the early stages",
        "Requires consistent effort and self-discipline",
      ],
    };
  };

  const generateFallbackStruggles = (path: BusinessPath): string => {
    return `- Building consistent daily habits and routines for long-term success
- Managing time effectively between learning new skills and executing tasks
- Staying motivated during slow periods when results aren't immediately visible
- Overcoming perfectionism that might delay launching your first offerings
- Building confidence to position yourself as an expert in your chosen field
- Balancing multiple priorities while maintaining focus on core business activities`;
  };

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    closeSidebar(); // Close sidebar when section is clicked
    
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const targetY = absoluteElementTop - headerOffset;
      
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    }
  };

  const handleBackClick = () => {
    closeSidebar(); // Close sidebar when back is clicked
    navigate(-1);
  };

  const sections = [
    { id: "overview", label: `${businessPath?.name} Overview` },
    { id: "personalized-report", label: "Personalized Report" },
    { id: "getting-started", label: "Getting Started" },
  ];

  if (!businessPath) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Business Model Not Found
            </h1>
            <button
              onClick={() => navigate("/explore")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Back to Explorer
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Take the Quiz First
            </h2>
            <p className="text-gray-600 mb-6">
              To access personalized insights about {businessPath.name}, you need
              to complete our business path quiz first.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/quiz")}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Take the Quiz
              </button>
              <button
                onClick={() => navigate("/explore")}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Back to Explorer
              </button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const userFitScore =
    personalizedPaths.find((p) => p.id === businessPath.id)?.fitScore || 0;
  const getFitLevel = (score: number) => {
    if (score >= 80)
      return {
        level: "Best Fit",
        color: "green",
        description:
          "This business model is an excellent match for your profile.",
      };
    if (score >= 65)
      return {
        level: "Strong Fit",
        color: "blue",
        description:
          "This business model aligns well with your goals and preferences.",
      };
    if (score >= 50)
      return {
        level: "Possible Fit",
        color: "yellow",
        description: "This business model could work with some adjustments.",
      };
    return {
      level: "Poor Fit",
      color: "red",
      description:
        "This business model may not be ideal for your current situation.",
    };
  };

  const fitLevel = getFitLevel(userFitScore);

  const getBusinessDescription = (path: BusinessPath) => {
    const paragraphs = [
      path.detailedDescription,
      `This business model typically requires ${path.startupCost} to get started and can potentially generate ${path.potentialIncome} in income. Most entrepreneurs see their first profits within ${path.timeToProfit}, making it ${path.difficulty.toLowerCase()} to launch compared to other business models. The scalability is considered high, meaning your income potential can grow significantly as you develop your skills and expand your operations.`,
      `Success in ${path.name} depends heavily on your ability to adapt to market changes and consistently deliver value to your target audience. The most successful entrepreneurs in this field focus on building strong systems, maintaining excellent customer relationships, and continuously improving their offerings based on feedback and market demands.`
    ];
    return paragraphs;
  };

  const parseStruggles = (strugglesText: string): string[] => {
    const lines = strugglesText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^[-•*]\s*/, '').replace(/\.$/, ''))
      .filter(line => line.length > 10);
    
    const struggles = lines.slice(0, 6);
    while (struggles.length < 6) {
      const fallbackStruggles = [
        "Building consistent daily habits and routines for long-term success",
        "Managing time effectively between learning new skills and executing tasks",
        "Staying motivated during slow periods when results aren't immediately visible",
        "Overcoming perfectionism that might delay launching your first offerings",
        "Building confidence to position yourself as an expert in your chosen field",
        "Balancing multiple priorities while maintaining focus on core business activities"
      ];
      struggles.push(fallbackStruggles[struggles.length]);
    }
    
    return struggles;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        {/* Hamburger Menu Button */}
        <button
          onClick={toggleSidebar}
          className="fixed top-20 left-4 z-50 bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50 transition-all duration-300 transform hover:scale-110"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>

        {/* Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-30"
              onClick={closeSidebar}
            />
          )}
        </AnimatePresence>

        {/* Sidebar Navigation */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: isSidebarOpen ? 0 : '-100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-64 bg-white shadow-lg fixed h-full z-40 flex flex-col transform transition-transform duration-300 ease-in-out"
          style={{ top: '64px', height: 'calc(100vh - 64px)' }}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleBackClick}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
              <button
                onClick={closeSidebar}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Navigation</h2>
          </div>

          <nav className="p-4 flex-1 overflow-y-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
                  activeSection === section.id
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-6xl mx-auto px-8 py-12">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                How {businessPath.name} Works for You
              </h1>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </motion.div>

            {/* Overview Section */}
            <section id="overview" className="mb-16">
              <div className="space-y-8 mb-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    About {businessPath.name}
                  </h3>
                  <div className="prose prose-lg text-gray-700 space-y-4">
                    {getBusinessDescription(businessPath).map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <IncomeDistributionGraph businessModel={businessPath.name} />
                </div>
              </div>

              {/* Market Size and Scalability */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="h-6 w-6 mr-3 text-blue-600" />
                    Current Market Size
                  </h3>
                  <p className="text-gray-700">{businessPath.marketSize}</p>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Target className="h-6 w-6 mr-3 text-green-600" />
                    Scalability Indicator
                  </h3>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-3 mr-4">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                        style={{
                          width:
                            businessPath.difficulty === "Easy"
                              ? "90%"
                              : businessPath.difficulty === "Medium"
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
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                {[
                  {
                    icon: Clock,
                    title: "Time to Start",
                    value: businessPath.timeToProfit,
                    color: "blue",
                  },
                  {
                    icon: DollarSign,
                    title: "Initial Investment",
                    value: businessPath.startupCost,
                    color: "green",
                  },
                  {
                    icon: TrendingUp,
                    title: "Potential Income",
                    value: businessPath.potentialIncome,
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

              {/* Who is this for */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Users className="h-6 w-6 mr-3 text-blue-600" />
                  Who Is This For?
                </h3>
                <div className="prose prose-lg text-gray-700">
                  <p>
                    This business model is ideal for{" "}
                    {businessPath.bestFitPersonality?.join(", ").toLowerCase()}{" "}
                    individuals who are looking to build a sustainable income
                    stream.
                  </p>
                </div>
              </div>

              {/* Tools */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Package className="h-6 w-6 mr-3 text-purple-600" />
                  Tools You'll Use
                </h3>
                <div className="flex flex-wrap gap-3">
                  {businessPath.tools.map((tool, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pros and Cons */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
                    Pros
                  </h3>
                  <ul className="space-y-3">
                    {businessPath.pros.map((pro, index) => (
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
                    Cons
                  </h3>
                  <ul className="space-y-3">
                    {businessPath.cons.map((con, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Personalized Report Section */}
            <section id="personalized-report" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                How This Business Model Fits You
              </h2>

              {/* Merged Fit Assessment and AI Analysis */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Is This Model a Good Fit For You?
                </h3>
                <div className="flex items-center mb-4">
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-bold ${
                      fitLevel.color === "green"
                        ? "bg-green-100 text-green-800"
                        : fitLevel.color === "blue"
                          ? "bg-blue-100 text-blue-800"
                          : fitLevel.color === "yellow"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {userFitScore}% - {fitLevel.level}
                  </div>
                </div>
                
                {isGeneratingAI ? (
                  <div className="animate-pulse">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ) : (
                  aiAnalysis && (
                    <div className="prose prose-lg text-gray-700 space-y-4">
                      <p>{fitLevel.description}</p>
                      <p>{aiAnalysis.fitDescription}</p>
                      <p>Based on your comprehensive assessment, this business model offers excellent alignment with your goals, personality traits, and available resources. Your unique combination of skills and preferences creates natural advantages that can be leveraged for success in this field.</p>
                    </div>
                  )
                )}
              </div>

              {/* Personalized Pros and Cons */}
              {aiAnalysis && (
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
                      Why This Works For You
                    </h3>
                    <ul className="space-y-3">
                      {aiAnalysis.personalizedPros.map((pro, index) => (
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
                      {aiAnalysis.personalizedCons.map((con, index) => (
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
              {aiAnalysis && (
                <div className="relative bg-white rounded-2xl p-8 mb-8 shadow-lg">
                  <div className="absolute inset-0 rounded-2xl p-1 bg-gradient-to-r from-blue-500 to-purple-600">
                    <div className="bg-white rounded-2xl h-full w-full"></div>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Things You'll Struggle With
                    </h3>
                    <ul className="space-y-3">
                      {parseStruggles(aiAnalysis.strugglesAndSolutions).map((struggle, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">{struggle}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Skills Assessment */}
              {aiAnalysis && (
                <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">
                    Required Skills Assessment
                  </h3>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
                      <h4 className="font-semibold text-green-800 mb-4">
                        ✅ Skills You Have
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.skillsAssessment.hasSkills.map(
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
                        {aiAnalysis.skillsAssessment.developingSkills.map(
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
                        {aiAnalysis.skillsAssessment.needsSkills.map(
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
            </section>

            {/* Getting Started Section */}
            <section id="getting-started" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Getting Started
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Now that you've decided on {businessPath.name}, here are your next
                steps!
              </p>

              {/* Step-by-Step Launch Plan */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Step-by-Step Launch Plan
                </h3>
                <div className="space-y-4">
                  {businessPath.actionPlan.phase1.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0 font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Resources to Get Started
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-4">
                      🆓 Free Resources
                    </h4>
                    <ul className="space-y-2">
                      {businessPath.resources.learning
                        .filter(
                          (resource) =>
                            resource.includes("Free") ||
                            resource.includes("YouTube"),
                        )
                        .map((resource, index) => (
                          <li key={index} className="text-gray-700">
                            • {resource}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-4">
                      💰 Paid Resources
                    </h4>
                    <ul className="space-y-2">
                      {businessPath.resources.learning
                        .filter(
                          (resource) =>
                            !resource.includes("Free") &&
                            !resource.includes("YouTube"),
                        )
                        .map((resource, index) => (
                          <li key={index} className="text-gray-700">
                            • {resource}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Mistakes to Avoid */}
              <div className="relative bg-white rounded-2xl p-8 shadow-lg mb-8">
                <div className="absolute inset-0 rounded-2xl p-1 bg-gradient-to-r from-red-500 to-orange-500">
                  <div className="bg-white rounded-2xl h-full w-full"></div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Mistakes to Avoid
                  </h3>
                  <ul className="space-y-3">
                    {businessPath.userStruggles.map((mistake, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* View Full Report Button */}
              <div className="text-center mb-8">
                <button
                  onClick={() => navigate("/results")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center mx-auto"
                >
                  <FileText className="h-5 w-5 mr-3" />
                  View Full Report
                  <ArrowRight className="ml-3 h-5 w-5" />
                </button>
              </div>

              {/* Success Banner */}
              <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-center text-white">
                <div className="flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 mr-3" />
                  <h3 className="text-2xl font-bold">
                    Good Luck on Your Journey to Wealth!
                  </h3>
                </div>
                <p className="text-lg opacity-90">
                  You have everything you need to succeed. Take action, stay
                  consistent, and watch your business grow!
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BusinessModelDetail;