import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAssignedDoctor, getCarePlanForCase, getCaseById, getLatestUploadForCase, getPredictionForUpload } from '@/lib/server/store';

export const dynamic = 'force-dynamic';

export default function PredictionResultsPage() {
  const caseRecord = getCaseById('case-1')!;
  const latestUpload = getLatestUploadForCase(caseRecord.id)!;
  const latestPrediction = getPredictionForUpload(latestUpload.id)!;
  const doctor = getAssignedDoctor(caseRecord.doctor_id);
  const carePlan = getCarePlanForCase(caseRecord.id);

  return (
    <AppShell role="patient" title="Prediction result" subtitle="Patient portal">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Prediction result</CardTitle>
            <CardDescription>Latest risk analysis from the placeholder ML endpoint.</CardDescription>
          </div>
          <Badge className={caseRecord.latest_color === 'red' ? 'bg-rose-100 text-rose-700' : caseRecord.latest_color === 'yellow' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}>
            Stage {latestPrediction.stage}
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <img src={latestUpload.image_url} alt="Latest uploaded foot ulcer" className="h-80 w-full rounded-3xl object-cover" />
          <div className="space-y-4">
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">{latestPrediction.explanation_json.explanation}</div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 p-3"><div className="text-xs text-slate-500">Priority score</div><div className="text-2xl font-black">{latestPrediction.priority_score}</div></div>
              <div className="rounded-2xl border border-slate-200 p-3"><div className="text-xs text-slate-500">Confidence</div><div className="text-2xl font-black">{Math.round(latestPrediction.confidence * 100)}%</div></div>
              <div className="rounded-2xl border border-slate-200 p-3"><div className="text-xs text-slate-500">Trend</div><div className="text-2xl font-black capitalize">{latestPrediction.trend_label}</div></div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
              Assigned doctor: {doctor?.name ?? 'None'}
            </div>
            {carePlan && <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">A personalized self-care plan is available below.</div>}
            <div className="flex flex-wrap gap-3">
              <Link href="/patient/doctors"><Button>Consult a doctor</Button></Link>
              <Link href="/patient/self-care"><Button variant="outline">View personalized self-care plan</Button></Link>
              <Link href="/patient/monitoring"><Button variant="outline">Monitoring dashboard</Button></Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
