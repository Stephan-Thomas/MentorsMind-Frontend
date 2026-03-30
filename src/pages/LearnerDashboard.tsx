import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useReminders } from '../hooks/useReminders';
import { useRecommendations } from '../hooks/useRecommendations';
import { useDashboard } from '../hooks/useDashboard';
import { usePostSessionReview } from '../hooks/usePostSessionReview';
import { useAchievements } from '../hooks/useAchievements';
import { useStreak } from '../hooks/useStreak';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { DashboardGrid } from '../components/dashboard/DashboardGrid';
import { Widget } from '../components/dashboard/Widget';
import ReminderSettings from '../components/learner/ReminderSettings';
import UpcomingReminders from '../components/learner/UpcomingReminders';
import LearningRecommendations from '../components/learner/LearningRecommendations';
import SessionPrep from '../components/learner/SessionPrep';
import RecommendedMentors from '../components/learner/RecommendedMentors';
import AchievementBadges from '../components/learner/AchievementBadges';
import ProgressRing from '../components/learner/ProgressRing';
import MilestoneModal from '../components/learner/MilestoneModal';
import StreakWidget from '../components/learner/StreakWidget';
import StreakCalendar from '../components/learner/StreakCalendar';
import MilestoneProgress from '../components/learner/MilestoneProgress';
import PostSessionReview from '../components/session/PostSessionReview';
import type { Session, SessionHistoryItem } from '../types';

// Mock upcoming sessions
const MOCK_SESSIONS: Session[] = [
  {
    id: 's1',
    learnerId: 'l1',
    learnerName: 'Emma',
    topic: 'React Design Patterns & Clean Code',
    startTime: new Date(Date.now() + 3600000 * 2).toISOString(),
    duration: 60,
    status: 'confirmed',
    price: 50,
    currency: 'XLM',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
  },
  {
    id: 's2',
    learnerId: 'l1',
    learnerName: 'Emma',
    topic: 'Advanced TypeScript: Utility Types',
    startTime: new Date(Date.now() + 86400000 * 1.5).toISOString(),
    duration: 45,
    status: 'pending',
    price: 40,
    currency: 'USDC',
  },
];

// Mock completed sessions eligible for post-session review (ended > 1 hour ago)
const MOCK_COMPLETED_SESSIONS: SessionHistoryItem[] = [
  {
    id: 'cs1',
    mentorId: 'm1',
    mentorName: 'Dr. Sarah Chen',
    topic: 'Stellar Smart Contracts Deep Dive',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    status: 'completed',
    skills: ['Stellar', 'Soroban', 'TypeScript'],
    amount: 50,
    currency: 'XLM',
  },
];

export const LearnerDashboardContent: React.FC = () => {
  const {
    settings,
    upcomingReminders,
    history,
    updateSettings,
    snoozeReminder,
    dismissReminder,
    addCustomTime,
    removeCustomTime,
  } = useReminders(MOCK_SESSIONS);

  const {
    mentors,
    isLoading: isLoadingRecommendations,
    toggleMentorBookmark,
    setMentorFeedback,
    dismissMentor,
    refreshRecommendations,
  } = useRecommendations();

  const { setRole, setLoading, widgets } = useDashboard();

  const {
    progress,
    streakDays,
    totalHours,
    achievementPercent,
    nextAchievement,
    isLeaderboardOptIn,
    toggleLeaderboardOptIn,
    isMilestoneModalVisible,
    milestoneCelebration,
    unlockAchievement,
    exportProgressCard,
    exportProgressReport,
    closeMilestoneModal,
  } = useAchievements();

  const {
    currentWeekStreak,
    heatGrid,
    mntEarnedTotal,
    unclaimedMnt,
    claimUnclaimedMnt,
    milestoneSessions,
    milestoneTarget,
    milestoneBonus,
    streakBroken,
    dismissStreakBroken,
    celebrationOpen,
    celebrationMessage,
    closeCelebration,
  } = useStreak({ sessionsCompleted: progress.sessionsCompleted });

  const { pendingSession, submitted, updatedRating, submitReview, dismissForNow, close } =
    usePostSessionReview(MOCK_COMPLETED_SESSIONS);

  useEffect(() => {
    setRole('learner');
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [setRole, setLoading]);

  return (
    <div className="p-6 space-y-8">
      {pendingSession && (
        <PostSessionReview
          session={pendingSession}
          submitted={submitted}
          updatedRating={updatedRating}
          onSubmit={submitReview}
          onDismiss={dismissForNow}
          onClose={close}
        />
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Learner Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            You have {MOCK_SESSIONS.length} upcoming sessions this week.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-500 font-bold">
              128
            </div>
            <div className="text-xs">
              <div className="font-bold text-gray-900 dark:text-white leading-none">XLM</div>
              <div className="text-gray-400 dark:text-gray-500">Balance</div>
            </div>
          </div>
        </div>
      </header>

      <MilestoneModal
        visible={isMilestoneModalVisible}
        message={milestoneCelebration}
        onClose={closeMilestoneModal}
        withCelebration
      />

      <MilestoneModal
        visible={celebrationOpen}
        message={celebrationMessage}
        onClose={closeCelebration}
        withCelebration
      />

      {streakBroken ? (
        <div
          role="alert"
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 dark:border-amber-900/50 dark:bg-amber-950/30"
        >
          <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
            Your streak ended. Start a new one!
          </p>
          <button
            type="button"
            onClick={dismissStreakBroken}
            className="shrink-0 rounded-xl bg-white px-4 py-2 text-xs font-bold text-amber-900 shadow-sm ring-1 ring-amber-200 hover:bg-amber-100 dark:bg-gray-900 dark:text-amber-100 dark:ring-amber-800"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-3">
        <StreakWidget streakWeeks={currentWeekStreak} />

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">MNT from streaks</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Total earned: <span className="font-bold text-gray-900 dark:text-white">{mntEarnedTotal} MNT</span>
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Unclaimed:{' '}
            <span className="font-black text-amber-600 dark:text-amber-400">{unclaimedMnt} MNT</span>
          </p>
          <button
            type="button"
            disabled={unclaimedMnt <= 0}
            onClick={claimUnclaimedMnt}
            className="mt-4 w-full rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Claim rewards
          </button>
        </div>

        <MilestoneProgress
          currentSessions={milestoneSessions}
          targetSessions={milestoneTarget}
          bonusMnt={milestoneBonus}
        />
      </section>

      <section>
        <StreakCalendar heatGrid={heatGrid} />
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:col-span-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Streak detail</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Consecutive days & hours invested</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/30 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Days</p>
              <p className="mt-1 text-3xl font-black text-gray-900 dark:text-white">{streakDays}</p>
            </div>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Hours</p>
              <p className="mt-1 text-3xl font-black text-gray-900 dark:text-white">{totalHours}h</p>
            </div>
          </div>
          {nextAchievement?.title ? (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Next badge: <span className="font-semibold">{nextAchievement.title}</span>
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Goal Progress</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Weekly goal and achievement completion.</p>
          <div className="mt-4 flex items-center justify-center">
            <ProgressRing value={achievementPercent} />
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={exportProgressCard}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
            >
              Export Progress Card
            </button>
            <button
              type="button"
              onClick={exportProgressReport}
              className="rounded-xl border border-blue-600 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
            >
              Download Progress Report
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Leaderboard</h3>
            <span className="text-xs text-slate-400">Opt-in</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm font-semibold">
            <span className="text-gray-700 dark:text-gray-200">{isLeaderboardOptIn ? 'Enabled' : 'Disabled'}</span>
            <button
              type="button"
              onClick={toggleLeaderboardOptIn}
              className={`rounded-lg px-3 py-1 text-xs font-bold ${
                isLeaderboardOptIn
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200'
              }`}
            >
              {isLeaderboardOptIn ? 'Opt Out' : 'Opt In'}
            </button>
          </div>
          <Link
            to="/leaderboard"
            className="mt-4 flex w-full items-center justify-center rounded-xl border border-blue-600 px-4 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-950/30"
          >
            View streak leaderboard
          </Link>
        </div>
      </section>

      <section>
        <AchievementBadges achievements={progress.achievements} onUnlock={unlockAchievement} />
      </section>

      <DashboardGrid>
        {widgets
          .filter((w) => w.visible)
          .sort((a, b) => a.order - b.order)
          .map((widget) => (
            <Widget key={widget.id} config={widget}>
              {widget.id === 'stats' && (
                <UpcomingReminders
                  reminders={upcomingReminders}
                  history={history}
                  onSnooze={(id: string) => snoozeReminder(id)}
                  onDismiss={(id: string) => dismissReminder(id)}
                />
              )}
              {widget.id === 'sessions' && <SessionPrep />}
              {widget.id === 'earnings' && (
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                  <h3 className="text-lg font-bold mb-2 text-white">Next Session Prep</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Review tips to make the most of your time.
                  </p>
                  <button className="w-full py-2 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-50 transition-all">
                    Prep Toolkit
                  </button>
                </div>
              )}
              {widget.id === 'activity' && (
                <ReminderSettings
                  settings={settings}
                  onUpdate={updateSettings}
                  onAddCustomTime={addCustomTime}
                  onRemoveCustomTime={removeCustomTime}
                />
              )}
            </Widget>
          ))}
      </DashboardGrid>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recommended for you</h2>
            <p className="text-gray-500 text-sm mt-1">
              Personalized mentor suggestions based on your goals
            </p>
          </div>
          <button
            onClick={refreshRecommendations}
            className="px-4 py-2 text-sm font-medium text-stellar hover:bg-stellar/10 rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
        <RecommendedMentors
          mentors={mentors}
          onBookmark={toggleMentorBookmark}
          onFeedback={setMentorFeedback}
          onDismiss={dismissMentor}
          isLoading={isLoadingRecommendations}
        />
      </section>

      <LearningRecommendations />
    </div>
  );
};

const LearnerDashboard: React.FC = () => (
  <DashboardLayout>
    <LearnerDashboardContent />
  </DashboardLayout>
);

export default LearnerDashboard;
