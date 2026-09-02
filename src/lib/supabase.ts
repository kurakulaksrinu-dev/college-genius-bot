// Central Supabase access point for the app.
// The typed client itself is auto-generated in src/integrations/supabase/client.ts
export { supabase } from "@/integrations/supabase/client";

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
export const SUPABASE_ANON_KEY = import.meta.env
  .VITE_SUPABASE_PUBLISHABLE_KEY as string;

export const functionUrl = (name: string) =>
  `${SUPABASE_URL}/functions/v1/${name}`;
