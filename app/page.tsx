'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const useAnimatedCounter = (target: number) => {
  const [count, setCount] = useState(0)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (animate) {
      const duration = 2000
      const startTime = Date.now()
      const startValue = 0

      const updateCount = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentCount = Math.floor(startValue + (target - startValue) * easeOutQuart)
        
        setCount(currentCount)
        
        if (progress < 1) {
          requestAnimationFrame(updateCount)
        } else {
          setCount(target)
        }
      }
      
      requestAnimationFrame(updateCount)
    }
  }, [animate, target])

  return { count, animate: () => setAnimate(true) }
}

function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const { count, animate } = useAnimatedCounter(target)

  useEffect(() => {
    if (isInView) {
      animate()
    }
  }, [isInView, animate])

  return <span ref={ref}>{prefix}{count}{suffix}</span>
}

export default function Home() {
  const controls = useAnimation()
  const heroRef = useRef(null)
  const isInView = useInView(heroRef, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start("animate")
    }
  }, [isInView, controls])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Hero Section */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-spin-slow"></div>
          </div>

          <motion.div 
            className="container mx-auto px-4 text-center z-10"
            variants={stagger}
            initial="initial"
            animate={controls}
          >
            <motion.div
              variants={fadeInUp}
              className="mb-8"
            >
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6 tracking-tight">
                Redline
                <span className="block text-4xl md:text-6xl font-light text-purple-300 mt-2">
                  Recording Studio
                </span>
              </h1>
            </motion.div>

            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Where creativity meets cutting-edge technology. Professional recording, mixing, and mastering services in the heart of the city.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link href="/booking">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-2xl transition-all duration-300 backdrop-blur-sm border border-white/10"
                >
                  Book a Session
                </motion.button>
              </Link>
              
              <Link href="/services">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full text-lg font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-xl"
                >
                  Our Services
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-white/60 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
                <h3 className="text-5xl font-bold text-white mb-2">
                  <AnimatedCounter target={500} suffix="+" />
                </h3>
                <p className="text-gray-300 text-lg">Albums Recorded</p>
              </div>
              
              <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
                <h3 className="text-5xl font-bold text-white mb-2">
                  <AnimatedCounter target={15} />
                </h3>
                <p className="text-gray-300 text-lg">Years of Experience</p>
              </div>
              
              <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
                <h3 className="text-5xl font-bold text-white mb-2">
                  <AnimatedCounter target={98} suffix="%" />
                </h3>
                <p className="text-gray-300 text-lg">Client Satisfaction</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold text-white mb-6">Why Choose Redline?</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                State-of-the-art equipment, experienced engineers, and a passion for perfect sound.
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[
                {
                  title: "Professional Equipment",
                  description: "Industry-standard gear including Pro Tools, SSL consoles, and premium microphones.",
                  icon: "🎛️"
                },
                {
                  title: "Expert Engineers",
                  description: "Our team has worked with Grammy-winning artists and major record labels.",
                  icon: "👨‍🎤"
                },
                {
                  title: "Flexible Packages",
                  description: "From single sessions to full album production, we have packages for every need.",
                  icon: "📦"
                },
                {
                  title: "Prime Location",
                  description: "Located in the heart of the music district with easy access and parking.",
                  icon: "📍"
                },
                {
                  title: "24/7 Availability",
                  description: "Book sessions any time that works for your creative flow.",
                  icon: "🕒"
                },
                {
                  title: "Remote Mixing",
                  description: "Send us your tracks and we'll deliver professionally mixed results.",
                  icon: "🌐"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 hover:border-purple-500/30 transition-all duration-300 group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-5xl font-bold text-white mb-8">Ready to Create Something Amazing?</h2>
              <p className="text-xl text-gray-300 mb-12">
                Join hundreds of artists who have brought their vision to life at Redline Recording Studio.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/booking">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-5 rounded-full text-xl font-semibold shadow-2xl transition-all duration-300"
                  >
                    Book Your Session Now
                  </motion.button>
                </Link>
                
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-full text-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    Get in Touch
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  )
}