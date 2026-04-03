import { randomUUID } from 'crypto';
import {
  carePlans as seedCarePlans,
  cases as seedCases,
  doctorCandidates,
  messages as seedMessages,
  predictions as seedPredictions,
  uploads as seedUploads,
  users,
} from '@/lib/mock-data';
import type {
  CareCase,
  CarePlanRecord,
  IntakeAnswers,
  MessageRecord,
  PredictionRecord,
  UploadRecord,
} from '@/lib/types';

const state = {
  cases: [...seedCases],
  uploads: [...seedUploads],
  predictions: [...seedPredictions],
  messages: [...seedMessages],
  carePlans: [...seedCarePlans],
};

function now() {
  return new Date().toISOString();
}

function parseDuration(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function mapColor(score: number) {
  if (score > 75) return 'red' as const;
  if (score >= 41) return 'yellow' as const;
  return 'green' as const;
}

function nextStage(score: number) {
  if (score > 75) return 4 as const;
  if (score >= 56) return 3 as const;
  if (score >= 31) return 2 as const;
  return 1 as const;
}

function trendFromAnswers(answers: IntakeAnswers, score: number): 'improving' | 'stable' | 'worsening' {
  if (answers.fever || answers.discharge || answers.smell || answers.worsening || score > 75) return 'worsening';
  if (score < 41) return 'improving';
  return 'stable';
}

export function getUsers() {
  return users;
}

export function getDoctorCandidates() {
  return doctorCandidates;
}

export function getCases() {
  return state.cases;
}

export function getUploads() {
  return state.uploads;
}

export function getPredictions() {
  return state.predictions;
}

export function getMessages() {
  return state.messages;
}

export function getCarePlans() {
  return state.carePlans;
}

export function getCaseById(caseId: string) {
  return state.cases.find((item) => item.id === caseId) ?? null;
}

export function getCaseByPatientId(patientId: string) {
  return state.cases.find((item) => item.patient_id === patientId) ?? null;
}

export function getLatestUploadForCase(caseId: string) {
  const uploads = state.uploads.filter((item) => item.case_id === caseId).sort((a, b) => new Date(b.captured_at).getTime() - new Date(a.captured_at).getTime());
  return uploads[0] ?? null;
}

export function getPredictionForUpload(uploadId: string) {
  return state.predictions.find((item) => item.upload_id === uploadId) ?? null;
}

export function getPredictionsForCase(caseId: string) {
  const uploads = state.uploads.filter((item) => item.case_id === caseId).map((item) => item.id);
  return state.predictions.filter((item) => uploads.includes(item.upload_id));
}

export function getUploadsForCase(caseId: string) {
  return state.uploads
    .filter((item) => item.case_id === caseId)
    .sort((a, b) => new Date(a.captured_at).getTime() - new Date(b.captured_at).getTime());
}

export function getMessagesForCase(caseId: string) {
  return state.messages.filter((item) => item.case_id === caseId).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function addMessage(caseId: string, message: MessageRecord) {
  state.messages.push({ ...message, case_id: caseId });
}

export function assignDoctorToCase(caseId: string, doctorId: string) {
  const caseRecord = getCaseById(caseId);
  if (!caseRecord) return null;
  caseRecord.doctor_id = doctorId;
  caseRecord.status = 'assigned';
  caseRecord.updated_at = now();
  return caseRecord;
}

export function getCarePlanForCase(caseId: string) {
  return state.carePlans.find((item) => item.case_id === caseId) ?? null;
}

export function getAssignedDoctor(doctorId: string | null) {
  if (!doctorId) return null;
  return doctorCandidates.find((doctor) => doctor.id === doctorId) ?? null;
}

export function listDoctorSearchResults(query: string) {
  const normalized = query.trim().toLowerCase();
  return doctorCandidates.filter((doctor) => doctor.email.toLowerCase().includes(normalized) || doctor.name.toLowerCase().includes(normalized));
}

export function getPatientSnapshot(patientId: string) {
  const user = users.find((entry) => entry.id === patientId) ?? null;
  const caseRecord = getCaseByPatientId(patientId);
  if (!user || !caseRecord) return null;
  const latestUpload = getLatestUploadForCase(caseRecord.id);
  const latestPrediction = latestUpload ? getPredictionForUpload(latestUpload.id) : null;
  return {
    user,
    caseRecord,
    patient: null,
    latestUpload,
    latestPrediction,
  };
}

export function submitIntake(input: {
  patientId: string;
  imageUrl: string;
  notes: string;
  answers: IntakeAnswers;
  wantsDoctor: boolean;
  doctorId?: string | null;
  message?: string;
}) {
  let caseRecord = getCaseByPatientId(input.patientId);
  if (!caseRecord) {
    caseRecord = {
      id: randomUUID(),
      patient_id: input.patientId,
      doctor_id: null,
      status: 'monitoring',
      latest_stage: 1,
      latest_priority_score: 0,
      latest_color: 'green',
      created_at: now(),
      updated_at: now(),
    };
    state.cases.push(caseRecord);
  }

  const priority =
    (input.answers.fever ? 18 : 0) +
    (input.answers.discharge ? 16 : 0) +
    (input.answers.smell ? 15 : 0) +
    (input.answers.swelling ? 10 : 0) +
    (input.answers.pain ? 8 : 0) +
    (input.answers.worsening ? 18 : 0) +
    (parseDuration(input.answers.duration_days || '0') > 14 ? 5 : 0) +
    (input.answers.blackTissue ? 20 : 0) +
    20;

  const normalizedPriority = Math.min(100, Math.max(0, priority));
  const stage = nextStage(normalizedPriority);
  const urgent = Boolean(input.answers.fever || input.answers.smell || input.answers.discharge || input.answers.blackTissue || input.answers.worsening || normalizedPriority > 75);
  const trend_label = trendFromAnswers(input.answers, normalizedPriority);
  const uploadId = randomUUID();
  const predictionId = randomUUID();
  const upload: UploadRecord = {
    id: uploadId,
    case_id: caseRecord.id,
    image_url: input.imageUrl,
    captured_at: now(),
    notes: input.notes,
    model_version: 'v1.0-mock',
  };
  const prediction: PredictionRecord = {
    id: predictionId,
    upload_id: uploadId,
    stage,
    priority_score: normalizedPriority,
    confidence: Math.min(0.98, 0.74 + normalizedPriority / 500),
    explanation_json: {
      explanation: urgent
        ? 'High-risk visual ulcer pattern with infection concern.'
        : 'Moderate-risk pattern that warrants close monitoring.',
      urgent_flag: urgent,
      symptoms: input.answers as unknown as Record<string, string | boolean | number>,
    },
    trend_label,
  };

  state.uploads.push(upload);
  state.predictions.push(prediction);

  caseRecord.latest_stage = stage;
  caseRecord.latest_priority_score = normalizedPriority;
  caseRecord.latest_color = mapColor(normalizedPriority);
  caseRecord.status = input.wantsDoctor ? 'assigned' : 'monitoring';
  caseRecord.doctor_id = input.wantsDoctor ? (input.doctorId ?? caseRecord.doctor_id) : caseRecord.doctor_id;
  caseRecord.updated_at = now();

  if (input.message) {
    const msg: MessageRecord = {
      id: randomUUID(),
      case_id: caseRecord.id,
      sender_id: input.patientId,
      sender_role: 'patient',
      message: input.message,
      created_at: now(),
    };
    state.messages.push(msg);
  }

  if (!input.wantsDoctor) {
    const plan: CarePlanRecord = {
      id: randomUUID(),
      case_id: caseRecord.id,
      plan_type: `stage-${stage}` as CarePlanRecord['plan_type'],
      content_json: {
        reminders: ['Check the wound every day', 'Keep pressure off the foot', 'Upload a fresh photo if anything changes'],
        wound_care: ['Clean gently with recommended wound care practices', 'Use clean dressings', 'Avoid walking barefoot'],
        urgency: urgent ? 'Urgent care review is recommended if symptoms worsen.' : 'Continue home monitoring with rapid escalation if warning signs appear.',
        warning_signs: ['Fever', 'Pus or discharge', 'Foul smell', 'Black tissue', 'Rapidly spreading redness'],
      },
      approved_by_doctor: false,
    };
    state.carePlans = state.carePlans.filter((item) => item.case_id !== caseRecord.id).concat(plan);
  }

  return { caseRecord, upload, prediction, urgent };
}

export function getDoctorQueue() {
  return state.cases
    .map((item) => {
      const patient = users.find((user) => user.id === item.patient_id);
      const latestUpload = getLatestUploadForCase(item.id);
      const latestPrediction = latestUpload ? getPredictionForUpload(latestUpload.id) : null;
      return {
        ...item,
        patientName: patient?.name ?? 'Unknown patient',
        latestImage: latestUpload?.image_url ?? '',
        latestUpdate: item.updated_at,
        trend: latestPrediction?.trend_label ?? 'stable',
        doctorStatus: item.doctor_id ? ('assigned' as const) : ('unassigned' as const),
      };
    })
    .sort((a, b) => b.latest_priority_score - a.latest_priority_score);
}

export function getCaseDetail(caseId: string) {
  const caseRecord = getCaseById(caseId);
  if (!caseRecord) return null;
  const patient = users.find((user) => user.id === caseRecord.patient_id) ?? null;
  const doctor = getAssignedDoctor(caseRecord.doctor_id);
  const uploads = getUploadsForCase(caseId);
  const predictions = getPredictionsForCase(caseId);
  const messages = getMessagesForCase(caseId);
  const carePlan = getCarePlanForCase(caseId);
  return { caseRecord, patient, doctor, uploads, predictions, messages, carePlan };
}
