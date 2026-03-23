import React from 'react';
import type { OnboardingStepId } from '../../types';

interface ProgressIndicatorProps {
  steps: OnboardingStepId[];
  currentStep: OnboardingStepId;
  completedSteps: OnboardingStepId[];
  progress: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  steps, 
  currentStep, 
  completedSteps,
  progress 
}) => {
  const stepLabels: Record<OnboardingStepId, string> = {
    profile: 'Profile',
    wallet: 'Wallet',
    availability: 'Availability',
    pricing: 'Pricing',
    tutorial: 'Tutorial',
    complete: 'Ready'
  };

  const activeIndex = steps.indexOf(currentStep);

  return (
    <div className="w-full mb-12">
      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-stellar transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps dots */}
      <div className="flex justify-between relative px-2">
        {steps.map((step, idx) => {
          const isCompleted = completedSteps.includes(step) || idx < activeIndex;
          const isActive = step === currentStep;
          
          return (
            <div key={step} className="flex flex-col items-center gap-2 relative z-10">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isActive 
                    ? 'bg-stellar text-white ring-4 ring-stellar/20 scale-110' 
                    : isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white border-2 border-gray-200 text-gray-400'
                }`}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${
                isActive ? 'text-stellar' : 'text-gray-400'
              }`}>
                {stepLabels[step]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;
