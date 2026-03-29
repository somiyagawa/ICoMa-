/**
 * ONNX Embedding Service — local sentence-transformer inference via @huggingface/transformers.
 * Uses onnxruntime-web under the hood for browser-side ML.
 *
 * Model: Xenova/all-MiniLM-L6-v2 (22 MB ONNX, 384-dim embeddings)
 * Loaded on demand, cached in browser after first fetch.
 */

type Pipeline = any; // Transformers.js pipeline type

let pipeline: Pipeline | null = null;
let loading = false;
let loadError: string | null = null;

export type EmbeddingStatus = 'idle' | 'loading' | 'ready' | 'error';

const listeners: Set<(status: EmbeddingStatus, progress?: number) => void> = new Set();

function notify(status: EmbeddingStatus, progress?: number) {
  listeners.forEach(fn => fn(status, progress));
}

export function onStatusChange(fn: (status: EmbeddingStatus, progress?: number) => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

export function getStatus(): EmbeddingStatus {
  if (loadError) return 'error';
  if (pipeline) return 'ready';
  if (loading) return 'loading';
  return 'idle';
}

export function getError(): string | null {
  return loadError;
}

/**
 * Load the sentence-transformer model. Call once; subsequent calls are no-ops.
 * Progress callback receives 0–100.
 */
export async function loadModel(onProgress?: (p: number) => void): Promise<void> {
  if (pipeline) return;
  if (loading) return;

  loading = true;
  loadError = null;
  notify('loading', 0);

  try {
    // Dynamic import to avoid bundling if not used
    const { pipeline: createPipeline, env } = await import('@huggingface/transformers');

    // Use WebAssembly backend (onnxruntime-web)
    env.backends.onnx.wasm.proxy = false;

    pipeline = await createPipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
      {
        progress_callback: (data: any) => {
          if (data.progress !== undefined) {
            const p = Math.round(data.progress);
            notify('loading', p);
            onProgress?.(p);
          }
        },
      }
    );

    loading = false;
    notify('ready');
  } catch (err: any) {
    loading = false;
    loadError = err?.message || 'Failed to load embedding model';
    notify('error');
    throw err;
  }
}

/**
 * Compute embedding for a single text string.
 * Returns Float32Array of 384 dimensions.
 */
export async function embed(text: string): Promise<Float32Array> {
  if (!pipeline) throw new Error('Model not loaded. Call loadModel() first.');

  const output = await pipeline(text, { pooling: 'mean', normalize: true });
  return output.data as Float32Array;
}

/**
 * Compute embeddings for multiple texts in batch.
 */
export async function embedBatch(texts: string[]): Promise<Float32Array[]> {
  const results: Float32Array[] = [];
  for (const t of texts) {
    results.push(await embed(t));
  }
  return results;
}

/**
 * Cosine similarity between two vectors.
 */
export function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Segment text into overlapping windows of `windowSize` words.
 */
export function segmentText(text: string, windowSize: number, stride?: number): { segment: string; position: number }[] {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const step = stride ?? Math.max(1, Math.floor(windowSize / 2));
  const segments: { segment: string; position: number }[] = [];

  for (let i = 0; i <= words.length - windowSize; i += step) {
    segments.push({
      segment: words.slice(i, i + windowSize).join(' '),
      position: i,
    });
  }

  // If text is shorter than windowSize, use the whole text
  if (segments.length === 0 && words.length > 0) {
    segments.push({ segment: words.join(' '), position: 0 });
  }

  return segments;
}
