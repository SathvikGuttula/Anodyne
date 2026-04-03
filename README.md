# UlcerBridge

UlcerBridge is a Next.js 14 full-stack medical triage demo for diabetic foot ulcer monitoring.

## Implemented flow
- Landing page
- Login / signup page
- Role selection page
- Patient dashboard
- Patient chatbot upload page
- Prediction results page
- Doctor selection page
- Self-care plan page
- Patient monitoring page
- Doctor dashboard
- Doctor patient detail page
- Admin page

## Stack
- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui-style reusable components
- Supabase Auth, Postgres, and Storage placeholders
- Recharts for trend charts
- FastAPI-style ML inference integration stub

## Mock backend
- POST /api/ml/predict returns stage, priority score, confidence, explanation, and trend label
- POST /api/cases/intake persists the mock case submission
- POST /api/cases/[caseId]/assign assigns a doctor
- POST /api/mock/session stores the mock role cookie

## Notes
- Red queue if priority score is greater than 75
- Yellow queue if priority score is 41 to 75
- Green queue if priority score is 0 to 40
- Self-care plans never auto-prescribe medication
- Emergency warning banners appear for urgent symptom combinations

## Run locally
1. Install dependencies:
	- npm install
2. Start the development server:
	- npm run dev
3. Open http://localhost:3000

## Build for production
- npm run build
- npm start

## Mock sign-in roles
- Patient
- Doctor
- Admin

## Sample routes
- /login
- /role-selection
- /patient/dashboard
- /doctor/dashboard
- /admin