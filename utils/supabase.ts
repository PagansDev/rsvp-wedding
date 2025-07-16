import { createClient } from '@supabase/supabase-js';

export const createSupabaseClient = () => {
  const config = useRuntimeConfig();

  const supabaseUrl = config.public.supabaseUrl;
  const supabaseAnonKey = config.public.supabaseAnonKey;

  return createClient(supabaseUrl, supabaseAnonKey);
};

export const getSupabase = () => createSupabaseClient();
