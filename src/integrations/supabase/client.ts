// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://webuhgqxofgcckphmixz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlYnVoZ3F4b2ZnY2NrcGhtaXh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMjI5NjMsImV4cCI6MjA2MDc5ODk2M30.w_PGshzqFi2yF3KGRfP6AigqMQfhlQ1xiT1Iau8L4WE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);