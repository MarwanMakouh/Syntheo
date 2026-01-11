// Notes API Service
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';
import type { Note } from '@/types/note';
import {
  mapCategoryToBackend,
  mapCategoryFromBackend,
  mapUrgencyToBackend,
  mapUrgencyFromBackend,
} from './noteMapper';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Map note from backend format to frontend format
 */
const mapNoteFromBackend = (note: any): Note => {
  return {
    ...note,
    category: mapCategoryFromBackend(note.category),
    urgency: mapUrgencyFromBackend(note.urgency),
  };
};

/**
 * Get acknowledged note IDs from localStorage
 */
const getAcknowledgedNoteIds = (): number[] => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return JSON.parse(localStorage.getItem('acknowledgedNotes') || '[]');
    }
    return [];
  } catch {
    return [];
  }
};

/**
 * Fetch all notes from the backend
 */
export const fetchNotes = async (): Promise<Note[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.notes}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<any[]> = await response.json();
    const notes = (result.data || []).map(mapNoteFromBackend);

    // Merge with localStorage acknowledged notes
    const acknowledgedIds = getAcknowledgedNoteIds();
    return notes.map(note => {
      if (acknowledgedIds.includes(note.note_id)) {
        return {
          ...note,
          is_acknowledged: true,
          acknowledged_at: note.acknowledged_at || new Date().toISOString(),
          acknowledged_by: note.acknowledged_by || 1,
        };
      }
      return note;
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

/**
 * Fetch notes for a specific resident
 */
export const fetchNotesByResident = async (residentId: number): Promise<Note[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.notesByResident(residentId)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<any[]> = await response.json();
    return (result.data || []).map(mapNoteFromBackend);
  } catch (error) {
    console.error(`Error fetching notes for resident ${residentId}:`, error);
    throw error;
  }
};

/**
 * Create a new note
 */
export const createNote = async (noteData: {
  resident_id?: number;
  category: string;
  urgency: 'Laag' | 'Matig' | 'Hoog';
  content: string;
  author_id?: number;
}): Promise<Note> => {
  try {
    // Map Dutch values to English for backend
    const backendData = {
      resident_id: noteData.resident_id,
      category: mapCategoryToBackend(noteData.category),
      urgency: mapUrgencyToBackend(noteData.urgency),
      content: noteData.content,
      author_id: noteData.author_id || 1,
    };

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.notes}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(backendData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<any> = await response.json();
    return mapNoteFromBackend(result.data);
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

/**
 * Update an existing note
 */
export const updateNote = async (
  noteId: number,
  noteData: Partial<Note>
): Promise<Note> => {
  try {
    // Map Dutch values to English for backend if present
    const backendData: any = { ...noteData };
    if (noteData.category) {
      backendData.category = mapCategoryToBackend(noteData.category);
    }
    if (noteData.urgency) {
      backendData.urgency = mapUrgencyToBackend(noteData.urgency);
    }

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.noteById(noteId)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(backendData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<any> = await response.json();
    return mapNoteFromBackend(result.data);
  } catch (error) {
    console.error(`Error updating note ${noteId}:`, error);
    throw error;
  }
};

/**
 * Resolve a note
 */
export const resolveNote = async (noteId: number, resolverId?: number): Promise<Note> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.resolveNote(noteId)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          resolved_by: resolverId || 1,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<any> = await response.json();
    return mapNoteFromBackend(result.data);
  } catch (error) {
    console.error(`Error resolving note ${noteId}:`, error);
    throw error;
  }
};

/**
 * Unresolve a note
 */
export const unresolveNote = async (noteId: number): Promise<Note> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.unresolveNote(noteId)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<any> = await response.json();
    return mapNoteFromBackend(result.data);
  } catch (error) {
    console.error(`Error unresolving note ${noteId}:`, error);
    throw error;
  }
};

/**
 * Delete a note
 */
export const deleteNote = async (noteId: number): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.noteById(noteId)}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting note ${noteId}:`, error);
    throw error;
  }
};

/**
 * Acknowledge a note (mark as viewed/bekeken on dashboard)
 * Uses localStorage with quick backend attempt (with timeout)
 */
export const acknowledgeNote = async (noteId: number, acknowledgerId?: number): Promise<void> => {
  // Use localStorage immediately for instant feedback
  if (typeof window !== 'undefined' && window.localStorage) {
    const acknowledgedNotes = JSON.parse(localStorage.getItem('acknowledgedNotes') || '[]');
    if (!acknowledgedNotes.includes(noteId)) {
      acknowledgedNotes.push(noteId);
      localStorage.setItem('acknowledgedNotes', JSON.stringify(acknowledgedNotes));
    }
  }

  // Try backend in background with short timeout (don't wait for it)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1000); // 1 second timeout

  try {
    await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.acknowledgeNote(noteId)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          acknowledged_by: acknowledgerId || 1,
        }),
        signal: controller.signal,
      }
    );
  } catch (error) {
    // Silently fail - localStorage is already updated
  } finally {
    clearTimeout(timeoutId);
  }
};
