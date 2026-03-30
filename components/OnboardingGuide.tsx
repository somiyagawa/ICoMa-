/**
 * OnboardingGuide — Interactive spotlight tour for first-time users.
 * Highlights each UI section one at a time with a tooltip popover.
 * Steps: (1) Source text, (2) Target text, (3) Config & Run.
 * Uses localStorage to suppress on repeat visits.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Language } from '../services/i18n';

interface OnboardingGuideProps {
  lang: Language;
  onDismiss: () => void;
}

/* ── Step definitions ─────────────────────────────────────────────── */
interface TourStep {
  selector: string;          // data-tour attribute value
  titleKey: string;
  descKey: string;
  exampleKey: string;
  tipKey?: string;
  color: string;
  icon: 'alpha' | 'beta' | 'gear';
  popoverPosition: 'bottom' | 'left' | 'top';
}

const STEPS: TourStep[] = [
  {
    selector: 'step-source',
    titleKey: 'step1_title',
    descKey: 'step1_desc',
    exampleKey: 'step1_example',
    color: '#2563eb',
    icon: 'alpha',
    popoverPosition: 'bottom',
  },
  {
    selector: 'step-target',
    titleKey: 'step2_title',
    descKey: 'step2_desc',
    exampleKey: 'step2_example',
    color: '#d97706',
    icon: 'beta',
    popoverPosition: 'bottom',
  },
  {
    selector: 'step-config',
    titleKey: 'step3_title',
    descKey: 'step3_desc',
    exampleKey: 'step3_tip',
    tipKey: 'step3_tip',
    color: '#059669',
    icon: 'gear',
    popoverPosition: 'left',
  },
];

/* ── i18n strings ─────────────────────────────────────────────────── */
const OB_TEXT: Record<string, Record<Language, string>> = {
  welcome_title: {
    en: 'Welcome to ICoMa',
    ja: 'ICoMa へようこそ',
    zh: '欢迎使用 ICoMa',
    ko: 'ICoMa에 오신 것을 환영합니다',
    de: 'Willkommen bei ICoMa',
    la: 'Salve ad ICoMa',
    it: 'Benvenuto in ICoMa',
  },
  welcome_sub: {
    en: 'Let me show you how to use ICoMa in 3 quick steps.',
    ja: '3つの簡単なステップで使い方をご案内します。',
    zh: '让我用3个简单步骤向您展示如何使用。',
    ko: '3단계로 사용법을 안내해 드리겠습니다.',
    de: 'Lassen Sie mich Ihnen in 3 Schritten zeigen, wie es funktioniert.',
    la: 'Permitte me tibi III gradibus ostendere.',
    it: 'Lascia che ti mostri come usarlo in 3 passaggi.',
  },
  start_tour: {
    en: 'Start Tour',
    ja: 'ツアーを開始',
    zh: '开始导览',
    ko: '투어 시작',
    de: 'Tour starten',
    la: 'Iter incipe',
    it: 'Inizia il tour',
  },
  skip: {
    en: 'Skip',
    ja: 'スキップ',
    zh: '跳过',
    ko: '건너뛰기',
    de: 'Überspringen',
    la: 'Praeterire',
    it: 'Salta',
  },
  next: {
    en: 'Next',
    ja: '次へ',
    zh: '下一步',
    ko: '다음',
    de: 'Weiter',
    la: 'Porro',
    it: 'Avanti',
  },
  finish: {
    en: 'Got it!',
    ja: 'わかりました！',
    zh: '了解了！',
    ko: '알겠습니다！',
    de: 'Verstanden!',
    la: 'Intellego!',
    it: 'Capito!',
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
  step1_title: {
    en: 'Enter the Source Text (Witness α)',
    ja: '引用元テキストを入力（Witness α）',
    zh: '输入原文文本（见证α）',
    ko: '원본 텍스트 입력 (Witness α)',
    de: 'Quelltext eingeben (Witness α)',
    la: 'Textum fontem insere (Witness α)',
    it: 'Inserisci il testo fonte (Witness α)',
  },
  step1_desc: {
    en: 'Paste or type the original text that may have been quoted, reused, or alluded to. You can also give it a descriptive title by clicking the editable name field above.',
    ja: '引用・再利用・暗示の元になっていそうな原典テキストを貼り付けて下さい。上部の編集可能な名前フィールドをクリックしてタイトルも付けられます。',
    zh: '粘贴或输入可能被引用、复用或暗引的原始文本。点击上方可编辑的名称字段来设置标题。',
    ko: '인용, 재사용 또는 암시의 원본이 되는 텍스트를 붙여넣으세요. 위의 편집 가능한 이름 필드를 클릭하여 제목도 지정할 수 있습니다.',
    de: 'Fügen Sie den Originaltext ein, der möglicherweise zitiert wurde. Klicken Sie auf das Namensfeld darüber, um einen Titel zu vergeben.',
    la: 'Textum originalem insere. Nomen supra clicca ut titulum addas.',
    it: 'Incolla il testo originale che potrebbe essere stato citato. Clicca sul campo nome sopra per assegnare un titolo.',
  },
  step1_example: {
    en: 'e.g. A psalm, an inscription, a Wikipedia article, source code…',
    ja: '例：詩篇、碑文、Wikipedia記事、ソースコードなど',
    zh: '例如：诗篇、铭文、维基百科文章、源代码…',
    ko: '예: 시편, 비문, 위키백과 기사, 소스 코드…',
    de: 'z.B. ein Psalm, eine Inschrift, ein Wikipedia-Artikel…',
    la: 'e.g. psalmus, inscriptio, articulus Vicipaediae…',
    it: 'es. Un salmo, un\'iscrizione, un articolo di Wikipedia…',
  },
  step2_title: {
    en: 'Enter the Target Text (Witness β)',
    ja: '引用先テキストを入力（Witness β）',
    zh: '输入目标文本（见证β）',
    ko: '대상 텍스트 입력 (Witness β)',
    de: 'Zieltext eingeben (Witness β)',
    la: 'Textum comparandum insere (Witness β)',
    it: 'Inserisci il testo di confronto (Witness β)',
  },
  step2_desc: {
    en: 'Paste or type the text that may contain quotations from, or parallels to, the source.',
    ja: '引用元を引用・参照していそうなテキストを貼り付けて下さい。',
    zh: '粘贴或输入可能包含引用或与原文平行的文本。',
    ko: '원본에서 인용했거나 유사한 내용을 포함할 수 있는 텍스트를 붙여넣으세요.',
    de: 'Fügen Sie den Text ein, der Zitate aus der Quelle enthalten könnte.',
    la: 'Textum insere qui citationes e fonte continere potest.',
    it: 'Incolla il testo che potrebbe contenere citazioni dalla fonte.',
  },
  step2_example: {
    en: 'e.g. A sermon, a student essay, a commentary…',
    ja: '例：説教、学生のエッセイ、注解など',
    zh: '例如：讲道、学生论文、注释…',
    ko: '예: 설교, 학생 에세이, 주석…',
    de: 'z.B. eine Predigt, ein Aufsatz, ein Kommentar…',
    la: 'e.g. homilia, dissertatio, commentarius…',
    it: 'es. Un sermone, un saggio, un commento…',
  },
  step3_title: {
    en: 'Configure & Run',
    ja: '設定して実行',
    zh: '配置并运行',
    ko: '설정 후 실행',
    de: 'Konfigurieren & Starten',
    la: 'Configura et exsequere',
    it: 'Configura ed esegui',
  },
  step3_desc: {
    en: 'Choose an algorithm, set the similarity threshold and window size, then press the gold "Run Collation Engine" button.',
    ja: 'アルゴリズムを選び、類似度の閾値とウィンドウサイズを設定して、金色の「照合エンジン実行」ボタンを押して下さい。',
    zh: '选择算法，设置相似度阈值和窗口大小，然后点击金色的"运行校勘引擎"按钮。',
    ko: '알고리즘을 선택하고 유사도 임계값과 윈도우 크기를 설정한 후 금색 "대조 엔진 실행" 버튼을 누르세요.',
    de: 'Wählen Sie einen Algorithmus, setzen Sie Schwellenwert und Fenstergröße, dann drücken Sie den goldenen Knopf.',
    la: 'Algorithmum elige, limen constitue, deinde aureum torcular preme.',
    it: 'Scegli un algoritmo, imposta soglia e finestra, poi premi il pulsante dorato.',
  },
  step3_tip: {
    en: 'Tip: Start with Levenshtein at 60% for a quick overview.',
    ja: 'ヒント：まずレーベンシュタイン・閾値60%で試して下さい。',
    zh: '提示：先用 Levenshtein 60% 快速概览。',
    ko: '팁: 레벤슈타인 60%로 시작해 보세요.',
    de: 'Tipp: Starten Sie mit Levenshtein bei 60%.',
    la: 'Consilium: Levenshtein cum 60% incipe.',
    it: 'Suggerimento: inizia con Levenshtein al 60%.',
  },
  step_of: {
    en: 'of',
    ja: '/',
    zh: '/',
    ko: '/',
    de: 'von',
    la: 'ex',
    it: 'di',
  },
};

function ob(key: string, lang: Language): string {
  return OB_TEXT[key]?.[lang] ?? OB_TEXT[key]?.en ?? key;
}

/* ── Spotlight overlay with hole cutout ───────────────────────────── */
const SpotlightOverlay: React.FC<{
  rect: DOMRect | null;
  onClick: () => void;
}> = ({ rect, onClick }) => {
  if (!rect) return null;
  const pad = 8;
  const r = 8;
  const x = rect.left - pad;
  const y = rect.top - pad;
  const w = rect.width + pad * 2;
  const h = rect.height + pad * 2;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  return (
    <svg
      className="fixed inset-0 z-[9998]"
      width={vw}
      height={vh}
      style={{ pointerEvents: 'auto', cursor: 'default' }}
      onClick={onClick}
    >
      <defs>
        <mask id="spotlight-mask">
          <rect x="0" y="0" width={vw} height={vh} fill="white" />
          <rect x={x} y={y} width={w} height={h} rx={r} ry={r} fill="black" />
        </mask>
      </defs>
      <rect
        x="0" y="0" width={vw} height={vh}
        fill="rgba(15, 23, 42, 0.55)"
        mask="url(#spotlight-mask)"
      />
      {/* Animated highlight ring */}
      <rect
        x={x} y={y} width={w} height={h} rx={r} ry={r}
        fill="none"
        stroke="rgba(202, 138, 4, 0.6)"
        strokeWidth="3"
        className="animate-pulse"
      />
    </svg>
  );
};

/* ── Step icon helper ─────────────────────────────────────────────── */
function StepIcon({ type, color }: { type: 'alpha' | 'beta' | 'gear'; color: string }) {
  if (type === 'alpha') return (
    <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-sm shadow" style={{ background: color }}>α</span>
  );
  if (type === 'beta') return (
    <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-sm shadow" style={{ background: color }}>β</span>
  );
  return (
    <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white shadow" style={{ background: color }}>
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </span>
  );
}

/* ── Main OnboardingGuide component ───────────────────────────────── */
const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ lang, onDismiss }) => {
  // -1 = welcome screen, 0-2 = tour steps
  const [currentStep, setCurrentStep] = useState(-1);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  /* Measure target element on step change and on scroll/resize */
  useEffect(() => {
    if (currentStep < 0 || currentStep >= STEPS.length) {
      setTargetRect(null);
      return;
    }
    const step = STEPS[currentStep];
    const measure = () => {
      const el = document.querySelector(`[data-tour="${step.selector}"]`) as HTMLElement | null;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Small delay to let scroll finish
        setTimeout(() => {
          setTargetRect(el.getBoundingClientRect());
          setPopoverVisible(true);
        }, 350);
      }
    };
    setPopoverVisible(false);
    measure();

    const handleResize = () => {
      const el = document.querySelector(`[data-tour="${step.selector}"]`) as HTMLElement | null;
      if (el) setTargetRect(el.getBoundingClientRect());
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [currentStep]);

  const dismiss = useCallback(() => {
    setIsExiting(true);
    if (dontShowAgain) {
      try { localStorage.setItem('icoma-onboarding-dismissed', 'true'); } catch {}
    }
    setTimeout(() => onDismiss(), 350);
  }, [dontShowAgain, onDismiss]);

  const goNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      dismiss();
    }
  }, [currentStep, dismiss]);

  /* ── Welcome screen (step -1) ──────────────────────────────────── */
  if (currentStep === -1) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{
          background: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(4px)',
          opacity: isExiting ? 0 : 1,
          transition: 'opacity 350ms',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
      >
        <div
          className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-sm text-center overflow-hidden"
          style={{
            transform: isExiting ? 'scale(0.95)' : 'scale(1)',
            opacity: isExiting ? 0 : 1,
            transition: 'all 350ms',
          }}
        >
          <div className="px-6 pt-8 pb-5">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-amber-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl font-serif">IC</span>
              </div>
            </div>
            <h2 className="text-lg font-bold font-serif text-gray-800 mb-2">{ob('welcome_title', lang)}</h2>
            <p className="text-xs text-gray-500 leading-relaxed">{ob('welcome_sub', lang)}</p>
          </div>

          {/* 3-step mini preview */}
          <div className="flex justify-center gap-3 px-6 pb-5">
            {STEPS.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <StepIcon type={s.icon} color={s.color} />
                <span className="text-[9px] font-bold text-gray-400 uppercase">Step {i + 1}</span>
              </div>
            ))}
          </div>

          <div className="px-6 pb-4">
            <button
              onClick={() => setCurrentStep(0)}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-amber-500 text-white font-bold uppercase tracking-[0.15em] text-xs rounded hover:shadow-lg transition-all active:scale-[0.98] shadow-md"
            >
              {ob('start_tour', lang)}
            </button>
          </div>
          <div className="px-6 pb-5 flex flex-col items-center gap-2">
            <button onClick={dismiss} className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2">
              {ob('skip', lang)}
            </button>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-3.5 h-3.5 accent-blue-600 rounded"
              />
              <span className="text-[11px] text-gray-400">{ob('dontshow', lang)}</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  /* ── Tour steps (0, 1, 2) — spotlight + popover ────────────────── */
  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  /* Calculate popover position relative to the highlighted element */
  let popStyle: React.CSSProperties = { position: 'fixed', zIndex: 10000, maxWidth: 360 };
  if (targetRect) {
    const pad = 8;
    const arrowGap = 16;
    if (step.popoverPosition === 'bottom') {
      popStyle.top = targetRect.bottom + pad + arrowGap;
      popStyle.left = Math.max(16, targetRect.left + targetRect.width / 2 - 180);
    } else if (step.popoverPosition === 'left') {
      popStyle.top = Math.max(16, targetRect.top);
      const leftPos = targetRect.left - 360 - arrowGap;
      if (leftPos > 16) {
        popStyle.left = leftPos;
      } else {
        // fallback: put below
        popStyle.top = targetRect.bottom + pad + arrowGap;
        popStyle.left = Math.max(16, targetRect.left);
      }
    } else {
      popStyle.top = Math.max(16, targetRect.top - 200 - arrowGap);
      popStyle.left = Math.max(16, targetRect.left);
    }
    // Clamp right edge
    const rightEdge = (popStyle.left as number) + 360;
    if (rightEdge > window.innerWidth - 16) {
      popStyle.left = Math.max(16, window.innerWidth - 360 - 16);
    }
    // Clamp bottom edge
    if ((popStyle.top as number) + 240 > window.innerHeight - 16) {
      popStyle.top = Math.max(16, window.innerHeight - 260);
    }
  }

  return (
    <>
      {/* Dark overlay with spotlight cutout */}
      <SpotlightOverlay
        rect={targetRect}
        onClick={() => {}}  // Prevent click-through
      />

      {/* Popover card */}
      <div
        ref={popoverRef}
        style={{
          ...popStyle,
          opacity: popoverVisible ? 1 : 0,
          transform: popoverVisible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 300ms ease-out, transform 300ms ease-out',
          pointerEvents: popoverVisible ? 'auto' : 'none',
        }}
      >
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          {/* Step header */}
          <div className="px-5 pt-4 pb-3 flex items-start gap-3">
            <StepIcon type={step.icon} color={step.color} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <h3 className="text-sm font-bold text-gray-800 leading-snug">{ob(step.titleKey, lang)}</h3>
                <span className="text-[10px] text-gray-400 font-mono shrink-0">
                  {currentStep + 1} {ob('step_of', lang)} {STEPS.length}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{ob(step.descKey, lang)}</p>
              <p className="text-[11px] text-gray-400 italic mt-1">{ob(step.exampleKey, lang)}</p>
              {step.tipKey && (
                <p className="text-[11px] font-medium mt-2 px-2 py-1 rounded inline-block" style={{ background: `${step.color}10`, color: step.color }}>
                  {ob(step.tipKey, lang)}
                </p>
              )}
            </div>
          </div>

          {/* Step progress dots */}
          <div className="flex justify-center gap-2 pb-3">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentStep ? 20 : 8,
                  height: 8,
                  background: i === currentStep ? step.color : '#e5e7eb',
                }}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="px-5 pb-4 flex items-center justify-between gap-3">
            <button
              onClick={dismiss}
              className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              {ob('skip', lang)}
            </button>
            <button
              onClick={goNext}
              className="px-5 py-2 text-white font-bold text-xs uppercase tracking-wider rounded shadow-md hover:shadow-lg transition-all active:scale-[0.97]"
              style={{ background: step.color }}
            >
              {isLast ? ob('finish', lang) : ob('next', lang)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingGuide;
