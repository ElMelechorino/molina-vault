import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://snarawcpzlgphrssxmzt.supabase.co";
const supabaseAnonKey = "sb_publishable_5cDPzDujfQ3UiOVtzoValg_x87T3zRk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
