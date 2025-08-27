import React, { useState } from 'react';
import { useContactForm } from '@/hooks/useContactForm';
import { ZelligeBackground } from './HeroBackground';
import { useTranslation } from '@/i18n';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export const ContactSection = () => {
  const { t } = useTranslation();
  const { submitContactForm, isSubmitting } = useContactForm();
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitContactForm(contactForm);
    if (success) {
      setContactForm({ name: '', email: '', message: '' });
    }
  };

  return (
    <section className="rounded-xl bg-cream/60 p-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 z-0"><ZelligeBackground /></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2 font-playfair text-navy">{t('contact.title')}</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          {t('contact.description')}
        </p>
        <form 
          onSubmit={handleContactFormSubmit} 
          className="max-w-lg mx-auto space-y-4 text-left"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-navy mb-1">{t('contact.name')}</label>
            <input
              type="text"
              id="name"
              value={contactForm.name}
              onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-md border border-input bg-white px-3 py-2"
              placeholder={t('contact.namePlaceholder')}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-navy mb-1">{t('contact.email')}</label>
            <input
              type="email"
              id="email"
              value={contactForm.email}
              onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-md border border-input bg-white px-3 py-2"
              placeholder={t('contact.emailPlaceholder')}
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-navy mb-1">{t('contact.message')}</label>
            <textarea
              id="message"
              rows={4}
              value={contactForm.message}
              onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
              className="w-full rounded-md border border-input bg-white px-3 py-2"
              placeholder={t('contact.messagePlaceholder')}
              required
            />
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-skyblue text-white px-6 py-2 rounded-md hover:bg-royalblue transition-colors font-bold disabled:opacity-50"
          >
            {isSubmitting ? t('contact.sending') : t('contact.send')}
          </button>
        </form>
      </div>
    </section>
  );
};
