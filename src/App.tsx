import { useEffect, useState } from 'react';
import { Plus, Sparkles, Database, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Note } from './types';
import { getNotes, createNote, updateNote, deleteNote } from './lib/noteService';
import { isSupabaseConfigured } from './lib/supabase';
import { NoteCard } from './components/NoteCard';
import { NoteModal } from './components/NoteModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { NoteViewModal } from './components/NoteViewModal';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error' | 'local'>(
    isSupabaseConfigured ? 'checking' : 'local'
  );

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
      if (isSupabaseConfigured) setDbStatus('connected');
    } catch (error) {
      console.error('Error fetching notes:', error);
      if (isSupabaseConfigured) setDbStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = async (noteData: Omit<Note, 'id' | 'created_at'>) => {
    if (editingNote) {
      const updated = await updateNote(editingNote.id, noteData);
      setNotes(notes.map(n => n.id === updated.id ? updated : n));
    } else {
      const created = await createNote(noteData);
      setNotes([created, ...notes]);
    }
  };

  const handleDeleteClick = (id: number) => {
    setNoteToDelete(id);
  };

  const executeDelete = async () => {
    if (noteToDelete === null) return;
    try {
      await deleteNote(noteToDelete);
      setNotes(notes.filter(n => n.id !== noteToDelete));
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    } finally {
      setNoteToDelete(null);
    }
  };

  const openNewNoteModal = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const openEditNoteModal = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const renderStatusIndicator = () => {
    switch (dbStatus) {
      case 'checking':
        return (
          <div className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
            <Loader2 className="animate-spin" size={16} />
            <span className="hidden sm:inline">Checking DB...</span>
          </div>
        );
      case 'connected':
        return (
          <div className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Wifi size={16} />
            <span className="hidden sm:inline">DB Connected</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full bg-rose-50 text-rose-600 border border-rose-100" title="Failed to connect to Supabase">
            <WifiOff size={16} />
            <span className="hidden sm:inline">DB Error</span>
          </div>
        );
      case 'local':
      default:
        return (
          <div className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full bg-pink-50 text-pink-600 border border-pink-100">
            <Database size={16} />
            <span className="hidden sm:inline">Local Mode</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-pink-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-pink-100 p-2 rounded-2xl flex items-center justify-center w-11 h-11 shadow-sm border border-pink-200/50 text-2xl select-none">
              🌸
            </div>
            <h1 className="text-2xl font-extrabold text-pink-900 tracking-tight">
              2級攻略
            </h1>
          </div>
          
          {/* Status Indicator */}
          {renderStatusIndicator()}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {dbStatus === 'local' && (
          <div className="mb-8 bg-pink-100/50 border border-pink-200 rounded-2xl p-4 text-pink-800 text-sm text-center">
            <strong>Notice:</strong> Supabase is not configured yet. Notes are currently saved in your browser's local storage. 
            Add your Supabase URL and Key to the <code className="bg-white px-1.5 py-0.5 rounded text-pink-600">.env</code> file to sync!
          </div>
        )}

        {dbStatus === 'error' && (
          <div className="mb-8 bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-800 text-sm text-center">
            <strong>Connection Error:</strong> Gagal terhubung ke Supabase. Pastikan URL dan Anon Key sudah benar, dan tabel <code className="bg-white px-1.5 py-0.5 rounded text-rose-600">note</code> sudah dibuat.
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-pink-300">
            <Sparkles className="animate-spin mb-4" size={32} />
            <p className="font-bold animate-pulse">Loading cute notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🌸</div>
            <h2 className="text-2xl font-bold text-pink-900 mb-2">No notes yet!</h2>
            <p className="text-pink-600 max-w-sm">
              Start your journey by creating your first cute note for 2級攻略.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={openEditNoteModal}
                  onDelete={handleDeleteClick}
                  onView={setViewingNote}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={openNewNoteModal}
        className="fixed bottom-8 right-8 w-16 h-16 bg-pink-400 hover:bg-pink-500 text-white rounded-full shadow-lg shadow-pink-300/50 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-30"
        aria-label="Add new note"
      >
        <Plus size={32} />
      </button>

      {/* Modals */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        initialData={editingNote}
      />

      <DeleteConfirmModal
        isOpen={noteToDelete !== null}
        onClose={() => setNoteToDelete(null)}
        onConfirm={executeDelete}
      />

      <NoteViewModal
        isOpen={viewingNote !== null}
        onClose={() => setViewingNote(null)}
        note={viewingNote}
      />
    </div>
  );
}
