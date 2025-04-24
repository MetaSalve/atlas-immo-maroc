
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitContactForm = async (formData: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert(formData);

      if (error) throw error;

      toast.success('Message envoyé avec succès !');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message :', error);
      toast.error('Erreur lors de l\'envoi du message');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitContactForm, isSubmitting };
};
