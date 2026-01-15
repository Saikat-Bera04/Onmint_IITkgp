'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import { Wallet, TrendingUp, Shield, Zap, CreditCard, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const { isConnected } = useAccount()
  const isAdmin = useIsAdmin()
  const router = useRouter()

  // Auto-redirect admin to dashboard
  useEffect(() => {
    if (isConnected && isAdmin) {
      router.push('/admin/dashboard')
    }
  }, [isConnected, isAdmin, router])

  const features = [
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Start with 10 USDC",
      description: "Get instant credit without collateral. No credit history required."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Build Trust Score",
      description: "Earn points with every repayment. Your score unlocks higher limits."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Transparent",
      description: "All transactions on Polygon. Full transparency, no hidden fees."
    },
  ]

  const steps = [
    { number: "1", title: "Connect Wallet", description: "Link your Web3 wallet to get started" },
    { number: "2", title: "Shop with Credit", description: "Browse products and buy now, pay later" },
    { number: "3", title: "Repay & Grow", description: "Pay back within 30 days to build credit" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>Web3&apos;s First Trust-Based Payment Layer</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Build Credit,
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Unlock Freedom
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
              Start with <span className="font-bold text-blue-600">10 USDC credit</span> instantly. 
              Buy now, pay later. Build your Web3 reputation through responsible repayment.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {isConnected ? (
                <Link
                  href="/dashboard"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center space-x-2"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <ConnectButton />
                  <span className="text-sm text-gray-500">Connect to get started</span>
                </div>
              )}
              
              <Link
                href="/shop"
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all"
              >
                Browse Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose OnMint?
            </h2>
            <p className="text-lg text-gray-600">
              The first truly under-collateralized BNPL for Web3
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Three simple steps to Web3 credit freedom
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-300 to-purple-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credit Score Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Your Trust Score Journey
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <p className="text-sm opacity-80 mb-1">Start</p>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm opacity-80 mt-1">10 USDC limit</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <p className="text-sm opacity-80 mb-1">After 5 loans</p>
              <p className="text-3xl font-bold">50</p>
              <p className="text-sm opacity-80 mt-1">35 USDC limit</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <p className="text-sm opacity-80 mb-1">Power User</p>
              <p className="text-3xl font-bold">100+</p>
              <p className="text-sm opacity-80 mt-1">60+ USDC limit</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>On-time repayment: +10 points</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Early repayment: +15 points</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p className="text-sm">
            Built with ❤️ for Web3 Hackathon 2026 • Powered by Polygon Amoy & Circle USDC
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Admin: 0x74E36...1C34 • Merchant: 0xF92e0D...f4C4
          </p>
        </div>
      </footer>
    </div>
  )
}
