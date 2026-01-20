import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request, { params }) {
  try {
    const { country } = await params;
    const { searchParams } = new URL(request.url);

    // Extract filter parameters
    const category = searchParams.get("category");
    const language = searchParams.get("language") || "en";
    const source = searchParams.get("source");
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");

    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "API key is not configured" },
        { status: 500 },
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("news-app");
    const newsCollection = db.collection("news");

    // Build NewsAPI URL with filters
    let url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${apiKey}`;

    if (category && category !== "all") url += `&category=${category}`;
    if (language) url += `&language=${language}`;
    if (source) url += `&sources=${source}`;
    if (fromDate) url += `&from=${fromDate}`;
    if (toDate) url += `&to=${toDate}`;

    console.log("Fetching from NewsAPI:", url);

    // Fetch from NewsAPI
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

    // Store articles in MongoDB - COUNT ONLY NEW ONES
    let freshArticlesSaved = 0;

    for (const article of data.articles || []) {
      try {
        // Check if article already exists
        const existingArticle = await newsCollection.findOne({
          url: article.url,
        });

        if (!existingArticle) {
          const newsDoc = {
            title: article.title,
            description: article.description,
            content: article.content,
            url: article.url,
            urlToImage: article.urlToImage,
            publishedAt: new Date(article.publishedAt),
            source: article.source,
            author: article.author,
            category: category || "general",
            country: country,
            language: language,
            fetchedAt: new Date(),
          };

          await newsCollection.insertOne(newsDoc);
          freshArticlesSaved++; // Only increment for NEW articles
          console.log(`✅ Saved new article: ${article.title}`);
        } else {
          console.log(`⏭️  Article already exists: ${article.title}`);
        }
      } catch (saveError) {
        console.error("Error saving article:", saveError);
        // Continue with next article
      }
    }

    console.log(`📊 Total new articles saved: ${freshArticlesSaved}`);

    // Build MongoDB query for filtering saved articles
    const dbQuery = { country };

    if (category && category !== "all") dbQuery.category = category;
    if (language) dbQuery.language = language;
    if (source) dbQuery["source.id"] = source;

    if (fromDate || toDate) {
      dbQuery.publishedAt = {};
      if (fromDate) dbQuery.publishedAt.$gte = new Date(fromDate);
      if (toDate) dbQuery.publishedAt.$lte = new Date(toDate);
    }

    // Get filtered articles from database
    const dbArticles = await newsCollection
      .find(dbQuery)
      .sort({ publishedAt: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json({
      success: true,
      articles: dbArticles,
      totalResults: dbArticles.length,
      source: "database",
      freshArticlesSaved: freshArticlesSaved, // Now only shows truly NEW articles
    });
  } catch (error) {
    console.error("Error in news API route:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch news", message: error.message },
      { status: 500 },
    );
  }
}
