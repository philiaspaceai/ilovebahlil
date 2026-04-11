import { Search, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Note } from '../types';
import { NoteCard } from './NoteCard';
import { AnimatePresence } from 'motion/react';

interface SearchNoteProps {
  notes: Note[];
  isLoading: boolean;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onView: (note: Note) => void;
  title?: string;
  onBack?: () => void;
}

export function SearchNote({ notes, isLoading, onEdit, onDelete, onView, title, onBack }: SearchNoteProps) {
  const [searchInput, setSearchInput] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');

  const filteredNotes = notes.filter(note => {
    if (!activeSearchQuery) return true;
    // Match case (case-sensitive) search across title, note, note2, and name
    return note.title.includes(activeSearchQuery) ||
           note.note.includes(activeSearchQuery) ||
           (note.note2 && note.note2.includes(activeSearchQuery)) ||
           note.name.includes(activeSearchQuery);
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const handleSearch = () => {
    setActiveSearchQuery(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setActiveSearchQuery('');
  };

  return (
    <div className="w-full">
      {/* Header khusus jika sedang melihat isi Deck tertentu */}
      {title && onBack && (
        <div className="mb-6 flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm border border-pink-100 text-pink-500 hover:bg-pink-50 transition-colors"
            title="Kembali ke Deck"
          >
            &larr;
          </button>
          <h2 className="text-2xl font-bold text-pink-900">Deck: {title}</h2>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-8 flex gap-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-pink-400" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            placeholder="Cari note (Match Case)..."
            className="w-full pl-11 pr-10 py-3 bg-white/80 backdrop-blur-sm border border-pink-200 rounded-full shadow-sm focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all text-pink-900 placeholder:text-pink-300"
          />
          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-pink-400 hover:text-pink-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full shadow-sm font-bold transition-colors flex-shrink-0"
        >
          Cari
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-pink-300">
          <Sparkles className="animate-spin mb-4" size={32} />
          <p className="font-bold animate-pulse">Loading cute notes...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">🌸</div>
          <h2 className="text-2xl font-bold text-pink-900 mb-2">
            {activeSearchQuery ? "Note tidak ditemukan" : "Belum ada note di sini!"}
          </h2>
          <p className="text-pink-600 max-w-sm">
            {activeSearchQuery ? "Coba cari dengan kata kunci lain yaa." : "Yuk buat note baru sekarang!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
