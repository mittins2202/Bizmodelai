import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { businessModels, BusinessModel } from "../data/businessModels";
import { PaywallModal } from "../components/PaywallModals";
import { usePaywall } from "../contexts/PaywallContext";

const BusinessExplorer = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [paywallType, setPaywallType] = useState<
    "quiz-required" | "learn-more"
  >("quiz-required");
  const navigate = useNavigate();
  const { hasCompletedQuiz, canAccessBusinessModel } = usePaywall();

  const categories = [
    "All",
    ...Array.from(new Set(businessModels.map((model) => model.category))),
  ];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredModels = businessModels.filter((model) => {
    const categoryMatch =
      selectedCategory === "All" || model.category === selectedCategory;
    const difficultyMatch =
      selectedDifficulty === "All" || model.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const handleCardExpand = (modelId: string) => {
    setExpandedCard((current) => (current === modelId ? null : modelId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Business Model Explorer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the perfect business model for your goals, skills, and
            lifestyle. Each model includes detailed insights to help you make an
            informed decision.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Category:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Difficulty:
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
            <div className="ml-auto text-sm text-gray-600">
              Showing {filteredModels.length} of {businessModels.length}{" "}
              business models
            </div>
          </div>
        </div>

        {/* Business Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredModels.map((model) => (
            <BusinessModelCard
              key={model.id}
              model={model}
              navigate={navigate}
              isExpanded={expandedCard === model.id}
              onToggleExpand={() => handleCardExpand(model.id)}
            />
          ))}
        </div>

        {filteredModels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No business models match your current filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const BusinessModelCard = ({
  model,
  navigate,
  isExpanded,
  onToggleExpand,
}: {
  model: BusinessModel;
  navigate: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) => {
  const [showAllSkills, setShowAllSkills] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScalabilityColor = (scalability: string) => {
    switch (scalability) {
      case "Low":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-green-100 text-green-800";
      case "Very High":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleLearnMore = () => {
    navigate(`/business/${model.id}`);
  };

  const getSkillsToShow = () => {
    const maxSkillsToShow = 4;
    if (showAllSkills || model.requiredSkills.length <= maxSkillsToShow) {
      return model.requiredSkills;
    }
    return model.requiredSkills.slice(0, maxSkillsToShow);
  };

  const remainingSkillsCount = Math.max(0, model.requiredSkills.length - 4);

  const handleSkillsToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAllSkills(!showAllSkills);
  };

  return (
    <motion.div
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col ${
        isExpanded ? "md:col-span-2 lg:col-span-3" : ""
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
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex-1 mr-2 line-clamp-2">
            {model.title}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getDifficultyColor(model.difficulty)}`}
          >
            {model.difficulty}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">{model.description}</p>

        {/* Key Metrics */}
        <div className="space-y-2 mb-4 flex-shrink-0">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Time to Start:</span>
            <span className="font-medium">{model.timeToStart}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Initial Investment:</span>
            <span className="font-medium">{model.initialInvestment}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Potential Income:</span>
            <span className="font-medium text-green-600">
              {model.potentialIncome}
            </span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="text-gray-500">Scalability:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getScalabilityColor(model.scalability)}`}
            >
              {model.scalability}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Best Fit:</span>
            <span className="font-medium text-blue-600 text-right text-xs">
              {model.fit}
            </span>
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
              {/* Detailed Description */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  About This Model
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {model.detailedDescription}
                </p>
              </div>

              {/* Required Skills */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-1">
                  {getSkillsToShow().map((skill, index) => (
                    <motion.span
                      key={`${skill}-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {skill}
                    </motion.span>
                  ))}

                  {/* Show More/Less Skills Button */}
                  {model.requiredSkills.length > 4 && (
                    <button
                      onClick={handleSkillsToggle}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200 transition-colors"
                    >
                      {showAllSkills
                        ? "Show less"
                        : `+${remainingSkillsCount} more`}
                    </button>
                  )}
                </div>
              </div>

              {/* Tools */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Common Tools
                </h4>
                <div className="flex flex-wrap gap-1">
                  {model.tools.map((tool, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pros */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  Pros
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {model.pros.slice(0, 4).map((pro, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                  Cons
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {model.cons.slice(0, 4).map((con, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">×</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-sm text-gray-600">
                <strong>Time Commitment:</strong> {model.timeCommitment}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons - Fixed at Bottom */}
        <div className="mt-auto pt-4 space-y-3">
          {/* Expand/Collapse Button */}
          <button
            onClick={onToggleExpand}
            className="w-full py-2 px-4 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            {isExpanded ? "Show Less" : "Show Details"}
          </button>

          {/* Learn More Link - Center Aligned */}
          <div className="text-center w-full">
            <button
              onClick={handleLearnMore}
              className="text-black hover:text-gray-700 font-medium text-sm transition-all duration-300 inline-flex items-center justify-center group"
            >
              <span>Learn More About {model.title}</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BusinessExplorer;
