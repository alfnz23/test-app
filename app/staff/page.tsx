'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const supabase = createClient()

interface DashboardStats {
  totalBookings: number
  pendingBookings: number
  totalRevenue: number
  monthlyRevenue: number
  todayBookings: number
  completedBookings: number
}

export default function StaffDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    todayBookings: 0,
    completedBookings: 0
  })
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      setUser(session.user)
      await loadStats()
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      // Get all bookings
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')

      if (error) throw error

      const now = new Date()
      const today = now.toISOString().split('T')[0]
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      const stats: DashboardStats = {
        totalBookings: bookings?.length || 0,
        pendingBookings: bookings?.filter(b => b.status === 'pending').length || 0,
        completedBookings: bookings?.filter(b => b.status === 'completed').length || 0,
        todayBookings: bookings?.filter(b => b.booking_date === today).length || 0,
        totalRevenue: bookings?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0,
        monthlyRevenue: bookings?.filter(b => {
          const bookingDate = new Date(b.booking_date)
          return bookingDate.getMonth() === currentMonth && 
                 bookingDate.getFullYear() === currentYear
        }).reduce((sum, b) => sum + (b.total_price || 0), 0) || 0
      }

      setStats(stats)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
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

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: '📅',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: '⏳',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: "Today's Sessions",
      value: stats.todayBookings,
      icon: '🎵',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Completed',
      value: stats.completedBookings,
      icon: '✅',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: '💰',
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toFixed(2)}`,
      icon: '📊',
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <motion.header
        className="bg-white/5 backdrop-blur-xl border-b border-white/10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-black text-white font-space-grotesk">
              REDLINE <span className="text-red-500">DASHBOARD</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 text-sm">
              Welcome, {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
            STAFF PORTAL
          </h2>
          <p className="text-gray-400 text-lg">
            Manage bookings, monitor studio performance, and track revenue.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 20px 40px rgba(220,38,38,0.1)"
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                  {card.icon}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {card.value}
                  </div>
                </div>
              </div>
              <h3 className="text-gray-300 text-sm font-medium">
                {card.title}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Manage Bookings',
                description: 'View, edit, and update booking statuses',
                href: '/staff/bookings',
                icon: '📋',
                color: 'from-red-500 to-red-600'
              },
              {
                title: 'Studio Schedule',
                description: 'Check today\'s studio availability',
                href: '/staff/schedule',
                icon: '🗓️',
                color: 'from-blue-500 to-blue-600'
              },
              {
                title: 'Revenue Reports',
                description: 'Generate financial reports and analytics',
                href: '/staff/reports',
                icon: '📈',
                color: 'from-green-500 to-green-600'
              }
            ].map((action, index) => (
              <motion.button
                key={action.title}
                onClick={() => router.push(action.href)}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-left hover:border-red-500/30 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + (index * 0.1), duration: 0.6 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 40px rgba(220,38,38,0.1)"
                }}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center text-white text-xl mb-4 group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                  {action.title}
                </h4>
                <p className="text-gray-400 text-sm">
                  {action.description}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Placeholder */}
        <motion.div
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
          <div className="text-gray-400">
            <p>• {stats.pendingBookings} new booking requests awaiting approval</p>
            <p>• {stats.todayBookings} sessions scheduled for today</p>
            <p>• Monthly revenue: ${stats.monthlyRevenue.toFixed(2)}</p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}