/**
 * OnboardingGuide â Interactive spotlight tour for first-time users.
 * Highlights each UI section one at a time with a tooltip popover.
 * Steps: (0) Welcome, (1) Source text, (2) Target text, (3) Config & Run.
 * Uses localStorage to suppress on repeat visits.
 */
import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { Language } from '../services/i18n';

/* âââ Types âââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
interface OnboardingGuideProps {
  lang: Language;
  onDismiss: () => void;
}

interface TourStep {
  selector: string;
  titleKey: string;
  descKey: string;
  exampleKey: string;
  tipKey?: string;
  color: string;
  icon: 'alpha' | 'beta' | 'gear' | 'samples';
}

/* âââ Step config âââââââââââââââââââââââââââââââââââââââââââââââââââ */
const STEPS: TourStep[] = [
  {
    selector: 'step-source',
    titleKey: 'step1_title',
    descKey: 'step1_desc',
    exampleKey: 'step1_example',
    color: '#2563eb',
    icon: 'alpha',
  },
  {
    selector: 'step-target',
    titleKey: 'step2_title',
    descKey: 'step2_desc',
    exampleKey: 'step2_example',
    color: '#d97706',
    icon: 'beta',
  },
  {
    selector: 'step-config',
    titleKey: 'step3_title',
    descKey: 'step3_desc',
    exampleKey: 'step3_example',
    tipKey: 'step3_tip',
    color: '#059669',
    icon: 'gear',
  },
  {
    selector: 'step-quickload',
    titleKey: 'step4_title',
    descKey: 'step4_desc',
    exampleKey: 'step4_example',
    color: '#7c3aed',
    icon: 'samples',
  },
];

/* âââ i18n ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
const OB: Record<string, Record<Language, string>> = {
  welcome_title: {
    en: 'Welcome to ICoMa', ja: 'ICoMa ã¸ãããã', zh: 'æ¬¢è¿ä½¿ç¨ ICoMa',
    ko: 'ICoMaì ì¤ì  ê²ì íìí©ëë¤', de: 'Willkommen bei ICoMa',
    la: 'Salve ad ICoMa', it: 'Benvenuto in ICoMa',
  },
  welcome_sub: {
    en: 'Learn how to detect textual reuse across witnesses â or try a ready-made sample right away!',
    ja: 'ãã­ã¹ãåå©ç¨ã®æ¤åºæ¹æ³ãå­¦ã³ã¾ããã â ããã«è©¦ãããµã³ãã«ãç¨æãã¦ãã¾ãï¼',
    zh: 'äºè§£å¦ä½æ£æµææ¬å¤ç¨ â æç«å³è¯ç¨ç°æçç¤ºä¾ï¼', ko: 'íì¤í¸ ì¬ì¬ì© ê°ì§ ë°©ë²ì ë°°ì°ì¸ì â ë°ë¡ ì¬ì©í  ì ìë ìíë ììµëë¤!',
    de: 'Lernen Sie, Textwiederverwendung zu erkennen â oder probieren Sie sofort ein fertiges Beispiel!',
    la: 'Disce quomodo textuum reusum reperiatur â aut exemplum paratum statim proba!',
    it: 'Scopri come rilevare il riuso testuale â o prova subito un campione pronto!',
  },
  start_tour: {
    en: 'Start Tour', ja: 'ãã¢ã¼ãéå§', zh: 'å¼å§å¯¼è§',
    ko: 'í¬ì´ ìì', de: 'Tour starten', la: 'Iter incipe', it: 'Inizia il tour',
  },
  skip: {
    en: 'Skip', ja: 'ã¹ã­ãã', zh: 'è·³è¿',
    ko: 'ê±´ëë°ê¸°', de: 'Ãberspringen', la: 'Praeterire', it: 'Salta',
  },
  next: {
    en: 'Next', ja: 'æ¬¡ã¸', zh: 'ä¸ä¸æ­¥',
    ko: 'ë¤ì', de: 'Weiter', la: 'Porro', it: 'Avanti',
  },
  finish: {
    en: 'Got it!', ja: 'ãããã¾ããï¼', zh: 'äºè§£äºï¼',
    ko: 'ìê² ìµëë¤ï¼', de: 'Verstanden!', la: 'Intellego!', it: 'Capito!',
  },
  dontshow: {
    en: "Don't show again", ja: 'æ¬¡åããè¡¨ç¤ºããªã', zh: 'ä¸åæ¾ç¤º',
    ko: 'ë¤ì íìíì§ ìê¸°', de: 'Nicht mehr anzeigen',
    la: 'Noli iterum ostendere', it: 'Non mostrare piÃ¹',
  },
  step_of: {
    en: 'of', ja: '/', zh: '/', ko: '/', de: 'von', la: 'ex', it: 'di',
  },
  step1_title: {
    en: 'Enter the Source Text (Witness Î±)',
    ja: 'å¼ç¨åãã­ã¹ããå¥åï¼Witness Î±ï¼',
    zh: 'è¾å¥åæææ¬ï¼è§è¯Î±ï¼', ko: 'ìë³¸ íì¤í¸ ìë ¥ (Witness Î±)',
    de: 'Quelltext eingeben (Witness Î±)', la: 'Textum fontem insere (Witness Î±)',
    it: 'Inserisci il testo fonte (Witness Î±)',
  },
  step1_desc: {
    en: 'Paste or type the original text that may have been quoted, reused, or alluded to. You can rename the witness by clicking the name field above the text area.',
    ja: 'å¼ç¨ã»åå©ç¨ã»æç¤ºã®åã«ãªã£ã¦ããããªåå¸ãã­ã¹ããè²¼ãä»ãã¦ä¸ããããã­ã¹ãã¨ãªã¢ä¸é¨ã®ååãã£ã¼ã«ããã¯ãªãã¯ãã¦ã¿ã¤ãã«ãä»ãããã¾ãã',
    zh: 'ç²è´´æè¾å¥å¯è½è¢«å¼ç¨ãå¤ç¨çåå§ææ¬ãç¹å»ä¸æ¹åç§°å­æ®µæ¥è®¾ç½®æ é¢ã',
    ko: 'ì¸ì©, ì¬ì¬ì© ëë ììì ìë³¸ íì¤í¸ë¥¼ ë¶ì¬ë£ì¼ì¸ì. ìì ì´ë¦ íëë¥¼ í´ë¦­íì¬ ì ëª©ì ì§ì í  ì ììµëë¤.',
    de: 'FÃ¼gen Sie den Originaltext ein. Klicken Sie auf das Namensfeld, um einen Titel zu vergeben.',
    la: 'Textum originalem insere. Nomen clicca ut titulum addas.',
    it: 'Incolla il testo originale. Clicca sul campo nome per assegnare un titolo.',
  },
  step1_example: {
    en: 'e.g. A psalm, an inscription, a Wikipedia articleâ¦',
    ja: 'ä¾ï¼è©©ç¯ãç¢æãWikipediaè¨äºãªã©',
    zh: 'ä¾å¦ï¼è¯ç¯ãé­æãç»´åºç¾ç§æç« â¦', ko: 'ì: ìí¸, ë¹ë¬¸, ìí¤ë°±ê³¼ ê¸°ì¬â¦',
    de: 'z.B. ein Psalm, eine Inschrift, ein Wikipedia-Artikelâ¦',
    la: 'e.g. psalmus, inscriptio, articulusâ¦', it: 'es. Un salmo, un\'iscrizioneâ¦',
  },
  step2_title: {
    en: 'Enter the Target Text (Witness Î²)',
    ja: 'å¼ç¨åãã­ã¹ããå¥åï¼Witness Î²ï¼',
    zh: 'è¾å¥ç®æ ææ¬ï¼è§è¯Î²ï¼', ko: 'ëì íì¤í¸ ìë ¥ (Witness Î²)',
    de: 'Zieltext eingeben (Witness Î²)', la: 'Textum comparandum insere (Witness Î²)',
    it: 'Inserisci il testo di confronto (Witness Î²)',
  },
  step2_desc: {
    en: 'Paste or type the text that may contain quotations from, or parallels to, the source.',
    ja: 'å¼ç¨åãå¼ç¨ã»åç§ãã¦ããããªãã­ã¹ããè²¼ãä»ãã¦ä¸ããã',
    zh: 'ç²è´´æè¾å¥å¯è½åå«å¼ç¨æå¹³è¡ææ¬ã',
    ko: 'ìë³¸ìì ì¸ì©íê±°ë ì ì¬í ë´ì©ì í¬í¨í  ì ìë íì¤í¸ë¥¼ ë¶ì¬ë£ì¼ì¸ì.',
    de: 'FÃ¼gen Sie den Text ein, der Zitate enthalten kÃ¶nnte.',
    la: 'Textum insere qui citationes continere potest.',
    it: 'Incolla il testo che potrebbe contenere citazioni.',
  },
  step2_example: {
    en: 'e.g. A sermon, an essay, a commentaryâ¦',
    ja: 'ä¾ï¼èª¬æãã¨ãã»ã¤ãæ³¨è§£ãªã©',
    zh: 'ä¾å¦ï¼è®²éãè®ºæãæ³¨éâ¦', ko: 'ì: ì¤êµ, ìì¸ì´, ì£¼ìâ¦',
    de: 'z.B. eine Predigt, ein Aufsatz, ein Kommentarâ¦',
    la: 'e.g. homilia, dissertatio, commentariusâ¦', it: 'es. Un sermone, un saggioâ¦',
  },
  step3_title: {
    en: 'Configure & Run',
    ja: 'è¨­å®ãã¦å®è¡',
    zh: 'éç½®å¹¶è¿è¡', ko: 'ì¤ì  í ì¤í', de: 'Konfigurieren & Starten',
    la: 'Configura et exsequere', it: 'Configura ed esegui',
  },
  step3_desc: {
    en: 'Choose an algorithm, set the similarity threshold and window size, then press the gold "Run Collation Engine" button.',
    ja: 'ã¢ã«ã´ãªãºã ãé¸ã³ãé¡ä¼¼åº¦ã®é¾å¤ã¨ã¦ã£ã³ãã¦ãµã¤ãºãè¨­å®ãã¦ãéè²ã®ãç§åã¨ã³ã¸ãµå®è¡ããã¿ã³ãæ¼ãã¦ä¸ããã',
    zh: 'éæ©ç®æ³ï¼è®¾ç½®ç¸ä¼¼åº¦éå¼åçªå£å¤§å°ï¼ç¶åç¹å»éè²"è¿è¡æ ¡åå¼æ"æé®ã',
    ko: 'ìê³ ë¦¬ì¦ì ì ííê³  ì ì¬ë ìê³ê°ê³¼ ìëì° í¬ê¸°ë¥¼ ì¤ì í í ê¸ì ë²í¼ì ëë¥´ì¸ì.',
    de: 'WÃ¤hlen Sie einen Algorithmus, dann drÃ¼cken Sie den goldenen Knopf.',
    la: 'Algorithmum elige, deinde aureum torcular preme.',
    it: 'Scegli un algoritmo, poi premi il pulsante dorato.',
  },
  step3_example: {
    en: 'Try the Quick Load examples above to see how it works!',
    ja: 'ä¸é¨ã®ã¯ã¤ãã¯ã­ã¼ãã®ä¾ãè©¦ãã¦åä½ãç¢ºèªãã¦ä¸ããï¼',
    zh: 'è¯è¯ä¸æ¹çå¿«éå è½½ç¤ºä¾ççææï¼', ko: 'ìì ë¹ ë¥¸ ë¡ë ìì ë¥¼ ìëí´ ë³´ì¸ìï¼',
    de: 'Probieren Sie die Schnellladen-Beispiele oben aus!',
    la: 'Exempla supra celeriter onera!', it: 'Prova gli esempi di Caricamento Rapido!',
  },
  step3_tip: {
    en: 'Tip: Start with Levenshtein at 60% for a quick overview.',
    ja: 'ãã³ãï¼ã¾ãã¬ã¼ãã³ã·ã¥ã¿ã¤ã³ã»é¾å¤60%ã§è©¦ãã¦ä¸ããã',
    zh: 'æç¤ºï¼åç¨ Levenshtein 60% å¿«éæ¦è§ã', ko: 'í: ë ë²¤ìíì¸ 60%ë¡ ììí´ ë³´ì¸ì.',
    de: 'Tipp: Starten Sie mit Levenshtein bei 60%.', la: 'Consilium: Levenshtein cum 60% incipe.',
    it: 'Suggerimento: inizia con Levenshtein al 60%.',
  },
  step4_title: {
    en: 'Try the Quick Load Samples',
    ja: 'ã¯ã¤ãã¯ã­ã¼ãã®ãµã³ãã«ãè©¦ã',
    zh: 'è¯è¯å¿«éå è½½ç¤ºä¾', ko: 'ë¹ ë¥¸ ë¡ë ìí ì¬ì©í´ ë³´ê¸°',
    de: 'Schnellladen-Beispiele ausprobieren', la: 'Exempla celeria proba',
    it: 'Prova i campioni di Caricamento Rapido',
  },
  step4_desc: {
    en: 'We have prepared sample texts in various classical languages â Egyptian, Coptic, Greek, Latin, and more. Click any button to instantly load a pair of texts and see ICoMa in action!',
    ja: 'ã¨ã¸ããèªã»ã³ããèªã»ã®ãªã·ã¢èªã»ã©ãã³èªãªã©ãæ§ããªå¤å¸è¨èªã®ãµã³ãã«ãã­ã¹ããç¨æãã¾ããããã¿ã³ãã¯ãªãã¯ããã ãã§ãã­ã¹ããèª­ã¿è¾¼ã¾ããããã«ICoMaãè©¦ãã¾ãï¼',
    zh: 'æä»¬åå¤äºååè¯­ãç§æ®ç¹è¯­ãå¸èè¯­ãæä¸è¯­ç­å¤ç§å¤å¸è¯­è¨çç¤ºä¾ææ¬ãç¹å»ä»»ææé®å³å¯å è½½ä¸å¯¹ææ¬ï¼ç«å³ä½éªICoMaï¼',
    ko: 'ì´ì§í¸ì´, ì½¥í¸ì´, ê·¸ë¦¬ì¤ì´, ë¼í´ì´ ë± ë¤ìí ê³ ì  ì¸ì´ ìí íì¤í¸ë¥¼ ì¤ë¹íìµëë¤. ë²í¼ì í´ë¦­íë©´ íì¤í¸ê° ë¡ëëì´ ë°ë¡ ICoMaë¥¼ ì²´íí  ì ììµëë¤!',
    de: 'Wir haben Beispieltexte in verschiedenen klassischen Sprachen vorbereitet â Ãgyptisch, Koptisch, Griechisch, Latein u.a. Klicken Sie auf eine SchaltflÃ¤che, um sofort ein Textpaar zu laden!',
    la: 'Exempla textuum in variis linguis classicis paravimus â Aegyptia, Coptica, Graeca, Latina et cetera. Torcular clicca ut par textuum statim oneres!',
    it: 'Abbiamo preparato testi di esempio in varie lingue classiche â egiziano, copto, greco, latino e altro. Clicca un pulsante per caricare una coppia di testi e provare ICoMa!',
  },
  step4_example: {
    en: 'Perfect for a first try â no need to prepare your own texts yet!',
    ja: 'æåã®ãè©¦ãã«æé© â ã¾ã èªåã®ãã­ã¹ããç¨æããªãã¦ãå¤§ä¸å¤«ã§ãï¼',
    zh: 'éå¸¸éååæ¬¡å°è¯ â æ éåå¤èªå·±çææ¬ï¼', ko: 'ì²ì ìëíê¸°ì ìë²½í©ëë¤ â ìì§ ìì ì íì¤í¸ë¥¼ ì¤ë¹í  íìê° ììµëë¤!',
    de: 'Perfekt fÃ¼r den ersten Versuch â Sie mÃ¼ssen noch keine eigenen Texte vorbereiten!',
    la: 'Perfectum ad primum experimentum â nondum opus est textus tuos parare!',
    it: 'Perfetto per una prima prova â non c\'Ã¨ bisogno di preparare i propri testi!',
  },
};

function tx(key: string, lang: Language): string {
  return OB[key]?.[lang] ?? OB[key]?.en ?? key;
}

/* âââ Step icon âââââââââââââââââââââââââââââââââââââââââââââââââââââ */
function StepIcon({ type, color, size = 28 }: { type: string; color: string; size?: number }) {
  const cls = `shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow`;
  const s = { width: size, height: size, background: color, fontSize: size * 0.45 };
  if (type === 'alpha') return <span className={cls} style={s}>Î±</span>;
  if (type === 'beta') return <span className={cls} style={s}>Î²</span>;
  if (type === 'samples') return (
    <span className={cls} style={s}>
      <svg width={size * 0.5} height={size * 0.5} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    </span>
  );
  return (
    <span className={cls} style={s}>
      <svg width={size * 0.5} height={size * 0.5} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </span>
  );
}

/* âââ Popover position calculator âââââââââââââââââââââââââââââââââââ */
function calcPopoverPos(
  targetRect: DOMRect,
  popW: number,
  popH: number,
): { top: number; left: number; arrow: 'top' | 'bottom' | 'left' | 'right' } {
  const GAP = 14;
  const MARGIN = 12;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Prefer placing BELOW the target
  const belowTop = targetRect.bottom + GAP;
  if (belowTop + popH < vh - MARGIN) {
    const left = Math.max(MARGIN, Math.min(
      targetRect.left + targetRect.width / 2 - popW / 2,
      vw - popW - MARGIN,
    ));
    return { top: belowTop, left, arrow: 'top' };
  }

  // Try ABOVE
  const aboveTop = targetRect.top - GAP - popH;
  if (aboveTop > MARGIN) {
    const left = Math.max(MARGIN, Math.min(
      targetRect.left + targetRect.width / 2 - popW / 2,
      vw - popW - MARGIN,
    ));
    return { top: aboveTop, left, arrow: 'bottom' };
  }

  // Try LEFT
  const leftLeft = targetRect.left - GAP - popW;
  if (leftLeft > MARGIN) {
    const top = Math.max(MARGIN, Math.min(
      targetRect.top + targetRect.height / 2 - popH / 2,
      vh - popH - MARGIN,
    ));
    return { top, left: leftLeft, arrow: 'right' };
  }

  // Fallback: RIGHT
  const rightLeft = targetRect.right + GAP;
  const top = Math.max(MARGIN, Math.min(
    targetRect.top + targetRect.height / 2 - popH / 2,
    vh - popH - MARGIN,
  ));
  return { top, left: Math.min(rightLeft, vw - popW - MARGIN), arrow: 'left' };
}

/* âââ CSS for spotlight + pulse animation âââââââââââââââââââââââââââ */
const SPOTLIGHT_STYLE = `
@keyframes icoma-tour-pulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(202,138,4,0.5), 0 0 0 9999px rgba(15,23,42,0.55); }
  50%      { box-shadow: 0 0 0 6px rgba(202,138,4,0.3), 0 0 0 9999px rgba(15,23,42,0.55); }
}
.icoma-tour-spotlight {
  animation: icoma-tour-pulse 2s ease-in-out infinite;
  border-radius: 8px;
  pointer-events: none;
  transition: top 0.4s ease, left 0.4s ease, width 0.4s ease, height 0.4s ease;
}
@keyframes icoma-tour-fadein {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.icoma-tour-popover {
  animation: icoma-tour-fadein 0.35s ease-out both;
}
`;

/* âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
/*  MAIN COMPONENT                                                    */
/* âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ lang, onDismiss }) => {
  // phase: 'welcome' | 'touring' | 'exiting'
  const [phase, setPhase] = useState<'welcome' | 'touring' | 'exiting'>('welcome');
  const [stepIdx, setStepIdx] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [popPos, setPopPos] = useState<{ top: number; left: number; arrow: string } | null>(null);
  const [dontShow, setDontShow] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);
  const animKey = useRef(0);

  /* ââ Inject CSS once âââââââââââââââââââââââââââââââââââââââââââ */
  useEffect(() => {
    const id = 'icoma-tour-style';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = SPOTLIGHT_STYLE;
      document.head.appendChild(style);
    }
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  /* ââ Measure target + position popover âââââââââââââââââââââââ */
  const measureAndPosition = useCallback(() => {
    if (phase !== 'touring') return;
    const step = STEPS[stepIdx];
    if (!step) return;
    const el = document.querySelector(`[data-tour="${step.selector}"]`) as HTMLElement | null;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setTargetRect(r);
    // Estimate popover size (will refine after render)
    const pw = Math.min(340, window.innerWidth - 24);
    const ph = 220;
    setPopPos(calcPopoverPos(r, pw, ph));
  }, [phase, stepIdx]);

  /* ââ Scroll target into view & measure âââââââââââââââââââââââ */
  useEffect(() => {
    if (phase !== 'touring') return;
    const step = STEPS[stepIdx];
    if (!step) return;
    const el = document.querySelector(`[data-tour="${step.selector}"]`) as HTMLElement | null;
    if (!el) return;

    // Scroll into view
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    // Measure after scroll settles
    const t1 = setTimeout(() => {
      measureAndPosition();
      animKey.current += 1;
    }, 400);
    return () => clearTimeout(t1);
  }, [phase, stepIdx, measureAndPosition]);

  /* ââ Reposition on resize/scroll âââââââââââââââââââââââââââââ */
  useEffect(() => {
    if (phase !== 'touring') return;
    const handler = () => measureAndPosition();
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
  }, [phase, measureAndPosition]);

  /* ââ Refine popover position after it renders ââââââââââââââââ */
  useLayoutEffect(() => {
    if (phase !== 'touring' || !targetRect || !popRef.current) return;
    const popRect = popRef.current.getBoundingClientRect();
    setPopPos(calcPopoverPos(targetRect, popRect.width, popRect.height));
  }, [targetRect, phase]);

  /* ââ Actions ââââââââââââââââââââââââââââââââââââââââââââââââââ */
  const dismiss = useCallback(() => {
    setPhase('exiting');
    if (dontShow) {
      try { localStorage.setItem('icoma-onboarding-dismissed', 'true'); } catch {}
    }
    setTimeout(() => onDismiss(), 300);
  }, [dontShow, onDismiss]);

  const goNext = useCallback(() => {
    if (stepIdx < STEPS.length - 1) {
      setStepIdx(i => i + 1);
    } else {
      dismiss();
    }
  }, [stepIdx, dismiss]);

  const startTour = useCallback(() => {
    setStepIdx(0);
    setPhase('touring');
  }, []);

  /* âââââââââââ WELCOME SCREEN âââââââââââââââââââââââââââââââââââ */
  if (phase === 'welcome' || phase === 'exiting') {
    const exiting = phase === 'exiting';
    return (
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)',
          opacity: exiting ? 0 : 1, transition: 'opacity 0.3s',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
      >
        <div style={{
          background: '#fff', borderRadius: 12, boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          width: '100%', maxWidth: 380, textAlign: 'center', overflow: 'hidden',
          transform: exiting ? 'scale(0.95)' : 'scale(1)', opacity: exiting ? 0 : 1,
          transition: 'all 0.3s',
        }}>
          {/* Logo */}
          <div style={{ padding: '32px 24px 20px' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #1e40af, #d97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(30,64,175,0.3)',
            }}>
              <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 22, fontFamily: 'serif' }}>IC</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 'bold', color: '#1e3a5f', marginBottom: 8, fontFamily: 'serif' }}>
              {tx('welcome_title', lang)}
            </h2>
            <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
              {tx('welcome_sub', lang)}
            </p>
          </div>

          {/* Mini step preview */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, padding: '0 24px 20px' }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <StepIcon type={s.icon} color={s.color} size={32} />
                <span style={{ fontSize: 9, fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase' }}>
                  Step {i + 1}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ padding: '0 24px 16px' }}>
            <button
              onClick={startTour}
              style={{
                width: '100%', padding: '12px 0',
                background: 'linear-gradient(90deg, #1e40af, #d97706)',
                color: '#fff', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase',
                letterSpacing: '0.15em', border: 'none', borderRadius: 6, cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              {tx('start_tour', lang)}
            </button>
          </div>

          {/* Skip + checkbox */}
          <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <button
              onClick={dismiss}
              style={{
                background: 'none', border: 'none', fontSize: 12, color: '#9ca3af',
                cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3,
              }}
            >
              {tx('skip', lang)}
            </button>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', userSelect: 'none' }}>
              <input type="checkbox" checked={dontShow} onChange={e => setDontShow(e.target.checked)}
                style={{ width: 14, height: 14, accentColor: '#1e40af' }} />
              <span style={{ fontSize: 11, color: '#9ca3af' }}>{tx('dontshow', lang)}</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  /* âââââââââââ TOURING â SPOTLIGHT + POPOVER ââââââââââââââââââââ */
  const step = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;
  const PAD = 8;

  return (
    <>
      {/* Spotlight highlight (box-shadow creates the dark overlay) */}
      {targetRect && (
        <div
          className="icoma-tour-spotlight"
          style={{
            position: 'fixed',
            zIndex: 9998,
            top: targetRect.top - PAD,
            left: targetRect.left - PAD,
            width: targetRect.width + PAD * 2,
            height: targetRect.height + PAD * 2,
          }}
        />
      )}

      {/* Click blocker (behind popover, above spotlight shadow) */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 9997, cursor: 'default' }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Popover tooltip */}
      {popPos && (
        <div
          key={animKey.current}
          ref={popRef}
          className="icoma-tour-popover"
          style={{
            position: 'fixed',
            zIndex: 9999,
            top: popPos.top,
            left: popPos.left,
            width: Math.min(340, window.innerWidth - 24),
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{
            background: '#fff', borderRadius: 10,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}>
            {/* Colored top bar */}
            <div style={{ height: 4, background: step.color }} />

            {/* Content */}
            <div style={{ padding: '16px 18px 12px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <StepIcon type={step.icon} color={step.color} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    {tx(step.titleKey, lang)}
                  </h3>
                  <span style={{ fontSize: 10, color: '#9ca3af', fontFamily: 'monospace', flexShrink: 0 }}>
                    {stepIdx + 1} {tx('step_of', lang)} {STEPS.length}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.6, margin: '0 0 6px' }}>
                  {tx(step.descKey, lang)}
                </p>
                <p style={{ fontSize: 11, color: '#9ca3af', fontStyle: 'italic', margin: 0 }}>
                  {tx(step.exampleKey, lang)}
                </p>
                {step.tipKey && (
                  <p style={{
                    fontSize: 11, fontWeight: 500, margin: '8px 0 0',
                    padding: '4px 8px', borderRadius: 4, display: 'inline-block',
                    background: `${step.color}15`, color: step.color,
                  }}>
                    {tx(step.tipKey, lang)}
                  </p>
                )}
              </div>
            </div>

            {/* Progress dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '4px 0 12px' }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{
                  width: i === stepIdx ? 20 : 8, height: 8, borderRadius: 4,
                  background: i === stepIdx ? step.color : '#e5e7eb',
                  transition: 'all 0.3s',
                }} />
              ))}
            </div>

            {/* Buttons */}
            <div style={{
              padding: '0 18px 14px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <button
                onClick={dismiss}
                style={{
                  background: 'none', border: 'none', fontSize: 11, color: '#9ca3af',
                  cursor: 'pointer', padding: '4px 0',
                }}
              >
                {tx('skip', lang)}
              </button>
              <button
                onClick={goNext}
                style={{
                  padding: '8px 20px', color: '#fff', fontWeight: 'bold', fontSize: 12,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  border: 'none', borderRadius: 6, cursor: 'pointer',
                  background: step.color, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                {isLast ? tx('finish', lang) : tx('next', lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OnboardingGuide;
