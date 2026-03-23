import { useState, useEffect } from 'react';
import type { OnboardingState, OnboardingStepId } from '../types';

const INITIAL_STATE: OnboardingState = {
  currentStep: 'profile',
  completedSteps: [],
  isDismissed: false,
  isCelebrated: false,
  data: {}
};

const STORAGE_KEY = 'mentor_onboarding_progress';

export const useOnboarding = () => {
  const [state, setState] = useState<OnboardingState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const steps: OnboardingStepId[] = ['profile', 'wallet', 'availability', 'pricing', 'tutorial', 'complete'];

  const nextStep = () => {
    const currentIndex = steps.indexOf(state.currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStepId = steps[currentIndex + 1];
      setState(prev => ({
        ...prev,
        currentStep: nextStepId,
        completedSteps: Array.from(new Set([...prev.completedSteps, prev.currentStep]))
      }));
    }
  };

  const prevStep = () => {
    const currentIndex = steps.indexOf(state.currentStep);
    if (currentIndex > 0) {
      setState(prev => ({
        ...prev,
        currentStep: steps[currentIndex - 1]
      }));
    }
  };

  const skipToDashboard = () => {
    setState(prev => ({ ...prev, isDismissed: true }));
  };

  const resumeOnboarding = () => {
    setState(prev => ({ ...prev, isDismissed: false }));
  };

  const completeOnboarding = () => {
    setState(prev => ({
      ...prev,
      currentStep: 'complete',
      completedSteps: steps.filter(s => s !== 'complete'),
      isCelebrated: true
    }));
  };

  const updateData = (step: keyof OnboardingState['data'], stepData: any) => {
    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [step]: stepData
      }
    }));
  };

  const resetOnboarding = () => {
    setState(INITIAL_STATE);
    localStorage.removeItem(STORAGE_KEY);
  };

  const progress = (state.completedSteps.length / (steps.length - 1)) * 100;

  return {
    ...state,
    steps,
    nextStep,
    prevStep,
    skipToDashboard,
    resumeOnboarding,
    completeOnboarding,
    updateData,
    resetOnboarding,
    progress
  };
};
