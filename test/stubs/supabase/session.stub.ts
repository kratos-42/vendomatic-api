import { Session } from '@supabase/supabase-js';

import { createUserStub, PartialSupabaseUser } from './user.stub';

export const createSessionStub = (data: SessionStubData = {}): Session => ({
  access_token: data.access_token ?? 'mock-access-token',
  expires_in: data.expires_in ?? 3600,
  refresh_token: data.refresh_token ?? 'mock-refresh-token',
  token_type: data.token_type ?? 'bearer',
  user: createUserStub(data.user),
});

export type SessionStubData = {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  token_type?: string;
  user?: PartialSupabaseUser;
};
