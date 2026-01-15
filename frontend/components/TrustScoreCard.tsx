'use client'

import { useAccount } from 'wagmi'
import { useTrustScore, useCreditLimit, useAvailableCredit } from '@/hooks/useContracts'
import { TrendingUp, Shield } from 'lucide-react'
import { TrustScoreCardSkeleton } from './SkeletonLoaders'

export default function TrustScoreCard() {
  const { address } = useAccount()
  
  const { data: trustScore = BigInt(0), isLoading: scoreLoading } = useTrustScore(address)
  const { data: creditLimit = BigInt(0), isLoading: limitLoading } = useCreditLimit(address)
  const { data: availableCredit = BigInt(0), isLoading: availLoading } = useAvailableCredit(address)

  const score = Number(trustScore)
  const formattedCreditLimit = (Number(creditLimit) / 1e6).toFixed(2)
  const formattedAvailableCredit = (Number(availableCredit) / 1e6).toFixed(2)
  
  const isLoading = scoreLoading || limitLoading || availLoading
  
  // Calculate progress (max score for display purposes is 100)
  const progress = Math.min((score / 100) * 100, 100)
  const circumference = 2 * Math.PI * 45 // radius = 45

  if (isLoading) {
    return <TrustScoreCardSkeleton />
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span>Trust Score</span>
        </h3>
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Shield className="w-4 h-4" />
          <span>On-chain</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {/* Score Display */}
        <div className="space-y-3">
          <div>
            <p className="text-4xl font-bold text-gray-900">{score}</p>
            <p className="text-sm text-gray-500">points</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Credit Limit</span>
              <span className="font-semibold text-blue-600">${formattedCreditLimit}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Available</span>
              <span className="font-semibold text-green-600">${formattedAvailableCredit}</span>
            </div>
          </div>
        </div>

        {/* Circular Progress */}
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="45"
              stroke="#e5e7eb"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (progress / 100) * circumference}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-700">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
