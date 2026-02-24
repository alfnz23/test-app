'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import type { Booking } from '@/types/booking'
import { EVENT_TYPES, BUDGET_RANGES } from '@/types/booking'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function BookingForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    event_type: '',
    event_date: '',
    venue_name: '',
    venue_city: '',
    expected_attendance: '',
    budget_range: '',
    message: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.contact_name.trim()) {
      newErrors.contact_name = 'Name is required'
    }

    if (!formData.contact_email.trim()) {
      newErrors.contact_email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Invalid email format'
    }

    if (!formData.event_type) {
      newErrors.event_type = 'Event type is required'
    }

    if (!formData.event_date) {
      newErrors.event_date = 'Event date is required'
    } else {
      const selectedDate = new Date(formData.event_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.event_date = 'Event date must be in the future'
      }
    }

    if (!formData.venue_name.trim()) {
      newErrors.venue_name = 'Venue name is required'
    }

    if (!formData.venue_city.trim()) {
      newErrors.venue_city = 'Venue city is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setError('')

    try {
      const supabase = createClient()
      
      const bookingData = {
        contact_name: formData.contact_name,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone || null,
        event_type: formData.event_type,
        event_date: formData.event_date,
        venue_name: formData.venue_name,
        venue_city: formData.venue_city,
        expected_attendance: formData.expected_attendance ? parseInt(formData.expected_attendance) : null,
        budget_range: formData.budget_range || null,
        message: formData.message || null
      }

      const { error: submitError } = await supabase
        .from('bookings')
        .insert([bookingData])

      if (submitError) throw submitError

      setIsSuccess(true)
      
      // Reset form
      setFormData({
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        event_type: '',
        event_date: '',
        venue_name: '',
        venue_city: '',
        expected_attendance: '',
        budget_range: '',
        message: ''
      })

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
        </motion.div>
        <h3 className="text-2xl font-bold text-stone-100 mb-4">
          Booking Request Sent!
        </h3>
        <p className="text-stone-300 mb-6">
          We'll get back to you within 24 hours to discuss your event.
        </p>
        <motion.button
          onClick={() => setIsSuccess(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-black rounded-full font-bold uppercase tracking-wide hover:from-amber-500 hover:to-amber-400 transition-all duration-200"
        >
          Submit Another Request
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"
          >
            <AlertCircle size={20} className="mr-3 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-stone-300 mb-2 uppercase tracking-wide">
            Contact Name *
          </label>
          <input
            type="text"
            name="contact_name"
            value={formData.contact_name}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/[0.05] border rounded-xl text-stone-100 placeholder-stone-500 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
              errors.contact_name
                ? 'border-red-500/50 focus:ring-red-500/50'
                : 'border-white/10 focus:border-amber-500/50 focus:ring-amber-500/50'
            }`}
            placeholder="Your name"
          />
          {errors.contact_name && (
            <p className="text-red-400 text-xs mt-1">{errors.contact_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-300 mb-2 uppercase tracking-wide">
            Email *
          </label>
          <input
            type="email"
            name="contact_email"
            value={formData.contact_email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/[0.05] border rounded-xl text-stone-100 placeholder-stone-500 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
              errors.contact_email
                ? 'border-red-500/50 focus:ring-red-500/50'
                : 'border-white/10 focus:border-amber-500/50 focus:ring-amber-500/50'
            }`}
            placeholder="your@email.com"
          />
          {errors.contact_email && (
            <p className="text-red-400 text-xs mt-1">{errors.contact_email}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-300 mb-2 uppercase tracking-wide">
          Phone Number
        </label>
        <input
          type="tel"
          name="contact_phone"
          value={formData.contact_phone}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-stone-100 placeholder-stone-500 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:border-amber-500/50 focus:ring-amber-500/50"
          placeholder="(555) 123-4567"
        />
      </div>

      {/* Event Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-stone-300 mb-2 uppercase tracking-wide">
            Event Type *
          </label>
          <select
            name="event_type"
            value={formData.event_type}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/[0.05] border rounded-xl text-stone-100 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
              errors.event_type
                ? 'border-red-500/50 focus:ring-red-500/50'
                : 'border-white/10 focus:border-amber-500/50 focus:ring-amber-500/50'
            }`}
          >
            <option value="" className="bg-stone-900">Select event type</option>
            {Object.entries(EVENT_TYPES).map(([key, value]) => (
              <option key={key} value={key} className="bg-stone-900">{value}</option>
            ))}
          </select>
          {errors.event_type && (
            <p className="text-red-400 text-xs mt-1">{errors.event_type}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-300 mb-2 uppercase tracking-wide">
            Event Date *
          </label>
          <input
            type="date"
            name="event_date"
            value={formData.event_date}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/[0.05] border rounded-xl text-stone-100 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
              errors.event_date
                ? 'border-red-500/50 focus:ring-red-500/50'
                : 'border-white/10 focus:border-amber-500/50 focus:ring-amber-500/50'
            }`}
          />
          {errors.event_date && (
            <p className="text-red-400 text-xs mt-1">{errors.event_date}</p>
          )}
        </div>
      </div>

      {/* Venue Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-stone-300 mb-2 uppercase tracking-wide">
            Venue Name *
          </label>
          <input
            type="text"
            name="venue_name"
            value={formData.venue_name}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/[0.05] border rounded-xl text-stone-100 placeholder-stone-500 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
              errors.venue_name
                ? 'border-red-500/50 focus:ring-red-500/50'
                : 'border-white/10 focus:border-amber-500/50 focus:ring-amber-500/50'
            }`}
            placeholder="The Basement"
          />
          {errors.venue_name && (
            <p className="text-red-400 text-xs mt-1">{errors.venue_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-300 mb-2 uppercase tracking-wide">
            Venue City *
          </label>
          <input
            type="text"
            name="venue_city"
            value={formData.venue_city}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-white/[0.05] border rounded-xl text-stone-100 placeholder-stone-500 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
              errors.venue_city
                ? 'border-red-500/50 focus:ring-red-500/50'
                : 'border-white/10 focus:border-amber-500/50 focus:ring-amber-500/50'
            }`}
            placeholder="Nashville, TN"
          />
          {errors.venue_city && (
            <p className="text-red-400 text-xs mt-1">{errors.venue_city}</p>
          )}
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-stone-300 mb-2 uppercase tracking-wide">
            Expected Attendance
          </label>
          <input
            type="number"
            name="expected_attendance"
            value={formData.expected_attendance}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-stone-100 placeholder-stone-500 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:border-amber-500/50 focus:ring-amber-500/50"
            placeholder="500"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-300 mb-2 uppercase tracking-wide">
            Budget Range
          </label>
          <select
            name="budget_range"
            value={formData.budget_range}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-stone-100 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:border-amber-500/50 focus:ring-amber-500/50"
          >
            <option value="" className="bg-stone-900">Select budget range</option>
            {Object.entries(BUDGET_RANGES).map(([key, value]) => (
              <option key={key} value={key} className="bg-stone-900">{value}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-semibold text-stone-300 mb-2 uppercase tracking-wide">
          Additional Details
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-stone-100 placeholder-stone-500 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:border-amber-500/50 focus:ring-amber-500/50 resize-none"
          placeholder="Tell us more about your event, special requirements, or any questions you have..."
        />
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={!isLoading ? { scale: 1.02 } : {}}
        whileTap={!isLoading ? { scale: 0.98 } : {}}
        className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wide transition-all duration-200 ${
          isLoading
            ? 'bg-stone-600 text-stone-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-amber-600 to-amber-500 text-black hover:from-amber-500 hover:to-amber-400 hover:shadow-lg hover:shadow-amber-500/25'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <Loader2 size={20} className="animate-spin mr-2" />
            Sending Request...
          </span>
        ) : (
          'Send Booking Request'
        )}
      </motion.button>
    </motion.form>
  )
}