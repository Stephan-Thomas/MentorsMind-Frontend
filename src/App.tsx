import { useState } from 'react';
import MentorOnboarding from './components/onboarding/MentorOnboarding';
import RatingBreakdown from './components/reviews/RatingBreakdown';
import ReviewForm from './components/reviews/ReviewForm';
import ReviewList from './components/reviews/ReviewList';
import { useReviews } from './hooks/useReviews';

function App() {
  const [view, setView] = useState<'onboarding' | 'reviews'>('onboarding');
  const [showForm, setShowForm] = useState(false);
  
  const { 
    reviews, 
    stats, 
    addReview, 
    voteHelpful, 
    addMentorResponse, 
    filterRating, 
    setFilterRating,
    currentPage,
    totalPages,
    paginate 
  } = useReviews('m1');

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      {/* Dynamic Header */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-stellar rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-xl tracking-tight">MentorMinds <span className="text-stellar">Stellar</span></span>
          </div>
          <div className="flex items-center gap-4 bg-gray-50 p-1 rounded-xl">
            <button
              onClick={() => setView('onboarding')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                view === 'onboarding' ? 'bg-white shadow-sm text-stellar' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Mentor Onboarding
            </button>
            <button
              onClick={() => setView('reviews')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                view === 'reviews' ? 'bg-white shadow-sm text-stellar' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Ratings & Reviews
            </button>
          </div>
          <div className="w-8 h-8 rounded-full bg-stellar/10 border border-stellar/20" />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 pt-10">
        {view === 'onboarding' ? (
          <MentorOnboarding />
        ) : (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold mb-2">Mentor Feedback</h2>
                <p className="text-gray-500">See what the community is saying about your sessions.</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-6 py-2.5 bg-stellar text-white font-bold rounded-xl hover:bg-stellar-dark shadow-lg shadow-stellar/20 transition-all active:scale-95"
              >
                {showForm ? 'Cancel Review' : 'Write a Review'}
              </button>
            </div>

            {showForm && (
              <ReviewForm
                onSubmit={(data) => {
                  addReview({ ...data, reviewerId: 'user-' + Date.now() });
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            )}

            <RatingBreakdown stats={stats} />

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12">
              <ReviewList
                reviews={reviews}
                stats={stats}
                onVoteHelpful={voteHelpful}
                onFilterChange={setFilterRating}
                currentFilter={filterRating}
                onAddResponse={addMentorResponse}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={paginate}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer / Info */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-[10px] text-gray-400 bg-white/80 backdrop-blur-sm border-t border-gray-100">
        Demo Version 1.0 • Built with Vite, React & Tailwind CSS • Powered by Stellar
      </footer>
    </div>
  );
}

export default App;
