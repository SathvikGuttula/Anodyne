import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set('ulcerbridge-role', '', { path: '/', maxAge: 0 });
  response.cookies.set('ulcerbridge-user', '', { path: '/', maxAge: 0 });
  return response;
}
