import { AuthError, AuthTokenResponsePassword } from '@supabase/supabase-js';

import { createSessionStub, SessionStubData } from './session.stub';
import { createUserStub, PartialSupabaseUser } from './user.stub';

export const createSignInSuccessStub = (data: SignInStubData = {}) => ({
  data: {
    session: createSessionStub(data.session),
    user: createUserStub(data.user),
  },
  error: null,
});

export const createSignInErrorStub = (message = 'Invalid credentials') =>
  ({
    data: { session: null, user: null },
    error: new AuthError(message, 401, 'unauthorized'),
  }) as AuthTokenResponsePassword;

export type SignInStubData = {
  session?: SessionStubData;
  user?: PartialSupabaseUser;
};
