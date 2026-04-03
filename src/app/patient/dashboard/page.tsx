import Link from 'next/link';
import { AlertTriangle, MessageSquare, TrendingUp, UserRound } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { BeforeAfterCompare } from '@/components/patient/before-after-compare';
import { RiskTrendChart } from '@/components/charts/risk-trend-chart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAssignedDoctor, getCarePlanForCase, getCaseByPatientId, getMessagesForCase, getPredictionsForCase, getUploadsForCase, getUsers } from '@/lib/server/store';

export const dynamic = 'force-dynamic';

export default function PatientDashboardPage() {
  const patient = getUsers().find((user) => user.id === 'u-p1')!;
  const caseRecord = getCaseByPatientId(patient.id)!;
  const uploads = getUploadsForCase(caseRecord.id);
  const predictions = getPredictionsForCase(caseRecord.id);
  const latestPrediction = predictions[predictions.length - 1];
  const doctor = getAssignedDoctor(caseRecord.doctor_id);
  const messages = getMessagesForCase(caseRecord.id);
  const plan = getCarePlanForCase(caseRecord.id);
  const trendData = predictions.map((prediction, index) => ({ label: `#${index + 1}`, score: prediction.priority_score, stage: prediction.stage }));

  return (
    <AppShell role="patient" title="Patient dashboard" subtitle="Patient portal">
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-5"><div className="text-sm text-slate-500">Latest stage</div><div className="mt-1 text-3xl font-black">Stage {latestPrediction?.stage ?? caseRecord.latest_stage}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-sm text-slate-500">Priority score</div><div className="mt-1 text-3xl font-black">{latestPrediction?.priority_score ?? caseRecord.latest_priority_score}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-sm text-slate-500">Assigned doctor</div><div className="mt-1 text-xl font-semibold">{doctor?.name ?? 'None yet'}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-sm text-slate-500">Messages</div><div className="mt-1 text-3xl font-black">{messages.length}</div></CardContent></Card>
      </div>

      {(latestPrediction?.explanation_json.urgent_flag ?? false) && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-900">
          <div className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-5 w-5" /> Urgent care banner</div>
          Fever, foul smell, black tissue, or severe worsening indicates urgent medical review.
        </div>
      )}

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Latest result</CardTitle>
            <CardDescription>Mock prediction and explanation from the ML endpoint.</CardDescription>
          </div>
          <Badge className={caseRecord.latest_color === 'red' ? 'bg-rose-100 text-rose-700' : caseRecord.latest_color === 'yellow' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}>
            {caseRecord.latest_color} priority
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">{latestPrediction?.explanation_json.explanation ?? 'Awaiting prediction'}</div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/patient/chatbot"><Button className="w-full">New upload</Button></Link>
              <Link href="/patient/doctors"><Button className="w-full" variant="outline">Consult a doctor</Button></Link>
              <Link href="/patient/self-care"><Button className="w-full" variant="outline">View self-care plan</Button></Link>
              <Link href="/patient/monitoring"><Button className="w-full" variant="outline">Monitoring</Button></Link>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold text-slate-900">Assigned doctor</div>
              <div className="mt-1 text-slate-600">{doctor?.name ?? 'No doctor assigned yet'}</div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold text-slate-900">Full message history</div>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                {messages.map((message) => <div key={message.id} className="rounded-2xl bg-slate-50 px-3 py-2">{message.message}</div>)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {uploads.length > 1 && <BeforeAfterCompare before={uploads[uploads.length - 2].image_url} latest={uploads[uploads.length - 1].image_url} />}

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Progress over time</CardTitle>
            <CardDescription>Risk score trend from uploaded cases.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <RiskTrendChart data={trendData} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-base">Latest image</CardTitle></CardHeader><CardContent><img src={uploads[uploads.length - 1]?.image_url} className="h-56 w-full rounded-3xl object-cover" alt="Latest ulcer" /></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Monitoring timeline</CardTitle></CardHeader><CardContent className="space-y-3">{uploads.map((upload) => <div key={upload.id} className="rounded-2xl border border-slate-200 p-3 text-sm"><div className="font-semibold">{new Date(upload.captured_at).toLocaleString()}</div><div className="text-slate-500">{upload.notes}</div></div>)}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader><CardContent className="space-y-2 text-sm text-slate-600"><p>New triage result has been posted.</p><p>Your assigned doctor reviewed the latest image.</p><p>Emergency banner appears if symptoms worsen.</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Consent</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600"><p>AI-assisted visual risk assessment only.</p><p>Not a final diagnosis.</p><p>Not a substitute for emergency care.</p></CardContent>
      </Card>
    </AppShell>
  );
}
