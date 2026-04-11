import { X, Wand2 } from 'lucide-react';
import { Note } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

interface NoteViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  onMagicClick?: (title: string) => void;
}

export function NoteViewModal({ isOpen, onClose, note, onMagicClick }: NoteViewModalProps) {
  if (!note) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-pink-900/20 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 p-4"
          >
            <div className="bg-white rounded-[2rem] shadow-xl shadow-pink-200/50 overflow-hidden flex flex-col max-h-[85vh]">
              <div className="p-6 sm:p-8 border-b border-pink-50 flex justify-between items-start shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-pink-900 mb-3 leading-tight flex items-center gap-2 flex-wrap">
                    {note.title}
                    {onMagicClick && (
                      <button
                        onClick={() => onMagicClick(note.title)}
                        className="p-1.5 bg-pink-100 text-pink-500 hover:bg-pink-200 hover:text-pink-600 rounded-full transition-colors shadow-sm"
                        title="Lihat Penjelasan Bunpou"
                      >
                        <Wand2 size={18} />
                      </button>
                    )}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="bg-pink-500 text-white px-3 py-1 rounded-full font-bold shadow-sm">
                      {note.name || 'Anonymous'}
                    </span>
                    <span className="text-pink-400 opacity-70">•</span>
                    <span className="text-pink-500">{format(new Date(note.created_at), 'MMM d, yyyy - HH:mm')}</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-pink-400 hover:bg-pink-50 rounded-full transition-colors shrink-0 ml-4"
                  title="Tutup"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 sm:p-8 overflow-y-auto">
                <p className="text-pink-800 whitespace-pre-wrap leading-relaxed text-lg">
                  {note.note}
                </p>
                
                {note.note2 && (
                  <div className="mt-6 pt-6 border-t border-pink-100">
                    <h3 className="text-sm font-bold text-pink-500 mb-2 uppercase tracking-wider">Catatan Lain</h3>
                    <p className="text-pink-700/90 whitespace-pre-wrap leading-relaxed">
                      {note.note2}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
