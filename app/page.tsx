'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ThesisCard from '@/components/ThesisCard';
import SearchFilters from '@/components/SearchFilters';
import ThesisModal from '@/components/ThesisModal';
import { Thesis } from '@/lib/types';

function HomePageContent() {
  const searchParams = useSearchParams();
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [filteredTheses, setFilteredTheses] = useState<Thesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<{
    fields: string[];
    universities: string[];
    years: number[];
  }>({
    fields: [],
    universities: [],
    years: []
  });

  // Modal State
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (thesis: Thesis) => {
    setSelectedThesis(thesis);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchTheses();
  }, []);

  const fetchTheses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/theses');
      const data: Thesis[] = await response.json();
      setTheses(data);

      const fields = [...new Set(data.flatMap(t => t.fields || []))].sort();
      const universities = [...new Set(data.flatMap(t => t.universities || []))].sort();
      const years = [...new Set(data.map(t => t.year))].sort((a, b) => b - a);

      setFilterOptions({ fields, universities, years });
    } catch (error) {
      console.error('Error fetching theses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const search = searchParams.get('search')?.toLowerCase() || '';
    const field = searchParams.get('field');
    const university = searchParams.get('university');
    const year = searchParams.get('year');

    let filtered = [...theses];

    if (search) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(search) ||
        (t.abstract && t.abstract.toLowerCase().includes(search))
      );
    }

    if (field) {
      filtered = filtered.filter(t => t.fields && t.fields.includes(field));
    }

    if (university) {
      filtered = filtered.filter(t => t.universities && t.universities.includes(university));
    }

    if (year) {
      filtered = filtered.filter(t => t.year === parseInt(year));
    }

    setFilteredTheses(filtered);
  }, [theses, searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <SearchFilters
          availableFields={filterOptions.fields}
          availableUniversities={filterOptions.universities}
          availableYears={filterOptions.years.map(String)}
        />
      </div>

      {loading && (
        <div className="text-center py-24">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Accessing Vault...</p>
        </div>
      )}

      {!loading && filteredTheses.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
          <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="h-12 w-12 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">No Research Found</h3>
          <p className="text-gray-500 max-w-sm mx-auto font-medium">We couldn't find any theses matching your current filters. Try refining your search.</p>
        </div>
      )}

      {!loading && filteredTheses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 sm:gap-12">
          {filteredTheses.map((thesis) => (
            <ThesisCard
              key={thesis.id}
              thesis={thesis}
              onSelect={openModal}
            />
          ))}
        </div>
      )}

      <ThesisModal
        thesis={selectedThesis}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-black uppercase tracking-widest text-xs text-gray-400">Syncing...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
