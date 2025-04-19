
import { Json } from '@/integrations/supabase/types';

export interface PropertySource {
  id: string;
  name: string;
  url: string;
  type: 'website' | 'social';
  active: boolean;
  scrape_frequency_hours: number;
  last_scraped_at: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  logo?: string | null;
}

export interface ScrapingLog {
  id: string;
  source_id: string;
  status: 'processing' | 'completed' | 'error';
  properties_found: number;
  properties_added: number;
  properties_updated?: number;
  started_at: string;
  completed_at: string | null;
  error_message: string | null;
}

export interface PropertySourceInsert {
  name: string;
  url: string;
  type: 'website' | 'social';
  scrape_frequency_hours?: number;
  active?: boolean;
}
