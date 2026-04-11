import { Note } from '../types';
import { Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo } from 'react';

interface NoteDeckProps {
  notes: Note[];
  onSelectDeck: (title: string) => void;
}

export function NoteDeck({ notes, onSelectDeck }: NoteDeckProps) {
  // Group notes by title to form decks
  const decks = useMemo(() => {
    const grouped = new Map<string, Note[]>();
    notes.forEach(note => {
      if (!grouped.has(note.title)) grouped.set(note.title, []);
      grouped.get(note.title)!.push(note);
    });
    
    return Array.from(grouped.entries()).map(([title, deckNotes]) => ({
      title,
      notes: deckNotes,
      // Find the latest date among the notes in this deck to sort decks
      latestDate: Math.max(...deckNotes.map(n => new Date(n.created_at).getTime()))
    })).sort((a, b) => b.latestDate - a.latestDate);
  }, [notes]);

  if (decks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🌸</div>
        <h2 className="text-2xl font-bold text-pink-900 mb-2">Belum ada Deck!</h2>
        <p className="text-pink-600 max-w-sm">
          Buat note pertamamu untuk memulai koleksi deck.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {decks.map(deck => (
        <motion.div
          key={deck.title}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -6 }}
          onClick={() => onSelectDeck(deck.title)}
          className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 cursor-pointer hover:shadow-md hover:shadow-pink-300/50 transition-all duration-300 flex flex-col items-center text-center aspect-square justify-center relative overflow-hidden group"
        >
          {/* Cute folder-like accents */}
          <div className="absolute top-0 left-0 w-full h-3 bg-pink-200 opacity-50 group-hover:bg-pink-300 transition-colors"></div>
          <div className="absolute top-3 left-0 w-full h-2 bg-pink-100 opacity-50 group-hover:bg-pink-200 transition-colors"></div>
          
          <Layers className="text-pink-300 mb-4 group-hover:text-pink-400 transition-colors" size={48} />
          <h3 className="font-bold text-pink-900 text-lg line-clamp-2 mb-2 px-2">{deck.title}</h3>
          <span className="bg-pink-50 text-pink-500 text-xs font-bold px-3 py-1 rounded-full">
            {deck.notes.length} Notes
          </span>
        </motion.div>
      ))}
    </div>
  );
}
