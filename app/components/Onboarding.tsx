'use client';

import { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      emoji: '✨',
      title: 'Welcome to Karma Tipper',
      description: 'Support creators with crypto tips on Base network',
      details: 'Send $DEGEN tokens to show appreciation for great content',
    },
    {
      emoji: '👛',
      title: 'Connect Your Wallet',
      description: 'Use any Web3 wallet to get started',
      details: 'We support Coinbase Wallet, MetaMask, and more',
    },
    {
      emoji: '💸',
      title: 'Send Tips Instantly',
      description: 'Choose an amount and recipient',
      details: 'Tips are sent directly on Base - fast and low cost',
    },
    {
      emoji: '🎯',
      title: 'Ready to Start!',
      description: 'Explore the app now',
      details: 'You can connect your wallet anytime to send tips',
    },
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative">
        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-sm font-semibold"
        >
          Skip
        </button>

        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === step
                  ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-6 animate-bounce">{currentStep.emoji}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            {currentStep.title}
          </h2>
          <p className="text-xl text-gray-700 mb-3">
            {currentStep.description}
          </p>
          <p className="text-sm text-gray-600">
            {currentStep.details}
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <button
            onClick={handleNext}
            className="w-full py-4 px-6 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl hover:scale-105 transition-all"
          >
            {step < steps.length - 1 ? 'Next' : 'Get Started'}
          </button>

          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="w-full py-3 px-6 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-all"
            >
              Back
            </button>
          )}
        </div>

        {/* Step indicator */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Step {step + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
}
