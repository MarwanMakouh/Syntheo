// Medication-related constants

export const DAGDEEL_OPTIONS = [
  { label: 'Ochtend', value: 'Ochtend' as const },
  { label: 'Middag', value: 'Middag' as const },
  { label: 'Avond', value: 'Avond' as const },
  { label: 'Nacht', value: 'Nacht' as const },
];

export const DAY_OF_WEEK_OPTIONS = [
  { label: 'Dagelijks', value: 'daily' as const },
  { label: 'Maandag', value: 'monday' as const },
  { label: 'Dinsdag', value: 'tuesday' as const },
  { label: 'Woensdag', value: 'wednesday' as const },
  { label: 'Donderdag', value: 'thursday' as const },
  { label: 'Vrijdag', value: 'friday' as const },
  { label: 'Zaterdag', value: 'saturday' as const },
  { label: 'Zondag', value: 'sunday' as const },
];

export const MEDICATION_CATEGORIES = [
  'Cardiovasculair',
  'Diabetes',
  'Cholesterol',
  'Pijnstiller',
  'Dementie',
  'Antidepressiva',
  'Maag-Darm',
  'Luchtwegen',
  'Urologie',
  'Vitaminen & Supplementen',
];
