import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { QuizData, BusinessPath } from "../types";
import { businessPaths } from "../data/businessPaths";
import { generatePersonalizedPaths } from "../utils/quizLogic";
import { AIService } from "../utils/aiService";

interface BusinessModelDetailProps {
  quizData?: QuizData | null;
}

interface IncomeGraphProps {
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

const IncomeGraph: React.FC<IncomeGraphProps> = ({ businessModel }) => {
  const [mousePosition, setMousePosition] = useState({ x: 200, y: 150 });
  const [isHovering, setIsHovering] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Income data points for the curve
  const incomeData = [
    { month: 0, income: 0 },
    { month: 3, income: 500 },
    { month: 6, income: 2000 },
    { month: 12, income: 8000 },
    { month: 18, income: 15000 },
    { month: 24, income: 25000 },
  ];

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(400, event.clientX - rect.left));
      const y = event.clientY - rect.top;
      setMousePosition({ x, y });
    }
  };

  const getIncomeAtPosition = (x: number) => {
    const percentage = x / 400;
    const maxIncome = 25000;
    const income = Math.round(maxIncome * Math.pow(percentage, 1.2));
    return Math.max(0, income);
  };

  const getCurveY = (x: number) => {
    const percentage = x / 400;
    return 250 - 200 * Math.pow(percentage, 1.2);
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
            <linearGradient
              id="incomeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06d6a0" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Income curve */}
          <path
            d="M 0 250 Q 100 220 200 150 Q 300 80 400 50"
            fill="none"
            stroke="url(#incomeGradient)"
            strokeWidth="3"
          />

          {/* Interactive elements */}
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
                cy={getCurveY(mousePosition.x)}
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
              left: Math.min(mousePosition.x + 10, 300),
              top: getCurveY(mousePosition.x) - 40,
            }}
          >
            ${getIncomeAtPosition(mousePosition.x).toLocaleString()}/month
          </div>
        )}

        {/* Axis labels */}
        <div className="absolute bottom-2 left-0 text-xs text-gray-500">
          Month 0
        </div>
        <div className="absolute bottom-2 right-0 text-xs text-gray-500">
          Month 24
        </div>
        <div className="absolute top-2 left-0 text-xs text-gray-500">$25K</div>
        <div className="absolute bottom-2 left-0 text-xs text-gray-500 mt-4">
          $0
        </div>
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

  // Check if user came from "get started" link
  const shouldScrollToGetStarted = location.hash === "#get-started";

  useEffect(() => {
    if (!businessId) return;

    // Find the business path
    const foundPath = businessPaths.find((path) => path.id === businessId);
    if (!foundPath) {
      navigate("/explore");
      return;
    }

    setBusinessPath(foundPath);

    // If user has quiz data, generate personalized analysis
    if (quizData) {
      const paths = generatePersonalizedPaths(quizData);
      setPersonalizedPaths(paths);
      generateAIAnalysis(quizData, foundPath);
    } else {
      setIsGeneratingAI(false);
    }
  }, [businessId, quizData, navigate]);

  // Remove scroll behavior - navigation should start at top

  const generateAIAnalysis = async (data: QuizData, path: BusinessPath) => {
    try {
      setIsGeneratingAI(true);
      const aiService = AIService.getInstance();

      // Generate personalized fit description
      const fitDescription = await generateFitDescription(data, path);

      // Generate personalized pros/cons
      const { personalizedPros, personalizedCons } =
        await generatePersonalizedProsAndCons(data, path);

      // Generate struggles and solutions
      const strugglesAndSolutions = await generateStrugglesAndSolutions(
        data,
        path,
      );

      // Generate skills assessment
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
    // Use AI service to generate personalized fit description
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
    const prompt = `Based on this user's profile, identify the main challenges they'll face with ${path.name} and provide actionable solutions. Write 2-3 paragraphs.

User Profile:
- Self Motivation: ${data.selfMotivationLevel}/5
- Tech Skills: ${data.techSkillsRating}/5
- Risk Tolerance: ${data.riskComfortLevel}/5
- Time Commitment: ${data.weeklyTimeCommitment} hours/week
- Learning Preference: ${data.learningPreference}

Focus on their specific weaknesses and how to overcome them.`;

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

    // Simple logic based on quiz responses
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
    return `Based on your profile, you may face challenges with consistency and motivation during slow periods. To overcome this, set small daily goals and track your progress. Focus on building systems and routines that support your success, and don't hesitate to seek support from communities and mentors in this field.`;
  };

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const sections = [
    { id: "overview", label: `${businessPath?.name} Overview` },
    { id: "personalized-report", label: "Personalized Report" },
    { id: "getting-started", label: "Getting Started" },
  ];

  if (!businessPath) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    );
  }

  // Check if user needs to take quiz first
  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm">
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-lg fixed h-full z-10 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
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

        <div className="h-20 flex-shrink-0"></div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1">
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
            {/* Income Graph and Description */}
            <div className="grid lg:grid-cols-3 gap-12 mb-12">
              <div className="lg:col-span-2">
                <IncomeGraph businessModel={businessPath.name} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  About {businessPath.name}
                </h3>
                <div className="prose prose-lg text-gray-700">
                  <p>{businessPath.detailedDescription}</p>
                </div>
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

            {/* Fit Assessment */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Is this model a good fit for you?
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
              <p className="text-gray-700">{fitLevel.description}</p>
            </div>

            {/* AI Generated Fit Description */}
            {isGeneratingAI ? (
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ) : (
              aiAnalysis && (
                <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Why We Chose This For You
                  </h3>
                  <div className="prose prose-lg text-gray-700">
                    <p>{aiAnalysis.fitDescription}</p>
                  </div>
                </div>
              )
            )}

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
              <div className="bg-yellow-50 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Things You'll Struggle With
                </h3>
                <div className="prose prose-lg text-gray-700">
                  <p>{aiAnalysis.strugglesAndSolutions}</p>
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
          <section id="get-started" className="mb-16">
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
            <div className="bg-red-50 rounded-2xl p-8 mb-8">
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
  );
};

export default BusinessModelDetail;
