import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PaywallProvider } from "./contexts/PaywallContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import BusinessExplorer from "./pages/BusinessExplorer";
import SuccessStories from "./pages/SuccessStories";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import EmailCapture from "./components/EmailCapture";
import BusinessModelDetail from "./components/BusinessModelDetail";
import { QuizData } from "./types";

function App() {
  const [quizData, setQuizData] = React.useState<QuizData | null>(null);
  const [showEmailCapture, setShowEmailCapture] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);

  // TEMPORARY: Mock quiz data for testing with COMPLETE data structure
  const generateMockQuizData = (): QuizData => {
    return {
      // Round 1: Motivation & Vision
      mainMotivation: "financial-freedom",
      firstIncomeTimeline: "3-6-months",
      successIncomeGoal: 5000,
      upfrontInvestment: 1000,
      passionIdentityAlignment: 4,
      businessExitPlan: "not-sure",
      businessGrowthSize: "full-time-income",
      passiveIncomeImportance: 3,

      // Round 2: Time, Effort & Learning Style
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

      // Round 3: Personality & Preferences
      brandFaceComfort: 3,
      competitivenessLevel: 3,
      creativeWorkEnjoyment: 4,
      directCommunicationEnjoyment: 4,
      workStructurePreference: "some-structure",

      // Round 4: Tools & Work Environment
      techSkillsRating: 3,
      workspaceAvailability: "yes",
      supportSystemStrength: "small-helpful-group",
      internetDeviceReliability: 4,
      familiarTools: ["google-docs-sheets", "canva"],

      // Round 5: Strategy & Decision-Making
      decisionMakingStyle: "after-some-research",
      riskComfortLevel: 3,
      feedbackRejectionResponse: 3,
      pathPreference: "mix",
      controlImportance: 4,

      // Round 6: Business Model Fit Filters
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

      // Legacy fields for backward compatibility (mapped from new fields)
      primaryMotivation: "financial-independence",
      incomeGoal: 5000,
      timeToFirstIncome: "3-6-months",
      startupBudget: 1000,
      timeCommitment: 20,
      learningStyle: "hands-on",
      workPreference: "solo-flexible",
      riskTolerance: 3,
      customerInteractionComfort: 4,
      selfMotivation: 4,
      existingSkills: ["writing", "marketing"],
      experienceLevel: "intermediate",
      lifestyle: "freedom",
      stressResponse: "manage-well",
      communicationStyle: "direct",
      perfectionismLevel: 3,
      socialEnergy: "mixed",
      changeAdaptability: 3,
      attentionToDetail: 3,
      competitionMotivation: "neutral",
      failureResponse: "learning-opportunity",
      routinePreference: "some-structure",
      feedbackReception: "welcome-constructive",
      longTermThinking: "annual-goals",
      authorityComfort: 3,
      technologyComfort: 3,
    };
  };

  return (
    <AuthProvider>
      <PaywallProvider>
        <Router>
          <Routes>
            {/* Public routes with layout */}
            <Route
              path="/"
              element={
                <Layout>
                  <Index />
                </Layout>
              }
            />

            <Route
              path="/explore"
              element={
                <Layout>
                  <BusinessExplorer />
                </Layout>
              }
            />

            <Route
              path="/success-stories"
              element={
                <Layout>
                  <SuccessStories />
                </Layout>
              }
            />

            {/* Auth routes (no layout) */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes with layout */}
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </Layout>
              }
            />

            <Route
              path="/settings"
              element={
                <Layout>
                  <Settings />
                </Layout>
              }
            />

            {/* Quiz without layout (has its own design) */}
            <Route
              path="/quiz"
              element={
                <QuizWithNavigation
                  quizData={quizData}
                  setQuizData={setQuizData}
                  showEmailCapture={showEmailCapture}
                  setShowEmailCapture={setShowEmailCapture}
                  userEmail={userEmail}
                  setUserEmail={setUserEmail}
                  generateMockQuizData={generateMockQuizData}
                />
              }
            />

            {/* Results with layout */}
            <Route
              path="/results"
              element={
                <Layout>
                  <ResultsWrapper
                    quizData={quizData}
                    userEmail={userEmail}
                    onBack={() => window.history.back()}
                  />
                </Layout>
              }
            />

            {/* Business Model Detail Page */}
            <Route
              path="/business/:businessId"
              element={<BusinessModelDetail quizData={quizData} />}
            />
          </Routes>
        </Router>
      </PaywallProvider>
    </AuthProvider>
  );
}

// Component that handles quiz navigation
const QuizWithNavigation: React.FC<{
  quizData: QuizData | null;
  setQuizData: (data: QuizData) => void;
  showEmailCapture: boolean;
  setShowEmailCapture: (show: boolean) => void;
  userEmail: string | null;
  setUserEmail: (email: string) => void;
  generateMockQuizData: () => QuizData;
}> = ({
  quizData,
  setQuizData,
  showEmailCapture,
  setShowEmailCapture,
  userEmail,
  setUserEmail,
  generateMockQuizData,
}) => {
  const navigate = useNavigate();

  const handleQuizComplete = (data: QuizData) => {
    console.log("Quiz completed, setting data and showing email capture");
    setQuizData(data);
    setShowEmailCapture(true);
  };

  const handleEmailSubmit = (email: string) => {
    console.log("Email submitted, navigating to results");
    setUserEmail(email);
    setShowEmailCapture(false);
    navigate("/results");
  };

  const handleContinueAsGuest = () => {
    console.log("Continuing as guest, navigating to results");
    setShowEmailCapture(false);
    navigate("/results");
  };

  const handleReturnToQuiz = () => {
    console.log("Returning to quiz");
    setShowEmailCapture(false);
    setQuizData(null);
    // Stay on current page (quiz)
  };

  const handleSkipToResults = () => {
    console.log("Skip button clicked! Generating mock data and navigating...");
    const mockData = generateMockQuizData();
    console.log("Generated mock data:", mockData);

    // Set the data immediately
    setQuizData(mockData);
    setUserEmail("test@example.com");
    setShowEmailCapture(false);

    console.log("Navigating to /results");
    // Navigate immediately
    navigate("/results");
  };

  return (
    <div className="relative">
      {/* TEMPORARY SKIP BUTTON - REMOVE LATER */}
      <div className="fixed bottom-4 right-4 z-[9999]">
        <button
          onClick={handleSkipToResults}
          className="bg-red-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl hover:bg-red-600 transition-all duration-300 transform hover:scale-105 border-2 border-white"
          style={{ zIndex: 9999 }}
        >
          🚀 SKIP TO RESULTS (DEV)
        </button>
      </div>

      <Quiz
        onComplete={handleQuizComplete}
        onBack={() => window.history.back()}
      />
      {showEmailCapture && quizData && (
        <EmailCapture
          onEmailSubmit={handleEmailSubmit}
          onContinueAsGuest={handleContinueAsGuest}
        />
      )}
    </div>
  );
};

// Wrapper component to handle results display
const ResultsWrapper: React.FC<{
  quizData: QuizData | null;
  userEmail: string | null;
  onBack: () => void;
}> = ({ quizData, userEmail, onBack }) => {
  console.log("ResultsWrapper received quizData:", quizData);
  console.log("ResultsWrapper received userEmail:", userEmail);

  if (quizData) {
    return (
      <Results quizData={quizData} onBack={onBack} userEmail={userEmail} />
    );
  } else {
    return (
      <div className="py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          No Results Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Please take the quiz first to see your personalized results.
        </p>
        <a
          href="/quiz"
          className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Take the Quiz
        </a>
      </div>
    );
  }
};

export default App;
