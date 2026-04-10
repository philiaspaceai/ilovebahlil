import { supabase, isSupabaseConfigured } from './supabase';
import { Note } from '../types';

const LOCAL_KEY = '2kyu_notes';

const getLocalNotes = (): Note[] => {
  const data = localStorage.getItem(LOCAL_KEY);
  return data ? JSON.parse(data) : [];
};

const saveLocalNotes = (notes: Note[]) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(notes));
};

export const getNotes = async (): Promise<Note[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('note').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }
  return getLocalNotes().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const createNote = async (noteData: Omit<Note, 'id' | 'created_at'>): Promise<Note> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('note').insert([noteData]).select().single();
    if (error) throw error;
    return data;
  }

  const newNote: Note = {
    ...noteData,
    id: Date.now(),
    created_at: new Date().toISOString(),
  };
  const notes = getLocalNotes();
  notes.push(newNote);
  saveLocalNotes(notes);
  return newNote;
};

export const updateNote = async (id: number, updates: Partial<Omit<Note, 'id' | 'created_at'>>): Promise<Note> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('note').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  const notes = getLocalNotes();
  const index = notes.findIndex(n => n.id === id);
  if (index === -1) throw new Error('Note not found');
  
  notes[index] = { ...notes[index], ...updates };
  saveLocalNotes(notes);
  return notes[index];
};

export const deleteNote = async (id: number): Promise<void> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('note').delete().eq('id', id);
    if (error) throw error;
    return;
  }

  const notes = getLocalNotes();
  saveLocalNotes(notes.filter(n => n.id !== id));
};
