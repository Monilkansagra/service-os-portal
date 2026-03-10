import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

// Routes that don't require authentication
// Added `/api/debug` to allow development-only debug endpoints (e.g., /api/debug/jwt-test)
const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/debug"];

// Role → allowed path prefixes
const ROLE_PATHS: Record<string, string[]> = {
  Admin: ["/admin-dashboard", "/dept-master", "/dept-person", "/department-person-master", "/request-type", "/service-type", "/status-master", "/type-mapping"],
  HOD: ["/hod-dashboard"],
  Employee: ["/portal-dashboard", "/request-details", "/technician"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const isApiRoute = pathname.startsWith("/api/");

  // 2. Handle public API routes without Auth
  if (isApiRoute && PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // 3. Allow Next.js internals and static files
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // 4. Verify JWT token from cookie
  const token = req.cookies.get("token")?.value;

  if (!token) {
    if (isApiRoute) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    // No token → redirect to login
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyToken(token);

  if (!payload) {
    if (isApiRoute) {
      const response = NextResponse.json({ success: false, message: "Unauthorized: Invalid/Expired Token" }, { status: 401 });
      response.cookies.set("token", "", { maxAge: 0, path: "/" });
      return response;
    }
    // Invalid / expired token → redirect to login
    const loginUrl = new URL("/login", req.url);
    const response = NextResponse.redirect(loginUrl);
    // Clear the invalid token cookie
    response.cookies.set("token", "", { maxAge: 0, path: "/" });
    return response;
  }

  // 5. Role-based access control
  // Normalize / fallback: if role is unknown, treat as "Employee" so portal users
  // with custom role names don't get stuck in redirect loops.
  const userRole = payload.role;
  const normalizedRole = ROLE_PATHS[userRole] ? userRole : "Employee";
  const allowedPaths = ROLE_PATHS[normalizedRole] || [];
  const hasAccess = allowedPaths.some((p) => pathname.startsWith(p));

  if (!hasAccess && !isApiRoute) {
    // Redirect to correct dashboard based on role
    let dashboardPath = "/portal-dashboard";
    if (userRole === "Admin") dashboardPath = "/admin-dashboard";
    else if (userRole === "HOD") dashboardPath = "/hod-dashboard";
    return NextResponse.redirect(new URL(dashboardPath, req.url));
  }

  // 6. All good – attach user info in headers for server components
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", payload.user_id.toString());
  requestHeaders.set("x-user-role", payload.role);
  requestHeaders.set("x-user-name", payload.full_name);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

// Run proxy on all pages except static files
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};