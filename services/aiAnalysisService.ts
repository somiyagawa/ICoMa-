// AI Intertextuality Analysis Service
// Supports Claude (Anthropic), Gemini (Google), and ChatGPT (OpenAI) APIs

export type AIProvider = 'claude' | 'gemini' | 'chatgpt';

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

export interface IntertextualityCategory {
  type: 'direct_quotation' | 'allusion' | 'echo' | 'paraphrase' | 'structural_parallel' | 'thematic_reuse' | 'formulaic_language' | 'other';
  label: string;
  description: string;
}

export interface AIIntertextualityMatch {
  id: string;
  category: IntertextualityCategory;
  sourcePassage: string;
  targetPassage: string;
  confidence: number; // 0-100
  explanation: string;
  possibleSource?: string; // External source if identified
}

export interface AIAnalysisResult {
  provider: AIProvider;
  model: string;
  summary: string;
  matches: AIIntertextualityMatch[];
  overallAssessment: string;
  timestamp: number;
  error?: string;
}

const INTERTEXTUALITY_CATEGORIES: Record<string, IntertextualityCategory> = {
  direct_quotation: {
    type: 'direct_quotation',
    label: 'Direct Quotation',
    description: 'Verbatim or near-verbatim reproduction of a source text, often with explicit attribution markers.'
  },
  allusion: {
    type: 'allusion',
    label: 'Allusion',
    description: 'An indirect reference to another text, event, or figure that relies on the reader\'s recognition without explicit citation.'
  },
  echo: {
    type: 'echo',
    label: 'Echo',
    description: 'A faint, possibly unconscious, verbal or thematic reminiscence of another text.'
  },
  paraphrase: {
    type: 'paraphrase',
    label: 'Paraphrase',
    description: 'A restatement of a passage in different words while preserving the original meaning.'
  },
  structural_parallel: {
    type: 'structural_parallel',
    label: 'Structural Parallel',
    description: 'A similarity in the organizational structure, argument flow, or narrative pattern between texts.'
  },
  thematic_reuse: {
    type: 'thematic_reuse',
    label: 'Thematic Reuse',
    description: 'Adoption of motifs, themes, or topoi from a source text without direct verbal borrowing.'
  },
  formulaic_language: {
    type: 'formulaic_language',
    label: 'Formulaic Language',
    description: 'Use of conventional phrases, stock expressions, or genre-specific formulas shared across texts.'
  },
  other: {
    type: 'other',
    label: 'Other',
    description: 'Other forms of intertextual relationship not covered by the above categories.'
  }
};

export { INTERTEXTUALITY_CATEGORIES };

const SYSTEM_PROMPT = `You are an expert in computational philology, intertextuality studies, and historical linguistics. Your task is to analyze two texts (Witness α and Witness β) for all forms of intertextual relationships.

You must identify and classify each instance of intertextuality according to the following taxonomy:
1. **Direct Quotation**: Verbatim or near-verbatim reproduction, with or without explicit attribution markers.
2. **Allusion**: Indirect reference relying on the reader's recognition.
3. **Echo**: Faint verbal or thematic reminiscence, possibly unconscious.
4. **Paraphrase**: Restatement in different words preserving original meaning.
5. **Structural Parallel**: Similarity in organizational structure or argument flow.
6. **Thematic Reuse**: Adoption of motifs or topoi without direct verbal borrowing.
7. **Formulaic Language**: Conventional phrases or genre-specific formulas.
8. **Other**: Any other intertextual relationship.

For EACH identified instance, provide:
- The specific passage from Witness α (source_passage)
- The corresponding passage from Witness β (target_passage)
- The category (one of: direct_quotation, allusion, echo, paraphrase, structural_parallel, thematic_reuse, formulaic_language, other)
- A confidence score (0-100)
- A scholarly explanation of the relationship
- If applicable, any known external source text

You MUST respond in valid JSON with this exact structure:
{
  "summary": "Brief overall summary of the intertextual relationship between the two texts",
  "matches": [
    {
      "category": "direct_quotation",
      "source_passage": "text from Witness α",
      "target_passage": "text from Witness β",
      "confidence": 95,
      "explanation": "Scholarly explanation",
      "possible_source": "Optional external source"
    }
  ],
  "overall_assessment": "Detailed scholarly assessment of the nature and extent of intertextuality"
}

Be thorough, precise, and scholarly in your analysis. Consider the linguistic, historical, and genre-specific context. Support all texts and scripts including Coptic, Greek, Latin, Arabic, Syriac, Sanskrit, Chinese, and others.`;

const buildUserPrompt = (textA: string, textB: string): string => {
  return `Analyze the following two texts for all forms of intertextuality.

=== WITNESS α (Primary Text) ===
${textA}

=== WITNESS β (Comparandum) ===
${textB}

Provide your analysis in the specified JSON format. Be exhaustive in identifying all intertextual relationships.`;
};

const parseAIResponse = (raw: string, provider: AIProvider, model: string): AIAnalysisResult => {
  try {
    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = raw;
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    } else {
      // Try to find raw JSON object
      const braceMatch = raw.match(/\{[\s\S]*\}/);
      if (braceMatch) {
        jsonStr = braceMatch[0];
      }
    }

    const parsed = JSON.parse(jsonStr);
    const matches: AIIntertextualityMatch[] = (parsed.matches || []).map((m: any, idx: number) => ({
      id: `${provider}-${idx}`,
      category: INTERTEXTUALITY_CATEGORIES[m.category] || INTERTEXTUALITY_CATEGORIES['other'],
      sourcePassage: m.source_passage || '',
      targetPassage: m.target_passage || '',
      confidence: typeof m.confidence === 'number' ? m.confidence : 50,
      explanation: m.explanation || '',
      possibleSource: m.possible_source || undefined
    }));

    return {
      provider,
      model,
      summary: parsed.summary || '',
      matches,
      overallAssessment: parsed.overall_assessment || '',
      timestamp: Date.now()
    };
  } catch (e) {
    return {
      provider,
      model,
      summary: '',
      matches: [],
      overallAssessment: raw, // fallback: show raw text
      timestamp: Date.now(),
      error: `Failed to parse ${provider} response as JSON: ${(e as Error).message}`
    };
  }
};

// ─── Detect if running on deployed Vercel (use proxy) or localhost (direct) ───
function getBaseUrl(provider: 'anthropic' | 'openai' | 'gemini'): { url: string; useProxy: boolean } {
  const isDeployed = typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1');
  if (isDeployed) {
    // Use Vercel rewrites proxy to avoid CORS
    const proxyMap = {
      anthropic: '/api/anthropic/v1/messages',
      openai: '/api/openai/v1/chat/completions',
      gemini: '/api/gemini'
    };
    return { url: proxyMap[provider], useProxy: true };
  }
  const directMap = {
    anthropic: 'https://api.anthropic.com/v1/messages',
    openai: 'https://api.openai.com/v1/chat/completions',
    gemini: 'https://generativelanguage.googleapis.com'
  };
  return { url: directMap[provider], useProxy: false };
}

// ─── Claude (Anthropic) API ───
async function callClaude(apiKey: string, textA: string, textB: string, model?: string): Promise<AIAnalysisResult> {
  const selectedModel = model || 'claude-sonnet-4-20250514';
  const { url } = getBaseUrl('anthropic');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: selectedModel,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserPrompt(textA, textB) }]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Claude API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const content = data.content?.[0]?.text || '';
  return parseAIResponse(content, 'claude', selectedModel);
}

// ─── Gemini (Google) API ───
async function callGemini(apiKey: string, textA: string, textB: string, model?: string): Promise<AIAnalysisResult> {
  const selectedModel = model || 'gemini-2.0-flash';
  const { url: baseUrl } = getBaseUrl('gemini');
  const url = `${baseUrl}/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: buildUserPrompt(textA, textB) }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 4096
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return parseAIResponse(content, 'gemini', selectedModel);
}

// ─── ChatGPT (OpenAI) API ───
async function callChatGPT(apiKey: string, textA: string, textB: string, model?: string): Promise<AIAnalysisResult> {
  const selectedModel = model || 'gpt-4o-mini';
  const { url } = getBaseUrl('openai');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: selectedModel,
      temperature: 0.3,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(textA, textB) }
      ]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`ChatGPT API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  return parseAIResponse(content, 'chatgpt', selectedModel);
}

// ─── Main dispatcher ───
export async function runAIAnalysis(
  config: AIProviderConfig,
  textA: string,
  textB: string
): Promise<AIAnalysisResult> {
  switch (config.provider) {
    case 'claude':
      return callClaude(config.apiKey, textA, textB, config.model);
    case 'gemini':
      return callGemini(config.apiKey, textA, textB, config.model);
    case 'chatgpt':
      return callChatGPT(config.apiKey, textA, textB, config.model);
    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
}

// Run multiple providers in parallel
export async function runMultiProviderAnalysis(
  configs: AIProviderConfig[],
  textA: string,
  textB: string
): Promise<AIAnalysisResult[]> {
  const promises = configs.map(config =>
    runAIAnalysis(config, textA, textB).catch(err => ({
      provider: config.provider,
      model: config.model || 'unknown',
      summary: '',
      matches: [],
      overallAssessment: '',
      timestamp: Date.now(),
      error: (err as Error).message
    } as AIAnalysisResult))
  );
  return Promise.all(promises);
}
