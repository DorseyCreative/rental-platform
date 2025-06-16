'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Globe, 
  Palette, 
  Database,
  CheckCircle,
  Play,
  Star,
  TrendingUp,
  Users,
  Package
} from 'lucide-react'

export default function LandingPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <div className="relative bg-white overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">RentalAI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/demo" className="text-gray-600 hover:text-gray-900 transition-colors">Demo</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
            <Link href="/master-admin" className="text-gray-600 hover:text-gray-900 transition-colors">Admin</Link>
            <Link href="/onboarding">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-purple-200"
            >
              <Zap className="w-4 h-4" />
              AI-Powered Setup in 60 Seconds
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Your Rental Business
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600">
                Automated by AI
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Just enter your website URL. Our AI extracts your branding, imports your data, 
              and launches a fully customized rental management system in minutes.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center mb-12">
              <Link href="/onboarding">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-medium inline-flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <motion.button
                onClick={() => setIsVideoPlaying(true)}
                className="bg-white text-gray-900 px-8 py-4 rounded-xl font-medium inline-flex items-center gap-2 border-2 border-gray-200 hover:border-gray-300 transition-all"
              >
                <Play className="w-5 h-5" />
                Watch 2-min Demo
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>4.9/5 rating</span>
              </div>
              <div>500+ businesses automated</div>
              <div>Setup in &lt; 5 minutes</div>
            </div>
          </motion.div>

          {/* Hero Image/Demo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="relative mx-auto max-w-5xl">
              {/* Browser Chrome */}
              <div className="bg-gray-100 rounded-t-xl p-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-500">
                  yourbusiness.rentalai.com
                </div>
              </div>
              
              {/* Dashboard Preview */}
              <div className="bg-white rounded-b-xl shadow-2xl p-8 border border-gray-100">
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <Package className="w-8 h-8 text-purple-600" />
                      <span className="text-xs text-purple-600 font-medium">+12%</span>
                    </div>
                    <div className="text-2xl font-bold mb-1">156</div>
                    <div className="text-sm text-gray-600">Total Equipment</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="w-8 h-8 text-blue-600" />
                      <span className="text-xs text-blue-600 font-medium">+23%</span>
                    </div>
                    <div className="text-2xl font-bold mb-1">1,248</div>
                    <div className="text-sm text-gray-600">Active Customers</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">+18%</span>
                    </div>
                    <div className="text-2xl font-bold mb-1">$84.5K</div>
                    <div className="text-sm text-gray-600">Monthly Revenue</div>
                  </div>
                </div>
                
                {/* Chart Placeholder */}
                <div className="bg-gray-50 rounded-xl h-48 flex items-center justify-center">
                  <div className="text-gray-400">Your branded dashboard here</div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -right-10 top-20 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"></div>
              <div>
                <div className="text-sm font-semibold">Your Logo</div>
                <div className="text-xs text-gray-500">Auto-extracted</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -left-10 bottom-20 bg-white rounded-xl shadow-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Palette className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold">Brand Colors</span>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-purple-600 rounded"></div>
                <div className="w-6 h-6 bg-pink-600 rounded"></div>
                <div className="w-6 h-6 bg-orange-600 rounded"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-32 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Setup Your Business in 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> 4 Simple Steps</span>
            </h2>
            <p className="text-xl text-gray-600">Our AI handles everything automatically</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Globe,
                title: "Enter Your URL",
                description: "Just provide your business website",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Sparkles,
                title: "AI Extracts Everything",
                description: "Logo, colors, business info, services",
                color: "from-pink-500 to-orange-500"
              },
              {
                icon: Database,
                title: "Import Your Data",
                description: "Upload existing equipment & customers",
                color: "from-orange-500 to-yellow-500"
              },
              {
                icon: CheckCircle,
                title: "Launch Your System",
                description: "Fully branded & ready to use",
                color: "from-yellow-500 to-green-500"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connection Line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent -z-10"></div>
                )}
                
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                  <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-6`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-16 text-white shadow-2xl"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Rental Business?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join 500+ businesses already using AI-powered rental management
            </p>
            <Link href="/onboarding">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Start Your Free Trial
              </motion.button>
            </Link>
            <p className="mt-4 text-sm text-white/70">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}