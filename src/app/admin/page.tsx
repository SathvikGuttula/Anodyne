import { AppShell } from '@/components/layout/app-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getCarePlans, getDoctorCandidates } from '@/lib/server/store';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const doctorCandidates = getDoctorCandidates();
  const carePlans = getCarePlans();

  return (
    <AppShell role="admin" title="Admin" subtitle="Administration">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Manage doctors</CardTitle>
              <CardDescription>Sample doctor accounts and availability status.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {doctorCandidates.map((doctor) => (
              <div key={doctor.id} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                <div>
                  <div className="font-semibold text-slate-900">{doctor.name}</div>
                  <div className="text-slate-500">{doctor.email}</div>
                </div>
                <Badge className={doctor.availability_status === 'available' ? 'bg-emerald-100 text-emerald-700' : doctor.availability_status === 'busy' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}>
                  {doctor.availability_status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Care plan templates</CardTitle>
              <CardDescription>Edit template content for stage-based self-care plans.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Plan title" />
            <Textarea placeholder="Template content JSON or structured guidance" />
            <Button>Save template</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Stored care plans</CardTitle>
            <CardDescription>Mock record list from the database schema.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {carePlans.map((plan) => (
            <div key={plan.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
              <div className="font-semibold text-slate-900">{plan.plan_type}</div>
              <div className="mt-2 text-sm text-slate-600">Approved by doctor: {plan.approved_by_doctor ? 'Yes' : 'No'}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
