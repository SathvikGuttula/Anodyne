'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { DoctorCandidate } from '@/lib/types';

export function DoctorSelectionPanel({ caseId, doctors }: { caseId: string; doctors: DoctorCandidate[] }) {
  const [query, setQuery] = useState('');
  const [assignedId, setAssignedId] = useState<string | null>(null);
  const visibleDoctors = useMemo(() => doctors.filter((doctor) => doctor.name.toLowerCase().includes(query.toLowerCase()) || doctor.email.toLowerCase().includes(query.toLowerCase())), [doctors, query]);

  async function assignDoctor(doctorId: string) {
    await fetch(`/api/cases/${caseId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId }),
    });
    setAssignedId(doctorId);
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-5">
        <Input placeholder="Search by doctor email or Gmail" value={query} onChange={(event) => setQuery(event.target.value)} />
        <div className="grid gap-4 md:grid-cols-2">
          {visibleDoctors.map((doctor) => (
            <div key={doctor.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">{doctor.name}</div>
                  <div className="text-sm text-slate-500">{doctor.email}</div>
                </div>
                <Badge className={doctor.availability_status === 'available' ? 'bg-emerald-100 text-emerald-700' : doctor.availability_status === 'busy' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}>
                  {doctor.availability_status}
                </Badge>
              </div>
              <div className="mt-3 text-sm text-slate-600">{doctor.specialty} • {doctor.hospital}</div>
              <Button className="mt-4 w-full" variant={assignedId === doctor.id ? 'secondary' : 'default'} onClick={() => assignDoctor(doctor.id)}>
                {assignedId === doctor.id ? 'Doctor assigned' : 'Assign doctor'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
