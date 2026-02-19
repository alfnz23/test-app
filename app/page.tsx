'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import StudioCard from '@/components/StudioCard'
import ProductCard from '@/components/ProductCard'
import BookingForm from '@/components/BookingForm'
import type { Product, Cart } from '@/types/product'
import { SESSION_TYPES, STUDIO_ROOMS } from '@/types/booking'

const supabase = createClient()

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  const animate = () => {
    if (hasAnimated) return
    setHasAnimated(true)
    
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOut * target))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }

  return { count, animate }
}

function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.5 })
  const { count, animate } = useAnimatedCounter(target)

  useEffect(() => {
    if (isInView) {
      animate()
    }
  }, [isInView, animate])

  return (
    <span ref={ref} className="font-black text-4xl md:text-6xl">
      {prefix}{count}{suffix}
    </span>
  )
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 })
  const [bookingForm, setBookingForm] = useState({
    isOpen: false,
    selectedStudio: '',
    selectedDate: ''
  })
  
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -200])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Load products
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.items.find(item => item.product.id === product.id)
      let newItems = []
      
      if (existingItem) {
        newItems = prev.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newItems = [...prev.items, { product, quantity: 1 }]
      }
      
      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      return { items: newItems, total }
    })
  }

  const openBookingForm = (studioId: string = '', date: string = '') => {
    setBookingForm({ isOpen: true, selectedStudio: studioId, selectedDate: date })
  }

  const closeBookingForm = () => {
    setBookingForm({ isOpen: false, selectedStudio: '', selectedDate: '' })
  }

  // Kinetic Hero Title Animation
  const title = "REDLINE STUDIOS"
  const subtitle = "WHERE LEGENDS ARE RECORDED"

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06
      }
    }
  }

  const letterVariants = {
    hidden: { 
      y: 100, 
      opacity: 0, 
      scale: 0.3, 
      rotateX: 90 
    },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1, 
      rotateX: 0,
      rotateY: [0, 360],
      transition: {
        y: { duration: 0.8, type: "spring", bounce: 0.4 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.8, type: "spring" },
        rotateX: { duration: 0.8 },
        rotateY: { 
          delay: 2, 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }
      }
    }
  }

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        id="home" 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-red-900/20 via-transparent to-transparent" />
        
        <div className="text-center z-10 px-4">
          <motion.h1 
            className="text-7xl md:text-9xl font-black tracking-tighter text-white mb-6"
            style={{
              textShadow: "0 0 40px rgba(220,38,38,0.6), 0 0 80px rgba(220,38,38,0.3)"
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {title.split('').map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block"
                variants={letterVariants}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-3xl text-gray-300 tracking-wider font-space-grotesk"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            {subtitle}
          </motion.p>
          
          <motion.button
            onClick={() => openBookingForm()}
            className="mt-12 px-12 py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold text-lg rounded-full hover:from-red-500 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-red-500/20"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, type: "spring", bounce: 0.6 }}
            whileHover={{ 
              boxShadow: "0 0 30px rgba(220,38,38,0.5)",
              y: -5 
            }}
            whileTap={{ scale: 0.95 }}
          >
            BOOK YOUR SESSION
          </motion.button>
        </div>

        {/* Animated scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ 
            opacity: { delay: 3, duration: 0.5 },
            y: { delay: 3, duration: 2, repeat: Infinity }
          }}
        >
          <div className="w-6 h-10 border-2 border-red-500 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-red-500 rounded-full mt-2 animate-bounce" />
          </div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-24 bg-gradient-to-b from-black via-red-950/10 to-black"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Albums Recorded', value: 500, suffix: '+' },
              { label: 'Artists Served', value: 1200, suffix: '+' },
              { label: 'Years Experience', value: 15, suffix: '' },
              { label: 'Awards Won', value: 28, suffix: '' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-red-500 mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-gray-400 text-sm uppercase tracking-wide">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section
        id="about"
        className="py-24 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-5xl md:text-7xl font-black text-white mb-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            PREMIUM SOUND
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 leading-relaxed mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            With state-of-the-art equipment, world-class acoustics, and Grammy-winning engineers, 
            REDLINE Studios delivers uncompromising quality for artists who demand excellence.
          </motion.p>
        </div>
      </motion.section>

      {/* Session Types */}
      <motion.section
        id="booking"
        className="py-24 px-4 bg-gradient-to-b from-black via-red-950/5 to-black"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-5xl md:text-7xl font-black text-white text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            OUR SERVICES
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(SESSION_TYPES).map(([key, type], index) => (
              <motion.div
                key={key}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-red-500/30 transition-all duration-300 cursor-pointer group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 40px rgba(220,38,38,0.1)"
                }}
                onClick={() => openBookingForm()}
              >
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors">
                  {type.label}
                </h3>
                <p className="text-gray-400 mb-6">
                  {type.description}
                </p>
                <div className="text-red-500 font-bold text-xl">
                  ${type.basePrice}/hour
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Studio Rooms */}
      <motion.section
        className="py-24 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-5xl md:text-7xl font-black text-white text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            OUR STUDIOS
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(STUDIO_ROOMS).map(([key, room], index) => (
              <StudioCard
                key={key}
                studio={{
                  id: key,
                  name: room.label,
                  description: room.description,
                  image: `/studios/${key}.jpg`,
                  capacity: room.capacity,
                  hourlyRate: room.basePrice
                }}
                onBook={(studioId) => openBookingForm(studioId)}
                delay={index * 0.2}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Merchandise Section */}
      <motion.section
        id="merch"
        className="py-24 px-4 bg-gradient-to-b from-black via-red-950/5 to-black"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-5xl md:text-7xl font-black text-white text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            MERCHANDISE
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                delay={index * 0.1}
              />
            ))}
          </div>
          
          {cart.items.length > 0 && (
            <motion.div
              className="fixed bottom-8 right-8 bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl z-50"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              Cart: {cart.items.length} items - ${cart.total.toFixed(2)}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        className="py-24 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-5xl md:text-7xl font-black text-white mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            GET IN TOUCH
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { label: 'Phone', value: '(555) 123-4567' },
              { label: 'Email', value: 'info@redlinestudios.com' },
              { label: 'Address', value: '123 Music Row, Nashville, TN' }
            ].map((contact, index) => (
              <motion.div
                key={contact.label}
                className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-red-500 font-bold mb-2">{contact.label}</h3>
                <p className="text-white">{contact.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Booking Form Modal */}
      <BookingForm
        isOpen={bookingForm.isOpen}
        onClose={closeBookingForm}
        selectedStudio={bookingForm.selectedStudio}
        selectedDate={bookingForm.selectedDate}
      />
    </>
  )
}