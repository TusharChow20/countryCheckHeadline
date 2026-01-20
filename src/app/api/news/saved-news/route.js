import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET all saved news with filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const country = searchParams.get("country");
    const language = searchParams.get("language");
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");
    const limit = parseInt(searchParams.get("limit")) || 50;

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("news-app");
    const newsCollection = db.collection("news");

    const query = {};

    if (category && category !== "all") query.category = category;
    if (country) query.country = country;
    if (language) query.language = language;

    if (fromDate || toDate) {
      query.publishedAt = {};
      if (fromDate) query.publishedAt.$gte = new Date(fromDate);
      if (toDate) query.publishedAt.$lte = new Date(toDate);
    }

    const articles = await newsCollection
      .find(query)
      .sort({ publishedAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      articles,
      totalResults: articles.length,
    });
  } catch (error) {
    console.error("Error fetching saved news:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
