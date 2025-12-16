// Dummy Data API voor Syntheo - Zorgapplicatie
// Gebaseerd op ERD

// FLOORS
export const floors = [
  { floor_id: 1 },
  { floor_id: 2 },
  { floor_id: 3 },
];

// USERS - Verzorgenden/Verpleegkundigen
export const users = [
  {
    user_id: 1,
    email: 'jan.janssen@syntheo.nl',
    password: 'hashed_password_1',
    name: 'Jan Janssen',
    role: 'Verpleger',
    floor_id: 1,
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z',
  },
  {
    user_id: 2,
    email: 'marie.peeters@syntheo.nl',
    password: 'hashed_password_2',
    name: 'Marie Peeters',
    role: 'Verpleegkundige',
    floor_id: 1,
    created_at: '2024-01-20T09:00:00Z',
    updated_at: '2024-01-20T09:00:00Z',
  },
  {
    user_id: 3,
    email: 'thomas.vermeer@syntheo.nl',
    password: 'hashed_password_3',
    name: 'Thomas Vermeer',
    role: 'Verzorgende',
    floor_id: 2,
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z',
  },
  {
    user_id: 4,
    email: 'sophie.de.vries@syntheo.nl',
    password: 'hashed_password_4',
    name: 'Sophie de Vries',
    role: 'Verzorgende',
    floor_id: 3,
    created_at: '2024-02-10T11:00:00Z',
    updated_at: '2024-02-10T11:00:00Z',
  },
];

// RESIDENTS - Bewoners
export const residents = [
  {
    resident_id: 1,
    name: 'Gerda van der Berg',
    date_of_birth: '1945-03-12',
    photo_url: 'https://i.pravatar.cc/150?img=1',
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-10T08:00:00Z',
  },
  {
    resident_id: 2,
    name: 'Henk Bakker',
    date_of_birth: '1938-07-22',
    photo_url: 'https://i.pravatar.cc/150?img=2',
    created_at: '2024-01-12T09:00:00Z',
    updated_at: '2024-01-12T09:00:00Z',
  },
  {
    resident_id: 3,
    name: 'Anna de Jong',
    date_of_birth: '1942-11-05',
    photo_url: 'https://i.pravatar.cc/150?img=3',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    resident_id: 4,
    name: 'Willem Jansen',
    date_of_birth: '1940-05-18',
    photo_url: 'https://i.pravatar.cc/150?img=4',
    created_at: '2024-01-18T11:00:00Z',
    updated_at: '2024-01-18T11:00:00Z',
  },
  {
    resident_id: 5,
    name: 'Maria Visser',
    date_of_birth: '1948-09-30',
    photo_url: 'https://i.pravatar.cc/150?img=5',
    created_at: '2024-01-20T12:00:00Z',
    updated_at: '2024-01-20T12:00:00Z',
  },
  {
    resident_id: 6,
    name: 'Piet Mulder',
    date_of_birth: '1936-02-14',
    photo_url: 'https://i.pravatar.cc/150?img=6',
    created_at: '2024-01-22T13:00:00Z',
    updated_at: '2024-01-22T13:00:00Z',
  },
];

// ROOMS - Kamers
export const rooms = [
  { room_id: 101, floor_id: 1, resident_id: 1 },
  { room_id: 102, floor_id: 1, resident_id: 2 },
  { room_id: 103, floor_id: 1, resident_id: null }, // Lege kamer
  { room_id: 201, floor_id: 2, resident_id: 3 },
  { room_id: 202, floor_id: 2, resident_id: 4 },
  { room_id: 301, floor_id: 3, resident_id: 5 },
  { room_id: 302, floor_id: 3, resident_id: 6 },
  { room_id: 303, floor_id: 3, resident_id: null }, // Lege kamer
];

// CONTACTS - Contactpersonen
export const contacts = [
  {
    contact_id: 1,
    resident_id: 1,
    name: 'Peter van der Berg',
    relation: 'Zoon',
    phone: '06-12345678',
    email: 'peter.vdberg@email.nl',
    is_primary: true,
  },
  {
    contact_id: 2,
    resident_id: 1,
    name: 'Lisa van der Berg',
    relation: 'Dochter',
    phone: '06-87654321',
    email: 'lisa.vdberg@email.nl',
    is_primary: false,
  },
  {
    contact_id: 3,
    resident_id: 2,
    name: 'Sandra Bakker',
    relation: 'Dochter',
    phone: '06-23456789',
    email: 'sandra.bakker@email.nl',
    is_primary: true,
  },
  {
    contact_id: 4,
    resident_id: 3,
    name: 'Jan de Jong',
    relation: 'Zoon',
    phone: '06-34567890',
    email: 'jan.dejong@email.nl',
    is_primary: true,
  },
  {
    contact_id: 5,
    resident_id: 4,
    name: 'Karin Jansen',
    relation: 'Dochter',
    phone: '06-45678901',
    email: 'karin.jansen@email.nl',
    is_primary: true,
  },
];

// ALLERGIES - Allergieën
export const allergies = [
  {
    allergy_id: 1,
    resident_id: 1,
    symptom: 'Penicilline',
    severity: 'Hoog',
    created_at: '2024-01-10T08:00:00Z',
  },
  {
    allergy_id: 2,
    resident_id: 2,
    symptom: 'Noten',
    severity: 'Matig',
    created_at: '2024-01-12T09:00:00Z',
  },
  {
    allergy_id: 3,
    resident_id: 3,
    symptom: 'Lactose',
    severity: 'Laag',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    allergy_id: 4,
    resident_id: 5,
    symptom: 'Gluten',
    severity: 'Matig',
    created_at: '2024-01-20T12:00:00Z',
  },
];

// DIETS - Diëten
export const diets = [
  {
    diet_id: 1,
    diet_type: 'Diabetisch',
    resident_id: 1,
    description: 'Suikerbeperkt dieet, geen snelle koolhydraten',
    created_at: '2024-01-10T08:00:00Z',
  },
  {
    diet_id: 2,
    diet_type: 'Zoutarm',
    resident_id: 2,
    description: 'Maximum 6 gram zout per dag',
    created_at: '2024-01-12T09:00:00Z',
  },
  {
    diet_id: 3,
    diet_type: 'Glutenvrij',
    resident_id: 5,
    description: 'Geen producten met gluten',
    created_at: '2024-01-20T12:00:00Z',
  },
  {
    diet_id: 4,
    diet_type: 'Lactosevrij',
    resident_id: 3,
    description: 'Geen zuivelproducten met lactose',
    created_at: '2024-01-15T10:00:00Z',
  },
];

// MEDICATION_LIBRARY - Medicatie bibliotheek
export const medicationLibrary = [
  {
    medication_id: 1,
    name: 'Paracetamol 500mg',
    category: 'Pijnstiller',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    medication_id: 2,
    name: 'Metformine 850mg',
    category: 'Diabetes',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    medication_id: 3,
    name: 'Simvastatine 40mg',
    category: 'Cholesterol',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    medication_id: 4,
    name: 'Omeprazol 20mg',
    category: 'Maag',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    medication_id: 5,
    name: 'Amlodipine 5mg',
    category: 'Bloeddruk',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    medication_id: 6,
    name: 'Acenocoumarol 1mg',
    category: 'Bloedverdunner',
    created_at: '2024-01-01T00:00:00Z',
  },
];

// RES_MEDICATION - Medicatie van bewoners
export const resMedication = [
  {
    res_medication_id: 1,
    medication_id: 2,
    resident_id: 1,
    is_active: true,
    end_date: null,
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-10T08:00:00Z',
  },
  {
    res_medication_id: 2,
    medication_id: 1,
    resident_id: 1,
    is_active: true,
    end_date: null,
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-10T08:00:00Z',
  },
  {
    res_medication_id: 3,
    medication_id: 3,
    resident_id: 2,
    is_active: true,
    end_date: null,
    created_at: '2024-01-12T09:00:00Z',
    updated_at: '2024-01-12T09:00:00Z',
  },
  {
    res_medication_id: 4,
    medication_id: 5,
    resident_id: 2,
    is_active: true,
    end_date: null,
    created_at: '2024-01-12T09:00:00Z',
    updated_at: '2024-01-12T09:00:00Z',
  },
  {
    res_medication_id: 5,
    medication_id: 4,
    resident_id: 3,
    is_active: true,
    end_date: null,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    res_medication_id: 6,
    medication_id: 6,
    resident_id: 4,
    is_active: true,
    end_date: null,
    created_at: '2024-01-18T11:00:00Z',
    updated_at: '2024-01-18T11:00:00Z',
  },
];

// RES_SCHEDULE - Medicatie schema's
export const resSchedules = [
  {
    schedule_id: 1,
    res_medication_id: 1,
    dosage: '1 tablet',
    instructions: 'Bij het ontbijt innemen',
    time_of_day: '08:00',
    day_of_week: null, // Dagelijks
  },
  {
    schedule_id: 2,
    res_medication_id: 1,
    dosage: '1 tablet',
    instructions: 'Bij het avondeten innemen',
    time_of_day: '18:00',
    day_of_week: null,
  },
  {
    schedule_id: 3,
    res_medication_id: 2,
    dosage: '1 tablet',
    instructions: 'Zo nodig bij pijn, max 4x per dag',
    time_of_day: '09:00',
    day_of_week: null,
  },
  {
    schedule_id: 4,
    res_medication_id: 3,
    dosage: '1 tablet',
    instructions: 'Voor het slapen gaan',
    time_of_day: '21:00',
    day_of_week: null,
  },
  {
    schedule_id: 5,
    res_medication_id: 4,
    dosage: '1 tablet',
    instructions: 'Bij het ontbijt',
    time_of_day: '08:00',
    day_of_week: null,
  },
  {
    schedule_id: 6,
    res_medication_id: 5,
    dosage: '1 tablet',
    instructions: 'Voor het ontbijt op nuchtere maag',
    time_of_day: '07:30',
    day_of_week: null,
  },
  {
    schedule_id: 7,
    res_medication_id: 6,
    dosage: '1 tablet',
    instructions: 'Elke dag op zelfde tijdstip',
    time_of_day: '18:00',
    day_of_week: null,
  },
];

// MEDICATION_ROUND - Medicatie rondes
export const medicationRounds = [
  {
    round_id: 1,
    res_medication_id: 1,
    schedule_id: 1,
    resident_id: 1,
    status: 'Gegeven',
    notes: null,
    given_by: 2,
    given_at: '2024-12-16T08:05:00Z',
  },
  {
    round_id: 2,
    res_medication_id: 2,
    schedule_id: 3,
    resident_id: 1,
    status: 'Gegeven',
    notes: null,
    given_by: 2,
    given_at: '2024-12-16T09:02:00Z',
  },
  {
    round_id: 3,
    res_medication_id: 3,
    schedule_id: 4,
    resident_id: 2,
    status: 'Gepland',
    notes: null,
    given_by: null,
    given_at: null,
  },
  {
    round_id: 4,
    res_medication_id: 4,
    schedule_id: 5,
    resident_id: 2,
    status: 'Gegeven',
    notes: null,
    given_by: 3,
    given_at: '2024-12-16T08:10:00Z',
  },
  {
    round_id: 5,
    res_medication_id: 5,
    schedule_id: 6,
    resident_id: 3,
    status: 'Gemist',
    notes: 'Bewoner was misselijk',
    given_by: 3,
    given_at: '2024-12-16T07:30:00Z',
  },
  {
    round_id: 6,
    res_medication_id: 6,
    schedule_id: 7,
    resident_id: 4,
    status: 'Gepland',
    notes: null,
    given_by: null,
    given_at: null,
  },
];

// NOTES - Notities/Meldingen
export const notes = [
  {
    note_id: 1,
    resident_id: 1,
    author_id: 2,
    category: 'Gezondheid',
    urgency: 'Hoog',
    content: 'Bewoner heeft koorts, huisarts gecontacteerd',
    is_resolved: false,
    created_at: '2024-12-16T10:30:00Z',
    resolved_at: null,
    resolved_by: null,
  },
  {
    note_id: 2,
    resident_id: 2,
    author_id: 3,
    category: 'Gedrag',
    urgency: 'Laag',
    content: 'Bewoner was vandaag erg opgewekt tijdens lunch',
    is_resolved: true,
    created_at: '2024-12-15T12:00:00Z',
    resolved_at: '2024-12-15T14:00:00Z',
    resolved_by: 2,
  },
  {
    note_id: 3,
    resident_id: 3,
    author_id: 2,
    category: 'Vallen',
    urgency: 'Hoog',
    content: 'Bewoner gevallen in badkamer, geen verwondingen',
    is_resolved: true,
    created_at: '2024-12-14T16:45:00Z',
    resolved_at: '2024-12-14T17:00:00Z',
    resolved_by: 1,
  },
  {
    note_id: 4,
    resident_id: 4,
    author_id: 4,
    category: 'Medicatie',
    urgency: 'Matig',
    content: 'Bewoner weigerde medicatie in te nemen',
    is_resolved: false,
    created_at: '2024-12-16T08:30:00Z',
    resolved_at: null,
    resolved_by: null,
  },
  {
    note_id: 5,
    resident_id: 5,
    author_id: 2,
    category: 'Familie',
    urgency: 'Laag',
    content: 'Familie heeft gebeld, komt morgen op bezoek',
    is_resolved: true,
    created_at: '2024-12-15T14:20:00Z',
    resolved_at: '2024-12-16T10:00:00Z',
    resolved_by: 2,
  },
  {
    note_id: 6,
    resident_id: 6,
    author_id: 3,
    category: 'Voeding',
    urgency: 'Matig',
    content: 'Bewoner at slecht tijdens avondeten, houdt in de gaten',
    is_resolved: false,
    created_at: '2024-12-16T19:00:00Z',
    resolved_at: null,
    resolved_by: null,
  },
];

// CHANGE_REQUESTS - Wijzigingsverzoeken
export const changeRequests = [
  {
    request_id: 1,
    resident_id: 1,
    requester_id: 2,
    reviewer_id: 1,
    urgency: 'Matig',
    status: 'Goedgekeurd',
    created_at: '2024-12-14T09:00:00Z',
    reviewed_at: '2024-12-14T11:00:00Z',
  },
  {
    request_id: 2,
    resident_id: 3,
    requester_id: 3,
    reviewer_id: null,
    urgency: 'Laag',
    status: 'In behandeling',
    created_at: '2024-12-16T08:00:00Z',
    reviewed_at: null,
  },
  {
    request_id: 3,
    resident_id: 5,
    requester_id: 4,
    reviewer_id: 1,
    urgency: 'Hoog',
    status: 'Afgekeurd',
    created_at: '2024-12-15T14:00:00Z',
    reviewed_at: '2024-12-15T16:00:00Z',
  },
];

// CHANGE_FIELDS - Velden van wijzigingsverzoeken
export const changeFields = [
  {
    request_id: 1,
    field_id: 1,
    field_name: 'diet_type',
    old: 'Diabetisch',
    new: 'Diabetisch + Zoutarm',
  },
  {
    request_id: 2,
    field_id: 2,
    field_name: 'medication_dosage',
    old: '1 tablet',
    new: '2 tabletten',
  },
  {
    request_id: 3,
    field_id: 3,
    field_name: 'contact_phone',
    old: '06-12345678',
    new: '06-98765432',
  },
];

// ANNOUNCEMENTS - Aankondigingen
export const announcements = [
  {
    announcement_id: 1,
    author_id: 1,
    title: 'Teamvergadering volgende week',
    message: 'Volgende week donderdag om 14:00 uur is er een teamvergadering in de vergaderzaal.',
    recipient_type: 'Alle verdiepingen',
    floor_id: null,
    created_at: '2024-12-14T10:00:00Z',
  },
  {
    announcement_id: 2,
    author_id: 1,
    title: 'Sinterklaasviering',
    message: 'Aanstaande vrijdag vieren we Sinterklaas met de bewoners. Verzoek om 15:00 aanwezig te zijn.',
    recipient_type: 'Alle verdiepingen',
    floor_id: null,
    created_at: '2024-12-10T09:00:00Z',
  },
  {
    announcement_id: 3,
    author_id: 1,
    title: 'Onderhoud verdieping 2',
    message: 'Morgen wordt er onderhoud gepleegd aan de verwarming op verdieping 2. Verwacht enige hinder.',
    recipient_type: 'Specifieke verdieping',
    floor_id: 2,
    created_at: '2024-12-15T08:00:00Z',
  },
];

// ANNOUNCEMENT_RECIPIENTS - Ontvangers van aankondigingen
export const announcementRecipients = [
  {
    recipient_id: 1,
    announcement_id: 1,
    user_id: 1,
    is_read: true,
    read_at: '2024-12-14T10:30:00Z',
  },
  {
    recipient_id: 2,
    announcement_id: 1,
    user_id: 2,
    is_read: true,
    read_at: '2024-12-14T11:00:00Z',
  },
  {
    recipient_id: 3,
    announcement_id: 1,
    user_id: 3,
    is_read: false,
    read_at: null,
  },
  {
    recipient_id: 4,
    announcement_id: 2,
    user_id: 1,
    is_read: true,
    read_at: '2024-12-10T09:15:00Z',
  },
  {
    recipient_id: 5,
    announcement_id: 3,
    user_id: 3,
    is_read: false,
    read_at: null,
  },
];

// AUDIT_LOG - Audit logs
export const auditLogs = [
  {
    log_id: 1,
    user_id: 2,
    entity_type: 'MEDICATION_ROUND',
    entity_id: 1,
    action: 'CREATE',
    details: 'Medicatie toegediend aan Gerda van der Berg',
    timestamp: '2024-12-16T08:05:00Z',
  },
  {
    log_id: 2,
    user_id: 1,
    entity_type: 'CHANGE_REQUEST',
    entity_id: 1,
    action: 'APPROVE',
    details: 'Wijzigingsverzoek goedgekeurd voor dieet aanpassing',
    timestamp: '2024-12-14T11:00:00Z',
  },
  {
    log_id: 3,
    user_id: 2,
    entity_type: 'NOTE',
    entity_id: 1,
    action: 'CREATE',
    details: 'Nieuwe melding aangemaakt voor bewoner',
    timestamp: '2024-12-16T10:30:00Z',
  },
  {
    log_id: 4,
    user_id: 3,
    entity_type: 'MEDICATION_ROUND',
    entity_id: 5,
    action: 'UPDATE',
    details: 'Status gewijzigd naar Gemist met notitie',
    timestamp: '2024-12-16T07:30:00Z',
  },
];

// Helper functies om data op te halen
export const getResidentById = (id) => {
  return residents.find(r => r.resident_id === id);
};

export const getUserById = (id) => {
  return users.find(u => u.user_id === id);
};

export const getResidentsByFloor = (floorId) => {
  const roomsOnFloor = rooms.filter(r => r.floor_id === floorId);
  const residentIds = roomsOnFloor.map(r => r.resident_id).filter(id => id !== null);
  return residents.filter(r => residentIds.includes(r.resident_id));
};

export const getMedicationForResident = (residentId) => {
  const resMeds = resMedication.filter(rm => rm.resident_id === residentId && rm.is_active);
  return resMeds.map(rm => {
    const med = medicationLibrary.find(m => m.medication_id === rm.medication_id);
    const schedules = resSchedules.filter(s => s.res_medication_id === rm.res_medication_id);
    return {
      ...rm,
      medication: med,
      schedules: schedules,
    };
  });
};

export const getNotesForResident = (residentId) => {
  return notes.filter(n => n.resident_id === residentId);
};

export const getUnresolvedNotes = () => {
  return notes.filter(n => !n.is_resolved);
};

export const getTodaysMedicationRounds = () => {
  const today = new Date().toISOString().split('T')[0];
  return medicationRounds.filter(mr => {
    if (mr.given_at) {
      return mr.given_at.startsWith(today);
    }
    return mr.status === 'Gepland';
  });
};

export const getContactsForResident = (residentId) => {
  return contacts.filter(c => c.resident_id === residentId);
};

export const getAllergiesForResident = (residentId) => {
  return allergies.filter(a => a.resident_id === residentId);
};

export const getDietForResident = (residentId) => {
  return diets.find(d => d.resident_id === residentId);
};

export const getPendingChangeRequests = () => {
  return changeRequests.filter(cr => cr.status === 'In behandeling');
};

export const getUnreadAnnouncementsForUser = (userId) => {
  const unreadRecipients = announcementRecipients.filter(
    ar => ar.user_id === userId && !ar.is_read
  );
  return unreadRecipients.map(ar =>
    announcements.find(a => a.announcement_id === ar.announcement_id)
  );
};

// Export all data
export default {
  floors,
  users,
  residents,
  rooms,
  contacts,
  allergies,
  diets,
  medicationLibrary,
  resMedication,
  resSchedules,
  medicationRounds,
  notes,
  changeRequests,
  changeFields,
  announcements,
  announcementRecipients,
  auditLogs,
  // Helper functions
  getResidentById,
  getUserById,
  getResidentsByFloor,
  getMedicationForResident,
  getNotesForResident,
  getUnresolvedNotes,
  getTodaysMedicationRounds,
  getContactsForResident,
  getAllergiesForResident,
  getDietForResident,
  getPendingChangeRequests,
  getUnreadAnnouncementsForUser,
};
