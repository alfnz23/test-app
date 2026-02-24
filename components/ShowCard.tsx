'use client'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ExternalLink } from 'lucide-react'
import type { Show } from '@/types/product'

interface ShowCardProps {
  show: Show
}

export default function ShowCard({ show }: ShowCardProps) {
  const eventDate = new Date(show.event_date)
  const formattedDate = format(eventDate, 'MMM')
  const formattedDay = format(eventDate, 'd')
  const formattedTime = show.doors_time ? format(new Date(`2000-01-01T${show.doors_time}`), 'h:mm a') : null

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <div className={`backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-6 transition-all duration-300 ${
        show.is_sold_out
          ? 'opacity-75 hover:border-red-500/30'
          : 'hover:border-amber-500/30'
      }`}>
        <div className="flex items-center justify-between">
          {/* Date Display */}
          <div className="flex-shrink-0">
            <div className={`text-center p-4 rounded-xl border transition-colors ${
              show.is_sold_out
                ? 'border-red-500/20 bg-red-500/10'
                : 'border-amber-500/20 bg-amber-500/10 group-hover:border-amber-500/40'
            }`}>
              <div className={`text-sm font-semibold uppercase tracking-wide ${
                show.is_sold_out ? 'text-red-400' : 'text-amber-500'
              }`}>
                {formattedDate}
              </div>
              <div className={`text-3xl font-black ${
                show.is_sold_out ? 'text-red-300' : 'text-stone-100'
              }`}>
                {formattedDay}
              </div>
            </div>
          </div>

          {/* Venue Info */}
          <div className="flex-1 px-6">
            <h3 className={`text-xl font-bold mb-2 ${
              show.is_sold_out ? 'text-stone-400' : 'text-stone-100 group-hover:text-amber-500'
            } transition-colors`}>
              {show.venue_name}
            </h3>
            <p className={`text-sm font-medium ${
              show.is_sold_out ? 'text-stone-500' : 'text-stone-300'
            }`}>
              {show.city}
            </p>
            {formattedTime && (
              <p className={`text-xs mt-1 ${
                show.is_sold_out ? 'text-stone-600' : 'text-stone-400'
              }`}>
                Doors: {formattedTime}
              </p>
            )}
          </div>

          {/* Tickets Button / Status */}
          <div className="flex-shrink-0">
            {show.is_sold_out ? (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="px-6 py-3 bg-red-600 text-white rounded-full font-bold text-sm uppercase tracking-wide"
              >
                SOLD OUT
              </motion.div>
            ) : show.ticket_url ? (
              <motion.a
                href={show.ticket_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-black rounded-full font-bold text-sm uppercase tracking-wide hover:from-amber-500 hover:to-amber-400 hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200"
              >
                Tickets
                <ExternalLink size={16} className="ml-2" />
              </motion.a>
            ) : (
              <div className="px-6 py-3 bg-stone-700 text-stone-300 rounded-full font-bold text-sm uppercase tracking-wide">
                TBA
              </div>
            )}
          </div>
        </div>

        {/* Sold Out Badge */}
        {show.is_sold_out && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute top-4 right-4"
          >
            <div className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
              Sold Out
            </div>
          </motion.div>
        )}
      </div>

      {/* Hover Border Glow */}
      {!show.is_sold_out && (
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 rounded-2xl border-2 border-amber-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        />
      )}
    </motion.div>
  )
}