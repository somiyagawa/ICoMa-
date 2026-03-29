export interface Token {
  text: string;
  normalized: string;
  start: number;
  end: number;
  type: 'coptic' | 'greek' | 'latin' | 'number' | 'mixed';
  index: number;
}

export interface Alignment {
  sourceIndex: number;
  targetIndex: number;
  similarity: number;
  sourceText: string;
  targetText: string;
}

export interface Match {
  sourceIndex: number;
  targetIndex: number;
  sourcePhrase: string;
  targetPhrase: string;
  similarity: number;
  sourcePosition: number; // Token index start
  targetPosition: number; // Token index start
  length?: number; // Number of tokens in the match (crucial for SW)
}

// Renamed 'passim' -> 'char-ngram', 'tracer' -> 'word-ngram'
export type AlgorithmType = 'char-ngram' | 'word-ngram' | 'jaccard' | 'levenshtein' | 'coptic-aware' | 'smith-waterman' | 'fasttext' | 'word2vec';
export type ScriptMode = 'auto' | 'coptic' | 'mixed' | 'latin';

export interface AnalysisConfig {
  windowSize: number;
  threshold: number;
  algorithm: AlgorithmType;
  scriptMode: ScriptMode;
}

export interface AnalysisStats {
  totalAlignments: number;
  meanSimilarity: number;
  coverage: number;
  uniqueNgrams: number;
}

export interface AnalysisResult {
  tokensA: Token[];
  tokensB: Token[];
  matches: Match[];
  alignments: Alignment[];
  stats: AnalysisStats;
}