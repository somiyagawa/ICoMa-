import React from 'react';
import { Match } from '../types';

interface MatchDetailModalProps {
  match: Match | null;
  onClose: () => void;
}

const MatchDetailModal: React.FC<MatchDetailModalProps> = ({ match, onClose }) => {
  if (!match) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-3xl w-full mx-4 border-t-4 border-academic-gold overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-academic-paper px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-academic-blue font-bold text-lg">Parallel Passage Detail</h3>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Similarity Index: <span className="font-mono text-academic-red font-bold text-base">{match.similarity.toFixed(1)}%</span></p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-academic-red transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-academic-cream">
          {/* Witness α */}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase mb-2 border-b border-gray-200 pb-1">
              Witness α (Primary) <span className="font-mono ml-2">Pos: {match.sourcePosition}</span>
            </span>
            <div className="bg-white p-4 rounded border border-gray-200 shadow-sm h-full">
              <p className="font-coptic text-lg leading-relaxed text-academic-blue">
                {match.sourcePhrase}
              </p>
            </div>
          </div>

          {/* Witness β */}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase mb-2 border-b border-gray-200 pb-1">
              Witness β (Comparandum) <span className="font-mono ml-2">Pos: {match.targetPosition}</span>
            </span>
            <div className="bg-white p-4 rounded border border-gray-200 shadow-sm h-full">
              <p className="font-coptic text-lg leading-relaxed text-academic-blue">
                {match.targetPhrase}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-right">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-600 text-sm font-medium rounded hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailModal;