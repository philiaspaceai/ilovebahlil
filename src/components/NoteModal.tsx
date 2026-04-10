import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Note } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<Note, 'id' | 'created_at'>) => Promise<void>;
  initialData?: Note | null;
}

export function NoteModal({ isOpen, onClose, onSave, initialData }: NoteModalProps) {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [noteText, setNoteText] = useState('');
  const [note2Text, setNote2Text] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
      setName(initialData?.name || '');
      setNoteText(initialData?.note || '');
      setNote2Text(initialData?.note2 || '');
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !noteText.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        title: title.trim(),
        name: name.trim() || 'Anonymous',
        note: noteText.trim(),
        note2: note2Text.trim(),
      });
      onClose();
    } catch (error) {
      console.error('Failed to save note:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-4"
          >
            <div className="bg-white rounded-[2rem] shadow-xl shadow-pink-200/50 overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-pink-900">
                    {initialData ? 'Edit Note 🌸' : 'New Note ✨'}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 text-pink-400 hover:bg-pink-50 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-pink-700 mb-1">Judul</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="My awesome note..."
                      className="w-full px-4 py-3 rounded-2xl bg-pink-50 border-none text-pink-900 placeholder:text-pink-300 focus:ring-2 focus:ring-pink-400 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-pink-700 mb-1">Nama Pembuat</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name..."
                      className="w-full px-4 py-3 rounded-2xl bg-pink-50 border-none text-pink-900 placeholder:text-pink-300 focus:ring-2 focus:ring-pink-400 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-pink-700 mb-1">Isi Note</label>
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Write something cute..."
                      rows={5}
                      className="w-full px-4 py-3 rounded-2xl bg-pink-50 border-none text-pink-900 placeholder:text-pink-300 focus:ring-2 focus:ring-pink-400 outline-none transition-all resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-pink-700 mb-1">Catatan Lain (Opsional)</label>
                    <textarea
                      value={note2Text}
                      onChange={(e) => setNote2Text(e.target.value)}
                      placeholder="Tambahan catatan..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-2xl bg-pink-50 border-none text-pink-900 placeholder:text-pink-300 focus:ring-2 focus:ring-pink-400 outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || !title.trim() || !noteText.trim()}
                      className="w-full py-4 rounded-2xl bg-pink-400 hover:bg-pink-500 text-white font-bold text-lg shadow-md shadow-pink-200 transition-all disabled:opacity-50 disabled:hover:bg-pink-400"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Note 💖'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
