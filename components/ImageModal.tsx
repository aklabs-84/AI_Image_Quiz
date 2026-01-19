
import React from 'react';
import { X } from './icons';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/98 animate-fade-in touch-none"
      onClick={onClose}
    >
        <style>{`
            @keyframes fade-in {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }
            .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }

            @keyframes scale-up {
                0% { transform: scale(0.97); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
            .animate-scale-up { animation: scale-up 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}</style>
      <button 
        className="absolute top-8 right-8 text-white/40 hover:text-white transition-all z-[100000] p-3 bg-white/5 hover:bg-white/10 rounded-full group"
        onClick={onClose}
        aria-label="Close image view"
      >
        <X className="w-8 h-8 md:w-12 md:h-12 group-hover:scale-110 transition-transform" />
      </button>
      <div 
        className="relative w-full h-full flex items-center justify-center p-6 md:p-12 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={imageUrl} 
          alt="Enlarged view" 
          className="max-w-full max-h-full object-contain rounded-lg shadow-[0_0_100px_rgba(168,85,247,0.15)] ring-1 ring-white/10" 
        />
      </div>
    </div>
  );
};

export default ImageModal;
