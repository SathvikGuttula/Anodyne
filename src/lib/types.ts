export type Role = 'patient' | 'doctor' | 'admin';
export type Stage = 1 | 2 | 3 | 4;
export type PriorityColor = 'green' | 'yellow' | 'red';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  created_at: string;
};

export type DoctorProfile = {
  id: string;
  user_id: string;
  specialty: string;
  hospital: string;
  availability_status: 'available' | 'busy' | 'offline';
};

export type PatientProfile = {
  id: string;
  user_id: string;
  age: number;
  diabetes_type: 'Type 1' | 'Type 2' | 'Gestational' | 'Other';
  diabetes_duration: string;
};

export type CaseStatus = 'open' | 'monitoring' | 'assigned' | 'closed';

export type CareCase = {
  id: string;
  patient_id: string;
  doctor_id: string | null;
  status: CaseStatus;
  latest_stage: Stage;
  latest_priority_score: number;
  latest_color: PriorityColor;
  created_at: string;
  updated_at: string;
};

export type UploadRecord = {
  id: string;
  case_id: string;
  image_url: string;
  captured_at: string;
  notes: string;
  model_version: string;
};

export type PredictionRecord = {
  id: string;
  upload_id: string;
  stage: Stage;
  priority_score: number;
  confidence: number;
  explanation_json: {
    explanation: string;
    urgent_flag: boolean;
    symptoms: Record<string, string | boolean | number>;
  };
  trend_label: 'improving' | 'stable' | 'worsening';
};

export type MessageRecord = {
  id: string;
  case_id: string;
  sender_id: string;
  sender_role: Role | 'system';
  message: string;
  created_at: string;
};

export type CarePlanRecord = {
  id: string;
  case_id: string;
  plan_type: 'stage-1' | 'stage-2' | 'stage-3' | 'stage-4';
  content_json: {
    reminders: string[];
    wound_care: string[];
    urgency: string;
    warning_signs: string[];
  };
  approved_by_doctor: boolean;
};

export type IntakeAnswers = {
  duration_days: string;
  pain: boolean;
  swelling: boolean;
  discharge: boolean;
  smell: boolean;
  fever: boolean;
  worsening: boolean;
  blackTissue?: boolean;
};

export type DoctorCandidate = User & DoctorProfile;

export type PatientDashboardSnapshot = {
  user: User;
  patient: PatientProfile;
  caseRecord: CareCase;
  latestPrediction: PredictionRecord | null;
  latestUpload: UploadRecord | null;
  assignedDoctor: DoctorCandidate | null;
  messages: MessageRecord[];
  uploads: UploadRecord[];
  predictions: PredictionRecord[];
  carePlan: CarePlanRecord | null;
};
