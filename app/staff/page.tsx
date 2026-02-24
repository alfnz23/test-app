'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { Booking } from '@/types/booking'
import { BOOKING_STATUSES, EVENT_TYPES, BUDGET_RANGES } from '@/types/booking'
import { format } from 'date-fns'
import { 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  DollarSign, 
  Clock,
  LogOut,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react'

export default function StaffDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    reviewing: 0,
    confirmed: 0,
    declined: 0
  })
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const supabase = createClient()
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/login')
        return
      }
      
      setUser(user)
      fetchBookings()
    } catch (error) {
      console.error('Auth error:', error)
      router.push('/login')
    }
  }

  const fetchBookings = async () => {
    const supabase = createClient()
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        setBookings(data)
        
        // Calculate stats
        const statsObj = {
          total: data.length,
          new: data.filter(b => b.status === 'new').length,
          reviewing: data.filter(b => b.status === 'reviewing').length,
          confirmed: data.filter(b => b.status === 'confirmed').length,
          declined: data.filter(b => b.status === 'declined').length
        }
        setStats(statsObj)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    const supabase = createClient()
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)

      if (error) throw error

      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ))

      // Recalculate stats
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      )
      
      const newStats = {
        total: updatedBookings.length,
        new: updatedBookings.filter(b => b.status === 'new').length,
        reviewing: updatedBookings.filter(b => b.status === 'reviewing').length,
        confirmed: updatedBookings.filter(b => b.status === 'confirmed').length,
        declined: updatedBookings.filter(b => b.status === 'declined').length
      }
      setStats(newStats)

    } catch (error) {
      console.error('Error updating booking status:', error)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="w-4 h-4" />
      case 'reviewing': return <Eye className="w-4 h-4" />
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'declined': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-amber-400 bg-amber-900/30 border-amber-700/50'
      case 'reviewing': return 'text-blue-400 bg-blue-900/30 border-blue-700/50'
      case 'confirmed': return 'text-green-400 bg-green-900/30 border-green-700/50'
      case 'declined': return 'text-red-400 bg-red-900/30 border-red-700/50'
      default: return 'text-stone-400 bg-stone-900/30 border-stone-700/50'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Header */}
      <header className="border-b border-stone-800/50 bg-stone-900/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">
                REVOLOVERS STAFF
              </h1>
              <p className="text-stone-400">Band management dashboard</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-stone-300">{user?.email}</p>
                <p className="text-xs text-stone-500">Staff Member</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-stone-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <motion.div
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-stone-200">{stats.total}</div>
              <div className="text-sm text-stone-400">Total</div>
            </div>
          </motion.div>

          <motion.div
            className="bg-amber-900/20 backdrop-blur-xl border border-amber-700/30 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">{stats.new}</div>
              <div className="text-sm text-amber-300/70">New</div>
            </div>
          </motion.div>

          <motion.div
            className="bg-blue-900/20 backdrop-blur-xl border border-blue-700/30 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.reviewing}</div>
              <div className="text-sm text-blue-300/70">Reviewing</div>
            </div>
          </motion.div>

          <motion.div
            className="bg-green-900/20 backdrop-blur-xl border border-green-700/30 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{stats.confirmed}</div>
              <div className="text-sm text-green-300/70">Confirmed</div>
            </div>
          </motion.div>

          <motion.div
            className="bg-red-900/20 backdrop-blur-xl border border-red-700/30 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{stats.declined}</div>
              <div className="text-sm text-red-300/70">Declined</div>
            </div>
          </motion.div>
        </div>

        {/* Bookings List */}
        <motion.div
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="px-6 py-4 border-b border-stone-800/50">
            <h2 className="text-xl font-bold text-stone-200">Recent Bookings</h2>
          </div>

          <div className="divide-y divide-stone-800/50">
            {bookings.length === 0 ? (
              <div className="px-6 py-12 text-center text-stone-400">
                No bookings yet. Check back later.
              </div>
            ) : (
              bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  className="p-6 hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Left: Basic Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-stone-200 truncate">
                          {booking.contact_name}
                        </h3>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {BOOKING_STATUSES[booking.status as keyof typeof BOOKING_STATUSES]}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-stone-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(booking.event_date), 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {booking.venue_name}, {booking.venue_city}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {booking.contact_email}
                        </div>
                        {booking.contact_phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {booking.contact_phone}
                          </div>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-stone-500">
                        <span>Type: {EVENT_TYPES[booking.event_type as keyof typeof EVENT_TYPES]}</span>
                        {booking.expected_attendance && (
                          <span>Attendance: {booking.expected_attendance}</span>
                        )}
                        {booking.budget_range && (
                          <span>Budget: {BUDGET_RANGES[booking.budget_range as keyof typeof BUDGET_RANGES]}</span>
                        )}
                      </div>

                      {booking.message && (
                        <div className="mt-3 p-3 bg-stone-800/30 rounded-lg">
                          <p className="text-sm text-stone-300 italic">
                            "{booking.message}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right: Status Controls */}
                    <div className="flex lg:flex-col gap-2">
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'reviewing')}
                        className="px-3 py-1 bg-blue-900/30 text-blue-400 border border-blue-700/50 rounded text-xs font-medium hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                        disabled={booking.status === 'reviewing'}
                      >
                        Review
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        className="px-3 py-1 bg-green-900/30 text-green-400 border border-green-700/50 rounded text-xs font-medium hover:bg-green-900/50 transition-colors disabled:opacity-50"
                        disabled={booking.status === 'confirmed'}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'declined')}
                        className="px-3 py-1 bg-red-900/30 text-red-400 border border-red-700/50 rounded text-xs font-medium hover:bg-red-900/50 transition-colors disabled:opacity-50"
                        disabled={booking.status === 'declined'}
                      >
                        Decline
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-800/30 flex items-center justify-between text-xs text-stone-500">
                    <span>Submitted {format(new Date(booking.created_at), 'MMM dd, yyyy \'at\' h:mm a')}</span>
                    <span>ID: {booking.id.slice(0, 8)}...</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-rose-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
          >
            ← Back to Main Site
          </a>
        </motion.div>
      </div>
    </div>
  )
}