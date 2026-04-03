import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const response = NextResponse.json({ ok: true, role: body.role });
  response.cookies.set('ulcerbridge-role', body.role, { path: '/', sameSite: 'lax' });
  response.cookies.set('ulcerbridge-user', JSON.stringify({ email: body.email, name: body.name }), { path: '/', sameSite: 'lax' });
  return response;
}
