'use client'
import { motion } from 'framer-motion'
import type { MerchProduct } from '@/types/product'

interface ProductCardProps {
  product: MerchProduct
  addToCart: (product: MerchProduct) => void
}

export default function ProductCard({ product, addToCart }: ProductCardProps) {
  const handleAddToCart = () => {
    if (product.in_stock) {
      addToCart(product)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          {/* Gradient Placeholder */}
          <div className="w-full h-full bg-gradient-to-br from-amber-900/20 via-stone-800/30 to-rose-900/20" />
          
          {/* Product Image Overlay Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Featured Badge */}
          {product.featured && (
            <motion.div
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: -12 }}
              transition={{ delay: 0.2 }}
              className="absolute top-4 left-4 z-10"
            >
              <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
                Featured
              </div>
            </motion.div>
          )}

          {/* Sold Out Overlay */}
          {!product.in_stock && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/80 flex items-center justify-center z-20"
            >
              <div className="text-red-500 font-black text-xl uppercase tracking-wider transform -rotate-12">
                SOLD OUT
              </div>
            </motion.div>
          )}

          {/* Hover Glow Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-stone-100 mb-2 group-hover:text-amber-500 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-stone-400 leading-relaxed line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            {/* Price */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-black text-amber-500"
            >
              ${product.price.toFixed(2)}
            </motion.div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              whileHover={product.in_stock ? { scale: 1.05 } : {}}
              whileTap={product.in_stock ? { scale: 0.95 } : {}}
              className={`px-6 py-2 rounded-full font-semibold text-sm uppercase tracking-wide transition-all duration-200 ${
                product.in_stock
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-black hover:from-amber-500 hover:to-amber-400 hover:shadow-lg hover:shadow-amber-500/25'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {product.in_stock ? 'Add to Cart' : 'Sold Out'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Hover Border Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 rounded-2xl border-2 border-amber-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      />
    </motion.div>
  )
}