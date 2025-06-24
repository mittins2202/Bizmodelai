import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowRight,
  X,
  CheckCircle,
  Clock,
  Star,
  Zap,
} from "lucide-react";

interface EmailCaptureProps {
  onEmailSubmit: (email: string) => void;
  onContinueAsGuest: () => void;
  onReturnToQuiz?: () => void;
}

// Confetti component
const Confetti: React.FC = () => {
  const [confettiPieces, setConfettiPieces] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      rotation: number;
      color: string;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    // Generate confetti pieces
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      rotation: Math.random() * 360,
      color: ["#3b82f6", "#8b5cf6", "#06d6a0", "#f59e0b", "#ef4444", "#ec4899"][
        Math.floor(Math.random() * 6)
      ],
      delay: Math.random() * 3,
    }));
    setConfettiPieces(pieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: piece.color,
            left: `${piece.x}%`,
          }}
          initial={{
            y: -20,
            rotation: piece.rotation,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 20,
            rotation: piece.rotation + 720,
            opacity: 0,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: piece.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

const EmailCapture: React.FC<EmailCaptureProps> = ({
  onEmailSubmit,
  onContinueAsGuest,
  onReturnToQuiz,
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onEmailSubmit(email);
    setIsSubmitting(false);
  };

  const handleGuestContinue = () => {
    onContinueAsGuest();
  };

  return (
    <>
      {/* Confetti Animation */}
      <Confetti />

      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-8 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50"></div>

          <div className="relative p-6 pt-12 md:p-12 md:pt-16">
            {/* Celebration Header */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-8"
            >
              <div className="text-6xl md:text-7xl mb-6">🎉</div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
              >
                Congratulations!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-lg text-gray-600"
              >
                You've completed the quiz! 🚀
              </motion.p>
            </motion.div>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Mail className="h-10 w-10 text-white" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
              >
                Get Your Results Delivered!
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-lg text-gray-600 leading-relaxed"
              >
                Enter your email to receive a personalized link to your results.
                You can always return to view your complete business blueprint.
              </motion.p>
            </div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="grid md:grid-cols-3 gap-4 mb-8"
            >
              {[
                {
                  icon: CheckCircle,
                  title: "Permanent Access",
                  description: "Return anytime with your personal link",
                },
                {
                  icon: Clock,
                  title: "Save Your Progress",
                  description: "Never lose your personalized results",
                },
                {
                  icon: Star,
                  title: "Future Updates",
                  description: "Get notified of new insights and features",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4 bg-white/60 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.0 + index * 0.1 }}
                >
                  <benefit.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Email Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              onSubmit={handleSubmit}
              className="mb-6"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center ${
                    isSubmitting || !email.trim()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Get Results
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>

            {/* Privacy Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="text-center mb-6"
            >
              <p className="text-sm text-gray-500">
                🔒 We respect your privacy. No spam, just your results and
                occasional valuable insights.
              </p>
            </motion.div>

            {/* Continue as Guest */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="text-center border-t border-gray-200 pt-6"
            >
              <button
                onClick={handleGuestContinue}
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Continue as guest (results won't be saved)
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default EmailCapture;
