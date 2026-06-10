import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionSecretKey } from "@/lib/session-secret";
import { SESSION_COOKIE } from "@/lib/session";

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, getSessionSecretKey());
    return true;
  } catch {
    return false;
  }
}

function withSeenIp(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const seenIp =
    request.headers.get("x-seetransfer-seen-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    (request as NextRequest & { ip?: string }).ip;

  if (seenIp) {
    requestHeaders.set("x-seetransfer-seen-ip", seenIp);
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/d/") || pathname.startsWith("/api/files/")) {
    return withSeenIp(request);
  }

  const authenticated = await isAuthenticated(request);

  if (pathname.startsWith("/dashboard") && !authenticated) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (pathname === "/auth" && authenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth", "/d/:path*", "/api/files/:path*"],
};
