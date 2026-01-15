'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { parseUnits } from 'viem'
import { X, Store, CreditCard, Clock, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useCreateLoan, useAvailableCredit } from '@/hooks/useContracts'
import { MERCHANT_ADDRESS, BNPL_CORE_ADDRESS } from '@/lib/constants'
import { BNPL_CORE_ABI } from '@/lib/contracts'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
}

interface CheckoutModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function CheckoutModal({ product, isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const { address } = useAccount()
  const { data: availableCredit = BigInt(0) } = useAvailableCredit(address)
  const { writeContractAsync, isPending } = useCreateLoan()
  
  const [step, setStep] = useState<'confirm' | 'pending' | 'success' | 'error'>('confirm')
  const [error, setError] = useState<string | null>(null)

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('confirm')
      setError(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  const availableCreditNum = Number(availableCredit) / 1e6
  const hasEnoughCredit = availableCreditNum >= product.price
  const remainingCredit = availableCreditNum - product.price

  const handleConfirmPurchase = async () => {
    if (!hasEnoughCredit || !writeContractAsync) return
    
    setStep('pending')
    setError(null)
    
    const toastId = toast.loading('Processing your BNPL purchase...')
    
    try {
      const amountBigInt = parseUnits(product.price.toString(), 6)
      
      await writeContractAsync({
        address: BNPL_CORE_ADDRESS as `0x${string}`,
        abi: BNPL_CORE_ABI,
        functionName: 'createLoan',
        args: [amountBigInt, MERCHANT_ADDRESS as `0x${string}`],
      })
      
      toast.success(`Purchase successful! ${product.name} is yours!`, { id: toastId })
      setStep('success')
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 2000)
    } catch (err) {
      console.error('Purchase failed:', err)
      const errorMsg = err instanceof Error ? err.message : 'Transaction failed'
      toast.error(`Purchase failed: ${errorMsg}`, { id: toastId })
      setError(errorMsg)
      setStep('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">BNPL Checkout</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'confirm' && (
            <div className="space-y-6">
              {/* Product Info */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                  {product.image}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)} USDC</p>
                </div>
              </div>

              {/* Merchant Info */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Store className="w-4 h-4" />
                <span>Merchant: {MERCHANT_ADDRESS.slice(0, 6)}...{MERCHANT_ADDRESS.slice(-4)}</span>
              </div>

              {/* Credit Check */}
              <div className="p-4 rounded-xl border-2 border-dashed border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Your Credit Limit</span>
                  <span className={`font-semibold ${hasEnoughCredit ? 'text-green-600' : 'text-red-600'}`}>
                    {availableCreditNum.toFixed(2)} USDC
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">After Purchase</span>
                  <span className="font-semibold text-gray-700">
                    {remainingCredit.toFixed(2)} USDC
                  </span>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Repay within 30 days to build credit. Early repayment earns bonus points!
                </p>
              </div>

              {/* Error message */}
              {!hasEnoughCredit && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-700">
                    Insufficient credit limit for this purchase.
                  </p>
                </div>
              )}

              {/* Confirm Button */}
              <button
                onClick={handleConfirmPurchase}
                disabled={!hasEnoughCredit || isPending}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                  hasEnoughCredit
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Confirm BNPL Purchase
              </button>
            </div>
          )}

          {step === 'pending' && (
            <div className="text-center py-8">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {isPending ? 'Confirm in Wallet' : 'Processing...'}
              </h3>
              <p className="text-gray-600">
                {isPending 
                  ? 'Please confirm the transaction in your wallet'
                  : 'Your purchase is being processed on-chain'
                }
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Purchase Complete!</h3>
              <p className="text-gray-600">
                Repay by {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()} to earn +10 score
              </p>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Transaction Failed</h3>
              <p className="text-gray-600 mb-4">
                {error || 'Something went wrong. Please try again.'}
              </p>
              <button
                onClick={() => setStep('confirm')}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
