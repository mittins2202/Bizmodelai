import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Clock,
  DollarSign,
  TrendingUp,
  Zap,
  Shield,
  CheckCircle2,
  Lock,
  Award,
  Target,
  Users,
  BookOpen,
  Lightbulb,
  ArrowRight,
  X,
  Brain,
  Sparkles,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Rocket,
  FileText,
  CreditCard,
  Eye,
  EyeOff,
  Download,
  Mail,
  Share2,
} from "lucide-react";
import { QuizData, BusinessPath, AIAnalysis } from "../types";
import { generatePersonalizedPaths } from "../utils/quizLogic";
import { AIService } from "../utils/aiService";
import FullReport from "./FullReport";
import { PaywallModal, LockedCardOverlay } from "./PaywallModals";
import { usePaywall } from "../contexts/PaywallContext";

interface ResultsProps {
  quizData: QuizData;
  onBack: () => void;
  userEmail?: string | null;
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
}

const Results: React.FC<ResultsProps> = ({ quizData, onBack, userEmail }) => {
  const [selectedPath, setSelectedPath] = useState<BusinessPath | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);
  const [personalizedPaths, setPersonalizedPaths] = useState<BusinessPath[]>(
    [],
  );
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(true);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paywallType, setPaywallType] = useState<
    "business-model" | "learn-more" | "full-report"
  >("business-model");

  const {
    hasUnlockedAnalysis,
    hasCompletedQuiz,
    setHasUnlockedAnalysis,
    setHasCompletedQuiz,
    canAccessFullReport,
  } = usePaywall();

  useEffect(() => {
    console.log("Results component received quizData:", quizData);
    const paths = generatePersonalizedPaths(quizData);
    console.log("Generated paths:", paths);
    setPersonalizedPaths(paths);

    // Mark quiz as completed
    setHasCompletedQuiz(true);

    // Generate AI insights and analysis
    generateAIContent(paths);
  }, [quizData, setHasCompletedQuiz]);

  const generateAIContent = async (paths: BusinessPath[]) => {
    try {
      setIsGeneratingAI(true);
      const aiService = AIService.getInstance();

      // Generate basic insights
      const insights = await aiService.generatePersonalizedInsights(
        quizData,
        paths.slice(0, 3),
      );
      setAiInsights(insights);

      // Generate detailed AI analysis using the centralized method
      const analysis = await aiService.generateDetailedAnalysis(
        quizData,
        paths[0],
      );
      setAiAnalysis(analysis);
    } catch (error) {
      console.error("Error generating AI content:", error);
      // Fallback content
      setAiInsights(generateFallbackInsights());
      setAiAnalysis(generateFallbackAnalysis());
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generateFallbackAnalysis = (): AIAnalysis => {
    const topPath = personalizedPaths[0];
    return {
      fullAnalysis: `Based on your comprehensive assessment, ${topPath?.name || "your top business match"} represents an exceptional fit for your unique profile. Your combination of goals, personality traits, and available resources creates a powerful foundation for success in this field. The ${topPath?.fitScore || 85}% compatibility score reflects how well this business model aligns with your natural strengths and preferences. Your approach to risk, communication style, and time availability all point toward this being not just a good fit, but potentially your ideal entrepreneurial path. The key to your success will be leveraging your analytical nature while building on your existing skills and gradually expanding your comfort zone. This business model offers the perfect balance of challenge and achievability, allowing you to grow while staying within your comfort zone initially. Your unique combination of traits positions you for both short-term wins and long-term sustainable growth in this field.`,
      keyInsights: [
        "Your risk tolerance perfectly matches the requirements of this business model",
        "Time commitment aligns with realistic income expectations and growth timeline",
        "Technical skills provide a solid foundation for the tools and systems needed",
        "Communication preferences match the customer interaction requirements",
      ],
      personalizedRecommendations: [
        "Start with proven tools and systems to minimize learning curve",
        "Focus on systematic execution rather than trying to reinvent approaches",
        "Leverage your natural strengths while gradually building new skills",
      ],
      riskFactors: [
        "Initial learning curve may require patience and persistence",
        "Income may be inconsistent in the first few months",
        "Success requires consistent daily action and follow-through",
      ],
      successPredictors: [
        "Strong self-motivation indicates high likelihood of follow-through",
        "Analytical approach will help optimize strategies and tactics",
        "Realistic expectations set foundation for sustainable growth",
      ],
    };
  };

  const generateFallbackInsights = (): AIInsights => {
    const topPath = personalizedPaths[0];
    return {
      personalizedSummary: `Based on your comprehensive assessment, ${topPath?.name || "your top business match"} achieves a ${topPath?.fitScore || 85}% compatibility score with your unique profile.`,
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
    };
  };

  const handleViewFullReport = (path: BusinessPath) => {
    if (!canAccessFullReport()) {
      setPaywallType("full-report");
      setShowUnlockModal(true);
      return;
    }
    setShowFullReport(true);
  };

  const handleLearnMore = (path: BusinessPath) => {
    console.log("Learn more about why", path.name, "fits this user");
    setShowUnlockModal(true);
  };

  const handleUnlockAnalysis = () => {
    setShowUnlockModal(true);
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setHasUnlockedAnalysis(true);
    setShowPreview(false);
    setShowUnlockModal(false);
    setIsProcessingPayment(false);

    // Navigate to full report analysis page
    setShowFullReport(true);

    // In a real implementation, this would:
    // 1. Process payment through Stripe
    // 2. Create unique URL for user's results
    // 3. Save payment record and unlock status
    // 4. Redirect to dedicated results page
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Email functionality
  const handleEmailResults = async () => {
    try {
      const subject = encodeURIComponent(
        `Your Business Path Results - ${personalizedPaths[0]?.name}`,
      );
      const body = encodeURIComponent(
        `Hi there!\n\nYour personalized business path analysis is ready!\n\nTop Match: ${personalizedPaths[0]?.name} (${personalizedPaths[0]?.fitScore}% fit)\n\nView your complete results: ${window.location.href}\n\nBest regards,\nBusiness Path Team`,
      );

      // Open default email client
      window.location.href = `mailto:${userEmail || ""}?subject=${subject}&body=${body}`;

      // Show success feedback
      alert(
        "Email client opened! Your results have been prepared for sending.",
      );
    } catch (error) {
      console.error("Error opening email client:", error);
      alert("Unable to open email client. Please copy the URL manually.");
    }
  };

  // Download functionality
  const handleDownloadResults = async () => {
    try {
      // Create a comprehensive text version of the results
      const resultsText = `
BUSINESS PATH ANALYSIS RESULTS
==============================

Your Top Business Match: ${personalizedPaths[0]?.name}
Fit Score: ${personalizedPaths[0]?.fitScore}%
Difficulty: ${personalizedPaths[0]?.difficulty}
Time to Profit: ${personalizedPaths[0]?.timeToProfit}
Startup Cost: ${personalizedPaths[0]?.startupCost}
Potential Income: ${personalizedPaths[0]?.potentialIncome}

DESCRIPTION:
${personalizedPaths[0]?.description}

TOP BENEFITS:
${personalizedPaths[0]?.pros
  .slice(0, 5)
  .map((pro, i) => `${i + 1}. ${pro}`)
  .join("\n")}

POTENTIAL CHALLENGES:
${personalizedPaths[0]?.cons
  .slice(0, 3)
  .map((con, i) => `${i + 1}. ${con}`)
  .join("\n")}

REQUIRED SKILLS:
${personalizedPaths[0]?.skills.slice(0, 8).join(", ")}

YOUR OTHER TOP MATCHES:
${personalizedPaths
  .slice(1, 4)
  .map((path, i) => `${i + 2}. ${path.name} (${path.fitScore}% fit)`)
  .join("\n")}

Generated on: ${new Date().toLocaleDateString()}
Business Path Platform - businesspath.com
      `;

      // Create and download the file
      const blob = new Blob([resultsText], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `business-path-results-${personalizedPaths[0]?.name.toLowerCase().replace(/\s+/g, "-")}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success feedback
      alert("Your results have been downloaded successfully!");
    } catch (error) {
      console.error("Error downloading results:", error);
      alert("Unable to download results. Please try again.");
    }
  };

  // Share functionality
  const handleShareResults = async () => {
    try {
      const shareData = {
        title: `My Business Path Results - ${personalizedPaths[0]?.name}`,
        text: `I just discovered my perfect business match! ${personalizedPaths[0]?.name} is a ${personalizedPaths[0]?.fitScore}% fit for my goals and personality.`,
        url: window.location.href,
      };

      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData);
        alert("Results shared successfully!");
      } else {
        // Fallback: Copy to clipboard
        const shareText = `${shareData.text}\n\nSee my full results: ${shareData.url}`;
        await navigator.clipboard.writeText(shareText);
        alert("Share text copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing results:", error);

      // Final fallback: Show share options
      const shareText = `Check out my business path results! ${personalizedPaths[0]?.name} is a ${personalizedPaths[0]?.fitScore}% fit for me. ${window.location.href}`;

      // Create share modal with social media options
      const shareModal = confirm(
        `Share your results?\n\nTwitter: Click OK to share on Twitter\nCancel: Copy link to clipboard`,
      );

      if (shareModal) {
        // Open Twitter share
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(twitterUrl, "_blank");
      } else {
        // Copy to clipboard
        try {
          await navigator.clipboard.writeText(shareText);
          alert("Share link copied to clipboard!");
        } catch (clipboardError) {
          alert("Unable to share. Please copy the URL manually.");
        }
      }
    }
  };

  if (showFullReport) {
    return (
      <FullReport
        quizData={quizData}
        topPath={personalizedPaths[0]}
        allPaths={personalizedPaths}
        onBack={() => setShowFullReport(false)}
      />
    );
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const iconMap = {
    TrendingUp,
    ShoppingCart: Zap,
    Briefcase: Target,
    GraduationCap: BookOpen,
    Video: Users,
    Store: Shield,
    Package: Zap,
    Monitor: Brain,
  };

  // Split analysis into two paragraphs for blur effect
  const splitAnalysis = (text: string) => {
    const sentences = text.split(". ");
    const midPoint = Math.ceil(sentences.length / 2);
    const firstParagraph =
      sentences.slice(0, midPoint).join(". ") +
      (sentences.length > midPoint ? "." : "");
    const secondParagraph = sentences.slice(midPoint).join(". ");
    return { firstParagraph, secondParagraph };
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Quiz
          </button>
        </motion.div>

        {/* Primary Heading - 30% viewport height */}
        <motion.div
          className="text-center mb-12"
          style={{ minHeight: "30vh" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            Your Best Fit Business Model is{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {personalizedPaths[0]?.name || "Loading..."}
            </span>
            !
          </motion.h1>

          {/* Email confirmation */}
          {userEmail && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 inline-flex items-center bg-green-50 border border-green-200 rounded-full px-6 py-3"
            >
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                Results link sent to {userEmail}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Visual Divider */}
        <motion.div
          className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-12"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Secondary Heading */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your AI-Powered Business Blueprint
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Personalized recommendations crafted by AI based on your unique
            goals, skills, and preferences
          </p>
        </motion.div>

        {/* AI Analysis Section */}
        {isGeneratingAI ? (
          <motion.div
            className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-3xl p-8 mb-12 text-white relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Brain className="h-8 w-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-4">
                AI is Analyzing Your Profile...
              </h2>
              <p className="text-xl text-blue-100 mb-6">
                Creating personalized insights, challenges, and success
                strategies just for you
              </p>
              <div className="flex justify-center space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-white/60 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          aiAnalysis && (
            <motion.div
              className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-3xl p-8 mb-12 text-white relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      Your AI-Generated Insights
                    </h2>
                    <p className="text-blue-100">
                      Personalized analysis based on your unique profile
                    </p>
                  </div>
                </div>

                {/* AI Analysis Content with Progressive Blur */}
                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <div className="text-blue-50 leading-relaxed text-lg">
                      {hasUnlockedAnalysis ? (
                        // Full content when unlocked
                        <div>
                          <p className="mb-6">{aiAnalysis.fullAnalysis}</p>

                          <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div>
                              <h4 className="font-bold mb-3 flex items-center">
                                <Target className="h-4 w-4 mr-2" />
                                Key Insights
                              </h4>
                              <ul className="space-y-2">
                                {aiAnalysis.keyInsights.map(
                                  (insight, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <CheckCircle className="h-4 w-4 text-green-300 mr-2 mt-0.5 flex-shrink-0" />
                                      <span className="text-sm">{insight}</span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-bold mb-3 flex items-center">
                                <Lightbulb className="h-4 w-4 mr-2" />
                                Success Predictors
                              </h4>
                              <ul className="space-y-2">
                                {aiAnalysis.successPredictors.map(
                                  (predictor, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <Star className="h-4 w-4 text-yellow-300 mr-2 mt-0.5 flex-shrink-0" />
                                      <span className="text-sm">
                                        {predictor}
                                      </span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </div>

                          {/* Business Info Boxes */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                              <div className="text-2xl mb-2">⏱️</div>
                              <div className="text-xs text-blue-200 mb-1">
                                Time to Start
                              </div>
                              <div className="font-bold text-sm">
                                {personalizedPaths[0]?.timeToProfit ||
                                  "3-6 months"}
                              </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                              <div className="text-2xl mb-2">💰</div>
                              <div className="text-xs text-blue-200 mb-1">
                                Initial Investment
                              </div>
                              <div className="font-bold text-sm">
                                {personalizedPaths[0]?.startupCost || "$0-500"}
                              </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                              <div className="text-2xl mb-2">📈</div>
                              <div className="text-xs text-blue-200 mb-1">
                                Potential Income
                              </div>
                              <div className="font-bold text-sm">
                                {personalizedPaths[0]?.potentialIncome ||
                                  "$2K-10K/mo"}
                              </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                              <div className="text-2xl mb-2">🕒</div>
                              <div className="text-xs text-blue-200 mb-1">
                                Time Commitment
                              </div>
                              <div className="font-bold text-sm">
                                {quizData.weeklyTimeCommitment || "10-20"}{" "}
                                hrs/week
                              </div>
                            </div>
                          </div>

                          {/* CTAs - Only show when unlocked */}
                          <div className="mt-8 space-y-4">
                            <button
                              onClick={() =>
                                handleViewFullReport(personalizedPaths[0])
                              }
                              className="w-full bg-white text-purple-600 border-2 border-purple-600 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 hover:border-purple-700 hover:text-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                            >
                              <FileText className="h-5 w-5 mr-2 inline" />
                              View Full Report
                            </button>

                            <div className="text-center">
                              <button
                                onClick={() =>
                                  handleLearnMore(personalizedPaths[0])
                                }
                                className="text-white hover:text-gray-300 font-medium text-lg transition-all duration-300 inline-flex items-center group"
                              >
                                <span>
                                  Get started with {personalizedPaths[0]?.name}
                                </span>
                                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Preview with seamless gradient fade effect
                        <div className="relative">
                          {/* Three paragraphs with seamless gradient fade */}
                          <div className="relative mb-8">
                            {(() => {
                              const sentences =
                                aiAnalysis.fullAnalysis.split(". ");
                              const thirdLength = Math.ceil(
                                sentences.length / 3,
                              );

                              const firstParagraph =
                                sentences.slice(0, thirdLength).join(". ") +
                                (sentences.length > thirdLength ? "." : "");
                              const secondParagraph =
                                sentences
                                  .slice(thirdLength, thirdLength * 2)
                                  .join(". ") +
                                (sentences.length > thirdLength * 2 ? "." : "");
                              const thirdParagraph = sentences
                                .slice(thirdLength * 2)
                                .join(". ");

                              return (
                                <div
                                  className="text-blue-50 leading-relaxed text-lg"
                                  style={{
                                    WebkitMask:
                                      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0) 100%)",
                                    mask: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0) 100%)",
                                  }}
                                >
                                  {/* First paragraph - fully visible */}
                                  <p className="mb-4">{firstParagraph}</p>

                                  {/* Second paragraph - starts to fade */}
                                  <p className="mb-4">{secondParagraph}</p>

                                  {/* Third paragraph - fades to invisible */}
                                  <p className="mb-6">{thirdParagraph}</p>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Value Proposition Columns - fully visible below faded text */}
                          <div className="mb-24">
                            <div className="grid md:grid-cols-2 gap-8">
                              {/* Column 1 */}
                              <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                  <div className="text-3xl mt-1">🧠</div>
                                  <div>
                                    <h4 className="font-bold text-white text-lg mb-2">
                                      Your Business Blueprint
                                    </h4>
                                    <p className="text-blue-100 text-sm leading-relaxed">
                                      Discover the exact business model you
                                      should pursue—tailored to your
                                      personality, strengths, and goals.
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                  <div className="text-3xl mt-1">⚠️</div>
                                  <div>
                                    <h4 className="font-bold text-white text-lg mb-2">
                                      Models to Avoid
                                    </h4>
                                    <p className="text-blue-100 text-sm leading-relaxed">
                                      See which business paths are poor fits for
                                      you and why they're likely to lead to
                                      burnout or failure.
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                  <div className="text-3xl mt-1">🚀</div>
                                  <div>
                                    <h4 className="font-bold text-white text-lg mb-2">
                                      Step-by-Step Launch Guidance
                                    </h4>
                                    <p className="text-blue-100 text-sm leading-relaxed">
                                      Learn how to get started with your
                                      best-fit business model, including tools,
                                      timelines, and tips.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Column 2 */}
                              <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                  <div className="text-3xl mt-1">💪</div>
                                  <div>
                                    <h4 className="font-bold text-white text-lg mb-2">
                                      Your Strengths & Blind Spots
                                    </h4>
                                    <p className="text-blue-100 text-sm leading-relaxed">
                                      Get a clear breakdown of what you're
                                      naturally great at—and where you'll need
                                      support or growth.
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                  <div className="text-3xl mt-1">📊</div>
                                  <div>
                                    <h4 className="font-bold text-white text-lg mb-2">
                                      Income Potential & Market Fit
                                    </h4>
                                    <p className="text-blue-100 text-sm leading-relaxed">
                                      Understand how much you can realistically
                                      earn and how big the opportunity is.
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                  <div className="text-3xl mt-1">🛠</div>
                                  <div>
                                    <h4 className="font-bold text-white text-lg mb-2">
                                      Skills You Need to Succeed
                                    </h4>
                                    <p className="text-blue-100 text-sm leading-relaxed">
                                      Find out which skills you already have,
                                      what to build, and what gaps to close.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Paywall Section */}
                  {!hasUnlockedAnalysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-12 text-center"
                    >
                      <Lock className="h-8 w-8 text-white mx-auto mb-4" />
                      <h4 className="text-xl font-bold text-white mb-2">
                        Unlock your results with small one-time fee
                      </h4>
                      <p className="text-blue-100 mb-6">
                        Get the full personalized analysis, detailed insights,
                        and success strategies for just $9.99
                      </p>
                      <button
                        onClick={handleUnlockAnalysis}
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-3 rounded-full font-bold hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-xl"
                      >
                        Unlock Full Analysis - $9.99
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        )}

        {/* Results - Customized width for better fit */}
        <motion.div
          className="space-y-8 mb-12"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          {personalizedPaths.slice(0, 3).map((path, index) => {
            const IconComponent =
              iconMap[path.icon as keyof typeof iconMap] || TrendingUp;

            return (
              <motion.div
                key={path.id}
                className={`relative bg-white rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl border-2 group max-w-4xl mx-auto ${
                  index === 0
                    ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 transform hover:scale-[1.02]"
                    : "border-gray-200 hover:border-blue-300 hover:scale-[1.02]"
                }`}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                {/* Locked overlay for cards 2 and 3 when not unlocked */}
                {index > 0 && !hasUnlockedAnalysis && (
                  <LockedCardOverlay
                    onUnlock={() => {
                      setPaywallType("business-model");
                      setShowUnlockModal(true);
                    }}
                  />
                )}

                {/* Ranking bubbles */}
                {index === 0 && (
                  <motion.div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      AI RECOMMENDED
                    </div>
                  </motion.div>
                )}
                {index === 1 && (
                  <motion.div
                    className="absolute -top-4 right-1/4 transform translate-x-1/2"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                  >
                    <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      2nd Best
                    </div>
                  </motion.div>
                )}
                {index === 2 && (
                  <motion.div
                    className="absolute -top-4 right-1/4 transform translate-x-1/2"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                  >
                    <div className="bg-gradient-to-r from-slate-400 to-slate-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      3rd Best
                    </div>
                  </motion.div>
                )}

                <div className="h-full p-8 flex">
                  {/* Left Column - Main Info */}
                  <div className="flex-1 pr-6">
                    <div className="flex items-center mb-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 ${
                          index === 0 ? "bg-yellow-500" : "bg-blue-600"
                        }`}
                      >
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {path.name}
                        </h3>
                        <div
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            path.difficulty === "Easy"
                              ? "bg-green-100 text-green-800"
                              : path.difficulty === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {path.difficulty}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {path.description}
                    </p>

                    {/* Key Metrics in compact grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <Clock className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-xs font-medium text-gray-700">
                            Time to Profit
                          </span>
                        </div>
                        <div className="font-bold text-gray-900 text-sm">
                          {path.timeToProfit}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center mb-1">
                          <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-xs font-medium text-gray-700">
                            Startup Cost
                          </span>
                        </div>
                        <div className="font-bold text-gray-900 text-sm">
                          {path.startupCost}
                        </div>
                      </div>
                    </div>

                    {/* Action Elements */}
                    <div className="space-y-3 mt-auto">
                      {/* Primary CTA - Only show if card is not locked */}
                      {!(index > 0 && !hasUnlockedAnalysis) && (
                        <button
                          onClick={() => handleViewFullReport(path)}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform group-hover:scale-[1.02] flex items-center justify-center"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Full Report
                        </button>
                      )}

                      {/* Secondary CTA - Only show if card is not locked */}
                      {!(index > 0 && !hasUnlockedAnalysis) && (
                        <div className="text-center">
                          <button
                            onClick={() => handleLearnMore(path)}
                            className="text-gray-700 hover:text-blue-600 transition-colors duration-300 text-sm font-bold flex items-center justify-center group"
                          >
                            Learn more about {path.name} for you
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Score & Highlights */}
                  <div className="w-48 flex flex-col">
                    {/* Fit Score */}
                    <div className="text-center mb-6">
                      <div
                        className={`text-5xl font-bold mb-1 ${
                          index === 0 ? "text-yellow-600" : "text-blue-600"
                        }`}
                      >
                        {path.fitScore}%
                      </div>
                      <div className="text-sm text-gray-500 font-medium">
                        AI Match
                      </div>
                    </div>

                    {/* Potential Income */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">
                          Potential Income
                        </span>
                      </div>
                      <div className="text-xl font-bold text-green-700">
                        {path.potentialIncome}
                      </div>
                    </div>

                    {/* Top Pros */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                        Top Benefits
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        {path.pros.slice(0, 3).map((pro, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-green-500 mr-2 text-xs">
                              •
                            </span>
                            <span className="leading-tight">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Action Buttons Section */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Take Action on Your Results
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <button
              onClick={handleDownloadResults}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
            >
              <Download className="h-8 w-8 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-gray-900 mb-2">Download as PDF</h4>
              <p className="text-gray-600 text-sm">
                Get your complete report as a downloadable file for offline
                reference
              </p>
            </button>

            <button
              onClick={handleEmailResults}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
            >
              <Mail className="h-8 w-8 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-gray-900 mb-2">Email My Results</h4>
              <p className="text-gray-600 text-sm">
                Send this report to your email for easy access and sharing
              </p>
            </button>

            <button
              onClick={handleShareResults}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
            >
              <Share2 className="h-8 w-8 text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-gray-900 mb-2">Share My Results</h4>
              <p className="text-gray-600 text-sm">
                Share your business match with friends, family, and mentors
              </p>
            </button>
          </div>
        </motion.div>

        {/* Unlock Premium Section */}
        <motion.div
          className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden mt-12"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <motion.div
              className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Lock className="h-12 w-12 text-white" />
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              Unlock Your Complete AI-Powered Roadmap
            </motion.h2>

            <motion.p
              className="text-xl text-gray-300 mb-10 leading-relaxed"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              Get detailed step-by-step action plans, curated resources, and
              advanced AI insights to accelerate your success
            </motion.p>

            <motion.div
              className="grid md:grid-cols-3 gap-6 mb-10"
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              {[
                {
                  icon: Brain,
                  title: "Advanced AI Analysis",
                  description:
                    "Deep personality profiling and custom success predictions based on your unique profile",
                },
                {
                  icon: Target,
                  title: "Detailed Action Plans",
                  description:
                    "Week-by-week roadmaps with specific milestones and success metrics",
                },
                {
                  icon: BookOpen,
                  title: "Curated Resources",
                  description:
                    "Hand-picked tools, courses, and platforms with ratings and reviews",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start text-left bg-white/10 backdrop-blur-sm rounded-2xl p-6"
                  variants={fadeInUp}
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="text-gray-400 line-through text-xl mb-2">
                $197 Value
              </div>
              <div className="text-6xl font-bold text-white mb-2">$9.99</div>
              <div className="text-gray-300 text-lg">
                One-time payment • Instant access • 30-day guarantee
              </div>
            </motion.div>

            <motion.button
              onClick={handleUnlockAnalysis}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-12 py-5 rounded-full text-xl font-bold hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Unlock AI-Powered Roadmap Now
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        onUnlock={handlePayment}
        type={paywallType}
      />
    </div>
  );
};

export default Results;
