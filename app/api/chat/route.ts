import { NextRequest, NextResponse } from "next/server";
import { FAQS } from "@/lib/faq";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// Helper function to calculate similarity between two strings
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1;

  // Extract important keywords (filter out common words)
  const commonWords = new Set([
    "what", "are", "you", "your", "do", "the", "a", "an", "is", "if", "how", "can", "i", "should", "will", "does", "have", "has", "had", "be", "been", "being", "get", "get", "got", "provide", "provide", "offers", "offer", "to", "from", "of", "in", "on", "at", "by", "for", "with", "or", "and", "but", "not", "no", "yes", "my", "me", "him", "her", "them", "us", "we",
  ]);

  const getKeywords = (str: string) =>
    str
      .split(/\s+/)
      .map((word) => word.replace(/[?.,!]/g, ""))
      .filter((word) => word.length > 0 && !commonWords.has(word.toLowerCase()));

  const keywords1 = getKeywords(s1);
  const keywords2 = getKeywords(s2);

  if (keywords1.length === 0 || keywords2.length === 0) return 0;

  const commonKeywords = keywords1.filter((k) =>
    keywords2.some((k2) => k2.includes(k) || k.includes(k2))
  ).length;

  // Use keywords1.length (user's keywords) as denominator to measure what % of user's question matches
  return commonKeywords / keywords1.length;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    const isAllowed = checkRateLimit(ip);
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message" },
        { status: 400 }
      );
    }

    // Convert user message to lowercase and trim
    const normalizedMessage = message.toLowerCase().trim();

    // Check if message matches any FAQ question (with fuzzy matching)
    let bestMatch = null;
    let bestScore = 0;

    for (const faq of FAQS) {
      const similarity = calculateSimilarity(normalizedMessage, faq.question);
      if (similarity > bestScore) {
        bestScore = similarity;
        bestMatch = faq;
      }
    }

    // If similarity score is high enough (30% threshold), return the FAQ answer
    if (bestScore >= 0.3 && bestMatch) {
      return NextResponse.json({
        success: true,
        source: "faq",
        answer: bestMatch.answer,
        message: bestMatch.question,
      });
    }

    // No FAQ match found - return helpful message instead of calling OpenAI
    return NextResponse.json({
      success: true,
      source: "faq",
      answer:
        "Thank you for contacting SmileCraft Dental. For detailed information, please call our clinic or book an appointment through our website.",
      message: message,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
