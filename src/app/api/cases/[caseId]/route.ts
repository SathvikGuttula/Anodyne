import { NextResponse } from 'next/server';
import { getCaseDetail } from '@/lib/server/store';

export async function GET(_: Request, { params }: { params: { caseId: string } }) {
  const { caseId } = params;
  const detail = getCaseDetail(caseId);
  if (!detail) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(detail);
}
