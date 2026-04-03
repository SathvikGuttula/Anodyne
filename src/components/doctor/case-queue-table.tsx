'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import type { CareCase, PriorityColor } from '@/lib/types';

const colorClass: Record<PriorityColor, string> = {
  red: 'bg-rose-100 text-rose-700 border-rose-200',
  yellow: 'bg-amber-100 text-amber-700 border-amber-200',
  green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export type DoctorQueueRow = CareCase & {
  patientName: string;
  latestImage: string;
  latestUpdate: string;
  trend: 'improving' | 'stable' | 'worsening';
  doctorStatus: 'assigned' | 'unassigned';
};

export function CaseQueueTable({ rows }: { rows: DoctorQueueRow[] }) {
  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<'all' | '1' | '2' | '3' | '4'>('all');
  const [colorFilter, setColorFilter] = useState<'all' | PriorityColor>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const matchesQuery = row.patientName.toLowerCase().includes(query.toLowerCase()) || row.id.toLowerCase().includes(query.toLowerCase());
      const matchesStage = stageFilter === 'all' || String(row.latest_stage) === stageFilter;
      const matchesColor = colorFilter === 'all' || row.latest_color === colorFilter;
      const matchesStatus = statusFilter === 'all' || row.doctorStatus === statusFilter;
      return matchesQuery && matchesStage && matchesColor && matchesStatus;
    });
  }, [colorFilter, query, rows, stageFilter, statusFilter]);

  return (
    <Card className="p-0 overflow-hidden">
      <div className="grid gap-3 border-b border-slate-200 p-4 md:grid-cols-4">
        <Input placeholder="Search patient or case" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm" value={stageFilter} onChange={(event) => setStageFilter(event.target.value as typeof stageFilter)}>
          <option value="all">All stages</option>
          <option value="1">Stage 1</option>
          <option value="2">Stage 2</option>
          <option value="3">Stage 3</option>
          <option value="4">Stage 4</option>
        </select>
        <select className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm" value={colorFilter} onChange={(event) => setColorFilter(event.target.value as typeof colorFilter)}>
          <option value="all">All colors</option>
          <option value="red">Red</option>
          <option value="yellow">Yellow</option>
          <option value="green">Green</option>
        </select>
        <select className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}>
          <option value="all">All statuses</option>
          <option value="assigned">Assigned</option>
          <option value="unassigned">Unassigned</option>
        </select>
      </div>
      <Table>
        <THead>
          <TR>
            <TH>Patient</TH>
            <TH>Stage</TH>
            <TH>Priority</TH>
            <TH>Color</TH>
            <TH>Status</TH>
            <TH>Trend</TH>
            <TH>Updated</TH>
          </TR>
        </THead>
        <TBody>
          {filtered.map((row) => (
            <TR key={row.id} className={row.latest_color === 'red' ? 'bg-rose-50/70' : undefined}>
              <TD>
                <Link href={`/doctor/patients/${row.id}`} className="font-semibold text-slate-900 hover:text-sky-600">
                  {row.patientName}
                </Link>
              </TD>
              <TD><Badge className="bg-slate-100 text-slate-700">Stage {row.latest_stage}</Badge></TD>
              <TD className="font-semibold">{row.latest_priority_score}</TD>
              <TD><Badge className={colorClass[row.latest_color]}>{row.latest_color}</Badge></TD>
              <TD>{row.doctorStatus}</TD>
              <TD>{row.trend}</TD>
              <TD>{new Date(row.latestUpdate).toLocaleString()}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </Card>
  );
}
