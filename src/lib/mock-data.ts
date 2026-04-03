import type {
  CareCase,
  CarePlanRecord,
  DoctorCandidate,
  MessageRecord,
  PatientProfile,
  PredictionRecord,
  UploadRecord,
  User,
} from '@/lib/types';

export const users: User[] = [
  { id: 'u-p1', name: 'Aisha Khan', email: 'aisha.patient@example.com', role: 'patient', created_at: '2026-03-26T08:00:00.000Z' },
  { id: 'u-p2', name: 'Mateo Cruz', email: 'mateo.patient@example.com', role: 'patient', created_at: '2026-03-28T09:00:00.000Z' },
  { id: 'u-d1', name: 'Dr. Priya Rao', email: 'priya.rao@hospital.org', role: 'doctor', created_at: '2026-03-20T08:00:00.000Z' },
  { id: 'u-d2', name: 'Dr. Omar Chen', email: 'omar.chen@clinic.org', role: 'doctor', created_at: '2026-03-19T08:00:00.000Z' },
  { id: 'u-d3', name: 'Dr. Elena Novak', email: 'elena.novak@gmail.com', role: 'doctor', created_at: '2026-03-21T08:00:00.000Z' },
  { id: 'u-a1', name: 'Admin User', email: 'admin@ulcerbridge.org', role: 'admin', created_at: '2026-03-18T08:00:00.000Z' },
];

export const doctorProfiles: Record<string, { specialty: string; hospital: string; availability_status: 'available' | 'busy' | 'offline' }> = {
  'u-d1': { specialty: 'Diabetic Foot Care', hospital: 'City Medical Center', availability_status: 'available' },
  'u-d2': { specialty: 'Wound Care', hospital: 'Northside Hospital', availability_status: 'busy' },
  'u-d3': { specialty: 'Endocrinology', hospital: 'Eastlake Clinic', availability_status: 'available' },
};

export const patientProfiles: PatientProfile[] = [
  { id: 'p-1', user_id: 'u-p1', age: 58, diabetes_type: 'Type 2', diabetes_duration: '12 years' },
  { id: 'p-2', user_id: 'u-p2', age: 46, diabetes_type: 'Type 2', diabetes_duration: '8 years' },
];

export const doctorCandidates: DoctorCandidate[] = users
  .filter((user) => user.role === 'doctor')
  .map((user) => ({
    ...user,
    user_id: user.id,
    ...doctorProfiles[user.id],
  }));

export const cases: CareCase[] = [
  {
    id: 'case-1',
    patient_id: 'u-p1',
    doctor_id: 'u-d1',
    status: 'assigned',
    latest_stage: 3,
    latest_priority_score: 78,
    latest_color: 'red',
    created_at: '2026-03-30T10:00:00.000Z',
    updated_at: '2026-04-03T08:18:00.000Z',
  },
  {
    id: 'case-2',
    patient_id: 'u-p2',
    doctor_id: null,
    status: 'monitoring',
    latest_stage: 2,
    latest_priority_score: 54,
    latest_color: 'yellow',
    created_at: '2026-03-29T14:00:00.000Z',
    updated_at: '2026-04-02T16:30:00.000Z',
  },
];

export const uploads: UploadRecord[] = [
  { id: 'up-1', case_id: 'case-1', image_url: 'https://images.unsplash.com/photo-1580281657527-47f249e8f8b2?auto=format&fit=crop&w=900&q=80', captured_at: '2026-03-31T10:15:00.000Z', notes: 'Photo captured at home', model_version: 'v1.0' },
  { id: 'up-2', case_id: 'case-1', image_url: 'https://images.unsplash.com/photo-1511174511562-5f97f9f6f5e0?auto=format&fit=crop&w=900&q=80', captured_at: '2026-04-03T08:15:00.000Z', notes: 'Ulcer appears darker with drainage concern', model_version: 'v1.0' },
  { id: 'up-3', case_id: 'case-2', image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80', captured_at: '2026-04-02T15:45:00.000Z', notes: 'Monitoring follow-up photo', model_version: 'v1.0' },
];

export const predictions: PredictionRecord[] = [
  {
    id: 'pred-1',
    upload_id: 'up-1',
    stage: 2,
    priority_score: 48,
    confidence: 0.83,
    explanation_json: {
      explanation: 'Moderate-risk pattern with localized tissue breakdown.',
      urgent_flag: false,
      symptoms: { pain: true, swelling: false, discharge: false, smell: false, fever: false, worsening: false },
    },
    trend_label: 'stable',
  },
  {
    id: 'pred-2',
    upload_id: 'up-2',
    stage: 3,
    priority_score: 78,
    confidence: 0.89,
    explanation_json: {
      explanation: 'High-risk visual ulcer pattern with infection concern.',
      urgent_flag: true,
      symptoms: { pain: true, swelling: true, discharge: true, smell: true, fever: false, worsening: true },
    },
    trend_label: 'worsening',
  },
  {
    id: 'pred-3',
    upload_id: 'up-3',
    stage: 2,
    priority_score: 54,
    confidence: 0.81,
    explanation_json: {
      explanation: 'Moderate-risk ulcer with pressure-related worsening suspected.',
      urgent_flag: false,
      symptoms: { pain: false, swelling: true, discharge: false, smell: false, fever: false, worsening: true },
    },
    trend_label: 'worsening',
  },
];

export const messages: MessageRecord[] = [
  { id: 'msg-1', case_id: 'case-1', sender_id: 'u-p1', sender_role: 'patient', message: 'The wound looks more inflamed this week.', created_at: '2026-04-03T08:16:00.000Z' },
  { id: 'msg-2', case_id: 'case-1', sender_id: 'u-d1', sender_role: 'doctor', message: 'Please keep the area clean and upload a new photo tomorrow.', created_at: '2026-04-03T08:20:00.000Z' },
  { id: 'msg-3', case_id: 'case-2', sender_id: 'u-p2', sender_role: 'patient', message: 'I am seeing more redness around the ulcer.', created_at: '2026-04-02T16:00:00.000Z' },
];

export const carePlans: CarePlanRecord[] = [
  {
    id: 'plan-1',
    case_id: 'case-2',
    plan_type: 'stage-2',
    content_json: {
      reminders: ['Inspect the foot once daily', 'Log any temperature changes', 'Keep pressure off the wound'],
      wound_care: ['Wash hands before touching the area', 'Use clean dressings', 'Do not soak the foot'],
      urgency: 'Seek urgent review if fever, pus, foul smell, or rapid worsening appears.',
      warning_signs: ['Fever', 'Foul smell', 'Black tissue', 'Increasing pain', 'Spreading redness'],
    },
    approved_by_doctor: false,
  },
];
