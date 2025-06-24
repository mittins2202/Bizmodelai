import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle, 
  HelpCircle, 
  Users, 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Zap,
  Heart,
  Shield
} from 'lucide-react';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitStatus('success');
    setIsSubmitting(false);
    
    // Reset form after success
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
      setSubmitStatus('idle');
    }, 3000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      contact: 'support@businesspath.com',
      action: 'Send Email',
      color: 'blue'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our team in real-time',
      contact: 'Available 9 AM - 6 PM EST',
      action: 'Start Chat',
      color: 'green'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our experts',
      contact: '+1 (555) 123-4567',
      action: 'Call Now',
      color: 'purple'
    }
  ];

  const faqCategories = [
    {
      icon: HelpCircle,
      title: 'Quiz Questions',
      description: 'Help with taking the assessment',
      color: 'blue'
    },
    {
      icon: Users,
      title: 'Business Models',
      description: 'Understanding your recommendations',
      color: 'green'
    },
    {
      icon: Shield,
      title: 'Account & Billing',
      description: 'Payment and account issues',
      color: 'purple'
    },
    {
      icon: Zap,
      title: 'Technical Support',
      description: 'Website and platform help',
      color: 'orange'
    }
  ];

  const officeInfo = {
    address: '123 Innovation Drive, Suite 400',
    city: 'San Francisco, CA 94105',
    hours: 'Monday - Friday: 9:00 AM - 6:00 PM PST',
    timezone: 'Pacific Standard Time'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Get in Touch
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  We're Here to Help
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Have questions about your business path? Need help with the quiz? 
                Our team of entrepreneurship experts is ready to support your journey to success.
              </p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16"
            >
              {[
                { icon: Clock, stat: "< 24hrs", label: "Average Response Time" },
                { icon: Users, stat: "10,000+", label: "Entrepreneurs Helped" },
                { icon: Heart, stat: "4.9/5", label: "Customer Satisfaction" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <item.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{item.stat}</div>
                  <div className="text-gray-600 text-sm">{item.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Choose Your Preferred Contact Method
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer multiple ways to get in touch. Pick the option that works best for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] text-center"
              >
                <div className={`w-16 h-16 bg-${method.color}-100 rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <method.icon className={`h-8 w-8 text-${method.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{method.title}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <div className="text-lg font-semibold text-gray-900 mb-6">{method.contact}</div>
                <button className={`w-full bg-${method.color}-600 text-white py-3 rounded-lg font-semibold hover:bg-${method.color}-700 transition-colors flex items-center justify-center`}>
                  {method.action}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Send Us a Message
            </h2>
            <p className="text-xl text-gray-600">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
          >
            {submitStatus === 'success' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h3>
                <p className="text-gray-600 mb-6">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Category and Subject Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="quiz">Quiz Help</option>
                      <option value="business">Business Model Questions</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing & Account</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Please provide details about your question or how we can help you..."
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center mx-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-3" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Common Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse our help categories to find quick answers to frequently asked questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {faqCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className={`w-12 h-12 bg-${category.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <category.icon className={`h-6 w-6 text-${category.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Information */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Visit Our Office
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Located in the heart of San Francisco's innovation district, 
                our team is passionate about helping entrepreneurs succeed.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-blue-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">{officeInfo.address}</div>
                    <div className="text-gray-300">{officeInfo.city}</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-blue-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Office Hours</div>
                    <div className="text-gray-300">{officeInfo.hours}</div>
                    <div className="text-gray-400 text-sm">{officeInfo.timezone}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-800 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">Why Choose Business Path?</h3>
              <div className="space-y-4">
                {[
                  "AI-powered personalized recommendations",
                  "Expert team with 15+ years experience",
                  "10,000+ successful entrepreneurs guided",
                  "Comprehensive business model database",
                  "24/7 support and resources"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Discover Your Perfect Business Path?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Don't wait any longer. Take our AI-powered quiz and get personalized 
              business recommendations in just 15 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors">
                Take the Quiz Now
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors">
                Browse Business Models
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;