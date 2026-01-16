'use client'

import { ShoppingBag } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
}

interface ProductCardProps {
  product: Product
  onBuyNow: () => void
  disabled?: boolean
}

const productGradients: Record<string, string> = {
  '1': 'from-blue-500 to-cyan-500',
  '2': 'from-red-500 to-pink-500',
  '3': 'from-orange-500 to-red-500',
  '4': 'from-green-500 to-teal-500',
  '5': 'from-indigo-500 to-red-500',
  '6': 'from-amber-500 to-orange-500',
  '7': 'from-rose-500 to-pink-500',
  '8': 'from-cyan-500 to-blue-500',
}

export default function ProductCard({ product, onBuyNow, disabled }: ProductCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-black/20">
      {/* Product Image */}
      <div className={`h-48 bg-gradient-to-br ${productGradients[product.id] || 'from-gray-500/80 to-gray-600/80'} flex items-center justify-center relative overflow-hidden`}>
        <span className="text-6xl z-10">{product.image}</span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white">{product.name}</h3>
          <span className="text-xs px-2.5 py-1 bg-white/10 text-white/80 rounded-full backdrop-blur-sm">
            {product.category}
          </span>
        </div>
        
        <p className="text-sm text-white/80 mb-5 line-clamp-2">{product.description}</p>

        {/* Price and Button */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-white/60">Price</span>
            <span className="text-xl font-bold text-white">${product.price.toFixed(2)} <span className="text-sm font-normal text-white/60">USDC</span></span>
          </div>
          
          <button
            onClick={onBuyNow}
            disabled={disabled}
            className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 flex-shrink-0 ${
              disabled
                ? 'bg-white/5 text-white/40 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/20'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  )
}
