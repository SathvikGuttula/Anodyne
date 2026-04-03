import { AppShell } from '@/components/layout/app-shell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCarePlanForCase, getCaseById, getPredictionForUpload, getLatestUploadForCase } from '@/lib/server/store';

export const dynamic = 'force-dynamic';

export default function SelfCarePage() {
  const caseRecord = getCaseById('case-1')!;
  const latestUpload = getLatestUploadForCase(caseRecord.id)!;
  const latestPrediction = getPredictionForUpload(latestUpload.id)!;
  const carePlan = getCarePlanForCase(caseRecord.id);
  const fallback = {
    reminders: ['Upload a new photo daily', 'Reduce pressure on the foot', 'Monitor for changes in color or smell'],
    woundCare: ['Keep the wound clean and dry', 'Use clean dressings', 'Avoid soaking'],
    urgency: 'Seek urgent care if fever, pus, foul smell, black tissue, or severe worsening appears.',
    warningSigns: ['Fever', 'Discharge', 'Foul smell', 'Black tissue', 'Fast worsening'],
  };

  const content = carePlan?.content_json ?? { reminders: fallback.reminders, wound_care: fallback.woundCare, urgency: fallback.urgency, warning_signs: fallback.warningSigns };

  return (
    <AppShell role="patient" title="Self-care plan" subtitle="Patient portal">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Personalized self-care plan</CardTitle>
            <CardDescription>Stage-based guidance with reminders, wound care steps, urgency, and warning signs.</CardDescription>
          </div>
          <Badge className={latestPrediction.trend_label === 'worsening' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}>{latestPrediction.trend_label}</Badge>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 font-semibold text-slate-900">Reminders</div>
            <ul className="space-y-2 text-sm text-slate-600">{content.reminders.map((item: string) => <li key={item}>• {item}</li>)}</ul>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 font-semibold text-slate-900">Wound care steps</div>
            <ul className="space-y-2 text-sm text-slate-600">{content.wound_care.map((item: string) => <li key={item}>• {item}</li>)}</ul>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 font-semibold text-slate-900">Warning signs</div>
            <div className="text-sm text-slate-600">{content.urgency}</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">{content.warning_signs.map((item: string) => <li key={item}>• {item}</li>)}</ul>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
