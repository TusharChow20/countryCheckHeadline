import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

// Fetch news by country with filters
export const fetchNewsByCountry = async (countryCode, filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.category && filters.category !== "all") {
      params.append("category", filters.category);
    }
    if (filters.language) {
      params.append("language", filters.language);
    }
    if (filters.source) {
      params.append("source", filters.source);
    }
    if (filters.from) {
      params.append("from", filters.from);
    }
    if (filters.to) {
      params.append("to", filters.to);
    }

    const queryString = params.toString();
    const url = `/news/${countryCode}${queryString ? `?${queryString}` : ""}`;

    console.log("🔍 Fetching with URL:", url);
    console.log("🔍 Filters being sent:", filters);

    const response = await api.get(url);

    console.log("✅ Response received:", {
      totalResults: response.data.totalResults,
      articlesCount: response.data.articles?.length,
      source: response.data.source,
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error fetching news:", error);
    throw error;
  }
};

// Fetch saved news from database
export const fetchSavedNews = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/news-app?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching saved news:", error);
    throw error;
  }
};

export default api;
