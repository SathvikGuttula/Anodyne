import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DoctorSelectionPanel } from '@/components/patient/doctor-selection-panel';
import { getDoctorCandidates } from '@/lib/server/store';

export const dynamic = 'force-dynamic';

export default function DoctorSelectionPage() {
  const doctors = getDoctorCandidates();

  return (
    <AppShell role="patient" title="Doctor selection" subtitle="Patient portal">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Available doctors</CardTitle>
            <CardDescription>Search by doctor email or Gmail and assign the selected doctor to the case.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <DoctorSelectionPanel caseId="case-1" doctors={doctors} />
        </CardContent>
      </Card>
    </AppShell>
  );
}
