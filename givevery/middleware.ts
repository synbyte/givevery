import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Skip middleware for RSC requests and static assets
  if (request.url.includes('_rsc') || 
      request.url.includes('_next/static') ||
      request.url.includes('_next/image')) {
    return NextResponse.next();
  }

  // Get the response from updateSession
  const response = await updateSession(request);
  
  // Add the pathname header to the existing response
  response.headers.set('x-url-pathname', request.nextUrl.pathname);
  
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};