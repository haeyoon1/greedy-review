import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("🔧 ENV CHECK", { SUPABASE_URL, hasKey: !!SUPABASE_ANON_KEY });

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Supabase env 값이 없습니다.");
}

export const supabase = createClient(
  SUPABASE_URL as string,
  SUPABASE_ANON_KEY as string
);
