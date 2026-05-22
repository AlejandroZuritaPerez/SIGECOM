import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/report") ||
    pathname.startsWith("/admin");

  const isPublicAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && isPublicAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (token?.role !== "ADMIN" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/report/:path*", "/admin/:path*", "/login", "/register"],
};