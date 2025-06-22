import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function SuccessStories() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Real People,
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent block">
                  Real Success Stories
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Discover how entrepreneurs just like you found their perfect business match 
                and transformed their lives. These aren't fairy tales—they're real stories 
                from real people who took the leap.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link
                to="/quiz"
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Start Your Success Story
              </Link>
              <Link
                to="/explore"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-green-600 hover:text-green-600 transition-all duration-200"
              >
                Explore Business Ideas
              </Link>
            </motion.div>

            {/* Success Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              {[
                { number: "10,000+", label: "Entrepreneurs Helped" },
                { number: "85%", label: "Success Rate" },
                { number: "$2.3M+", label: "Revenue Generated" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Stats/Numbers Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Numbers Don't Lie
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our personalized approach delivers real results. Here's the proof that finding your perfect business match works.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "12,847",
                label: "Entrepreneurs Matched",
                description: "People who found their perfect business fit"
              },
              {
                number: "87%",
                label: "Success Rate",
                description: "Still running their business after 2+ years"
              },
              {
                number: "$4.2M",
                label: "Total Revenue Generated",
                description: "Combined earnings of our entrepreneurs"
              },
              {
                number: "156",
                label: "Average Days to Profit",
                description: "Time from start to first profitable month"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold mb-2">
                  {stat.label}
                </div>
                <div className="text-blue-100 text-sm">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Stats Row */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "💰",
                stat: "$78K",
                label: "Average First-Year Revenue",
                description: "Median earnings in year one"
              },
              {
                icon: "⚡",
                stat: "3.2x",
                label: "Income Multiplier",
                description: "Average increase from previous job"
              },
              {
                icon: "🎯",
                stat: "94%",
                label: "Satisfaction Rate",
                description: "Would recommend to a friend"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="text-3xl font-bold mb-2">{item.stat}</div>
                <div className="text-lg font-semibold mb-1">{item.label}</div>
                <div className="text-blue-100 text-sm">{item.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Success Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Meet Our Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From corporate burnout to six-figure freedom. These entrepreneurs found their perfect match and never looked back.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {[
              {
                name: "Sarah Chen",
                business: "Digital Marketing Agency",
                image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400",
                revenue: "$180K/year",
                timeframe: "18 months",
                story: "After 12 years in corporate marketing, I was burned out and craving freedom. The quiz matched me with a digital marketing agency - perfect for my skills and lifestyle goals. Now I work with 15+ clients and have complete control over my schedule.",
                highlight: "Went from $65K salary to $180K revenue in 18 months"
              },
              {
                name: "Marcus Rodriguez",
                business: "E-commerce Store",
                image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
                revenue: "$95K/year",
                timeframe: "12 months",
                story: "I was working two jobs just to make ends meet. The quiz showed me e-commerce was perfect for my analytical mind and limited startup capital. Started with $2K, now I'm doing $95K annually selling outdoor gear.",
                highlight: "Built a profitable business with just $2K startup capital"
              },
              {
                name: "Jennifer Walsh",
                business: "Online Coaching",
                image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400",
                revenue: "$120K/year",
                timeframe: "10 months",
                story: "As a former teacher, I wanted to help people but needed better income. The quiz matched me with online coaching based on my personality and teaching background. Now I help 50+ clients achieve their fitness goals.",
                highlight: "Tripled her teaching salary in under a year"
              },
              {
                name: "David Kim",
                business: "SaaS Product",
                image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
                revenue: "$250K/year",
                timeframe: "24 months",
                story: "I had the technical skills but no business direction. The quiz identified SaaS as my perfect match - leveraging my coding background with scalable income potential. My project management tool now serves 500+ businesses.",
                highlight: "Created a SaaS serving 500+ businesses worldwide"
              }
            ].map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{story.name}</h3>
                    <p className="text-blue-600 font-semibold">{story.business}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-green-600 font-bold">{story.revenue}</span>
                      <span className="text-gray-500">in {story.timeframe}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  "{story.story}"
                </p>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-800">
                    🎯 {story.highlight}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What Our Entrepreneurs Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what real entrepreneurs say about finding their perfect business match.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "This quiz saved me years of trial and error. It pinpointed exactly what type of business would work for my personality and lifestyle. Best decision I ever made!",
                name: "Alex Thompson",
                business: "Dropshipping Store",
                rating: 5
              },
              {
                quote: "I was skeptical at first, but the recommendations were spot-on. The quiz understood my strengths better than I did and matched me with the perfect business model.",
                name: "Maria Santos",
                business: "Freelance Design Agency",
                rating: 5
              },
              {
                quote: "Finally, a tool that doesn't just throw generic business ideas at you. The personalized approach made all the difference in my success.",
                name: "James Wilson",
                business: "Online Course Creator",
                rating: 5
              },
              {
                quote: "The detailed action plan that came with my results was incredible. It felt like having a business mentor guide me step-by-step.",
                name: "Lisa Chang",
                business: "Consulting Firm",
                rating: 5
              },
              {
                quote: "I went from confused and overwhelmed to having a clear path forward. The quiz results gave me the confidence to finally take action.",
                name: "Robert Davis",
                business: "Local Service Business",
                rating: 5
              },
              {
                quote: "Worth every minute! The quiz helped me avoid businesses that wouldn't fit my lifestyle and pointed me toward my perfect match.",
                name: "Emma Johnson",
                business: "Content Creation",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.quote}"
                </p>
                
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-blue-600 text-sm">{testimonial.business}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Your Success Story Starts Here
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of entrepreneurs who've found their perfect business match. 
              Stop wondering "what if" and start building your dream business today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                to="/quiz"
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-12 py-4 rounded-lg font-semibold text-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Take the Quiz Now
              </Link>
              <Link
                to="/explore"
                className="border-2 border-gray-600 text-gray-300 px-12 py-4 rounded-lg font-semibold text-xl hover:border-green-600 hover:text-green-400 transition-all duration-200"
              >
                Browse Business Ideas
              </Link>
            </div>

            <div className="text-gray-400 text-sm">
              ✓ Free to take  ✓ Results in 15 minutes  ✓ No credit card required
            </div>
          </motion.div>
        </div>

        {/* Trust indicators */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="border-t border-gray-700 pt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "4.9/5", label: "Average Rating" },
                { number: "15 min", label: "Quiz Duration" },
                { number: "100%", label: "Free to Use" },
                { number: "24/7", label: "Instant Results" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {item.number}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SuccessStories;