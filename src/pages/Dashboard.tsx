import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Award, Calendar, ArrowRight, BookOpen, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      icon: BarChart3,
      label: 'Quiz Completed',
      value: '1',
      change: '+100%',
      color: 'blue'
    },
    {
      icon: TrendingUp,
      label: 'Business Matches',
      value: '12',
      change: 'Updated',
      color: 'green'
    },
    {
      icon: Users,
      label: 'Community Rank',
      value: '#2,847',
      change: '+156',
      color: 'purple'
    },
    {
      icon: Award,
      label: 'Achievement Points',
      value: '150',
      change: '+25',
      color: 'orange'
    }
  ];

  const recentActivity = [
    {
      action: 'Completed Business Path Quiz',
      time: '2 hours ago',
      icon: BookOpen,
      color: 'blue'
    },
    {
      action: 'Viewed Content Creation results',
      time: '2 hours ago',
      icon: Target,
      color: 'green'
    },
    {
      action: 'Joined Business Path community',
      time: '1 day ago',
      icon: Users,
      color: 'purple'
    }
  ];

  const quickActions = [
    {
      title: 'Retake Quiz',
      description: 'Update your preferences and get new recommendations',
      href: '/quiz',
      icon: BookOpen,
      color: 'blue'
    },
    {
      title: 'View Results',
      description: 'See your personalized business recommendations',
      href: '/results',
      icon: Target,
      color: 'green'
    },
    {
      title: 'Explore Models',
      description: 'Browse all available business models',
      href: '/explore',
      icon: BarChart3,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Here's your entrepreneurial journey overview
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <span className={`text-sm font-medium text-${stat.color}-600 bg-${stat.color}-50 px-2 py-1 rounded-full`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-${action.color}-100 rounded-xl flex items-center justify-center`}>
                      <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 bg-${activity.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <activity.icon className={`h-4 w-4 text-${activity.color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Entrepreneurial Journey</h2>
                <p className="text-blue-100 mb-6">
                  You've taken the first step! Continue building your business knowledge and skills.
                </p>
                <div className="flex space-x-4">
                  <Link
                    to="/quiz"
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Retake Quiz
                  </Link>
                  <Link
                    to="/explore"
                    className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                  >
                    Explore More
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                  <Award className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;