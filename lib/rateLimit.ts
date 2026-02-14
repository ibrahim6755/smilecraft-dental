// Simple in-memory rate limiter for demonstration
// For production, use Redis or a dedicated service

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // 10 requests per minute

/**
 * Check if a request exceeds rate limit
 * @param identifier - Unique identifier (IP, user ID, etc)
 * @returns true if request is allowed, false if rate limited
 */
export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    // New time window
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (entry.count < MAX_REQUESTS) {
    entry.count++;
    return true;
  }

  return false;
}

/**
 * Extract IP address from request
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

/**
 * Clean up old entries periodically (prevents memory leak)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  const entriesToDelete: string[] = [];

  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetTime) {
      entriesToDelete.push(key);
    }
  });

  entriesToDelete.forEach((key) => rateLimitStore.delete(key));
}

// Clean up every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
