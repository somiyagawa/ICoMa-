import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Token, Alignment, Match } from '../types';

interface ParallelViewerProps {
  tokensA: Token[];
  tokensB: Token[];
  alignments: Alignment[];
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  selectedMatch: Match | null;
  witnessAlphaName?: string;
  witnessBetaName?: string;
}

const ParallelViewer: React.FC<ParallelViewerProps> = ({
  tokensA,
  tokensB,
  alignments,
  matches,
  onSelectMatch,
  selectedMatch,
  witnessAlphaName = 'Source Text',
  witnessBetaName = 'Target Text'
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<{ side: 'A' | 'B', index: number } | null>(null);
  const containerARef = useRef<HTMLDivElement>(null);
  const containerBRef = useRef<HTMLDivElement>(null);

  // Sync scroll and centering logic for large texts
  useEffect(() => {
    if (selectedMatch) {
      const scrollContainerToToken = (container: HTMLDivElement | null, tokenIndex: number) => {
        if (!container) return;
        const tokenEl = container.querySelector(`[data-token-index="${tokenIndex}"]`) as HTMLElement;
        if (tokenEl) {
          const containerRect = container.getBoundingClientRect();
          const tokenRect = tokenEl.getBoundingClientRect();
          const offset = tokenRect.top - containerRect.top;
          container.scrollTo({
            top: container.scrollTop + offset - (container.clientHeight / 2) + (tokenEl.clientHeight / 2),
            behavior: 'smooth'
          });
        }
      };
      scrollContainerToToken(containerARef.current, selectedMatch.sourcePosition);
      scrollContainerToToken(containerBRef.current, selectedMatch.targetPosition);
    }
  }, [selectedMatch]);

  const alignmentMapA = useMemo(() => {
    const map = new Map<number, Alignment[]>();
    alignments.forEach(a => {
      if (!map.has(a.sourceIndex)) map.set(a.sourceIndex, []);
      map.get(a.sourceIndex)?.push(a);
    });
    return map;
  }, [alignments]);

  const alignmentMapB = useMemo(() => {
    const map = new Map<number, Alignment[]>();
    alignments.forEach(a => {
      if (!map.has(a.targetIndex)) map.set(a.targetIndex, []);
      map.get(a.targetIndex)?.push(a);
    });
    return map;
  }, [alignments]);

  const handleTokenClick = (index: number, side: 'A' | 'B') => {
    const candidates = matches.filter(m => {
      const start = side === 'A' ? m.sourcePosition : m.targetPosition;
      const len = m.length || 1;
      return index >= start && index < start + len;
    });
    if (candidates.length > 0) {
      const bestMatch = candidates.reduce((prev, curr) => prev.similarity > curr.similarity ? prev : curr);
      onSelectMatch(bestMatch);
    }
  };

  const getStyle = (tokenIdx: number, side: 'A' | 'B') => {
    if (selectedMatch) {
       const len = selectedMatch.length || 1;
       const start = side === 'A' ? selectedMatch.sourcePosition : selectedMatch.targetPosition;
       if (tokenIdx >= start && tokenIdx < start + len) {
         return "bg-academic-gold text-white px-0.5 rounded shadow-md border-b-[3px] border-academic-red scale-105 z-10 font-bold ring-2 ring-academic-red/30 ring-offset-1";
       }
    }
    const map = side === 'A' ? alignmentMapA : alignmentMapB;
    const currentAlignments = map.get(tokenIdx);
    if (!currentAlignments || currentAlignments.length === 0) return 'border-transparent text-gray-700/70 hover:text-gray-900';

    const bestAlignment = currentAlignments.reduce((prev, curr) => prev.similarity > curr.similarity ? prev : curr);
    let isConnected = false;
    if (hoveredIdx) {
      if (hoveredIdx.side === side && hoveredIdx.index === tokenIdx) isConnected = true;
      else if (hoveredIdx.side !== side) {
        const otherMap = hoveredIdx.side === 'A' ? alignmentMapA : alignmentMapB;
        if (otherMap.get(hoveredIdx.index)?.some(m => (side === 'A' ? m.sourceIndex : m.targetIndex) === tokenIdx)) isConnected = true;
      }
    }

    const baseClass = "cursor-pointer transition-all duration-200 border-b-[2px] rounded-t-sm px-0.5 ";
    const connectionClass = isConnected ? "bg-academic-gold/40 scale-110 font-bold z-20 " : "";
    let scoreClass = bestAlignment.similarity >= 98 ? "border-indigo-900/60 bg-indigo-50/50" : (bestAlignment.similarity >= 80 ? "border-blue-500/60 bg-blue-50/50" : "border-gray-400/40 border-dotted");
    return baseClass + connectionClass + scoreClass;
  };

  const renderMinimap = (side: 'A' | 'B', tokens: Token[]) => {
    if (tokens.length === 0) return null;
    return (
      <div className="w-2.5 bg-gray-100 relative h-full group-hover:w-5 transition-all overflow-hidden border-r border-gray-200 cursor-crosshair">
        {matches.map((m, idx) => {
          const pos = side === 'A' ? m.sourcePosition : m.targetPosition;
          const topPercent = (pos / tokens.length) * 100;
          const heightPercent = Math.max(0.7, ((m.length || 1) / tokens.length) * 100);
          const isSelected = selectedMatch === m;
          return (
            <div 
              key={idx}
              className={`absolute left-0 w-full transition-all ${isSelected ? 'bg-academic-red z-30 scale-x-125 shadow-sm' : 'bg-academic-gold/40 hover:bg-academic-gold hover:z-20'}`}
              style={{ top: `${topPercent}%`, height: `${heightPercent}%` }}
              onClick={() => onSelectMatch(m)}
              title={`Jump to cluster (${m.similarity.toFixed(0)}%)`}
            />
          );
        })}
      </div>
    );
  };

  const renderTokens = (tokens: Token[], side: 'A' | 'B') => {
    let lastPos = 0;
    return (
      <div className="font-coptic text-[15px] leading-relaxed text-justify p-1">
        {tokens.map((token, i) => {
          const spacing = token.start > lastPos ? " " : "";
          lastPos = token.end;
          return (
            <React.Fragment key={i}>
              {spacing}
              <span
                data-token-index={i}
                className={`inline-block relative select-none ${getStyle(i, side)}`}
                onMouseEnter={() => setHoveredIdx({ side, index: i })}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => handleTokenClick(i, side)}
              >
                {token.text}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="flex-1 grid grid-cols-2 overflow-hidden h-full">
        {/* Witness A Column */}
        <div className="flex border-r border-gray-100 overflow-hidden h-full group">
          {renderMinimap('A', tokensA)}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-academic-paper px-4 py-3 border-b border-gray-200 shrink-0 flex justify-between items-center">
              <span className="font-bold text-[10px] tracking-widest flex items-center gap-2" style={{color:'#2563eb'}}>
                <span className="w-1.5 h-1.5 rounded-full" style={{background:'#2563eb'}}></span>
                {witnessAlphaName}
              </span>
              <span className="text-gray-400 font-mono text-[9px] bg-white px-2 py-0.5 border border-gray-100 rounded-full">{tokensA.length} Tokens</span>
            </div>
            <div ref={containerARef} className="overflow-y-auto flex-1 p-8 bg-white custom-scrollbar">
              {renderTokens(tokensA, 'A')}
            </div>
          </div>
        </div>

        {/* Target Text Column */}
        <div className="flex overflow-hidden h-full group">
          {renderMinimap('B', tokensB)}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-academic-paper px-4 py-3 border-b border-gray-200 shrink-0 flex justify-between items-center">
              <span className="font-bold text-[10px] tracking-widest flex items-center gap-2" style={{color:'#d97706'}}>
                <span className="w-1.5 h-1.5 rounded-full" style={{background:'#d97706'}}></span>
                {witnessBetaName}
              </span>
              <span className="text-gray-400 font-mono text-[9px] bg-white px-2 py-0.5 border border-gray-100 rounded-full">{tokensB.length} Tokens</span>
            </div>
            <div ref={containerBRef} className="overflow-y-auto flex-1 p-8 bg-white custom-scrollbar">
              {renderTokens(tokensB, 'B')}
            </div>
          </div>
        </div>
      </div>
      
      {/* Dynamic Status Footer */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 min-h-[56px] flex items-center justify-center shadow-inner">
        {selectedMatch ? (
          <div className="flex items-center gap-6 text-xs w-full">
            <div className="flex items-center gap-2 shrink-0">
               <span className="px-2 py-1 bg-academic-red text-white font-bold rounded-sm shadow-md animate-pulse-slow tracking-wider">{selectedMatch.similarity.toFixed(1)}% MATCH</span>
               <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">{witnessAlphaName.charAt(0)}:{selectedMatch.sourcePosition} → {witnessBetaName.charAt(0)}:{selectedMatch.targetPosition}</span>
            </div>
            <div className="truncate font-coptic text-academic-blue flex-1 bg-white px-4 py-1.5 border border-gray-200 rounded-sm italic shadow-sm relative overflow-hidden group">
               <div className="absolute left-0 top-0 w-1 h-full bg-academic-gold"></div>
               "{selectedMatch.sourcePhrase}"
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-8 text-[10px] text-gray-400 font-sans font-medium uppercase tracking-[0.2em]">
            <span>1. Scroll to browse</span>
            <span className="opacity-40">•</span>
            <span>2. Click colored strips to jump</span>
            <span className="opacity-40">•</span>
            <span>3. Hover words to reveal links</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParallelViewer;