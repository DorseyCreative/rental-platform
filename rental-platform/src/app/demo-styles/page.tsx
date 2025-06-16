'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap } from 'lucide-react'

export default function DemoStylesPage() {
  const [selectedStyle, setSelectedStyle] = useState<'apple' | 'stripe' | 'linear'>('apple')

  return (
    <div className="min-h-screen bg-white">
      {/* Style Selector */}
      <div className="fixed top-4 right-4 z-50 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-2 border border-gray-200/50">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedStyle('apple')}
            className={`px-4 py-2 rounded-xl transition-all ${
              selectedStyle === 'apple' 
                ? 'bg-black text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            Apple Style
          </button>
          <button
            onClick={() => setSelectedStyle('stripe')}
            className={`px-4 py-2 rounded-xl transition-all ${
              selectedStyle === 'stripe' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            Stripe Style
          </button>
          <button
            onClick={() => setSelectedStyle('linear')}
            className={`px-4 py-2 rounded-xl transition-all ${
              selectedStyle === 'linear' 
                ? 'bg-gray-900 text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            Linear Style
          </button>
        </div>
      </div>

      {/* Apple Style */}
      {selectedStyle === 'apple' && (
        <div className="relative">
          {/* Hero Section */}
          <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Video Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
            </div>
            
            {/* Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
              className="relative z-10 text-center max-w-5xl mx-auto px-6"
            >
              <h1 className="text-7xl md:text-8xl font-semibold tracking-tight text-gray-900 mb-6">
                Rental Business
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                  Reimagined
                </span>
              </h1>
              <p className="text-2xl text-gray-600 mb-12 font-light max-w-3xl mx-auto">
                The most advanced rental management platform. Powered by AI, designed for growth.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-8 py-4 rounded-full text-lg font-medium inline-flex items-center gap-2 hover:bg-gray-800 transition-colors"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{ 
                y: [-10, 10, -10],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-3xl blur-3xl"
            />
            <motion.div
              animate={{ 
                y: [10, -10, 10],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-3xl blur-3xl"
            />
          </section>

          {/* Feature Cards */}
          <section className="py-32 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="grid md:grid-cols-3 gap-8"
              >
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6"></div>
                    <h3 className="text-2xl font-semibold mb-4">AI-Powered Setup</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Our AI analyzes your website and automatically configures your perfect rental system.
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        </div>
      )}

      {/* Stripe Style */}
      {selectedStyle === 'stripe' && (
        <div className="relative bg-white">
          {/* Animated Gradient Background */}
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          {/* Content */}
          <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-5xl"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                AI-Powered Platform
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600">
                  Transform Your Rental Business
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                The modern way to manage equipment rentals. Beautiful, powerful, and surprisingly simple.
              </p>

              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-medium inline-flex items-center gap-2 shadow-xl"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <button className="bg-white text-gray-900 px-8 py-4 rounded-xl font-medium border-2 border-gray-200 hover:border-gray-300 transition-colors">
                  Watch Demo
                </button>
              </div>
            </motion.div>
          </section>

          {/* Floating Cards */}
          <section className="relative z-10 py-32 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-6 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Lightning Fast</h3>
                    <p className="text-gray-600">
                      Get up and running in minutes with our intelligent setup wizard.
                    </p>
                  </motion.div>
                ))}
              </div>
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
      )}

      {/* Linear Style */}
      {selectedStyle === 'linear' && (
        <div className="relative bg-black text-white min-h-screen">
          {/* Grid Background */}
          <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          
          {/* Glow Effects */}
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px]"></div>
          <div className="fixed bottom-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full blur-[120px]"></div>

          {/* Content */}
          <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-5xl"
            >
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                Next Generation Platform
              </div>

              <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
                Rental Business
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  Infrastructure
                </span>
              </h1>

              <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                The most sophisticated rental management system. Built for scale, designed for speed.
              </p>

              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-black px-8 py-4 rounded-lg font-medium inline-flex items-center gap-2 hover:bg-gray-100 transition-colors"
                >
                  Deploy Now
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <button className="bg-transparent text-white px-8 py-4 rounded-lg font-medium border border-gray-800 hover:border-gray-600 transition-colors">
                  Documentation
                </button>
              </div>
            </motion.div>
          </section>

          {/* Feature Grid */}
          <section className="relative z-10 py-32 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-px bg-gray-800/50 rounded-2xl overflow-hidden">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-black p-8 hover:bg-gray-900/50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg mb-6 group-hover:scale-110 transition-transform"></div>
                  <h3 className="text-xl font-semibold mb-4">Enterprise Ready</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Built for the most demanding rental operations.
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}