import React from 'react';
import type { RatingStats } from '../../types';
import StarRating from './StarRating';

interface RatingBreakdownProps {
  stats: RatingStats;
}

const RatingBreakdown: React.FC<RatingBreakdownProps> = ({ stats }) => {
  const { average, totalReviews, distribution, trends } = stats;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8">
      {/* Average Section */}
      <div className="flex flex-col items-center justify-center md:border-r border-gray-100 pr-0 md:pr-8 min-w-[150px]">
        <div className="text-5xl font-bold text-gray-900 mb-2">{average.toFixed(1)}</div>
        <StarRating rating={average} size="md" />
        <div className="text-sm text-gray-500 mt-2">{totalReviews} reviews</div>
      </div>

      {/* Distribution Bars */}
      <div className="flex-1 space-y-3">
        {[...distribution].reverse().map(({ star, count }) => {
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600 w-8">{star} star</span>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-stellar rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-400 w-8 text-right">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Mini Trend - Abstract Visualizer */}
      <div className="flex-1 min-w-[200px] flex flex-col">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Rating Trend</h4>
        <div className="flex-1 flex items-end justify-between gap-1 h-24 pt-4 px-2">
          {trends.values.map((val, idx) => (
            <div
              key={idx}
              className="w-full bg-stellar/20 rounded-t-sm hover:bg-stellar/40 transition-colors relative group"
              style={{ height: `${(val / 5) * 100}%` }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {trends.labels[idx]}: {val}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-gray-400">
          <span>{trends.labels[0]}</span>
          <span>{trends.labels[trends.labels.length - 1]}</span>
        </div>
      </div>
    </div>
  );
};

export default RatingBreakdown;
