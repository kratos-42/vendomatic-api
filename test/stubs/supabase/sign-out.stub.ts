import { AuthError } from '@supabase/supabase-js';

export const createSignOutSuccessStub = () => ({
  data: null,
  error: null,
});

export const createSignOutErrorStub = (message = 'Failed to logout') => ({
  data: null,
  error: new AuthError(message, 400, 'bad_request'),
});
