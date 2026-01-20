'use client';

import React, { useState, useEffect } from 'react';
import CountrySelector from '@/components/CountrySelector';
import NewsList from '@/components/NewsList';
import FilterPanel from '@/components/FilterPanel';
import { fetchNewsByCountry } from '@/lib/api';
import { Newspaper, RefreshCw, Database, CloudDownload, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState('us');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [freshArticlesSaved, setFreshArticlesSaved] = useState(0);
  const [dataSource, setDataSource] = useState('');
  
  // Filter state
  const [filters, setFilters] = useState({
    category: 'all',
    language: 'en',
    from: '',
    to: '',
    source: '',
  });

  // Fetch news when country or filters change
  const getNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchNewsByCountry(selectedCountry, filters);
      if (data.success) {
        setArticles(data.articles || []);
        setTotalResults(data.totalResults || 0);
        setFreshArticlesSaved(data.freshArticlesSaved || 0);
        setDataSource(data.source || 'api');
      } else {
        setError(data.error || 'Failed to fetch news');
      }
    } catch (err) {
      setError('Failed to fetch news. Please check your connection and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNews();
  }, [selectedCountry, filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      category: 'all',
      language: 'en',
      from: '',
      to: '',
      source: '',
    });
  };

  // Count active filters
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'category') return value !== 'all';
    if (key === 'language') return value !== 'en';
    return value !== '';
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Newspaper className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Global News Hub
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-500">
                    {totalResults > 0 && `${totalResults} articles found`}
                  </p>
                  {freshArticlesSaved > 0 && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Database className="w-3 h-3" />
                      {freshArticlesSaved} saved to DB
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CountrySelector
                selectedCountry={selectedCountry}
                onCountryChange={setSelectedCountry}
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={getNews}
                disabled={loading}
                title="Refresh news"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {/* Data Source Indicator */}
            <Badge variant="outline" className="flex items-center gap-1">
              {dataSource === 'database' ? (
                <>
                  <Database className="w-3 h-3 text-green-600" />
                  <span>Data from Database</span>
                </>
              ) : (
                <>
                  <CloudDownload className="w-3 h-3 text-blue-600" />
                  <span>Data from API</span>
                </>
              )}
            </Badge>

            {/* Active Filters Indicator */}
            {activeFiltersCount > 0 && (
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
              </Badge>
            )}

            {/* Current Filters Display */}
            {filters.category !== 'all' && (
              <Badge variant="secondary">
                Category: {filters.category}
              </Badge>
            )}
            {filters.language !== 'en' && (
              <Badge variant="secondary">
                Language: {filters.language}
              </Badge>
            )}
            {filters.from && (
              <Badge variant="secondary">
                From: {filters.from}
              </Badge>
            )}
            {filters.to && (
              <Badge variant="secondary">
                To: {filters.to}
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Success Message */}
        {freshArticlesSaved > 0 && !loading && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-6 shadow flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <div>
              <span className="font-bold">Success!</span>
              <span className="ml-2">
                {freshArticlesSaved} new article{freshArticlesSaved > 1 ? 's' : ''} saved to database
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 shadow">
            <div className="flex items-center gap-2">
              <span className="font-bold">Error:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* News List */}
        <NewsList articles={articles} loading={loading} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center space-y-2">
            <p className="text-gray-600 text-sm">
              Powered by <span className="font-semibold">NewsAPI</span> • Stored in MongoDB Atlas
            </p>
            <p className="text-gray-400 text-xs">
              Built with Next.js, React & Shadcn UI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}