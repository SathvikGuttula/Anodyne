import Link from 'next/link';
import { AlertTriangle, ArrowRight, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const pillars = [
  { icon: ShieldCheck, title: 'Role-based triage', text: 'Separate patient, doctor, and admin experiences with protected routes.' },
  { icon: Sparkles, title: 'Risk prioritization', text: 'Highlight urgent ulcers with red/yellow/green queues and trend tracking.' },
  { icon: Stethoscope, title: 'Doctor-ready views', text: 'Review image history, chatbot answers, and score trends in one place.' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700">
              <AlertTriangle className="h-4 w-4" />
              AI-assisted visual risk assessment only
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-black leading-tight text-slate-900 sm:text-6xl">
                UlcerBridge reduces the gap between patients and doctors.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Prioritize high-risk diabetic foot ulcer cases, track symptoms over time, and help doctors treat the most urgent patients first.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/login"><Button size="lg">Get started <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              <Link href="/role-selection"><Button size="lg" variant="outline">Choose role</Button></Link>
            </div>
          </div>

          <Card className="bg-white/90">
            <CardHeader>
              <div>
                <CardTitle>Urgent care workflow</CardTitle>
                <CardDescription>Fast triage with clear handoff to the doctor queue.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {pillars.map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-900">
                    <item.icon className="h-5 w-5 text-sky-600" />
                    <div className="font-semibold">{item.title}</div>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                Emergency banner logic appears when fever, foul smell, black tissue, or severe worsening are detected.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
