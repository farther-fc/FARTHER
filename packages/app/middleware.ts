import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

const rateLimitDefault = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(20, "10 s"),
});

const rateLimitRestricted = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, "10 s"),
});

export const config = {
  matcher: "/api/:path*",
};

export default async function middleware(request: NextRequest) {
  // Determine the source of the request
  const referer = request.headers.get("referer");
  const ip = request.ip ?? "127.0.0.1";

  let success, limit, reset, remaining;

  if (
    (referer &&
      (referer.includes("farther.social") ||
        referer.includes("localhost:3000"))) ||
    request.url.includes("handleTip")
  ) {
    // Apply website-specific rate limiting
    ({ success, limit, reset, remaining } = await rateLimitDefault.limit(ip));
  } else {
    // Apply default rate limiting for other sources
    ({ success, limit, reset, remaining } =
      await rateLimitRestricted.limit(ip));
  }

  return success
    ? NextResponse.next()
    : NextResponse.json(
        {
          error: "Rate limit exceeded",
          limit,
          reset,
          remaining,
        },
        { status: 429 },
      );
}
