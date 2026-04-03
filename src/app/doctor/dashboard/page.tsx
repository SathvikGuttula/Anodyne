import { AppShell } from '@/components/layout/app-shell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CaseQueueTable } from '@/components/doctor/case-queue-table';
import { getDoctorQueue } from '@/lib/server/store';

export const dynamic = 'force-dynamic';

export default function DoctorDashboardPage() {
  const queue = getDoctorQueue();

  return (
    <AppShell role="doctor" title="Doctor dashboard" subtitle="Doctor portal">
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-5"><div className="text-sm text-slate-500">Total cases</div><div className="mt-1 text-3xl font-black">{queue.length}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-sm text-slate-500">Red cases</div><div className="mt-1 text-3xl font-black">{queue.filter((item) => item.latest_color === 'red').length}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-sm text-slate-500">Yellow cases</div><div className="mt-1 text-3xl font-black">{queue.filter((item) => item.latest_color === 'yellow').length}</div></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="text-sm text-slate-500">Green cases</div><div className="mt-1 text-3xl font-black">{queue.filter((item) => item.latest_color === 'green').length}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Prioritized patient queue</CardTitle>
            <CardDescription>Sorted by highest priority score first, with red/yellow/green tags.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <CaseQueueTable rows={queue} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Sample alerts for urgent triage follow-up.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          <div className="rounded-2xl bg-rose-50 px-4 py-3 text-rose-900">Red case moved to the top of the queue.</div>
          <div className="rounded-2xl bg-amber-50 px-4 py-3 text-amber-900">One patient requested doctor assignment by email search.</div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
