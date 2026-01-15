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
  '2': 'from-purple-500 to-pink-500',
  '3': 'from-orange-500 to-red-500',
  '4': 'from-green-500 to-teal-500',
  '5': 'from-indigo-500 to-purple-500',
  '6': 'from-amber-500 to-orange-500',
  '7': 'from-rose-500 to-pink-500',
  '8': 'from-cyan-500 to-blue-500',
}

export default function ProductCard({ product, onBuyNow, disabled }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className={`h-40 bg-gradient-to-br ${productGradients[product.id] || 'from-gray-500 to-gray-600'} flex items-center justify-center`}>
        <span className="text-5xl">{product.image}</span>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
            {product.category}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
          <span className="text-sm text-gray-500">USDC</span>
        </div>

        {/* Buy Button */}
        <button
          onClick={onBuyNow}
          disabled={disabled}
          className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
            disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Buy Now, Pay Later</span>
        </button>
      </div>
    </div>
  )
}
