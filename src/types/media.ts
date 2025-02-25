
import type { Database } from "@/integrations/supabase/types";

export type MediaFile = Database['public']['Tables']['media_files']['Row'];
