import { AuthError } from '@supabase/supabase-js';

import { createSessionStub, SessionStubData } from './session.stub';
import { createUserStub, PartialSupabaseUser } from './user.stub';

export const createRefreshTokenSuccessStub = (data: RefreshStubData = {}) => ({
  data: {
    session: createSessionStub(data.session),
    user: createUserStub(data.user),
  },
  error: null,
});

export const createRefreshTokenErrorStub = (message = 'Invalid refresh token') => ({
  data: { session: null, user: null },
  error: new AuthError(message, 401, 'unauthorized'),
});

export type RefreshStubData = {
  session?: SessionStubData;
  user?: PartialSupabaseUser;
};
