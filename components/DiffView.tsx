import React, { useMemo } from 'react';

/**
 * DiffView — word/character-level inline diff for source vs target phrases.
 * Uses LCS (Longest Common Subsequence) to compute a minimal diff.
 * Shows: common text as-is, deletions (in Source Text only) with red background,
 * insertions (in Target Text only) with green background.
 */

type DiffSegment = { type: 'equal' | 'delete' | 'insert'; text: string };

/** Tokenize text into words/punctuation preserving whitespace */
function tokenize(text: string): string[] {
  // Split into tokens: word chars (including Unicode), or individual punctuation/space
  const tokens: string[] = [];
  // Use a regex that captures sequences of word-like characters or individual non-word characters
  const re = /[\p{L}\p{N}\p{M}]+|[^\p{L}\p{N}\p{M}]/gu;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    tokens.push(match[0]);
  }
  return tokens;
}

/** Compute LCS table for two token arrays */
function lcsTable(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp;
}

/** Backtrack LCS table to produce diff segments */
function computeDiff(source: string, target: string): DiffSegment[] {
  const a = tokenize(source);
  const b = tokenize(target);
  const dp = lcsTable(a, b);

  const segments: DiffSegment[] = [];
  let i = a.length;
  let j = b.length;

  // Backtrack from bottom-right
  const rawOps: DiffSegment[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      rawOps.push({ type: 'equal', text: a[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rawOps.push({ type: 'insert', text: b[j - 1] });
      j--;
    } else {
      rawOps.push({ type: 'delete', text: a[i - 1] });
      i--;
    }
  }

  rawOps.reverse();

  // Merge consecutive segments of the same type
  for (const op of rawOps) {
    if (segments.length > 0 && segments[segments.length - 1].type === op.type) {
      segments[segments.length - 1].text += op.text;
    } else {
      segments.push({ ...op });
    }
  }

  return segments;
}

interface DiffViewProps {
  source: string;
  target: string;
  similarity: number;
  fontSize?: number;
  witnessAlphaName?: string;
  witnessBetaName?: string;
}

const DiffView: React.FC<DiffViewProps> = ({
  source,
  target,
  similarity,
  fontSize = 11,
  witnessAlphaName = 'Source Text',
  witnessBetaName = 'Target Text'
}) => {
  const diff = useMemo(() => computeDiff(source, target), [source, target]);

  // Truncate long witness names for compact display (max 12 chars)
  const shortAlpha = witnessAlphaName.length > 12 ? witnessAlphaName.slice(0, 11) + '…' : witnessAlphaName;
  const shortBeta = witnessBetaName.length > 12 ? witnessBetaName.slice(0, 11) + '…' : witnessBetaName;

  // For 100% matches, show both texts clearly with exact match label
  if (similarity >= 99.9) {
    return (
      <div style={{ fontSize: `${fontSize}px` }} className="leading-relaxed font-coptic">
        <div className="mb-1">
          <span className="text-[8px] font-bold tracking-wider mr-1" style={{ color: '#2563eb' }} title={witnessAlphaName}>{shortAlpha}</span>
          <span className="text-academic-blue italic">"{source}"</span>
        </div>
        <div className="mb-1">
          <span className="text-[8px] font-bold tracking-wider mr-1" style={{ color: '#d97706' }} title={witnessBetaName}>{shortBeta}</span>
          <span className="font-coptic italic" style={{ color: '#92400e' }}>"{target}"</span>
        </div>
        <div className="text-[8px] font-bold uppercase tracking-wider" style={{ color: '#1e3a8a' }}>= Exact Match</div>
      </div>
    );
  }

  return (
    <div style={{ fontSize: `${fontSize}px` }} className="leading-relaxed">
      {/* Source line */}
      <div className="mb-1.5">
        <span className="text-[8px] font-bold tracking-wider mr-1" style={{ color: '#2563eb' }} title={witnessAlphaName}>{shortAlpha}</span>
        <span className="font-coptic italic text-academic-blue">"{source}"</span>
      </div>
      {/* Target line */}
      <div className="mb-1.5">
        <span className="text-[8px] font-bold tracking-wider mr-1" style={{ color: '#d97706' }} title={witnessBetaName}>{shortBeta}</span>
        <span className="font-coptic italic" style={{ color: '#92400e' }}>"{target}"</span>
      </div>
      {/* Inline diff */}
      <div className="mt-1 pt-1 border-t border-gray-100">
        <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mr-1">Diff</span>
        <span className="font-coptic">
          {diff.map((seg, i) => {
            if (seg.type === 'equal') {
              return <span key={i} className="text-gray-700">{seg.text}</span>;
            }
            if (seg.type === 'delete') {
              return (
                <span
                  key={i}
                  style={{
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    textDecoration: 'line-through',
                    borderRadius: '2px',
                    padding: '0 1px',
                  }}
                  title={`Only in ${witnessAlphaName}`}
                >{seg.text}</span>
              );
            }
            // insert
            return (
              <span
                key={i}
                style={{
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  textDecoration: 'underline',
                  borderRadius: '2px',
                  padding: '0 1px',
                }}
                title={`Only in ${witnessBetaName}`}
              >{seg.text}</span>
            );
          })}
        </span>
      </div>
    </div>
  );
};

export default DiffView;
