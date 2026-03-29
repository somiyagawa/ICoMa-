import React, { useState, useCallback, useMemo } from 'react';
import { AnalysisConfig, AnalysisResult, Match } from './types';
import { runAnalysis } from './services/collationUtils';
import Heatmap from './components/Heatmap';
import NetworkGraph from './components/NetworkGraph';
import ParallelViewer from './components/ParallelViewer';
import DispersionPlot from './components/DispersionPlot';
import AlignmentFlow from './components/AlignmentFlow';
import SimilarityHistogram from './components/SimilarityHistogram';

const EXAMPLES = {
  english_long: {
    label: 'English (Text Reuse/Plagiarism)',
    a: "The Rosetta Stone is a stele composed of granodiorite inscribed with three versions of a decree issued in Memphis, Egypt in 196 BC during the Ptolemaic dynasty on behalf of King Ptolemy V Epiphanes. The top and middle texts are in Ancient Egyptian using hieroglyphic and Demotic scripts respectively, while the bottom is in Ancient Greek. The decree has only minor differences between the three versions, making the Rosetta Stone key to deciphering the Egyptian scripts. The stone was carved during the Hellenistic period and is believed to have originally been displayed within a temple, possibly at Sais. It was likely moved in late antiquity or during the Mamluk period, and was eventually used as building material in the construction of Fort Julien near the town of Rashid (Rosetta) in the Nile Delta. It was discovered there in July 1799 by French officer Pierre-François Bouchard during the Napoleonic campaign in Egypt. It was the first Ancient Egyptian bilingual text recovered in modern times, and it aroused widespread public interest with its potential to decipher this previously untranslated hieroglyphic script. Lithographic copies and plaster casts soon began circulating among European museums and scholars. When the British defeated the French they took the stone to London under the Capitulation of Alexandria in 1801.",
    b: "Topic: The History of Egyptology. In this essay, I will discuss the importance of the Rosetta Stone. The Rosetta Stone is a stele composed of granodiorite inscribed with three versions of a decree issued in Memphis in 196 BC. It was created on behalf of King Ptolemy V Epiphanes. Interestingly, the top and middle texts are in Ancient Egyptian using hieroglyphic and Demotic scripts, while the bottom is in Ancient Greek. Because the decree has only minor differences between the versions, the Rosetta Stone was key to deciphering Egyptian scripts. It was carved during the Hellenistic period and originally displayed in a temple. Later, it was used as building material in Fort Julien near Rashid (Rosetta). It was discovered there in July 1799 by Pierre-François Bouchard during the Napoleonic campaign. As the first Ancient Egyptian bilingual text found in modern times, it sparked massive public interest regarding the translation of hieroglyphics. Copies and casts were quickly distributed to European scholars. Following the French defeat, the British transported the stone to London in 1801."
  },
  latin: {
    label: 'Latin (Quote & Commentary)',
    a: "Quo usque tandem abutere, Catilina, patientia nostra? quam diu etiam furor iste tuus nos eludet? quem ad finem sese effrenata jactabit audacia? Nihilne te nocturnum praesidium Palati, nihil urbis vigiliae, nihil timor populi, nihil concursus bonorum omnium, nihil hic munitissimus habendi senatus locus, nihil horum ora voltusque moverunt? Patere tua consilia non sentis, constrictam jam horum omnium scientia teneri conjurationem tuam non vides? Quid proxima, quid superiore nocte egeris, ubi fueris, quos convocaveris, quid consilii ceperis, quem nostrum ignorare arbitraris? O tempora, o mores! Senatus haec intellegit. Consul videt; hic tamen vivit. Vivit? immo vero etiam in senatum venit, fit publici consilii particeps, notat et designat oculis ad caedem unum quemque nostrum.",
    b: "Historia de conjuratione Catilinae. Anno urbis conditae DCXCI, Cicero consul in senatum venit. Ille, cum iram suam vix continere posset, orationem habuit ardentem contra inimicum suum. Dixit enim voce magna: \"Quo usque tandem abutere, Catilina, patientia nostra?\" Et senatores audiebant et mirabantur. Sed Catilina non timebat. Cicero continuavit impetum suum dicens: \"Quam diu etiam furor iste tuus nos eludet?\" Haec verba in aeternum manent exemplum eloquentiae. Deinde Cicero interrogavit num Catilina non sentiret consilia sua patere, et num ignoraret quid proxima nocte egisset. \"O tempora, o mores!\" exclamavit orator, dolens quod senatus haec intellegeret et consul videret, sed proditor tamen viveret et in senatum veniret, notans unum quemque ad caedem."
  },
  coptic: {
    label: 'Coptic (Psalm & Sermon)',
    a: "ⲡϫⲟⲉⲓⲥ ⲡⲉ ⲡⲁⲟⲩⲟⲉⲓⲛ ⲁⲩⲱ ⲡⲁⲟⲩϫⲁⲓ ⲛϯⲛⲁⲣϩⲟⲧⲉ ⲁⲛ ⲛⲗⲁⲁⲩ. ⲡⲉⲧⲣⲟⲉⲓⲥ ⲉⲣⲟⲓ ⲛϥⲛⲁϯ ⲁⲛ ⲛⲗⲁⲁⲩ ⲛϩⲱⲃ ⲉⲧⲁϣⲉ ⲉⲣⲟⲓ. ⲉⲩⲉϩⲱⲛ ⲉϩⲟⲩⲛ ⲉⲣⲟⲓ ⲛϭⲓ ⲛⲉⲧⲟⲩⲱϣ ⲉⲟⲩⲱⲙ ⲛⲛⲁⲥⲁⲣⲝ. ⲛⲁϫⲁϫⲉ ⲙⲛ ⲛⲉⲧⲑⲗⲓⲃⲉ ⲙⲙⲟⲓ ⲛⲧⲟⲟⲩ ⲁⲩϭⲃⲃⲉ ⲁⲩϩⲉ. ⲉϣⲱⲡⲉ ⲉⲣϣⲁⲛ ⲟⲩⲡⲁⲣⲉⲙⲃⲟⲗⲏ ⲧⲱⲟⲩⲛ ⲉϩⲣⲁⲓ ⲉϫⲱⲓ ⲛⲧⲉ ⲡⲁϩⲏⲧ ⲧⲙⲣϩⲟⲧⲉ. ⲉϣⲱⲡⲉ ⲉⲣϣⲁⲛ ⲟⲩⲡⲟⲗⲉⲙⲟⲥ ⲧⲱⲟⲩⲛ ⲉϩⲣⲁⲓ ⲉϫⲱⲓ ϯⲛⲁⲕⲱ ⲛϩⲧⲏⲓ ⲉⲣⲟϥ ϩⲙ ⲡⲁⲓ.",
    b: "ⲁⲡⲁ ϣⲉⲛⲟⲩⲧⲉ ⲁϥⲥϩⲁⲓ ⲛⲛⲉϥⲥⲛⲏⲩ ϩⲛ ⲧⲉⲕⲕⲗⲏⲥⲓⲁ ϫⲉ ϣⲗⲏⲗ ⲙⲡⲣϫⲛⲁ. ⲙⲁⲣⲟⲛ ϫⲟⲟⲥ ⲙⲡⲣⲏⲧⲉ ⲙⲡⲉⲯⲁⲗⲙⲱⲇⲟⲥ ⲉⲧϫⲱ ⲙⲙⲟⲥ ϫⲉ: «ⲡϫⲟⲉⲓⲥ ⲡⲉ ⲡⲁⲟⲩⲟⲉⲓⲛ ⲁⲩⲱ ⲡⲁⲟⲩϫⲁⲓ». ⲉϣⲱⲡⲉ ⲡϫⲟⲉⲓⲥ ϣⲟⲟⲡ ⲛⲙⲙⲁⲛ, ⲧⲉⲧⲛⲛⲁϫⲟⲟⲥ ϫⲉ «ⲛϯⲛⲁⲣϩⲟⲧⲉ ⲁⲛ ⲛⲗⲁⲁⲩ». ⲁⲩⲱ ⲟⲛ ⲁϥϫⲟⲟⲥ ϫⲉ «ⲡⲉⲧⲣⲟⲉⲓⲥ ⲉⲣⲟⲓ ⲛϥⲛⲁϯ ⲁⲛ ⲛⲗⲁⲁⲩ ⲛϩⲱⲃ ⲉⲧⲁϣⲉ ⲉⲣⲟⲓ». ⲉⲧⲃⲉ ⲡⲁⲓ ⲙⲁⲣⲉⲛⲕⲱ ⲛⲥⲱⲛ ⲛⲧⲡⲟⲛⲏⲣⲓⲁ. ⲕⲁⲧⲁ ⲧϩⲉ ⲉⲛⲧⲁϥϫⲟⲟⲥ ϫⲉ ⲛⲁϫⲁϫⲉ ⲙⲛ ⲛⲉⲧⲑⲗⲓⲃⲉ ⲙⲙⲟⲓ ⲛⲧⲟⲟⲩ ⲁⲩϭⲃⲃⲉ ⲁⲩϩⲉ, ⲧⲁⲓ ⲧⲉ ⲧϩⲉ ⲉⲧⲉ ⲡⲛⲟⲩⲧⲉ ⲛⲁⲧⲁⲕⲟ ⲛⲛⲉⲛϫⲁϫⲉ ⲧⲏⲣⲟⲩ ⲛⲁϩⲣⲁⲛ. ⲁⲩⲱ ⲉⲣϣⲁⲛ ⲟⲩⲡⲁⲣⲉⲙⲃⲟⲗⲏ ⲧⲱⲟⲩⲛ ⲉϩⲣⲁⲓ ⲉϫⲱⲛ, ⲛⲛⲉ ⲡⲉⲛϩⲏⲧ ⲣϩⲟⲧⲉ."
  },
  sanskrit: {
    label: 'Sanskrit (Sutra & Commentary)',
    a: "अथ योगानुशासनम् ॥१॥ योगश्चित्तवृत्तिनिरोधः ॥२॥ तदा द्रष्टुः स्वरूपेऽवस्थानम् ॥३॥ वृत्तिसारूप्यमितरत्र ॥४॥ वृत्तयः पञ्चतय्यः क्लिष्टाऽक्लिष्टाः ॥५॥ प्रमाणविपर्ययविकल्पनिद्रास्मृतयः ॥६॥ प्रत्यक्षानुमानागमाः प्रमाणानि ॥७॥ विपर्ययो मिथ्याज्ञानमतद्रूपप्रतिष्ठम् ॥८॥ शब्दज्ञानानुपाती वस्तुशून्यो विकल्पः ॥९॥ अभावप्रत्ययालम्बना वृत्तिर्निद्रा ॥१०॥ अनुभूतविषयासम्प्रमोषः स्मृतिः ॥११॥ अभ्यासवैराग्याभ्यां तन्निरोधः ॥१२॥ तत्र स्थितौ यत्नोऽभ्यासः ॥१३॥ स तु दीर्घकालनैरन्तर्यसत्कारासेवितो दृढभूमिः ॥१४॥",
    b: "पतञ्जलिमुनिना प्रणीते योगसूत्रे उक्तम् - योगश्चित्तवृत्तिनिरोधः इति। अस्य अर्थः चित्तस्य वृत्तीनां निरोधः एव योगः। तदा द्रष्टुः स्वरूपेऽवस्थानम् भवति। अन्यदा तु वृत्तिसारूप्यमितरत्र। एताः वृत्तयः पञ्चतय्यः क्लिष्टाऽक्लिष्टाः च भवन्ति। ताश्च प्रमाणविपर्ययविकल्पनिद्रास्मृतयः इति पञ्चधा विभक्ताः। तत्र प्रत्यक्षानुमानागमाः प्रमाणानि इति सूत्रकारेण स्पष्टीकृतम्। विपर्ययो नाम मिथ्याज्ञानमतद्रूपप्रतिष्ठम्। शब्दज्ञानानुपाती वस्तुशून्यो विकल्पः इति चोक्तम्। अभावप्रत्ययालम्बना वृत्तिर्निद्रा तथा अनुभूतविषयासम्प्रमोषः स्मृतिः इति ज्ञेयम्। एतासां सर्वासां वृत्तीनां निरोधः कथं भवति? अभ्यासवैराग्याभ्यां तन्निरोधः इति महर्षिणा उपदिष्टम्। तत्र स्थितौ यत्नोऽभ्यासः, स तु दीर्घकालनैरन्तर्यसत्कारासेवितो दृढभूमिः भवति।"
  },
  chinese: {
    label: 'Chinese (Classic & Analysis)',
    a: "道可道，非常道。名可名，非常名。無名天地之始；有名萬物之母。故常無欲，以觀其妙；常有欲，以觀其徼。此兩者，同出而異名，同謂之玄。玄之又玄，眾妙之門。天下皆知美之為美，斯惡已。皆知善之為善，斯不善已。有無相生，難易相成，長短相形，高下相盈，音聲相和，前後相隨。恆也。是以聖人處無為之事，行不言之教；萬物作而弗始，生而弗有，為而弗恃，功成而不居。夫唯弗居，是以不去。",
    b: "老子《道德經》開篇即言：「道可道，非常道。名可名，非常名。」這說明真正的「道」是無法用言語完全表達的。接著提到「無名天地之始；有名萬物之母」，指出了天地萬物的起源。我們應該「常無欲，以觀其妙；常有欲，以觀其徼」。這兩者同出而異名，都是極其玄妙的，是「眾妙之門」。在第二章中，老子進一步闡述了相對論的觀點：「天下皆知美之為美，斯惡已。皆知善之為善，斯不善已。」美與醜、善與惡都是相對存在的。因此，「有無相生，難易相成，長短相形，高下相盈，音聲相和，前後相隨。」這是一種永恆的規律。基於這種認識，「是以聖人處無為之事，行不言之教」。聖人任憑萬物自然生長而不加干涉，「生而弗有，為而弗恃，功成而不居」。正因為他不居功，所以他的功績永遠不會消失。"
  },
  syriac: {
    label: 'Syriac (Peshitta & Commentary)',
    a: "ܒܪܫܝܬ ܒܪܐ ܐܠܗܐ ܝܬ ܫܡܝܐ ܘܝܬ ܐܪܥܐ܂ ܘܐܪܥܐ ܗܘܬ ܬܘܗ ܘܒܘܗ ܘܚܫܘܟܐ ܥܠ ܐܦܝ ܬܗܘܡܐ ܘܪܘܚܗ ܕܐܠܗܐ ܡܪܚܦܐ ܥܠ ܐܦܝ ܡܝܐ܂ ܘܐܡܪ ܐܠܗܐ ܢܗܘܐ ܢܘܗܪܐ ܘܗܘܐ ܢܘܗܪܐ܂ ܘܚܙܐ ܐܠܗܐ ܠܢܘܗܪܐ ܕܫܦܝܪ ܘܦܪܫ ܐܠܗܐ ܒܝܬ ܢܘܗܪܐ ܠܚܫܘܟܐ܂ ܘܩܪܐ ܐܠܗܐ ܠܢܘܗܪܐ ܐܝܡܡܐ ܘܠܚܫܘܟܐ ܩܪܐ ܠܠܝܐ ܘܗܘܐ ܪܡܫܐ ܘܗܘܐ ܨܦܪܐ ܝܘܡܐ ܚܕ܂ ܘܐܡܪ ܐܠܗܐ ܢܗܘܐ ܪܩܝܥܐ ܒܡܨܥܬ ܡܝܐ ܘܢܗܘܐ ܦܪܫ ܒܝܬ ܡܝܐ ܠܡܝܐ܂",
    b: "ܘܟܕ ܩܪܝܢܢ ܒܣܦܪܐ ܕܒܪܝܬܐ ܡܫܟܚܝܢܢ ܕܟܬܝܒ: ܒܪܫܝܬ ܒܪܐ ܐܠܗܐ ܝܬ ܫܡܝܐ ܘܝܬ ܐܪܥܐ. ܗܢܐ ܡܚܘܐ ܠܢ ܕܐܠܗܐ ܗܘ ܒܪܘܝܐ ܕܟܠ. ܘܐܦ ܟܬܝܒ ܕܐܪܥܐ ܗܘܬ ܬܘܗ ܘܒܘܗ ܘܚܫܘܟܐ ܥܠ ܐܦܝ ܬܗܘܡܐ. ܘܒܗܢܐ ܚܫܘܟܐ ܪܘܚܗ ܕܐܠܗܐ ܡܪܚܦܐ ܥܠ ܐܦܝ ܡܝܐ. ܡܢ ܒܬܪܟܢ ܦܩܕ ܡܪܝܐ ܘܐܡܪ ܐܠܗܐ ܢܗܘܐ ܢܘܗܪܐ ܘܡܚܕܐ ܗܘܐ ܢܘܗܪܐ. ܘܚܙܐ ܐܠܗܐ ܠܢܘܗܪܐ ܕܫܦܝܪ ܘܦܪܫ ܐܠܗܐ ܒܝܬ ܢܘܗܪܐ ܠܚܫܘܟܐ. ܗܟܢܐ ܩܪܐ ܐܠܗܐ ܠܢܘܗܪܐ ܐܝܡܡܐ ܘܠܚܫܘܟܐ ܩܪܐ ܠܠܝܐ. ܘܗܘܐ ܪܡܫܐ ܘܗܘܐ ܨܦܪܐ ܝܘܡܐ ܚܕ. ܒܝܘܡܐ ܕܬܪܝܢ ܐܡܪ ܐܠܗܐ ܢܗܘܐ ܪܩܝܥܐ ܒܡܨܥܬ ܡܝܐ ܘܢܗܘܐ ܦܪܫ ܒܝܬ ܡܝܐ ܠܡܝܐ ܠܡܒܕܩ ܚܝܠܗ ܪܒܐ."
  }
};

const StatItem = ({ label, value, description }: { label: string, value: string | number, description: string }) => (
  <div className="group relative flex flex-col border-r border-gray-100 last:border-0 px-6">
    <div className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1.5 cursor-help">
      {label}
      <span className="text-academic-gold">ⓘ</span>
    </div>
    <div className="text-3xl font-serif font-bold text-academic-blue leading-tight">{value}</div>
    <div className="absolute top-full left-6 mt-2 hidden group-hover:block z-[100] bg-academic-blue text-white text-[11px] p-4 rounded shadow-2xl w-64 leading-relaxed border border-academic-lightBlue">
      <div className="font-bold text-academic-gold mb-1">{label}</div>
      {description}
    </div>
  </div>
);

const App: React.FC = () => {
  const [sourceText, setSourceText] = useState(EXAMPLES.english_long.a);
  const [targetText, setTargetText] = useState(EXAMPLES.english_long.b);
  const [config, setConfig] = useState<AnalysisConfig>({
    windowSize: 4,
    threshold: 60,
    algorithm: 'jaccard',
    scriptMode: 'auto'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const performAnalysis = useCallback(() => {
    if (!sourceText || !targetText) return;
    setIsProcessing(true);
    // Use timeout to allow UI to render 'Processing' state
    setTimeout(() => {
      const res = runAnalysis(sourceText, targetText, config);
      setResult(res);
      setSelectedMatch(null); 
      setIsProcessing(false);
    }, 50);
  }, [sourceText, targetText, config]);

  const sortedMatches = useMemo(() => {
    if (!result) return [];
    return [...result.matches].sort((a, b) => b.similarity - a.similarity);
  }, [result]);

  return (
    <div className="min-h-screen font-serif bg-academic-cream text-academic-blue pb-20 flex flex-col">
      <header className="bg-gradient-to-r from-academic-lightBlue to-academic-blue text-white border-b-4 border-academic-red px-6 py-5 shadow-lg shrink-0">
        <div className="w-full flex justify-between items-center">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-gray-300 mb-1 font-sans font-semibold">So Miyagawa Computational Linguistics Lab</div>
            <h1 className="text-3xl font-bold font-serif tracking-tight">ICoMa <span className="text-academic-gold font-light ml-3 text-xl opacity-80 italic">Intertextuality Collation Machine</span></h1>
          </div>
          <div className="hidden lg:flex items-center gap-6">
             <div className="text-right">
                <div className="text-[10px] text-gray-400 uppercase font-sans">Engine Status</div>
                <div className="text-xs text-green-400 font-mono flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> READY FOR COLLATION
                </div>
             </div>
          </div>
        </div>
      </header>

      <main className="w-full px-6 py-8 flex-1 flex flex-col gap-8 max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Input Section */}
          <div className="xl:col-span-8 bg-white p-6 border border-gray-200 shadow-md rounded-sm">
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100 pb-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center mr-2">Quick Load:</span>
              {Object.entries(EXAMPLES).map(([key, val]) => (
                <button key={key} onClick={() => { setSourceText(val.a); setTargetText(val.b); }} className="text-[10px] px-3 py-1.5 bg-gray-50 border border-gray-200 hover:bg-academic-blue hover:text-white hover:border-academic-blue transition-all uppercase font-mono rounded-sm shadow-sm">{val.label}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2 px-1">
                   <span className="text-[11px] font-bold text-academic-blue uppercase tracking-wider">Witness α (Primary)</span>
                   <span className="text-[9px] text-gray-400 font-mono">{sourceText.length} chars</span>
                </div>
                <textarea className="w-full h-40 p-4 text-sm font-coptic border border-gray-200 rounded-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-academic-gold/20 focus:border-academic-gold outline-none transition-all shadow-inner leading-relaxed" value={sourceText} onChange={(e) => setSourceText(e.target.value)} placeholder="Insert primary text (Source)..." dir="auto" />
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2 px-1">
                   <span className="text-[11px] font-bold text-academic-blue uppercase tracking-wider">Witness β (Comparandum)</span>
                   <span className="text-[9px] text-gray-400 font-mono">{targetText.length} chars</span>
                </div>
                <textarea className="w-full h-40 p-4 text-sm font-coptic border border-gray-200 rounded-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-academic-gold/20 focus:border-academic-gold outline-none transition-all shadow-inner leading-relaxed" value={targetText} onChange={(e) => setTargetText(e.target.value)} placeholder="Insert comparative text (Target)..." dir="auto" />
              </div>
            </div>
          </div>

          {/* Configuration Section */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            <div className="bg-white p-6 border border-gray-200 shadow-md rounded-sm flex-1">
              <h2 className="text-xs font-bold uppercase text-gray-400 border-b border-gray-100 pb-2 mb-6 tracking-widest">Collation Parameters</h2>
              <div className="grid grid-cols-1 gap-6 mb-8">
                <div>
                  <label className="block text-[11px] font-bold text-academic-blue mb-2 uppercase">Analysis Algorithm</label>
                  <select value={config.algorithm} onChange={(e) => setConfig({ ...config, algorithm: e.target.value as any })} className="w-full p-2.5 border border-gray-200 rounded-sm text-xs bg-white focus:ring-2 focus:ring-academic-gold/20 outline-none shadow-sm">
                    <option value="smith-waterman">Smith-Waterman (Local Alignment)</option>
                    <option value="coptic-aware">Coptic-Aware (Vowel & Mark Norm)</option>
                    <option value="levenshtein">Levenshtein (Edit Distance)</option>
                    <option value="jaccard">Jaccard (Set Similarity)</option>
                    <option value="word-ngram">Word-Level N-Gram</option>
                    <option value="char-ngram">Character-Level N-Gram</option>
                  </select>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-academic-blue mb-2 uppercase">Similarity Threshold: {config.threshold}%</label>
                    <input type="range" min="20" max="100" value={config.threshold} onChange={(e) => setConfig({ ...config, threshold: Number(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-academic-gold" />
                  </div>
                  <div className="w-20">
                    <label className="block text-[11px] font-bold text-academic-blue mb-2 uppercase">N-Size</label>
                    <input type="number" min="1" max="20" value={config.windowSize} onChange={(e) => setConfig({...config, windowSize: Number(e.target.value)})} className="w-full p-1.5 border border-gray-200 rounded-sm text-xs shadow-sm" />
                  </div>
                </div>
              </div>
              <button onClick={performAnalysis} disabled={isProcessing} className="w-full py-4 bg-academic-gold text-white font-bold uppercase tracking-[0.2em] text-xs rounded-sm hover:bg-academic-blue hover:shadow-lg transition-all active:scale-[0.98] shadow-md flex justify-center items-center gap-3">
                {isProcessing ? (
                   <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    PROCESSING LARGE DATASET...
                   </>
                ) : 'RUN COLLATION ENGINE'}
              </button>
            </div>
            
            <div className="bg-academic-blue p-6 border border-academic-lightBlue rounded-sm shadow-md">
               <h3 className="text-xs font-bold text-academic-gold uppercase mb-3 tracking-widest flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" fillRule="evenodd" clipRule="evenodd"></path></svg>
                  N-Gram Definition
               </h3>
               <p className="text-[11px] leading-relaxed text-gray-300 font-sans italic">
                 An <b>N-Gram</b> is a contiguous sequence of <i>n</i> items from a given text. 
                 <b> Character N-grams</b> (e.g., n=4) are excellent for identifying similarities in scripts without spaces or with spelling variations. 
                 <b> Word N-grams</b> (e.g., n=3) focus on phrasal reuse while ignoring minor character mismatches.
               </p>
            </div>
          </div>
        </div>

        {result && (
          <div className="flex flex-col gap-8 animate-fade-in flex-1">
            {/* Global Stats Dashboard */}
            <div className="bg-white px-8 py-6 rounded-sm border border-gray-200 shadow-lg flex flex-wrap justify-between items-center gap-8 divide-x divide-gray-100">
               <div className="flex flex-wrap gap-0">
                 <StatItem 
                   label="Mean Similarity" 
                   value={`${result.stats.meanSimilarity.toFixed(1)}%`} 
                   description="The average similarity score across all detected matches. High values (>90%) indicate verbatim quotations, while lower values suggest paraphrasing or textual evolution." 
                 />
                 <StatItem 
                   label="Reuse Coverage" 
                   value={`${result.stats.coverage.toFixed(1)}%`} 
                   description="The percentage of the total text length occupied by detected reuses. A high coverage implies that one witness is largely derived from or identical to the other." 
                 />
                 <StatItem 
                   label="Alignments" 
                   value={result.stats.totalAlignments} 
                   description="Total number of distinct parallel passages identified by the algorithm." 
                 />
                 <StatItem 
                   label="Unique N-Grams" 
                   value={result.stats.uniqueNgrams} 
                   description="The count of distinct matching sequences. If a specific phrase is reused 10 times, it counts as 10 alignments but only 1 unique N-gram." 
                 />
               </div>
               <div className="flex flex-col gap-2 pl-8 border-l border-gray-100">
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Total Token Count</div>
                  <div className="flex gap-4">
                    <div className="px-3 py-1 bg-academic-lightBlue text-white rounded-full text-[10px] font-mono">α: {result.tokensA.length}</div>
                    <div className="px-3 py-1 bg-academic-gold text-white rounded-full text-[10px] font-mono">β: {result.tokensB.length}</div>
                  </div>
               </div>
            </div>

            {/* Macro-level Alignment Flow */}
            <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-lg">
              <h3 className="text-xs font-bold uppercase text-academic-blue tracking-widest mb-4">Macro-Level Alignment Flow</h3>
              <AlignmentFlow matches={result.matches} sourceLength={result.tokensA.length} targetLength={result.tokensB.length} onSelectMatch={setSelectedMatch} selectedMatch={selectedMatch} />
            </div>

            {/* Main Visual/Analysis Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full min-h-[750px]">
              {/* Left Column: Parallel Viewer & Navigation Map */}
              <div className="xl:col-span-7 flex flex-col h-full bg-white shadow-xl rounded-sm overflow-hidden border border-gray-200">
                <ParallelViewer tokensA={result.tokensA} tokensB={result.tokensB} alignments={result.alignments} matches={result.matches} onSelectMatch={setSelectedMatch} selectedMatch={selectedMatch} />
              </div>

              {/* Right Column: High-Density Analytics & Navigation */}
              <div className="xl:col-span-5 flex flex-col gap-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                   {/* Match Gallery (Sidebar) */}
                   <div className="bg-white border border-gray-200 rounded-sm shadow-lg flex flex-col overflow-hidden">
                      <div className="bg-academic-paper px-4 py-3 border-b border-gray-200 flex justify-between items-center shrink-0">
                        <span className="text-[11px] font-bold uppercase text-academic-blue tracking-widest">Match Gallery</span>
                        <div className="px-2 py-0.5 bg-academic-gold/20 text-academic-gold text-[9px] font-bold rounded">TOP REUSES</div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-gray-50/20">
                        {sortedMatches.map((m, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setSelectedMatch(m)}
                            className={`group p-3 rounded border cursor-pointer transition-all duration-200 hover:shadow-md ${selectedMatch === m ? 'border-academic-red bg-academic-red/5 ring-1 ring-academic-red' : 'border-gray-200 bg-white hover:border-academic-gold'}`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[9px] font-mono font-bold text-gray-400">Rank #{idx+1}</span>
                              <div className="flex items-center gap-2">
                                <div className="h-1 w-12 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-academic-gold" style={{ width: `${m.similarity}%` }}></div>
                                </div>
                                <span className={`text-[11px] font-bold ${m.similarity >= 95 ? 'text-green-600' : (m.similarity >= 80 ? 'text-blue-600' : 'text-academic-gold')}`}>{m.similarity.toFixed(1)}%</span>
                              </div>
                            </div>
                            <div className="text-[12px] font-coptic text-academic-blue leading-tight line-clamp-2 group-hover:text-black italic">
                              "{m.sourcePhrase}"
                            </div>
                          </div>
                        ))}
                        {sortedMatches.length === 0 && (
                          <div className="h-full flex flex-col items-center justify-center text-gray-300 py-20 px-10 text-center">
                            <svg className="w-12 h-12 mb-4 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                            <p className="text-xs uppercase font-bold tracking-widest">No Matches Detected</p>
                            <p className="text-[10px] mt-1">Try lowering the threshold or increasing window size.</p>
                          </div>
                        )}
                      </div>
                   </div>
                   {/* Heatmap (Position Correspondence) */}
                   <Heatmap matches={result.matches} sourceLength={result.tokensA.length} targetLength={result.tokensB.length} onSelectMatch={setSelectedMatch} selectedMatch={selectedMatch} />
                </div>

                <div className="flex flex-col gap-8">
                   {/* Similarity Histogram */}
                   <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm">
                     <h3 className="text-[10px] font-bold uppercase text-academic-blue tracking-widest mb-2">Similarity Distribution</h3>
                     <SimilarityHistogram matches={result.matches} />
                   </div>
                   {/* Network Graph (Cluster Discovery) */}
                   <NetworkGraph matches={result.matches} onSelectMatch={setSelectedMatch} selectedMatch={selectedMatch} />
                   {/* Dispersion Plot (Distribution) */}
                   <DispersionPlot matches={result.matches} sourceLength={result.tokensA.length} targetLength={result.tokensB.length} onSelectMatch={setSelectedMatch} selectedMatch={selectedMatch} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Visual Footer */}
      <footer className="mt-auto py-6 border-t border-gray-200 bg-white text-center">
         <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em]">Advanced Digital Humanities Collation Tool • v2.5 Enterprise</p>
      </footer>
    </div>
  );
};

export default App;