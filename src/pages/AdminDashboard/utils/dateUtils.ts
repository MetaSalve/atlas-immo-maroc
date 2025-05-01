
/**
 * Formate une date ISO en date/heure locale
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

/**
 * Formate une date ISO en heure uniquement (pour les axes de graphiques)
 */
export const formatHour = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getHours()}:00`;
};
