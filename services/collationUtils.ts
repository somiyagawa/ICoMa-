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

const levenshteinDistance = (str1: string, str2: string): number => {
  if (str1 === str2) return 0;
  if (str1.length === 0) return str2.length;
  if (str2.length === 0) return str1.length;

  // Use two rows instead of a full matrix for O(min(N,M)) space and better cache locality
  let v0 = new Int32Array(str2.length + 1);
  let v1 = new Int32Array(str2.length + 1);

  for (let i = 0; i <= str2.length; i++) {
    v0[i] = i;
  }

  for (let i = 0; i < str1.length; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < str2.length; j++) {
      const cost = str1[i] === str2[j] ? 0 : 1;
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    // Swap v0 and v1
    let temp = v0;
    v0 = v1;
    v1 = temp;
  }
  return v0[str2.length];
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
  const dist = levenshteinDistance(n1, n2);
  const maxLen = Math.max(n1.length, n2.length);
  return maxLen === 0 ? 100 : (1 - dist / maxLen) * 100;
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

export const runAnalysis = (
  textA: string, 
  textB: string, 
  config: { windowSize: number; threshold: number; algorithm: AlgorithmType; scriptMode: ScriptMode }
) => {
  const tokensA = tokenize(textA, config.scriptMode);
  const tokensB = tokenize(textB, config.scriptMode);
  let matches: Match[] = [];

  if (config.algorithm === 'smith-waterman') {
    matches = runSmithWaterman(tokensA, tokensB, config.threshold);
  } else if (config.algorithm === 'char-ngram') {
    const n = config.windowSize;
    for (let i = 0; i <= tokensA.length - n; i++) {
      const sliceA = tokensA.slice(i, i + n);
      const phraseA = sliceA.map(t => t.text).join('');
      for (let j = 0; j <= tokensB.length - n; j++) {
        const sliceB = tokensB.slice(j, j + n);
        const phraseB = sliceB.map(t => t.text).join('');
        const sim = calculateCopticSimilarity(phraseA, phraseB);
        if (sim >= config.threshold) {
          matches.push({ sourceIndex: i, targetIndex: j, sourcePhrase: phraseA, targetPhrase: phraseB, similarity: sim, sourcePosition: i, targetPosition: j, length: n });
        }
      }
    }
  } else {
    const n = config.windowSize;
    for (let i = 0; i <= tokensA.length - n; i++) {
      const sliceA = tokensA.slice(i, i + n);
      const phraseA = sliceA.map(t => t.text).join(' ');
      const normA = sliceA.map(t => t.normalized).join('');
      for (let j = 0; j <= tokensB.length - n; j++) {
        const sliceB = tokensB.slice(j, j + n);
        const phraseB = sliceB.map(t => t.text).join(' ');
        const normB = sliceB.map(t => t.normalized).join('');
        let sim = 0;
        if (config.algorithm === 'word-ngram') sim = jaccard(sliceA.map(t => t.normalized), sliceB.map(t => t.normalized)) * 100;
        else if (config.algorithm === 'jaccard') sim = jaccard(phraseA.split(''), phraseB.split('')) * 100;
        else if (config.algorithm === 'levenshtein') {
          const dist = levenshteinDistance(normA, normB);
          const max = Math.max(normA.length, normB.length);
          sim = max === 0 ? 0 : (1 - dist / max) * 100;
        } else if (config.algorithm === 'coptic-aware') sim = calculateCopticSimilarity(phraseA, phraseB);

        if (sim >= config.threshold) {
          matches.push({ sourceIndex: i, targetIndex: j, sourcePhrase: phraseA, targetPhrase: phraseB, similarity: sim, sourcePosition: i, targetPosition: j, length: n });
        }
      }
    }
  }

  const alignments: Alignment[] = [];
  
  // Optimization: Only compute Levenshtein for words with similar lengths (length diff <= 2)
  // and use a fast path for exact matches
  tokensA.forEach((tA, i) => {
    tokensB.forEach((tB, j) => {
       const lenDiff = Math.abs(tA.normalized.length - tB.normalized.length);
       if (lenDiff > 3) return; // Skip obviously different words
       
       let sim = 0;
       if (tA.normalized === tB.normalized) {
         sim = 100;
       } else {
         sim = calculateCopticSimilarity(tA.normalized, tB.normalized);
       }
       
       if (sim >= 40) alignments.push({ sourceIndex: i, targetIndex: j, similarity: sim, sourceText: tA.text, targetText: tB.text });
    });
  });

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