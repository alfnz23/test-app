'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import type { BookingFormData } from '@/types/booking'
import { SESSION_TYPES, STUDIO_ROOMS } from '@/types/booking'

interface BookingFormProps {
  isOpen: boolean
  onClose: () => void
  selectedStudio?: string
  selectedDate?: string
}

const HOURLY_RATES = {
  studio_a: 150,
  studio_b: 125,
  live_room: 175
}

export default function BookingForm({ isOpen, onClose, selectedStudio, selectedDate }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    session_type: 'recording',
    studio_room: (selectedStudio as 'studio_a' | 'studio_b' | 'live_room') || 'studio_a',
    booking_date: selectedDate || '',
    start_time: '',
    duration_hours: 2,
    notes: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const calculatePrice = () => {
    const rate = HOURLY_RATES[formData.studio_room as keyof typeof HOURLY_RATES] || 150
    return rate * formData.duration_hours
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration_hours' ? parseInt(value) : value
    }))
    setError('')
  }

  const validateForm = (): boolean => {
    if (!formData.customer_name.trim()) {
      setError('Name is required')
      return false
    }
    if (!formData.customer_email.trim()) {
      setError('Email is required')
      return false
    }
    if (!formData.booking_date) {
      setError('Date is required')
      return false
    }
    if (!formData.start_time) {
      setError('Start time is required')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setError('')

    try {
      const bookingData = {
        ...formData,
        total_price: calculatePrice(),
        status: 'pending'
      }

      const { error: supabaseError } = await supabase
        .from('bookings')
        .insert([bookingData])

      if (supabaseError) throw supabaseError

      setShowSuccess(true)
      
      // Reset form after success animation
      setTimeout(() => {
        setFormData({
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          session_type: 'recording',
          studio_room: 'studio_a',
          booking_date: '',
          start_time: '',
          duration_hours: 2,
          notes: ''
        })
        setShowSuccess(false)
        onClose()
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl relative"
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              boxShadow: '0 0 50px rgba(220, 38, 38, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Animation */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/90 rounded-2xl z-10"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-6xl mb-4"
                    >
                      ✅
                    </motion.div>
                    <motion.h3
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-2xl font-bold text-white mb-2"
                    >
                      Booking Submitted!
                    </motion.h3>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-gray-300"
                    >
                      We'll confirm your session within 24 hours
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Book Your Session</h2>
                <p className="text-gray-400 mt-1">Reserve your time at REDLINE Studios</p>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-sm font-bold">1</span>
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <motion.input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                      placeholder="Your full name"
                      whileFocus={{ scale: 1.02 }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone
                    </label>
                    <motion.input
                      type="tel"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                      placeholder="(555) 123-4567"
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <motion.input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                    placeholder="your@email.com"
                    whileFocus={{ scale: 1.02 }}
                    required
                  />
                </div>
              </div>

              {/* Session Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-sm font-bold">2</span>
                  Session Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Session Type
                    </label>
                    <motion.select
                      name="session_type"
                      value={formData.session_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                      whileFocus={{ scale: 1.02 }}
                    >
                      {Object.entries(SESSION_TYPES).map(([key, label]) => (
                        <option key={key} value={key} className="bg-gray-800">
                          {label}
                        </option>
                      ))}
                    </motion.select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Studio Room
                    </label>
                    <motion.select
                      name="studio_room"
                      value={formData.studio_room}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                      whileFocus={{ scale: 1.02 }}
                    >
                      {Object.entries(STUDIO_ROOMS).map(([key, label]) => (
                        <option key={key} value={key} className="bg-gray-800">
                          {label}
                        </option>
                      ))}
                    </motion.select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date *
                    </label>
                    <motion.input
                      type="date"
                      name="booking_date"
                      value={formData.booking_date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                      whileFocus={{ scale: 1.02 }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Time *
                    </label>
                    <motion.input
                      type="time"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                      whileFocus={{ scale: 1.02 }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration (hours)
                    </label>
                    <motion.select
                      name="duration_hours"
                      value={formData.duration_hours}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                      whileFocus={{ scale: 1.02 }}
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(hours => (
                        <option key={hours} value={hours} className="bg-gray-800">
                          {hours} hour{hours > 1 ? 's' : ''}
                        </option>
                      ))}
                    </motion.select>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Notes
                </label>
                <motion.textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-none"
                  placeholder="Any special requirements or questions?"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>

              {/* Price Summary */}
              <motion.div
                className="p-4 rounded-lg border border-red-500/30"
                style={{ background: 'rgba(220, 38, 38, 0.1)' }}
                whileHover={{ borderColor: 'rgba(220, 38, 38, 0.5)' }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-300">
                      {STUDIO_ROOMS[formData.studio_room as keyof typeof STUDIO_ROOMS]} × {formData.duration_hours} hours
                    </p>
                    <p className="text-sm text-gray-400">
                      ${HOURLY_RATES[formData.studio_room as keyof typeof HOURLY_RATES]}/hour
                    </p>
                  </div>
                  <motion.div
                    className="text-2xl font-bold text-red-400"
                    key={calculatePrice()}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.3 }}
                  >
                    ${calculatePrice()}
                  </motion.div>
                </div>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-bold text-white relative overflow-hidden disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
                  boxShadow: '0 0 30px rgba(220, 38, 38, 0.4)'
                }}
                whileHover={!isSubmitting ? {
                  scale: 1.02,
                  boxShadow: '0 0 40px rgba(220, 38, 38, 0.6)'
                } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 11-4 0 2 2 0 014 0zM12 1v6m0 0V1m0 6l4-4m-4 4L8 3" />
                      </svg>
                      Book Session - ${calculatePrice()}
                    </>
                  )}
                </span>
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
