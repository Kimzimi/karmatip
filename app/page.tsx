'use client';

import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { parseEther } from 'viem';
import { base } from 'wagmi/chains';
import sdk from '@farcaster/frame-sdk';
import Onboarding from './components/Onboarding';
import UserDisplay from './components/UserDisplay';
import { createUserProfile, UserProfile } from '@/lib/userProfile';

interface FrameContext {
  user?: {
    fid?: number;
    username?: string;
  };
}

// DEGEN token on Base
const DEGEN_ADDRESS = '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed' as const;
const DEGEN_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext | null>(null);
  const [tipAmount, setTipAmount] = useState(100);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Wagmi hooks
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Check if this is first visit
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const ctx = await sdk.context;
        setContext(ctx as FrameContext);
        setIsSDKLoaded(true);
        sdk.actions.ready();
      } catch (error) {
        console.error('Failed to initialize SDK:', error);
        setIsSDKLoaded(true);
        sdk.actions.ready();
      }
    };
    load();
  }, []);

  // Create user profile when address or context changes
  useEffect(() => {
    if (address) {
      const profile = createUserProfile(
        address,
        context?.user?.username,
        undefined
      );
      setUserProfile(profile);
    }
  }, [address, context]);

  // Auto-switch to Base when connected
  useEffect(() => {
    if (isConnected && chain && chain.id !== base.id && switchChain) {
      switchChain({ chainId: base.id });
    }
  }, [isConnected, chain, switchChain]);

  const handleTip = async () => {
    if (!isConnected) {
      setShowWalletModal(true);
      return;
    }

    if (!recipientAddress) {
      alert('Please enter recipient address');
      return;
    }

    if (chain && chain.id !== base.id) {
      alert('Please switch to Base network');
      if (switchChain) {
        switchChain({ chainId: base.id });
      }
      return;
    }

    try {
      // Using writeContract for direct transfer (no approve needed for transfers from own wallet)
      writeContract({
        address: DEGEN_ADDRESS,
        abi: DEGEN_ABI,
        functionName: 'transfer',
        args: [recipientAddress as `0x${string}`, parseEther(tipAmount.toString())],
        chainId: base.id,
      });
    } catch (error) {
      console.error('Tip failed:', error);
      alert('Failed to send tip. Check console for details.');
    }
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (!isSDKLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500">
        <div className="text-white text-2xl font-bold animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✨</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Karma Tipper
          </h1>
          <p className="text-gray-600">
            Support creators with crypto tips on Base
          </p>
          <button
            onClick={() => setShowOnboarding(true)}
            className="mt-2 text-sm text-purple-600 hover:text-purple-800 font-semibold"
          >
            👋 View Tutorial
          </button>
        </div>

        {/* User Profile Display - Show when connected */}
        {isConnected && userProfile && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 mb-6">
            <UserDisplay profile={userProfile} size="md" showAddress={!context?.user?.username} />
            {context?.user?.fid && (
              <div className="mt-2 text-xs text-gray-600">
                FID: {context.user.fid}
              </div>
            )}
          </div>
        )}

        {/* Wallet Connection Status */}
        <div className="mb-6">
          {!isConnected ? (
            <div>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-4 border border-blue-200">
                <p className="text-sm text-gray-700 mb-2">
                  💡 <strong>Explore first</strong> - See how it works before connecting
                </p>
                <p className="text-xs text-gray-600">
                  Connect your wallet when ready to send tips
                </p>
              </div>
              <button
                onClick={() => setShowWalletModal(true)}
                className="w-full py-4 px-6 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <span className="text-2xl">👛</span>
                Connect Wallet
              </button>
            </div>
          ) : (
            <div>
              <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">Connected</div>
                    {userProfile && (
                      <div className="font-semibold text-gray-800">
                        {userProfile.displayName}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => disconnect()}
                    className="text-xs bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold"
                  >
                    Disconnect
                  </button>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-600">Network</div>
                  <div className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    chain?.id === base.id
                      ? 'bg-green-200 text-green-800'
                      : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {chain?.id === base.id ? '✓ Base' : chain?.name || 'Unknown'}
                  </div>
                </div>
                {chain && chain.id !== base.id && switchChain && (
                  <button
                    onClick={() => switchChain({ chainId: base.id })}
                    className="w-full mt-3 py-2 px-4 rounded-lg bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600"
                  >
                    Switch to Base
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Recipient Address */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="0x... or paste wallet address"
            className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none font-mono text-sm"
            disabled={!isConnected}
          />
          <p className="text-xs text-gray-500 mt-1">
            {isConnected
              ? 'Enter the wallet address to send DEGEN tokens'
              : 'Connect wallet to enable tipping'}
          </p>
        </div>

        {/* Tip Amount Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Tip Amount (DEGEN)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[100, 250, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => setTipAmount(amount)}
                disabled={!isConnected}
                className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                  tipAmount === amount
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : isConnected
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                {amount}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <input
              type="number"
              value={tipAmount}
              onChange={(e) => setTipAmount(Number(e.target.value))}
              className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none font-semibold"
              placeholder="Custom amount"
              min="1"
              disabled={!isConnected}
            />
          </div>
        </div>

        {/* Tip Button */}
        <button
          onClick={handleTip}
          disabled={!isConnected || isConfirming || isPending || !recipientAddress || chain?.id !== base.id}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
            isConfirmed
              ? 'bg-green-500 text-white'
              : isConfirming || isPending
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : !isConnected
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : !recipientAddress || chain?.id !== base.id
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl hover:scale-105'
          }`}
        >
          {isConfirmed ? (
            <span className="flex items-center justify-center">
              <span className="mr-2">✓</span> Tip Sent Successfully!
            </span>
          ) : isConfirming ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2">⏳</span> Confirming...
            </span>
          ) : isPending ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2">⏳</span> Approve in Wallet...
            </span>
          ) : !isConnected ? (
            'Connect Wallet to Send Tips'
          ) : chain?.id !== base.id ? (
            'Switch to Base Network'
          ) : !recipientAddress ? (
            'Enter Recipient Address'
          ) : (
            `✨ Send ${tipAmount} $DEGEN`
          )}
        </button>

        {/* Transaction Hash */}
        {hash && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">Transaction Submitted:</p>
            <a
              href={`https://basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-blue-600 hover:text-blue-800 hover:underline break-all block"
            >
              {hash}
            </a>
            <a
              href={`https://basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 font-semibold"
            >
              View on BaseScan →
            </a>
          </div>
        )}

        {/* Info - Updated to be client-agnostic */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p className="font-semibold">💡 How it works:</p>
          <p className="mt-1">1. Connect your Web3 wallet</p>
          <p>2. Enter recipient address & amount</p>
          <p>3. Send DEGEN tokens on Base</p>
          <p className="mt-3 text-purple-600 font-semibold">Support creators you love! 💜</p>
        </div>

        {/* Wallet Selection Modal */}
        {showWalletModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowWalletModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowWalletModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Connect Wallet</h2>
              <p className="text-sm text-gray-600 mb-6">Choose your Web3 wallet to continue</p>
              <div className="space-y-3">
                {connectors.map((connector, index) => {
                  // Show only specific wallets
                  if (!['Coinbase Wallet', 'MetaMask', 'Rabby Wallet'].includes(connector.name)) {
                    return null;
                  }

                  return (
                    <button
                      key={`${connector.uid}-${index}`}
                      type="button"
                      onClick={async () => {
                        try {
                          setShowWalletModal(false);
                          await new Promise(resolve => setTimeout(resolve, 200));
                          await connect({ connector, chainId: base.id });
                        } catch (error) {
                          console.error('Error:', error);
                          setShowWalletModal(true);
                        }
                      }}
                      className="w-full py-4 px-6 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-between group"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <div className="flex items-center gap-3 pointer-events-none">
                        <span className="text-2xl">
                          {connector.name === 'Coinbase Wallet' && '🔵'}
                          {connector.name === 'MetaMask' && '🦊'}
                          {connector.name === 'Rabby Wallet' && '🐰'}
                        </span>
                        <span>{connector.name}</span>
                      </div>
                      <span className="text-white group-hover:translate-x-1 transition-transform pointer-events-none">→</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                Works with all Web3 wallets on Base network
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
