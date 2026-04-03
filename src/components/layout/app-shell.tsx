import Link from 'next/link';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = {
  patient: [
    { href: '/patient/dashboard', label: 'Dashboard' },
    { href: '/patient/chatbot', label: 'Upload flow' },
    { href: '/patient/results', label: 'Prediction result' },
    { href: '/patient/doctors', label: 'Doctor selection' },
    { href: '/patient/self-care', label: 'Self-care plan' },
    { href: '/patient/monitoring', label: 'Monitoring' },
  ],
  doctor: [
    { href: '/doctor/dashboard', label: 'Dashboard' },
    { href: '/doctor/patients/case-1', label: 'Patient detail' },
  ],
  admin: [{ href: '/admin', label: 'Admin' }],
};

export function AppShell({
  role,
  title,
  subtitle,
  children,
}: {
  role: keyof typeof navItems;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <div className="text-2xl font-bold text-sky-700">UlcerBridge</div>
            <p className="text-sm text-slate-500">Diabetic foot ulcer triage and monitoring</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-sky-100 text-sky-700">{title}</Badge>
            <Link href="/login">
              <Button variant="outline" size="sm">Switch role</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{subtitle}</p>
          <nav className="space-y-2">
            {navItems[role].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn('block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-700')}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
