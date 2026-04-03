import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const roles = [
  { href: '/patient/dashboard', title: 'Patient', text: 'Upload photos, answer symptom questions, review self-care plans, and track progress.' },
  { href: '/doctor/dashboard', title: 'Doctor', text: 'Review prioritized cases, patient timelines, and trend charts.' },
  { href: '/admin', title: 'Admin', text: 'Manage doctors and care plan templates.' },
];

export default function RoleSelectionPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <h1 className="text-4xl font-black text-slate-900">Choose your role</h1>
        <p className="text-slate-600">Select the view that matches your workflow.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.title}>
            <CardHeader>
              <div>
                <CardTitle>{role.title}</CardTitle>
                <CardDescription>{role.text}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Link href={role.href}><Button className="w-full">Open {role.title} view</Button></Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
