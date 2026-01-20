"use client";

import React, { useState, useEffect } from "react";
import CountrySelector from "@/components/CountrySelector";
import NewsList from "@/components/NewsList";
import { fetchNewsByCountry } from "@/lib/api";
import { Newspaper, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState("us");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  const getNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchNewsByCountry(selectedCountry);
      if (data.success) {
        setArticles(data.articles || []);
        setTotalResults(data.totalResults || 0);
      } else {
        setError(data.error || "Failed to fetch news");
      }
    } catch (err) {
      setError(
        "Failed to fetch news. Please check your connection and try again.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNews();
  }, [selectedCountry]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Newspaper className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Global News Hub
                </h1>
                <p className="text-sm text-gray-500">
                  {totalResults > 0 && `${totalResults} top headlines`}
                </p>
              </div>
            </div>

            {/* Country Selector and Refresh */}
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
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 shadow">
            <div className="flex items-center gap-2">
              <span className="font-bold">Error:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* News List */}
        <NewsList articles={articles} loading={loading} />
      </main>
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Left */}
            <div className="text-center sm:text-left space-y-1">
              <p className="text-gray-600 text-sm">
                Powered by <span className="font-semibold">NewsAPI</span>
              </p>
              <p className="text-gray-400 text-xs">
                Built with Next.js, React & Shadcn UI
              </p>
            </div>

            {/* Right - Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/your-github-username"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                GitHub
              </a>

              <span className="text-gray-300">•</span>

              <a
                href="https://www.linkedin.com/in/your-linkedin-username"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
