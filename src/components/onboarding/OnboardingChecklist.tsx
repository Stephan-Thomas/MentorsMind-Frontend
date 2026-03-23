import React from 'react';
import type { OnboardingStepId } from '../../types';

interface OnboardingChecklistProps {
  completedSteps: OnboardingStepId[];
  onStepClick: (step: OnboardingStepId) => void;
  isDismissed: boolean;
  onResume: () => void;
}

const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  completedSteps,
  onStepClick,
  isDismissed,
  onResume,
}) => {
  const tasks: { id: OnboardingStepId; label: string; desc: string }[] = [
    { id: 'profile', label: 'Complete Profile', desc: 'Add bio and expertise' },
    { id: 'wallet', label: 'Connect Wallet', desc: 'Enable instant payments' },
    { id: 'availability', label: 'Set Schedule', desc: 'Define your weekly slots' },
    { id: 'pricing', label: 'Set Pricing', desc: 'Configure hourly rates' },
    { id: 'tutorial', label: 'Watch Tutorial', desc: 'Learn platform basics' },
  ];

  const remainingCount = tasks.length - completedSteps.length;

  if (remainingCount === 0 || (!isDismissed && completedSteps.length > 0)) {
    // Only show when dismissed or if specifically requested (as a dashboard widget)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Mentor Setup</h3>
          <p className="text-sm text-gray-500">{remainingCount} tasks remaining to reach 100%</p>
        </div>
        {isDismissed && (
          <button 
            onClick={onResume}
            className="text-xs font-bold text-stellar hover:underline"
          >
            Resume Full Guide
          </button>
        )}
      </div>

      <div className="space-y-4">
        {tasks.map((task) => {
          const isDone = completedSteps.includes(task.id);
          return (
            <button
              key={task.id}
              onClick={() => onStepClick(task.id)}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                isDone ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200 group-hover:border-stellar'
              }`}>
                {isDone ? '✓' : ''}
              </div>
              <div className="flex-1">
                <div className={`text-sm font-bold ${isDone ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                  {task.label}
                </div>
                {!isDone && <div className="text-[11px] text-gray-400">{task.desc}</div>}
              </div>
              {!isDone && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-stellar">
                  →
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingChecklist;
