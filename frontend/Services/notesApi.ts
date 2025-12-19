// Notes API Service
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';
import type { Note } from '@/types/note';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Fetch all notes from the backend
 */
export const fetchNotes = async (): Promise<Note[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.notes}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Note[]> = await response.json();
    return result.data || [];
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

    const result: ApiResponse<Note[]> = await response.json();
    return result.data || [];
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
}): Promise<Note> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.notes}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        ...noteData,
        author_id: 1, // TODO: Get from auth context
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Note> = await response.json();
    return result.data;
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
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.noteById(noteId)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(noteData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Note> = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error updating note ${noteId}:`, error);
    throw error;
  }
};

/**
 * Resolve a note
 */
export const resolveNote = async (noteId: number): Promise<Note> => {
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
          resolved_by: 1, // TODO: Get from auth context
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Note> = await response.json();
    return result.data;
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

    const result: ApiResponse<Note> = await response.json();
    return result.data;
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
