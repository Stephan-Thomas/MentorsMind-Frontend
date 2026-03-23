import React from 'react';

interface OnboardingStepProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  isNextDisabled?: boolean;
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({
  title,
  description,
  children,
  onNext,
  onBack,
  onSkip,
  nextLabel = 'Continue',
  isNextDisabled = false,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="mb-10 min-h-[300px]">
        {children}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <div className="flex gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
            >
              Back
            </button>
          )}
          {onSkip && (
            <button
              onClick={onSkip}
              className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-stellar transition-colors"
            >
              Skip for now
            </button>
          )}
        </div>
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className="px-8 py-2.5 bg-stellar text-white font-bold rounded-xl hover:bg-stellar-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-stellar/20 active:scale-95"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
};

export default OnboardingStep;
