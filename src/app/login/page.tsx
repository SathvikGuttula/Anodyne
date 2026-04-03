'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Role } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('patient');
  const [email, setEmail] = useState('aisha.patient@example.com');
  const [name, setName] = useState('Aisha Khan');

  async function handleContinue() {
    await fetch('/api/mock/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, email, name }),
    });
    router.push(`/role-selection?role=${role}`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full">
        <CardHeader>
          <div>
            <CardTitle>Login / signup</CardTitle>
            <CardDescription>Mock auth flow prepared for Supabase integration.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" />
            <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
            <select className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm" value={role} onChange={(event) => setRole(event.target.value as Role)}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
            <Button onClick={handleContinue}>Continue</Button>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
            <p className="font-semibold text-slate-900">Consent and disclaimer</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>AI-assisted visual risk assessment only.</li>
              <li>Not a final diagnosis.</li>
              <li>Not a substitute for emergency care.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
