import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Lock,
  Star,
  BarChart3,
  Target,
  Zap,
  Brain,
  CheckCircle,
} from "lucide-react";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
  type: "business-model" | "learn-more" | "full-report" | "quiz-required";
  title?: string;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  onUnlock,
  type,
  title,
}) => {
  if (!isOpen) return null;

  const getContent = () => {
    switch (type) {
      case "business-model":
        return {
          title: "Locked",
          subtitle: "This is one of your top matches—but it's locked.",
          description: "Unlock your full quiz results to:",
          features: [
            "View your full top 3 business models",
            "Get custom AI analysis of each model",
            "Access startup guides, income charts, and more",
          ],
          buttonText: "Unlock All for $9.99",
        };

      case "learn-more":
        return {
          title: "This Page Is Locked",
          subtitle: title
            ? `Get detailed insights about ${title} and how it fits your unique profile.`
            : "This business model was matched to you by our AI—but it's locked until you unlock full access.",
          description: "With the $9.99 upgrade, you'll get:",
          features: [
            "Your 3 best-fit business models",
            "Full AI-generated explanations and insights",
            "Challenges to expect and how to beat them",
            "A skill map showing what you already have and what to build",
            "Real startup guides, income data, and resources for all 18 models",
            "Personalized action plans and step-by-step roadmaps",
          ],
          buttonText: "Unlock All for $9.99",
          secondaryButton: "No Thanks – Return to Explorer",
        };

      case "full-report":
        return {
          title: "Welcome to Your Full Report",
          subtitle:
            "This page contains your full success blueprint—AI-generated insights, trait sliders, custom business fit analysis, and more.",
          description: "To unlock everything, upgrade for a one-time payment.",
          features: [
            "Your 3 best-fit business paths",
            "Full income charts and startup guides",
            "Skill bubbles and personalized advice",
            "Getting started guides",
          ],
          buttonText: "Unlock Full Report for $9.99",
        };

      case "quiz-required":
        return {
          title: "Quiz Required",
          subtitle:
            "You need to take our personality quiz first to see your personalized business matches.",
          description: "Our AI needs your quiz responses to:",
          features: [
            "Generate personalized business model recommendations",
            "Create custom AI analysis based on your profile",
            "Show relevant income data and startup guides",
            "Provide skill assessments tailored to you",
          ],
          buttonText: "Take the Quiz Now",
        };

      default:
        return {
          title: "Unlock Full Access",
          subtitle: "Get access to all features",
          description: "",
          features: [],
          buttonText: "Unlock Now",
        };
    }
  };

  const content = getContent();

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
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50"></div>

          <div className="relative p-8">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Lock Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-6"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {content.title}
              </h2>

              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                {content.subtitle}
              </p>

              {content.description && (
                <p className="text-gray-600 mb-4 font-medium">
                  {content.description}
                </p>
              )}

              {/* Features List */}
              {content.features.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 text-left">
                  <ul className="space-y-3">
                    {content.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start text-blue-800"
                      >
                        <CheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-blue-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="space-y-4"
            >
              {/* Primary Button */}
              <button
                onClick={onUnlock}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                {content.buttonText}
              </button>

              {/* Secondary Button (for learn-more type) */}
              {content.secondaryButton && (
                <button
                  onClick={onClose}
                  className="w-full border-2 border-gray-300 text-gray-600 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                >
                  {content.secondaryButton}
                </button>
              )}
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-center mt-6"
            >
              <p className="text-sm text-gray-500">
                💡 One-time payment • Instant access • 30-day guarantee
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface LockedCardOverlayProps {
  onUnlock: () => void;
}

export const LockedCardOverlay: React.FC<LockedCardOverlayProps> = ({
  onUnlock,
}) => {
  return (
    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6 }}
        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4"
      >
        <Lock className="h-8 w-8 text-white" />
      </motion.div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">Locked</h3>
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
        This is one of your top matches—but it's locked.
      </p>

      <button
        onClick={onUnlock}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-bold text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Unlock for $9.99
      </button>
    </div>
  );
};