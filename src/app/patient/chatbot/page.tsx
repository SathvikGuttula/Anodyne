import { RuleChatbot } from '@/components/patient/rule-chatbot';
import { AppShell } from '@/components/layout/app-shell';
import { getDoctorCandidates } from '@/lib/server/store';

export const dynamic = 'force-dynamic';

export default function PatientChatbotPage() {
  return (
    <AppShell role="patient" title="Patient upload flow" subtitle="Patient portal">
      <RuleChatbot patientId="u-p1" doctors={getDoctorCandidates()} />
    </AppShell>
  );
}
