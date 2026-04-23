import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import MentorCard from '../components/mentor/MentorCard';
import BookingModal from '../components/learner/BookingModal';
import MentorFilterSidebar, { type MentorFilters } from '../components/search/MentorFilterSidebar';
import MentorCardSkeleton from '../components/search/MentorCardSkeleton';
import Input from '../components/ui/Input';
import type { Mentor } from '../types';
import { searchMentors, type MentorSearchParams } from '../services/mentor.service';

const ALL_SKILLS = [
  'Rust',
  'React',
  'TypeScript',
  'Python',
  'Soroban',
  'Stellar',
  'Node.js',
  'AWS',
  'ML',
  'Docker',
  'Kubernetes',
  'PostgreSQL',
  'TensorFlow',
  'Data Science',
  'DevOps',
  'WebAssembly',
];

const ITEMS_PER_PAGE = 12;

export default function MentorSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bookingMentor, setBookingMentor] = useState<Mentor | null>(null);
  const [filters, setFilters] = useState<MentorFilters>({
    skills: searchParams.get('skills')?.split(',').filter(Boolean) || [],
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 500,
    minRating: Number(searchParams.get('minRating')) || 0,
    availableOnly: searchParams.get('available') === 'true',
  });

  const fetchMentors = useCallback(async () => {
    setLoading(true);
    try {
      const params: MentorSearchParams = {
        q: query || undefined,
        skills: filters.skills.length > 0 ? filters.skills.join(',') : undefined,
        minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
        maxPrice: filters.maxPrice < 500 ? filters.maxPrice : undefined,
        minRating: filters.minRating > 0 ? filters.minRating : undefined,
        page,
        limit: ITEMS_PER_PAGE,
      };

      const result = await searchMentors(params);
      setMentors(result.mentors);
      setTotal(result.total);
    } catch (error) {
      console.error('Failed to fetch mentors:', error);
      setMentors([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [query, filters, page]);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.skills.length > 0) params.set('skills', filters.skills.join(','));
    if (filters.minPrice > 0) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice < 500) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.minRating > 0) params.set('minRating', filters.minRating.toString());
    if (filters.availableOnly) params.set('available', 'true');
    if (page > 1) params.set('page', page.toString());
    setSearchParams(params, { replace: true });
  }, [query, filters, page, setSearchParams]);

  const handleSearch = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleFiltersChange = (newFilters: MentorFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Find a Mentor</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or skill..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:block">
            <MentorFilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              availableSkills={ALL_SKILLS}
            />
          </aside>

          {/* Results */}
          <main>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {loading ? (
                  'Searching...'
                ) : (
                  <>
                    {total} mentor{total !== 1 ? 's' : ''} found
                    {page > 1 && ` (page ${page} of ${totalPages})`}
                  </>
                )}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <MentorCardSkeleton key={i} />
                ))}
              </div>
            ) : mentors.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-lg font-medium">No mentors found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {mentors.map((m) => (
                    <MentorCard key={m.id} mentor={m} onBook={setBookingMentor} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        // Show first, last, current, and adjacent pages
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          Math.abs(pageNum - page) <= 1
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                page === pageNum
                                  ? 'bg-indigo-600 text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === page - 2 ||
                          pageNum === page + 2
                        ) {
                          return (
                            <span key={pageNum} className="px-2 text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {bookingMentor && (
        <BookingModal
          isOpen={!!bookingMentor}
          onClose={() => setBookingMentor(null)}
          mentor={bookingMentor as any}
        />
      )}
    </div>
  );
}
