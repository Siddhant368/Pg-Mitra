import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  // Explicitly delete the cookie on the Next.js frontend to ensure middleware catches it
  response.cookies.delete('token');
  return response;
}
