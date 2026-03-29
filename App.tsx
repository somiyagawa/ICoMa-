import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { AnalysisConfig, AnalysisResult, Match } from './types';
import { runAnalysis } from './services/collationUtils';
import { Language, LANGUAGES, t } from './services/i18n';
import Heatmap from './components/Heatmap';
import NetworkGraph from './components/NetworkGraph';
import ParallelViewer from './components/ParallelViewer';
import DispersionPlot from './components/DispersionPlot';
import AlignmentFlow from './components/AlignmentFlow';
import SimilarityHistogram from './components/SimilarityHistogram';
import AIAnalysisPanel from './components/AIAnalysisPanel';
import ChartToolbar, { ZoomControls, FullscreenButton } from './components/ChartControls';
import { getHelpContent, getAlgorithmHelp, getIntertextualityCategoryHelp } from './services/helpContent';
import DiffView from './components/DiffView';
import HistoryPanel from './components/HistoryPanel';
import { HistorySession, saveSession } from './services/historyDB';
import { runOnnxAnalysis, OnnxAnalysisProgress } from './services/onnxAnalysis';
import { downloadReport, ReportData } from './services/reportGenerator';

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
  },
  arabic: {
    label: 'Arabic (Ibn Khaldun & Summary)',
    a: "اعلم أن فن التاريخ فن عزيز المذهب جم الفوائد شريف الغاية إذ هو يوقفنا على أحوال الماضين من الأمم في أخلاقهم والأنبياء في سيرهم والملوك في دولهم وسياستهم حتى تتم فائدة الاقتداء في ذلك لمن يرومه في أحوال الدين والدنيا. فهو محتاج إلى مآخذ متعددة ومعارف متنوعة وحسن نظر وتثبت يفضيان بصاحبهما إلى الحق وينكبان به عن المزلات والمغالط.",
    b: "يقول ابن خلدون في مقدمته المشهورة إن فن التاريخ هو فن عزيز المذهب وجم الفوائد وشريف الغاية. والسبب في ذلك أنه يوقفنا على أحوال الماضين من الأمم في أخلاقهم، وكذلك الأنبياء في سيرهم، والملوك في دولهم وسياستهم. وبذلك تتم فائدة الاقتداء لمن يريده في أمور الدين والدنيا. ولذلك فإن المؤرخ محتاج إلى مآخذ متعددة ومعارف متنوعة، بالإضافة إلى حسن نظر وتثبت للوصول إلى الحق وتجنب المغالط."
  },
  ancient_greek: {
    label: 'Ancient Greek (Plato & Summary)',
    a: "Ὅτι μὲν ὑμεῖς, ὦ ἄνδρες Ἀθηναῖοι, πεπόνθατε ὑπὸ τῶν ἐμῶν κατηγόρων, οὐκ οἶδα· ἐγὼ δ' οὖν καὶ αὐτὸς ὑπ' αὐτῶν ὀλίγου ἐμαυτοῦ ἐπελαθόμην, οὕτω πιθανῶς ἔλεγον. Καίτοι ἀληθές γε ὡς ἔπος εἰπεῖν οὐδὲν εἰρήκασιν. Μάλιστα δὲ αὐτῶν ἓν ἐθαύμασα τῶν πολλῶν ὧν ἐψεύσαντο, τοῦτο ἐν ᾧ ἔλεγον ὡς χρῆν ὑμᾶς εὐλαβεῖσθαι μὴ ὑπ' ἐμοῦ ἐξαπατηθῆτε ὡς δεινοῦ ὄντος λέγειν.",
    b: "Πλάτωνος Ἀπολογία Σωκράτους. Ἄρχεται ὁ Σωκράτης λέγων: Ὅτι μὲν ὑμεῖς, ὦ ἄνδρες Ἀθηναῖοι, πεπόνθατε ὑπὸ τῶν ἐμῶν κατηγόρων, οὐκ οἶδα. Ἐγὼ δὲ καὶ αὐτὸς ὑπ' αὐτῶν ὀλίγου ἐμαυτοῦ ἐπελαθόμην, ἐπειδὴ οὕτω πιθανῶς ἔλεγον. Ἀλλὰ ἀληθές γε ὡς ἔπος εἰπεῖν οὐδὲν εἰρήκασιν. Ἐθαύμασα δὲ μάλιστα ἓν τῶν πολλῶν ὧν ἐψεύσαντο, ὅτε ἔλεγον ὡς χρῆν ὑμᾶς εὐλαβεῖσθαι μὴ ὑπ' ἐμοῦ ἐξαπατηθῆτε ὡς δεινοῦ ὄντος λέγειν."
  },
  old_japanese: {
    label: 'Old Japanese (万葉集 & 注釈)',
    a: "春過而　夏来良之　白妙之　衣乾有　天之香来山　（巻1・28　持統天皇）。田子之浦ゆ　うち出でてみれば　真白にそ　富士之高嶺に　雪者降りける　（巻3・318　山部赤人）。銀も金も玉も何せむに　優れる宝　子にしかめやも　（巻5・803　山上憶良）。今日　いく程經ぬか　君が逢はむ時のあたりまで　あぢきなく　そむきてあるを　我が盛りかも　（巻4・545　譲位皇后）。紅之　うすくもあらず　もゝの花　咲きたる君を　誰か忘れむ　（巻8・1420　大伴旅人）。妻問ふと　この月夜に　笹の葉の　ゆらぐを見てぞ　我が恋しぐき　（巻10・1895　未詳）。",
    b: "万葉集注釈。春過而　夏来良之　白妙之　衣乾有　天之香来山　とは、春が過ぎて夏が来て、白妙なる衣を干す天のかぐはしき香来山のことなり。此は持統天皇の御製なり。又、田子之浦ゆ　うち出でてみれば　真白にそ　富士之高嶺に　雪者降りける　は山部赤人の作にして、富士の雄大なる眺望を詠みたるなり。銀も金も玉も何せむに　優れる宝　子にしかめやも　は山上憶良が子を慈しむ心を表現せる名歌なり。今日　いく程經ぬか　君が逢はむ時のあたりまで　とは愛する者との再会を待つ心切なる思いを詠みたり。妻問ふと　この月夜に　笹の葉の　ゆらぐを見てぞ　とは恋する者の心の動揺を自然現象になぞらへて詠めるなり。是等の歌は皆古代日本の情操の深さを示すものなり。"
  }
};

// Color mapping for Tailwind-safe inline styles (dynamic class names are purged at build time)
const COLOR_STYLES: Record<string, { border: string; bg: string; text: string }> = {
  red:    { border: '#fecaca', bg: '#fef2f2', text: '#b91c1c' },
  purple: { border: '#e9d5ff', bg: '#faf5ff', text: '#7e22ce' },
  indigo: { border: '#c7d2fe', bg: '#eef2ff', text: '#4338ca' },
  amber:  { border: '#fde68a', bg: '#fffbeb', text: '#b45309' },
  teal:   { border: '#99f6e4', bg: '#f0fdfa', text: '#0f766e' },
  cyan:   { border: '#a5f3fc', bg: '#ecfeff', text: '#0e7490' },
  lime:   { border: '#bef264', bg: '#f7fee7', text: '#4d7c0f' },
  gray:   { border: '#e5e7eb', bg: '#f9fafb', text: '#374151' },
  green:  { border: '#bbf7d0', bg: '#f0fdf4', text: '#15803d' },
  blue:   { border: '#bfdbfe', bg: '#eff6ff', text: '#1d4ed8' },
};

const colorStyle = (colorClass?: string) => {
  const c = COLOR_STYLES[colorClass || 'gray'] || COLOR_STYLES.gray;
  return {
    wrapper: { borderColor: c.border, backgroundColor: c.bg } as React.CSSProperties,
    label: { color: c.text } as React.CSSProperties,
  };
};

// Helper to render localized help content
const renderHelpContent = (topic: string, lang: Language): { title: string, content: React.ReactNode } | null => {
  const helpTopics = getHelpContent(lang);
  const prosLabel = { en: 'Pros', ja: '長所', zh: '优点', ko: '장점', de: 'Vorteile', la: 'Commoditates', it: 'Vantaggi' }[lang];
  const consLabel = { en: 'Cons', ja: '短所', zh: '缺点', ko: '단점', de: 'Nachteile', la: 'Incommoda', it: 'Svantaggi' }[lang];
  const bestForLabel = { en: 'Best for', ja: '最適な用途', zh: '最适合', ko: '최적 용도', de: 'Am besten für', la: 'Optimum est', it: 'Ideale per' }[lang];
  const tipLabel = { en: 'Pro Tip', ja: 'ヒント', zh: '提示', ko: '팁', de: 'Tipp', la: 'Consilium', it: 'Suggerimento' }[lang];

  if (topic === 'algorithm') {
    const algorithms = getAlgorithmHelp(lang);
    return {
      title: helpTopics.algorithm?.title || 'Analysis Algorithms',
      content: (
        <div className="space-y-4">
          {algorithms.map((alg, i) => (
            <div key={i} className="border border-gray-100 rounded-sm p-4 bg-gray-50/50">
              <h3 className="font-bold text-academic-blue text-base mb-1">{alg.name}</h3>
              <p className="mb-2 text-gray-600">{alg.description}</p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div><span className="font-bold text-green-600">{prosLabel}:</span> {alg.pros}</div>
                <div><span className="font-bold text-red-500">{consLabel}:</span> {alg.cons}</div>
              </div>
              <div className="mt-2 text-xs"><span className="font-bold text-academic-gold">{bestForLabel}:</span> {alg.bestFor}</div>
            </div>
          ))}
        </div>
      )
    };
  }

  if (topic === 'aiIntertextualityMethod') {
    const categories = getIntertextualityCategoryHelp(lang);
    const methodTopic = helpTopics.aiIntertextualityMethod;
    return {
      title: methodTopic?.title || 'Intertextuality Classification Taxonomy',
      content: (
        <div className="space-y-4">
          {methodTopic && <p className="text-gray-600">{methodTopic.body}</p>}
          <div className="grid grid-cols-1 gap-2 text-xs">
            {categories.map((cat, i) => {
              const cs = colorStyle(cat.colorClass);
              return (
                <div key={i} className="border rounded-sm p-2" style={cs.wrapper}>
                  <span className="font-bold" style={cs.label}>{cat.name}:</span> {cat.description}
                </div>
              );
            })}
          </div>
        </div>
      )
    };
  }

  const ht = helpTopics[topic];
  if (!ht) return null;
  return {
    title: ht.title,
    content: (
      <div className="space-y-4">
        <p className="text-gray-600">{ht.body}</p>
        {ht.items && (
          <div className="grid grid-cols-1 gap-4 text-xs">
            {ht.items.map((item, i) => {
              const cs = colorStyle(item.colorClass);
              return (
                <div key={i} className="border rounded-sm p-3" style={cs.wrapper}>
                  <span className="font-bold block mb-1" style={cs.label}>{item.label}</span>
                  {item.text}
                </div>
              );
            })}
          </div>
        )}
        {ht.tip && (
          <div className="mt-4 text-xs bg-blue-50 text-blue-800 p-3 rounded-sm border border-blue-100">
            <span className="font-bold">{tipLabel}:</span> {ht.tip}
          </div>
        )}
      </div>
    )
  };
};


const HelpButton = ({ topic, onClick }: { topic: string, onClick: (topic: string) => void }) => (
  <button 
    onClick={() => onClick(topic)} 
    className="text-gray-400 hover:text-academic-blue transition-colors ml-1 focus:outline-none" 
    title="Help"
  >
    <svg className="w-3.5 h-3.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </button>
);

const StatItem = ({ label, value, description, topic, onHelpClick }: { label: string, value: string | number, description: string, topic?: string, onHelpClick?: (topic: string) => void }) => (
  <div className="group relative flex flex-col border-r border-gray-100 last:border-0 px-6">
    <div className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1.5">
      {label}
      {topic && onHelpClick ? (
        <HelpButton topic={topic} onClick={onHelpClick} />
      ) : (
        <span className="text-academic-gold cursor-help">ⓘ</span>
      )}
    </div>
    <div className="text-3xl font-serif font-bold text-academic-blue leading-tight">{value}</div>
    {!topic && (
      <div className="absolute top-full left-6 mt-2 hidden group-hover:block z-[100] bg-academic-blue text-white text-[11px] p-4 rounded shadow-2xl w-64 leading-relaxed border border-academic-lightBlue">
        <div className="font-bold text-academic-gold mb-1">{label}</div>
        {description}
      </div>
    )}
  </div>
);

const App: React.FC = () => {
  const [sourceText, setSourceText] = useState(EXAMPLES.english_long.a);
  const [targetText, setTargetText] = useState(EXAMPLES.english_long.b);
  const [config, setConfig] = useState<AnalysisConfig>({
    windowSize: 4,
    threshold: 60,
    algorithm: 'levenshtein',
    scriptMode: 'auto'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [collationTrigger, setCollationTrigger] = useState(0);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [fontSize, setFontSize] = useState<number>(14);
  const [fontFamily, setFontFamily] = useState<string>('serif');
  const [galleryZoom, setGalleryZoom] = useState<number>(1.0);
  const [activeHelpModal, setActiveHelpModal] = useState<string | null>(null);
  const [witnessAlphaName, setWitnessAlphaName] = useState<string>('Witness α');
  const [witnessBetaName, setWitnessBetaName] = useState<string>('Witness β');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [onnxProgress, setOnnxProgress] = useState<OnnxAnalysisProgress | null>(null);
  const [showReportMenu, setShowReportMenu] = useState(false);

  // Close report menu on outside click
  useEffect(() => {
    if (!showReportMenu) return;
    const handler = (e: MouseEvent) => setShowReportMenu(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showReportMenu]);

  // Refs for chart containers (fullscreen + download)
  const alignmentFlowRef = useRef<HTMLDivElement>(null);
  const histogramRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<HTMLDivElement>(null);
  const dispersionRef = useRef<HTMLDivElement>(null);
  const matchGalleryScrollRef = useRef<HTMLDivElement>(null);
  const matchGalleryContainerRef = useRef<HTMLDivElement>(null);
  const [galleryFullscreen, setGalleryFullscreen] = useState(false);

  const performAnalysis = useCallback(async () => {
    if (!sourceText || !targetText) return;
    setIsProcessing(true);
    setOnnxProgress(null);

    if (config.algorithm === 'onnx-semantic') {
      try {
        const res = await runOnnxAnalysis(
          sourceText, targetText,
          config.windowSize, config.threshold,
          (p) => setOnnxProgress(p)
        );
        // Compute stats
        const totalSim = res.matches.reduce((s, m) => s + m.similarity, 0);
        const meanSimilarity = res.matches.length > 0 ? totalSim / res.matches.length : 0;
        const uniquePhrases = new Set(res.matches.map(m => m.sourcePhrase));
        const coveredPositions = new Set<number>();
        res.matches.forEach(m => {
          for (let i = m.sourcePosition; i < m.sourcePosition + (m.length || config.windowSize); i++) {
            coveredPositions.add(i);
          }
        });
        const coverage = res.tokensA.length > 0 ? (coveredPositions.size / res.tokensA.length) * 100 : 0;

        setResult({
          tokensA: res.tokensA,
          tokensB: res.tokensB,
          matches: res.matches,
          alignments: res.matches.map(m => ({ sourceIndex: m.sourcePosition, targetIndex: m.targetPosition, similarity: m.similarity, sourceText: m.sourcePhrase, targetText: m.targetPhrase })),
          stats: {
            meanSimilarity,
            coverage,
            totalAlignments: res.matches.length,
            uniqueNgrams: uniquePhrases.size,
          },
        });
        setSelectedMatch(null);
        setCollationTrigger(prev => prev + 1);
      } catch (err) {
        console.error('ONNX analysis failed:', err);
        alert('ONNX semantic analysis failed. Check console for details.');
      } finally {
        setIsProcessing(false);
        setOnnxProgress(null);
      }
    } else {
      // Use timeout to allow UI to render 'Processing' state
      setTimeout(() => {
        const res = runAnalysis(sourceText, targetText, config);
        setResult(res);
        setSelectedMatch(null);
        setIsProcessing(false);
        setCollationTrigger(prev => prev + 1);
      }, 50);
    }
  }, [sourceText, targetText, config]);

  const handleSaveSession = useCallback(async () => {
    if (!result) return;
    const label = `${witnessAlphaName} ↔ ${witnessBetaName} — ${new Date().toLocaleString()}`;
    try {
      await saveSession({
        timestamp: Date.now(),
        label,
        witnessAlphaName,
        witnessBetaName,
        sourceText,
        targetText,
        config,
        result,
      });
      alert(t(lang, 'Session saved to history'));
    } catch (err) {
      console.error('Failed to save session:', err);
    }
  }, [result, witnessAlphaName, witnessBetaName, sourceText, targetText, config, lang]);

  const handleLoadSession = useCallback((session: HistorySession) => {
    setSourceText(session.sourceText);
    setTargetText(session.targetText);
    setConfig(session.config);
    setWitnessAlphaName(session.witnessAlphaName);
    setWitnessBetaName(session.witnessBetaName);
    setResult(session.result);
    setSelectedMatch(null);
    setCollationTrigger(prev => prev + 1);
  }, []);

  const handleDownloadReport = useCallback(async (format: 'pdf' | 'docx' | 'latex' | 'tei-xml') => {
    if (!result) return;
    const reportData: ReportData = {
      witnessAlphaName,
      witnessBetaName,
      sourceText,
      targetText,
      config,
      result,
      date: new Date().toLocaleString(),
    };
    try {
      await downloadReport(reportData, format);
    } catch (err) {
      console.error('Report generation failed:', err);
      alert('Report generation failed. Check console for details.');
    }
    setShowReportMenu(false);
  }, [result, witnessAlphaName, witnessBetaName, sourceText, targetText, config]);

  const sortedMatches = useMemo(() => {
    if (!result) return [];
    return [...result.matches].sort((a, b) => b.similarity - a.similarity);
  }, [result]);

  // Track fullscreen state for Match Gallery
  useEffect(() => {
    const handler = () => {
      setGalleryFullscreen(!!document.fullscreenElement && document.fullscreenElement === matchGalleryContainerRef.current);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Scroll Match Gallery to the selected match
  useEffect(() => {
    if (!selectedMatch || !matchGalleryScrollRef.current) return;
    const idx = sortedMatches.findIndex(m => m === selectedMatch);
    if (idx < 0) return;
    const card = matchGalleryScrollRef.current.querySelector(`[data-match-index="${idx}"]`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedMatch, sortedMatches]);

  // Scroll D3 charts to selected match (for scrollable containers)
  useEffect(() => {
    if (!selectedMatch) return;
    // For each D3 chart container, find the selected rect/path and scroll into view
    const scrollToSelectedInContainer = (ref: React.RefObject<HTMLDivElement | null>) => {
      if (!ref.current) return;
      const svg = ref.current.querySelector('svg');
      if (!svg) return;
      // D3 charts highlight selected elements with specific stroke or fill
      // The SVG is typically fully visible, so no scroll needed unless in a scrollable wrapper
      const scrollParent = svg.parentElement;
      if (scrollParent && scrollParent.scrollHeight > scrollParent.clientHeight) {
        // Find the red-highlighted element (selected)
        const selected = svg.querySelector('[stroke="black"]') || svg.querySelector('[fill="#c9302c"]');
        if (selected) {
          const rect = (selected as Element).getBoundingClientRect();
          const parentRect = scrollParent.getBoundingClientRect();
          scrollParent.scrollTo({
            top: scrollParent.scrollTop + (rect.top - parentRect.top) - 20,
            behavior: 'smooth'
          });
        }
      }
    };
    scrollToSelectedInContainer(alignmentFlowRef);
    scrollToSelectedInContainer(histogramRef);
    scrollToSelectedInContainer(networkRef);
    scrollToSelectedInContainer(dispersionRef);
  }, [selectedMatch]);

  const FONT_FAMILIES = [
    { value: 'serif', label: 'Serif (Default)' },
    { value: 'sans-serif', label: 'Sans-Serif' },
    { value: 'monospace', label: 'Monospace' },
    { value: '"Noto Serif", serif', label: 'Noto Serif' },
    { value: '"Noto Sans Coptic", sans-serif', label: 'Noto Sans Coptic' },
  ];

  return (
    <div className="min-h-screen bg-academic-cream text-academic-blue pb-20 flex flex-col" style={{ fontFamily: fontFamily }}>
      <header className="bg-gradient-to-r from-academic-lightBlue to-academic-blue text-white border-b-4 border-academic-red px-6 py-5 shadow-lg shrink-0">
        <div className="w-full flex justify-between items-center">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-gray-300 mb-1 font-sans font-semibold">So Miyagawa Computational Linguistics Lab, University of Tsukuba</div>
            <h1 className="text-3xl font-bold font-serif tracking-tight">{t(lang, 'ICoMa')} <span className="text-academic-gold font-light ml-3 text-xl opacity-80 italic">{t(lang, 'Intertextuality Collation Machine')}</span></h1>
          </div>
          <div className="hidden lg:flex items-center gap-6">
             {/* Language Selector */}
             <div>
                <div className="text-[10px] text-gray-400 uppercase font-sans mb-1">{t(lang, 'UI Language')}</div>
                <select
                  value={lang}
                  onChange={e => setLang(e.target.value as Language)}
                  className="bg-white/10 border border-white/20 text-white text-[11px] px-2 py-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-academic-gold cursor-pointer"
                >
                  {(Object.entries(LANGUAGES) as [Language, string][]).map(([code, name]) => (
                    <option key={code} value={code} className="text-academic-blue bg-white">{name}</option>
                  ))}
                </select>
             </div>

             {/* Font Controls */}
             <div>
                <div className="text-[10px] text-gray-400 uppercase font-sans mb-1">{t(lang, 'Font')}</div>
                <div className="flex items-center gap-1">
                  <select
                    value={fontFamily}
                    onChange={e => setFontFamily(e.target.value)}
                    className="bg-white/10 border border-white/20 text-white text-[10px] px-1.5 py-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-academic-gold cursor-pointer max-w-[110px]"
                  >
                    {FONT_FAMILIES.map(f => (
                      <option key={f.value} value={f.value} className="text-academic-blue bg-white">{f.label}</option>
                    ))}
                  </select>
                  <button onClick={() => setFontSize(s => Math.max(10, s - 1))} className="bg-white/10 border border-white/20 text-white text-[11px] w-6 h-6 rounded-sm hover:bg-white/20 transition-colors flex items-center justify-center" title={t(lang, 'Decrease font size')}>−</button>
                  <span className="text-[10px] font-mono text-gray-300 w-7 text-center">{fontSize}</span>
                  <button onClick={() => setFontSize(s => Math.min(24, s + 1))} className="bg-white/10 border border-white/20 text-white text-[11px] w-6 h-6 rounded-sm hover:bg-white/20 transition-colors flex items-center justify-center" title={t(lang, 'Increase font size')}>+</button>
                </div>
             </div>

             {/* Bug Report / Feature Request */}
             <a
               href="https://github.com/somiyagawa/ICoMa-/issues/new"
               target="_blank"
               rel="noopener noreferrer"
               className="flex flex-col items-center gap-1 group"
               title={t(lang, 'Bug Report / Feature Request')}
             >
               <div className="text-[10px] text-gray-400 uppercase font-sans">{t(lang, 'Bug Report / Feature Request')}</div>
               <div className="flex items-center gap-1.5 text-[11px] text-yellow-300 group-hover:text-yellow-100 transition-colors">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                 </svg>
                 <span className="font-mono">{t(lang, 'GitHub Issues')}</span>
               </div>
             </a>

             {/* History + Save + Report */}
             <div className="flex items-center gap-2">
                {result && (
                  <>
                    <button onClick={handleSaveSession} className="flex flex-col items-center gap-0.5 group" title={t(lang, 'Save Session')}>
                      <div className="text-[10px] text-gray-400 uppercase font-sans">{t(lang, 'Save')}</div>
                      <svg className="w-5 h-5 text-green-400 group-hover:text-green-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                    </button>
                    <div className="relative">
                      <button onClick={(e) => { e.stopPropagation(); setShowReportMenu(!showReportMenu); }} className="flex flex-col items-center gap-0.5 group" title={t(lang, 'Download Report')}>
                        <div className="text-[10px] text-gray-400 uppercase font-sans">{t(lang, 'Report')}</div>
                        <svg className="w-5 h-5 text-yellow-300 group-hover:text-yellow-100 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </button>
                      {showReportMenu && (
                        <div className="absolute top-full right-0 mt-1 bg-white rounded shadow-xl border border-gray-200 py-1 z-50 min-w-[160px]">
                          <button onClick={() => handleDownloadReport('pdf')} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-mono">PDF</button>
                          <button onClick={() => handleDownloadReport('docx')} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-mono">DOCX (Word)</button>
                          <button onClick={() => handleDownloadReport('latex')} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-mono">LaTeX (.tex)</button>
                          <button onClick={() => handleDownloadReport('tei-xml')} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-mono">TEI XML (P5)</button>
                        </div>
                      )}
                    </div>
                  </>
                )}
                <button onClick={() => setIsHistoryOpen(true)} className="flex flex-col items-center gap-0.5 group" title={t(lang, 'Session History')}>
                  <div className="text-[10px] text-gray-400 uppercase font-sans">{t(lang, 'History')}</div>
                  <svg className="w-5 h-5 text-blue-300 group-hover:text-blue-100 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
             </div>

             {/* Engine Status */}
             <div className="text-right">
                <div className="text-[10px] text-gray-400 uppercase font-sans">{t(lang, 'Engine Status')}</div>
                <div className="text-xs text-green-400 font-mono flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {t(lang, 'READY FOR COLLATION')}
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
              <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center mr-2">{t(lang, 'Quick Load')}:</span>
              {Object.entries(EXAMPLES).map(([key, val]) => (
                <button key={key} onClick={() => { setSourceText(val.a); setTargetText(val.b); }} className="text-[10px] px-3 py-1.5 bg-gray-50 border border-gray-200 hover:bg-academic-blue hover:text-white hover:border-academic-blue transition-all uppercase font-mono rounded-sm shadow-sm">{val.label}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2 px-1">
                   <div className="flex items-center gap-1.5">
                     <span className="text-[10px] font-bold shrink-0 w-4 h-4 rounded-full flex items-center justify-center" style={{background:'#2563eb', color:'#fff'}}>α</span>
                     <div className="relative group">
                       <input
                         type="text"
                         value={witnessAlphaName}
                         onChange={(e) => setWitnessAlphaName(e.target.value)}
                         className="text-[11px] font-bold text-academic-blue tracking-wider bg-yellow-50 border border-dashed border-amber-300 hover:border-amber-500 focus:border-academic-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-academic-gold/30 transition-all px-2 py-1 rounded min-w-0"
                         style={{ maxWidth: '200px' }}
                         title={t(lang, 'Click to rename')}
                       />
                       <svg className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-amber-400 group-hover:text-amber-600 pointer-events-none transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                     </div>
                     <HelpButton topic="witnessAlpha" onClick={setActiveHelpModal} />
                   </div>
                   <span className="text-[9px] text-gray-400 font-mono">{sourceText.length} {t(lang, 'chars')}</span>
                </div>
                <textarea className="w-full h-40 p-4 font-coptic border border-gray-200 rounded-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-academic-gold/20 focus:border-academic-gold outline-none transition-all shadow-inner leading-relaxed" style={{ fontSize: `${fontSize}px` }} value={sourceText} onChange={(e) => setSourceText(e.target.value)} placeholder={t(lang, 'Insert primary text (Source)...')} dir="auto" />
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2 px-1">
                   <div className="flex items-center gap-1.5">
                     <span className="text-[10px] font-bold shrink-0 w-4 h-4 rounded-full flex items-center justify-center" style={{background:'#d97706', color:'#fff'}}>β</span>
                     <div className="relative group">
                       <input
                         type="text"
                         value={witnessBetaName}
                         onChange={(e) => setWitnessBetaName(e.target.value)}
                         className="text-[11px] font-bold text-academic-blue tracking-wider bg-yellow-50 border border-dashed border-amber-300 hover:border-amber-500 focus:border-academic-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-academic-gold/30 transition-all px-2 py-1 rounded min-w-0"
                         style={{ maxWidth: '200px' }}
                         title={t(lang, 'Click to rename')}
                       />
                       <svg className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-amber-400 group-hover:text-amber-600 pointer-events-none transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                     </div>
                     <HelpButton topic="witnessBeta" onClick={setActiveHelpModal} />
                   </div>
                   <span className="text-[9px] text-gray-400 font-mono">{targetText.length} {t(lang, 'chars')}</span>
                </div>
                <textarea className="w-full h-40 p-4 font-coptic border border-gray-200 rounded-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-academic-gold/20 focus:border-academic-gold outline-none transition-all shadow-inner leading-relaxed" style={{ fontSize: `${fontSize}px` }} value={targetText} onChange={(e) => setTargetText(e.target.value)} placeholder={t(lang, 'Insert comparative text (Target)...')} dir="auto" />
              </div>
            </div>
          </div>

          {/* Configuration Section */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            <div className="bg-white p-6 border border-gray-200 shadow-md rounded-sm flex-1">
              <h2 className="text-xs font-bold uppercase text-gray-400 border-b border-gray-100 pb-2 mb-6 tracking-widest flex items-center justify-between">
                <span>{t(lang, 'Collation Parameters')}</span>
                <HelpButton topic="algorithm" onClick={setActiveHelpModal} />
              </h2>
              <div className="grid grid-cols-1 gap-6 mb-8">
                <div>
                  <label className="block text-[11px] font-bold text-academic-blue mb-2 uppercase">{t(lang, 'Analysis Algorithm')}</label>
                  <select value={config.algorithm} onChange={(e) => setConfig({ ...config, algorithm: e.target.value as any })} className="w-full p-2.5 border border-gray-200 rounded-sm text-xs bg-white focus:ring-2 focus:ring-academic-gold/20 outline-none shadow-sm">
                    <option value="smith-waterman">{t(lang, 'Smith-Waterman (Local Alignment)')}</option>
                    <option value="coptic-aware">{t(lang, 'Coptic-Aware (Vowel & Mark Norm)')}</option>
                    <option value="levenshtein">{t(lang, 'Levenshtein (Edit Distance)')}</option>
                    <option value="jaccard">{t(lang, 'Jaccard (Set Similarity)')}</option>
                    <option value="word-ngram">{t(lang, 'Word-Level N-Gram')}</option>
                    <option value="char-ngram">{t(lang, 'Character-Level N-Gram')}</option>
                    <option value="fasttext">{t(lang, 'FastText-like (Subword N-Grams)')}</option>
                    <option value="word2vec">{t(lang, 'Word2Vec-like (Local Co-occurrence)')}</option>
                    <option value="onnx-semantic">{t(lang, 'ONNX Semantic (Local Embedding)')}</option>
                  </select>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[11px] font-bold text-academic-blue uppercase">{t(lang, 'Similarity Threshold')}: {config.threshold}%</label>
                      <HelpButton topic="threshold" onClick={setActiveHelpModal} />
                    </div>
                    <input type="range" min="20" max="100" value={config.threshold} onChange={(e) => setConfig({ ...config, threshold: Number(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-academic-gold" />
                  </div>
                  <div className="w-20">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[11px] font-bold text-academic-blue uppercase">{t(lang, 'N-Size / Window Size')}</label>
                      <HelpButton topic="nsize" onClick={setActiveHelpModal} />
                    </div>
                    <input type="number" min="1" max="20" value={config.windowSize} onChange={(e) => setConfig({...config, windowSize: Number(e.target.value)})} className="w-full p-1.5 border border-gray-200 rounded-sm text-xs shadow-sm" />
                  </div>
                </div>
              </div>
              <button onClick={performAnalysis} disabled={isProcessing} className="w-full py-4 bg-academic-gold text-white font-bold uppercase tracking-[0.2em] text-xs rounded-sm hover:bg-academic-blue hover:shadow-lg transition-all active:scale-[0.98] shadow-md flex justify-center items-center gap-3">
                {isProcessing ? (
                   <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {onnxProgress ? (
                      <span className="text-[10px]">
                        {onnxProgress.phase === 'model' && t(lang, 'Loading ONNX Model...')}
                        {onnxProgress.phase === 'embedding-alpha' && `${t(lang, 'Embedding')} α: ${onnxProgress.percent}%`}
                        {onnxProgress.phase === 'embedding-beta' && `${t(lang, 'Embedding')} β: ${onnxProgress.percent}%`}
                        {onnxProgress.phase === 'comparing' && `${t(lang, 'Comparing')}: ${onnxProgress.percent}%`}
                      </span>
                    ) : t(lang, 'PROCESSING LARGE DATASET...')}
                   </>
                ) : t(lang, 'RUN COLLATION ENGINE')}
              </button>
            </div>
            
            <div className="bg-academic-blue p-6 border border-academic-lightBlue rounded-sm shadow-md">
               <h3 className="text-xs font-bold text-academic-gold uppercase mb-3 tracking-widest flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" fillRule="evenodd" clipRule="evenodd"></path></svg>
                  {t(lang, 'N-Gram Definition')}
               </h3>
               <p className="text-[11px] leading-relaxed text-gray-300 font-sans italic">
                 {t(lang, 'N-Gram Definition Text')}
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
                   label={t(lang, 'Mean Similarity')}
                   value={`${result.stats.meanSimilarity.toFixed(1)}%`}
                   description={t(lang, 'The average similarity score across all detected matches. High values (>90%) indicate verbatim quotations, while lower values suggest paraphrasing or textual evolution.')}
                   topic="meanSimilarity"
                   onHelpClick={setActiveHelpModal}
                 />
                 <StatItem
                   label={t(lang, 'Reuse Coverage')}
                   value={`${result.stats.coverage.toFixed(1)}%`}
                   description={t(lang, 'The percentage of the total text length occupied by detected reuses. A high coverage implies that one witness is largely derived from or identical to the other.')}
                   topic="reuseCoverage"
                   onHelpClick={setActiveHelpModal}
                 />
                 <StatItem
                   label={t(lang, 'Alignments')}
                   value={result.stats.totalAlignments}
                   description="Total number of distinct parallel passages identified by the algorithm."
                   topic="alignments"
                   onHelpClick={setActiveHelpModal}
                 />
                 <StatItem
                   label={t(lang, 'Unique N-Grams')}
                   value={result.stats.uniqueNgrams}
                   description={t(lang, 'The count of distinct matching sequences. If a specific phrase is reused 10 times, it counts as 10 alignments but only 1 unique N-gram.')}
                   topic="uniqueNgrams"
                   onHelpClick={setActiveHelpModal}
                 />
               </div>
               <div className="flex flex-col gap-2 pl-8 border-l border-gray-100">
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 flex items-center">
                    {t(lang, 'Total Token Count')}
                    <HelpButton topic="totalTokenCount" onClick={setActiveHelpModal} />
                  </div>
                  <div className="flex gap-4">
                    <div className="px-3 py-1 text-white rounded-full text-[10px] font-mono" style={{background:'#2563eb'}}>α: {result.tokensA.length}</div>
                    <div className="px-3 py-1 text-white rounded-full text-[10px] font-mono" style={{background:'#d97706'}}>β: {result.tokensB.length}</div>
                  </div>
               </div>
            </div>

            {/* Macro-level Alignment Flow */}
            <div ref={alignmentFlowRef} className="bg-white p-6 rounded-sm border border-gray-200 shadow-lg">
              <h3 className="text-xs font-bold uppercase text-academic-blue tracking-widest mb-4 flex items-center justify-between">
                <span className="flex items-center">
                  {t(lang, 'Macro-Level Alignment Flow')}
                  <HelpButton topic="macroAlignment" onClick={setActiveHelpModal} />
                </span>
                <ChartToolbar containerRef={alignmentFlowRef} filename="icoma-alignment-flow" />
              </h3>
              <AlignmentFlow matches={result.matches} sourceLength={result.tokensA.length} targetLength={result.tokensB.length} onSelectMatch={setSelectedMatch} selectedMatch={selectedMatch} witnessAlphaName={witnessAlphaName} witnessBetaName={witnessBetaName} />
            </div>

            {/* Main Visual/Analysis Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full min-h-[750px]">
              {/* Left Column: Parallel Viewer & Navigation Map */}
              <div className="xl:col-span-7 flex flex-col h-full bg-white shadow-xl rounded-sm overflow-hidden border border-gray-200">
                <ParallelViewer tokensA={result.tokensA} tokensB={result.tokensB} alignments={result.alignments} matches={result.matches} onSelectMatch={setSelectedMatch} selectedMatch={selectedMatch} witnessAlphaName={witnessAlphaName} witnessBetaName={witnessBetaName} />
              </div>

              {/* Right Column: High-Density Analytics & Navigation */}
              <div className="xl:col-span-5 flex flex-col gap-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[420px]">
                   {/* Match Gallery (Sidebar) */}
                   <div ref={matchGalleryContainerRef} className={`bg-white border border-gray-200 rounded-sm shadow-lg flex flex-col overflow-hidden ${galleryFullscreen ? '' : 'max-h-[420px]'}`} style={galleryFullscreen ? { background: '#f8f7f4' } : undefined}>
                      <div className="bg-academic-paper px-4 py-3 border-b border-gray-200 shrink-0">
                        <div className="flex justify-between items-center">
                          <span className={`font-bold uppercase text-academic-blue tracking-widest flex items-center ${galleryFullscreen ? 'text-base' : 'text-[11px]'}`}>
                            {t(lang, 'Match Gallery')}
                            <HelpButton topic="matchGallery" onClick={setActiveHelpModal} />
                          </span>
                          <div className="flex items-center gap-2">
                            <ZoomControls zoom={galleryZoom} onZoomChange={setGalleryZoom} />
                            <div className="w-px h-3 bg-gray-200"></div>
                            <FullscreenButton containerRef={matchGalleryContainerRef} />
                          </div>
                        </div>
                        {galleryFullscreen && (
                          <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-500">
                            <span className="font-mono">{sortedMatches.length} {t(lang, 'matches ranked by similarity')}</span>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full" style={{background:'#16a34a'}}></span> 95%+</span>
                              <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full" style={{background:'#2563eb'}}></span> 80-94%</span>
                              <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full" style={{background:'#b45309'}}></span> &lt;80%</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div ref={matchGalleryScrollRef} className={`flex-1 overflow-y-auto custom-scrollbar bg-gray-50/20 ${galleryFullscreen ? 'p-6' : 'p-3 space-y-3'}`} style={!galleryFullscreen ? { transform: `scale(${galleryZoom})`, transformOrigin: 'top left', width: galleryZoom !== 1 ? `${100 / galleryZoom}%` : undefined } : { transform: `scale(${galleryZoom})`, transformOrigin: 'top center', width: galleryZoom !== 1 ? `${100 / galleryZoom}%` : undefined, margin: '0 auto' }}>
                        {galleryFullscreen ? (
                          /* === FULLSCREEN RANKING VIEW === */
                          <div className="max-w-5xl mx-auto space-y-4">
                            {sortedMatches.map((m, idx) => {
                              const isTop3 = idx < 3;
                              const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
                              const selected = selectedMatch === m;
                              return (
                                <div
                                  key={idx}
                                  data-match-index={idx}
                                  onClick={() => setSelectedMatch(m)}
                                  className={`rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${selected ? 'border-red-500 ring-2 ring-red-300 shadow-lg' : 'border-gray-200 hover:border-academic-gold'}`}
                                  style={{ background: selected ? '#fef2f2' : '#fff' }}
                                >
                                  {/* Rank header bar */}
                                  <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: selected ? '#fecaca' : '#f3f4f6', background: isTop3 ? `${medalColors[idx]}11` : undefined }}>
                                    <div className="flex items-center gap-3">
                                      {/* Rank badge */}
                                      <div className="flex items-center justify-center rounded-full font-bold text-white shrink-0" style={{
                                        width: isTop3 ? '36px' : '28px',
                                        height: isTop3 ? '36px' : '28px',
                                        fontSize: isTop3 ? '15px' : '11px',
                                        background: isTop3 ? medalColors[idx] : '#9ca3af',
                                        boxShadow: isTop3 ? `0 2px 8px ${medalColors[idx]}66` : undefined,
                                      }}>
                                        {idx + 1}
                                      </div>
                                      <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                          {t(lang, 'Rank')} #{idx + 1} {idx === 0 && `— ${t(lang, 'Best Match')}`}{idx === 1 && '— 2nd'}{idx === 2 && '— 3rd'}
                                        </span>
                                      </div>
                                    </div>
                                    {/* Similarity score + bar */}
                                    <div className="flex items-center gap-3">
                                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{
                                          width: `${m.similarity}%`,
                                          background: m.similarity >= 95 ? '#16a34a' : m.similarity >= 80 ? '#2563eb' : '#b45309'
                                        }}></div>
                                      </div>
                                      <span className="font-mono font-bold text-lg" style={{
                                        color: m.similarity >= 95 ? '#16a34a' : m.similarity >= 80 ? '#2563eb' : '#b45309'
                                      }}>
                                        {m.similarity.toFixed(1)}%
                                      </span>
                                    </div>
                                  </div>
                                  {/* Diff content */}
                                  <div className="px-5 py-4">
                                    <DiffView
                                      source={m.sourcePhrase}
                                      target={m.targetPhrase}
                                      similarity={m.similarity}
                                      fontSize={Math.max(12, fontSize)}
                                      witnessAlphaName={witnessAlphaName}
                                      witnessBetaName={witnessBetaName}
                                    />
                                    {/* Position info */}
                                    <div className="flex gap-4 mt-3 text-[9px] text-gray-400 font-mono">
                                      <span title={witnessAlphaName} className="truncate" style={{maxWidth:'180px'}}>{witnessAlphaName} {t(lang, 'pos')}: {m.sourcePosition}</span>
                                      <span title={witnessBetaName} className="truncate" style={{maxWidth:'180px'}}>{witnessBetaName} {t(lang, 'pos')}: {m.targetPosition}</span>
                                      {m.length && <span>{t(lang, 'Length')}: {m.length} {t(lang, 'tokens')}</span>}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            {sortedMatches.length === 0 && (
                              <div className="flex flex-col items-center justify-center text-gray-300 py-32 text-center">
                                <svg className="w-16 h-16 mb-6 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                <p className="text-base uppercase font-bold tracking-widest">{t(lang, 'No Matches Detected')}</p>
                                <p className="text-sm mt-2">{t(lang, 'Try lowering the threshold or increasing window size.')}</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* === NORMAL (COMPACT) VIEW === */
                          <>
                            {sortedMatches.map((m, idx) => (
                              <div
                                key={idx}
                                data-match-index={idx}
                                onClick={() => setSelectedMatch(m)}
                                className={`group p-3 rounded border cursor-pointer transition-all duration-200 hover:shadow-md ${selectedMatch === m ? 'border-academic-red bg-academic-red/5 ring-1 ring-academic-red' : 'border-gray-200 bg-white hover:border-academic-gold'}`}
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-[9px] font-mono font-bold text-gray-400">{t(lang, 'Rank')} #{idx+1}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="h-1 w-12 bg-gray-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-academic-gold" style={{ width: `${m.similarity}%` }}></div>
                                    </div>
                                    <span className={`text-[11px] font-bold ${m.similarity >= 95 ? 'text-green-600' : (m.similarity >= 80 ? 'text-blue-600' : 'text-academic-gold')}`}>{m.similarity.toFixed(1)}%</span>
                                  </div>
                                </div>
                                <DiffView
                                  source={m.sourcePhrase}
                                  target={m.targetPhrase}
                                  similarity={m.similarity}
                                  fontSize={Math.max(10, fontSize - 2)}
                                  witnessAlphaName={witnessAlphaName}
                                  witnessBetaName={witnessBetaName}
                                />
                              </div>
                            ))}
                            {sortedMatches.length === 0 && (
                              <div className="h-full flex flex-col items-center justify-center text-gray-300 py-20 px-10 text-center">
                                <svg className="w-12 h-12 mb-4 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                <p className="text-xs uppercase font-bold tracking-widest">{t(lang, 'No Matches Detected')}</p>
                                <p className="text-[10px] mt-1">{t(lang, 'Try lowering the threshold or increasing window size.')}</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                   </div>
                   {/* Heatmap (Position Correspondence) */}
                   <Heatmap matches={result.matches} sourceLength={result.tokensA.length} targetLength={result.tokensB.length} onSelectMatch={setSelectedMatch} selectedMatch={selectedMatch} onHelpClick={setActiveHelpModal} lang={lang} witnessAlphaName={witnessAlphaName} witnessBetaName={witnessBetaName} />
                </div>

                <div className="flex flex-col gap-8">
                   {/* Similarity Histogram */}
                   <div ref={histogramRef} className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm">
                     <h3 className="text-[10px] font-bold uppercase text-academic-blue tracking-widest mb-2 flex items-center justify-between">
                       <span className="flex items-center">
                         {t(lang, 'Similarity Distribution')}
                         <HelpButton topic="similarityDistribution" onClick={setActiveHelpModal} />
                       </span>
                       <ChartToolbar containerRef={histogramRef} filename="icoma-similarity-histogram" />
                     </h3>
                     <SimilarityHistogram matches={result.matches} selectedMatch={selectedMatch} onSelectMatch={setSelectedMatch} />
                   </div>
                   {/* Network Graph (Cluster Discovery) */}
                   <div ref={networkRef} className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm">
                     <h3 className="text-[10px] font-bold uppercase text-academic-blue tracking-widest mb-2 flex items-center justify-between">
                       <span className="flex items-center">
                         {t(lang, 'Cluster View (Network Graph)')}
                         <HelpButton topic="clusterView" onClick={setActiveHelpModal} />
                       </span>
                       <ChartToolbar containerRef={networkRef} filename="icoma-network-graph" />
                     </h3>
                     <NetworkGraph matches={result.matches} onSelectMatch={setSelectedMatch} selectedMatch={selectedMatch} witnessAlphaName={witnessAlphaName} witnessBetaName={witnessBetaName} />
                   </div>
                   {/* Dispersion Plot (Distribution) */}
                   <div ref={dispersionRef} className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm">
                     <h3 className="text-[10px] font-bold uppercase text-academic-blue tracking-widest mb-2 flex items-center justify-between">
                       <span className="flex items-center">
                         {t(lang, 'Witness Dispersion')}
                         <HelpButton topic="witnessDispersion" onClick={setActiveHelpModal} />
                       </span>
                       <ChartToolbar containerRef={dispersionRef} filename="icoma-dispersion-plot" />
                     </h3>
                     <DispersionPlot matches={result.matches} sourceLength={result.tokensA.length} targetLength={result.tokensB.length} onSelectMatch={setSelectedMatch} selectedMatch={selectedMatch} witnessAlphaName={witnessAlphaName} witnessBetaName={witnessBetaName} />
                   </div>
                </div>
              </div>
            </div>

            {/* AI Intertextuality Analysis */}
            <AIAnalysisPanel sourceText={sourceText} targetText={targetText} onHelpClick={setActiveHelpModal} collationTrigger={collationTrigger} lang={lang} />
          </div>
        )}

        {/* AI Analysis available even without collation results */}
        {!result && (
          <AIAnalysisPanel sourceText={sourceText} targetText={targetText} onHelpClick={setActiveHelpModal} collationTrigger={collationTrigger} />
        )}
      </main>
      
      {/* Visual Footer */}
      <footer className="mt-auto py-6 border-t border-gray-200 bg-white text-center flex flex-col items-center gap-3">
         <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em]">{t(lang, 'Advanced Digital Humanities Collation Tool')} • v3.0.0 Enterprise</p>
         <div className="flex items-center gap-4 text-[10px] text-gray-500 uppercase tracking-widest">
            <div className="flex items-center gap-1">
              <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="hover:text-academic-blue transition-colors flex items-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14h2v8h-2zm0 10h2v2h-2z"/></svg>
                CC BY 4.0 License
              </a>
              <span>(<a href="https://somiyagawa.com/" target="_blank" rel="noopener noreferrer" className="hover:text-academic-blue underline transition-colors">So Miyagawa</a>)</span>
            </div>
            <span className="text-gray-300">|</span>
            <button onClick={() => setIsChangelogOpen(true)} className="hover:text-academic-blue transition-colors flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              {t(lang, 'Changelog')}
            </button>
            <span className="text-gray-300">|</span>
            <a href="https://github.com/somiyagawa/ICoMa-" target="_blank" rel="noopener noreferrer" className="hover:text-academic-blue transition-colors flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
         </div>
         <p className="text-[9px] text-gray-400 mt-1">© 2026 <a href="https://somiyagawa.com/" target="_blank" rel="noopener noreferrer" className="hover:text-academic-blue underline transition-colors">So Miyagawa</a> Computational Linguistics Lab, University of Tsukuba</p>
      </footer>

      {/* Changelog Modal */}
      {isChangelogOpen && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsChangelogOpen(false)}>
          <div className="bg-white rounded-sm shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-academic-blue font-serif tracking-tight flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                {t(lang, 'Changelog')}
              </h2>
              <button onClick={() => setIsChangelogOpen(false)} className="text-gray-400 hover:text-academic-red transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto font-sans text-sm text-gray-700 space-y-6">
              <div>
                <h3 className="font-bold text-academic-blue text-base border-b border-gray-100 pb-2 mb-2">v3.0.0 Enterprise (March 2026)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Added <strong>ONNX Semantic Similarity</strong> algorithm: browser-local sentence-transformer (<code>all-MiniLM-L6-v2</code>) via <code>onnxruntime-web</code> / <code>@huggingface/transformers</code> for semantic matching without external API.</li>
                  <li>Added <strong>Session History</strong> panel: IndexedDB-based persistence allows saving, loading, renaming, and deleting past analysis sessions.</li>
                  <li>Added <strong>Report Download</strong> in 4 formats: <strong>PDF</strong> (jsPDF + autoTable), <strong>DOCX</strong> (docx.js), <strong>LaTeX</strong> (.tex with booktabs/longtable), and <strong>TEI XML</strong> (P5-compliant).</li>
                  <li>Added <strong>Italiano (Italian)</strong> as a new UI language (7 languages total).</li>
                  <li>Complete <strong>i18n coverage</strong>: all algorithm names, UI controls, tooltips, match gallery labels, and chart controls now fully translated across all 7 languages.</li>
                  <li>Added <strong>Editable Witness Names</strong>: inline-editable α/β name inputs propagate custom names throughout all visualization panels.</li>
                  <li>Added <strong>Inline Diff View</strong> in Match Gallery: word-level LCS diff with colour-coded insertions/deletions for sub-100% matches.</li>
                  <li>Added <strong>Match Gallery Fullscreen</strong> with ranked card layout, medal badges for top 3 matches, and similarity progress bars.</li>
                  <li>Added <strong>Cross-Panel Synchronization</strong>: selecting a match in any panel (Histogram, Network Graph, Heatmap, Dispersion, Gallery) highlights it everywhere.</li>
                  <li><strong>Network Graph</strong> auto zoom-in on selected cluster with label backgrounds and NaN position guards.</li>
                  <li><strong>Heatmap</strong> header reorganized into 3 rows (title, axis legends, toolbar) to prevent layout crowding.</li>
                  <li><strong>Fullscreen Exit</strong> button made more prominent with floating red bar, gradient overlay, and Esc key support.</li>
                  <li>Fixed <strong>zoom overflow</strong>: CSS <code>transform: scale()</code> no longer covers sibling components via <code>maxHeight</code> + <code>overflow: auto</code> containment.</li>
                  <li>Unified all Witness naming to <strong>Greek lowercase</strong> (α/β) — removed forced CSS <code>uppercase</code> that turned α into Α.</li>
                  <li>ONNX progress indicator: phase-specific feedback (model loading → embedding α → embedding β → comparing) with percentage.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-academic-blue text-base border-b border-gray-100 pb-2 mb-2">v2.9.0 Enterprise (March 2026)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Added <strong>Internationalization (i18n)</strong>: UI now available in English, 日本語, 中文, 한국어, Deutsch, and Latina.</li>
                  <li>Added <strong>Old Japanese (万葉集 &amp; 注釈)</strong> example to Quick Load.</li>
                  <li>Added <strong>SVG/PNG download</strong> and <strong>fullscreen mode</strong> for all visualization panels.</li>
                  <li>Added <strong>font size and font family controls</strong> in the menu bar.</li>
                  <li>Added interactive help modals (<strong>?</strong> buttons) for Heatmap axes (Witness α/β Position) and AI Intertextuality Analysis.</li>
                  <li>Added <strong>confidence-based colour highlighting</strong> for AI analysis parallel passages, with per-category colour coding.</li>
                  <li>AI Analysis now <strong>auto-re-runs</strong> when the Collation Engine is triggered.</li>
                  <li>Fixed Claude API <strong>CORS / "Failed to fetch"</strong> issue via Vercel proxy rewrites.</li>
                  <li>Heatmap component redesigned with titled header, axis labels, and help buttons.</li>
                  <li>Confidence distribution mini-chart and category summary badges added to AI results.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-academic-blue text-base border-b border-gray-100 pb-2 mb-2">v2.6.0 Enterprise (March 2026)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Added <strong>AI Intertextuality Analysis</strong> system with multi-model support (Claude, Gemini, ChatGPT).</li>
                  <li>AI-powered detection of <strong>direct quotations, allusions, echoes, paraphrases, structural parallels, thematic reuse,</strong> and <strong>formulaic language</strong>.</li>
                  <li>Users can input their own API keys for each provider; keys are stored only in browser memory.</li>
                  <li>Comparative view for side-by-side analysis across multiple AI models.</li>
                  <li>Category-based filtering and expandable match cards with scholarly explanations.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-academic-blue text-base border-b border-gray-100 pb-2 mb-2">v2.5.2 Enterprise (March 2026)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Added interactive help modals for <strong>Similarity Threshold</strong> and <strong>N-Size</strong> parameters.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-academic-blue text-base border-b border-gray-100 pb-2 mb-2">v2.5.1 Enterprise (March 2026)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Added Algorithm Help modal with detailed pros and cons for each algorithm.</li>
                  <li>Changed the default comparison algorithm to <strong>Levenshtein (Edit Distance)</strong>.</li>
                  <li>Added author website and GitHub repository links to the footer.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-academic-blue text-base border-b border-gray-100 pb-2 mb-2">v2.5 Enterprise (March 2026)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Added <strong>FastText-like (Subword N-Grams)</strong> algorithm for robust matching against spelling variations and morphology.</li>
                  <li>Added <strong>Word2Vec-like (Local Co-occurrence)</strong> algorithm for distributional semantic matching.</li>
                  <li>Updated institutional affiliation to include University of Tsukuba.</li>
                  <li>Added Google Analytics tracking.</li>
                  <li>Integrated CC BY 4.0 License (<a href="https://somiyagawa.com/" target="_blank" rel="noopener noreferrer" className="text-academic-blue hover:underline">So Miyagawa</a>).</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-academic-blue text-base border-b border-gray-100 pb-2 mb-2">v2.4</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Introduced Coptic-Aware algorithm with vowel and mark normalization.</li>
                  <li>Added Smith-Waterman local alignment for multi-peak matching.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-academic-blue text-base border-b border-gray-100 pb-2 mb-2">v2.0</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Initial release of the Advanced Digital Humanities Collation Tool (ICoMa).</li>
                  <li>Support for Character and Word N-Grams, Jaccard, and Levenshtein distance.</li>
                  <li>Added interactive visualization dashboard for text reuse analysis.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Help Modal */}
      {activeHelpModal && (() => {
        const helpData = renderHelpContent(activeHelpModal, lang);
        if (!helpData) return null;
        return (
          <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setActiveHelpModal(null)}>
            <div className="bg-white rounded-sm shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-lg font-bold text-academic-blue font-serif tracking-tight flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {helpData.title}
                </h2>
                <button onClick={() => setActiveHelpModal(null)} className="text-gray-400 hover:text-academic-red transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="p-6 overflow-y-auto font-sans text-sm text-gray-700 space-y-6">
                {helpData.content}
              </div>
            </div>
          </div>
        );
      })()}

      {/* History Panel */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onLoadSession={handleLoadSession}
      />
    </div>
  );
};

export default App;