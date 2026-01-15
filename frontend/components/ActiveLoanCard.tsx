'use client'

import { useAccount } from 'wagmi'
import { useActiveLoan, useHasActiveLoan, getDaysRemaining, getStatusColor, formatAddress } from '@/hooks/useContracts'
import { Clock, DollarSign, Store, AlertCircle, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { ActiveLoanCardSkeleton } from './SkeletonLoaders'

export default function ActiveLoanCard() {
  const { address } = useAccount()
  const { data: loan, isLoading: loanLoading } = useActiveLoan(address)
  const { data: hasLoan, isLoading: hasLoanLoading } = useHasActiveLoan(address)

  const isLoading = loanLoading || hasLoanLoading

  if (isLoading) {
    return <ActiveLoanCardSkeleton />
  }

  // If no active loan
  if (!hasLoan || !loan || loan.isRepaid) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Loan</h3>
          <p className="text-sm text-gray-500 mb-4">
            Start shopping to use your credit!
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    )
  }

  const daysRemaining = getDaysRemaining(loan.dueDate)
  const statusColor = getStatusColor(daysRemaining)
  const amountUSDC = Number(loan.amount) / 1e6
  const amountRepaid = Number(loan.amountRepaid) / 1e6
  const remainingAmount = amountUSDC - amountRepaid
  const progressPercent = (amountRepaid / amountUSDC) * 100
  const dueDate = new Date(Number(loan.dueDate) * 1000)

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Active Loan</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          daysRemaining > 7 ? 'bg-green-100 text-green-700' :
          daysRemaining > 3 ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
        </span>
      </div>

      <div className="space-y-4">
        {/* Amount */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>Total Amount</span>
          </div>
          <span className="text-xl font-bold text-gray-900">{amountUSDC.toFixed(2)} USDC</span>
        </div>

        {/* Payment Progress */}
        {amountRepaid > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Progress</span>
              <span className="font-medium text-green-600">{progressPercent.toFixed(0)}% paid</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Paid: ${amountRepaid.toFixed(2)}</span>
              <span>Remaining: ${remainingAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Merchant */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-600">
            <Store className="w-4 h-4" />
            <span>Merchant</span>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {formatAddress(loan.merchant)}
          </span>
        </div>

        {/* Due Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Due Date</span>
          </div>
          <span className={`text-sm font-medium ${statusColor}`}>
            {dueDate.toLocaleDateString()}
          </span>
        </div>

        {/* Warning for near due */}
        {daysRemaining <= 3 && daysRemaining > 0 && (
          <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-yellow-700">
              Repay soon to avoid late status!
            </span>
          </div>
        )}

        {/* Early repayment bonus - first 4 days of 7-day loan */}
        {daysRemaining > 3 && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-700">
              Repay now for +15 points (early bonus)!
            </span>
          </div>
        )}

        {/* Repay Button */}
        <Link
          href="/repay"
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          Repay Now
        </Link>
      </div>
    </div>
  )
}
