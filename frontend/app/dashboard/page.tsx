'use client'

import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { 
  useUserCreditInfo,
  useHasActiveLoan
} from '@/hooks/useContracts'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import TrustScoreCard from '@/components/TrustScoreCard'
import CreditScoreBreakdown from '@/components/CreditScoreBreakdown'
import ActiveLoanCard from '@/components/ActiveLoanCard'
import { 
  ShoppingBag, 
  ArrowRight,
  Wallet,
  CreditCard,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const isAdmin = useIsAdmin()
  
  const { data: creditInfo } = useUserCreditInfo(address)
  const { data: hasActiveLoan = false } = useHasActiveLoan(address)

  // Parse credit info: [score, totalScore, walletBonus, zkBoost, creditLimit]
  const creditData = creditInfo as readonly [bigint, bigint, bigint, bigint, bigint] | undefined
  const totalScore = creditData ? Number(creditData[1]) : 0
  const creditLimit = creditData ? Number(creditData[4]) : 0

  // Redirect admin to admin dashboard
  useEffect(() => {
    if (isConnected && isAdmin) {
      router.push('/admin/dashboard')
    }
  }, [isConnected, isAdmin, router])

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center space-y-6 p-8 bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Connect Your Wallet</h1>
          <p className="text-gray-300 max-w-sm">Please connect your wallet to view your dashboard and start building your Web3 credit score</p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    )
  }

  const formattedCreditLimit = creditLimit / 1e6

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Welcome Back! 👋
            </h1>
            <p className="text-gray-300 mt-2 flex items-center space-x-2">
              <span className="font-mono bg-gray-800 px-3 py-1.5 rounded-lg text-sm">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center space-x-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Shop Now</span>
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-red-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </Link>
            <Link
              href="/zkproof"
              className="group relative px-6 py-3 border-2 border-gray-700 text-gray-300 rounded-xl font-semibold hover:border-blue-500 hover:text-white transition-all flex items-center space-x-2"
            >
              <Zap className="w-5 h-5" />
              <span>ZK Boost</span>
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-blue-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:shadow-2xl hover:shadow-blue-500/10 transition-all">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/30 p-3 rounded-xl border border-blue-500/30">
                <CreditCard className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Trust Score</p>
                <p className="text-3xl font-bold text-white">{totalScore}</p>
                <p className="text-xs text-gray-500">/ 190 max</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:shadow-2xl hover:shadow-green-500/10 transition-all">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/30 p-3 rounded-xl border border-green-500/30">
                <Wallet className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Credit Limit</p>
                <p className="text-3xl font-bold text-green-600">${formattedCreditLimit.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:shadow-2xl hover:shadow-red-500/10 transition-all">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-red-500/20 to-red-600/30 p-3 rounded-xl border border-red-500/30">
                <Zap className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Loan Status</p>
                <p className={`text-lg font-bold ${hasActiveLoan ? 'text-orange-600' : 'text-gray-400'}`}>
                  {hasActiveLoan ? 'Active Loan' : 'No Active Loan'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Credit Score Breakdown - Takes 2 columns */}
          <div className="lg:col-span-2">
            <CreditScoreBreakdown />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Active Loan or Shop CTA */}
            {hasActiveLoan ? (
              <ActiveLoanCard />
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Ready to Shop?</h3>
                  <p className="text-gray-600">
                    You have <span className="font-bold text-blue-600">${formattedCreditLimit.toFixed(2)} USDC</span> credit available!
                  </p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center w-full space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
                  >
                    <span>Browse Shop</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Trust Score Card */}
            <TrustScoreCard />
          </div>
        </div>

        {/* Credit Building Tips */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Zap className="w-6 h-6" />
            <span>Tips to Build Credit Faster</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors">
              <p className="font-semibold mb-1">💰 Pay Early</p>
              <p className="text-sm opacity-90">Repay 7+ days before due date for +15 points instead of +10</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors">
              <p className="font-semibold mb-1">🔐 Submit ZK Proof</p>
              <p className="text-sm opacity-90">Verify your balance privately and earn up to +30 bonus points</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors">
              <p className="font-semibold mb-1">📈 Stay Consistent</p>
              <p className="text-sm opacity-90">Regular on-time payments build your score faster</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
