import { format } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';
import { Note } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onView: (note: Note) => void;
}

export function NoteCard({ note, onEdit, onDelete, onView }: NoteCardProps) {
  const [showActions, setShowActions] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressRef = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close actions on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setShowActions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleTouchStart = () => {
    isLongPressRef.current = false;
    timerRef.current = setTimeout(() => {
      setShowActions(true);
      isLongPressRef.current = true;
      // Vibrate for tactile feedback if supported
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }, 500); // 500ms long press
  };

  const handleTouchEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleTouchMove = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleClick = () => {
    if (isLongPressRef.current) {
      // Reset for next time
      isLongPressRef.current = false;
      return;
    }
    if (showActions) {
      // If actions are shown, tapping the card hides them
      setShowActions(false);
      return;
    }
    onView(note);
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onContextMenu={(e) => {
        // Prevent default context menu on long press for mobile
        if (window.innerWidth <= 768) e.preventDefault();
      }}
      style={{ WebkitTouchCallout: 'none' }}
      className={cn(
        "bg-white p-6 rounded-3xl shadow-sm border border-pink-100 cursor-pointer select-none",
        "hover:shadow-md hover:shadow-pink-200/50 transition-all duration-300",
        "flex flex-col h-full relative group",
        showActions ? "ring-2 ring-pink-400 shadow-md" : ""
      )}
    >
      <div className={cn(
        "absolute top-4 right-4 flex gap-2 transition-opacity z-10",
        showActions ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowActions(false);
            onEdit(note);
          }}
          className="p-2 text-pink-400 hover:bg-pink-100 rounded-full transition-colors bg-white/90 backdrop-blur-sm shadow-sm"
          title="Edit Note"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowActions(false);
            onDelete(note.id);
          }}
          className="p-2 text-rose-400 hover:bg-rose-100 rounded-full transition-colors bg-white/90 backdrop-blur-sm shadow-sm"
          title="Delete Note"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <h3 className="text-xl font-bold text-pink-900 mb-2 pr-16 line-clamp-2">
        {note.title}
      </h3>
      
      <p className="text-pink-700/80 text-sm mb-4 flex-grow whitespace-pre-wrap line-clamp-5">
        {note.note}
      </p>

      <div className="mt-auto pt-4 border-t border-pink-50 flex justify-between items-center text-xs font-medium">
        <span className="bg-pink-500 text-white px-3 py-1 rounded-full shadow-sm">
          {note.name || 'Anonymous'}
        </span>
        <span className="text-pink-400">
          {format(new Date(note.created_at), 'MMM d, yyyy')}
        </span>
      </div>
    </motion.div>
  );
}
