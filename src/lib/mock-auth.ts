import type { Role } from '@/lib/types';

export const roleLabels: Record<Role, string> = {
  patient: 'Patient',
  doctor: 'Doctor',
  admin: 'Admin',
};

export const protectedPrefixes = {
  patient: '/patient',
  doctor: '/doctor',
  admin: '/admin',
};
