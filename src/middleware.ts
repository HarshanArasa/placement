import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/internships", "/placements", "/saved", "/notifications", "/profile", "/onboarding"];
const adminRoutes = ["/admin"];
const authRoutes = ["/login", "/signup", "/forgot-password"];

export default auth(function middleware(req) {
  const { nextUrl, auth: session } = req as any;
  const isLoggedIn = !!session;
  const isAdmin = session?.user?.role === "ADMIN";

  const isProtectedRoute = protectedRoutes.some((route) => nextUrl.pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => nextUrl.pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => nextUrl.pathname.startsWith(route));

  if (isAdminRoute && (!isLoggedIn || !isAdmin)) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isProtectedRoute && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl));
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
