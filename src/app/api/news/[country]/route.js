import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    // Await params to get the country value
    const { country } = await params;
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "API key is not configured" },
        { status: 500 },
      );
    }

    console.log(`Fetching news for country: ${country}`);

    // Fetch top headlines
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("News API error:", errorData);
      return NextResponse.json(
        { success: false, error: errorData.message || "Failed to fetch news" },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Use a simple category detection based on source name
    const getCategoryFromSource = (sourceName) => {
      const name = sourceName?.toLowerCase() || "";

      if (
        name.includes("sport") ||
        name.includes("espn") ||
        name.includes("nfl") ||
        name.includes("nba")
      )
        return "sports";
      if (
        name.includes("tech") ||
        name.includes("wired") ||
        name.includes("verge")
      )
        return "technology";
      if (
        name.includes("business") ||
        name.includes("bloomberg") ||
        name.includes("financial")
      )
        return "business";
      if (name.includes("health") || name.includes("medical")) return "health";
      if (name.includes("science")) return "science";
      if (name.includes("entertainment") || name.includes("hollywood"))
        return "entertainment";

      return "general";
    };

    // Enhance articles with estimated category
    const enhancedArticles =
      data.articles?.map((article) => ({
        ...article,
        category: getCategoryFromSource(article.source?.name),
      })) || [];

    return NextResponse.json({
      success: true,
      articles: enhancedArticles,
      totalResults: data.totalResults || 0,
    });
  } catch (error) {
    console.error("Error in news API route:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch news", message: error.message },
      { status: 500 },
    );
  }
}
