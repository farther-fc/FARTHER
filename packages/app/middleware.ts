import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

const rateLimitDefault = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(20, "10 s"),
});

const rateLimitGenerous = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(50, "10 s"),
});

export const config = {
  matcher: "/api/:path*",
};

export default async function middleware(request: NextRequest) {
  // Determine the source of the request

  const ip = request.ip ?? "127.0.0.1";

  if (request.url.includes("/admin")) {
    return NextResponse.next();
  }

  let success, limit, reset, remaining;

  if (request.url.includes("handleTip")) {
    // Apply rate limiting for the handleTip endpoint
    ({ success, limit, reset, remaining } = await rateLimitGenerous.limit(ip));
  } else {
    // Apply default rate limiting for other sources
    ({ success, limit, reset, remaining } = await rateLimitDefault.limit(ip));
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
