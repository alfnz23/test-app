'use client'

import { motion } from 'framer-motion'

interface StudioCardProps {
  name: string
  nickname: string
  description: string
  hourlyPrice: number
  features: string[]
  image?: string
  onBook: (studioRoom: string) => void
}

export default function StudioCard({ 
  name, 
  nickname, 
  description, 
  hourlyPrice, 
  features, 
  image,
  onBook 
}: StudioCardProps) {
  const studioRoomKey = name.toLowerCase().replace(' ', '_')

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
      whileHover={{ 
        scale: 1.02,
        y: -10,
        transition: { duration: 0.3 }
      }}
      className="group relative overflow-hidden rounded-2xl"
      style={{
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(220, 38, 38, 0.2)',
        boxShadow: '0 0 30px rgba(0, 0, 0, 0.3)'
      }}
    >
      {/* Red accent border on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(153, 27, 27, 0.05) 100%)',
          border: '2px solid rgba(220, 38, 38, 0.4)'
        }}
      />

      {/* Background Image */}
      {image && (
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
      )}

      <div className="relative p-6 h-full flex flex-col">
        {/* Studio Name & Nickname */}
        <div className="mb-4">
          <motion.h3 
            className="text-2xl font-bold text-white mb-1"
            whileHover={{ 
              textShadow: "0 0 20px rgba(220, 38, 38, 0.6)"
            }}
          >
            {name}
          </motion.h3>
          <p className="text-red-400 font-medium text-lg">"{nickname}"</p>
        </div>

        {/* Description */}
        <p className="text-gray-300 mb-6 flex-grow leading-relaxed">
          {description}
        </p>

        {/* Features */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
            Features
          </h4>
          <div className="space-y-2">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center text-gray-400 text-sm"
              >
                <motion.div
                  className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3"
                  whileHover={{ scale: 1.5, boxShadow: "0 0 10px rgba(220, 38, 38, 0.8)" }}
                />
                {feature}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Price & Book Button */}
        <div className="flex items-center justify-between">
          <div>
            <motion.div 
              className="text-3xl font-black text-red-400"
              whileHover={{ 
                scale: 1.05,
                textShadow: "0 0 20px rgba(220, 38, 38, 0.6)"
              }}
            >
              ${hourlyPrice}
            </motion.div>
            <p className="text-gray-500 text-sm">per hour</p>
          </div>

          <motion.button
            onClick={() => onBook(studioRoomKey)}
            className="px-6 py-3 rounded-xl font-semibold text-white relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
              boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)'
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 30px rgba(220, 38, 38, 0.6)',
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">Book Now</span>
          </motion.button>
        </div>

        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'radial-gradient(circle at center, rgba(220, 38, 38, 0.1) 0%, transparent 70%)',
            filter: 'blur(20px)'
          }}
        />
      </div>

      {/* Corner Accent */}
      <motion.div
        className="absolute top-0 right-0 w-20 h-20"
        initial={{ scale: 0, rotate: 45 }}
        whileInView={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{
          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, transparent 70%)',
          clipPath: 'polygon(100% 0%, 100% 100%, 0% 0%)'
        }}
      />
    </motion.div>
  )
}