import { NextRequest, NextResponse } from "next/server";

const APP_HOSTS = new Set([
  "autopilotai.dev",
  "www.autopilotai.dev",
  "localhost:3000",
]);

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") || "";

  // If it's your main app domain, do nothing
  if (APP_HOSTS.has(host)) return NextResponse.next();

  // If it's already /r/... do nothing (prevents loops)
  if (url.pathname.startsWith("/r/")) return NextResponse.next();

  // Ignore next internals/static/assets
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/favicon") ||
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico|css|js|map|txt)$/)
  ) {
    return NextResponse.next();
  }

  try {
    // Backend must resolve custom domain -> username
    const res = await fetch(
      `https://autopilotai-api.onrender.com/api/domains/resolve?host=${encodeURIComponent(host)}`,
      { cache: "no-store" }
    );

    if (!res.ok) return NextResponse.next();

    const json = await res.json();
    const username = String(json?.username || "").trim();
    if (!username) return NextResponse.next();

    // Rewrite root-domain request -> /r/[username]
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = `/r/${username}${url.pathname === "/" ? "" : url.pathname}`;

    return NextResponse.rewrite(rewriteUrl);
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/:path*"],
};
