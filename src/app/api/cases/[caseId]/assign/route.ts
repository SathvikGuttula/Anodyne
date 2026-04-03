import { NextResponse } from 'next/server';
import { assignDoctorToCase } from '@/lib/server/store';

export async function POST(request: Request, { params }: { params: { caseId: string } }) {
  const { caseId } = params;
  const body = await request.json();
  const caseRecord = assignDoctorToCase(caseId, body.doctorId);
  if (!caseRecord) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true, case: caseRecord });
}
