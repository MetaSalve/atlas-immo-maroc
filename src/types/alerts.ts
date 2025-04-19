
import { SearchFiltersValues } from '@/components/search/SearchFilters';

export interface UserAlert {
  id: string;
  name: string;
  filters: SearchFiltersValues;
  is_active: boolean;
  created_at: string;
  last_notification_at: string | null;
  last_notification_count: number | null;
  user_id: string;
}
