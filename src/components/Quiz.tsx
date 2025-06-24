import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Brain,
  DollarSign,
  Clock,
  Heart,
  Users,
  Award,
  Briefcase,
  Calendar,
  BookOpen,
  TrendingUp,
  Compass,
  MessageCircle,
  Zap,
  Star,
  Wallet,
  GraduationCap,
  Package,
  Monitor,
  ArrowRight,
  Target,
  Lightbulb,
  ArrowLeft,
  AlertTriangle,
  X,
  Check,
} from "lucide-react";
import { QuizData } from "../types";
import { quizSteps } from "../data/quizSteps";

interface QuizProps {
  onComplete: (data: QuizData) => void;
  onBack: () => void;
}

interface ExitWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

const iconMap = {
  Heart,
  DollarSign,
  Clock,
  Wallet,
  Calendar,
  BookOpen,
  TrendingUp,
  Award,
  Users,
  Compass,
  MessageCircle,
  Zap,
  Star,
  Brain,
  Briefcase,
  GraduationCap,
  Package,
  Monitor,
  Target,
  Lightbulb,
};

// Define the rounds with their question ranges - ALL BLUE/PURPLE THEME
const rounds = [
  {
    id: 1,
    title: "Motivation & Vision",
    subtitle:
      "These questions focus on your goals, desired outcomes, and long-term vision.",
    icon: Heart,
    color: "from-blue-600 via-purple-600 to-indigo-600",
    bgColor: "from-blue-50 to-purple-50",
    questionRange: [0, 7], // Q1-Q8 (0-indexed)
    totalQuestions: 8,
    timeEstimate: "3–4 minutes",
  },
  {
    id: 2,
    title: "Time, Effort & Learning Style",
    subtitle:
      "These questions explore your availability, consistency, and how you like to learn.",
    icon: Clock,
    color: "from-blue-600 via-purple-600 to-indigo-600",
    bgColor: "from-blue-50 to-purple-50",
    questionRange: [8, 20], // Q9-Q21 (0-indexed)
    totalQuestions: 13,
    timeEstimate: "2.5–3 minutes",
  },
  {
    id: 3,
    title: "Personality & Preferences",
    subtitle:
      "This section will help uncover your style, strengths, and working preferences.",
    icon: Users,
    color: "from-blue-600 via-purple-600 to-indigo-600",
    bgColor: "from-blue-50 to-purple-50",
    questionRange: [21, 25], // Q22-Q26 (0-indexed)
    totalQuestions: 5,
    timeEstimate: "4–5 minutes",
  },
  {
    id: 4,
    title: "Tools & Work Environment",
    subtitle: "Now we'll look at your environment and access to key tools.",
    icon: Monitor,
    color: "from-blue-600 via-purple-600 to-indigo-600",
    bgColor: "from-blue-50 to-purple-50",
    questionRange: [26, 30], // Q27-Q31 (0-indexed)
    totalQuestions: 5,
    timeEstimate: "1.5–2 minutes",
  },
  {
    id: 5,
    title: "Strategy & Decision-Making",
    subtitle:
      "These questions dig into your strategic preferences and mindset.",
    icon: Brain,
    color: "from-blue-600 via-purple-600 to-indigo-600",
    bgColor: "from-blue-50 to-purple-50",
    questionRange: [31, 35], // Q32-Q36 (0-indexed)
    totalQuestions: 5,
    timeEstimate: "2–3 minutes",
  },
  {
    id: 6,
    title: "Business Model Fit Filters",
    subtitle:
      "Final stretch. These questions will help filter your best-fit business paths.",
    icon: Target,
    color: "from-blue-600 via-purple-600 to-indigo-600",
    bgColor: "from-blue-50 to-purple-50",
    questionRange: [36, 44], // Q37-Q45 (0-indexed)
    totalQuestions: 9,
    timeEstimate: "3–4 minutes",
  },
];

// Exit Warning Modal Component
const ExitWarningModal: React.FC<ExitWarningModalProps> = ({
  isOpen,
  onClose,
  onConfirmExit,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50"></div>

          <div className="relative p-12 py-16">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Warning Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-8"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
            </motion.div>

            {/* Warning Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Are you sure you want to exit?
              </h2>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                <p className="text-lg font-semibold text-red-800 mb-2">
                  ⚠️ You will lose all progress!
                </p>
                <p className="text-red-700">
                  You'll need to restart the entire quiz from the beginning to
                  get your personalized business recommendations.
                </p>
              </div>

              <p className="text-gray-600 leading-relaxed">
                The quiz takes 10-15 minutes to complete and provides valuable
                insights about your perfect business match. Are you sure you
                want to lose your progress?
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="space-y-4"
            >
              {/* Continue Quiz Button (Primary) */}
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                Continue Quiz
              </button>

              {/* Exit Quiz Button (Secondary) */}
              <button
                onClick={onConfirmExit}
                className="w-full border-2 border-red-300 text-red-600 py-4 rounded-xl font-bold text-lg hover:bg-red-50 hover:border-red-400 transition-all duration-300"
              >
                Exit Quiz (Lose Progress)
              </button>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-center mt-8"
            >
              <p className="text-sm text-gray-500">
                💡 Tip: Your results will be personalized based on all your
                answers
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Quiz: React.FC<QuizProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<QuizData>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [showRoundIntro, setShowRoundIntro] = useState(true);
  const [currentRound, setCurrentRound] = useState(1);
  const [showExitModal, setShowExitModal] = useState(false);

  // Get current round info
  const getCurrentRound = () => {
    return (
      rounds.find(
        (round) =>
          currentStep >= round.questionRange[0] &&
          currentStep <= round.questionRange[1],
      ) || rounds[0]
    );
  };

  // Add keyboard event handlers for round intro pages
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showRoundIntro) {
        if (event.key === 'Enter') {
          event.preventDefault();
          handleRoundContinue();
        } else if (event.key === 'Escape') {
          event.preventDefault();
          setShowExitModal(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showRoundIntro]);

  // Add keyboard event handlers for quiz questions
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle Enter key on quiz questions (not round intro pages)
      if (!showRoundIntro && event.key === 'Enter') {
        event.preventDefault();
        
        // Check if user can proceed (has answered the question)
        const currentStepData = quizSteps[currentStep];
        const canProceed =
          formData[currentStepData?.field] !== undefined &&
          (currentStepData?.type !== "multiselect" ||
            (Array.isArray(formData[currentStepData?.field]) &&
              (formData[currentStepData?.field] as any[]).length > 0));
        
        if (canProceed && !isAnimating) {
          handleNext();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showRoundIntro, formData, currentStep, isAnimating]);

  const handleNext = async () => {
    if (isAnimating) return;

    setIsAnimating(true);

    if (currentStep < quizSteps.length - 1) {
      const nextStep = currentStep + 1;
      const currentRoundInfo = getCurrentRound();
      const nextRoundInfo = rounds.find(
        (round) =>
          nextStep >= round.questionRange[0] &&
          nextStep <= round.questionRange[1],
      );

      // Check if we're moving to a new round
      if (nextRoundInfo && nextRoundInfo.id !== currentRoundInfo.id) {
        setCurrentRound(nextRoundInfo.id);
        setShowRoundIntro(true);
        setCurrentStep(nextStep);
        setIsAnimating(false);
      } else {
        setTimeout(() => {
          setCurrentStep(nextStep);
          setIsAnimating(false);
        }, 300);
      }
    } else {
      setTimeout(() => {
        console.log("Quiz completed with data:", formData);
        onComplete(formData as QuizData);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handlePrevious = async () => {
    if (isAnimating) return;

    setIsAnimating(true);

    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      const currentRoundInfo = getCurrentRound();
      const prevRoundInfo = rounds.find(
        (round) =>
          prevStep >= round.questionRange[0] &&
          prevStep <= round.questionRange[1],
      );

      // Check if we're moving to a previous round
      if (prevRoundInfo && prevRoundInfo.id !== currentRoundInfo.id) {
        setCurrentRound(prevRoundInfo.id);
        setShowRoundIntro(true);
        setCurrentStep(prevStep);
        setIsAnimating(false);
      } else {
        setTimeout(() => {
          setCurrentStep(prevStep);
          setIsAnimating(false);
        }, 300);
      }
    } else {
      // Show exit warning modal instead of immediately going back
      setShowExitModal(true);
      setIsAnimating(false);
    }
  };

  const handleExitQuiz = () => {
    // Clear all quiz progress
    setFormData({});
    setCurrentStep(0);
    setCurrentRound(1);
    setShowRoundIntro(true);
    setShowExitModal(false);

    // Navigate back to home page
    onBack();
  };

  const handleBackButtonClick = () => {
    setShowExitModal(true);
  };

  const handleRoundContinue = () => {
    setShowRoundIntro(false);
  };

  // Handle back button on round intro pages - goes to previous question
  const handleRoundBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      // Find the round for the previous step
      const prevRoundInfo = rounds.find(
        (round) =>
          prevStep >= round.questionRange[0] &&
          prevStep <= round.questionRange[1],
      );
      
      if (prevRoundInfo) {
        setCurrentRound(prevRoundInfo.id);
      }
      
      setShowRoundIntro(false);
    } else {
      // If we're at the first step, show exit modal
      setShowExitModal(true);
    }
  };

  const handleOptionSelect = (value: any) => {
    const field = quizSteps[currentStep].field;
    const stepType = quizSteps[currentStep].type;

    if (stepType === "multiselect") {
      const currentValues = (formData[field] as any[]) || [];
      let newValues;

      if (value === "none") {
        newValues = ["none"];
      } else if (currentValues.includes("none")) {
        newValues = [value];
      } else if (currentValues.includes(value)) {
        newValues = currentValues.filter((v) => v !== value);
      } else {
        newValues = [...currentValues, value];
      }

      setFormData((prev) => ({ ...prev, [field]: newValues }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const currentRoundInfo = getCurrentRound();
  const currentStepData = quizSteps[currentStep];
  const IconComponent =
    iconMap[currentStepData?.icon as keyof typeof iconMap] || Brain;
  const isLastStep = currentStep === quizSteps.length - 1;
  const canProceed =
    formData[currentStepData?.field] !== undefined &&
    (currentStepData?.type !== "multiselect" ||
      (Array.isArray(formData[currentStepData?.field]) &&
        (formData[currentStepData?.field] as any[]).length > 0));

  // Calculate progress percentage - 0% on question 1, 100% on completion
  const progressPercentage =
    currentStep === 0 ? 0 : (currentStep / quizSteps.length) * 100;

  // Round Introduction Page
  if (showRoundIntro) {
    const RoundIcon = currentRoundInfo.icon;

    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br ${currentRoundInfo.bgColor} relative`}
      >
        {/* Back Arrow Button - Shows Exit Modal */}
        <motion.button
          onClick={handleBackButtonClick}
          className="fixed top-6 left-6 z-20 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-300 transform hover:scale-110 group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="h-6 w-6 text-gray-700 group-hover:text-gray-900 transition-colors" />
        </motion.button>

        <div className="max-w-4xl w-full">
          {/* Progress Bar */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span className="font-medium">
                Round {currentRoundInfo.id} - Question {currentStep + 1} of 45
              </span>
              <span className="font-medium">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 h-3 rounded-full shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Round Introduction Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 text-center relative"
          >
            {/* Round Icon */}
            <motion.div
              className={`w-24 h-24 bg-gradient-to-br ${currentRoundInfo.color} rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <RoundIcon className="h-12 w-12 text-white" />
            </motion.div>

            {/* Round Title */}
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Round {currentRoundInfo.id}: {currentRoundInfo.title}
            </motion.h1>

            {/* Round Subtitle */}
            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {currentRoundInfo.subtitle}
            </motion.p>

            {/* Round Stats */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center text-gray-500">
                <MessageCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  {currentRoundInfo.totalQuestions} Questions
                </span>
              </div>
              <div className="flex items-center text-gray-500">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  {currentRoundInfo.timeEstimate}
                </span>
              </div>
            </motion.div>

            {/* Continue Button - Centered */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <button
                onClick={handleRoundContinue}
                className={`group bg-gradient-to-r ${currentRoundInfo.color} text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Round {currentRoundInfo.id}
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </motion.div>

            {/* Navigation Hint */}
            <motion.p
              className="text-sm text-gray-400 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Or press Enter to continue
            </motion.p>

            {/* Back Button - Bottom Left Corner */}
            {currentStep > 0 && (
              <motion.div
                className="absolute bottom-8 left-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <button
                  onClick={handleRoundBack}
                  className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Back
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Regular Quiz Question
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50 relative">
      {/* Back Arrow Button - Prominent Position */}
      <motion.button
        onClick={handleBackButtonClick}
        className="fixed top-6 left-6 z-20 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-300 transform hover:scale-110 group"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="h-6 w-6 text-gray-700 group-hover:text-gray-900 transition-colors" />
      </motion.button>

      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span className="font-medium">
              Round {currentRoundInfo.id} - Question {currentStep + 1} of 45
            </span>
            <span className="font-medium">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 h-3 rounded-full shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100"
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="text-center mb-8">
              <motion.div
                className={`w-20 h-20 bg-gradient-to-br ${currentRoundInfo.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <IconComponent className="h-10 w-10 text-white" />
              </motion.div>

              <motion.h2
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {currentStepData.title}
              </motion.h2>

              <motion.p
                className="text-lg text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {currentStepData.subtitle}
              </motion.p>
            </div>

            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {currentStepData.type === "scale" ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center px-4">
                    <span className="text-sm font-medium text-gray-500">
                      Low
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                      High
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {currentStepData.options?.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(option.value)}
                        className={`p-3 py-4 rounded-2xl border-2 text-center transition-all duration-300 hover:scale-105 min-h-[90px] flex flex-col justify-center ${
                          formData[currentStepData.field] === option.value
                            ? "border-blue-500 bg-blue-50 shadow-xl transform scale-110"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                        }`}
                      >
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          {option.value}
                        </div>
                        <div className="text-xs text-gray-600 font-medium leading-tight">
                          {option.label}
                        </div>
                      </button>
                    ))}
                  </div>
                  {formData[currentStepData.field] && (
                    <motion.div
                      className="text-center p-4 bg-blue-50 rounded-xl"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-blue-800 font-medium">
                        {
                          currentStepData.options?.find(
                            (opt) =>
                              opt.value === formData[currentStepData.field],
                          )?.description
                        }
                      </p>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
                  {currentStepData.options?.map((option, index) => {
                    const isSelected =
                      currentStepData.type === "multiselect"
                        ? Array.isArray(formData[currentStepData.field]) &&
                          (formData[currentStepData.field] as any[]).includes(
                            option.value,
                          )
                        : formData[currentStepData.field] === option.value;

                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleOptionSelect(option.value)}
                        className={`p-4 md:p-5 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.02] relative ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 shadow-xl transform scale-[1.03]"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 mb-1 text-base">
                              {option.label}
                            </div>
                            {option.description && (
                              <div className="text-gray-600 text-sm">
                                {option.description}
                              </div>
                            )}
                          </div>

                          {/* Checkmark for selected options */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ duration: 0.3 }}
                              className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center ml-3 flex-shrink-0"
                            >
                              <Check className="h-4 w-4 text-white" />
                            </motion.div>
                          )}

                          {/* Multiselect indicator */}
                          {currentStepData.type === "multiselect" &&
                            !isSelected && (
                              <div className="w-6 h-6 rounded-full border-2 border-gray-300 ml-3 flex-shrink-0"></div>
                            )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Navigation */}
            <motion.div
              className="flex justify-between items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <button
                onClick={handlePrevious}
                disabled={isAnimating}
                className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Back
              </button>

              <div className="flex flex-col items-center">
                <button
                  onClick={handleNext}
                  disabled={!canProceed || isAnimating}
                  className={`flex items-center px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
                    canProceed && !isAnimating
                      ? "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white hover:shadow-xl transform hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isLastStep ? "Get My Results" : "Next"}
                  {!isLastStep && <ChevronRight className="h-5 w-5 ml-2" />}
                </button>
                
                {/* Enter key hint */}
                {canProceed && (
                  <p className="text-xs text-gray-400 mt-2">
                    Or press enter to continue
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* TEMPORARY SKIP BUTTON - REMOVE LATER */}
      <div className="fixed bottom-4 right-4 z-[9999]">
        <button
          onClick={() => {
            console.log("Skip button clicked! Generating mock data and navigating...");
            const mockData = {
              mainMotivation: "financial-freedom",
              firstIncomeTimeline: "3-6-months",
              successIncomeGoal: 5000,
              upfrontInvestment: 1000,
              passionIdentityAlignment: 4,
              businessExitPlan: "not-sure",
              businessGrowthSize: "full-time-income",
              passiveIncomeImportance: 3,
              weeklyTimeCommitment: 20,
              longTermConsistency: 4,
              trialErrorComfort: 3,
              learningPreference: "hands-on",
              systemsRoutinesEnjoyment: 3,
              discouragementResilience: 4,
              toolLearningWillingness: "yes",
              organizationLevel: 3,
              selfMotivationLevel: 4,
              uncertaintyHandling: 3,
              repetitiveTasksFeeling: "tolerate",
              workCollaborationPreference: "mostly-solo",
              brandFaceComfort: 3,
              competitivenessLevel: 3,
              creativeWorkEnjoyment: 4,
              directCommunicationEnjoyment: 4,
              workStructurePreference: "some-structure",
              techSkillsRating: 3,
              workspaceAvailability: "yes",
              supportSystemStrength: "small-helpful-group",
              internetDeviceReliability: 4,
              familiarTools: ["google-docs-sheets", "canva"],
              decisionMakingStyle: "after-some-research",
              riskComfortLevel: 3,
              feedbackRejectionResponse: 3,
              pathPreference: "mix",
              controlImportance: 4,
              onlinePresenceComfort: "yes",
              clientCallsComfort: "yes",
              physicalShippingOpenness: "no",
              workStylePreference: "mix-both",
              socialMediaInterest: 3,
              ecosystemParticipation: "yes",
              existingAudience: "no",
              promotingOthersOpenness: "yes",
              teachVsSolvePreference: "both",
              meaningfulContributionImportance: 4,
            };
            console.log("Generated mock data:", mockData);
            onComplete(mockData as QuizData);
          }}
          className="bg-red-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl hover:bg-red-600 transition-all duration-300 transform hover:scale-105 border-2 border-white"
          style={{ zIndex: 9999 }}
        >
          🚀 SKIP TO RESULTS (DEV)
        </button>
      </div>

      {/* Exit Warning Modal */}
      <ExitWarningModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirmExit={handleExitQuiz}
      />
    </div>
  );
};

export default Quiz;