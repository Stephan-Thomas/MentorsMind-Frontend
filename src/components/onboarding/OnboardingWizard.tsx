import type { OnboardingStepId, OnboardingState } from '../../types';
import OnboardingStep from './OnboardingStep';

interface OnboardingWizardProps {
  currentStep: OnboardingStepId;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onComplete: () => void;
  updateData: (step: keyof OnboardingState['data'], data: any) => void;
  data: OnboardingState['data'];
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  currentStep,
  onNext,
  onPrev,
  onSkip,
  onComplete,
  updateData,
  data
}) => {
  const steps: Record<OnboardingStepId, React.ReactNode> = {
    profile: (
      <OnboardingStep
        title="Complete your Profile"
        description="Tell the community about your expertise and background."
        onNext={onNext}
        onSkip={onSkip}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2"> Professional Bio</label>
            <textarea
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-stellar outline-none transition-all min-h-[120px]"
              placeholder="Ex: I am a Senior Blockchain Engineer with 10 years of experience..."
              value={data.profile?.bio || ''}
              onChange={(e) => updateData('profile', { ...data.profile, bio: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-stellar outline-none transition-all"
              placeholder="Ex: Smart Contracts, DeFi, UX Design"
              value={data.profile?.specialization || ''}
              onChange={(e) => updateData('profile', { ...data.profile, specialization: e.target.value })}
            />
          </div>
        </div>
      </OnboardingStep>
    ),
    wallet: (
      <OnboardingStep
        title="Connect Stellar Wallet"
        description="Receive instant payments from your mentees directly to your wallet."
        onNext={onNext}
        onBack={onPrev}
        onSkip={onSkip}
      >
        <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
          <div className="w-16 h-16 bg-stellar/10 rounded-2xl flex items-center justify-center text-stellar mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <p className="text-gray-500 mb-6 font-medium">No wallet connected</p>
          <button 
            onClick={() => updateData('wallet', { address: 'G...XYZ', connected: true })}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
              data.wallet?.connected ? 'bg-green-500 text-white' : 'bg-white border-2 border-gray-100 text-gray-900 overflow-hidden relative group'
            }`}
          >
            {data.wallet?.connected ? '✓ Wallet Connected' : 'Connect Albedo / Freighter'}
            {!data.wallet?.connected && <div className="absolute inset-0 bg-stellar/5 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />}
          </button>
          {data.wallet?.connected && <p className="mt-4 text-[10px] font-mono text-gray-400">Address: GC...34X</p>}
        </div>
      </OnboardingStep>
    ),
    availability: (
      <OnboardingStep
        title="Set Availability"
        description="Configure when you're available for mentoring sessions."
        onNext={onNext}
        onBack={onPrev}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <button
              key={day}
              className="p-4 border-2 border-gray-100 rounded-xl hover:border-stellar hover:bg-stellar/5 transition-all text-center"
            >
              <div className="font-bold text-gray-900">{day}</div>
              <div className="text-[10px] text-gray-400">9:00 AM - 5:00 PM</div>
            </button>
          ))}
          <button className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs font-bold hover:bg-gray-50">
            + Add Slot
          </button>
        </div>
      </OnboardingStep>
    ),
    pricing: (
      <OnboardingStep
        title="Pricing Configuration"
        description="Set your hourly rate for mentoring sessions."
        onNext={onNext}
        onBack={onPrev}
      >
        <div className="max-w-xs mx-auto text-center py-10">
          <div className="relative inline-block">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
            <input
              type="number"
              className="w-full pl-10 pr-16 py-4 text-4xl font-bold text-gray-900 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-stellar outline-none"
              placeholder="50"
              value={data.pricing?.hourlyRate || ''}
              onChange={(e) => updateData('pricing', { hourlyRate: parseInt(e.target.value) || 0, currency: 'USD' })}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">/hr</span>
          </div>
          <p className="mt-6 text-sm text-gray-500">You'll receive payments in <strong>XLM</strong> or <strong>USDC</strong> equivalents.</p>
        </div>
      </OnboardingStep>
    ),
    tutorial: (
      <OnboardingStep
        title="Quick Tutorial"
        description="Learn how to make the most of MentorMinds."
        onNext={onComplete}
        onBack={onPrev}
        nextLabel="Finish & Celebrate"
      >
        <div className="space-y-4">
          {[
            { t: 'Managing Sessions', d: 'View and accept session requests from your dashboard.' },
            { t: 'Instant Payments', d: 'Funds are held in escrow and released after each session.' },
            { t: 'Review System', d: 'Build your reputation through ratings and verified feedback.' }
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-stellar/5 transition-colors border border-transparent hover:border-stellar/10">
              <div className="w-10 h-10 rounded-full bg-stellar/10 flex items-center justify-center text-stellar font-bold shrink-0">{i+1}</div>
              <div>
                <h4 className="font-bold text-gray-900">{item.t}</h4>
                <p className="text-sm text-gray-500">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </OnboardingStep>
    ),
    complete: null
  };

  return steps[currentStep] || null;
};

export default OnboardingWizard;
