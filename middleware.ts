import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getTokenFromCookie } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = ["/recommendations"].some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const token = getTokenFromCookie(request.headers.get("cookie"));
    if (!token) return NextResponse.redirect(new URL("/login", request.url));

    // Verify JWT validity and expiry — jose is Edge Runtime compatible
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
