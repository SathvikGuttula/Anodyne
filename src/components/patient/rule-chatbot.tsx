'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { DoctorCandidate, IntakeAnswers } from '@/lib/types';

const questions = [
  'Upload a foot ulcer photo to begin.',
  'How long has the ulcer been present?',
  'Is there pain?',
  'Is there swelling?',
  'Is there discharge or pus?',
  'Is there a bad smell?',
  'Do you have fever?',
  'Is the ulcer worsening compared to before?',
  'Would you like to consult a doctor or view a self-care plan?',
];

type ChatMessage = { role: 'bot' | 'patient'; text: string };

export function RuleChatbot({ patientId, doctors }: { patientId: string; doctors: DoctorCandidate[] }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState('https://images.unsplash.com/photo-1580281657527-47f249e8f8b2?auto=format&fit=crop&w=900&q=80');
  const [answers, setAnswers] = useState<IntakeAnswers>({
    duration_days: '',
    pain: false,
    swelling: false,
    discharge: false,
    smell: false,
    fever: false,
    worsening: false,
  });
  const [wantsDoctor, setWantsDoctor] = useState<boolean | null>(null);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [notes, setNotes] = useState('Patient reports increased redness and changes in wound appearance.');
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'bot', text: 'Hello. I will guide you through a quick ulcer triage check.' }]);
  const [result, setResult] = useState<any>(null);
  const [urgent, setUrgent] = useState(false);
  const visibleDoctors = useMemo(
    () => doctors.filter((doctor) => doctor.email.toLowerCase().includes(doctorSearch.toLowerCase()) || doctor.name.toLowerCase().includes(doctorSearch.toLowerCase())),
    [doctorSearch, doctors],
  );

  async function handleSubmit() {
    const predictResponse = await fetch('/api/ml/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: photo, answers }),
    });
    const prediction = await predictResponse.json();
    setResult(prediction);
    setUrgent(Boolean(prediction.urgent_flag));

    await fetch('/api/cases/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId,
        imageUrl: photo,
        notes,
        answers,
        wantsDoctor: wantsDoctor ?? false,
        doctorId: selectedDoctor || null,
        prediction,
        message: 'I completed the triage flow and uploaded a new image.',
      }),
    });

    setMessages((current) => [...current, { role: 'bot', text: 'Prediction completed. Please choose your next step.' }]);
    router.push('/patient/results?case=case-1');
  }

  function advance(nextText: string, key?: keyof IntakeAnswers) {
    if (key) setAnswers((current) => ({ ...current, [key]: nextText === 'Yes' }));
    setMessages((current) => [...current, { role: 'patient', text: nextText }]);
    setStep((current) => current + 1);
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Rule-based ulcer triage chatbot</CardTitle>
          <CardDescription>Built-in flow, no external AI chat API.</CardDescription>
        </div>
        <Badge className={urgent ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'}>{urgent ? 'Urgent review' : 'Standard review'}</Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3 rounded-3xl bg-slate-50 p-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'patient' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm ${message.role === 'patient' ? 'bg-sky-600 text-white' : 'bg-white text-slate-700 shadow-sm'}`}>
                {message.text}
              </div>
            </div>
          ))}
          {step === 0 && (
            <div className="space-y-3 rounded-3xl border border-dashed border-slate-300 bg-white p-4">
              <Input type="file" accept="image/*" onChange={(event) => event.target.files?.[0] && setPhoto(URL.createObjectURL(event.target.files[0]))} />
              <Button onClick={() => advance('Photo uploaded')}>Continue</Button>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">Ulcer duration</p>
              <Input value={answers.duration_days} onChange={(event) => setAnswers((current) => ({ ...current, duration_days: event.target.value }))} placeholder="e.g. 12 days" />
              <Button onClick={() => advance(`Duration: ${answers.duration_days}`)}>Continue</Button>
            </div>
          )}
          {step === 2 && <div className="flex gap-2"><Button onClick={() => advance('Yes', 'pain')}>Yes</Button><Button variant="outline" onClick={() => advance('No', 'pain')}>No</Button></div>}
          {step === 3 && <div className="flex gap-2"><Button onClick={() => advance('Yes', 'swelling')}>Yes</Button><Button variant="outline" onClick={() => advance('No', 'swelling')}>No</Button></div>}
          {step === 4 && <div className="flex gap-2"><Button onClick={() => advance('Yes', 'discharge')}>Yes</Button><Button variant="outline" onClick={() => advance('No', 'discharge')}>No</Button></div>}
          {step === 5 && <div className="flex gap-2"><Button onClick={() => advance('Yes', 'smell')}>Yes</Button><Button variant="outline" onClick={() => advance('No', 'smell')}>No</Button></div>}
          {step === 6 && <div className="flex gap-2"><Button onClick={() => advance('Yes', 'fever')}>Yes</Button><Button variant="outline" onClick={() => advance('No', 'fever')}>No</Button></div>}
          {step === 7 && <div className="flex gap-2"><Button onClick={() => advance('Yes', 'worsening')}>Yes</Button><Button variant="outline" onClick={() => advance('No', 'worsening')}>No</Button></div>}
          {step === 8 && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={() => setWantsDoctor(true)}>Consult a doctor</Button>
                <Button variant="outline" onClick={() => setWantsDoctor(false)}>View self-care plan</Button>
              </div>
              {wantsDoctor === true && (
                <div className="space-y-3 rounded-3xl bg-white p-4 shadow-sm">
                  <Input placeholder="Search doctor email or name" value={doctorSearch} onChange={(event) => setDoctorSearch(event.target.value)} />
                  <div className="grid gap-2">
                    {visibleDoctors.map((doctor) => (
                      <button
                        key={doctor.id}
                        type="button"
                        onClick={() => setSelectedDoctor(doctor.id)}
                        className={`rounded-2xl border p-3 text-left text-sm ${selectedDoctor === doctor.id ? 'border-sky-500 bg-sky-50' : 'border-slate-200 bg-white'}`}
                      >
                        <div className="font-semibold">{doctor.name}</div>
                        <div className="text-slate-500">{doctor.email} • {doctor.specialty}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {wantsDoctor === false && <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} />}
              <Button onClick={handleSubmit}>Submit for prediction</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
