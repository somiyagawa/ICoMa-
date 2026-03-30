import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  AIProvider,
  AIProviderConfig,
  AIAnalysisResult,
  AIIntertextualityMatch,
  INTERTEXTUALITY_CATEGORIES,
  runAIAnalysis,
  runMultiProviderAnalysis
} from '../services/aiAnalysisService';
import { Language, t } from '../services/i18n';

interface AIAnalysisPanelProps {
  sourceText: string;
  targetText: string;
  onHelpClick?: (topic: string) => void;
  collationTrigger?: number;
  lang?: Language;
  onResultChange?: (results: AIAnalysisResult[]) => void;
}

const PROVIDER_INFO: Record<AIProvider, { label: string; color: string; bgColor: string; borderColor: string; models: { value: string; label: string }[] }> = {
  claude: {
    label: 'Claude (Anthropic)',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    models: [
      { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
      { value: 'claude-opus-4-20250514', label: 'Claude Opus 4' },
      { value: 'claude-haiku-4-20250514', label: 'Claude Haiku 4' },
      { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' }
    ]
  },
  gemini: {
    label: 'Gemini (Google)',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    models: [
      { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
      { value: 'gemini-2.5-flash-preview-05-20', label: 'Gemini 2.5 Flash' },
      { value: 'gemini-2.5-pro-preview-05-06', label: 'Gemini 2.5 Pro' }
    ]
  },
  chatgpt: {
    label: 'ChatGPT (OpenAI)',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    models: [
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
      { value: 'gpt-4o', label: 'GPT-4o' },
      { value: 'gpt-4.1', label: 'GPT-4.1' },
      { value: 'o4-mini', label: 'o4-mini' }
    ]
  }
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; highlight: string }> = {
  direct_quotation: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', highlight: 'rgba(239,68,68,' },
  allusion: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', highlight: 'rgba(147,51,234,' },
  echo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', highlight: 'rgba(99,102,241,' },
  paraphrase: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', highlight: 'rgba(245,158,11,' },
  structural_parallel: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', highlight: 'rgba(20,184,166,' },
  thematic_reuse: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', highlight: 'rgba(6,182,212,' },
  formulaic_language: { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200', highlight: 'rgba(132,204,22,' },
  other: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', highlight: 'rgba(156,163,175,' }
};

// ─── Confidence → colour utility ───
function confidenceToColor(confidence: number, categoryType: string): string {
  const base = CATEGORY_COLORS[categoryType]?.highlight || 'rgba(156,163,175,';
  const alpha = Math.max(0.15, Math.min(0.55, confidence / 100 * 0.6));
  return `${base}${alpha.toFixed(2)})`;
}

function confidenceToBorderColor(confidence: number, categoryType: string): string {
  const base = CATEGORY_COLORS[categoryType]?.highlight || 'rgba(156,163,175,';
  const alpha = Math.max(0.4, Math.min(0.9, confidence / 100));
  return `${base}${alpha.toFixed(2)})`;
}

// ─── Confidence bar ───
const ConfidenceBar: React.FC<{ value: number; categoryType: string }> = ({ value, categoryType }) => {
  const color = confidenceToBorderColor(value, categoryType);
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-[10px] font-bold font-mono" style={{ color }}>{value}%</span>
    </div>
  );
};

// ─── HelpButton (local) ───
const HelpButton = ({ topic, onClick }: { topic: string; onClick: (topic: string) => void }) => (
  <button onClick={() => onClick(topic)} className="text-gray-400 hover:text-academic-blue transition-colors ml-1 focus:outline-none" title="Help">
    <svg className="w-3.5 h-3.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </button>
);

// ─── Highlighted parallel passage card ───
const MatchCard: React.FC<{ match: AIIntertextualityMatch; index: number; lang?: Language }> = ({ match, index, lang = 'en' as Language }) => {
  const [expanded, setExpanded] = useState(false);
  const colors = CATEGORY_COLORS[match.category.type] || CATEGORY_COLORS.other;
  const bgHighlight = confidenceToColor(match.confidence, match.category.type);
  const borderHighlight = confidenceToBorderColor(match.confidence, match.category.type);

  return (
    <div
      className="rounded-sm transition-all cursor-pointer overflow-hidden"
      style={{
        border: `2px solid ${borderHighlight}`,
        boxShadow: expanded ? `0 2px 12px ${bgHighlight}` : 'none'
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Confidence indicator strip */}
      <div className="h-1" style={{ background: `linear-gradient(to right, ${borderHighlight} ${match.confidence}%, transparent ${match.confidence}%)` }} />

      <div className="px-4 py-3 flex items-start justify-between gap-3" style={{ backgroundColor: expanded ? bgHighlight : 'white' }}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[9px] font-mono font-bold text-gray-400">#{index + 1}</span>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm ${colors.bg} ${colors.text} ${colors.border} border`}>
              {match.category.label}
            </span>
            {match.possibleSource && (
              <span className="text-[9px] px-1.5 py-0.5 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-sm font-mono">{t(lang, 'ext. source')}</span>
            )}
          </div>
          <div className="text-[11px] font-coptic text-academic-blue leading-snug line-clamp-2" dir="auto">
            "{match.sourcePassage}"
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <ConfidenceBar value={match.confidence} categoryType={match.category.type} />
          <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t pt-3" style={{ borderColor: borderHighlight, backgroundColor: bgHighlight }}>
          {/* Side-by-side highlighted passages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-[9px] font-bold uppercase text-gray-500 mb-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: borderHighlight }}></span>
                Source Text
              </div>
              <div
                className="text-[11px] font-coptic p-3 rounded-sm border leading-relaxed"
                style={{ backgroundColor: bgHighlight, borderColor: borderHighlight }}
                dir="auto"
              >
                {match.sourcePassage}
              </div>
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase text-gray-500 mb-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: borderHighlight }}></span>
                Target Text
              </div>
              <div
                className="text-[11px] font-coptic p-3 rounded-sm border leading-relaxed"
                style={{ backgroundColor: bgHighlight, borderColor: borderHighlight }}
                dir="auto"
              >
                {match.targetPassage}
              </div>
            </div>
          </div>

          {/* Confidence visual meter */}
          <div className="flex items-center gap-3 py-1">
            <span className="text-[9px] font-bold uppercase text-gray-400 shrink-0">{t(lang, 'Confidence')}</span>
            <div className="flex-1 h-3 bg-white/60 rounded-full overflow-hidden border" style={{ borderColor: borderHighlight }}>
              <div
                className="h-full rounded-full transition-all flex items-center justify-end pr-1"
                style={{ width: `${match.confidence}%`, backgroundColor: borderHighlight }}
              >
                <span className="text-[8px] font-bold text-white drop-shadow">{match.confidence}%</span>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div>
            <div className="text-[9px] font-bold uppercase text-gray-500 mb-1">{t(lang, 'Scholarly Assessment')}</div>
            <div className="text-[11px] text-gray-700 leading-relaxed font-sans bg-white/50 p-3 rounded-sm border" style={{ borderColor: `${borderHighlight}` }}>
              {match.explanation}
            </div>
          </div>
          {match.possibleSource && (
            <div>
              <div className="text-[9px] font-bold uppercase text-yellow-600 mb-1">{t(lang, 'Possible External Source')}</div>
              <div className="text-[11px] text-yellow-800 bg-yellow-50 p-2 rounded-sm border border-yellow-100 font-sans italic">
                {match.possibleSource}
              </div>
            </div>
          )}
          <div className="text-[9px] text-gray-400 italic font-sans">
            {match.category.description}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Confidence distribution mini-chart ───
const ConfidenceChart: React.FC<{ matches: AIIntertextualityMatch[] }> = ({ matches }) => {
  if (matches.length === 0) return null;
  const buckets = [0, 0, 0, 0, 0]; // 0-20, 20-40, 40-60, 60-80, 80-100
  matches.forEach(m => {
    const idx = Math.min(4, Math.floor(m.confidence / 20));
    buckets[idx]++;
  });
  const max = Math.max(...buckets, 1);
  const labels = ['0-20', '20-40', '40-60', '60-80', '80-100'];
  const colors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981'];

  return (
    <div className="flex items-end gap-1 h-12">
      {buckets.map((count, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
          <div
            className="w-full rounded-t-sm transition-all"
            style={{ height: `${(count / max) * 36}px`, backgroundColor: colors[i], minHeight: count > 0 ? '4px' : '0' }}
          />
          <span className="text-[7px] text-gray-400 font-mono">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Category summary badges ───
const CategorySummary: React.FC<{ matches: AIIntertextualityMatch[] }> = ({ matches }) => {
  const counts: Record<string, number> = {};
  matches.forEach(m => { counts[m.category.type] = (counts[m.category.type] || 0) + 1; });
  return (
    <div className="flex flex-wrap gap-1.5">
      {Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
        const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS.other;
        const catInfo = INTERTEXTUALITY_CATEGORIES[cat];
        return (
          <div key={cat} className={`text-[9px] font-bold uppercase px-2 py-1 rounded-sm ${colors.bg} ${colors.text} ${colors.border} border flex items-center gap-1`}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `${colors.highlight}0.7)` }}></span>
            {catInfo?.label || cat}: {count}
          </div>
        );
      })}
    </div>
  );
};

const ResultView: React.FC<{ result: AIAnalysisResult; lang?: Language }> = ({ result, lang = 'en' as Language }) => {
  const info = PROVIDER_INFO[result.provider];
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredMatches = filterCategory === 'all'
    ? result.matches
    : result.matches.filter(m => m.category.type === filterCategory);

  const categoryCounts: Record<string, number> = {};
  result.matches.forEach(m => {
    categoryCounts[m.category.type] = (categoryCounts[m.category.type] || 0) + 1;
  });

  if (result.error) {
    return (
      <div className={`border rounded-sm p-4 ${info.borderColor} ${info.bgColor}`}>
        <div className={`text-xs font-bold ${info.color} mb-2`}>{info.label}</div>
        <div className="text-xs text-red-600 bg-red-50 p-3 rounded border border-red-200 font-mono break-all">
          {result.error}
        </div>
        {result.overallAssessment && (
          <div className="text-[11px] mt-3 text-gray-600 font-sans whitespace-pre-wrap">
            {result.overallAssessment.substring(0, 500)}...
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Provider header with stats */}
      <div className={`border rounded-sm p-4 ${info.borderColor} ${info.bgColor}`}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className={`text-xs font-bold ${info.color} uppercase tracking-wider`}>{info.label}</div>
            <div className="text-[9px] text-gray-400 font-mono mt-0.5">{result.model} • {new Date(result.timestamp).toLocaleTimeString()}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-serif text-academic-blue">{result.matches.length}</div>
            <div className="text-[8px] uppercase text-gray-400 font-bold tracking-wider">matches</div>
          </div>
        </div>
        <div className="text-[12px] text-gray-700 leading-relaxed font-sans mb-3">{result.summary}</div>
        <div className="flex items-end justify-between gap-4">
          <CategorySummary matches={result.matches} />
          <ConfidenceChart matches={result.matches} />
        </div>
      </div>

      {/* Category filter */}
      {result.matches.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilterCategory('all')}
            className={`text-[9px] px-2 py-1 rounded-sm border transition-all font-bold uppercase ${filterCategory === 'all' ? 'bg-academic-blue text-white border-academic-blue' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}
          >
            {t(lang, 'All Categories')} ({result.matches.length})
          </button>
          {Object.entries(categoryCounts).map(([cat, count]) => {
            const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS.other;
            const catInfo = INTERTEXTUALITY_CATEGORIES[cat];
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`text-[9px] px-2 py-1 rounded-sm border transition-all font-bold uppercase ${filterCategory === cat ? `${colors.bg} ${colors.text} ${colors.border} ring-1 ring-current` : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}
              >
                {catInfo?.label || cat} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Matches */}
      <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredMatches.map((m, idx) => (
          <MatchCard key={m.id} match={m} index={idx} lang={lang} />
        ))}
        {filteredMatches.length === 0 && result.matches.length > 0 && (
          <div className="text-xs text-gray-400 text-center py-4">{t(lang, 'No matches in this category.')}</div>
        )}
      </div>

      {/* Overall assessment */}
      {result.overallAssessment && (
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
          <div className="text-[9px] font-bold uppercase text-gray-400 tracking-widest mb-2">{t(lang, 'Scholarly Assessment')}</div>
          <div className="text-[12px] text-gray-700 leading-relaxed font-sans whitespace-pre-wrap">
            {result.overallAssessment}
          </div>
        </div>
      )}
    </div>
  );
};

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({ sourceText, targetText, onHelpClick, collationTrigger, lang = 'en' as Language, onResultChange }) => {
  const [apiKeys, setApiKeys] = useState<Record<AIProvider, string>>({
    claude: '',
    gemini: '',
    chatgpt: ''
  });
  const [selectedModels, setSelectedModels] = useState<Record<AIProvider, string>>({
    claude: 'claude-sonnet-4-20250514',
    gemini: 'gemini-2.0-flash',
    chatgpt: 'gpt-4o-mini'
  });
  const [enabledProviders, setEnabledProviders] = useState<Record<AIProvider, boolean>>({
    claude: false,
    gemini: false,
    chatgpt: false
  });
  const [results, setResults] = useState<AIAnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<AIProvider | 'all'>('all');
  const [showConfig, setShowConfig] = useState(true);
  const [showApiKeys, setShowApiKeys] = useState<Record<AIProvider, boolean>>({
    claude: false,
    gemini: false,
    chatgpt: false
  });

  const activeProviders = (Object.keys(enabledProviders) as AIProvider[]).filter(
    p => enabledProviders[p] && apiKeys[p].trim().length > 0
  );

  const runAnalysis = useCallback(async () => {
    if (activeProviders.length === 0) return;
    if (!sourceText.trim() || !targetText.trim()) return;

    setIsAnalyzing(true);
    setResults([]);

    const configs: AIProviderConfig[] = activeProviders.map(p => ({
      provider: p,
      apiKey: apiKeys[p],
      model: selectedModels[p]
    }));

    try {
      const res = await runMultiProviderAnalysis(configs, sourceText, targetText);
      setResults(res);
      onResultChange?.(res);
      setShowConfig(false);
      if (res.length === 1) {
        setActiveTab(res[0].provider);
      } else {
        setActiveTab('all');
      }
    } catch (e) {
      console.error('AI Analysis failed:', e);
    } finally {
      setIsAnalyzing(false);
    }
  }, [activeProviders, apiKeys, selectedModels, sourceText, targetText]);

  // Auto re-run AI analysis when collation engine runs (if providers are configured)
  const prevTrigger = useRef(collationTrigger);
  useEffect(() => {
    if (collationTrigger !== undefined && collationTrigger > 0 && collationTrigger !== prevTrigger.current) {
      prevTrigger.current = collationTrigger;
      if (activeProviders.length > 0 && sourceText.trim() && targetText.trim()) {
        runAnalysis();
      }
    }
  }, [collationTrigger]);

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-academic-blue to-academic-lightBlue px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-white font-serif font-bold text-lg tracking-tight flex items-center gap-2">
            <svg className="w-5 h-5 text-academic-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            AI Intertextuality Analysis
            {onHelpClick && <HelpButton topic="aiIntertextuality" onClick={onHelpClick} />}
          </h2>
          <div className="text-[10px] text-gray-300 uppercase tracking-wider mt-0.5 flex items-center gap-1">
            Multi-Model Citation, Allusion & Echo Detection
            {onHelpClick && <HelpButton topic="aiIntertextualityMethod" onClick={onHelpClick} />}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {results.length > 0 && (
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="text-[10px] text-gray-300 hover:text-white transition-colors uppercase tracking-wider"
            >
              {showConfig ? 'Hide Config' : 'Show Config'}
            </button>
          )}
        </div>
      </div>

      {/* Configuration */}
      {showConfig && (
        <div className="p-6 border-b border-gray-200 bg-gray-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {(Object.keys(PROVIDER_INFO) as AIProvider[]).map(provider => {
              const info = PROVIDER_INFO[provider];
              return (
                <div
                  key={provider}
                  className={`border rounded-sm p-4 transition-all ${enabledProviders[provider] ? `${info.borderColor} ${info.bgColor} shadow-sm` : 'border-gray-200 bg-white opacity-70'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabledProviders[provider]}
                        onChange={e => setEnabledProviders({ ...enabledProviders, [provider]: e.target.checked })}
                        className="w-4 h-4 accent-academic-gold"
                      />
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${info.color}`}>{info.label}</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[9px] uppercase font-bold text-gray-400 block mb-1">API Key</label>
                      <div className="relative">
                        <input
                          type={showApiKeys[provider] ? 'text' : 'password'}
                          value={apiKeys[provider]}
                          onChange={e => setApiKeys({ ...apiKeys, [provider]: e.target.value })}
                          placeholder={`Enter ${info.label} API key...`}
                          className="w-full p-2 pr-8 text-[11px] font-mono border border-gray-200 rounded-sm bg-white focus:ring-2 focus:ring-academic-gold/20 focus:border-academic-gold outline-none"
                          disabled={!enabledProviders[provider]}
                        />
                        <button
                          onClick={() => setShowApiKeys({ ...showApiKeys, [provider]: !showApiKeys[provider] })}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          title={showApiKeys[provider] ? 'Hide' : 'Show'}
                        >
                          {showApiKeys[provider] ? (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-bold text-gray-400 block mb-1">Model</label>
                      <select
                        value={selectedModels[provider]}
                        onChange={e => setSelectedModels({ ...selectedModels, [provider]: e.target.value })}
                        className="w-full p-2 text-[11px] border border-gray-200 rounded-sm bg-white focus:ring-2 focus:ring-academic-gold/20 outline-none"
                        disabled={!enabledProviders[provider]}
                      >
                        {info.models.map(m => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-[10px] text-gray-400 font-sans italic">
              API keys are stored only in browser memory and never transmitted to any server other than the respective API endpoints.
            </div>
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing || activeProviders.length === 0 || !sourceText.trim() || !targetText.trim()}
              className="px-8 py-3 bg-academic-gold text-white font-bold uppercase tracking-[0.15em] text-[11px] rounded-sm hover:bg-academic-blue hover:shadow-lg transition-all active:scale-[0.98] shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Analyzing with {activeProviders.length} AI{activeProviders.length > 1 ? 's' : ''}...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  Run AI Intertextuality Analysis
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="p-6">
          {results.length > 1 && (
            <div className="flex gap-1 mb-6 border-b border-gray-200 pb-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`text-[10px] px-4 py-2 rounded-t-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'all' ? 'bg-academic-blue text-white' : 'text-gray-500 hover:text-academic-blue hover:bg-gray-50'}`}
              >
                Comparative View
              </button>
              {results.map(r => {
                const info = PROVIDER_INFO[r.provider];
                return (
                  <button
                    key={r.provider}
                    onClick={() => setActiveTab(r.provider)}
                    className={`text-[10px] px-4 py-2 rounded-t-sm font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === r.provider ? `${info.bgColor} ${info.color}` : 'text-gray-500 hover:text-academic-blue hover:bg-gray-50'}`}
                  >
                    {info.label}
                    {r.error ? (
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    ) : (
                      <span className="text-[9px] font-mono">({r.matches.length})</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Comparative view */}
          {activeTab === 'all' && results.length > 1 && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] font-sans">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 text-[9px] uppercase text-gray-400 font-bold tracking-wider">Metric</th>
                      {results.map(r => (
                        <th key={r.provider} className={`text-left py-2 px-3 text-[9px] uppercase font-bold tracking-wider ${PROVIDER_INFO[r.provider].color}`}>
                          {PROVIDER_INFO[r.provider].label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3 text-gray-500 font-bold">Total Matches</td>
                      {results.map(r => (
                        <td key={r.provider} className="py-2 px-3 font-bold text-academic-blue">{r.error ? '—' : r.matches.length}</td>
                      ))}
                    </tr>
                    {Object.entries(INTERTEXTUALITY_CATEGORIES).map(([cat, catInfo]) => {
                      const hasAny = results.some(r => r.matches.some(m => m.category.type === cat));
                      if (!hasAny) return null;
                      const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS.other;
                      return (
                        <tr key={cat} className="border-b border-gray-50">
                          <td className={`py-1.5 px-3 ${colors.text} font-bold`}>{catInfo.label}</td>
                          {results.map(r => (
                            <td key={r.provider} className="py-1.5 px-3 font-mono">
                              {r.error ? '—' : r.matches.filter(m => m.category.type === cat).length || '—'}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3 text-gray-500 font-bold">Avg. Confidence</td>
                      {results.map(r => {
                        if (r.error || r.matches.length === 0) return <td key={r.provider} className="py-2 px-3">—</td>;
                        const avg = r.matches.reduce((sum, m) => sum + m.confidence, 0) / r.matches.length;
                        return <td key={r.provider} className="py-2 px-3 font-bold text-academic-gold">{avg.toFixed(1)}%</td>;
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
              {results.map(r => (
                <ResultView key={r.provider} result={r} lang={lang} />
              ))}
            </div>
          )}

          {activeTab !== 'all' && (
            <ResultView result={results.find(r => r.provider === activeTab) || results[0]} lang={lang} />
          )}
        </div>
      )}

      {/* Empty state */}
      {results.length === 0 && !isAnalyzing && !showConfig && (
        <div className="p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-200 mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">No AI Analysis Yet</p>
          <p className="text-[10px] text-gray-400 mt-1">Configure API keys and run analysis above.</p>
          <button onClick={() => setShowConfig(true)} className="mt-3 text-[10px] text-academic-gold hover:text-academic-blue transition-colors underline">
            Show Configuration
          </button>
        </div>
      )}

      {/* Loading state */}
      {isAnalyzing && results.length === 0 && (
        <div className="p-16 text-center">
          <div className="flex justify-center mb-4">
            <svg className="animate-spin h-10 w-10 text-academic-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-xs text-academic-blue uppercase tracking-widest font-bold">Analyzing Intertextuality</p>
          <p className="text-[10px] text-gray-400 mt-1">
            Querying {activeProviders.length} AI model{activeProviders.length > 1 ? 's' : ''} for citation, allusion, and echo detection...
          </p>
        </div>
      )}
    </div>
  );
};

export default AIAnalysisPanel;
