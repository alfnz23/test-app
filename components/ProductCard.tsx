'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product, quantity: number) => void
}

const CATEGORY_COLORS = {
  apparel: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  accessories: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  vinyl: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  digital: 'bg-green-500/20 text-green-400 border-green-500/30',
  gear: 'bg-red-500/20 text-red-400 border-red-500/30'
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = async () => {
    if (!onAddToCart || !product.in_stock) return

    setIsAdding(true)
    
    // Add to cart logic
    onAddToCart(product, quantity)
    
    // Success animation delay
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  const categoryStyle = CATEGORY_COLORS[product.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.gear

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.3 }
      }}
      className="group relative overflow-hidden rounded-2xl h-full flex flex-col"
      style={{
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 0 30px rgba(0, 0, 0, 0.3)'
      }}
    >
      {/* Hover Glow Border */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(153, 27, 27, 0.05) 100%)',
          border: '1px solid rgba(220, 38, 38, 0.3)'
        }}
      />

      {/* Product Image */}
      <div className="relative overflow-hidden rounded-t-2xl h-48 bg-gradient-to-br from-gray-800 to-gray-900">
        {product.image_url ? (
          <motion.img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
            <motion.div
              className="text-gray-400 text-4xl"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              📦
            </motion.div>
          </div>
        )}

        {/* Category Badge */}
        <motion.div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold border ${categoryStyle}`}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          style={{ backdropFilter: 'blur(10px)' }}
        >
          {product.category?.toUpperCase()}
        </motion.div>

        {/* Stock Status */}
        {!product.in_stock && (
          <motion.div
            className="absolute inset-0 bg-black/60 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-red-400 font-bold text-lg">OUT OF STOCK</div>
          </motion.div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6 flex-grow flex flex-col">
        <motion.h3
          className="text-xl font-bold text-white mb-2"
          whileHover={{
            textShadow: "0 0 15px rgba(220, 38, 38, 0.4)"
          }}
        >
          {product.name}
        </motion.h3>

        <p className="text-gray-400 text-sm mb-4 flex-grow leading-relaxed">
          {product.description}
        </p>

        {/* Price */}
        <motion.div
          className="text-3xl font-black text-red-400 mb-4"
          whileHover={{
            scale: 1.05,
            textShadow: "0 0 20px rgba(220, 38, 38, 0.6)"
          }}
        >
          ${product.price}
        </motion.div>

        {/* Quantity Selector & Add to Cart */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden">
            <motion.button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={!product.in_stock}
            >
              -
            </motion.button>
            <div className="px-4 py-2 bg-gray-800 text-white min-w-[50px] text-center">
              {quantity}
            </div>
            <motion.button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={!product.in_stock}
            >
              +
            </motion.button>
          </div>

          <motion.button
            onClick={handleAddToCart}
            disabled={!product.in_stock || isAdding}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white relative overflow-hidden ${
              !product.in_stock 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-red-600 to-red-700'
            }`}
            style={{
              boxShadow: product.in_stock ? '0 0 20px rgba(220, 38, 38, 0.3)' : 'none'
            }}
            whileHover={product.in_stock ? {
              scale: 1.02,
              boxShadow: '0 0 30px rgba(220, 38, 38, 0.6)',
              transition: { duration: 0.2 }
            } : {}}
            whileTap={product.in_stock ? { scale: 0.98 } : {}}
          >
            {/* Button Glow Effect */}
            {product.in_stock && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            )}

            <motion.span
              className="relative z-10 flex items-center justify-center gap-2"
              animate={isAdding ? { scale: [1, 0.8, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {isAdding ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Added!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a2 2 0 002 2h8a2 2 0 002-2v-6" />
                  </svg>
                  Add to Cart
                </>
              )}
            </motion.span>
          </motion.button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'radial-gradient(circle at center, rgba(220, 38, 38, 0.08) 0%, transparent 70%)',
          filter: 'blur(20px)'
        }}
      />
    </motion.div>
  )
}