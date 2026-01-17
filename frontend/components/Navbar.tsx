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
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl shadow-black/50 z-50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="px-6 py-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/images/logo.png" 
              alt="OnMint Logo" 
              className="h-10 w-auto" 
            />
          </Link>

          {/* Navigation Links */}
          {isConnected && (
            <div className="hidden md:flex items-center space-x-6">
              {isAdmin ? (
                <>
                  <Link 
                    href="/admin/dashboard" 
                    className="group flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <div className="p-1.5 rounded-lg bg-gray-700/50 group-hover:bg-blue-500/20 transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <Link 
                    href="/admin/loans" 
                    className="group flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <div className="p-1.5 rounded-lg bg-gray-700/50 group-hover:bg-red-500/20 transition-colors">
                      <CreditCard className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="font-medium">Loans</span>
                  </Link>
                  <Link 
                    href="/admin/liquidity" 
                    className="group flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <div className="p-1.5 rounded-lg bg-gray-700/50 group-hover:bg-blue-500/20 transition-colors">
                      <Wallet className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="font-medium">Liquidity</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/dashboard" 
                    className="group flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <div className="p-1.5 rounded-lg bg-gray-700/50 group-hover:bg-blue-500/20 transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <Link 
                    href="/shop" 
                    className="group flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <div className="p-1.5 rounded-lg bg-gray-700/50 group-hover:bg-red-500/20 transition-colors">
                      <ShoppingBag className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="font-medium">Shop</span>
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Connect Button */}
          <div className="ml-4">
            <ConnectButton 
              accountStatus="address"
              showBalance={false}
              chainStatus="icon"
              label="Connect Wallet"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}
