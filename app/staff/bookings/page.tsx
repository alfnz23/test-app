'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import BookingTable from '@/components/BookingTable'
import type { Booking } from '@/types/booking'
import { BOOKING_STATUS } from '@/types/booking'

const supabase = createClient()

export default function BookingManagementPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, activeFilter, searchQuery])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      setUser(session.user)
      await loadBookings()
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadBookings = async () => {
    try {
      setRefreshing(true)
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const filterBookings = () => {
    let filtered = bookings

    // Status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === activeFilter)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(booking => 
        booking.customer_name.toLowerCase().includes(query) ||
        booking.customer_email.toLowerCase().includes(query) ||
        booking.session_type.toLowerCase().includes(query) ||
        booking.studio_room.toLowerCase().includes(query)
      )
    }

    setFilteredBookings(filtered)
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleBookingUpdate = async (bookingId: string, updates: Partial<Booking>) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', bookingId)

      if (error) throw error
      await loadBookings() // Refresh data
    } catch (error) {
      console.error('Error updating booking:', error)
    }
  }

  const handleBookingDelete = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)

      if (error) throw error
      await loadBookings() // Refresh data
    } catch (error) {
      console.error('Error deleting booking:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  const statusFilters = [
    { key: 'all', label: 'All Bookings', count: bookings.length },
    { key: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
    { key: 'confirmed', label: 'Confirmed', count: bookings.filter(b => b.status === 'confirmed').length },
    { key: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
    { key: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <motion.header
        className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => router.push('/staff')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-black text-white font-space-grotesk">
              BOOKING <span className="text-red-500">MANAGEMENT</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={loadBookings}
              disabled={refreshing}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <motion.div
                animate={refreshing ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" }}
              >
                🔄
              </motion.div>
              <span>Refresh</span>
            </button>
            <span className="text-gray-300 text-sm">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats & Search */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Booking Overview
              </h2>
              <p className="text-gray-400">
                {filteredBookings.length} of {bookings.length} bookings shown
              </p>
            </div>
            
            {/* Search */}
            <div className="mt-4 md:mt-0">
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-red-500 focus:outline-none w-full md:w-80"
              />
            </div>
          </div>
        </motion.div>

        {/* Status Filter Tabs */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter, index) => (
              <motion.button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                  activeFilter === filter.key
                    ? 'bg-red-600 text-white shadow-lg shadow-red-500/20'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + (index * 0.05), duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{filter.label}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeFilter === filter.key 
                    ? 'bg-white/20' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {filter.count}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Bookings Table */}
        <motion.div
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            {filteredBookings.length > 0 ? (
              <BookingTable
                bookings={filteredBookings}
                onUpdateBooking={handleBookingUpdate}
                onDeleteBooking={handleBookingDelete}
              />
            ) : (
              <motion.div
                className="p-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {searchQuery || activeFilter !== 'all' ? 'No matching bookings' : 'No bookings found'}
                </h3>
                <p className="text-gray-400">
                  {searchQuery || activeFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Bookings will appear here as customers make reservations'
                  }
                </p>
                {(searchQuery || activeFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setActiveFilter('all')
                    }}
                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Summary Stats */}
        {filteredBookings.length > 0 && (
          <motion.div
            className="mt-8 grid md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h4 className="text-sm text-gray-400 mb-2">Total Revenue (Filtered)</h4>
              <p className="text-2xl font-bold text-white">
                ${filteredBookings.reduce((sum, b) => sum + (b.total_price || 0), 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h4 className="text-sm text-gray-400 mb-2">Average Session Value</h4>
              <p className="text-2xl font-bold text-white">
                ${filteredBookings.length > 0 
                  ? (filteredBookings.reduce((sum, b) => sum + (b.total_price || 0), 0) / filteredBookings.length).toFixed(2)
                  : '0.00'
                }
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h4 className="text-sm text-gray-400 mb-2">Total Duration</h4>
              <p className="text-2xl font-bold text-white">
                {filteredBookings.reduce((sum, b) => sum + (b.duration_hours || 0), 0)} hours
              </p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}