// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth-storage");
  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

  if (!authCookie && isDashboardPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (authCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
