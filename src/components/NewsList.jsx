import React from "react";
import NewsCard from "./NewsCard";
import { Skeleton } from "@/components/ui/skeleton";

const NewsList = ({ articles, loading }) => {
  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  // No articles found
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📰</div>
        <p className="text-gray-500 text-lg">
          No articles found for this country.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Try selecting a different country.
        </p>
      </div>
    );
  }

  // Display articles
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <NewsCard key={index} article={article} />
      ))}
    </div>
  );
};

export default NewsList;
