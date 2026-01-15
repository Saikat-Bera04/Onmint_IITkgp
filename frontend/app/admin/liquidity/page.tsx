'use client'

import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { parseUnits } from 'viem'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import { 
  useContractBalance, 
  useTotalLiquidityDeposited,
  useTotalLiquidityWithdrawn,
  useUSDCBalance,
  useUSDCAllowance,
  useApproveUSDC,
  useDepositLiquidity,
  useWithdrawLiquidity
} from '@/hooks/useContracts'
import { BNPL_CORE_ADDRESS, USDC_ADDRESS } from '@/lib/constants'
import { 
  DollarSign, 
  ArrowLeft,
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Wallet,
  Loader2,
  CheckCircle,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AdminLiquidityPage() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const isAdmin = useIsAdmin()
  
  const { data: contractBalance = BigInt(0), refetch: refetchBalance } = useContractBalance()
  const { data: totalDeposited = BigInt(0) } = useTotalLiquidityDeposited()
  const { data: totalWithdrawn = BigInt(0) } = useTotalLiquidityWithdrawn()
  const { data: userUSDCBalance = BigInt(0), refetch: refetchUserBalance } = useUSDCBalance(address)
  const { data: allowance = BigInt(0), refetch: refetchAllowance } = useUSDCAllowance(address, BNPL_CORE_ADDRESS as `0x${string}`)
  
  const { writeContractAsync: approveUSDC, isPending: isApproving } = useApproveUSDC()
  const { writeContractAsync: depositLiquidity, isPending: isDepositing } = useDepositLiquidity()
  const { writeContractAsync: withdrawLiquidity, isPending: isWithdrawing } = useWithdrawLiquidity()
  
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [needsApproval, setNeedsApproval] = useState(false)

  // Redirect non-admin users
  useEffect(() => {
    if (isConnected && !isAdmin) {
      router.push('/dashboard')
    }
  }, [isConnected, isAdmin, router])

  // Check if approval needed
  useEffect(() => {
    if (amount && activeTab === 'deposit') {
      const amountBigInt = parseUnits(amount || '0', 6)
      setNeedsApproval(allowance < amountBigInt)
    } else {
      setNeedsApproval(false)
    }
  }, [amount, allowance, activeTab])

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center space-y-6">
          <Shield className="w-16 h-16 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Access Required</h1>
          <p className="text-gray-600">Please connect with the admin wallet</p>
          <ConnectButton />
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center space-y-6">
          <AlertTriangle className="w-16 h-16 mx-auto text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">This wallet is not authorized for admin access</p>
        </div>
      </div>
    )
  }

  const balance = Number(contractBalance) / 1e6
  const deposited = Number(totalDeposited) / 1e6
  const withdrawn = Number(totalWithdrawn) / 1e6
  const userBalance = Number(userUSDCBalance) / 1e6

  const handleApprove = async () => {
    setError(null)
    setSuccess(null)
    
    const toastId = toast.loading('Approving USDC...')
    
    try {
      const amountBigInt = parseUnits(amount || '0', 6)
      
      await approveUSDC({
        address: USDC_ADDRESS as `0x${string}`,
        abi: [
          {
            name: 'approve',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'spender', type: 'address' },
              { name: 'amount', type: 'uint256' },
            ],
            outputs: [{ name: '', type: 'bool' }],
          },
        ],
        functionName: 'approve',
        args: [BNPL_CORE_ADDRESS as `0x${string}`, amountBigInt],
      })
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      await refetchAllowance()
      const successMsg = 'USDC approved! You can now deposit.'
      toast.success(successMsg, { id: toastId })
      setSuccess(successMsg)
    } catch (err) {
      console.error('Approval failed:', err)
      const errorMsg = 'Failed to approve USDC. Please try again.'
      toast.error(errorMsg, { id: toastId })
      setError(errorMsg)
    }
  }

  const handleDeposit = async () => {
    setError(null)
    setSuccess(null)
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      toast.error('Please enter a valid amount')
      return
    }
    
    const toastId = toast.loading(`Depositing ${amount} USDC...`)
    
    try {
      const amountBigInt = parseUnits(amount, 6)
      
      await depositLiquidity({
        address: BNPL_CORE_ADDRESS as `0x${string}`,
        abi: [
          {
            name: 'depositLiquidity',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [{ name: 'amount', type: 'uint256' }],
            outputs: [],
          },
        ],
        functionName: 'depositLiquidity',
        args: [amountBigInt],
      })
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      await Promise.all([refetchBalance(), refetchUserBalance(), refetchAllowance()])
      const successMsg = `Successfully deposited ${amount} USDC!`
      toast.success(successMsg, { id: toastId })
      setSuccess(successMsg)
      setAmount('')
    } catch (err) {
      console.error('Deposit failed:', err)
      const errorMsg = 'Failed to deposit. Please try again.'
      toast.error(errorMsg, { id: toastId })
      setError(errorMsg)
    }
  }

  const handleWithdraw = async () => {
    setError(null)
    setSuccess(null)
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      toast.error('Please enter a valid amount')
      return
    }
    
    if (parseFloat(amount) > balance) {
      setError('Insufficient contract balance')
      toast.error('Insufficient contract balance')
      return
    }
    
    const toastId = toast.loading(`Withdrawing ${amount} USDC...`)
    
    try {
      const amountBigInt = parseUnits(amount, 6)
      
      await withdrawLiquidity({
        address: BNPL_CORE_ADDRESS as `0x${string}`,
        abi: [
          {
            name: 'withdrawLiquidity',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [{ name: 'amount', type: 'uint256' }],
            outputs: [],
          },
        ],
        functionName: 'withdrawLiquidity',
        args: [amountBigInt],
      })
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      await Promise.all([refetchBalance(), refetchUserBalance()])
      const successMsg = `Successfully withdrew ${amount} USDC!`
      toast.success(successMsg, { id: toastId })
      setSuccess(successMsg)
      setAmount('')
    } catch (err) {
      console.error('Withdraw failed:', err)
      const errorMsg = 'Failed to withdraw. Please try again.'
      toast.error(errorMsg, { id: toastId })
      setError(errorMsg)
    }
  }

  const isLoading = isApproving || isDepositing || isWithdrawing

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <Link 
          href="/admin/dashboard" 
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <DollarSign className="w-8 h-8" />
            <span>Liquidity Management</span>
          </h1>
          <p className="text-gray-600 mt-1">Deposit or withdraw USDC from the lending pool</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pool Balance</p>
                <p className="text-xl font-bold text-gray-900">${balance.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Deposited</p>
                <p className="text-xl font-bold text-green-600">${deposited.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Withdrawn</p>
                <p className="text-xl font-bold text-red-600">${withdrawn.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Your USDC</p>
                <p className="text-xl font-bold text-purple-600">${userBalance.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => {
                setActiveTab('deposit')
                setAmount('')
                setError(null)
                setSuccess(null)
              }}
              className={`flex-1 py-4 font-semibold flex items-center justify-center space-x-2 transition-colors ${
                activeTab === 'deposit' 
                  ? 'bg-green-50 text-green-600 border-b-2 border-green-600' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <ArrowDownLeft className="w-5 h-5" />
              <span>Deposit</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('withdraw')
                setAmount('')
                setError(null)
                setSuccess(null)
              }}
              className={`flex-1 py-4 font-semibold flex items-center justify-center space-x-2 transition-colors ${
                activeTab === 'withdraw' 
                  ? 'bg-red-50 text-red-600 border-b-2 border-red-600' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <ArrowUpRight className="w-5 h-5" />
              <span>Withdraw</span>
            </button>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (USDC)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-4 text-2xl font-bold border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  USDC
                </span>
              </div>
              
              {/* Quick Amount Buttons */}
              <div className="flex gap-2 mt-3">
                {[10, 50, 100, 500].map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount.toString())}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    ${quickAmount}
                  </button>
                ))}
                {activeTab === 'deposit' && userBalance > 0 && (
                  <button
                    onClick={() => setAmount(userBalance.toFixed(2))}
                    className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Max
                  </button>
                )}
                {activeTab === 'withdraw' && balance > 0 && (
                  <button
                    onClick={() => setAmount(balance.toFixed(2))}
                    className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Max
                  </button>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
              {activeTab === 'deposit' ? (
                <p>
                  Depositing USDC adds liquidity to the lending pool, enabling users to take BNPL loans.
                  Your wallet balance: <span className="font-bold">${userBalance.toFixed(2)} USDC</span>
                </p>
              ) : (
                <p>
                  Withdrawing USDC removes liquidity from the lending pool.
                  Available to withdraw: <span className="font-bold">${balance.toFixed(2)} USDC</span>
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Action Buttons */}
            {activeTab === 'deposit' ? (
              <div className="space-y-3">
                {needsApproval ? (
                  <button
                    onClick={handleApprove}
                    disabled={isLoading || !amount}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 hover:bg-blue-700 transition-colors"
                  >
                    {isApproving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Approving...</span>
                      </>
                    ) : (
                      <>
                        <Wallet className="w-5 h-5" />
                        <span>Approve USDC</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleDeposit}
                    disabled={isLoading || !amount}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 hover:shadow-lg transition-all"
                  >
                    {isDepositing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Depositing...</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownLeft className="w-5 h-5" />
                        <span>Deposit {amount || '0'} USDC</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={handleWithdraw}
                disabled={isLoading || !amount}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 hover:shadow-lg transition-all"
              >
                {isWithdrawing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Withdrawing...</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-5 h-5" />
                    <span>Withdraw {amount || '0'} USDC</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Important Note</p>
            <p className="text-sm text-yellow-700">
              Make sure to maintain sufficient liquidity in the pool for active loans.
              Withdrawing too much may prevent users from creating new loans.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
