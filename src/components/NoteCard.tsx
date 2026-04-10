import { format } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';
import { Note } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onView: (note: Note) => void;
}

export function NoteCard({ note, onEdit, onDelete, onView }: NoteCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      onClick={() => onView(note)}
      className={cn(
        "bg-white p-6 rounded-3xl shadow-sm border border-pink-100 cursor-pointer",
        "hover:shadow-md hover:shadow-pink-200/50 transition-all duration-300",
        "flex flex-col h-full relative group"
      )}
    >
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(note);
          }}
          className="p-2 text-pink-400 hover:bg-pink-50 rounded-full transition-colors"
          title="Edit Note"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="p-2 text-rose-400 hover:bg-rose-50 rounded-full transition-colors"
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
