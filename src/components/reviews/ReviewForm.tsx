import React, { useState } from 'react';
import StarRating from './StarRating';

interface ReviewFormProps {
  onSubmit: (review: { rating: number; comment: string; reviewerName: string; isVerified: boolean }) => void;
  onCancel?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      setError('Please provide a comment');
      return;
    }
    setError('');
    onSubmit({ rating, comment, reviewerName: name || 'Anonymous', isVerified: true });
    
    // Reset form
    setRating(0);
    setComment('');
    setName('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">How would you rate this mentor?</label>
          <StarRating rating={rating} interactive onRatingChange={setRating} size="lg" />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name (Optional)</label>
          <input
            id="name"
            type="text"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-stellar focus:border-transparent outline-none transition-all"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Review Details</label>
          <textarea
            id="comment"
            rows={4}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-stellar focus:border-transparent outline-none transition-all resize-none"
            placeholder="What was your experience like?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2 bg-stellar text-white font-semibold rounded-lg hover:bg-stellar-dark transition-colors"
          >
            Post Review
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
