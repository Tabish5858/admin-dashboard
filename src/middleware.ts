import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthPage = request.nextUrl.pathname === "/login";
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

  // For client-side auth, rely on the client middleware check
  if (typeof window !== "undefined") {
    const authData = localStorage.getItem("auth-storage");
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        if (state.isAuthenticated && isAuthPage) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        if (!state.isAuthenticated && isDashboardPage) {
          return NextResponse.redirect(new URL("/login", request.url));
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
