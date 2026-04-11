import { useEffect, useState } from 'react';
import { getBunpouExplanation } from '../lib/studyService';
import { Sparkles, ArrowLeft, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface BunpouExplanationProps {
  bunpou: string;
  onBack: () => void;
}

export function BunpouExplanation({ bunpou, onBack }: BunpouExplanationProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExplanation = async () => {
      setIsLoading(true);
      const text = await getBunpouExplanation(bunpou);
      setExplanation(text);
      setIsLoading(false);
    };
    
    fetchExplanation();
  }, [bunpou]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm border border-pink-100 text-pink-500 hover:bg-pink-50 transition-colors"
          title="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-pink-900 flex items-center gap-2">
          <BookOpen className="text-pink-400" />
          Penjelasan: {bunpou}
        </h2>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-pink-100 min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full py-20 text-pink-300">
            <Sparkles className="animate-spin mb-4" size={32} />
            <p className="font-bold animate-pulse">Mencari penjelasan di buku sihir...</p>
          </div>
        ) : explanation ? (
          <div className="prose prose-pink max-w-none">
            <p className="text-pink-800 whitespace-pre-wrap leading-relaxed text-lg">
              {explanation}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-20 text-center">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-xl font-bold text-pink-900 mb-2">Penjelasan tidak ditemukan</h3>
            <p className="text-pink-600">
              Maaf, tidak ada penjelasan untuk "{bunpou}" di database tabel study.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
