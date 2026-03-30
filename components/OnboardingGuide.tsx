/**
 * OnboardingGuide — Animated step-by-step tutorial overlay for first-time users.
 * Shows 3 steps: (1) Enter source text, (2) Enter target text, (3) Configure & run.
 * Uses localStorage to remember if the user has dismissed it.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Language } from '../services/i18n';

interface OnboardingGuideProps {
  lang: Language;
  onDismiss: () => void;
}

/* ── i18n strings (inline, keyed by language) ─────────────────────── */
const OB_TEXT: Record<string, Record<Language, string>> = {
  title: {
    en: 'Welcome to ICoMa',
    ja: 'ICoMa へようこそ',
    zh: '欢迎使用 ICoMa',
    ko: 'ICoMa에 오신 것을 환영합니다',
    de: 'Willkommen bei ICoMa',
    la: 'Salve ad ICoMa',
    it: 'Benvenuto in ICoMa',
  },
  subtitle: {
    en: 'Intertextuality Collation Machine — Detect textual reuse across witnesses in 3 simple steps.',
    ja: 'テキスト間類似性照合エンジン — 3つの簡単なステップでテキスト再利用を検出します。',
    zh: '互文校勘引擎 — 通过3个简单步骤检测文本复用。',
    ko: '상호텍스트성 대조 엔진 — 3단계로 텍스트 재사용을 감지합니다.',
    de: 'Intertextualitäts-Kollationsmaschine — Erkennen Sie Textwiederverwendung in 3 einfachen Schritten.',
    la: 'Machina Collationis Intertextualitatis — III gradibus simplicibus reperire textuum reusum.',
    it: 'Macchina di Collazione Intertestuale — Rileva il riuso testuale in 3 semplici passi.',
  },
  step1_title: {
    en: 'Step 1 — Enter the Source Text (Witness α)',
    ja: 'ステップ 1 — 引用元テキストを入力（Witness α）',
    zh: '步骤 1 — 输入原文文本（见证α）',
    ko: '1단계 — 원본 텍스트 입력 (Witness α)',
    de: 'Schritt 1 — Quelltext eingeben (Witness α)',
    la: 'Gradus I — Textum fontem insere (Witness α)',
    it: 'Passo 1 — Inserisci il testo fonte (Witness α)',
  },
  step1_desc: {
    en: 'Paste or type the original text that may have been quoted, reused, or alluded to. Give it a descriptive title.',
    ja: '引用・再利用・暗示の元になっていそうな原典テキストを貼り付け、わかりやすいタイトルをつけて下さい。',
    zh: '粘贴或输入可能被引用、复用或暗引的原始文本，并给它一个描述性标题。',
    ko: '인용, 재사용 또는 암시의 원본이 되는 텍스트를 붙여넣고 설명적인 제목을 지정하세요.',
    de: 'Fügen Sie den Originaltext ein, der möglicherweise zitiert oder wiederverwendet wurde. Geben Sie ihm einen beschreibenden Titel.',
    la: 'Textum originalem insere qui fortasse citatus vel reusus est. Titulum descriptivum adde.',
    it: 'Incolla o digita il testo originale che potrebbe essere stato citato o riutilizzato. Assegnagli un titolo descrittivo.',
  },
  step1_example: {
    en: 'e.g. A psalm text, an ancient inscription, a Wikipedia article, a source code file…',
    ja: '例：詩篇、古代碑文、Wikipedia記事、ソースコードなど…',
    zh: '例如：诗篇文本、古代铭文、维基百科文章、源代码文件…',
    ko: '예: 시편 텍스트, 고대 비문, 위키백과 기사, 소스 코드 파일…',
    de: 'z.B. ein Psalmtext, eine antike Inschrift, ein Wikipedia-Artikel, eine Quelldatei…',
    la: 'e.g. textus psalmi, inscriptio antiqua, articulus Vicipaediae…',
    it: 'es. Un testo di salmo, un\'iscrizione antica, un articolo di Wikipedia, un file sorgente…',
  },
  step2_title: {
    en: 'Step 2 — Enter the Target Text (Witness β)',
    ja: 'ステップ 2 — 引用先テキストを入力（Witness β）',
    zh: '步骤 2 — 输入目标文本（见证β）',
    ko: '2단계 — 대상 텍스트 입력 (Witness β)',
    de: 'Schritt 2 — Zieltext eingeben (Witness β)',
    la: 'Gradus II — Textum comparandum insere (Witness β)',
    it: 'Passo 2 — Inserisci il testo di confronto (Witness β)',
  },
  step2_desc: {
    en: 'Paste or type the text that may contain quotations from, or parallels to, the source. Give it a title too.',
    ja: '引用元を引用・参照していそうなテキストを貼り付け、こちらにもタイトルをつけて下さい。',
    zh: '粘贴或输入可能包含引用或与原文平行的文本，也给它一个标题。',
    ko: '원본에서 인용했거나 유사한 내용을 포함할 수 있는 텍스트를 붙여넣고 제목도 지정하세요.',
    de: 'Fügen Sie den Text ein, der Zitate aus der Quelle enthalten könnte. Geben Sie auch diesem einen Titel.',
    la: 'Textum insere qui citationes e fonte continere potest. Titulum quoque adde.',
    it: 'Incolla o digita il testo che potrebbe contenere citazioni dalla fonte. Assegnagli anche un titolo.',
  },
  step2_example: {
    en: 'e.g. A sermon quoting the psalm, a student essay reusing text, a commentary on the source…',
    ja: '例：詩篇を引用する説教、テキストを再利用した学生のエッセイ、原典の注解…',
    zh: '例如：引用诗篇的讲道、复用文本的学生论文、对原文的注释…',
    ko: '예: 시편을 인용하는 설교, 텍스트를 재사용한 학생 에세이, 원문에 대한 주석…',
    de: 'z.B. eine Predigt, die den Psalm zitiert, ein Studentenaufsatz, ein Kommentar zur Quelle…',
    la: 'e.g. homilia psalmum citans, dissertatio textum reusans, commentarius in fontem…',
    it: 'es. Un sermone che cita il salmo, un saggio studentesco, un commento alla fonte…',
  },
  step3_title: {
    en: 'Step 3 — Configure & Run Collation',
    ja: 'ステップ 3 — 分析方法を設定して実行',
    zh: '步骤 3 — 配置并运行校勘',
    ko: '3단계 — 설정 후 대조 실행',
    de: 'Schritt 3 — Konfigurieren & Kollation starten',
    la: 'Gradus III — Configura et collationem exsequere',
    it: 'Passo 3 — Configura ed esegui la collazione',
  },
  step3_desc: {
    en: 'Choose an analysis algorithm (Levenshtein, Jaccard, Smith-Waterman, etc.), set the similarity threshold and window size, then press "Run Collation Engine".',
    ja: '分析アルゴリズム（レーベンシュタイン、ジャッカード、スミス・ウォーターマンなど）を選択し、類似度の閾値とウィンドウサイズを設定して、「照合エンジン実行」ボタンを押して下さい。',
    zh: '选择分析算法（Levenshtein、Jaccard、Smith-Waterman等），设置相似度阈值和窗口大小，然后点击"运行校勘引擎"。',
    ko: '분석 알고리즘(레벤슈타인, 자카드, 스미스-워터만 등)을 선택하고 유사도 임계값과 윈도우 크기를 설정한 후 "대조 엔진 실행" 버튼을 누르세요.',
    de: 'Wählen Sie einen Analysealgorithmus, setzen Sie den Schwellenwert und die Fenstergröße, dann drücken Sie "Kollation starten".',
    la: 'Algorithmum analysis elige, limen similitudinis constitue, deinde "Collationem exsequere" preme.',
    it: 'Scegli un algoritmo di analisi, imposta la soglia di similarità e la dimensione della finestra, poi premi "Esegui Collazione".',
  },
  step3_tip: {
    en: 'Tip: Start with Levenshtein at 60% threshold for a quick overview, then fine-tune.',
    ja: 'ヒント：まずレーベンシュタイン・閾値60%で概観を得てから、微調整して下さい。',
    zh: '提示：先用 Levenshtein 60% 阈值快速概览，然后微调。',
    ko: '팁: 빠른 개요를 위해 레벤슈타인 60% 임계값으로 시작한 후 미세 조정하세요.',
    de: 'Tipp: Beginnen Sie mit Levenshtein bei 60% Schwellenwert für einen schnellen Überblick.',
    la: 'Consilium: Levenshtein cum limine 60% incipe ad conspectum celerem.',
    it: 'Suggerimento: inizia con Levenshtein al 60% per una panoramica rapida, poi affina.',
  },
  quickload: {
    en: 'Or try a Quick Load example to see ICoMa in action instantly!',
    ja: 'クイックロードの例を試して、ICoMa をすぐに体験することもできます！',
    zh: '或者试试快速加载示例，立即体验 ICoMa！',
    ko: '또는 빠른 로드 예제를 시도하여 ICoMa를 바로 체험하세요！',
    de: 'Oder probieren Sie ein Schnellladen-Beispiel, um ICoMa sofort in Aktion zu sehen!',
    la: 'Vel exemplum celeriter onera ut ICoMa statim experiaris!',
    it: 'Oppure prova un esempio di Caricamento Rapido per vedere ICoMa in azione!',
  },
  gotit: {
    en: 'Got it — Let me start!',
    ja: 'わかりました — 始めましょう！',
    zh: '了解了 — 开始使用！',
    ko: '알겠습니다 — 시작하겠습니다!',
    de: 'Verstanden — Los geht\'s!',
    la: 'Intellego — Incipiamus!',
    it: 'Capito — Iniziamo!',
  },
  dontshow: {
    en: 'Don\'t show this again',
    ja: '次回から表示しない',
    zh: '不再显示',
    ko: '다시 표시하지 않기',
    de: 'Nicht mehr anzeigen',
    la: 'Noli iterum ostendere',
    it: 'Non mostrare più',
  },
};

function ob(key: string, lang: Language): string {
  return OB_TEXT[key]?.[lang] ?? OB_TEXT[key]?.en ?? key;
}

/* ── Animated step card ───────────────────────────────────────────── */
const StepCard: React.FC<{
  stepNum: number;
  title: string;
  desc: string;
  example: string;
  tip?: string;
  color: string;
  icon: React.ReactNode;
  isActive: boolean;
  delay: number;
}> = ({ stepNum, title, desc, example, tip, color, icon, isActive, delay }) => (
  <div
    className="relative flex gap-4 items-start transition-all duration-700 ease-out"
    style={{
      opacity: isActive ? 1 : 0,
      transform: isActive ? 'translateY(0)' : 'translateY(24px)',
      transitionDelay: `${delay}ms`,
    }}
  >
    {/* Step number circle */}
    <div
      className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
      style={{ background: color }}
    >
      {stepNum}
    </div>
    {/* Content */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed mb-1.5">{desc}</p>
      <p className="text-[11px] text-gray-400 italic">{example}</p>
      {tip && (
        <p className="text-[11px] text-academic-blue font-medium mt-1.5 bg-blue-50 px-2 py-1 rounded inline-block">{tip}</p>
      )}
    </div>
  </div>
);

/* ── Arrow icon between steps ─────────────────────────────────────── */
const StepArrow: React.FC<{ isVisible: boolean; delay: number }> = ({ isVisible, delay }) => (
  <div
    className="flex justify-center py-1 transition-all duration-500"
    style={{
      opacity: isVisible ? 0.5 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
      transitionDelay: `${delay}ms`,
    }}
  >
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 4 L10 16 M6 12 L10 16 L14 12" />
    </svg>
  </div>
);

/* ── Main OnboardingGuide component ───────────────────────────────── */
const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ lang, onDismiss }) => {
  const [stepsVisible, setStepsVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger step animations after mount
    const timer = setTimeout(() => setStepsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    if (dontShowAgain) {
      try { localStorage.setItem('icoma-onboarding-dismissed', 'true'); } catch {}
    }
    setTimeout(() => onDismiss(), 400);
  }, [dontShowAgain, onDismiss]);

  /* Icons for each step */
  const alphaIcon = (
    <span className="text-[10px] font-bold shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#2563eb', color: '#fff' }}>α</span>
  );
  const betaIcon = (
    <span className="text-[10px] font-bold shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#d97706', color: '#fff' }}>β</span>
  );
  const gearIcon = (
    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-400"
      style={{
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        opacity: isExiting ? 0 : 1,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleDismiss(); }}
    >
      <div
        className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-lg max-h-[90vh] overflow-y-auto transition-all duration-400"
        style={{
          transform: isExiting ? 'scale(0.95) translateY(16px)' : 'scale(1) translateY(0)',
          opacity: isExiting ? 0 : 1,
        }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-academic-blue to-academic-gold flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg font-serif">IC</span>
            </div>
          </div>
          <h2 className="text-lg font-bold font-serif text-academic-blue mb-1">{ob('title', lang)}</h2>
          <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">{ob('subtitle', lang)}</p>
        </div>

        {/* Steps */}
        <div className="px-6 py-5 flex flex-col gap-2">
          <StepCard
            stepNum={1}
            title={ob('step1_title', lang)}
            desc={ob('step1_desc', lang)}
            example={ob('step1_example', lang)}
            color="#2563eb"
            icon={alphaIcon}
            isActive={stepsVisible}
            delay={0}
          />
          <StepArrow isVisible={stepsVisible} delay={200} />
          <StepCard
            stepNum={2}
            title={ob('step2_title', lang)}
            desc={ob('step2_desc', lang)}
            example={ob('step2_example', lang)}
            color="#d97706"
            icon={betaIcon}
            isActive={stepsVisible}
            delay={300}
          />
          <StepArrow isVisible={stepsVisible} delay={500} />
          <StepCard
            stepNum={3}
            title={ob('step3_title', lang)}
            desc={ob('step3_desc', lang)}
            example={ob('step3_example', lang)}
            tip={ob('step3_tip', lang)}
            color="#059669"
            icon={gearIcon}
            isActive={stepsVisible}
            delay={600}
          />
        </div>

        {/* Quick Load hint */}
        <div
          className="mx-6 mb-4 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded text-center transition-all duration-700"
          style={{
            opacity: stepsVisible ? 1 : 0,
            transform: stepsVisible ? 'translateY(0)' : 'translateY(12px)',
            transitionDelay: '900ms',
          }}
        >
          <p className="text-[11px] text-amber-700 font-medium">{ob('quickload', lang)}</p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex flex-col items-center gap-3">
          <button
            onClick={handleDismiss}
            className="w-full py-3 bg-academic-gold text-white font-bold uppercase tracking-[0.15em] text-xs rounded hover:bg-academic-blue hover:shadow-lg transition-all active:scale-[0.98] shadow-md"
          >
            {ob('gotit', lang)}
          </button>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-3.5 h-3.5 accent-academic-blue rounded"
            />
            <span className="text-[11px] text-gray-400">{ob('dontshow', lang)}</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuide;
