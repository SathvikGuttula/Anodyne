import { NextResponse } from 'next/server';
import { getDoctorCandidates, listDoctorSearchResults } from '@/lib/server/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') ?? '';
  const doctors = query ? listDoctorSearchResults(query) : getDoctorCandidates();
  return NextResponse.json({ doctors });
}
