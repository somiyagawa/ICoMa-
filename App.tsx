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
import ChartToolbar, { ZoomControls } from './components/ChartControls';
import { getHelpContent, getAlgorithmHelp, getIntertextualityCategoryHelp } from './services/helpContent';
import DiffView from './components/DiffView';

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
  const prosLabel = { en: 'Pros', ja: '長所', zh: '优点', ko: '장점', de: 'Vorteile', la: 'Commoditates' }[lang];
  const consLabel = { en: 'Cons', ja: '短所', zh: '缺点', ko: '단점', de: 'Nachteile', la: 'Incommoda' }[lang];
  const bestForLabel = { en: 'Best for', ja: '最適な用途', zh: '最适合', ko: '최적 용도', de: 'Am besten für', la: 'Optimum est' }[lang];
  const tipLabel = { en: 'Pro Tip', ja: 'ヒント', zh: '提示', ko: '팁', de: 'Tipp', la: 'Consilium' }[lang];

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

  // Refs for chart containers (fullscreen + download)
  const alignmentFlowRef = useRef<HTMLDivElement>(null);
  const histogramRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<HTMLDivElement>(null);
  const dispersionRef = useRef<HTMLDivElement>(null);
  const matchGalleryScrollRef = useRef<HTMLDivElement>(null);

  const performAnalysis = useCallback(() => {
    if (!sourceText || !targetText) return;
    setIsProcessing(true);
    // Use timeout to allow UI to render 'Processing' state
    setTimeout(() => {
      const res = runAnalysis(sourceText, targetText, config);
      setResult(res);
      setSelectedMatch(null);
      setIsProcessing(false);
      setCollationTrigger(prev => prev + 1);
    }, 50);
  }, [sourceText, targetText, config]);

  const sortedMatches = useMemo(() => {
    if (!result) return [];
    return [...result.matches].sort((a, b) => b.similarity - a.similarity);
  }, [result]);

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
                <div className="text-[10px] text-gray-400 uppercase font-sans mb-1">UI Language</div>
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
                <div className="text-[10px] text-gray-400 uppercase font-sans mb-1">Font</div>
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
                  <button onClick={() => setFontSize(s => Math.max(10, s - 1))} className="bg-white/10 border border-white/20 text-white text-[11px] w-6 h-6 rounded-sm hover:bg-white/20 transition-colors flex items-center justify-center" title="Decrease font size">−</button>
                  <span className="text-[10px] font-mono text-gray-300 w-7 text-center">{fontSize}</span>
                  <button onClick={() => setFontSize(s => Math.min(24, s + 1))} className="bg-white/10 border border-white/20 text-white text-[11px] w-6 h-6 rounded-sm hover:bg-white/20 transition-colors flex items-center justify-center" title="Increase font size">+</button>
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
                 <span className="font-mono">GitHub Issues</span>
               </div>
             </a>

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
                   <div className="flex items-center">
                     <span className="text-[11px] font-bold text-academic-blue uppercase tracking-wider">{t(lang, 'Witness α (Primary)')}</span>
                     <HelpButton topic="witnessAlpha" onClick={setActiveHelpModal} />
                   </div>
                   <span className="text-[9px] text-gray-400 font-mono">{sourceText.length} chars</span>
                </div>
                <textarea className="w-full h-40 p-4 font-coptic border border-gray-200 rounded-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-academic-gold/20 focus:border-academic-gold outline-none transition-all shadow-inner leading-relaxed" style={{ fontSize: `${fontSize}px` }} value={sourceText} onChange={(e) => setSourceText(e.target.value)} placeholder={t(lang, 'Insert primary text (Source)...')} dir="auto" />
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2 px-1">
                   <div className="flex items-center">
                     <span className="text-[11px] font-bold text-academic-blue uppercase tracking-wider">{t(lang, 'Witness β (Comparandum)')}</span>
                     <HelpButton topic="witnessBeta" onClick={setActiveHelpModal} />
                   </div>
                   <span className="text-[9px] text-gray-400 font-mono">{targetText.length} chars</span>
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
                    <option value="smith-waterman">Smith-Waterman (Local Alignment)</option>
                    <option value="coptic-aware">Coptic-Aware (Vowel & Mark Norm)</option>
                    <option value="levenshtein">Levenshtein (Edit Distance)</option>
                    <option value="jaccard">Jaccard (Set Similarity)</option>
                    <option value="word-ngram">Word-Level N-Gram</option>
                    <option value="char-ngram">Character-Level N-Gram</option>
                    <option value="fasttext">FastText-like (Subword N-Grams)</option>
                    <option value="word2vec">Word2Vec-like (Local Co-occurrence)</option>
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
                    {t(lang, 'PROCESSING LARGE DATASET...')}
                   </>
                ) : t(lang, 'RUN COLLATION ENGINE')}
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
                    <div className="px-3 py-1 bg-academic-lightBlue text-white rounded-full text-[10px] font-mono">α: {result.tokensA.length}</div>
                    <div className="px-3 py-1 bg-academic-gold text-white rounded-full text-[10px] font-mono">β: {result.tokensB.length}</div>
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[420px]">
                   {/* Match Gallery (Sidebar) */}
                   <div className="bg-white border border-gray-200 rounded-sm shadow-lg flex flex-col overflow-hidden max-h-[420px]">
                      <div className="bg-academic-paper px-4 py-3 border-b border-gray-200 flex justify-between items-center shrink-0">
                        <span className="text-[11px] font-bold uppercase text-academic-blue tracking-widest flex items-center">
                          {t(lang, 'Match Gallery')}
                          <HelpButton topic="matchGallery" onClick={setActiveHelpModal} />
                        </span>
                        <div className="flex items-center gap-2">
                          <ZoomControls zoom={galleryZoom} onZoomChange={setGalleryZoom} />
                          <div className="px-2 py-0.5 bg-academic-gold/20 text-academic-gold text-[9px] font-bold rounded">{t(lang, 'TOP REUSES')}</div>
                        </div>
                      </div>
                      <div ref={matchGalleryScrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-gray-50/20" style={{ transform: `scale(${galleryZoom})`, transformOrigin: 'top left', width: galleryZoom !== 1 ? `${100 / galleryZoom}%` : undefined }}>
                        {sortedMatches.map((m, idx) => (
                          <div
                            key={idx}
                            data-match-index={idx}
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
                            <DiffView
                              source={m.sourcePhrase}
                              target={m.targetPhrase}
                              similarity={m.similarity}
                              fontSize={Math.max(10, fontSize - 2)}
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
                      </div>
                   </div>
                   {/* Heatmap (Position Correspondence) */}
                   <Heatmap matches={result.matches} sourceLength={result.tokensA.length} targetLength={result.tokensB.length} onSelectMatch={setSelectedMatch} selectedMatch={selectedMatch} onHelpClick={setActiveHelpModal} lang={lang} />
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
                     <NetworkGraph matches={result.matches} onSelectMatch={setSelectedMatch} selectedMatch={selectedMatch} />
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
                     <DispersionPlot matches={result.matches} sourceLength={result.tokensA.length} targetLength={result.tokensB.length} onSelectMatch={setSelectedMatch} selectedMatch={selectedMatch} />
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
         <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em]">{t(lang, 'Advanced Digital Humanities Collation Tool')} • v2.8.1 Enterprise</p>
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
                Changelog
              </h2>
              <button onClick={() => setIsChangelogOpen(false)} className="text-gray-400 hover:text-academic-red transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto font-sans text-sm text-gray-700 space-y-6">
              <div>
                <h3 className="font-bold text-academic-blue text-base border-b border-gray-100 pb-2 mb-2">v2.8.1 Enterprise (March 2026)</h3>
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
    </div>
  );
};

export default App;