/**
 * Help Content for ICoMa
 * Comprehensive help documentation in 6 languages:
 * English (en), Japanese (ja), Chinese (zh), Korean (ko), German (de), Latin (la)
 */

import { Language } from './i18n';

export interface HelpTopic {
  title: string;
  body: string;
  items?: { label: string; text: string; colorClass?: string }[];
  tip?: string;
}

export interface AlgorithmHelp {
  name: string;
  description: string;
  pros: string;
  cons: string;
  bestFor: string;
}

export interface IntertextualityCategoryHelp {
  name: string;
  description: string;
  colorClass: string;
}

const algorithmHelpData: Record<Language, AlgorithmHelp[]> = {
  en: [
    {
      name: "Levenshtein (Edit Distance)",
      description: "Calculates the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one word into the other.",
      pros: "Highly accurate for exact character-level variations (typos, minor spelling changes).",
      cons: "Computationally expensive for very long sequences; strict on word order.",
      bestFor: "Detecting minor scribal errors, short texts, and close variants."
    },
    {
      name: "Jaccard (Set Similarity)",
      description: "Measures similarity between finite sample sets, defined as the size of the intersection divided by the size of the union of the sample sets.",
      pros: "Fast and completely ignores word order.",
      cons: "Loses syntax and context; treats text as a 'bag of words'.",
      bestFor: "Thematic similarity, overlapping vocabulary, and heavily rearranged texts."
    },
    {
      name: "Word-Level N-Gram",
      description: "Compares contiguous sequences of n words from the texts.",
      pros: "Captures local word order and exact phrasal matches.",
      cons: "Fails if a single word in the phrase is changed, inserted, or misspelled.",
      bestFor: "Plagiarism detection, identifying verbatim quotes, and formulaic language."
    },
    {
      name: "Character-Level N-Gram",
      description: "Compares contiguous sequences of n characters from the texts.",
      pros: "Robust to minor spelling variations, OCR errors, and morphological changes.",
      cons: "Can produce false positives with similar-looking but semantically different words.",
      bestFor: "Noisy texts, OCR output, and texts with inconsistent spelling."
    },
    {
      name: "Smith-Waterman (Local Alignment)",
      description: "Performs local sequence alignment to determine similar regions between two strings.",
      pros: "Excellent at finding highly similar substrings embedded within larger, divergent texts.",
      cons: "Computationally heavy.",
      bestFor: "Finding embedded quotes or reused passages in otherwise different documents."
    },
    {
      name: "Coptic-Aware (Vowel & Mark Norm)",
      description: "A specialized algorithm that normalizes supralinear strokes and vowels specific to the Coptic language before comparison.",
      pros: "Highly tailored for Coptic manuscript realities (scribal abbreviations, vowel variations).",
      cons: "Only useful for Coptic texts.",
      bestFor: "Coptic manuscript collation."
    },
    {
      name: "FastText-like (Subword N-Grams)",
      description: "Approximates FastText by breaking words into subword character n-grams to create a frequency vector, then computes cosine similarity.",
      pros: "Handles morphological variations and out-of-vocabulary words very well.",
      cons: "It is a statistical approximation, not a pre-trained neural network.",
      bestFor: "Highly inflected languages and texts with many morphological variants."
    },
    {
      name: "Word2Vec-like (Local Co-occurrence)",
      description: "Approximates Word2Vec by building an on-the-fly local co-occurrence matrix (context window) to capture distributional semantics.",
      pros: "Captures semantic similarity based on local context, even if exact words differ.",
      cons: "Requires sufficient context within the provided texts to build meaningful vectors.",
      bestFor: "Semantic matching, finding paraphrases, or thematic overlaps where vocabulary differs."
    }
  ],
  ja: [
    {
      name: "レーベンシュタイン距離（編集距離）",
      description: "一つの語を別の語に変換するために必要な単一文字編集（挿入、削除、置換）の最小数を計算します。",
      pros: "正確な文字レベルの変動（誤字、軽微なつづり変更）に対して高精度です。",
      cons: "非常に長い列に対しては計算量が多く、語順に厳密です。",
      bestFor: "軽微な写字誤りの検出、短いテキスト、および密接な異形本の検出。"
    },
    {
      name: "ジャッカード（集合類似度）",
      description: "有限標本集合間の類似度を計測します。定義は交集合の要素数を和集合の要素数で除した値です。",
      pros: "高速であり、語順を完全に無視します。",
      cons: "構文と文脈を失い、テキストを「単語の集合」として扱います。",
      bestFor: "主題的類似性、重複する語彙、および大幅に再配列されたテキスト。"
    },
    {
      name: "単語レベルN-グラム",
      description: "テキストから連続する n 個の単語の配列を比較します。",
      pros: "局所的な語順と正確なフレーズマッチを捉えます。",
      cons: "フレーズ内の単一語が変更、挿入、または誤字がある場合、失敗します。",
      bestFor: "盗用検出、逐語的引用の識別、定型表現。"
    },
    {
      name: "文字レベルN-グラム",
      description: "テキストから連続する n 個の文字の配列を比較します。",
      pros: "軽微なつづり変動、OCR誤差、および形態論的変化に対して頑強です。",
      cons: "意味的に異なるが見た目が似ている単語と誤った陽性が生じることがあります。",
      bestFor: "ノイズの多いテキスト、OCR出力、およびつづりが一貫しないテキスト。"
    },
    {
      name: "スミス・ウォーターマン（局所アライメント）",
      description: "局所配列アラインメントを実行して、2つの文字列間の類似領域を決定します。",
      pros: "より大きく発散したテキスト内に埋め込まれた非常に類似したサブ文字列の検出に優れています。",
      cons: "計算量が多いです。",
      bestFor: "埋め込まれた引用または再利用された一節を、その他の異なる文書内で検出すること。"
    },
    {
      name: "コプト対応（母音およびマーク正規化）",
      description: "コプト言語に固有の上線および母音を正規化する専門アルゴリズムです。",
      pros: "コプト写本の現実（写字計略、母音の変動）に高度に適応しています。",
      cons: "コプトテキストにのみ有用です。",
      bestFor: "コプト写本の校合。"
    },
    {
      name: "FastText型（部分語N-グラム）",
      description: "FastTextを近似し、単語を部分語文字n-グラムに分割して頻度ベクトルを作成し、コサイン類似度を計算します。",
      pros: "形態論的変動と未知語を非常によく処理します。",
      cons: "これは統計的近似であり、事前学習ニューラルネットワークではありません。",
      bestFor: "高度に屈折した言語および多くの形態論的変動を持つテキスト。"
    },
    {
      name: "Word2Vec型（局所共起）",
      description: "その場で局所共起行列（文脈窓）を構築してWord2Vecを近似し、分布意味論を捉えます。",
      pros: "正確な単語が異なる場合でも、局所文脈に基づいて意味的類似度を捉えます。",
      cons: "有意義なベクトルを構築するために、提供されたテキスト内で十分な文脈が必要です。",
      bestFor: "意味的マッチング、言い換えの検出、語彙が異なる場合の主題的重複。"
    }
  ],
  zh: [
    {
      name: "莱文斯坦距离（编辑距离）",
      description: "计算将一个单词变换为另一个单词所需的单字符编辑（插入、删除或替换）的最小数量。",
      pros: "对精确的字符级变动（打字错误、轻微拼写变化）高度准确。",
      cons: "对于非常长的序列计算成本高；对字序严格。",
      bestFor: "检测轻微的抄写错误、短文本和接近的变种。"
    },
    {
      name: "杰卡德系数（集合相似度）",
      description: "测量有限样本集之间的相似度，定义为交集的大小除以并集的大小。",
      pros: "快速，完全忽略字序。",
      cons: "丧失语法和上下文；将文本视为「词包」。",
      bestFor: "主题相似性、词汇重叠和大幅重新排列的文本。"
    },
    {
      name: "词级N-克",
      description: "比较来自文本的n个连续词的序列。",
      pros: "捕捉本地词序和精确的短语匹配。",
      cons: "如果短语中的单个词被改变、插入或拼写错误，则失败。",
      bestFor: "剽窃检测、识别逐字引用、定型表达。"
    },
    {
      name: "字级N-克",
      description: "比较来自文本的n个连续字符的序列。",
      pros: "对轻微拼写变化、光学字符识别错误和形态变化保持稳健。",
      cons: "可能对外观相似但语义不同的词产生假阳性。",
      bestFor: "嘈杂文本、光学字符识别输出以及拼写不一致的文本。"
    },
    {
      name: "史密斯-沃特曼（局部比对）",
      description: "执行局部序列比对以确定两个字符串之间的相似区域。",
      pros: "擅长在更大的分异文本中发现高度相似的嵌入子字符串。",
      cons: "计算繁重。",
      bestFor: "在不同的文档中查找嵌入的引用或重复使用的段落。"
    },
    {
      name: "科普特感知（元音和标记归一化）",
      description: "一种专门的算法，它在比较之前对科普特语言特有的上标笔划和元音进行归一化。",
      pros: "高度适应科普特手稿的现实（写字员缩略语、元音变化）。",
      cons: "仅对科普特文本有用。",
      bestFor: "科普特手稿校勘。"
    },
    {
      name: "FastText型（子词N-克）",
      description: "通过将词分解为子词字符n-克来近似FastText，创建频率向量，然后计算余弦相似度。",
      pros: "非常好地处理形态变化和词汇外的词。",
      cons: "这是统计近似，不是预训练的神经网络。",
      bestFor: "高度屈折语言和具有许多形态变体的文本。"
    },
    {
      name: "Word2Vec型（局部共现）",
      description: "通过构建即时局部共现矩阵（上下文窗口）来近似Word2Vec以捕捉分布语义。",
      pros: "即使精确词汇不同，也基于本地上下文捕捉语义相似度。",
      cons: "需要所提供文本内有充分的上下文来构建有意义的向量。",
      bestFor: "语义匹配、寻找释义或词汇不同的主题重叠。"
    }
  ],
  ko: [
    {
      name: "레벤슈타인 거리（편집 거리）",
      description: "한 단어를 다른 단어로 변환하는 데 필요한 단일 문자 편집(삽입, 삭제, 치환)의 최소 개수를 계산합니다.",
      pros: "정확한 문자 수준의 변동(오타, 경미한 철자 변경)에 대해 높은 정확도를 제공합니다.",
      cons: "매우 긴 시퀀스에 대해 계산 비용이 높으며 단어 순서에 엄격합니다.",
      bestFor: "경미한 필경오류, 짧은 텍스트 및 유사한 이본의 감지."
    },
    {
      name: "자카드 계수（집합 유사도）",
      description: "유한 표본 집합 간의 유사도를 측정하며, 교집합의 크기를 합집합의 크기로 나눈 값으로 정의됩니다.",
      pros: "빠르며 단어 순서를 완전히 무시합니다.",
      cons: "구문과 문맥을 잃으며 텍스트를 '단어 모음'으로 처리합니다.",
      bestFor: "주제적 유사성, 어휘 중복 및 대폭 재배열된 텍스트."
    },
    {
      name: "단어 수준 N-그램",
      description: "텍스트에서 연속되는 n개의 단어 시퀀스를 비교합니다.",
      pros: "국소적 단어 순서와 정확한 구 단위 일치를 포착합니다.",
      cons: "구 내의 단일 단어가 변경, 삽입 또는 철자 오류가 있으면 실패합니다.",
      bestFor: "표절 탐지, 직접 인용 식별 및 고정 표현."
    },
    {
      name: "문자 수준 N-그램",
      description: "텍스트에서 연속되는 n개의 문자 시퀀스를 비교합니다.",
      pros: "경미한 철자 변동, OCR 오류 및 형태론적 변화에 견고합니다.",
      cons: "생김새는 유사하지만 의미가 다른 단어에서 거짓 양성이 발생할 수 있습니다.",
      bestFor: "노이즈가 많은 텍스트, OCR 출력 및 철자가 일관되지 않는 텍스트."
    },
    {
      name: "스미스-워터맨（국소 정렬）",
      description: "국소 서열 정렬을 수행하여 두 문자열 간의 유사한 영역을 결정합니다.",
      pros: "더 크고 분산된 텍스트 내에 내장된 매우 유사한 부분 문자열을 찾는 데 뛰어닙니다.",
      cons: "계산량이 많습니다.",
      bestFor: "그 외 다양한 문서 내에서 내장된 인용문 또는 재사용 구간 찾기."
    },
    {
      name: "콥트어 인식（모음 및 표시 정규화）",
      description: "비교 전에 콥트어 언어에 특정한 상선 및 모음을 정규화하는 전문 알고리즘입니다.",
      pros: "콥트 필사본의 현실성(필사오류 약자, 모음 변동)에 고도로 조정되어 있습니다.",
      cons: "콥트 텍스트에만 유용합니다.",
      bestFor: "콥트 필사본 대조."
    },
    {
      name: "FastText형（부분 단어 N-그램）",
      description: "FastText를 근사하여 단어를 부분 단어 문자 n-그램으로 분해하여 빈도 벡터를 생성한 후 코사인 유사도를 계산합니다.",
      pros: "형태론적 변동과 어휘 외 단어를 매우 잘 처리합니다.",
      cons: "이것은 통계적 근사값이지 사전 훈련된 신경망이 아닙니다.",
      bestFor: "고도로 굴절된 언어 및 많은 형태론적 변체를 가진 텍스트."
    },
    {
      name: "Word2Vec형（국소 공기）",
      description: "즉석에서 국소 공기 행렬(문맥 창)을 구축하여 Word2Vec을 근사하고 분포 의미론을 포착합니다.",
      pros: "정확한 단어가 다르더라도 국소 문맥에 기반한 의미적 유사도를 포착합니다.",
      cons: "의미 있는 벡터를 구축하기 위해 제공된 텍스트 내에서 충분한 문맥이 필요합니다.",
      bestFor: "의미적 매칭, 언어 바꿈 찾기 또는 어휘가 다른 주제적 중복."
    }
  ],
  de: [
    {
      name: "Levenshtein-Distanz (Bearbeitungsdistanz)",
      description: "Berechnet die Mindestanzahl einzelner Zeichenbearbeitungen (Einfügungen, Löschungen oder Ersetzungen), die erforderlich sind, um ein Wort in ein anderes zu ändern.",
      pros: "Hochgenau bei genauen Zeichenebenen-Variationen (Tippfehler, geringfügige Schreibweisen).",
      cons: "Rechenintensiv für sehr lange Sequenzen; streng bezüglich Wortfolge.",
      bestFor: "Erkennung geringfügiger Schreibfehler, kurze Texte und enge Varianten."
    },
    {
      name: "Jaccard-Koeffizient (Mengenähnlichkeit)",
      description: "Misst die Ähnlichkeit zwischen endlichen Beispielmengen, definiert als die Größe der Schnittmenge dividiert durch die Größe der Vereinigungsmenge.",
      pros: "Schnell und ignoriert die Wortfolge vollständig.",
      cons: "Verliert Syntax und Kontext; behandelt Text als 'Wortsammlung'.",
      bestFor: "Thematische Ähnlichkeit, überlappender Wortschatz und stark umgeordnete Texte."
    },
    {
      name: "Wort-Ebenen-N-Gramm",
      description: "Vergleicht zusammenhängende Sequenzen von n Worten aus den Texten.",
      pros: "Erfasst lokale Wortfolge und genaue Phrasenübereinstimmungen.",
      cons: "Scheitert, wenn ein einzelnes Wort im Satz geändert, eingefügt oder falsch geschrieben ist.",
      bestFor: "Plagiaterkennung, Identifizierung wörtlicher Zitate und formelhafte Sprache."
    },
    {
      name: "Zeichen-Ebenen-N-Gramm",
      description: "Vergleicht zusammenhängende Sequenzen von n Zeichen aus den Texten.",
      pros: "Robust gegenüber geringfügigen Schreibweisen, OCR-Fehlern und morphologischen Änderungen.",
      cons: "Kann Falsch-Positive bei ähnlich aussehenden aber semantisch unterschiedlichen Wörtern erzeugen.",
      bestFor: "Verrauschte Texte, OCR-Ausgabe und Texte mit inkonsistenter Schreibweise."
    },
    {
      name: "Smith-Waterman (Lokale Ausrichtung)",
      description: "Führt lokale Sequenzausrichtung durch, um ähnliche Regionen zwischen zwei Zeichenketten zu bestimmen.",
      pros: "Hervorragend zum Auffinden hochähnlicher in größeren, unterschiedlichen Texten eingebetteter Teilzeichenketten.",
      cons: "Rechenintensiv.",
      bestFor: "Auffinden eingebetteter Zitate oder wiederverwendeter Passagen in ansonsten unterschiedlichen Dokumenten."
    },
    {
      name: "Koptisch-bewusst (Vokal- und Markennormalisierung)",
      description: "Ein spezialisierter Algorithmus, der vor dem Vergleich supralineare Striche und Vokale der koptischen Sprache normalisiert.",
      pros: "Hochgradig auf die koptischen Manuskriptrealen (Schreiber-Abkürzungen, Vokalschwankungen) abgestimmt.",
      cons: "Nur für koptische Texte nützlich.",
      bestFor: "Koptische Manuskriptkollation."
    },
    {
      name: "FastText-ähnlich (Unterwort-N-Gramme)",
      description: "Approximiert FastText durch Aufbrechen von Wörtern in Unterwort-Zeichen-N-Gramme zur Erstellung eines Häufigkeitsvektors und berechnet dann die Cosinus-Ähnlichkeit.",
      pros: "Handhabt morphologische Variationen und Wörter außerhalb des Vokabulars sehr gut.",
      cons: "Dies ist eine statistische Approximation, keine vortrainierte neuronale Netzwerk.",
      bestFor: "Hochgradig flektierte Sprachen und Texte mit vielen morphologischen Varianten."
    },
    {
      name: "Word2Vec-ähnlich (Lokale Kookkurrenz)",
      description: "Approximiert Word2Vec durch das Aufbau einer spontanen lokalen Kookkurrenzmatrix (Kontextfenster), um Verteilungssemantik zu erfassen.",
      pros: "Erfasst semantische Ähnlichkeit basierend auf lokalem Kontext, auch wenn genaue Wörter unterschiedlich sind.",
      cons: "Erfordert ausreichenden Kontext in den bereitgestellten Texten zum Aufbau aussagekräftiger Vektoren.",
      bestFor: "Semantisches Matching, Finden von Umschreibungen oder thematische Überschneidungen, bei denen sich das Vokabular unterscheidet."
    }
  ],
  la: [
    {
      name: "Distantia Levenshteinii (Distantia Emendationis)",
      description: "Minimus numerus emendationum singularium characterum (insertiones, deletiones, substitutiones) computat, qui ad mutandum verbum in aliud verbum necessarius est.",
      pros: "Maxime accurata pro variationibus exactis characterum (errata typographica, mutationes orthographiae leves).",
      cons: "Summa computationis magna pro sequentiis valde longis; rigor in ordine verborum.",
      bestFor: "Detectio errorum librarii levium, textos breves, et varietates propinquae."
    },
    {
      name: "Coefficiens Iaccardii (Similitude Multitudinis)",
      description: "Similitudinem inter multitudines exemplorum finitas munit, definita ut magnitudo sectionis divisa per magnitudinem coniunctionis.",
      pros: "Celeritas; ordo verborum omnino negligitur.",
      cons: "Syntaxis et contextus amittitur; textus tamquam 'acervus verborum' tractatur.",
      bestFor: "Similitude thematica, vocabularium superposita, et textos valde permutatos."
    },
    {
      name: "N-Gramma Verborum",
      description: "Sequentias n verborum ex textibus continuas comparat.",
      pros: "Ordinem verbalium localem et aequalitatem phrasum exsactam capit.",
      cons: "Deficit si verbum singulare in senten[ti]a mutatum, insertum aut male scriptum est.",
      bestFor: "Detectionem plagii, identificationem citationum verbalium, et linguae formulaicae."
    },
    {
      name: "N-Gramma Characterum",
      description: "Sequentias n characterum ex textibus continuas comparat.",
      pros: "Robusta ad variationes orthographiae leves, errores OCR, et mutationes morphologicas.",
      cons: "Potest falsas affirmativas cum verbis similibusquoque sed semantice diversis producere.",
      bestFor: "Textos cum rumore, outputa OCR, et textos cum orthographia inconstanti."
    },
    {
      name: "Smith-Waterman (Conformatio Localis)",
      description: "Conformationem sequentiae localem perficit ad regiones similes inter duas lineas determinandas.",
      pros: "Egregium in inveniendo sublineas altius similes intra textos maiores et diversos insitas.",
      cons: "Computatio magna.",
      bestFor: "Invenire citatus insitos aut passus reusatos in documentis alioquin diversis."
    },
    {
      name: "Copta Conscia (Normalisatio Vocalium et Notarum)",
      description: "Algorithmus specialis qui tractus supralineares et vocales linguae Coptae ante comparationem normalizam.",
      pros: "Altissime accommodata ad realitatem manuscriptorum Coptorum (abbreviationes librariorum, variationes vocalium).",
      cons: "Tantummodo pro textibus Coptis utilis.",
      bestFor: "Collationem manuscriptorum Coptorum."
    },
    {
      name: "FastText-simile (N-Gramma Verba Infra)",
      description: "Fasttext approximat per verba in n-grammata characterum verborum infra dividens ut vectorem frequentiae creet, deinde similitudinem cosini computat.",
      pros: "Variationes morphologicas et verba extra vocabularium optime tractabat.",
      cons: "Haec est approximatio statistica, non rete neurale praecognitum.",
      bestFor: "Linguae altissime inflexae et textos cum multis variantibus morphologicis."
    },
    {
      name: "Word2Vec-simile (Cooccurrentia Localis)",
      description: "Word2Vec approximat per matricem cooccurrentiae localem (finestram contextus) instantaneam aedificantem ut semantica distributiva capiat.",
      pros: "Similitudinem semanticam ex contextu locali capit, etsi verba exacta differunt.",
      cons: "Contextum sufficientem in textibus praebitis necessitet ad vectores significatos aedificandum.",
      bestFor: "Conformatione semantica, invenire circumlocutiones, aut superposition[es] thematicas ubi vocabularium differt."
    }
  ]
};

const intertextualityHelpData: Record<Language, IntertextualityCategoryHelp[]> = {
  en: [
    { name: "Direct Quotation", description: "Verbatim or near-verbatim reproduction of a source text, often with explicit attribution markers.", colorClass: "red" },
    { name: "Allusion", description: "An indirect reference relying on the reader's cultural or literary competence for recognition.", colorClass: "purple" },
    { name: "Echo", description: "A faint, possibly unconscious, verbal or thematic reminiscence.", colorClass: "indigo" },
    { name: "Paraphrase", description: "Restatement in different words preserving the original meaning.", colorClass: "amber" },
    { name: "Structural Parallel", description: "Similarity in organizational structure, argument flow, or narrative pattern.", colorClass: "teal" },
    { name: "Thematic Reuse", description: "Adoption of motifs or topoi without direct verbal borrowing.", colorClass: "cyan" },
    { name: "Formulaic Language", description: "Conventional phrases or genre-specific formulas shared across texts.", colorClass: "lime" },
    { name: "Other", description: "Any other intertextual relationship.", colorClass: "gray" }
  ],
  ja: [
    { name: "直接引用", description: "原文の逐語的またはほぼ逐語的な再現で、しばしば明示的な帰属表示がある。", colorClass: "red" },
    { name: "暗示", description: "読者の文化的または文学的力量を読み取るために頼る間接的参照。", colorClass: "purple" },
    { name: "反響", description: "かすかで、おそらく無意識の、言語的または主題的想起。", colorClass: "indigo" },
    { name: "言い換え", description: "元の意味を保持した別の言葉での言い直し。", colorClass: "amber" },
    { name: "構造的平行", description: "組織構造、議論の流れ、または物語パターンの相似性。", colorClass: "teal" },
    { name: "主題的再利用", description: "直接の言語的借用なしの動機またはトポイの採用。", colorClass: "cyan" },
    { name: "定型表現", description: "テキスト全体で共有される慣用句またはジャンル固有の定型表現。", colorClass: "lime" },
    { name: "その他", description: "その他の中間性的関係。", colorClass: "gray" }
  ],
  zh: [
    { name: "直接引用", description: "源文本的逐字或近似逐字再现，通常带有明确的归属标记。", colorClass: "red" },
    { name: "讽喻", description: "依赖读者文化或文学能力来识别的间接引用。", colorClass: "purple" },
    { name: "回声", description: "微弱的、可能是无意的言语或主题回忆。", colorClass: "indigo" },
    { name: "释义", description: "用不同的词进行的重述，保持原意不变。", colorClass: "amber" },
    { name: "结构平行", description: "组织结构、论证流或叙事模式的相似性。", colorClass: "teal" },
    { name: "主题重用", description: "没有直接言语借用的动机或格言的采用。", colorClass: "cyan" },
    { name: "程式化语言", description: "文本共享的常规短语或特定于类型的公式。", colorClass: "lime" },
    { name: "其他", description: "任何其他互文性关系。", colorClass: "gray" }
  ],
  ko: [
    { name: "직접 인용", description: "원문의 직역 또는 거의 직역에 가까운 재생산(종종 명시적 속성 표시가 포함됨).", colorClass: "red" },
    { name: "암시", description: "인식을 위해 독자의 문화적 또는 문학적 능력에 의존하는 간접 참조.", colorClass: "purple" },
    { name: "에코", description: "희미하고 아마도 무의식적인 언어적 또는 주제적 상기.", colorClass: "indigo" },
    { name: "의역", description: "원래 의미를 유지하면서 다른 말로 다시 표현함.", colorClass: "amber" },
    { name: "구조적 유사", description: "조직 구조, 논거 흐름 또는 내러티브 패턴의 유사성.", colorClass: "teal" },
    { name: "주제 재사용", description: "직접적인 언어 차용 없이 동기나 토포이를 채택함.", colorClass: "cyan" },
    { name: "정형화 언어", description: "문장 전체에 공유되는 일반적인 구 또는 장르별 공식.", colorClass: "lime" },
    { name: "기타", description: "기타 모든 상호텍스트성 관계.", colorClass: "gray" }
  ],
  de: [
    { name: "Direkte Anführung", description: "Wörtliche oder fast wörtliche Wiedergabe eines Quelltextes, oft mit expliziten Zuordnungsmarkern.", colorClass: "red" },
    { name: "Anspielung", description: "Eine indirekte Referenz, die auf kulturelle oder literarische Kompetenz des Lesers angewiesen ist.", colorClass: "purple" },
    { name: "Echo", description: "Ein schwaches, möglicherweise unbewusstes, verbales oder thematisches Andenken.", colorClass: "indigo" },
    { name: "Paraphrase", description: "Umformulierung in anderen Worten unter Beibehaltung der ursprünglichen Bedeutung.", colorClass: "amber" },
    { name: "Strukturelle Parallele", description: "Ähnlichkeit in Organisationsstruktur, Argumentationsfluss oder Erzählmuster.", colorClass: "teal" },
    { name: "Thematische Wiederverwendung", description: "Übernahme von Motiven oder Topoi ohne direkte sprachliche Entlehnung.", colorClass: "cyan" },
    { name: "Formelhafte Sprache", description: "Herkömmliche Sätze oder Genreformeln, die textubergreifend geteilt werden.", colorClass: "lime" },
    { name: "Sonstige", description: "Jede andere intertextuelle Beziehung.", colorClass: "gray" }
  ],
  la: [
    { name: "Citatio Directa", description: "Verborum repetitio aut prope verborum ex textu fonte, saepe cum notis ascriptione explicitae.", colorClass: "red" },
    { name: "Allusio", description: "Referentia indirecta quae competentiam culturalm aut litterariam lectoris requirit.", colorClass: "purple" },
    { name: "Echo", description: "Reminientia tenue, fortasse incognita, verbalis aut thematicum.", colorClass: "indigo" },
    { name: "Paraphrasis", description: "Iteratio in aliis verbs significationem originalem servans.", colorClass: "amber" },
    { name: "Parallelum Structurale", description: "Similitudo in structura ordinata, flumine argumenti, aut forma narrativa.", colorClass: "teal" },
    { name: "Reusus Thematicus", description: "Adoptio motuum aut toporum sine emphatione verbi directa.", colorClass: "cyan" },
    { name: "Lingua Formulaica", description: "Phrases consuetas aut formulae genuinae quae in textibus distributa participantur.", colorClass: "lime" },
    { name: "Aliud", description: "Omnis alia relatio intertextualis.", colorClass: "gray" }
  ]
};

const helpTopicData: Record<Language, Record<string, HelpTopic>> = {
  en: {
    algorithm: {
      title: "Analysis Algorithms",
      body: "Choose the algorithm that best matches your research goals. Each algorithm has different strengths and limitations depending on the type of text reuse you are investigating."
    },
    threshold: {
      title: "Similarity Threshold",
      body: "Determines the minimum similarity score (percentage) required for a match to be highlighted and reported.",
      items: [
        { label: "High Threshold (80% - 100%)", text: "Reduces false positives. Best for finding exact quotes, verbatim copying, or highly conserved passages. Might miss subtle text reuses or heavily edited sections.", colorClass: "green" },
        { label: "Medium Threshold (50% - 79%)", text: "A balanced approach. Good for finding paraphrases, translations, or texts with moderate scribal variations.", colorClass: "amber" },
        { label: "Low Threshold (20% - 49%)", text: "Catches highly fragmented, heavily corrupted, or loosely related texts. Will significantly increase noise and false positives.", colorClass: "red" }
      ],
      tip: "For most scholarly purposes, a medium threshold (50-79%) offers the best balance between sensitivity and specificity."
    },
    nsize: {
      title: "N-Size / Window Size",
      body: "Defines the length of the sequence (number of words or characters) used as the base unit for comparison.",
      items: [
        { label: "Larger N-Size (e.g., 5-10+)", text: "Captures more context and drastically reduces random matches (noise). Best when looking for long, contiguous blocks of reused text. If set too high, it will fail to match texts with frequent small insertions or deletions.", colorClass: "green" },
        { label: "Smaller N-Size (e.g., 1-4)", text: "Highly flexible. Catches fragmented, heavily rearranged, or loosely paraphrased text. However, it will generate many false positives (e.g., matching common stop words or short, coincidental character sequences).", colorClass: "red" }
      ],
      tip: "For word-level algorithms, 3-5 is usually optimal. For character-level algorithms, 5-10 is recommended to avoid matching random syllables."
    },
    witnessAlpha: {
      title: "Witness α (Primary)",
      body: "The primary text or base text used for the collation. This is typically the source text, the older manuscript, or the reference text against which the comparandum is evaluated. The distinction between α and β is mostly for visualization purposes. Most algorithms are symmetric, meaning the similarity score will be the same regardless of which text is α or β."
    },
    witnessBeta: {
      title: "Witness β (Comparandum)",
      body: "The secondary text, target text, or comparandum. This is typically the text suspected of reusing the primary text, a later manuscript, or a translation."
    },
    meanSimilarity: {
      title: "Mean Similarity",
      body: "The average similarity score across all detected matches.",
      items: [
        { label: "High values (>90%)", text: "Indicate verbatim quotations or direct copying.", colorClass: "green" },
        { label: "Medium values (60-90%)", text: "Suggest paraphrasing, translation, or textual evolution.", colorClass: "amber" },
        { label: "Low values (<60%)", text: "Indicate loose thematic connections or highly fragmented reuse.", colorClass: "red" }
      ]
    },
    reuseCoverage: {
      title: "Reuse Coverage",
      body: "The percentage of the total text length occupied by detected reuses. A high coverage implies that one witness is largely derived from or identical to the other. A low coverage implies that the texts only share brief quotes or specific terminology."
    },
    alignments: {
      title: "Alignments",
      body: "The total number of distinct parallel passages identified by the algorithm. This counts every single instance where a match was found. If a specific phrase is reused 10 times in the target text, it counts as 10 alignments."
    },
    uniqueNgrams: {
      title: "Unique N-Grams",
      body: "The count of distinct matching sequences (unique text blocks). Unlike 'Alignments', this metric deduplicates the matches. If a specific phrase is reused 10 times, it counts as 10 alignments but only 1 unique N-gram. A large difference between Alignments and Unique N-Grams indicates highly repetitive formulaic language."
    },
    totalTokenCount: {
      title: "Total Token Count",
      body: "The total number of tokens (words or characters, depending on the algorithm) in each witness. This helps contextualize the 'Reuse Coverage' metric. If Witness α is much larger than Witness β, a 100% coverage of β might only represent a 5% coverage of α."
    },
    macroAlignment: {
      title: "Macro-Level Alignment Flow",
      body: "A high-level visual representation of how the two texts align with each other from beginning to end.",
      items: [
        { label: "Straight parallel lines", text: "Indicate that the texts follow the same narrative order (e.g., a direct copy or translation).", colorClass: "green" },
        { label: "Criss-crossing lines", text: "Indicate structural rearrangement, where sections of text have been moved around.", colorClass: "amber" },
        { label: "Color intensity", text: "Darker or more vibrant lines indicate higher similarity scores for that specific match.", colorClass: "blue" }
      ]
    },
    matchGallery: {
      title: "Match Gallery",
      body: "A detailed list of all identified parallel passages, sorted by their similarity score. Clicking on any card in the gallery will highlight the corresponding text in the Parallel Viewer and the Macro-Level Alignment Flow. This allows for close-reading and manual verification of the algorithmic results."
    },
    similarityDistribution: {
      title: "Similarity Distribution",
      body: "A histogram showing the frequency of different similarity scores among the detected matches. This helps identify the nature of the text reuse. A peak at 100% suggests verbatim copying, while a bell curve centered around 70% suggests paraphrasing or a different translation tradition."
    },
    clusterView: {
      title: "Cluster View (Network Graph)",
      body: "A force-directed network graph visualizing the relationships between matching text segments. Nodes represent text segments, and edges represent similarity links. Clusters (groups of highly connected nodes) can reveal thematic hubs, frequently repeated formulas, or highly conserved textual traditions."
    },
    witnessDispersion: {
      title: "Witness Dispersion",
      body: "A scatter plot showing where matches occur within the linear progression of each text. The X-axis represents the position in Witness α, and the Y-axis represents the position in Witness β. A perfect diagonal line indicates identical structure. Clusters of points off the diagonal indicate structural rearrangement or localized reuse."
    },
    heatmapView: {
      title: "Position Correspondence (Heatmap)",
      body: "A two-dimensional grid showing the positional correspondence of matching segments between the two witnesses. Each coloured cell represents a detected match. The cell's position on the X-axis corresponds to where the match occurs in Witness α, and its Y-axis position corresponds to the location in Witness β. Colour intensity encodes similarity: warmer tones indicate higher similarity scores.",
      tip: "A diagonal pattern suggests that both texts follow the same sequential order. Scattered cells indicate selective or fragmented reuse. Dense clusters reveal sections of heavy textual borrowing."
    },
    heatmapAxisAlpha: {
      title: "X-Axis: Witness α Position",
      body: "The horizontal axis represents the token position within Witness α (the primary text). Each unit on this axis corresponds to a token index (word or character, depending on the selected algorithm) in Witness α. A match plotted at position 50 on the X-axis means the matched segment begins at approximately the 50th token of the primary text.",
      tip: "The total range of this axis equals the total token count of Witness α, as displayed in the statistics dashboard."
    },
    heatmapAxisBeta: {
      title: "Y-Axis: Witness β Position",
      body: "The vertical axis represents the token position within Witness β (the comparandum). Each unit on this axis corresponds to a token index in Witness β. A match plotted at position 30 on the Y-axis means the matched segment begins at approximately the 30th token of the comparative text.",
      tip: "The total range of this axis equals the total token count of Witness β. If Witness β is significantly shorter or longer than Witness α, the aspect ratio of the heatmap will reflect this asymmetry."
    },
    aiIntertextuality: {
      title: "AI Intertextuality Analysis",
      body: "An AI-powered analysis module that leverages large language models (LLMs) to detect and classify all forms of intertextual relationships between two witnesses. Unlike the algorithmic methods (N-Gram, Levenshtein, etc.) which perform purely formal string comparisons, the AI analysis understands semantics, historical context, genre conventions, and the pragmatics of textual reuse. It can therefore detect allusions, thematic echoes, and structural parallels that escape purely computational methods.",
      tip: "Supported providers: Claude (Anthropic), Gemini (Google), ChatGPT (OpenAI). API keys are stored only in browser memory (never persisted) and sent only to the respective API provider."
    },
    aiIntertextualityMethod: {
      title: "Intertextuality Classification Taxonomy",
      body: "The AI analysis classifies each detected instance of intertextuality according to an eight-category taxonomy derived from classical and modern intertextuality theory. See the categories listed below."
    }
  },
  ja: {
    algorithm: {
      title: "分析アルゴリズム",
      body: "研究目標に最もよく合致するアルゴリズムを選択してください。各アルゴリズムは、調査している文本再利用の種類に応じて異なる強みと制限があります。"
    },
    threshold: {
      title: "類似度閾値",
      body: "強調および報告されるマッチに必要な最小類似度スコア（パーセンテージ）を決定します。",
      items: [
        { label: "高閾値（80% - 100%）", text: "偽陽性を削減します。正確な引用、逐語的コピー、または高度に保存されたパッセージを見つけるのに最適です。微妙なテキスト再利用または大幅に編集されたセクションを見落とす可能性があります。", colorClass: "green" },
        { label: "中閾値（50% - 79%）", text: "バランスの取れたアプローチ。言い換え、翻訳、または適度な写字変動を持つテキストを見つけるのに適しています。", colorClass: "amber" },
        { label: "低閾値（20% - 49%）", text: "極度に断片化された、大幅に破損した、または緩く関連したテキストをキャッチします。ノイズと偽陽性が大幅に増加します。", colorClass: "red" }
      ],
      tip: "ほとんどの学術目的では、中程度の閾値（50-79%）が感度と特異性の最適なバランスを提供します。"
    },
    nsize: {
      title: "N-サイズ/ウィンドウサイズ",
      body: "比較の基本単位として使用されるシーケンスの長さ（単語または文字の数）を定義します。",
      items: [
        { label: "大きなN-サイズ（例5-10以上）", text: "より多くのコンテキストをキャプチャし、ランダムマッチ（ノイズ）を劇的に削減します。再利用されたテキストの長く連続したブロックを探すときに最適です。設定が高すぎると、頻繁な小さな挿入または削除を含むテキストのマッチに失敗します。", colorClass: "green" },
        { label: "小さなN-サイズ（例1-4）", text: "高い柔軟性。断片化された、大幅に再配列された、または緩く言い換えられたテキストをキャッチします。ただし、多くの偽陽性（例：共通のストップワードまたは短い偶然の文字シーケンスのマッチング）が生成されます。", colorClass: "red" }
      ],
      tip: "単語レベルのアルゴリズムでは、3-5が通常最適です。文字レベルのアルゴリズムでは、ランダムな音節のマッチングを避けるために5-10が推奨されます。"
    },
    witnessAlpha: {
      title: "証人α（一次）",
      body: "校合に使用される一次テキストまたは基礎テキスト。これは通常、ソーステキスト、古い写本、または比較物を評価する参照テキストです。αとβの区別は主に可視化目的のためのものです。ほとんどのアルゴリズムは対称的です。つまり、どのテキストがαまたはβであるかに関係なく、類似度スコアは同じになります。"
    },
    witnessBeta: {
      title: "証人β（比較物）",
      body: "二次テキスト、ターゲットテキスト、または比較物。これは通常、一次テキストを再利用していると疑われるテキスト、後の写本、または翻訳です。"
    },
    meanSimilarity: {
      title: "平均類似度",
      body: "検出されたすべてのマッチ全体の平均類似度スコア。",
      items: [
        { label: "高い値（>90%）", text: "逐語的引用または直接的なコピーを示します。", colorClass: "green" },
        { label: "中程度の値（60-90%）", text: "言い換え、翻訳、または文本的進化を示唆します。", colorClass: "amber" },
        { label: "低い値（<60%）", text: "緩い主題的つながりまたは極度に断片化された再利用を示します。", colorClass: "red" }
      ]
    },
    reuseCoverage: {
      title: "再利用カバレッジ",
      body: "検出された再利用によって占められる総テキスト長のパーセンテージ。高いカバレッジは、一つの証人が他の証人から大きく派生しているか同一であることを意味します。低いカバレッジは、テキストが短い引用または特定の専門用語のみを共有していることを意味します。"
    },
    alignments: {
      title: "アライメント",
      body: "アルゴリズムによって識別された個別の平行パッセージの総数。マッチが見つかったすべての単一インスタンスをカウントします。特定のフレーズがターゲットテキストで10回再利用されている場合、10個のアライメントとしてカウントされます。"
    },
    uniqueNgrams: {
      title: "一意なN-グラム",
      body: "個別のマッチングシーケンス（一意なテキストブロック）のカウント。「アライメント」とは異なり、このメトリックはマッチを重複排除します。特定のフレーズが10回再利用されている場合、10個のアライメントと数えられますが、1つの一意なN-グラムのみです。アライメントと一意なN-グラムの大きな違いは、高度に繰り返される定型表現を示します。"
    },
    totalTokenCount: {
      title: "トークン総数",
      body: "各証人内のトークン（アルゴリズムに応じて単語または文字）の総数。これは「再利用カバレッジ」メトリックを文脈化するのに役立ちます。証人αが証人βよりはるかに大きい場合、βの100%カバレッジはαの5%カバレッジのみを表す可能性があります。"
    },
    macroAlignment: {
      title: "マクロレベルアライメントフロー",
      body: "2つのテキストが始まりから終わりまでどのように互いに整列するかの高レベルの視覚的表現。",
      items: [
        { label: "直線の平行線", text: "テキストが同じ物語順序に従うことを示します（例：直接的なコピーまたは翻訳）。", colorClass: "green" },
        { label: "交差する線", text: "構造的再配列を示します。テキストのセクションが周囲に移動されています。", colorClass: "amber" },
        { label: "色の強度", text: "より暗いまたはより鮮やかい線は、その特定のマッチに対してより高い類似度スコアを示します。", colorClass: "blue" }
      ]
    },
    matchGallery: {
      title: "マッチギャラリー",
      body: "類似度スコア順にソートされたすべての識別されたパラレルパッセージの詳細なリスト。ギャラリー内のカードをクリックすると、パラレルビューアーおよびマクロレベルアライメントフローの対応するテキストがハイライトされます。これにより、密接な読み取りとアルゴリズム結果の手動検証が可能になります。"
    },
    similarityDistribution: {
      title: "類似度分布",
      body: "検出されたマッチ間の異なる類似度スコアの頻度を示すヒストグラム。これは文本再利用の性質を特定するのに役立ちます。100%のピークは逐語的なコピーを示唆し、70%を中心とした釣鐘曲線は言い換えまたは異なる翻訳伝統を示唆します。"
    },
    clusterView: {
      title: "クラスタビュー（ネットワークグラフ）",
      body: "マッチングテキストセグメント間の関係を可視化する力有向ネットワークグラフ。ノードはテキストセグメントを表し、エッジは類似性リンクを表します。クラスター（高度に接続されたノードのグループ）は、主題的ハブ、頻繁に繰り返される公式、または高度に保存されたテキスト伝統を明らかにすることができます。"
    },
    witnessDispersion: {
      title: "証人分散",
      body: "各テキストの線形進行内でマッチが発生する場所を示す散布図。X軸は証人αの位置を表し、Y軸は証人βの位置を表します。完璧な対角線は同一の構造を示します。対角線から離れた点のクラスターは、構造的再配列または局所化された再利用を示します。"
    },
    heatmapView: {
      title: "位置対応（ヒートマップ）",
      body: "2つの証人間のマッチングセグメントの位置対応を示す2次元グリッド。各着色されたセルは検出されたマッチを表します。セルのX軸上の位置は証人αでマッチが発生する場所に対応し、Y軸の位置は証人β内の位置に対応します。色の強度は類似度をエンコードします：暖色調はより高い類似度スコアを示します。",
      tip: "対角パターンは、両方のテキストが同じ順序に従うことを示唆しています。散布セルは選択的または断片化された再利用を示します。密集したクラスターは、大量のテキスト借用のセクションを明らかにします。"
    },
    heatmapAxisAlpha: {
      title: "X軸：証人α位置",
      body: "水平軸は証人α（一次テキスト）内のトークン位置を表します。この軸上の各単位は、証人α内のトークンインデックス（選択されたアルゴリズムに応じて単語または文字）に対応します。X軸上の位置50にプロットされたマッチは、マッチされたセグメントが一次テキストの約50番目のトークンで始まることを意味します。",
      tip: "この軸の総範囲は、統計ダッシュボードに表示されている証人αのトークン総数に等しいです。"
    },
    heatmapAxisBeta: {
      title: "Y軸：証人β位置",
      body: "垂直軸は証人β（比較物）内のトークン位置を表します。この軸上の各単位は、証人βのトークンインデックスに対応しています。Y軸上の位置30にプロットされたマッチは、マッチされたセグメントが比較テキストの約30番目のトークンで始まることを意味します。",
      tip: "この軸の総範囲は、証人βのトークン総数に等しいです。証人βが証人αよりも著しく短いか長い場合、ヒートマップのアスペクト比はこの非対称性を反映します。"
    },
    aiIntertextuality: {
      title: "AI中間性分析",
      body: "大規模言語モデル（LLM）を活用して、2つの証人間の中間性関係のすべての形式を検出および分類するAI搭載分析モジュール。純粋に形式的な文字列比較を実行するアルゴリズム的方法（N-グラム、レーベンシュタイン等）とは異なり、AI分析は意味論、歴史的文脈、ジャンル規約、および文本再利用の実用性を理解しています。したがって、純粋に計算方法から逃げる暗示、主題的反響、および構造的平行を検出できます。",
      tip: "サポートされるプロバイダー：Claude（Anthropic）、Gemini（Google）、ChatGPT（OpenAI）。APIキーはブラウザメモリにのみ保存され（永続化されない）、それぞれのAPIプロバイダーにのみ送信されます。"
    },
    aiIntertextualityMethod: {
      title: "中間性分類タクソノミー",
      body: "AI分析は、古典および現代の中間性理論（クリステヴァ、ジュネット、ヘイズ）から派生した8つのカテゴリタクソノミーに従って、検出された各中間性インスタンスを分類します。下記にリストされているカテゴリを参照してください。"
    }
  },
  zh: {
    algorithm: {
      title: "分析算法",
      body: "选择最适合您的研究目标的算法。根据您调查的文本重用类型，每种算法具有不同的优势和局限性。"
    },
    threshold: {
      title: "相似度阈值",
      body: "确定突出显示和报告匹配所需的最小相似度分数（百分比）。",
      items: [
        { label: "高阈值（80% - 100%）", text: "减少假阳性。最适合查找精确引用、逐字复制或高度保留的段落。可能会错过微妙的文本重用或大幅编辑的部分。", colorClass: "green" },
        { label: "中阈值（50% - 79%）", text: "平衡方法。适合查找释义、翻译或具有中等抄写变体的文本。", colorClass: "amber" },
        { label: "低阈值（20% - 49%）", text: "捕获高度碎片化、严重损坏或松散相关的文本。将显著增加噪声和假阳性。", colorClass: "red" }
      ],
      tip: "对于大多数学术目的，中等阈值（50-79%）提供了敏感性和特异性之间的最佳平衡。"
    },
    nsize: {
      title: "N-大小/窗口大小",
      body: "定义用作比较基本单位的序列的长度（单词或字符的数量）。",
      items: [
        { label: "较大的N-大小（例如5-10+）", text: "捕获更多上下文，大幅减少随机匹配（噪声）。最适合查找长的、连续的重用文本块。如果设置过高，它将无法匹配频繁有小插入或删除的文本。", colorClass: "green" },
        { label: "较小的N-大小（例如1-4）", text: "高度灵活。捕获碎片化、大幅重新排列或松散意译的文本。但是，它将产生许多假阳性（例如，匹配常见的停用词或短的偶然字符序列）。", colorClass: "red" }
      ],
      tip: "对于词级算法，3-5通常是最优的。对于字符级算法，建议使用5-10以避免匹配随机音节。"
    },
    witnessAlpha: {
      title: "证人α（主要）",
      body: "用于对照的主要文本或基础文本。这通常是源文本、较旧的手稿或参考文本，据此评估比较项。α和β之间的区别主要是为了可视化目的。大多数算法是对称的，这意味着无论哪个文本是α或β，相似度分数都将相同。"
    },
    witnessBeta: {
      title: "证人β（比较项）",
      body: "辅助文本、目标文本或比较项。这通常是怀疑重用主要文本的文本、较晚的手稿或翻译。"
    },
    meanSimilarity: {
      title: "平均相似度",
      body: "检测到的所有匹配中的平均相似度分数。",
      items: [
        { label: "高值（>90%）", text: "表示逐字引用或直接复制。", colorClass: "green" },
        { label: "中等值（60-90%）", text: "建议释义、翻译或文本演变。", colorClass: "amber" },
        { label: "低值（<60%）", text: "表示松散的主题联系或高度碎片化的重用。", colorClass: "red" }
      ]
    },
    reuseCoverage: {
      title: "重用覆盖范围",
      body: "检测到的重用占据的总文本长度的百分比。高覆盖范围表示一个证人在很大程度上源自或与另一个相同。低覆盖范围表示文本只共享简短引用或特定术语。"
    },
    alignments: {
      title: "对齐",
      body: "算法识别的不同平行段落的总数。这计算发现匹配的每一个实例。如果特定短语在目标文本中重用10次，则计为10个对齐。"
    },
    uniqueNgrams: {
      title: "唯一N-克",
      body: "不同匹配序列（唯一文本块）的计数。与「对齐」不同，此指标删除了匹配的重复项。如果特定短语重用10次，它计为10个对齐但只有1个唯一N-克。对齐与唯一N-克之间的巨大差异表示高度重复的定型表达。"
    },
    totalTokenCount: {
      title: "令牌总数",
      body: "每个证人中的令牌（取决于算法的单词或字符）的总数。这有助于为「重用覆盖范围」指标提供背景。如果证人α远大于证人β，则β的100%覆盖范围可能仅代表α的5%覆盖范围。"
    },
    macroAlignment: {
      title: "宏观级对齐流",
      body: "两个文本从开始到结束如何彼此对齐的高级视觉表示。",
      items: [
        { label: "直线平行线", text: "表示文本遵循相同的叙事顺序（例如直接复制或翻译）。", colorClass: "green" },
        { label: "交叉线", text: "表示结构重排，其中文本部分已四处移动。", colorClass: "amber" },
        { label: "色彩强度", text: "较暗或更鲜艳的线表示该特定匹配的相似度分数较高。", colorClass: "blue" }
      ]
    },
    matchGallery: {
      title: "匹配库",
      body: "所有识别的平行段落的详细列表，按相似度分数排序。单击库中的任何卡将突出显示平行查看器和宏观级对齐流中的相应文本。这允许进行密切阅读和手动验证算法结果。"
    },
    similarityDistribution: {
      title: "相似度分布",
      body: "显示检测到的匹配中不同相似度分数频率的直方图。这有助于识别文本重用的性质。100%的峰值表示逐字复制，而以70%为中心的钟形曲线表示释义或不同的翻译传统。"
    },
    clusterView: {
      title: "群集视图（网络图）",
      body: "一个力导向的网络图，可视化匹配文本段之间的关系。节点表示文本段，边表示相似性链接。群集（高度连接的节点组）可以揭示主题中心、频繁重复的公式或高度保留的文本传统。"
    },
    witnessDispersion: {
      title: "证人分散",
      body: "显示匹配在每个文本的线性进展内发生位置的散点图。X轴表示证人α中的位置，Y轴表示证人β中的位置。完美的对角线表示相同的结构。对角线外的点群表示结构重排或本地化重用。"
    },
    heatmapView: {
      title: "位置对应（热图）",
      body: "显示两个证人之间的匹配段的位置对应的二维网格。每个着色的单元格代表一个检测到的匹配。单元格在X轴上的位置对应于证人α中发生匹配的位置，其Y轴位置对应于证人β中的位置。颜色强度编码相似度：暖色表示较高的相似度分数。",
      tip: "对角线模式表明两个文本都遵循相同的顺序。散布的单元格表示选择性或碎片化的重用。密集的群集揭示了大量文本借用的部分。"
    },
    heatmapAxisAlpha: {
      title: "X轴：证人α位置",
      body: "水平轴表示证人α（主要文本）内的令牌位置。此轴上的每个单位对应于证人α中的令牌索引（取决于所选算法的单词或字符）。在X轴上的位置50处绘制的匹配意味着匹配的段从主要文本的大约第50个令牌开始。",
      tip: "该轴的总范围等于统计仪表板中显示的证人α的令牌总数。"
    },
    heatmapAxisBeta: {
      title: "Y轴：证人β位置",
      body: "垂直轴表示证人β（比较项）内的令牌位置。此轴上的每个单位对应于证人β中的令牌索引。在Y轴上的位置30处绘制的匹配意味着匹配的段从比较文本的大约第30个令牌开始。",
      tip: "该轴的总范围等于证人β的令牌总数。如果证人β的长度明显短于或长于证人α，热图的纵横比将反映此不对称性。"
    },
    aiIntertextuality: {
      title: "AI互文性分析",
      body: "一个由人工智能驱动的分析模块，利用大型语言模型（LLM）来检测和分类两个证人之间所有形式的互文性关系。与执行纯粹形式字符串比较的算法方法（N-克、莱文斯坦等）不同，AI分析理解语义、历史背景、流派约定和文本重用的语用学。因此，它可以检测到纯计算方法所遗漏的暗示、主题回声和结构平行。",
      tip: "支持的提供商：Claude（Anthropic）、Gemini（Google）、ChatGPT（OpenAI）。API密钥仅存储在浏览器内存中（从不持久化），仅发送给各自的API提供商。"
    },
    aiIntertextualityMethod: {
      title: "互文性分类法",
      body: "AI分析根据从古典和现代互文性理论（克里斯特娃、热内特、海斯）衍生的八类分类法对每个检测到的互文性实例进行分类。请参阅下面列出的类别。"
    }
  },
  ko: {
    algorithm: {
      title: "분석 알고리즘",
      body: "연구 목표에 가장 잘 맞는 알고리즘을 선택하세요. 각 알고리즘은 조사 중인 텍스트 재사용의 유형에 따라 다양한 강점과 제한 사항이 있습니다."
    },
    threshold: {
      title: "유사도 임계값",
      body: "강조되고 보고되는 일치에 필요한 최소 유사도 점수(백분율)를 결정합니다.",
      items: [
        { label: "높은 임계값(80% - 100%)", text: "거짓 양성을 줄입니다. 정확한 인용문, 축자 복사 또는 고도로 보존된 구절을 찾는 데 최적입니다. 미묘한 텍스트 재사용이나 대폭 편집된 섹션을 놓칠 수 있습니다.", colorClass: "green" },
        { label: "중간 임계값(50% - 79%)", text: "균형 잡힌 접근 방식입니다. 의역, 번역 또는 중간 정도의 필경 변형이 있는 텍스트를 찾는 데 좋습니다.", colorClass: "amber" },
        { label: "낮은 임계값(20% - 49%)", text: "심각하게 단편화되고, 심각하게 손상되거나 느슨하게 관련된 텍스트를 포착합니다. 노이즈와 거짓 양성을 크게 증가시킵니다.", colorClass: "red" }
      ],
      tip: "대부분의 학술 목적상 중간 임계값(50-79%)이 민감도와 특이도 간의 최적 균형을 제공합니다."
    },
    nsize: {
      title: "N-크기/윈도우 크기",
      body: "비교의 기본 단위로 사용되는 시퀀스의 길이(단어 또는 문자 수)를 정의합니다.",
      items: [
        { label: "더 큰 N-크기(예: 5-10+)", text: "더 많은 문맥을 캡처하고 무작위 일치(노이즈)를 극적으로 줄입니다. 재사용된 텍스트의 길고 연속된 블록을 찾을 때 최적입니다. 너무 높게 설정하면 빈번한 작은 삽입이나 삭제가 있는 텍스트를 일치시키는 데 실패합니다.", colorClass: "green" },
        { label: "더 작은 N-크기(예: 1-4)", text: "매우 유연합니다. 단편화되고, 대폭 재배열되거나, 느슨하게 의역된 텍스트를 포착합니다. 그러나 많은 거짓 양성(예: 일반적인 불용어 또는 짧은 우발적 문자 시퀀스 일치)을 생성합니다.", colorClass: "red" }
      ],
      tip: "단어 수준 알고리즘의 경우 3-5가 보통 최적입니다. 문자 수준 알고리즘의 경우 무작위 음절 일치를 피하기 위해 5-10이 권장됩니다."
    },
    witnessAlpha: {
      title: "증인 α(주요)",
      body: "대조에 사용되는 주요 텍스트 또는 기본 텍스트입니다. 이는 일반적으로 원본 텍스트, 구형 필사본 또는 비교 대상이 평가되는 참조 텍스트입니다. α와 β 간의 구별은 주로 시각화 목적을 위한 것입니다. 대부분의 알고리즘은 대칭이므로 α 또는 β가 어느 텍스트이든 유사도 점수는 동일합니다."
    },
    witnessBeta: {
      title: "증인 β(비교 대상)",
      body: "보조 텍스트, 대상 텍스트 또는 비교 대상입니다. 이는 일반적으로 주요 텍스트를 재사용했다고 의심되는 텍스트, 후대 필사본 또는 번역입니다."
    },
    meanSimilarity: {
      title: "평균 유사도",
      body: "검출된 모든 일치 항목의 평균 유사도 점수입니다.",
      items: [
        { label: "높은 값(>90%)", text: "축자 인용문 또는 직접 복사를 나타냅니다.", colorClass: "green" },
        { label: "중간 값(60-90%)", text: "의역, 번역 또는 텍스트 진화를 나타냅니다.", colorClass: "amber" },
        { label: "낮은 값(<60%)", text: "느슨한 주제 연결 또는 극도로 단편화된 재사용을 나타냅니다.", colorClass: "red" }
      ]
    },
    reuseCoverage: {
      title: "재사용 커버리지",
      body: "감지된 재사용이 차지하는 총 텍스트 길이의 백분율입니다. 높은 커버리지는 한 증인이 크게 다른 증인에서 파생되었거나 동일함을 의미합니다. 낮은 커버리지는 텍스트가 짧은 인용 또는 특정 용어만 공유함을 의미합니다."
    },
    alignments: {
      title: "정렬",
      body: "알고리즘으로 식별된 서로 다른 병렬 구절의 총 수입니다. 일치가 발견된 모든 단일 인스턴스를 계산합니다. 특정 구가 대상 텍스트에서 10번 재사용되면 10개의 정렬로 계산됩니다."
    },
    uniqueNgrams: {
      title: "고유 N-그램",
      body: "고유한 일치 시퀀스(고유한 텍스트 블록)의 수입니다. \"정렬\"과 달리 이 메트릭은 일치를 중복 제거합니다. 특정 구가 10번 재사용되면 10개의 정렬로 계산되지만 1개의 고유 N-그램만 해당됩니다. 정렬과 고유 N-그램 간의 큰 차이는 매우 반복적인 정형화된 언어를 나타냅니다."
    },
    totalTokenCount: {
      title: "토큰 총수",
      body: "각 증인의 토큰(알고리즘에 따라 단어 또는 문자)의 총 수입니다. 이는 \"재사용 커버리지\" 메트릭을 맥락화하는 데 도움이 됩니다. 증인 α가 증인 β보다 훨씬 크면 β의 100% 커버리지는 α의 5% 커버리지만 나타낼 수 있습니다."
    },
    macroAlignment: {
      title: "매크로 수준 정렬 흐름",
      body: "두 텍스트가 처음부터 끝까지 서로 어떻게 정렬되는지의 높은 수준의 시각적 표현입니다.",
      items: [
        { label: "직선 평행선", text: "텍스트가 동일한 서사 순서를 따름을 나타냅니다(예: 직접 복사 또는 번역).", colorClass: "green" },
        { label: "교차하는 선", text: "구조적 재배열을 나타내며, 텍스트 섹션이 이동되었습니다.", colorClass: "amber" },
        { label: "색상 강도", text: "더 어둡거나 더 생생한 선은 해당 특정 일치에 대해 더 높은 유사도 점수를 나타냅니다.", colorClass: "blue" }
      ]
    },
    matchGallery: {
      title: "일치 갤러리",
      body: "유사도 점수로 정렬된 식별된 모든 병렬 구절의 상세 목록입니다. 갤러리의 카드를 클릭하면 평행 뷰어 및 매크로 수준 정렬 흐름에서 해당 텍스트가 강조 표시됩니다. 이를 통해 정밀한 읽기와 알고리즘 결과의 수동 검증이 가능합니다."
    },
    similarityDistribution: {
      title: "유사도 분포",
      body: "감지된 일치 항목 중 다양한 유사도 점수의 빈도를 보여주는 히스토그램입니다. 이는 텍스트 재사용의 성질을 식별하는 데 도움이 됩니다. 100%의 피크는 축자 복사를 시사하고 70%을 중심으로 한 종 곡선은 의역 또는 다른 번역 전통을 시사합니다."
    },
    clusterView: {
      title: "클러스터 보기(네트워크 그래프)",
      body: "일치 텍스트 세그먼트 간의 관계를 시각화하는 힘 지향 네트워크 그래프입니다. 노드는 텍스트 세그먼트를 나타내고 모서리는 유사성 링크를 나타냅니다. 클러스터(높은 연결된 노드 그룹)는 주제 중심, 자주 반복되는 공식 또는 고도로 보존된 텍스트 전통을 드러낼 수 있습니다."
    },
    witnessDispersion: {
      title: "증인 분산",
      body: "각 텍스트의 선형 진행 내에서 일치가 발생하는 위치를 보여주는 산포도입니다. X축은 증인 α의 위치를 나타내고 Y축은 증인 β의 위치를 나타냅니다. 완벽한 대각선은 동일한 구조를 나타냅니다. 대각선 밖의 점 클러스터는 구조적 재배열 또는 국소화된 재사용을 나타냅니다."
    },
    heatmapView: {
      title: "위치 대응(히트맵)",
      body: "두 증인 간 일치 세그먼트의 위치 대응을 보여주는 2차원 그리드입니다. 각 색칠된 셀은 감지된 일치를 나타냅니다. 셀의 X축 위치는 증인 α에서 일치가 발생하는 위치에 해당하고, Y축 위치는 증인 β 내의 위치에 해당합니다. 색상 강도는 유사도를 인코딩합니다: 따뜻한 톤은 더 높은 유사도 점수를 나타냅니다.",
      tip: "대각선 패턴은 두 텍스트가 동일한 순서를 따름을 시사합니다. 분산된 셀은 선택적 또는 단편화된 재사용을 나타냅니다. 밀집된 클러스터는 대량의 텍스트 차용 섹션을 드러냅니다."
    },
    heatmapAxisAlpha: {
      title: "X축: 증인 α 위치",
      body: "수평축은 증인 α(주요 텍스트) 내의 토큰 위치를 나타냅니다. 이 축의 각 단위는 증인 α의 토큰 인덱스(선택한 알고리즘에 따라 단어 또는 문자)에 해당합니다. X축의 위치 50에 표시된 일치는 일치된 세그먼트가 주요 텍스트의 약 50번째 토큰에서 시작됨을 의미합니다.",
      tip: "이 축의 총 범위는 통계 대시보드에 표시된 증인 α의 토큰 총수와 같습니다."
    },
    heatmapAxisBeta: {
      title: "Y축: 증인 β 위치",
      body: "세로축은 증인 β(비교 대상) 내의 토큰 위치를 나타냅니다. 이 축의 각 단위는 증인 β의 토큰 인덱스에 해당합니다. Y축의 위치 30에 표시된 일치는 일치된 세그먼트가 비교 텍스트의 약 30번째 토큰에서 시작됨을 의미합니다.",
      tip: "이 축의 총 범위는 증인 β의 토큰 총수와 같습니다. 증인 β가 증인 α보다 훨씬 짧거나 길면 히트맵의 종횡비가 이 비대칭성을 반영합니다."
    },
    aiIntertextuality: {
      title: "AI 상호텍스트성 분석",
      body: "대규모 언어 모델(LLM)을 활용하여 두 증인 간의 모든 형태의 상호텍스트성 관계를 감지하고 분류하는 AI 기반 분석 모듈입니다. 순수 형식 문자열 비교를 수행하는 알고리즘 방법(N-그램, 레벤슈타인 등)과 달리 AI 분석은 의미론, 역사적 맥락, 장르 규약 및 텍스트 재사용의 실용성을 이해합니다. 따라서 순수 계산 방법을 벗어나는 암시, 주제 에코 및 구조적 유사를 감지할 수 있습니다.",
      tip: "지원되는 제공자: Claude(Anthropic), Gemini(Google), ChatGPT(OpenAI). API 키는 브라우저 메모리에만 저장되며(지속되지 않음) 각각의 API 제공자에게만 전송됩니다."
    },
    aiIntertextualityMethod: {
      title: "상호텍스트성 분류 분류법",
      body: "AI 분석은 고전 및 현대 상호텍스트성 이론(크리스테바, 제네트, 헤이스)에서 파생된 8가지 범주 분류법에 따라 감지된 각 상호텍스트성 인스턴스를 분류합니다. 아래 나열된 범주를 참조하세요."
    }
  },
  de: {
    algorithm: {
      title: "Analysealgorithmen",
      body: "Wählen Sie den Algorithmus, der Ihren Forschungszielen am besten entspricht. Jeder Algorithmus hat unterschiedliche Stärken und Grenzen, je nach Art der Textwiederver wendung, die Sie untersuchen."
    },
    threshold: {
      title: "Ähnlichkeitsschwelle",
      body: "Bestimmt den Mindest-Ähnlichkeitswert (Prozentsatz), der für einen hervorgehobenen und gemeldeten Match erforderlich ist.",
      items: [
        { label: "Hohe Schwelle (80% - 100%)", text: "Reduziert falsch positive Ergebnisse. Am besten für die Suche nach exakten Zitaten, wörtliche Kopien oder hochgradig erhaltene Passagen. Könnten subtile Textwiederver wendungen oder stark bearbeitete Abschnitte übersehen.", colorClass: "green" },
        { label: "Mittlere Schwelle (50% - 79%)", text: "Ein ausgewogener Ansatz. Gut zum Auffinden von Umschreibungen, Übersetzungen oder Texten mit gemäßigten Schreibvariationen.", colorClass: "amber" },
        { label: "Niedrige Schwelle (20% - 49%)", text: "Erfasst hochgradig fragmentiert, stark beschädigte oder lose verwandte Texte. Wird Rauschen und falsch positive Ergebnisse erheblich erhöhen.", colorClass: "red" }
      ],
      tip: "Für die meisten wissenschaftlichen Zwecke bietet eine mittlere Schwelle (50-79%) das beste Gleichgewicht zwischen Empfindlichkeit und Spezifität."
    },
    nsize: {
      title: "N-Größe/Fenstergröße",
      body: "Definiert die Länge der Sequenz (Anzahl der Wörter oder Zeichen), die als Basiseinheit für den Vergleich verwendet wird.",
      items: [
        { label: "Größere N-Größe (z.B. 5-10+)", text: "Erfasst mehr Kontext und reduziert zufällige Übereinstimmungen (Rauschen) drastisch. Am besten bei der Suche nach langen, zusammenhängenden Textwiederverwendungsblöcken. Wenn zu hoch eingestellt, schlägt es bei Texten mit häufigen kleinen Einfügungen oder Löschungen fehl.", colorClass: "green" },
        { label: "Kleinere N-Größe (z.B. 1-4)", text: "Hochgradig flexibel. Erfasst fragmentierte, stark umgeordnete oder lose umschriebene Texte. Es wird jedoch viele falsch positive Ergebnisse erzeugen (z.B. Übereinstimmung häufiger Stoppwörter oder kurzer, zufälliger Zeichenfolgen).", colorClass: "red" }
      ],
      tip: "Für Wort-Ebenen-Algorithmen sind 3-5 normalerweise optimal. Für Zeichen-Ebenen-Algorithmen wird 5-10 empfohlen, um eine Übereinstimmung mit zufälligen Silben zu vermeiden."
    },
    witnessAlpha: {
      title: "Zeuge α (Primär)",
      body: "Der primäre Text oder Grundtext, der für die Kollation verwendet wird. Dies ist typischerweise der Quelltext, das ältere Manuskript oder der Referenztext, gegen den das Vergleichsobjekt bewertet wird. Die Unterscheidung zwischen α und β dient hauptsächlich zu Visualisierungszwecken. Die meisten Algorithmen sind symmetrisch, was bedeutet, dass der Ähnlichkeitswert unabhängig davon gleich ist, welcher Text α oder β ist."
    },
    witnessBeta: {
      title: "Zeuge β (Vergleichsobjekt)",
      body: "Der sekundäre Text, Zieltext oder das Vergleichsobjekt. Dies ist typischerweise der Text, der den primären Text wiederzuverwenden verdächtigt wird, ein späteres Manuskript oder eine Übersetzung."
    },
    meanSimilarity: {
      title: "Durchschnittliche Ähnlichkeit",
      body: "Der durchschnittliche Ähnlichkeitswert über alle erkannten Übereinstimmungen.",
      items: [
        { label: "Hohe Werte (>90%)", text: "Deuten auf wörtliche Zitate oder direkte Kopien hin.", colorClass: "green" },
        { label: "Mittlere Werte (60-90%)", text: "Deuten auf Umschreibung, Übersetzung oder Textenentwicklung hin.", colorClass: "amber" },
        { label: "Niedrige Werte (<60%)", text: "Deuten auf lockere thematische Verbindungen oder hochgradig fragmentierte Wiederverwendung hin.", colorClass: "red" }
      ]
    },
    reuseCoverage: {
      title: "Wiederverwendungsabdeckung",
      body: "Der Prozentsatz der Gesamttextlänge, der durch erkannte Wiederverwendungen belegt ist. Eine hohe Abdeckung bedeutet, dass ein Zeuge stark vom anderen abgeleitet ist oder mit dem anderen identisch ist. Eine geringe Abdeckung bedeutet, dass die Texte nur kurze Zitate oder spezifische Terminologie gemeinsam haben."
    },
    alignments: {
      title: "Ausrichtungen",
      body: "Die Gesamtzahl der vom Algorithmus identifizierten unterschiedlichen parallelen Passagen. Dies zählt jede einzelne Instanz, in der eine Übereinstimmung gefunden wurde. Wenn eine bestimmte Phrase 10 Mal im Zieltext wiederverwendet wird, zählt dies als 10 Ausrichtungen."
    },
    uniqueNgrams: {
      title: "Eindeutige N-Gramme",
      body: "Die Anzahl der unterschiedlichen Übereinstimmungssequenzen (eindeutige Textblöcke). Im Gegensatz zu \"Ausrichtungen\" werden bei dieser Metrik die Übereinstimmungen dedupliziert. Wenn eine bestimmte Phrase 10 Mal wiederverwendet wird, zählt dies als 10 Ausrichtungen, aber nur 1 eindeutiges N-Gramm. Ein großer Unterschied zwischen Ausrichtungen und eindeutigen N-Grammen deutet auf hochgradig wiederholte formelhafte Sprache hin."
    },
    totalTokenCount: {
      title: "Gesamttokenanzahl",
      body: "Die Gesamtzahl der Token (Wörter oder Zeichen, je nach Algorithmus) in jedem Zeugen. Dies hilft, die Metrik \"Wiederverwendungsabdeckung\" in den Kontext einzuordnen. Wenn Zeuge α viel größer ist als Zeuge β, könnte eine 100%ige Abdeckung von β nur eine 5%ige Abdeckung von α darstellen."
    },
    macroAlignment: {
      title: "Makro-Level-Ausrichtungsfluss",
      body: "Eine hochrangige visuelle Darstellung, wie sich die beiden Texte vom Anfang bis zum Ende gegenseitig ausrichten.",
      items: [
        { label: "Gerade parallele Linien", text: "Deuten darauf hin, dass die Texte derselben narrativen Reihenfolge folgen (z.B. eine direkte Kopie oder Übersetzung).", colorClass: "green" },
        { label: "Sich kreuzende Linien", text: "Deuten auf eine strukturelle Umordnung hin, bei der Textabschnitte verschoben wurden.", colorClass: "amber" },
        { label: "Farbintensität", text: "Dunklere oder lebendigere Linien deuten auf höhere Ähnlichkeitswerte für diese spezifische Übereinstimmung hin.", colorClass: "blue" }
      ]
    },
    matchGallery: {
      title: "Match-Galerie",
      body: "Eine detaillierte Liste aller identifizierten parallelen Passagen, sortiert nach ihrem Ähnlichkeitswert. Wenn Sie auf eine Karte in der Galerie klicken, wird der entsprechende Text im Parallel Viewer und im Makro-Level-Ausrichtungsfluss hervorgehoben. Dies ermöglicht ein genaues Lesen und eine manuelle Überprüfung der algorithmischen Ergebnisse."
    },
    similarityDistribution: {
      title: "Ähnlichkeitsverteilung",
      body: "Ein Histogramm, das die Häufigkeit verschiedener Ähnlichkeitswerte unter den erkannten Übereinstimmungen zeigt. Dies hilft, die Art der Textwiederver wendung zu identifizieren. Ein Spitzenwert bei 100% deutet auf wörtliche Kopien hin, während eine um 70% zentrierte Glockenkurve auf Umschreibung oder eine andere Übersetzungstradition hindeutet."
    },
    clusterView: {
      title: "Cluster-Ansicht (Netzwerkdiagramm)",
      body: "Ein kraftgerichteter Netzwerkgraph, der die Beziehungen zwischen übereinstimmenden Textsegmenten visualisiert. Knoten stellen Textsegmente dar und Kanten stellen Ähnlichkeitslinks dar. Cluster (Gruppen von stark verbundenen Knoten) können thematische Zentren, häufig wiederholte Formeln oder hochgradig erhaltene Texttradition en offenbaren."
    },
    witnessDispersion: {
      title: "Zeuge Dispersion",
      body: "Ein Streudiagramm, das zeigt, wo Übereinstimmungen innerhalb des linearen Fortschritts jedes Textes auftreten. Die X-Achse stellt die Position in Zeuge α dar, und die Y-Achse stellt die Position in Zeuge β dar. Eine perfekte Diagonallinie zeigt identische Struktur an. Punktcluster neben der Diagonale deuten auf strukturelle Umordnung oder lokalisierte Wiederverwendung hin."
    },
    heatmapView: {
      title: "Positionskorrespondenz (Wärmekarte)",
      body: "Ein zweidimensionales Gitter, das die Positionskorrespondenz von Übereinstimmungssegmenten zwischen den beiden Zeugen zeigt. Jede farbige Zelle stellt eine erkannte Übereinstimmung dar. Die Position der Zelle auf der X-Achse entspricht, wo die Übereinstimmung in Zeuge α auftritt, und ihre Y-Achsen-Position entspricht dem Ort in Zeuge β. Die Farbintensität codiert Ähnlichkeit: Wärmere Töne deuten auf höhere Ähnlichkeitswerte hin.",
      tip: "Ein Diagonalmuster deutet darauf hin, dass beide Texte derselben sequenziellen Reihenfolge folgen. Verstreute Zellen deuten auf selektive oder fragmentierte Wiederverwendung hin. Dichte Cluster zeigen Abschnitte mit schwerer Textwiederver wendung."
    },
    heatmapAxisAlpha: {
      title: "X-Achse: Zeugen α Position",
      body: "Die horizontale Achse stellt die Tokenposition innerhalb von Zeuge α (dem primären Text) dar. Jede Einheit auf dieser Achse entspricht einem Token-Index (Wort oder Zeichen, je nach ausgewähltem Algorithmus) in Zeuge α. Eine Übereinstimmung, die auf Position 50 auf der X-Achse aufgezeichnet ist, bedeutet, dass das übereinstimmende Segment ungefähr beim 50. Token des primären Textes beginnt.",
      tip: "Der Gesamtbereich dieser Achse entspricht der Gesamttokenanzahl von Zeuge α, wie im Statistik-Dashboard angezeigt."
    },
    heatmapAxisBeta: {
      title: "Y-Achse: Zeugen β Position",
      body: "Die vertikale Achse stellt die Tokenposition innerhalb von Zeuge β (dem Vergleichsobjekt) dar. Jede Einheit auf dieser Achse entspricht einem Token-Index in Zeuge β. Eine Übereinstimmung, die auf Position 30 auf der Y-Achse aufgezeichnet ist, bedeutet, dass das übereinstimmende Segment ungefähr beim 30. Token des Vergleichstextes beginnt.",
      tip: "Der Gesamtbereich dieser Achse entspricht der Gesamttokenanzahl von Zeuge β. Wenn Zeuge β erheblich kürzer oder länger als Zeuge α ist, spiegelt das Seitenverhältnis der Wärmekarte diese Asymmetrie wider."
    },
    aiIntertextuality: {
      title: "KI-Intertextualitätsanalyse",
      body: "Ein KI-gestütztes Analysemodul, das große Sprachmodelle (LLM) nutzt, um alle Formen von Intertextualitätsbeziehungen zwischen zwei Zeugen zu erkennen und zu klassifizieren. Anders als algorithmusche Methoden (N-Gramm, Levenshtein usw.), die rein formale Zeichenkettenvergleiche durchführen, versteht die KI-Analyse Semantik, historischen Kontext, Genrekonventionen und die Pragmatik der Textwiederver wendung. Sie kann daher Anspielungen, thematische Echos und strukturelle Parallelen erkennen, die rein rechnerische Methoden entgehen.",
      tip: "Unterstützte Anbieter: Claude (Anthropic), Gemini (Google), ChatGPT (OpenAI). API-Schlüssel werden nur im Browser-Speicher gespeichert (nie persistent) und nur an den jeweiligen API-Anbieter gesendet."
    },
    aiIntertextualityMethod: {
      title: "Intertextualitätsklassifizierungstaxonomie",
      body: "Die KI-Analyse klassifiziert jede erkannte Intertextualitätsinstanz nach einer aus klassischer und moderner Intertextualitätstheorie abgeleiteten achtgliedrigen Klassifizierungstaxonomie. Siehe die unten aufgeführten Kategorien."
    }
  },
  la: {
    algorithm: {
      title: "Algorithmata Analytica",
      body: "Eligite algorithma quod propositis vestris maxime congruit. Quodlibet algorithma diversos vires ac limites secundum genus reutilisationis textus quam investigatis habet."
    },
    threshold: {
      title: "Limen Similitudinis",
      body: "Minima puncta similitudinis (percentages) quae ad concordantiam insigniendam et renuntiandam necessaria sunt determinat.",
      items: [
        { label: "Limen Altum (80% - 100%)", text: "Falsas affirmationes minuit. Optimum est ad citatus exactos, copias verbales, aut passus altissime servatos invenientes. Delicatas reutilisationes textus vel fortasse partes late emendatas praetermittere potest.", colorClass: "green" },
        { label: "Limen Medium (50% - 79%)", text: "Ratio aequilibris. Bonus est paraphrases, translationes, aut textos cum variationibus scriptorialibus moderatis invenient es.", colorClass: "amber" },
        { label: "Limen Humile (20% - 49%)", text: "Textos altissime fragmentatos, pessime laesos, aut laxe connexos capit. Sonum et falsas affirmationes valde augebit.", colorClass: "red" }
      ],
      tip: "Ad maxima fere academica, limen medium (50-79%) optimum aequilibrium inter sensibilitatem et specificitatem praebet."
    },
    nsize: {
      title: "N-Magnitudo/Magnitudo Fenestrae",
      body: "Longitudinem sequentiae (numerum verborum aut characterum) quae ut basus comparationis unitas adhibetur definit."
    },
    witnessAlpha: {
      title: "Testis α (Primus)",
      body: "Textus primus aut fundamentalis collationem adhibitus. Hoc typice textus fons, manuscriptum antiquius, aut textus referentiae est contra quem comparandum exaenigitur. Distinctio inter α et β maxime ad visualizationis proposita est. Maxima algoritha symmetrica sunt, significans puncta similitudinis eadem sunt sive α sive β quodlibet textum sit."
    },
    witnessBeta: {
      title: "Testis β (Comparandum)",
      body: "Textus secundarius, textus directionis, aut comparandum. Hoc typice textus est qui primarium textum reutilisare suspicatur, manuscriptum posterius, aut translatio."
    },
    meanSimilarity: {
      title: "Similitudine Intima",
      body: "Puncta similitudinis intima per omnes concordantias detectas."
    },
    reuseCoverage: {
      title: "Operimentum Reutilisationis",
      body: "Percentages totius longitudinis textus per reutilisationes detectas occupatae. Operimentum altum quod unus testis valde ex altero fluit aut identicum est. Operimentum humile quod textos tantummodo breves citatos aut terminologiam specificam communicant significat."
    },
    alignments: {
      title: "Conformationes",
      body: "Summa passuum parallelorum distinctorum ab algorithmate identificatorum. Omnem singularem instantiam ubi concordantia inventa est enumerat. Si particularis sententia 10ies in textu directionis iteratur, 10 conformationes computatur."
    },
    uniqueNgrams: {
      title: "N-Grammata Unica",
      body: "Numerus sequentiarum concordantarum distinctarum (blockorum textus singularium). Diversum ab \"Conformationibus\", hoc metrum concordantias duplicatas removet. Si particularis sententia 10ies iteratur, 10 conformationes sed 1 tantummodo N-gramma singulare computatur."
    },
    totalTokenCount: {
      title: "Numerus Tokenorum Totalis",
      body: "Numerus totalis tokenorum (verba aut characteres, secundum algorithma) in quoque testis. Hoc metrum \"Operimenti Reutilisationis\" contextualizar adiuvat. Si testis α multo maior quam testis β sit, operimentum 100% β tantummodo operimentum 5% α repraesentare potest."
    },
    macroAlignment: {
      title: "Fluxus Conformationis Macro-Ordinis",
      body: "Repraesentatio visualis altioris ordinis quomodo duo texti inter se ab initio ad finem conformentur.",
      items: [
        { label: "Lineae directe parallelae", text: "Significat textos ordinem narrationis eandem sequi (eg. copiam directam aut translationem).", colorClass: "green" },
        { label: "Lineae praetereuntes", text: "Significat ordinationem structuralem reformam, ubi sectiones textus circumlatum motae sunt.", colorClass: "amber" },
        { label: "Intensio coloris", text: "Lineae obscuriores aut vibrantiores significant puncta similitudinis altiora pro illa particulari concordantia.", colorClass: "blue" }
      ]
    },
    matchGallery: {
      title: "Galeria Concordantiarum",
      body: "Catalogus accuratus omnium passuum parallelorum identificatorum, secundum puncta similitudinis ordinatus. Cliccando cartas in galeria, textus congruens in Spectatione Parallela et Fluxu Conformationis Macro-Ordinis illustratur. Hoc lectiones denses et verificationen manualem resultatum algorithmatum concedit."
    },
    similarityDistribution: {
      title: "Distributio Similitudinis",
      body: "Histogramma ostendens frequentiam punctorum similitudinis diversorum inter concordantias detectas. Hoc naturam reutilisationis textus identificare iuvat. Apex ad 100% copiam verbarem significat, cum curvula campana circa 70% centrata paraphrasim aut aliam traditionem translationis significat."
    },
    clusterView: {
      title: "Aspectus Aggregati (Diagramma Retis)",
      body: "Diagramma retis vi directum relationes inter segmenta textus congruentia visualizans. Nodi segmenta textus repraesentant, et connexiones similitudines linkas repraesentant. Aggregata (coetus nodorum altissime connexorum) centra thematica, formulas frequenter repetitas, aut traditiones textuales altissime servatas revelare possunt."
    },
    witnessDispersion: {
      title: "Dispersio Testis",
      body: "Scatterplot ostendens ubi concordantiae in progressione lineari uniusquisque textus occurrunt. Axis X positionem in testis α refert, axis Y positionem in testis β refert. Linea diagonalis perfecta structuram identicum significat. Coetus punctorum ab diagonali recedentes ordinationem structuralem reformam aut reutilisationem localisatam significant."
    },
    heatmapView: {
      title: "Correspondentia Positionis (Cartogram Caloris)",
      body: "Reticula bidimensionale correspondentiain positionis segmentorum congruentiorum inter duos testes ostendens. Quodlibet cellulum coloratum concordantiam detectam repraesentat. Positio celluli in axe X ubi concordantia in testis α occurrit correspondet, et positio Y axeos in testis β locum correspondet. Intensio coloris similitudinem ncodat: tonae calidiores puncta similitudinis altiora significant.",
      tip: "Pattern diagonale quod ambo texti eandem ordinem sequuntur significat. Cellulae dispersae reutilisationem selectivam aut fragmentatam significant. Aggregata densa sectiones gravibus mutuis textui ostendunt."
    },
    heatmapAxisAlpha: {
      title: "Axis X: Positio Testis α",
      body: "Axis horizontalis positionem tokenum in testis α (textus primario) repraesentat. Quodlibet unitas in axe hac indici tokenorum (verbum aut character, secundum algorithma selectum) in testis α correspondet. Concordantia positionem 50 in axe X delineata significat segmentum concordans ab ca. 50.mo tokeno textus primarii incipit."
    },
    heatmapAxisBeta: {
      title: "Axis Y: Positio Testis β",
      body: "Axis verticalis positionem tokenum in testis β (comparandum) repraesentat. Quodlibet unitas in axe hac indici tokenorum in testis β correspondet. Concordantia positionem 30 in axe Y delineata significat segmentum concordans ab ca. 30.mo tokeno textus comparationis incipit."
    },
    aiIntertextuality: {
      title: "Analysi Intertextualitatis AI",
      body: "Modulus analysis ab AI motus qui modelos linguae magnitudinis (LLM) adhibet ad omnes formas relationum intertextualitatis inter duos testes detegendas et classificandas. Diversum ab methodis algorithmatis (N-grammata, Levenshtein, etc.) quae puras comparationes linemarum formaliter praebent, analysis AI semantica, contextum historicum, conventiones generis, et pragmatica reutilisationis textus intelligit. Proinde allusiones, resonantias thematicas, et parallela structuralia quae metodi puramente computationales effugiunt detegere potest.",
      tip: "Agenetes fulciti: Claude (Anthropic), Gemini (Google), ChatGPT (OpenAI). Claves API tantummodo in memoria navigationis repositae (nunquam persistite) et tantummodo ageneti API rektivae mittuntur."
    },
    aiIntertextualityMethod: {
      title: "Taxonomia Classificationis Intertextualitatis",
      body: "Analysis AI quamlibet instantiam intertextualitatis detectam secundum taxonomiam octo-categoryam ex theoria intertextualitatis classicae et modernae (Kristeva, Genette, Hayes) derivatam classifitat. Categories infra repertas vide."
    }
  }
};

export function getAlgorithmHelp(lang: Language): AlgorithmHelp[] {
  return algorithmHelpData[lang];
}

export function getIntertextualityCategoryHelp(lang: Language): IntertextualityCategoryHelp[] {
  return intertextualityHelpData[lang];
}

export function getHelpContent(lang: Language): Record<string, HelpTopic> {
  return helpTopicData[lang];
}
