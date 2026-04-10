import { AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm }: DeleteConfirmModalProps) {
  const [step, setStep] = useState<1 | 2>(1);

  // Reset step to 1 whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-rose-900/20 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-50 p-4"
          >
            <div className="bg-white rounded-[2rem] shadow-xl shadow-rose-200/50 overflow-hidden">
              <div className="p-6 sm:p-8 text-center">
                <div className="mx-auto bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center text-rose-500 mb-4">
                  <AlertTriangle size={32} />
                </div>
                
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <h2 className="text-xl font-bold text-rose-900 mb-2">
                      Hapus Note? 🥺
                    </h2>
                    <p className="text-rose-700/80 mb-6 text-sm">
                      Apakah kamu yakin ingin menghapus note imut ini?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => setStep(2)}
                        className="flex-1 py-3 rounded-2xl bg-rose-400 hover:bg-rose-500 text-white font-bold shadow-md shadow-rose-200 transition-all"
                      >
                        Ya, Hapus
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <h2 className="text-xl font-bold text-rose-900 mb-2">
                      Yakin 100%?! 😭
                    </h2>
                    <p className="text-rose-700/80 mb-6 text-sm">
                      Note ini akan hilang selamanya dan tidak bisa dikembalikan lho!
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => {
                          onConfirm();
                          onClose();
                        }}
                        className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-200 transition-all"
                      >
                        Tetap Hapus
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
