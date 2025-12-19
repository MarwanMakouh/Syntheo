// Note Value Mapper - converts between Dutch (frontend) and English (backend)

// Category mapping
const categoryToBackend: Record<string, string> = {
  'Gezondheid': 'health',
  'Gedrag': 'behavior',
  'Vallen': 'general',
  'Medicatie': 'medication',
  'Familie': 'social',
  'Voeding': 'general',
  'Algemeen': 'general',
};

const categoryFromBackend: Record<string, string> = {
  'general': 'Algemeen',
  'health': 'Gezondheid',
  'behavior': 'Gedrag',
  'medication': 'Medicatie',
  'social': 'Familie',
};

// Urgency mapping
const urgencyToBackend: Record<string, string> = {
  'Laag': 'low',
  'Matig': 'medium',
  'Hoog': 'high',
};

const urgencyFromBackend: Record<string, string> = {
  'low': 'Laag',
  'medium': 'Matig',
  'high': 'Hoog',
};

/**
 * Map Dutch category to English for backend
 */
export const mapCategoryToBackend = (category: string): string => {
  return categoryToBackend[category] || 'general';
};

/**
 * Map English category to Dutch for frontend
 */
export const mapCategoryFromBackend = (category: string): string => {
  return categoryFromBackend[category] || category;
};

/**
 * Map Dutch urgency to English for backend
 */
export const mapUrgencyToBackend = (urgency: string): string => {
  return urgencyToBackend[urgency] || 'low';
};

/**
 * Map English urgency to Dutch for frontend
 */
export const mapUrgencyFromBackend = (urgency: string): string => {
  return urgencyFromBackend[urgency] || urgency;
};
