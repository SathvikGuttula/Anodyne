import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { addMessage, getMessagesForCase } from '@/lib/server/store';

export async function GET(_: Request, { params }: { params: { caseId: string } }) {
  const { caseId } = params;
  return NextResponse.json({ messages: getMessagesForCase(caseId) });
}

export async function POST(request: Request, { params }: { params: { caseId: string } }) {
  const { caseId } = params;
  const body = await request.json();
  const message = { id: randomUUID(), case_id: caseId, sender_id: body.senderId, sender_role: body.senderRole, message: body.message, created_at: new Date().toISOString() };
  addMessage(caseId, message);
  return NextResponse.json({ ok: true, message });
}
