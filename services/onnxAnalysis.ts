/**
 * ONNX-based Semantic Similarity Analysis
 * Uses local sentence-transformer (all-MiniLM-L6-v2) via onnxruntime-web
 * to compute semantic similarity between text windows.
 */
import { Match, Token } from '../types';
import { embed, cosineSimilarity, loadModel, getStatus } from './embeddingService';

// Simple word tokenizer that produces Token[] compatible with the rest of the app
function simpleTokenize(text: string): Token[] {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  let pos = 0;
  return words.map((w, i) => {
    const start = text.indexOf(w, pos);
    pos = start + w.length;
    return {
      text: w,
      normalized: w.toLowerCase(),
      start,
      end: pos,
      type: 'mixed' as const,
      index: i,
    };
  });
}

export interface OnnxAnalysisProgress {
  phase: 'model' | 'embedding-alpha' | 'embedding-beta' | 'comparing';
  current: number;
  total: number;
  percent: number;
}

/**
 * Run ONNX-based semantic similarity analysis (async).
 * Segments both texts into overlapping windows, embeds each window,
 * then computes pairwise cosine similarity.
 */
export async function runOnnxAnalysis(
  textA: string,
  textB: string,
  windowSize: number,
  threshold: number,
  onProgress?: (p: OnnxAnalysisProgress) => void,
): Promise<{ tokensA: Token[]; tokensB: Token[]; matches: Match[] }> {
  // 1. Ensure model is loaded
  if (getStatus() !== 'ready') {
    onProgress?.({ phase: 'model', current: 0, total: 1, percent: 0 });
    await loadModel((p) => {
      onProgress?.({ phase: 'model', current: p, total: 100, percent: p });
    });
  }

  const tokensA = simpleTokenize(textA);
  const tokensB = simpleTokenize(textB);

  // 2. Segment texts into windows
  const stride = Math.max(1, Math.floor(windowSize / 2));

  const segmentsA: { phrase: string; position: number; tokens: Token[] }[] = [];
  for (let i = 0; i <= tokensA.length - windowSize; i += stride) {
    const slice = tokensA.slice(i, i + windowSize);
    segmentsA.push({
      phrase: slice.map(t => t.text).join(' '),
      position: i,
      tokens: slice,
    });
  }
  if (segmentsA.length === 0 && tokensA.length > 0) {
    segmentsA.push({ phrase: tokensA.map(t => t.text).join(' '), position: 0, tokens: tokensA });
  }

  const segmentsB: { phrase: string; position: number; tokens: Token[] }[] = [];
  for (let i = 0; i <= tokensB.length - windowSize; i += stride) {
    const slice = tokensB.slice(i, i + windowSize);
    segmentsB.push({
      phrase: slice.map(t => t.text).join(' '),
      position: i,
      tokens: slice,
    });
  }
  if (segmentsB.length === 0 && tokensB.length > 0) {
    segmentsB.push({ phrase: tokensB.map(t => t.text).join(' '), position: 0, tokens: tokensB });
  }

  // 3. Compute embeddings for Witness α segments
  const embA: Float32Array[] = [];
  for (let i = 0; i < segmentsA.length; i++) {
    embA.push(await embed(segmentsA[i].phrase));
    onProgress?.({
      phase: 'embedding-alpha',
      current: i + 1,
      total: segmentsA.length,
      percent: Math.round(((i + 1) / segmentsA.length) * 100),
    });
  }

  // 4. Compute embeddings for Witness β segments
  const embB: Float32Array[] = [];
  for (let i = 0; i < segmentsB.length; i++) {
    embB.push(await embed(segmentsB[i].phrase));
    onProgress?.({
      phase: 'embedding-beta',
      current: i + 1,
      total: segmentsB.length,
      percent: Math.round(((i + 1) / segmentsB.length) * 100),
    });
  }

  // 5. Pairwise cosine similarity → matches
  const matches: Match[] = [];
  const totalComparisons = segmentsA.length * segmentsB.length;
  let compDone = 0;

  for (let i = 0; i < segmentsA.length; i++) {
    for (let j = 0; j < segmentsB.length; j++) {
      const sim = cosineSimilarity(embA[i], embB[j]) * 100; // 0–100 scale
      if (sim >= threshold) {
        matches.push({
          sourceIndex: segmentsA[i].position,
          targetIndex: segmentsB[j].position,
          sourcePhrase: segmentsA[i].phrase,
          targetPhrase: segmentsB[j].phrase,
          similarity: sim,
          sourcePosition: segmentsA[i].position,
          targetPosition: segmentsB[j].position,
          length: windowSize,
        });
      }
      compDone++;
      if (compDone % 100 === 0) {
        onProgress?.({
          phase: 'comparing',
          current: compDone,
          total: totalComparisons,
          percent: Math.round((compDone / totalComparisons) * 100),
        });
      }
    }
  }

  // Deduplicate overlapping matches — keep highest similarity per source region
  matches.sort((a, b) => b.similarity - a.similarity);

  return { tokensA, tokensB, matches };
}
