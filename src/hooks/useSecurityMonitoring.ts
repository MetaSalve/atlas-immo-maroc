import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SecurityEvent {
  id: string;
  event_type: string;
  risk_level: string;
  created_at: string;
  event_details: any;
  user_id?: string;
}

export const useSecurityMonitoring = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const logSecurityEvent = async (
    eventType: string,
    details: any,
    riskLevel: 'low' | 'medium' | 'high' = 'low'
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('security_events').insert({
        event_type: eventType,
        event_details: details,
        risk_level: riskLevel,
        user_id: user?.id,
        ip_address: await fetch('https://api.ipify.org?format=json')
          .then(r => r.json())
          .then(data => data.ip)
          .catch(() => null),
        user_agent: navigator.userAgent
      });

      if (riskLevel === 'high') {
        toast.error(`Événement de sécurité détecté: ${eventType}`, {
          description: 'Incident signalé aux administrateurs'
        });
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  const fetchSecurityEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Failed to fetch security events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityEvents();
  }, []);

  return {
    events,
    loading,
    logSecurityEvent,
    fetchSecurityEvents
  };
};