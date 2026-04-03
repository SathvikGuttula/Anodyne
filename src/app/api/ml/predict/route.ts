import { NextResponse } from 'next/server';
import type { IntakeAnswers } from '@/lib/types';

function scoreFromAnswers(answers: IntakeAnswers) {
  const duration = Number.parseInt(answers.duration_days || '0', 10);
  return Math.min(
    100,
    20 + (answers.pain ? 8 : 0) + (answers.swelling ? 10 : 0) + (answers.discharge ? 16 : 0) + (answers.smell ? 15 : 0) + (answers.fever ? 18 : 0) + (answers.worsening ? 18 : 0) + (answers.blackTissue ? 20 : 0) + (duration > 14 ? 5 : 0),
  );
}

function stageFromScore(score: number) {
  if (score > 75) return 4;
  if (score >= 56) return 3;
  if (score >= 31) return 2;
  return 1;
}

export async function POST(request: Request) {
  const body = (await request.json()) as { image?: string; answers: IntakeAnswers };
  const priority_score = scoreFromAnswers(body.answers);
  const stage = stageFromScore(priority_score);
  const urgent_flag = Boolean(body.answers.fever || body.answers.discharge || body.answers.smell || body.answers.blackTissue || body.answers.worsening || priority_score > 75);
  return NextResponse.json({
    stage,
    priority_score,
    confidence: Math.min(0.98, 0.74 + priority_score / 500),
    explanation: urgent_flag ? 'High-risk visual ulcer pattern with infection concern' : 'Moderate-risk pattern requiring close monitoring',
    trend_label: urgent_flag ? 'worsening' : priority_score < 41 ? 'improving' : 'stable',
    urgent_flag,
  });
}
