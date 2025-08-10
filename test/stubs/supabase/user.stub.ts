import { User as SupabaseUser } from '@supabase/supabase-js';

import { Role } from '@auth/enums/role.enum';

export const createUserStub = (data: PartialSupabaseUser = {}): SupabaseUser => ({
  app_metadata: {},
  aud: 'authenticated',
  confirmed_at: '2024-01-01T00:00:00.000Z',
  created_at: '2024-01-01T00:00:00.000Z',
  email: 'test@example.com',
  email_confirmed_at: '2024-01-01T00:00:00.000Z',
  id: 'user-123',
  last_sign_in_at: '2024-01-01T00:00:00.000Z',
  phone: '',
  role: 'authenticated',
  updated_at: '2024-01-01T00:00:00.000Z',
  user_metadata: {
    name: 'Test User',
    role: Role.TECHNICIAN,
    ...data.user_metadata,
  },
  ...data,
});

export type PartialSupabaseUser = Partial<SupabaseUser> & {
  user_metadata?: {
    name?: string;
    role?: Role;
  };
};
