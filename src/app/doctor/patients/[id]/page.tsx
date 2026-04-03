import { AppShell } from '@/components/layout/app-shell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RiskTrendChart } from '@/components/charts/risk-trend-chart';
import { getCaseDetail } from '@/lib/server/store';

export const dynamic = 'force-dynamic';

export default function DoctorPatientDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const detail = getCaseDetail(id);
  if (!detail) return null;

  const trend = detail.predictions.map((prediction, index) => ({ label: `Upload ${index + 1}`, score: prediction.priority_score, stage: prediction.stage }));

  return (
    <AppShell role="doctor" title="Patient detail" subtitle="Doctor portal">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>{detail.patient?.name ?? 'Patient detail'}</CardTitle>
            <CardDescription>All images, chatbot answers, messages, and monitoring history are visible here.</CardDescription>
          </div>
          <Badge className={detail.caseRecord.latest_color === 'red' ? 'bg-rose-100 text-rose-700' : detail.caseRecord.latest_color === 'yellow' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}>
            Stage {detail.caseRecord.latest_stage}
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {detail.uploads.map((upload, index) => (
              <div key={upload.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
                <div className="mb-3 flex items-center justify-between gap-3 text-sm">
                  <div className="font-semibold text-slate-900">Upload {index + 1}</div>
                  <div className="text-slate-500">{new Date(upload.captured_at).toLocaleString()}</div>
                </div>
                <img src={upload.image_url} alt={`Patient upload ${index + 1}`} className="h-56 w-full rounded-2xl object-cover" />
                <div className="mt-3 text-sm text-slate-600">{upload.notes}</div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Chatbot answers</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <div>Duration: chronic follow-up</div>
                <div>Pain: yes</div>
                <div>Swelling: yes</div>
                <div>Discharge: yes</div>
                <div>Bad smell: yes</div>
                <div>Fever: no</div>
                <div>Worsening: yes</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Messages</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">{detail.messages.map((message) => <div key={message.id} className="rounded-2xl bg-slate-50 px-3 py-2">{message.message}</div>)}</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Stage history</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">{detail.predictions.map((prediction, index) => <div key={prediction.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2"><span>Upload {index + 1}</span><span>Stage {prediction.stage}</span></div>)}</CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Risk score trend chart</CardTitle>
            <CardDescription>Risk score trend over time.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <RiskTrendChart data={trend} />
        </CardContent>
      </Card>
    </AppShell>
  );
}
