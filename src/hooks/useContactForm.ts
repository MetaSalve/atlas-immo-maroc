
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitContactForm = async (formData: {
    name: string;
    email: string;
    message: string;
  }) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          message: formData.message
        });

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
