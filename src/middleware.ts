import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "./lib/session";

// Protected routes that require authentication
const protectedRoutes = ["/profile"];

export async function middleware(request: NextRequest) {
  // Check for authentication cookie

  const session = await getServerSession();

  // Check if the requested path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  // For API routes, handle CORS
  if (request.nextUrl.pathname.startsWith("/api")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-proxy-origin", request.url);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );

    return response;
  }

  // For protected routes, check authentication
  if (isProtectedRoute) {
    if (!session.isLoggedIn) {
      // Store the current URL as redirectTo parameter
      const redirectTo = encodeURIComponent(request.nextUrl.pathname);
      return NextResponse.redirect(
        new URL(`/login?redirectTo=${redirectTo}`, request.url),
      );
    }
  }

  return NextResponse.next();
}

// Configure the middleware to run for both API routes and protected pages
export const config = {
  matcher: ["/api/:path*", "/profile/:path*"],
};
