'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import { Wallet, LayoutDashboard, ShoppingBag, CreditCard } from 'lucide-react'

export function Navbar() {
  const { isConnected } = useAccount()
  const isAdmin = useIsAdmin()

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              OnMint
            </span>
          </Link>

          {/* Navigation Links */}
          {isConnected && (
            <div className="hidden md:flex items-center space-x-6">
              {isAdmin ? (
                <>
                  <Link 
                    href="/admin/dashboard" 
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    href="/admin/loans" 
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Loans</span>
                  </Link>
                  <Link 
                    href="/admin/liquidity" 
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Liquidity</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/dashboard" 
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    href="/shop" 
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Shop</span>
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Connect Button */}
          <ConnectButton />
        </div>
      </div>
    </nav>
  )
}
