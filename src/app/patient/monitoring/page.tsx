import { AppShell } from '@/components/layout/app-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BeforeAfterCompare } from '@/components/patient/before-after-compare';
import { RiskTrendChart } from '@/components/charts/risk-trend-chart';
import { getCaseById, getPredictionsForCase, getUploadsForCase } from '@/lib/server/store';

export const dynamic = 'force-dynamic';

export default function PatientMonitoringPage() {
  const caseRecord = getCaseById('case-1')!;
  const uploads = getUploadsForCase(caseRecord.id);
  const predictions = getPredictionsForCase(caseRecord.id);
  const trend = predictions.map((prediction, index) => ({ label: `Upload ${index + 1}`, score: prediction.priority_score, stage: prediction.stage }));
  const latest = uploads[uploads.length - 1];
  const previous = uploads[uploads.length - 2] ?? latest;
  const trendLabel = predictions[predictions.length - 1]?.trend_label ?? 'stable';

  return (
    <AppShell role="patient" title="Monitoring dashboard" subtitle="Patient portal">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Monitoring dashboard</h1>
          <p className="text-slate-600">Review all uploads in chronological order and compare trend changes over time.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={trendLabel === 'worsening' ? 'bg-rose-100 text-rose-700' : trendLabel === 'improving' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>{trendLabel}</Badge>
          <Button>New upload</Button>
        </div>
      </div>

      <BeforeAfterCompare before={previous.image_url} latest={latest.image_url} />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Score trend</CardTitle>
            <CardDescription>Progress chart over time.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <RiskTrendChart data={trend} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Upload timeline</CardTitle>
            <CardDescription>Chronological cards for each submitted photo.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {uploads.map((upload, index) => (
            <div key={upload.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
              <img src={upload.image_url} alt={`Upload ${index + 1}`} className="h-44 w-full rounded-2xl object-cover" />
              <div className="mt-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Upload {index + 1}</div>
                  <div className="text-sm text-slate-500">{new Date(upload.captured_at).toLocaleString()}</div>
                </div>
                <Badge className="bg-slate-100 text-slate-700">{predictions[index]?.stage ? `Stage ${predictions[index].stage}` : 'Pending'}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
