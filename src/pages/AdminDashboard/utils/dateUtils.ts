
/**
 * Formate une date ISO en date/heure locale
 */
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return 'Date invalide';
  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch (error) {
    return 'Date invalide';
  }
};

/**
 * Formate une date ISO en heure uniquement (pour les axes de graphiques)
 */
export const formatHour = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getHours()}:00`;
};
