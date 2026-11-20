import { createClient } from '@supabase/supabase-js'

const DEFAULT_SUPABASE_URL = 'https://znysaibhcbwteapsiaot.supabase.co'
const DEFAULT_SUPABASE_KEY = 'sb_publishable_XyvESfNM_poj4bEGDR_Qrg_cfwD2Mm4'

export const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || DEFAULT_SUPABASE_URL
export const supabaseKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  DEFAULT_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
