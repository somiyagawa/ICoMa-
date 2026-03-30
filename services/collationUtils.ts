import { Token, Match, Alignment, AlgorithmType, ScriptMode } from '../types';

// Unicode Ranges
const RANGES = {
  coptic: { start: 0x2C80, end: 0x2CFF },
  greek: { start: 0x0370, end: 0x03FF, extStart: 0x1F00, extEnd: 0x1FFF },
  copticEpact: { start: 0x102E0, end: 0x102FF },
  cjk: { start: 0x4E00, end: 0x9FFF },
  hiragana: { start: 0x3040, end: 0x309F },
  katakana: { start: 0x30A0, end: 0x30FF },
  hebrew: { start: 0x0590, end: 0x05FF },
  arabic: { start: 0x0600, end: 0x06FF },
  syriac: { start: 0x0700, end: 0x074F },
  ethiopic: { start: 0x1200, end: 0x137F },
  devanagari: { start: 0x0900, end: 0x097F }
};

const checkRange = (char: string, range: { start: number; end: number }) => {
  const code = char.charCodeAt(0);
  return code >= range.start && code <= range.end;
};

const isCoptic = (char: string): boolean => {
  return checkRange(char, RANGES.coptic) || checkRange(char, RANGES.copticEpact);
};

const isGreek = (char: string): boolean => {
  return checkRange(char, RANGES.greek) || 
         (char.charCodeAt(0) >= RANGES.greek.extStart && char.charCodeAt(0) <= RANGES.greek.extEnd);
};

const isCJK = (char: string): boolean => {
  return checkRange(char, RANGES.cjk) || checkRange(char, RANGES.hiragana) || checkRange(char, RANGES.katakana);
};

export const tokenize = (text: string, mode: ScriptMode = 'auto'): Token[] => {
  const normalizedText = text.normalize('NFC');
  let cjkCount = 0;
  for (const char of normalizedText) {
    if (isCJK(char)) cjkCount++;
  }
  const isPredominantlyCJK = cjkCount > normalizedText.length * 0.3;
  const tokens: Token[] = [];

  if (isPredominantlyCJK) {
    let index = 0;
    for (let i = 0; i < normalizedText.length; i++) {
      const char = normalizedText[i];
      if (!/\s/.test(char) && !/、|。|，|：|；|「|」/.test(char)) {
        tokens.push({
          text: char,
          normalized: char,
          start: i,
          end: i + 1,
          type: 'mixed', 
          index: index++
        });
      }
    }
  } else {
    const wordPattern = /[\p{L}\p{M}\p{N}]+/gu;
    let match;
    let index = 0;
    while ((match = wordPattern.exec(normalizedText)) !== null) {
      const txt = match[0];
      const firstChar = txt[0];
      let type: any = 'latin';
      if (isCoptic(firstChar)) type = 'coptic';
      else if (isGreek(firstChar)) type = 'greek';
      else if (checkRange(firstChar, RANGES.hebrew)) type = 'mixed';
      else if (checkRange(firstChar, RANGES.arabic)) type = 'mixed';
      else if (checkRange(firstChar, RANGES.syriac)) type = 'mixed';
      else if (checkRange(firstChar, RANGES.ethiopic)) type = 'mixed';
      else if (checkRange(firstChar, RANGES.devanagari)) type = 'mixed';
      else if (/\d/.test(firstChar)) type = 'number';

      tokens.push({
        text: txt,
        normalized: txt.toLowerCase(),
        start: match.index,
        end: match.index + txt.length,
        type: type,
        index: index++
      });
    }
  }
  return tokens;
};

/**
 * Levenshtein distance with optional early-exit when distance exceeds maxDist.
 * Avoids unnecessary computation for pairs that clearly won't meet the threshold.
 */
const levenshteinDistance = (str1: string, str2: string, maxDist?: number): number => {
  if (str1 === str2) return 0;
  const len1 = str1.length;
  const len2 = str2.length;
  if (len1 === 0) return len2;
  if (len2 === 0) return len1;
  // If length difference alone exceeds maxDist, skip
  if (maxDist !== undefined && Math.abs(len1 - len2) > maxDist) return maxDist + 1;

  // Ensure str1 is shorter (less memory for row arrays)
  if (len1 > len2) return levenshteinDistance(str2, str1, maxDist);

  let v0 = new Int32Array(len2 + 1);
  let v1 = new Int32Array(len2 + 1);
  for (let i = 0; i <= len2; i++) v0[i] = i;

  for (let i = 0; i < len1; i++) {
    v1[0] = i + 1;
    let rowMin = v1[0]; // track row minimum for early exit
    const c1 = str1.charCodeAt(i);
    for (let j = 0; j < len2; j++) {
      const cost = c1 === str2.charCodeAt(j) ? 0 : 1;
      const val = v1[j] + 1;
      const val2 = v0[j + 1] + 1;
      const val3 = v0[j] + cost;
      v1[j + 1] = val < val2 ? (val < val3 ? val : val3) : (val2 < val3 ? val2 : val3);
      if (v1[j + 1] < rowMin) rowMin = v1[j + 1];
    }
    // Early exit: if every cell in this row exceeds maxDist, no point continuing
    if (maxDist !== undefined && rowMin > maxDist) return maxDist + 1;
    const temp = v0; v0 = v1; v1 = temp;
  }
  return v0[len2];
};

const calculateCopticSimilarity = (s1: string, s2: string): number => {
  const normalize = (s: string) => s.toLowerCase()
    .replace(/ⲛ̄/g, 'ⲛ').replace(/ⲙ̄/g, 'ⲙ')
    .replace(/[\u0300-\u036F\u0591-\u05C7\u064B-\u0652\u0730-\u074A]/g, '') 
    .replace(/[άἀἁἂἃἄἅἆἇὰάᾀᾁᾂᾃᾄᾅᾆᾇᾰᾱᾲᾳᾴᾶᾷΆἈἉἊἋἌἍἎἏᾈᾉᾊᾋᾌᾍᾎᾏᾸᾹᾺΆᾼ]/g, 'α')
    .replace(/[έἐἑἒἓἔἕὲέῈΈΈἘἙἚἛἜἝ]/g, 'ε')
    .replace(/[ήἠἡἢἣἤἥἦἧὴήᾐᾑᾒᾓᾔᾕᾖᾗῂῃῄῆῇΉἨἩἪἫἬἭἮἯᾘᾙᾚᾛᾜᾝᾞᾟῊΉῌ]/g, 'η')
    .replace(/[ίἰἱἲἳἴἵἶἷὶίῐῑῒΐῖῗΊἸἹἺἻἼἽἾἿῘῙῚΊ]/g, 'ι')
    .replace(/[όὀὁὂὃὄὅὸόΌὈὉὊὋὌὍῸΌ]/g, 'ο')
    .replace(/[ύὐὑὒὓὔὕὖὗὺύῠῡῢΰῦῧΎὙὛὝὟῨῩῪΎ]/g, 'υ')
    .replace(/[ώὠὡὢὣὤὥὦὧὼώᾠᾡᾢᾣᾤᾥᾦᾧῲῳῴῶῷΏὨὩὪὫὬὭὮὯᾨᾩᾪᾫᾬᾭᾮᾯΏῼ]/g, 'ω')
    .normalize('NFC');

  const n1 = normalize(s1);
  const n2 = normalize(s2);
  if (n1 === n2) return 100;
  const maxLen = Math.max(n1.length, n2.length);
  if (maxLen === 0) return 100;
  const dist = levenshteinDistance(n1, n2);
  return (1 - dist / maxLen) * 100;
};

/**
 * Threshold-aware similarity: returns similarity only if it can meet minSim.
 * Uses early-exit Levenshtein to skip expensive computation for unlikely matches.
 */
const quickSimilarity = (s1: string, s2: string, minSim: number): number => {
  if (s1 === s2) return 100;
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 100;
  // Max edit distance allowed to meet threshold
  const maxDist = Math.floor(maxLen * (1 - minSim / 100));
  if (Math.abs(s1.length - s2.length) > maxDist) return 0;
  const dist = levenshteinDistance(s1, s2, maxDist);
  if (dist > maxDist) return 0;
  return (1 - dist / maxLen) * 100;
};

const jaccard = (a: any[], b: any[]): number => {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : (intersection.size / union.size);
};

// MULTI-PEAK SMITH-WATERMAN
const runSmithWaterman = (tokensA: Token[], tokensB: Token[], threshold: number): Match[] => {
  const m = tokensA.length;
  const n = tokensB.length;
  if (m === 0 || n === 0) return [];

  const MATCH_SCORE = 3;
  const MISMATCH_SCORE = -1;
  const GAP_SCORE = -2;

  let matrix: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  const results: Match[] = [];

  // Compute full matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const sim = calculateCopticSimilarity(tokensA[i - 1].normalized, tokensB[j - 1].normalized);
      const score = sim >= 80 ? MATCH_SCORE : MISMATCH_SCORE;
      matrix[i][j] = Math.max(0, matrix[i - 1][j - 1] + score, matrix[i - 1][j] + GAP_SCORE, matrix[i][j - 1] + GAP_SCORE);
    }
  }

  // Iteratively find peaks to extract multiple local alignments
  while (true) {
    let maxVal = 0;
    let maxI = -1;
    let maxJ = -1;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (matrix[i][j] > maxVal) {
          maxVal = matrix[i][j];
          maxI = i;
          maxJ = j;
        }
      }
    }

    // If peak is too low, stop
    if (maxVal < 6) break; 

    // Traceback
    let i = maxI, j = maxJ;
    const pathA: number[] = [];
    const pathB: number[] = [];

    while (i > 0 && j > 0 && matrix[i][j] > 0) {
      const current = matrix[i][j];
      const sim = calculateCopticSimilarity(tokensA[i - 1].normalized, tokensB[j - 1].normalized);
      const score = sim >= 80 ? MATCH_SCORE : MISMATCH_SCORE;

      // Mark this cell as used (zero out) to prevent reusing it in next iteration
      matrix[i][j] = 0;

      if (current === matrix[i - 1][j - 1] + score || (sim >= 80 && current > 0)) {
        pathA.unshift(i - 1);
        pathB.unshift(j - 1);
        i--; j--;
      } else if (current === matrix[i - 1][j] + GAP_SCORE) {
        i--;
      } else {
        j--;
      }
    }

    if (pathA.length > 0) {
      const startA = pathA[0];
      const endA = pathA[pathA.length - 1];
      const startB = pathB[0];
      const endB = pathB[pathB.length - 1];
      const phraseA = tokensA.slice(startA, endA + 1).map(t => t.text).join(' ');
      const phraseB = tokensB.slice(startB, endB + 1).map(t => t.text).join(' ');
      const sim = calculateCopticSimilarity(phraseA, phraseB);
      
      if (sim >= threshold) {
        results.push({
          sourceIndex: startA,
          targetIndex: startB,
          sourcePhrase: phraseA,
          targetPhrase: phraseB,
          similarity: sim,
          sourcePosition: startA,
          targetPosition: startB,
          length: pathA.length
        });
      }
    }
  }

  return results;
};

// ── Pre-computation helpers ──────────────────────────────────────────

/** Pre-compute n-gram phrase data for sliding window — avoids repeated slice/map/join */
function precomputeWindowPhrases(tokens: Token[], n: number): { text: string; norm: string }[] {
  const count = tokens.length - n + 1;
  if (count <= 0) return [];
  const result = new Array(count);
  // Build first window
  let textParts: string[] = [];
  let normParts: string[] = [];
  for (let k = 0; k < n; k++) {
    textParts.push(tokens[k].text);
    normParts.push(tokens[k].normalized);
  }
  result[0] = { text: textParts.join(' '), norm: normParts.join('') };
  // Slide: drop first, add last (rebuild is cheap for small n)
  for (let i = 1; i < count; i++) {
    textParts.shift();
    textParts.push(tokens[i + n - 1].text);
    normParts.shift();
    normParts.push(tokens[i + n - 1].normalized);
    result[i] = { text: textParts.join(' '), norm: normParts.join('') };
  }
  return result;
}

/** Build inverted index: normalized word → list of token indices */
function buildWordIndex(tokens: Token[]): Map<string, number[]> {
  const idx = new Map<string, number[]>();
  for (let i = 0; i < tokens.length; i++) {
    const w = tokens[i].normalized;
    const list = idx.get(w);
    if (list) list.push(i);
    else idx.set(w, [i]);
  }
  return idx;
}

/** Simple hash of an n-gram window for fast pre-filtering */
function windowHash(tokens: Token[], start: number, n: number): string {
  // Use sorted unique normalized words as fingerprint
  const words: string[] = [];
  for (let k = 0; k < n; k++) words.push(tokens[start + k].normalized);
  return words.sort().join('\0');
}

/** Cosine similarity between two sparse frequency vectors */
function cosineSim(freqA: Record<string, number>, freqB: Record<string, number>): number {
  let dot = 0, nA = 0, nB = 0;
  for (const key in freqA) {
    const a = freqA[key];
    nA += a * a;
    if (key in freqB) dot += a * freqB[key];
  }
  for (const key in freqB) nB += freqB[key] * freqB[key];
  return (nA === 0 || nB === 0) ? 0 : (dot / (Math.sqrt(nA) * Math.sqrt(nB))) * 100;
}

// ── Main Analysis ────────────────────────────────────────────────────

export const runAnalysis = (
  textA: string,
  textB: string,
  config: { windowSize: number; threshold: number; algorithm: AlgorithmType; scriptMode: ScriptMode }
) => {
  const t0 = performance.now();
  const tokensA = tokenize(textA, config.scriptMode);
  const tokensB = tokenize(textB, config.scriptMode);
  let matches: Match[] = [];

  if (config.algorithm === 'smith-waterman') {
    matches = runSmithWaterman(tokensA, tokensB, config.threshold);
  } else if (config.algorithm === 'char-ngram') {
    const n = config.windowSize;
    // Pre-compute char n-gram phrases
    const phrasesA: string[] = [];
    const phrasesB: string[] = [];
    for (let i = 0; i <= tokensA.length - n; i++)
      phrasesA.push(tokensA.slice(i, i + n).map(t => t.text).join(''));
    for (let j = 0; j <= tokensB.length - n; j++)
      phrasesB.push(tokensB.slice(j, j + n).map(t => t.text).join(''));
    for (let i = 0; i < phrasesA.length; i++) {
      for (let j = 0; j < phrasesB.length; j++) {
        const sim = calculateCopticSimilarity(phrasesA[i], phrasesB[j]);
        if (sim >= config.threshold) {
          matches.push({ sourceIndex: i, targetIndex: j, sourcePhrase: phrasesA[i], targetPhrase: phrasesB[j], similarity: sim, sourcePosition: i, targetPosition: j, length: n });
        }
      }
    }
  } else {
    const n = config.windowSize;
    const threshold = config.threshold;

    // Pre-compute window phrase data (avoids repeated slice/map/join in inner loop)
    const windowsA = precomputeWindowPhrases(tokensA, n);
    const windowsB = precomputeWindowPhrases(tokensB, n);

    if (config.algorithm === 'levenshtein' || config.algorithm === 'coptic-aware') {
      // ── Hash-based pre-filter for Levenshtein/Coptic ──
      // For each window in B, build a hash → indices map
      // Then for each window in A, check if any B window shares ≥1 word
      // This dramatically reduces the number of expensive comparisons

      // Build inverted index: each unique word in B → which B-windows contain it
      const wordToB = new Map<string, Set<number>>();
      for (let j = 0; j < windowsB.length; j++) {
        for (let k = 0; k < n && (j + k) < tokensB.length; k++) {
          const w = tokensB[j + k].normalized;
          let s = wordToB.get(w);
          if (!s) { s = new Set(); wordToB.set(w, s); }
          s.add(j);
        }
      }

      for (let i = 0; i < windowsA.length; i++) {
        // Collect candidate B-windows that share at least one word with A-window
        const candidates = new Set<number>();
        for (let k = 0; k < n && (i + k) < tokensA.length; k++) {
          const indices = wordToB.get(tokensA[i + k].normalized);
          if (indices) {
            for (const j of indices) candidates.add(j);
          }
        }

        // Only compute expensive distance for candidates
        const normA = windowsA[i].norm;
        for (const j of candidates) {
          const normB = windowsB[j].norm;
          let sim: number;
          if (config.algorithm === 'coptic-aware') {
            sim = calculateCopticSimilarity(windowsA[i].text, windowsB[j].text);
          } else {
            sim = quickSimilarity(normA, normB, threshold);
          }
          if (sim >= threshold) {
            matches.push({ sourceIndex: i, targetIndex: j, sourcePhrase: windowsA[i].text, targetPhrase: windowsB[j].text, similarity: sim, sourcePosition: i, targetPosition: j, length: n });
          }
        }
      }
    } else if (config.algorithm === 'word-ngram' || config.algorithm === 'jaccard') {
      // For Jaccard-based: use sorted word fingerprint for fast exact-match filter
      const hashesB = new Map<string, number[]>();
      for (let j = 0; j < windowsB.length; j++) {
        const h = windowHash(tokensB, j, n);
        const list = hashesB.get(h);
        if (list) list.push(j); else hashesB.set(h, [j]);
      }

      for (let i = 0; i < windowsA.length; i++) {
        const hA = windowHash(tokensA, i, n);
        // Fast path: exact hash match = 100% Jaccard
        const exactMatches = hashesB.get(hA);
        if (exactMatches) {
          for (const j of exactMatches) {
            matches.push({ sourceIndex: i, targetIndex: j, sourcePhrase: windowsA[i].text, targetPhrase: windowsB[j].text, similarity: 100, sourcePosition: i, targetPosition: j, length: n });
          }
        }
        // For near-matches, still do the full comparison but only for B-windows
        // that share at least one word (inverted index approach)
        const wordSetA = new Set<string>();
        for (let k = 0; k < n; k++) wordSetA.add(tokensA[i + k].normalized);

        for (let j = 0; j < windowsB.length; j++) {
          if (exactMatches && exactMatches.includes(j)) continue;
          // Quick check: does B share any word with A?
          let shared = false;
          for (let k = 0; k < n; k++) {
            if (wordSetA.has(tokensB[j + k].normalized)) { shared = true; break; }
          }
          if (!shared) continue;

          let sim: number;
          if (config.algorithm === 'word-ngram') {
            const wordsA = Array.from(wordSetA);
            const wordsB: string[] = [];
            for (let k = 0; k < n; k++) wordsB.push(tokensB[j + k].normalized);
            sim = jaccard(wordsA, wordsB) * 100;
          } else {
            sim = jaccard(windowsA[i].text.split(''), windowsB[j].text.split('')) * 100;
          }
          if (sim >= threshold) {
            matches.push({ sourceIndex: i, targetIndex: j, sourcePhrase: windowsA[i].text, targetPhrase: windowsB[j].text, similarity: sim, sourcePosition: i, targetPosition: j, length: n });
          }
        }
      }
    } else if (config.algorithm === 'fasttext') {
      const getVector = (word: string) => {
        const freq: Record<string, number> = {};
        const padded = `<${word}>`;
        for (let len = 3; len <= 6; len++) {
          for (let i = 0; i <= padded.length - len; i++) {
            const ng = padded.slice(i, i + len);
            freq[ng] = (freq[ng] || 0) + 1;
          }
        }
        freq[word] = (freq[word] || 0) + 1;
        return freq;
      };
      const tokenVectorsA = tokensA.map(t => getVector(t.normalized));
      const tokenVectorsB = tokensB.map(t => getVector(t.normalized));

      // Pre-compute window vectors incrementally
      for (let i = 0; i < windowsA.length; i++) {
        const freqA: Record<string, number> = {};
        for (let k = 0; k < n; k++) {
          const vec = tokenVectorsA[i + k];
          for (const key in vec) freqA[key] = (freqA[key] || 0) + vec[key];
        }
        for (let j = 0; j < windowsB.length; j++) {
          const freqB: Record<string, number> = {};
          for (let k = 0; k < n; k++) {
            const vec = tokenVectorsB[j + k];
            for (const key in vec) freqB[key] = (freqB[key] || 0) + vec[key];
          }
          const sim = cosineSim(freqA, freqB);
          if (sim >= threshold) {
            matches.push({ sourceIndex: i, targetIndex: j, sourcePhrase: windowsA[i].text, targetPhrase: windowsB[j].text, similarity: sim, sourcePosition: i, targetPosition: j, length: n });
          }
        }
      }
    } else if (config.algorithm === 'word2vec') {
      const contextVectors: Record<string, Record<string, number>> = {};
      const buildContext = (tokens: Token[], window: number = 2) => {
        for (let i = 0; i < tokens.length; i++) {
          const word = tokens[i].normalized;
          if (!contextVectors[word]) contextVectors[word] = {};
          for (let j = Math.max(0, i - window); j <= Math.min(tokens.length - 1, i + window); j++) {
            if (i !== j) {
              const ctxWord = tokens[j].normalized;
              contextVectors[word][ctxWord] = (contextVectors[word][ctxWord] || 0) + 1;
            }
          }
        }
      };
      buildContext(tokensA);
      buildContext(tokensB);

      for (let i = 0; i < windowsA.length; i++) {
        const freqA: Record<string, number> = {};
        for (let k = 0; k < n; k++) {
          const vec = contextVectors[tokensA[i + k].normalized] || {};
          for (const key in vec) freqA[key] = (freqA[key] || 0) + vec[key];
        }
        for (let j = 0; j < windowsB.length; j++) {
          const freqB: Record<string, number> = {};
          for (let k = 0; k < n; k++) {
            const vec = contextVectors[tokensB[j + k].normalized] || {};
            for (const key in vec) freqB[key] = (freqB[key] || 0) + vec[key];
          }
          let sim = cosineSim(freqA, freqB);
          if (sim === 0) {
            // Fallback for very short texts
            const wordsA = []; const wordsB = [];
            for (let k = 0; k < n; k++) { wordsA.push(tokensA[i+k].normalized); wordsB.push(tokensB[j+k].normalized); }
            sim = jaccard(wordsA, wordsB) * 100;
          }
          if (sim >= threshold) {
            matches.push({ sourceIndex: i, targetIndex: j, sourcePhrase: windowsA[i].text, targetPhrase: windowsB[j].text, similarity: sim, sourcePosition: i, targetPosition: j, length: n });
          }
        }
      }
    }
  }

  // ── Alignments: Inverted-index approach (replaces O(N×M) brute force) ──
  // Instead of comparing every pair, use a word index to find candidate pairs
  const alignments: Alignment[] = [];
  const idxB = buildWordIndex(tokensB);

  // Phase 1: Exact matches via inverted index — O(N × avg_matches)
  for (let i = 0; i < tokensA.length; i++) {
    const tA = tokensA[i];
    const exactMatches = idxB.get(tA.normalized);
    if (exactMatches) {
      for (const j of exactMatches) {
        alignments.push({ sourceIndex: i, targetIndex: j, similarity: 100, sourceText: tA.text, targetText: tokensB[j].text });
      }
    }
  }

  // Phase 2: Near-matches — only for tokens with similar lengths
  // Group B tokens by length for efficient candidate selection
  const lenBuckets = new Map<number, number[]>();
  for (let j = 0; j < tokensB.length; j++) {
    const len = tokensB[j].normalized.length;
    for (let d = -2; d <= 2; d++) {
      const key = len + d;
      if (key <= 0) continue;
      const list = lenBuckets.get(key);
      if (list) list.push(j); else lenBuckets.set(key, [j]);
    }
  }

  const exactPairs = new Set(alignments.map(a => `${a.sourceIndex}:${a.targetIndex}`));
  for (let i = 0; i < tokensA.length; i++) {
    const tA = tokensA[i];
    const candidates = lenBuckets.get(tA.normalized.length);
    if (!candidates) continue;
    for (const j of candidates) {
      if (exactPairs.has(`${i}:${j}`)) continue;
      const tB = tokensB[j];
      if (tA.normalized === tB.normalized) continue; // already covered
      const sim = quickSimilarity(tA.normalized, tB.normalized, 40);
      if (sim >= 40) {
        alignments.push({ sourceIndex: i, targetIndex: j, similarity: sim, sourceText: tA.text, targetText: tB.text });
      }
    }
  }

  const avgSim = matches.length > 0 ? matches.reduce((acc, m) => acc + m.similarity, 0) / matches.length : 0;
  const coveredA = new Set<number>();
  const coveredB = new Set<number>();
  matches.forEach(m => {
    const len = m.length || config.windowSize;
    for (let k = 0; k < len; k++) {
      if (m.sourcePosition + k < tokensA.length) coveredA.add(m.sourcePosition + k);
      if (m.targetPosition + k < tokensB.length) coveredB.add(m.targetPosition + k);
    }
  });

  const elapsed = performance.now() - t0;
  console.log(`[ICoMa] Analysis completed in ${elapsed.toFixed(0)}ms — ${tokensA.length}×${tokensB.length} tokens, ${matches.length} matches, ${alignments.length} alignments`);

  return {
    tokensA, tokensB, matches, alignments,
    stats: {
      totalAlignments: matches.length,
      meanSimilarity: avgSim,
      coverage: (tokensA.length + tokensB.length) === 0 ? 0 : ((coveredA.size + coveredB.size) / (tokensA.length + tokensB.length)) * 100,
      uniqueNgrams: new Set([...matches.map(m => m.sourcePhrase), ...matches.map(m => m.targetPhrase)]).size
    }
  };
};