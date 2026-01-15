'use client'

import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { 
  useTrustScore, 
  useCreditLimit, 
  useHasActiveLoan
} from '@/hooks/useContracts'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import TrustScoreCard from '@/components/TrustScoreCard'
import ActiveLoanCard from '@/components/ActiveLoanCard'
import { 
  ShoppingBag, 
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const isAdmin = useIsAdmin()
  
  const { data: trustScore = BigInt(0) } = useTrustScore(address)
  const { data: creditLimit = BigInt(0) } = useCreditLimit(address)
  const { data: hasActiveLoan = false } = useHasActiveLoan(address)

  // Redirect admin to admin dashboard
  useEffect(() => {
    if (isConnected && isAdmin) {
      router.push('/admin/dashboard')
    }
  }, [isConnected, isAdmin, router])

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Connect Your Wallet</h1>
          <p className="text-gray-600">Please connect your wallet to view your dashboard</p>
          <ConnectButton />
        </div>
      </div>
    )
  }

  const formattedCreditLimit = Number(creditLimit) / 1e6

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600 mt-1">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Trust Score</p>
            <p className="text-2xl font-bold text-gray-900">{Number(trustScore)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Credit Limit</p>
            <p className="text-2xl font-bold text-blue-600">${formattedCreditLimit.toFixed(2)}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Trust Score Card */}
          <TrustScoreCard />

          {/* Active Loan or Shop CTA */}
          {hasActiveLoan ? (
            <ActiveLoanCard />
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Ready to Shop?</h3>
                <p className="text-gray-600">
                  You have <span className="font-bold text-blue-600">${formattedCreditLimit.toFixed(2)} USDC</span> credit available!
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
                >
                  <span>Browse Shop</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Credit Building Tips */}
        <div className="bg-blue-600 rounded-2xl p-6 text-white">
          <h2 className="text-xl font-bold mb-4">💡 Tips to Build Credit Faster</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="font-semibold">Pay Early</p>
              <p className="text-sm opacity-80">Repay 7+ days before due date for +15 points instead of +10</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="font-semibold">Stay Consistent</p>
              <p className="text-sm opacity-80">Regular on-time payments build your score faster</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="font-semibold">Credit Formula</p>
              <p className="text-sm opacity-80">$10 base + ($5 × score ÷ 10) = your limit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
