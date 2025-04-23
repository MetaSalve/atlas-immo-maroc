
import { Json } from '@/integrations/supabase/types';
import { SimpleSearchFiltersValues } from '@/components/search/SimpleSearchFilters';

export interface UserAlert {
  id: string;
  name: string;
  filters: SimpleSearchFiltersValues;
  is_active: boolean;
  created_at: string;
  last_notification_at: string | null;
  last_notification_count: number | null;
  user_id: string;
}

// Type for creating a new alert with the database
export interface UserAlertInsert {
  name: string;
  filters: Json;
  is_active: boolean;
  user_id: string;
}
