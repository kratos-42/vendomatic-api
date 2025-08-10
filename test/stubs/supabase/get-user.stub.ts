import { AuthError } from '@supabase/supabase-js';

import { createUserStub, PartialSupabaseUser } from './user.stub';

export const createGetUserSuccessStub = (data: PartialSupabaseUser = {}) => ({
  data: { user: createUserStub(data) },
  error: null,
});

export const createGetUserErrorStub = (message = 'Invalid token') => ({
  data: { user: null },
  error: new AuthError(message, 401, 'unauthorized'),
});
