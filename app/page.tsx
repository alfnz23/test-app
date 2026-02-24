'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import { ShoppingBag, Calendar, MapPin, Clock, ExternalLink, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { MerchProduct, Show } from '@/types/product'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'
import ShowCard from '@/components/ShowCard'
import BookingForm from '@/components/BookingForm'

interface CartItem extends MerchProduct {
  quantity: number
}

export default function HomePage() {
  const [shows, setShows] = useState<Show[]>([])
  const [products, setProducts] = useState<MerchProduct[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabase = createClient()
    
    try {
      const [showsResponse, productsResponse] = await Promise.all([
        supabase.from('shows').select('*').order('event_date', { ascending: true }),
        supabase.from('merch_products').select('*').eq('in_stock', true).order('featured', { ascending: false })
      ])

      if (showsResponse.data) setShows(showsResponse.data)
      if (productsResponse.data) setProducts(productsResponse.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: MerchProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      )
    )
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Kinetic letter animation for hero title
  const titleLetters = "REVOLOVERS".split("")
  
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-600 to-rose-600 z-50"
        style={{ scaleX }}
      />

      <Navbar cartCount={cartCount} />

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-950/20 to-stone-950/80" />
        
        <div className="relative z-10 text-center px-4">
          {/* Kinetic Title Animation */}
          <div className="mb-8 overflow-hidden">
            <motion.h1 
              className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300"
              initial="hidden"
              animate="visible"
            >
              {titleLetters.map((letter, index) => (
                <motion.span
                  key={index}
                  className="inline-block"
                  variants={{
                    hidden: { 
                      opacity: 0,
                      y: 100,
                      rotate: Math.random() * 20 - 10,
                      scale: 0.5
                    },
                    visible: { 
                      opacity: 1,
                      y: 0,
                      rotate: 0,
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 12,
                        delay: index * 0.1
                      }
                    }
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.h1>
          </div>

          <motion.p
            className="text-xl md:text-2xl text-stone-300 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            Cinematic grunge blues from the underground. Born to bleed, built to last.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.a
              href="#shows"
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-lg shadow-lg hover:shadow-amber-600/25 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Tour Dates
            </motion.a>
            <motion.a
              href="#merch"
              className="px-8 py-3 border border-stone-600 text-stone-300 font-bold rounded-lg backdrop-blur-sm hover:bg-stone-800/30 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Shop Merch
            </motion.a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-stone-500 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-amber-600 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Shows Section */}
      <section id="shows" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400 mb-4">
              TOUR DATES
            </h2>
            <p className="text-xl text-stone-400 max-w-2xl mx-auto">
              Catch us live. Raw energy, no filters.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-stone-800/30 rounded-xl animate-pulse backdrop-blur-sm" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shows.map((show, index) => (
                <motion.div
                  key={show.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <ShowCard show={show} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Merch Section */}
      <section id="merch" className="py-20 px-4 bg-stone-900/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400 mb-4">
              MERCHANDISE
            </h2>
            <p className="text-xl text-stone-400 max-w-2xl mx-auto">
              Wear the rebellion. Support the sound.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-stone-800/30 rounded-xl animate-pulse backdrop-blur-sm" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <ProductCard product={product} addToCart={addToCart} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400 mb-4">
              BOOK THE BAND
            </h2>
            <p className="text-xl text-stone-400 max-w-2xl mx-auto">
              Ready to bring the thunder? Let's make it happen.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <BookingForm />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-stone-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-black text-amber-400 mb-4">REVOLOVERS</h3>
              <p className="text-stone-400 leading-relaxed">
                Grunge blues from the underground. Born to bleed, built to last.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-stone-300 mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="#shows" className="block text-stone-400 hover:text-amber-400 transition-colors">
                  Tour Dates
                </a>
                <a href="#merch" className="block text-stone-400 hover:text-amber-400 transition-colors">
                  Merchandise
                </a>
                <a href="#booking" className="block text-stone-400 hover:text-amber-400 transition-colors">
                  Book Us
                </a>
                <a href="/login" className="block text-stone-400 hover:text-amber-400 transition-colors">
                  Band Portal
                </a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold text-stone-300 mb-4">Connect</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-stone-400">
                  <Mail className="w-5 h-5" />
                  <span>booking@revolovers.band</span>
                </div>
                <div className="flex items-center gap-3 text-stone-400">
                  <Phone className="w-5 h-5" />
                  <span>(615) 555-ROCK</span>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <motion.a
                  href="#"
                  className="w-10 h-10 bg-stone-800/50 backdrop-blur-sm rounded-full flex items-center justify-center text-stone-400 hover:text-amber-400 hover:bg-stone-700/50 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Instagram className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="#"
                  className="w-10 h-10 bg-stone-800/50 backdrop-blur-sm rounded-full flex items-center justify-center text-stone-400 hover:text-amber-400 hover:bg-stone-700/50 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Facebook className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="#"
                  className="w-10 h-10 bg-stone-800/50 backdrop-blur-sm rounded-full flex items-center justify-center text-stone-400 hover:text-amber-400 hover:bg-stone-700/50 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Twitter className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-800/50 text-center text-stone-500">
            <p>&copy; 2024 REVOLOVERS. All rights reserved. Built for the underground.</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              className="fixed right-0 top-0 h-full w-full max-w-md bg-stone-900/90 backdrop-blur-xl border-l border-stone-800/50 z-50 p-6 overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-amber-400">Cart ({cartCount})</h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-stone-400 hover:text-stone-200 transition-colors"
                >
                  ×
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-stone-400 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-8">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-stone-800/30 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-stone-200">{item.name}</h4>
                          <p className="text-amber-400 font-bold">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-stone-700 rounded text-stone-300 hover:bg-stone-600 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-stone-200">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-stone-700 rounded text-stone-300 hover:bg-stone-600 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-stone-800 pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xl font-bold text-stone-200">Total:</span>
                      <span className="text-2xl font-bold text-amber-400">${cartTotal.toFixed(2)}</span>
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-amber-600 to-rose-600 text-white font-bold rounded-lg hover:shadow-lg transition-all">
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Toggle Button */}
      {cartCount > 0 && (
        <motion.button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-amber-600 to-rose-600 rounded-full flex items-center justify-center shadow-lg z-30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <ShoppingBag className="w-6 h-6 text-white" />
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-rose-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
            {cartCount}
          </span>
        </motion.button>
      )}
    </div>
  )
}