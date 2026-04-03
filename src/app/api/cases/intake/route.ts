import { NextResponse } from 'next/server';
import { submitIntake } from '@/lib/server/store';

export async function POST(request: Request) {
  const body = await request.json();
  const result = submitIntake({
    patientId: body.patientId,
    imageUrl: body.imageUrl,
    notes: body.notes ?? '',
    answers: body.answers,
    wantsDoctor: Boolean(body.wantsDoctor),
    doctorId: body.doctorId ?? null,
    message: body.message,
  });

  return NextResponse.json({
    ok: true,
    case: result.caseRecord,
    upload: result.upload,
    prediction: body.prediction ?? result.prediction,
    urgent: result.urgent,
  });
}
