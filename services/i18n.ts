/**
 * Internationalization (i18n) System for ICoMa
 * Supports: English, Japanese, Chinese (Simplified), Korean, German, Latin, and Italian
 */

export type Language = 'en' | 'ja' | 'zh' | 'ko' | 'de' | 'la' | 'it';

export const LANGUAGES: Record<Language, string> = {
  en: 'English',
  ja: '日本語',
  zh: '中文',
  ko: '한국어',
  de: 'Deutsch',
  la: 'Latina',
  it: 'Italiano'
};

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'ICoMa': 'ICoMa',
    'Intertextuality Collation Machine': 'Intertextuality Collation Machine',
    'Engine Status': 'Engine Status',
    'READY FOR COLLATION': 'READY FOR COLLATION',

    // Quick Load Section
    'Quick Load': 'Quick Load',

    // Witness Labels
    'Witness α (Primary)': 'Witness α (Primary)',
    'Witness β (Comparandum)': 'Witness β (Comparandum)',

    // Text Input Placeholders
    'Insert primary text (Source)...': 'Insert primary text (Source)...',
    'Insert comparative text (Target)...': 'Insert comparative text (Target)...',

    // Configuration Section
    'Collation Parameters': 'Collation Parameters',
    'Analysis Algorithm': 'Analysis Algorithm',
    'Similarity Threshold': 'Similarity Threshold',
    'N-Size / Window Size': 'N-Size / Window Size',

    // Analysis Algorithm Options
    'English (Text Reuse/Plagiarism)': 'English (Text Reuse/Plagiarism)',

    // Buttons
    'RUN COLLATION ENGINE': 'RUN COLLATION ENGINE',
    'PROCESSING LARGE DATASET...': 'PROCESSING LARGE DATASET...',

    // Statistics Labels
    'Mean Similarity': 'Mean Similarity',
    'Reuse Coverage': 'Reuse Coverage',
    'Alignments': 'Alignments',
    'Unique N-Grams': 'Unique N-Grams',
    'Total Token Count': 'Total Token Count',

    // Statistics Descriptions
    'The average similarity score across all detected matches. High values (>90%) indicate verbatim quotations, while lower values suggest paraphrasing or textual evolution.':
      'The average similarity score across all detected matches. High values (>90%) indicate verbatim quotations, while lower values suggest paraphrasing or textual evolution.',
    'The percentage of the total text length occupied by detected reuses. A high coverage implies that one witness is largely derived from or identical to the other.':
      'The percentage of the total text length occupied by detected reuses. A high coverage implies that one witness is largely derived from or identical to the other.',
    'The count of distinct matching sequences. If a specific phrase is reused 10 times, it counts as 10 alignments but only 1 unique N-gram.':
      'The count of distinct matching sequences. If a specific phrase is reused 10 times, it counts as 10 alignments but only 1 unique N-gram.',
    'Unlike "Alignments", this metric deduplicates the matches. If a specific phrase is reused 10 times, it counts as 10 alignments but only 1 unique N-gram. A large difference between Alignments and Unique N-Grams indicates highly repetitive formulaic language.':
      'Unlike "Alignments", this metric deduplicates the matches. If a specific phrase is reused 10 times, it counts as 10 alignments but only 1 unique N-gram. A large difference between Alignments and Unique N-Grams indicates highly repetitive formulaic language.',
    'This helps contextualize the "Reuse Coverage" metric. If Witness α is much larger than Witness β, a 100% coverage of β might only represent a 5% coverage of α.':
      'This helps contextualize the "Reuse Coverage" metric. If Witness α is much larger than Witness β, a 100% coverage of β might only represent a 5% coverage of α.',

    // Visualization Titles
    'Macro-Level Alignment Flow': 'Macro-Level Alignment Flow',
    'Match Gallery': 'Match Gallery',
    'Position Correspondence (Heatmap)': 'Position Correspondence (Heatmap)',
    'Similarity Distribution': 'Similarity Distribution',
    'Cluster View (Network Graph)': 'Cluster View (Network Graph)',
    'Witness Dispersion': 'Witness Dispersion',

    // Visualization Descriptions
    'The X-axis represents the position in Witness α, and the Y-axis represents the position in Witness β. A perfect diagonal line indicates identical structure. Clusters of points off the diagonal indicate structural rearrangement or localized reuse.':
      'The X-axis represents the position in Witness α, and the Y-axis represents the position in Witness β. A perfect diagonal line indicates identical structure. Clusters of points off the diagonal indicate structural rearrangement or localized reuse.',
    'Each coloured cell represents a detected match. The cell\'s position on the X-axis corresponds to where the match occurs in Witness α, and its Y-axis position corresponds to the location in Witness β. Colour intensity encodes similarity: warmer tones indicate higher similarity scores. Clicking a cell selects that match and highlights it across all visualizations.':
      'Each coloured cell represents a detected match. The cell\'s position on the X-axis corresponds to where the match occurs in Witness α, and its Y-axis position corresponds to the location in Witness β. Colour intensity encodes similarity: warmer tones indicate higher similarity scores. Clicking a cell selects that match and highlights it across all visualizations.',
    'X-Axis: Witness α Position': 'X-Axis: Witness α Position',
    'Y-Axis: Witness β Position': 'Y-Axis: Witness β Position',
    'The horizontal axis represents the token position within Witness α (the primary text).':
      'The horizontal axis represents the token position within Witness α (the primary text).',
    'Each unit on this axis corresponds to a token index (word or character, depending on the selected algorithm) in Witness α. A match plotted at position 50 on the X-axis means the matched segment begins at approximately the 50th token of the primary text.':
      'Each unit on this axis corresponds to a token index (word or character, depending on the selected algorithm) in Witness α. A match plotted at position 50 on the X-axis means the matched segment begins at approximately the 50th token of the primary text.',
    'The vertical axis represents the token position within Witness β (the comparandum).':
      'The vertical axis represents the token position within Witness β (the comparandum).',
    'Each unit on this axis corresponds to a token index in Witness β. A match plotted at position 30 on the Y-axis means the matched segment begins at approximately the 30th token of the comparative text.':
      'Each unit on this axis corresponds to a token index in Witness β. A match plotted at position 30 on the Y-axis means the matched segment begins at approximately the 30th token of the comparative text.',

    // Match Gallery
    'TOP REUSES': 'TOP REUSES',
    'No Matches Detected': 'No Matches Detected',
    'Try lowering the threshold or increasing window size.': 'Try lowering the threshold or increasing window size.',

    // AI Intertextuality Analysis Section
    'AI Intertextuality Analysis': 'AI Intertextuality Analysis',
    'Multi-Model Citation, Allusion & Echo Detection': 'Multi-Model Citation, Allusion & Echo Detection',
    'Run AI Intertextuality Analysis': 'Run AI Intertextuality Analysis',
    'API Key': 'API Key',
    'Model': 'Model',
    'Comparative View': 'Comparative View',
    'Scholarly Assessment': 'Scholarly Assessment',
    'No AI Analysis Yet': 'No AI Analysis Yet',
    'Configure API keys and run analysis above.': 'Configure API keys and run analysis above.',
    'Show Configuration': 'Show Configuration',
    'Analyzing Intertextuality': 'Analyzing Intertextuality',
    'Intertextuality Classification Taxonomy': 'Intertextuality Classification Taxonomy',
    'Confidence': 'Confidence',
    'ext. source': 'ext. source',
    'Possible External Source': 'Possible External Source',
    'No matches in this category.': 'No matches in this category.',
    'All Categories': 'All Categories',
    'matches': 'matches',
    'Show Key': 'Show Key',
    'Hide Key': 'Hide Key',
    'Select Model': 'Select Model',
    'Bug Report / Feature Request': 'Bug Report / Feature Request',

    // Threshold Help
    'High Threshold (80% - 100%)': 'High Threshold (80% - 100%)',
    'Medium Threshold (50% - 79%)': 'Medium Threshold (50% - 79%)',
    'Low Threshold (20% - 49%)': 'Low Threshold (20% - 49%)',

    // N-Size Help
    'Larger N-Size (e.g., 5-10+)': 'Larger N-Size (e.g., 5-10+)',
    'Smaller N-Size (e.g., 1-4)': 'Smaller N-Size (e.g., 1-4)',

    // AI Reuse Categories
    'Direct Quotation': 'Direct Quotation',
    'Paraphrased Reuse': 'Paraphrased Reuse',
    'Structural Imitation': 'Structural Imitation',
    'Thematic Reuse': 'Thematic Reuse',

    // Footer
    'Advanced Digital Humanities Collation Tool': 'Advanced Digital Humanities Collation Tool',
    'Changelog': 'Changelog',

    // Privacy Note
    'Privacy Note: API keys are stored only in browser memory (never persisted) and sent only to the respective API provider.':
      'Privacy Note: API keys are stored only in browser memory (never persisted) and sent only to the respective API provider.',

    // Header/UI Controls
    'UI Language': 'UI Language',
    'Font': 'Font',
    'Decrease font size': 'Decrease font size',
    'Increase font size': 'Increase font size',
    'GitHub Issues': 'GitHub Issues',

    // Algorithm Names
    'Smith-Waterman (Local Alignment)': 'Smith-Waterman (Local Alignment)',
    'Coptic-Aware (Vowel & Mark Norm)': 'Coptic-Aware (Vowel & Mark Norm)',
    'Levenshtein (Edit Distance)': 'Levenshtein (Edit Distance)',
    'Jaccard (Set Similarity)': 'Jaccard (Set Similarity)',
    'Word-Level N-Gram': 'Word-Level N-Gram',
    'Character-Level N-Gram': 'Character-Level N-Gram',
    'FastText-like (Subword N-Grams)': 'FastText-like (Subword N-Grams)',
    'Word2Vec-like (Local Co-occurrence)': 'Word2Vec-like (Local Co-occurrence)',

    // N-Gram Info Box
    'N-Gram Definition': 'N-Gram Definition',
    'N-Gram Definition Text': 'An N-Gram is a contiguous sequence of n items from a given text. Character N-grams (e.g., n=4) are excellent for identifying similarities in scripts without spaces or with spelling variations. Word N-grams (e.g., n=3) focus on phrasal reuse while ignoring minor character mismatches.',

    // Match Gallery
    'matches ranked by similarity': 'matches ranked by similarity',
    'Rank': 'Rank',
    'Best Match': 'Best Match',
    'pos': 'pos',
    'Length': 'Length',
    'tokens': 'tokens',

    // Footer
    'CC BY 4.0 License': 'CC BY 4.0 License',

    // Chart Controls
    'Zoom In': 'Zoom In',
    'Zoom Out': 'Zoom Out',
    'Reset Zoom': 'Reset Zoom',
    'Download as SVG': 'Download as SVG',
    'Download as PNG': 'Download as PNG',
    'Help': 'Help',
    'Exit Fullscreen': 'Exit Fullscreen',
    'Press ESC or click to exit fullscreen': 'Press ESC or click to exit fullscreen',

    // DiffView
    'Exact Match': 'Exact Match',
    'Diff': 'Diff',

    // Font Family Options
    'Serif (Default)': 'Serif (Default)',
    'Sans-Serif': 'Sans-Serif',
    'Monospace': 'Monospace',

    // Misc
    'chars': 'chars',
    'Click to rename': 'Click to rename',
    'Close': 'Close',
  },

  ja: {
    // ヘッダー
    'ICoMa': 'ICoMa',
    'Intertextuality Collation Machine': '間テクスト性分析器',
    'Engine Status': 'エンジンステータス',
    'READY FOR COLLATION': '照合準備完了',

    // クイックロードセクション
    'Quick Load': 'クイックロード',

    // 証拠文本ラベル
    'Witness α (Primary)': '証拠文本 α（一次テキスト）',
    'Witness β (Comparandum)': '証拠文本 β（比較対象）',

    // テキスト入力プレースホルダー
    'Insert primary text (Source)...': '一次テキスト（原文）を挿入...',
    'Insert comparative text (Target)...': '比較対象テキスト（目標）を挿入...',

    // 設定セクション
    'Collation Parameters': '照合パラメータ',
    'Analysis Algorithm': '分析アルゴリズム',
    'Similarity Threshold': '類似度閾値',
    'N-Size / Window Size': 'N-サイズ / ウィンドウサイズ',

    // 分析アルゴリズムオプション
    'English (Text Reuse/Plagiarism)': 'テキスト再利用 / 盗用検出',

    // ボタン
    'RUN COLLATION ENGINE': '照合エンジンを実行',
    'PROCESSING LARGE DATASET...': '大規模データセットを処理中...',

    // 統計ラベル
    'Mean Similarity': '平均類似度',
    'Reuse Coverage': '再利用カバレッジ',
    'Alignments': 'アラインメント数',
    'Unique N-Grams': '一意のN-グラム',
    'Total Token Count': 'トークン総数',

    // 統計説明
    'The average similarity score across all detected matches. High values (>90%) indicate verbatim quotations, while lower values suggest paraphrasing or textual evolution.':
      '検出された全マッチの平均類似度スコア。高い値（>90%）は逐語的引用を示し、低い値は言い換えやテキストの進化を示唆しています。',
    'The percentage of the total text length occupied by detected reuses. A high coverage implies that one witness is largely derived from or identical to the other.':
      '検出された再利用が占める総テキスト長の割合。高いカバレッジは、一方の証拠文本が他方から大きく派生または同一であることを示唆しています。',
    'The count of distinct matching sequences. If a specific phrase is reused 10 times, it counts as 10 alignments but only 1 unique N-gram.':
      '異なるマッチング配列の数。特定のフレーズが10回再利用される場合、10個のアラインメントとしてカウントされますが、一意のN-グラムは1つのみです。',
    'Unlike "Alignments", this metric deduplicates the matches. If a specific phrase is reused 10 times, it counts as 10 alignments but only 1 unique N-gram. A large difference between Alignments and Unique N-Grams indicates highly repetitive formulaic language.':
      '「アラインメント」と異なり、このメトリクスはマッチを重複排除します。特定のフレーズが10回再利用される場合、10個のアラインメントとしてカウントされますが、一意のN-グラムは1つのみです。アラインメント数と一意のN-グラム数の大きな差は、定型的で反復性の高い言語を示しています。',
    'This helps contextualize the "Reuse Coverage" metric. If Witness α is much larger than Witness β, a 100% coverage of β might only represent a 5% coverage of α.':
      'これは「再利用カバレッジ」メトリクスの文脈化に役立ちます。証拠文本αが証拠文本βよりも大きい場合、βの100%カバレッジはαの5%カバレッジのみを表すかもしれません。',

    // ビジュアライゼーションタイトル
    'Macro-Level Alignment Flow': 'マクロレベルのアラインメントフロー',
    'Match Gallery': 'マッチギャラリー',
    'Position Correspondence (Heatmap)': '位置対応（ヒートマップ）',
    'Similarity Distribution': '類似度分布',
    'Cluster View (Network Graph)': 'クラスタビュー（ネットワークグラフ）',
    'Witness Dispersion': '証拠文本分散',

    // ビジュアライゼーション説明
    'The X-axis represents the position in Witness α, and the Y-axis represents the position in Witness β. A perfect diagonal line indicates identical structure. Clusters of points off the diagonal indicate structural rearrangement or localized reuse.':
      'X軸は証拠文本αの位置を表し、Y軸は証拠文本βの位置を表します。完全な対角線は同一の構造を示します。対角線から外れたポイントのクラスタは、構造的な再配置または局所的な再利用を示します。',
    'Each coloured cell represents a detected match. The cell\'s position on the X-axis corresponds to where the match occurs in Witness α, and its Y-axis position corresponds to the location in Witness β. Colour intensity encodes similarity: warmer tones indicate higher similarity scores. Clicking a cell selects that match and highlights it across all visualizations.':
      '各色付きセルは検出されたマッチを表します。セルのX軸位置は証拠文本αでのマッチの位置に対応し、Y軸位置は証拠文本βの位置に対応します。色の濃さは類似度をコード化します：暖色系はより高い類似度スコアを示します。セルをクリックするとそのマッチを選択し、すべてのビジュアライゼーションでハイライトします。',
    'X-Axis: Witness α Position': 'X軸：証拠文本α の位置',
    'Y-Axis: Witness β Position': 'Y軸：証拠文本β の位置',
    'The horizontal axis represents the token position within Witness α (the primary text).':
      '水平軸は証拠文本α（一次テキスト）内のトークン位置を表します。',
    'Each unit on this axis corresponds to a token index (word or character, depending on the selected algorithm) in Witness α. A match plotted at position 50 on the X-axis means the matched segment begins at approximately the 50th token of the primary text.':
      'この軸の各ユニットは、証拠文本αのトークンインデックス（選択したアルゴリズムによって単語または文字）に対応しています。X軸の位置50にプロットされたマッチは、マッチしたセグメントが一次テキストの約50番目のトークンから始まることを意味します。',
    'The vertical axis represents the token position within Witness β (the comparandum).':
      '垂直軸は証拠文本β（比較対象）内のトークン位置を表します。',
    'Each unit on this axis corresponds to a token index in Witness β. A match plotted at position 30 on the Y-axis means the matched segment begins at approximately the 30th token of the comparative text.':
      'この軸の各ユニットは、証拠文本βのトークンインデックスに対応しています。Y軸の位置30にプロットされたマッチは、マッチしたセグメントが比較テキストの約30番目のトークンから始まることを意味します。',

    // マッチギャラリー
    'TOP REUSES': 'トップ再利用',
    'No Matches Detected': 'マッチが検出されませんでした',
    'Try lowering the threshold or increasing window size.': '閾値を下げるか、ウィンドウサイズを増やしてみてください。',

    // AI 間テクスト性分析セクション
    'AI Intertextuality Analysis': 'AI 間テクスト性分析',
    'Multi-Model Citation, Allusion & Echo Detection': 'マルチモデル引用・暗示・反響検出',
    'Run AI Intertextuality Analysis': 'AI 間テクスト性分析を実行',
    'API Key': 'API キー',
    'Model': 'モデル',
    'Comparative View': '比較ビュー',
    'Scholarly Assessment': '学術的評価',
    'No AI Analysis Yet': 'AI分析がまだ実行されていません',
    'Configure API keys and run analysis above.': '上記でAPIキーを設定して分析を実行してください。',
    'Show Configuration': '設定を表示',
    'Analyzing Intertextuality': '間テクスト性を分析中',
    'Intertextuality Classification Taxonomy': '間テクスト性分類タクソノミー',
    'Confidence': '確信度',
    'ext. source': '外部ソース',
    'Possible External Source': '外部ソースの可能性',
    'No matches in this category.': 'このカテゴリにマッチはありません。',
    'All Categories': '全カテゴリ',
    'matches': '件のマッチ',
    'Show Key': '表示',
    'Hide Key': '非表示',
    'Select Model': 'モデル選択',
    'Bug Report / Feature Request': 'バグ報告・機能要望',

    // 閾値ヘルプ
    'High Threshold (80% - 100%)': '高い閾値（80% - 100%）',
    'Medium Threshold (50% - 79%)': '中程度の閾値（50% - 79%）',
    'Low Threshold (20% - 49%)': '低い閾値（20% - 49%）',

    // N-Size ヘルプ
    'Larger N-Size (e.g., 5-10+)': 'より大きなN-サイズ（例：5-10+）',
    'Smaller N-Size (e.g., 1-4)': 'より小さなN-サイズ（例：1-4）',

    // AI 再利用カテゴリ
    'Direct Quotation': '直接引用',
    'Paraphrased Reuse': 'パラフレーズ再利用',
    'Structural Imitation': '構造的模倣',
    'Thematic Reuse': 'テーマ的再利用',

    // フッター
    'Advanced Digital Humanities Collation Tool': '高度なデジタルヒューマニティーズ照合ツール',
    'Changelog': '変更ログ',

    // プライバシーノート
    'Privacy Note: API keys are stored only in browser memory (never persisted) and sent only to the respective API provider.':
      'プライバシーに関する注意：APIキーはブラウザメモリにのみ保存され（永続化されない）、各APIプロバイダーにのみ送信されます。',

    // ヘッダー/UI コントロール
    'UI Language': 'UI言語',
    'Font': 'フォント',
    'Decrease font size': 'フォントサイズを縮小',
    'Increase font size': 'フォントサイズを拡大',
    'GitHub Issues': 'GitHub Issues',

    // アルゴリズム名
    'Smith-Waterman (Local Alignment)': 'Smith-Waterman（局所アラインメント）',
    'Coptic-Aware (Vowel & Mark Norm)': 'コプト語対応（母音・記号正規化）',
    'Levenshtein (Edit Distance)': 'レーベンシュタイン（編集距離）',
    'Jaccard (Set Similarity)': 'ジャッカード（集合類似度）',
    'Word-Level N-Gram': '単語レベルN-グラム',
    'Character-Level N-Gram': '文字レベルN-グラム',
    'FastText-like (Subword N-Grams)': 'FastText風（サブワードN-グラム）',
    'Word2Vec-like (Local Co-occurrence)': 'Word2Vec風（局所共起）',

    // N-グラム情報ボックス
    'N-Gram Definition': 'N-グラムの定義',
    'N-Gram Definition Text': 'N-グラムとは、与えられたテキストからn個の連続する要素の列です。文字N-グラム（例：n=4）は、スペースのない文字体系やスペルの変形がある場合の類似性の検出に適しています。単語N-グラム（例：n=3）は、細かな文字の不一致を無視しつつ、句レベルの再利用に焦点を当てます。',

    // マッチギャラリー
    'matches ranked by similarity': '類似度順にランク付けされたマッチ',
    'Rank': 'ランク',
    'Best Match': '最高マッチ',
    'pos': '位置',
    'Length': '長さ',
    'tokens': 'トークン',

    // フッター
    'CC BY 4.0 License': 'CC BY 4.0 ライセンス',

    // チャートコントロール
    'Zoom In': 'ズームイン',
    'Zoom Out': 'ズームアウト',
    'Reset Zoom': 'ズームリセット',
    'Download as SVG': 'SVGでダウンロード',
    'Download as PNG': 'PNGでダウンロード',
    'Help': 'ヘルプ',
    'Exit Fullscreen': '全画面を終了',
    'Press ESC or click to exit fullscreen': 'ESCキーまたはクリックで全画面を終了',

    // DiffView
    'Exact Match': '完全一致',
    'Diff': '差分',

    // フォントファミリーオプション
    'Serif (Default)': 'セリフ（デフォルト）',
    'Sans-Serif': 'サンセリフ',
    'Monospace': '等幅',

    // その他
    'chars': '文字',
    'Click to rename': 'クリックで名前を変更',
    'Close': '閉じる',
  },

  zh: {
    // 页眉
    'ICoMa': 'ICoMa',
    'Intertextuality Collation Machine': '互文性对照机',
    'Engine Status': '引擎状态',
    'READY FOR COLLATION': '准备就绪，可进行对照',

    // 快速加载部分
    'Quick Load': '快速加载',

    // 证人文本标签
    'Witness α (Primary)': '证人文本 α（一级文本）',
    'Witness β (Comparandum)': '证人文本 β（对比文本）',

    // 文本输入占位符
    'Insert primary text (Source)...': '插入一级文本（源文本）...',
    'Insert comparative text (Target)...': '插入对比文本（目标文本）...',

    // 配置部分
    'Collation Parameters': '对照参数',
    'Analysis Algorithm': '分析算法',
    'Similarity Threshold': '相似度阈值',
    'N-Size / Window Size': 'N-大小 / 窗口大小',

    // 分析算法选项
    'English (Text Reuse/Plagiarism)': '文本重用 / 抄袭检测',

    // 按钮
    'RUN COLLATION ENGINE': '运行对照引擎',
    'PROCESSING LARGE DATASET...': '处理大型数据集中...',

    // 统计标签
    'Mean Similarity': '平均相似度',
    'Reuse Coverage': '重用覆盖率',
    'Alignments': '对齐数',
    'Unique N-Grams': '独特N元组',
    'Total Token Count': '令牌总数',

    // 统计描述
    'The average similarity score across all detected matches. High values (>90%) indicate verbatim quotations, while lower values suggest paraphrasing or textual evolution.':
      '所有检测到的匹配的平均相似度得分。高值（>90%）表示逐字引用，较低值表示改写或文本演变。',
    'The percentage of the total text length occupied by detected reuses. A high coverage implies that one witness is largely derived from or identical to the other.':
      '检测到的重用占据的总文本长度的百分比。高覆盖率意味着一个证人文本在很大程度上源自或与另一个文本相同。',
    'The count of distinct matching sequences. If a specific phrase is reused 10 times, it counts as 10 alignments but only 1 unique N-gram.':
      '不同匹配序列的计数。如果特定短语被重用10次，它计为10个对齐但只有1个独特的N元组。',
    'Unlike "Alignments", this metric deduplicates the matches. If a specific phrase is reused 10 times, it counts as 10 alignments but only 1 unique N-gram. A large difference between Alignments and Unique N-Grams indicates highly repetitive formulaic language.':
      '与"对齐"不同，此指标对匹配进行重复数据删除。如果特定短语被重用10次，它计为10个对齐但只有1个独特的N元组。对齐和独特N元组之间的大差异表示高度重复的公式化语言。',
    'This helps contextualize the "Reuse Coverage" metric. If Witness α is much larger than Witness β, a 100% coverage of β might only represent a 5% coverage of α.':
      '这有助于将"重用覆盖率"指标置于语境中。如果证人α大于证人β，β的100%覆盖率可能仅代表α的5%覆盖率。',

    // 可视化标题
    'Macro-Level Alignment Flow': '宏观层面的对齐流',
    'Match Gallery': '匹配库',
    'Position Correspondence (Heatmap)': '位置对应关系（热力图）',
    'Similarity Distribution': '相似度分布',
    'Cluster View (Network Graph)': '集群视图（网络图）',
    'Witness Dispersion': '证人文本分散',

    // 可视化描述
    'The X-axis represents the position in Witness α, and the Y-axis represents the position in Witness β. A perfect diagonal line indicates identical structure. Clusters of points off the diagonal indicate structural rearrangement or localized reuse.':
      'X轴表示证人α中的位置，Y轴表示证人β中的位置。完美的对角线表示相同的结构。偏离对角线的点簇表示结构重新排列或局部重用。',
    'Each coloured cell represents a detected match. The cell\'s position on the X-axis corresponds to where the match occurs in Witness α, and its Y-axis position corresponds to the location in Witness β. Colour intensity encodes similarity: warmer tones indicate higher similarity scores. Clicking a cell selects that match and highlights it across all visualizations.':
      '每个彩色单元代表一个检测到的匹配。单元格在X轴上的位置对应于匹配在证人α中的位置，其Y轴位置对应于证人β中的位置。颜色强度编码相似度：暖色表示较高的相似度得分。单击单元格选择该匹配并在所有可视化中突出显示。',
    'X-Axis: Witness α Position': 'X轴：证人α位置',
    'Y-Axis: Witness β Position': 'Y轴：证人β位置',
    'The horizontal axis represents the token position within Witness α (the primary text).':
      '水平轴表示证人α（一级文本）内的令牌位置。',
    'Each unit on this axis corresponds to a token index (word or character, depending on the selected algorithm) in Witness α. A match plotted at position 50 on the X-axis means the matched segment begins at approximately the 50th token of the primary text.':
      '该轴上的每个单位对应于证人α中的令牌索引（取决于所选算法的单词或字符）。在X轴位置50处绘制的匹配表示匹配的段从一级文本的第50个令牌处开始。',
    'The vertical axis represents the token position within Witness β (the comparandum).':
      '垂直轴表示证人β（对比文本）内的令牌位置。',
    'Each unit on this axis corresponds to a token index in Witness β. A match plotted at position 30 on the Y-axis means the matched segment begins at approximately the 30th token of the comparative text.':
      '该轴上的每个单位对应于证人β中的令牌索引。在Y轴位置30处绘制的匹配表示匹配的段从对比文本的第30个令牌处开始。',

    // 匹配库
    'TOP REUSES': '顶部重用',
    'No Matches Detected': '未检测到匹配',
    'Try lowering the threshold or increasing window size.': '尝试降低阈值或增加窗口大小。',

    // AI 互文性分析部分
    'AI Intertextuality Analysis': 'AI互文性分析',
    'Multi-Model Citation, Allusion & Echo Detection': '多模型引文、典故和回声检测',
    'Run AI Intertextuality Analysis': '运行AI互文性分析',
    'API Key': 'API密钥',
    'Model': '模型',
    'Comparative View': '比较视图',
    'Scholarly Assessment': '学术评估',
    'No AI Analysis Yet': '尚未进行AI分析',
    'Configure API keys and run analysis above.': '上方配置API密钥并运行分析。',
    'Show Configuration': '显示配置',
    'Analyzing Intertextuality': '正在分析互文性',
    'Intertextuality Classification Taxonomy': '互文性分类分类法',
    'Confidence': '置信度',
    'ext. source': '外部来源',
    'Possible External Source': '可能的外部来源',
    'No matches in this category.': '此类别中无匹配。',
    'All Categories': '所有类别',
    'matches': '个匹配',
    'Show Key': '显示',
    'Hide Key': '隐藏',
    'Select Model': '选择模型',
    'Bug Report / Feature Request': '错误报告・功能请求',

    // 阈值帮助
    'High Threshold (80% - 100%)': '高阈值（80% - 100%）',
    'Medium Threshold (50% - 79%)': '中等阈值（50% - 79%）',
    'Low Threshold (20% - 49%)': '低阈值（20% - 49%）',

    // N-Size 帮助
    'Larger N-Size (e.g., 5-10+)': '更大的N-大小（例如5-10+）',
    'Smaller N-Size (e.g., 1-4)': '较小的N-大小（例如1-4）',

    // AI 重用类别
    'Direct Quotation': '直接引用',
    'Paraphrased Reuse': '改写重用',
    'Structural Imitation': '结构模仿',
    'Thematic Reuse': '主题重用',

    // 页脚
    'Advanced Digital Humanities Collation Tool': '高级数字人文对照工具',
    'Changelog': '更新日志',

    // 隐私说明
    'Privacy Note: API keys are stored only in browser memory (never persisted) and sent only to the respective API provider.':
      '隐私说明：API密钥仅存储在浏览器内存中（从不持久化），仅发送给相应的API提供商。',

    // 页眉/UI控制
    'UI Language': 'UI语言',
    'Font': '字体',
    'Decrease font size': '缩小字号',
    'Increase font size': '增大字号',
    'GitHub Issues': 'GitHub Issues',

    // 算法名称
    'Smith-Waterman (Local Alignment)': 'Smith-Waterman（局部比对）',
    'Coptic-Aware (Vowel & Mark Norm)': '科普特语适配（元音与标记归一化）',
    'Levenshtein (Edit Distance)': 'Levenshtein（编辑距离）',
    'Jaccard (Set Similarity)': 'Jaccard（集合相似度）',
    'Word-Level N-Gram': '词级N元组',
    'Character-Level N-Gram': '字符级N元组',
    'FastText-like (Subword N-Grams)': 'FastText式（子词N元组）',
    'Word2Vec-like (Local Co-occurrence)': 'Word2Vec式（局部共现）',

    // N元组定义
    'N-Gram Definition': 'N元组定义',
    'N-Gram Definition Text': 'N元组是从给定文本中提取的n个连续项的序列。字符N元组（如n=4）非常适合识别无空格文字系统或拼写变体中的相似性。词N元组（如n=3）侧重于短语级重用，同时忽略细微的字符差异。',

    // 匹配库
    'matches ranked by similarity': '按相似度排序的匹配',
    'Rank': '排名',
    'Best Match': '最佳匹配',
    'pos': '位置',
    'Length': '长度',
    'tokens': '令牌',

    // 页脚
    'CC BY 4.0 License': 'CC BY 4.0 许可证',

    // 图表控制
    'Zoom In': '放大',
    'Zoom Out': '缩小',
    'Reset Zoom': '重置缩放',
    'Download as SVG': '下载为SVG',
    'Download as PNG': '下载为PNG',
    'Help': '帮助',
    'Exit Fullscreen': '退出全屏',
    'Press ESC or click to exit fullscreen': '按ESC或点击退出全屏',

    // 差异视图
    'Exact Match': '完全匹配',
    'Diff': '差异',

    // 字体族选项
    'Serif (Default)': '衬线体（默认）',
    'Sans-Serif': '无衬线体',
    'Monospace': '等宽字体',

    // 其他
    'chars': '字符',
    'Click to rename': '点击重命名',
    'Close': '关闭',
  },

  ko: {
    // 헤더
    'ICoMa': 'ICoMa',
    'Intertextuality Collation Machine': '상호텍스트성 대조 기계',
    'Engine Status': '엔진 상태',
    'READY FOR COLLATION': '대조 준비 완료',

    // 빠른 로드 섹션
    'Quick Load': '빠른 로드',

    // 증거 텍스트 레이블
    'Witness α (Primary)': '증거 텍스트 α（기본 텍스트）',
    'Witness β (Comparandum)': '증거 텍스트 β（비교 대상）',

    // 텍스트 입력 자리 표시자
    'Insert primary text (Source)...': '기본 텍스트（원본）를 삽입...',
    'Insert comparative text (Target)...': '비교 텍스트（대상）를 삽입...',

    // 구성 섹션
    'Collation Parameters': '대조 매개변수',
    'Analysis Algorithm': '분석 알고리즘',
    'Similarity Threshold': '유사도 임계값',
    'N-Size / Window Size': 'N-크기 / 윈도우 크기',

    // 분석 알고리즘 옵션
    'English (Text Reuse/Plagiarism)': '텍스트 재사용 / 표절 감지',

    // 버튼
    'RUN COLLATION ENGINE': '대조 엔진 실행',
    'PROCESSING LARGE DATASET...': '대규모 데이터세트 처리 중...',

    // 통계 레이블
    'Mean Similarity': '평균 유사도',
    'Reuse Coverage': '재사용 범위',
    'Alignments': '정렬 수',
    'Unique N-Grams': '고유 N-그램',
    'Total Token Count': '전체 토큰 수',

    // 통계 설명
    'The average similarity score across all detected matches. High values (>90%) indicate verbatim quotations, while lower values suggest paraphrasing or textual evolution.':
      '검출된 모든 일치항목의 평균 유사도 점수입니다. 높은 값（>90%）은 정확한 인용을 나타내고, 낮은 값은 의역 또는 텍스트 진화를 시사합니다.',
    'The percentage of the total text length occupied by detected reuses. A high coverage implies that one witness is largely derived from or identical to the other.':
      '검출된 재사용이 차지하는 총 텍스트 길이의 백분율입니다. 높은 범위는 한 증거 텍스트가 다른 텍스트에서 크게 파생되었거나 동일함을 시사합니다.',
    'The count of distinct matching sequences. If a specific phrase is reused 10 times, it counts as 10 alignments but only 1 unique N-gram.':
      '별개의 일치 시퀀스의 수입니다. 특정 구문이 10번 재사용되면 10개의 정렬로 계산되지만 1개의 고유 N-그램만 계산됩니다.',
    'Unlike "Alignments", this metric deduplicates the matches. If a specific phrase is reused 10 times, it counts as 10 alignments but only 1 unique N-gram. A large difference between Alignments and Unique N-Grams indicates highly repetitive formulaic language.':
      '「정렬」과 달리 이 지표는 일치항목을 중복 제거합니다. 특정 구문이 10번 재사용되면 10개의 정렬로 계산되지만 1개의 고유 N-그램만 계산됩니다. 정렬과 고유 N-그램 간의 큰 차이는 매우 반복적인 공식적 언어를 나타냅니다.',
    'This helps contextualize the "Reuse Coverage" metric. If Witness α is much larger than Witness β, a 100% coverage of β might only represent a 5% coverage of α.':
      '이것은 「재사용 범위」 지표를 맥락화하는 데 도움이 됩니다. 증거 α가 증거 β보다 훨씬 크면 β의 100% 범위는 α의 5% 범위만 나타낼 수 있습니다.',

    // 시각화 제목
    'Macro-Level Alignment Flow': '거시적 수준의 정렬 흐름',
    'Match Gallery': '일치 갤러리',
    'Position Correspondence (Heatmap)': '위치 대응（히트맵）',
    'Similarity Distribution': '유사도 분포',
    'Cluster View (Network Graph)': '클러스터 보기（네트워크 그래프）',
    'Witness Dispersion': '증거 텍스트 분산',

    // 시각화 설명
    'The X-axis represents the position in Witness α, and the Y-axis represents the position in Witness β. A perfect diagonal line indicates identical structure. Clusters of points off the diagonal indicate structural rearrangement or localized reuse.':
      'X축은 증거 α의 위치를 나타내고 Y축은 증거 β의 위치를 나타냅니다. 완벽한 대각선은 동일한 구조를 나타냅니다. 대각선에서 벗어난 점의 클러스터는 구조적 재배열 또는 국소적 재사용을 나타냅니다.',
    'Each coloured cell represents a detected match. The cell\'s position on the X-axis corresponds to where the match occurs in Witness α, and its Y-axis position corresponds to the location in Witness β. Colour intensity encodes similarity: warmer tones indicate higher similarity scores. Clicking a cell selects that match and highlights it across all visualizations.':
      '각 색상 셀은 검출된 일치항목을 나타냅니다. 셀의 X축 위치는 증거 α에서 일치항목이 발생하는 위치에 해당하고 Y축 위치는 증거 β의 위치에 해당합니다. 색상 강도는 유사도를 인코딩합니다: 따뜻한 톤은 더 높은 유사도 점수를 나타냅니다. 셀을 클릭하면 해당 일치항목을 선택하고 모든 시각화에서 강조 표시합니다.',
    'X-Axis: Witness α Position': 'X축: 증거 α 위치',
    'Y-Axis: Witness β Position': 'Y축: 증거 β 위치',
    'The horizontal axis represents the token position within Witness α (the primary text).':
      '수평 축은 증거 α（기본 텍스트）내의 토큰 위치를 나타냅니다.',
    'Each unit on this axis corresponds to a token index (word or character, depending on the selected algorithm) in Witness α. A match plotted at position 50 on the X-axis means the matched segment begins at approximately the 50th token of the primary text.':
      '이 축의 각 단위는 증거 α의 토큰 인덱스（선택한 알고리즘에 따라 단어 또는 문자）에 해당합니다. X축의 위치 50에 표시된 일치는 일치하는 세그먼트가 기본 텍스트의 약 50번째 토큰부터 시작됨을 의미합니다.',
    'The vertical axis represents the token position within Witness β (the comparandum).':
      '수직 축은 증거 β（비교 대상）내의 토큰 위치를 나타냅니다.',
    'Each unit on this axis corresponds to a token index in Witness β. A match plotted at position 30 on the Y-axis means the matched segment begins at approximately the 30th token of the comparative text.':
      '이 축의 각 단위는 증거 β의 토큰 인덱스에 해당합니다. Y축의 위치 30에 표시된 일치는 일치하는 세그먼트가 비교 텍스트의 약 30번째 토큰부터 시작됨을 의미합니다.',

    // 일치 갤러리
    'TOP REUSES': '상위 재사용',
    'No Matches Detected': '일치항목이 감지되지 않음',
    'Try lowering the threshold or increasing window size.': '임계값을 낮추거나 윈도우 크기를 늘려보세요.',

    // AI 상호텍스트성 분석 섹션
    'AI Intertextuality Analysis': 'AI 상호텍스트성 분석',
    'Multi-Model Citation, Allusion & Echo Detection': '다중 모델 인용, 암시 및 메아리 감지',
    'Run AI Intertextuality Analysis': 'AI 상호텍스트성 분석 실행',
    'API Key': 'API 키',
    'Model': '모델',
    'Comparative View': '비교 보기',
    'Scholarly Assessment': '학술적 평가',
    'No AI Analysis Yet': 'AI 분석이 아직 없습니다',
    'Configure API keys and run analysis above.': '위에서 API 키를 구성하고 분석을 실행하세요.',
    'Show Configuration': '구성 표시',
    'Analyzing Intertextuality': '상호텍스트성 분석 중',
    'Intertextuality Classification Taxonomy': '상호텍스트성 분류 분류법',

    'Confidence': '신뢰도',
    'ext. source': '외부 소스',
    'Possible External Source': '외부 소스 가능성',
    'No matches in this category.': '이 카테고리에 일치 항목이 없습니다.',
    'All Categories': '전체 카테고리',
    'matches': '개 일치',
    'Show Key': '표시',
    'Hide Key': '숨기기',
    'Select Model': '모델 선택',
    'Bug Report / Feature Request': '버그 보고・기능 요청',

    // 임계값 도움말
    'High Threshold (80% - 100%)': '높은 임계값（80% - 100%）',
    'Medium Threshold (50% - 79%)': '중간 임계값（50% - 79%）',
    'Low Threshold (20% - 49%)': '낮은 임계값（20% - 49%）',

    // N-Size 도움말
    'Larger N-Size (e.g., 5-10+)': '더 큰 N-크기（예: 5-10+）',
    'Smaller N-Size (e.g., 1-4)': '더 작은 N-크기（예: 1-4）',

    // AI 재사용 카테고리
    'Direct Quotation': '직접 인용',
    'Paraphrased Reuse': '의역 재사용',
    'Structural Imitation': '구조적 모방',
    'Thematic Reuse': '주제적 재사용',

    // 바닥글
    'Advanced Digital Humanities Collation Tool': '고급 디지털 인문학 대조 도구',
    'Changelog': '변경 기록',

    // 개인정보 보호 주의
    'Privacy Note: API keys are stored only in browser memory (never persisted) and sent only to the respective API provider.':
      '개인정보 보호 주의: API 키는 브라우저 메모리에만 저장되며（지속되지 않음）, 각 API 제공자에게만 전송됩니다.',

    // 헤더/UI 컨트롤
    'UI Language': 'UI 언어',
    'Font': '글꼴',
    'Decrease font size': '글꼴 크기 축소',
    'Increase font size': '글꼴 크기 확대',
    'GitHub Issues': 'GitHub Issues',

    // 알고리즘 이름
    'Smith-Waterman (Local Alignment)': 'Smith-Waterman（지역 정렬）',
    'Coptic-Aware (Vowel & Mark Norm)': '콥트어 대응（모음 및 부호 정규화）',
    'Levenshtein (Edit Distance)': 'Levenshtein（편집 거리）',
    'Jaccard (Set Similarity)': 'Jaccard（집합 유사도）',
    'Word-Level N-Gram': '단어 수준 N-그램',
    'Character-Level N-Gram': '문자 수준 N-그램',
    'FastText-like (Subword N-Grams)': 'FastText식（하위 단어 N-그램）',
    'Word2Vec-like (Local Co-occurrence)': 'Word2Vec식（지역 공기）',

    // N-그램 정의
    'N-Gram Definition': 'N-그램 정의',
    'N-Gram Definition Text': 'N-그램은 주어진 텍스트에서 n개의 연속된 항목의 시퀀스입니다. 문자 N-그램（예: n=4）은 공백이 없는 문자 체계나 철자 변이에서 유사성을 식별하는 데 적합합니다. 단어 N-그램（예: n=3）은 미세한 문자 불일치를 무시하고 구절 수준의 재사용에 초점을 맞춥니다.',

    // 매치 갤러리
    'matches ranked by similarity': '유사도 순으로 정렬된 일치',
    'Rank': '순위',
    'Best Match': '최고 일치',
    'pos': '위치',
    'Length': '길이',
    'tokens': '토큰',

    // 바닥글
    'CC BY 4.0 License': 'CC BY 4.0 라이선스',

    // 차트 컨트롤
    'Zoom In': '확대',
    'Zoom Out': '축소',
    'Reset Zoom': '확대/축소 초기화',
    'Download as SVG': 'SVG로 다운로드',
    'Download as PNG': 'PNG로 다운로드',
    'Help': '도움말',
    'Exit Fullscreen': '전체 화면 종료',
    'Press ESC or click to exit fullscreen': 'ESC 키를 누르거나 클릭하여 전체 화면 종료',

    // DiffView
    'Exact Match': '완전 일치',
    'Diff': '차이',

    // 글꼴 패밀리 옵션
    'Serif (Default)': '세리프（기본）',
    'Sans-Serif': '산세리프',
    'Monospace': '고정폭',

    // 기타
    'chars': '문자',
    'Click to rename': '클릭하여 이름 변경',
    'Close': '닫기',
  },

  de: {
    // Kopfzeile
    'ICoMa': 'ICoMa',
    'Intertextuality Collation Machine': 'Intertextualitäts-Kollationierungsmaschine',
    'Engine Status': 'Engine-Status',
    'READY FOR COLLATION': 'ZUR KOLLATIONIERUNG BEREIT',

    // Schnellladebereich
    'Quick Load': 'Schnellladen',

    // Zeugentextbezeichnungen
    'Witness α (Primary)': 'Zeugentexte α (Primärtext)',
    'Witness β (Comparandum)': 'Zeugentexte β (Vergleichstext)',

    // Texteingabe-Platzhalter
    'Insert primary text (Source)...': 'Primärtext (Quelle) einfügen...',
    'Insert comparative text (Target)...': 'Vergleichstext (Ziel) einfügen...',

    // Konfigurationsbereich
    'Collation Parameters': 'Kollationierungsparameter',
    'Analysis Algorithm': 'Analysealgorithmus',
    'Similarity Threshold': 'Ähnlichkeitsschwelle',
    'N-Size / Window Size': 'N-Größe / Fenstergröße',

    // Analysealgorithmus-Optionen
    'English (Text Reuse/Plagiarism)': 'Textwiederverwertung / Plagiatserkennung',

    // Schaltflächen
    'RUN COLLATION ENGINE': 'KOLLATIONIERUNGSENGINE STARTEN',
    'PROCESSING LARGE DATASET...': 'BEARBEITE GROSSEN DATENSATZ...',

    // Statistikbezeichnungen
    'Mean Similarity': 'Durchschnittliche Ähnlichkeit',
    'Reuse Coverage': 'Wiederverwertungsabdeckung',
    'Alignments': 'Ausrichtungen',
    'Unique N-Grams': 'Einzigartige N-Gramme',
    'Total Token Count': 'Gesamtanzahl Tokens',

    // Statistikbeschreibungen
    'The average similarity score across all detected matches. High values (>90%) indicate verbatim quotations, while lower values suggest paraphrasing or textual evolution.':
      'Der durchschnittliche Ähnlichkeitswert über alle erkannten Übereinstimmungen. Hohe Werte (>90%) deuten auf wörtliche Zitate hin, während niedrigere Werte Paraphrase oder Textentwicklung nahelegen.',
    'The percentage of the total text length occupied by detected reuses. A high coverage implies that one witness is largely derived from or identical to the other.':
      'Der Prozentsatz der Gesamttextlänge, der durch erkannte Wiederverwendungen belegt ist. Eine hohe Abdeckung deutet darauf hin, dass ein Zeugentexte weitgehend vom anderen abgeleitet oder identisch ist.',
    'The count of distinct matching sequences. If a specific phrase is reused 10 times, it counts as 10 alignments but only 1 unique N-gram.':
      'Die Anzahl unterschiedlicher Übereinstimmungssequenzen. Wenn eine bestimmte Phrase 10-mal wiederverwendet wird, zählt sie als 10 Ausrichtungen, aber nur 1 eindeutiges N-Gramm.',
    'Unlike "Alignments", this metric deduplicates the matches. If a specific phrase is reused 10 times, it counts as 10 alignments but only 1 unique N-gram. A large difference between Alignments and Unique N-Grams indicates highly repetitive formulaic language.':
      'Im Gegensatz zu „Ausrichtungen" dedupliziert diese Metrik die Übereinstimmungen. Wenn eine bestimmte Phrase 10-mal wiederverwendet wird, zählt sie als 10 Ausrichtungen, aber nur 1 eindeutiges N-Gramm. Ein großer Unterschied zwischen Ausrichtungen und eindeutigen N-Grammen deutet auf stark repetitive Formelsprache hin.',
    'This helps contextualize the "Reuse Coverage" metric. If Witness α is much larger than Witness β, a 100% coverage of β might only represent a 5% coverage of α.':
      'Dies hilft, die Metrik „Wiederverwertungsabdeckung" in den Kontext zu setzen. Wenn Zeugentexte α viel größer als Zeugentexte β ist, könnte eine 100%ige Abdeckung von β nur eine 5%ige Abdeckung von α darstellen.',

    // Visualisierungstitel
    'Macro-Level Alignment Flow': 'Ausrichtungsfluss auf Makroebene',
    'Match Gallery': 'Übereinstimmungs-Galerie',
    'Position Correspondence (Heatmap)': 'Positionsentsprechung (Wärmekarte)',
    'Similarity Distribution': 'Ähnlichkeitsverteilung',
    'Cluster View (Network Graph)': 'Clusterview (Netzwerkgraph)',
    'Witness Dispersion': 'Zeugentexte-Streuung',

    // Visualisierungsbeschreibungen
    'The X-axis represents the position in Witness α, and the Y-axis represents the position in Witness β. A perfect diagonal line indicates identical structure. Clusters of points off the diagonal indicate structural rearrangement or localized reuse.':
      'Die X-Achse stellt die Position in Zeugentexte α dar, und die Y-Achse stellt die Position in Zeugentexte β dar. Eine perfekte Diagonallinie zeigt identische Struktur an. Punktcluster außerhalb der Diagonalen deuten auf strukturelle Umgestaltung oder lokalisierte Wiederverwendung hin.',
    'Each coloured cell represents a detected match. The cell\'s position on the X-axis corresponds to where the match occurs in Witness α, and its Y-axis position corresponds to the location in Witness β. Colour intensity encodes similarity: warmer tones indicate higher similarity scores. Clicking a cell selects that match and highlights it across all visualizations.':
      'Jede farbige Zelle stellt eine erkannte Übereinstimmung dar. Die Position der Zelle auf der X-Achse entspricht dem Ort der Übereinstimmung in Zeugentexte α, und ihre Y-Achsenposition entspricht dem Ort in Zeugentexte β. Die Farbintensität kodiert Ähnlichkeit: wärmere Farbtöne zeigen höhere Ähnlichkeitswerte an. Das Klicken auf eine Zelle wählt diese Übereinstimmung aus und hebt sie in allen Visualisierungen hervor.',
    'X-Axis: Witness α Position': 'X-Achse: Zeugentexte-α-Position',
    'Y-Axis: Witness β Position': 'Y-Achse: Zeugentexte-β-Position',
    'The horizontal axis represents the token position within Witness α (the primary text).':
      'Die horizontale Achse stellt die Token-Position innerhalb von Zeugentexte α (dem Primärtext) dar.',
    'Each unit on this axis corresponds to a token index (word or character, depending on the selected algorithm) in Witness α. A match plotted at position 50 on the X-axis means the matched segment begins at approximately the 50th token of the primary text.':
      'Jede Einheit auf dieser Achse entspricht einem Token-Index (Wort oder Zeichen, je nach ausgewähltem Algorithmus) in Zeugentexte α. Eine Übereinstimmung bei Position 50 auf der X-Achse bedeutet, dass das übereinstimmende Segment ungefähr beim 50. Token des Primärtexts beginnt.',
    'The vertical axis represents the token position within Witness β (the comparandum).':
      'Die vertikale Achse stellt die Token-Position innerhalb von Zeugentexte β (dem Vergleichstext) dar.',
    'Each unit on this axis corresponds to a token index in Witness β. A match plotted at position 30 on the Y-axis means the matched segment begins at approximately the 30th token of the comparative text.':
      'Jede Einheit auf dieser Achse entspricht einem Token-Index in Zeugentexte β. Eine Übereinstimmung bei Position 30 auf der Y-Achse bedeutet, dass das übereinstimmende Segment ungefähr beim 30. Token des Vergleichstexts beginnt.',

    // Übereinstimmungs-Galerie
    'TOP REUSES': 'WICHTIGSTE WIEDERVERWENDUNGEN',
    'No Matches Detected': 'Keine Übereinstimmungen erkannt',
    'Try lowering the threshold or increasing window size.': 'Versuchen Sie, die Schwelle zu senken oder die Fenstergröße zu vergrößern.',

    // AI Intertextualitätsanalyseverfahren
    'AI Intertextuality Analysis': 'KI-Intertextualitätsanalyse',
    'Multi-Model Citation, Allusion & Echo Detection': 'Mehrmodell-Zitat-, Anspielungs- und Echoverkennung',
    'Run AI Intertextuality Analysis': 'KI-Intertextualitätsanalyse ausführen',
    'API Key': 'API-Schlüssel',
    'Model': 'Modell',
    'Comparative View': 'Vergleichsansicht',
    'Scholarly Assessment': 'Wissenschaftliche Bewertung',
    'No AI Analysis Yet': 'Noch keine KI-Analyse',
    'Configure API keys and run analysis above.': 'Konfigurieren Sie API-Schlüssel und führen Sie die Analyse oben aus.',
    'Show Configuration': 'Konfiguration anzeigen',
    'Analyzing Intertextuality': 'Intertextualität wird analysiert',
    'Intertextuality Classification Taxonomy': 'Intertextualitäts-Klassifizierungstaxonomie',
    'Confidence': 'Konfidenz',
    'ext. source': 'ext. Quelle',
    'Possible External Source': 'Mögliche externe Quelle',
    'No matches in this category.': 'Keine Übereinstimmungen in dieser Kategorie.',
    'All Categories': 'Alle Kategorien',
    'matches': 'Treffer',
    'Show Key': 'Anzeigen',
    'Hide Key': 'Ausblenden',
    'Select Model': 'Modell wählen',
    'Bug Report / Feature Request': 'Fehlerbericht / Funktionswunsch',

    // Schwellen-Hilfe
    'High Threshold (80% - 100%)': 'Hohe Schwelle (80% - 100%)',
    'Medium Threshold (50% - 79%)': 'Mittlere Schwelle (50% - 79%)',
    'Low Threshold (20% - 49%)': 'Niedrige Schwelle (20% - 49%)',

    // N-Size Hilfe
    'Larger N-Size (e.g., 5-10+)': 'Größere N-Größe (z. B. 5-10+)',
    'Smaller N-Size (e.g., 1-4)': 'Kleinere N-Größe (z. B. 1-4)',

    // KI-Wiederverwendungskategorien
    'Direct Quotation': 'Direktes Zitat',
    'Paraphrased Reuse': 'Umformulierte Wiederverwendung',
    'Structural Imitation': 'Strukturelle Imitation',
    'Thematic Reuse': 'Thematische Wiederverwendung',

    // Fußzeile
    'Advanced Digital Humanities Collation Tool': 'Fortgeschrittenes Digital-Humanities-Kollationierungstool',
    'Changelog': 'Änderungsprotokoll',

    // Datenschutzhinweis
    'Privacy Note: API keys are stored only in browser memory (never persisted) and sent only to the respective API provider.':
      'Datenschutzhinweis: API-Schlüssel werden nur im Browserspeicher gespeichert (nie persistent) und nur an den jeweiligen API-Anbieter gesendet.',

    // Kopfzeile/UI-Steuerelemente
    'UI Language': 'UI-Sprache',
    'Font': 'Schrift',
    'Decrease font size': 'Schriftgröße verkleinern',
    'Increase font size': 'Schriftgröße vergrößern',
    'GitHub Issues': 'GitHub Issues',

    // Algorithmusnamen
    'Smith-Waterman (Local Alignment)': 'Smith-Waterman (Lokale Ausrichtung)',
    'Coptic-Aware (Vowel & Mark Norm)': 'Koptisch-Sensitiv (Vokal- & Zeichennorm.)',
    'Levenshtein (Edit Distance)': 'Levenshtein (Editierdistanz)',
    'Jaccard (Set Similarity)': 'Jaccard (Mengenähnlichkeit)',
    'Word-Level N-Gram': 'Wortebene N-Gramm',
    'Character-Level N-Gram': 'Zeichenebene N-Gramm',
    'FastText-like (Subword N-Grams)': 'FastText-artig (Teilwort-N-Gramme)',
    'Word2Vec-like (Local Co-occurrence)': 'Word2Vec-artig (Lokale Kookkurrenz)',

    // N-Gramm-Definition
    'N-Gram Definition': 'N-Gramm-Definition',
    'N-Gram Definition Text': 'Ein N-Gramm ist eine zusammenhängende Folge von n Elementen aus einem gegebenen Text. Zeichen-N-Gramme (z.B. n=4) eignen sich hervorragend zur Erkennung von Ähnlichkeiten in Schriften ohne Leerzeichen oder mit Schreibvariationen. Wort-N-Gramme (z.B. n=3) konzentrieren sich auf phrasenhafte Wiederverwendung und ignorieren geringfügige Zeichenabweichungen.',

    // Übereinstimmungs-Galerie
    'matches ranked by similarity': 'Übereinstimmungen nach Ähnlichkeit sortiert',
    'Rank': 'Rang',
    'Best Match': 'Beste Übereinstimmung',
    'pos': 'Pos.',
    'Length': 'Länge',
    'tokens': 'Tokens',

    // Fußzeile
    'CC BY 4.0 License': 'CC BY 4.0 Lizenz',

    // Diagrammsteuerelemente
    'Zoom In': 'Vergrößern',
    'Zoom Out': 'Verkleinern',
    'Reset Zoom': 'Zoom zurücksetzen',
    'Download as SVG': 'Als SVG herunterladen',
    'Download as PNG': 'Als PNG herunterladen',
    'Help': 'Hilfe',
    'Exit Fullscreen': 'Vollbild beenden',
    'Press ESC or click to exit fullscreen': 'ESC drücken oder klicken um Vollbild zu beenden',

    // DiffView
    'Exact Match': 'Exakte Übereinstimmung',
    'Diff': 'Differenz',

    // Schriftfamilienoptionen
    'Serif (Default)': 'Serifen (Standard)',
    'Sans-Serif': 'Serifenlos',
    'Monospace': 'Festbreite',

    // Sonstiges
    'chars': 'Zeichen',
    'Click to rename': 'Klicken zum Umbenennen',
    'Close': 'Schließen',
  },

  la: {
    // Titulus
    'ICoMa': 'ICoMa',
    'Intertextuality Collation Machine': 'Intertextualitatis Comparationis Apparatus',
    'Engine Status': 'Status Machinae',
    'READY FOR COLLATION': 'AD COMPARATIONEM PARATUM',

    // Velocis Onerationis Sectio
    'Quick Load': 'Celeriter Imponere',

    // Testimoniorum Nomina
    'Witness α (Primary)': 'Testimonium α (Primarium)',
    'Witness β (Comparandum)': 'Testimonium β (Comparandum)',

    // Placeholders Textus Intromissionis
    'Insert primary text (Source)...': 'Textum primarium (Fontem) inserere...',
    'Insert comparative text (Target)...': 'Textum comparativum (Scopum) inserere...',

    // Sectio Configurandi
    'Collation Parameters': 'Parametra Collationis',
    'Analysis Algorithm': 'Algorithmus Analysicus',
    'Similarity Threshold': 'Limen Similitudinis',
    'N-Size / Window Size': 'Magnitudo N / Magnitudo Fenestrae',

    // Algorithmi Analitici Electiones
    'English (Text Reuse/Plagiarism)': 'Usus Textus Reiteratus / Plagium',

    // Pulsationes
    'RUN COLLATION ENGINE': 'MACHINA COLLATIONIS MOVERE',
    'PROCESSING LARGE DATASET...': 'COPIA MAGNA DATA TRACTATUR...',

    // Inscriptiones Statisticae
    'Mean Similarity': 'Similitudinis Media',
    'Reuse Coverage': 'Usus Reiterat Copertio',
    'Alignments': 'Congruentia',
    'Unique N-Grams': 'N-Grammata Singularia',
    'Total Token Count': 'Numerus Totalis Symbolorum',

    // Descriptiones Statisticae
    'The average similarity score across all detected matches. High values (>90%) indicate verbatim quotations, while lower values suggest paraphrasing or textual evolution.':
      'Puncta similitudinis media per omnes detectionis congruentiis. Valores alti (>90%) citata verba indicant; inferiores paraphrasim seu textus evolutionem praebent.',
    'The percentage of the total text length occupied by detected reuses. A high coverage implies that one witness is largely derived from or identical to the other.':
      'Percentages longitudinis totalis textus a detectis reiterationibus occupatus. Copertio alta unum testimonium ex altero magna ex parte derivatum vel identicum esse praefert.',
    'The count of distinct matching sequences. If a specific phrase is reused 10 times, it counts as 10 alignments but only 1 unique N-gram.':
      'Numerus sequentiarum congruentium distinctarum. Si frasis specialis decies reiiteratur, decem congruentiis ponitur sed unum N-gramma singulare tantum.',
    'Unlike "Alignments", this metric deduplicates the matches. If a specific phrase is reused 10 times, it counts as 10 alignments but only 1 unique N-gram. A large difference between Alignments and Unique N-Grams indicates highly repetitive formulaic language.':
      'Praeter "Congruentiam", hoc metrum congruentia duplicata removet. Si frasis specialis decies reiteratur, decem congruentiis ponitur sed unum N-gramma singulare tantum. Magna differentia inter Congruentiam et N-grammata Singularia linguam formulaicam valde repetitivam ostendit.',
    'This helps contextualize the "Reuse Coverage" metric. If Witness α is much larger than Witness β, a 100% coverage of β might only represent a 5% coverage of α.':
      'Hoc metrum "Usus Reiterat Copertio" in contextum adiuvat. Si Testimonium α multo maius est quam Testimonium β, copertio 100% β tantummodo 5% copertionem α repraesentare potuit.',

    // Tituli Visualizationis
    'Macro-Level Alignment Flow': 'Fluxus Congruentiae Macro-Gradus',
    'Match Gallery': 'Peristasium Congruentiae',
    'Position Correspondence (Heatmap)': 'Positio Correspondentia (Pictura Caloris)',
    'Similarity Distribution': 'Distributio Similitudinis',
    'Cluster View (Network Graph)': 'Prospectiva Acervuli (Graphus Retis)',
    'Witness Dispersion': 'Dispersio Testimoniorum',

    // Descriptiones Visualizationis
    'The X-axis represents the position in Witness α, and the Y-axis represents the position in Witness β. A perfect diagonal line indicates identical structure. Clusters of points off the diagonal indicate structural rearrangement or localized reuse.':
      'Axis X positionem in Testimonio α repraesentat; axis Y positionem in Testimonio β. Linea diagonalis perfecta structuram identicum indicat. Acervuli punctorum a diagonali recedentes restructurationem vel usum locatum praebent.',
    'Each coloured cell represents a detected match. The cell\'s position on the X-axis corresponds to where the match occurs in Witness α, and its Y-axis position corresponds to the location in Witness β. Colour intensity encodes similarity: warmer tones indicate higher similarity scores. Clicking a cell selects that match and highlights it across all visualizations.':
      'Quaeque cellula colorata congruentiam detectionis repraesentat. Positio cellulae in axe X locum congruentiae in Testimonio α respondet; Y-axis positio locum in Testimonio β. Intensitas coloris similitudinem codit: colores calidiores puncta altiora similitudinis indicant. Cellulam clicare congruentiam eam ligit et per omnes visualizationes praelucet.',
    'X-Axis: Witness α Position': 'Axis X: Positio Testimoniit α',
    'Y-Axis: Witness β Position': 'Axis Y: Positio Testimoniit β',
    'The horizontal axis represents the token position within Witness α (the primary text).':
      'Axis horizontalis positionem symboli in Testimonio α (textum primarium) repraesentat.',
    'Each unit on this axis corresponds to a token index (word or character, depending on the selected algorithm) in Witness α. A match plotted at position 50 on the X-axis means the matched segment begins at approximately the 50th token of the primary text.':
      'Unitas quaeque in hoc axe indicem symboli (verbum vel characterem, ex algorothmo selectione pependens) in Testimonio α correspondet. Congruentia apud positionem 50 in axe X denotat segmentum congruum ad circiter 50-um symbolum textus primarii incipere.',
    'The vertical axis represents the token position within Witness β (the comparandum).':
      'Axis verticalis positionem symboli in Testimonio β (comparandum) repraesentat.',
    'Each unit on this axis corresponds to a token index in Witness β. A match plotted at position 30 on the Y-axis means the matched segment begins at approximately the 30th token of the comparative text.':
      'Unitas quaeque in hoc axe indicem symboli in Testimonio β correspondet. Congruentia apud positionem 30 in axe Y denotat segmentum congruum ad circiter 30-um symbolum textus comparativi incipere.',

    // Peristasium Congruentiae
    'TOP REUSES': 'USUSIONES PRAECIPUI',
    'No Matches Detected': 'Nullae Congruentiae Detectae',
    'Try lowering the threshold or increasing window size.': 'Liminem minuere vel magnitudinem fenestrae augere conare.',

    // Sectio Analyseos Intertextualitatis Artificialis
    'AI Intertextuality Analysis': 'Analysis Intertextualitatis Artificialis',
    'Multi-Model Citation, Allusion & Echo Detection': 'Citationes Multimodales, Allusiones et Detecto Echonis',
    'Run AI Intertextuality Analysis': 'Analysim Intertextualitatis Artificialis Movere',
    'API Key': 'Clavis API',
    'Model': 'Exemplar',
    'Comparative View': 'Prospectiva Comparativa',
    'Scholarly Assessment': 'Aestimatio Erudita',
    'No AI Analysis Yet': 'Necdum Analisis Artificialis',
    'Configure API keys and run analysis above.': 'Claves API configurare et analysim supra movere.',
    'Show Configuration': 'Configurationem Ostendere',
    'Analyzing Intertextuality': 'Intertextualitatem Analizam',
    'Intertextuality Classification Taxonomy': 'Taxonomia Classificationis Intertextualitatis',

    'Confidence': 'Fiducia',
    'ext. source': 'fons ext.',
    'Possible External Source': 'Fons Externus Possibilis',
    'No matches in this category.': 'Nullae concordantiae in hac categoria.',
    'All Categories': 'Omnes Categoriae',
    'matches': 'concordantiae',
    'Show Key': 'Monstrare',
    'Hide Key': 'Celare',
    'Select Model': 'Exemplar Eligere',
    'Bug Report / Feature Request': 'Relatio Erroris / Petitio Functionis',

    // Auxilium Liminis
    'High Threshold (80% - 100%)': 'Limen Altum (80% - 100%)',
    'Medium Threshold (50% - 79%)': 'Limen Medium (50% - 79%)',
    'Low Threshold (20% - 49%)': 'Limen Humile (20% - 49%)',

    // Auxilium N-Size
    'Larger N-Size (e.g., 5-10+)': 'Magnitudo N Maior (exempli gratia, 5-10+)',
    'Smaller N-Size (e.g., 1-4)': 'Magnitudo N Minor (exempli gratia, 1-4)',

    // Categoriae Reiterationis Artificiales
    'Direct Quotation': 'Citatio Directa',
    'Paraphrased Reuse': 'Usus Reiiteratus Paraphrasticus',
    'Structural Imitation': 'Imitatio Structuralis',
    'Thematic Reuse': 'Usus Reiiteratus Thematicus',

    // Subscriptio
    'Advanced Digital Humanities Collation Tool': 'Instrumentum Collationis Studiorum Digitarium Humanitatis Praeclarum',
    'Changelog': 'Catalogus Mutationum',

    // Monitio Secretarii
    'Privacy Note: API keys are stored only in browser memory (never persisted) and sent only to the respective API provider.':
      'Monitio Secretarii: Claves API in memoria navigationis tantum conservantur (numquam persistuntur) et ad praecisam API providentem mittuntur.',

    // Capitis / Moderationes UI
    'UI Language': 'Lingua UI',
    'Font': 'Typus Litterarum',
    'Decrease font size': 'Magnitudinem litterarum minuere',
    'Increase font size': 'Magnitudinem litterarum augere',
    'GitHub Issues': 'GitHub Issues',

    // Nomina Algorithmi
    'Smith-Waterman (Local Alignment)': 'Smith-Waterman (Congruentia Localis)',
    'Coptic-Aware (Vowel & Mark Norm)': 'Coptica-Peritus (Norm. Vocalium & Signorum)',
    'Levenshtein (Edit Distance)': 'Levenshtein (Distantia Emendationis)',
    'Jaccard (Set Similarity)': 'Jaccard (Similitudo Copiis)',
    'Word-Level N-Gram': 'N-Gramma Verborum',
    'Character-Level N-Gram': 'N-Gramma Litterarum',
    'FastText-like (Subword N-Grams)': 'FastText-similis (N-Grammata Subverbalia)',
    'Word2Vec-like (Local Co-occurrence)': 'Word2Vec-similis (Cooccurrentia Localis)',

    // Definitio N-Grammatis
    'N-Gram Definition': 'Definitio N-Grammatis',
    'N-Gram Definition Text': 'N-Gramma est series continua n elementorum ex textu dato. N-grammata litterarum (e.g., n=4) praestant ad similitudines inveniendas in scripturis sine spatiis vel cum variationibus orthographicis. N-grammata verborum (e.g., n=3) ad usum phraseologicum iteratum attendunt, discrepantias litterarum minores neglegentes.',

    // Peristasium Congruentiae
    'matches ranked by similarity': 'congruentiae similitudine ordinatae',
    'Rank': 'Ordo',
    'Best Match': 'Optima Congruentia',
    'pos': 'pos.',
    'Length': 'Longitudo',
    'tokens': 'symbola',

    // Subscriptio
    'CC BY 4.0 License': 'Licentia CC BY 4.0',

    // Moderationes Graphus
    'Zoom In': 'Amplificare',
    'Zoom Out': 'Diminuere',
    'Reset Zoom': 'Amplificationem Restituere',
    'Download as SVG': 'SVG Deponere',
    'Download as PNG': 'PNG Deponere',
    'Help': 'Auxilium',
    'Exit Fullscreen': 'Plenum Conspectum Relinquere',
    'Press ESC or click to exit fullscreen': 'ESC premere vel clicare ad plenum conspectum relinquendum',

    // DiffView
    'Exact Match': 'Congruentia Exacta',
    'Diff': 'Differentia',

    // Optiones Familiae Litterarum
    'Serif (Default)': 'Serifatus (Praefinitus)',
    'Sans-Serif': 'Sine Serifis',
    'Monospace': 'Aequi Spatii',

    // Varia
    'chars': 'litterae',
    'Click to rename': 'Clicare ad renominandum',
    'Close': 'Claudere',
  },

  it: {
    // Intestazione
    'ICoMa': 'ICoMa',
    'Intertextuality Collation Machine': 'Macchina di Collazione dell\'Intertestualità',
    'Engine Status': 'Stato del Motore',
    'READY FOR COLLATION': 'PRONTO PER LA COLLAZIONE',

    // Sezione Caricamento Rapido
    'Quick Load': 'Caricamento Rapido',

    // Etichette Testimone
    'Witness α (Primary)': 'Testimone α (Primario)',
    'Witness β (Comparandum)': 'Testimone β (Comparandum)',

    // Placeholder Input Testo
    'Insert primary text (Source)...': 'Inserire il testo primario (Sorgente)...',
    'Insert comparative text (Target)...': 'Inserire il testo comparativo (Obiettivo)...',

    // Sezione Configurazione
    'Collation Parameters': 'Parametri di Collazione',
    'Analysis Algorithm': 'Algoritmo di Analisi',
    'Similarity Threshold': 'Soglia di Similarità',
    'N-Size / Window Size': 'N-Dimensione / Dimensione Finestra',

    // Opzioni Algoritmo Analisi
    'English (Text Reuse/Plagiarism)': 'Riuso Testuale / Plagio',

    // Pulsanti
    'RUN COLLATION ENGINE': 'AVVIA IL MOTORE DI COLLAZIONE',
    'PROCESSING LARGE DATASET...': 'ELABORAZIONE DATASET DI GRANDI DIMENSIONI...',

    // Etichette Statistiche
    'Mean Similarity': 'Similarità Media',
    'Reuse Coverage': 'Copertura di Riuso',
    'Alignments': 'Allineamenti',
    'Unique N-Grams': 'N-Grammi Unici',
    'Total Token Count': 'Conteggio Totale Token',

    // Descrizioni Statistiche
    'The average similarity score across all detected matches. High values (>90%) indicate verbatim quotations, while lower values suggest paraphrasing or textual evolution.':
      'Il punteggio medio di similarità tra tutte le corrispondenze rilevate. Valori elevati (>90%) indicano citazioni letterali, mentre valori inferiori suggeriscono parafrasi o evoluzione testuale.',
    'The percentage of the total text length occupied by detected reuses. A high coverage implies that one witness is largely derived from or identical to the other.':
      'La percentuale della lunghezza totale del testo occupata dai riusi rilevati. Un\'alta copertura implica che un testimone è in gran parte derivato dall\'altro o ad esso identico.',
    'The count of distinct matching sequences. If a specific phrase is reused 10 times, it counts as 10 alignments but only 1 unique N-gram.':
      'Il conteggio delle sequenze corrispondenti distinte. Se una frase specifica viene riutilizzata 10 volte, conta come 10 allineamenti ma solo 1 N-gramma unico.',
    'Unlike "Alignments", this metric deduplicates the matches. If a specific phrase is reused 10 times, it counts as 10 alignments but only 1 unique N-gram. A large difference between Alignments and Unique N-Grams indicates highly repetitive formulaic language.':
      'A differenza degli "Allineamenti", questa metrica elimina i duplicati. Se una frase specifica viene riutilizzata 10 volte, conta come 10 allineamenti ma solo 1 N-gramma unico. Una grande differenza tra Allineamenti e N-Grammi Unici indica un linguaggio formulaico altamente ripetitivo.',
    'This helps contextualize the "Reuse Coverage" metric. If Witness α is much larger than Witness β, a 100% coverage of β might only represent a 5% coverage of α.':
      'Questo aiuta a contestualizzare la metrica "Copertura di Riuso". Se il Testimone α è molto più grande del Testimone β, una copertura del 100% di β potrebbe rappresentare solo il 5% della copertura di α.',

    // Titoli Visualizzazione
    'Macro-Level Alignment Flow': 'Flusso di Allineamento Macro',
    'Match Gallery': 'Galleria delle Corrispondenze',
    'Position Correspondence (Heatmap)': 'Corrispondenza Posizionale (Mappa di Calore)',
    'Similarity Distribution': 'Distribuzione della Similarità',
    'Cluster View (Network Graph)': 'Vista Cluster (Grafo di Rete)',
    'Witness Dispersion': 'Dispersione del Testimone',

    // Descrizioni Visualizzazione
    'The X-axis represents the position in Witness α, and the Y-axis represents the position in Witness β. A perfect diagonal line indicates identical structure. Clusters of points off the diagonal indicate structural rearrangement or localized reuse.':
      'L\'asse X rappresenta la posizione nel Testimone α e l\'asse Y rappresenta la posizione nel Testimone β. Una linea diagonale perfetta indica una struttura identica. Cluster di punti fuori dalla diagonale indicano riarrangiamento strutturale o riuso localizzato.',
    'Each coloured cell represents a detected match. The cell\'s position on the X-axis corresponds to where the match occurs in Witness α, and its Y-axis position corresponds to the location in Witness β. Colour intensity encodes similarity: warmer tones indicate higher similarity scores. Clicking a cell selects that match and highlights it across all visualizations.':
      'Ogni cella colorata rappresenta una corrispondenza rilevata. La posizione della cella sull\'asse X corrisponde alla posizione della corrispondenza nel Testimone α, e la posizione sull\'asse Y corrisponde alla posizione nel Testimone β. L\'intensità del colore codifica la similarità: toni più caldi indicano punteggi di similarità più elevati. Cliccando una cella si seleziona la corrispondenza e la si evidenzia in tutte le visualizzazioni.',
    'X-Axis: Witness α Position': 'Asse X: Posizione Testimone α',
    'Y-Axis: Witness β Position': 'Asse Y: Posizione Testimone β',
    'The horizontal axis represents the token position within Witness α (the primary text).':
      'L\'asse orizzontale rappresenta la posizione del token nel Testimone α (il testo primario).',
    'Each unit on this axis corresponds to a token index (word or character, depending on the selected algorithm) in Witness α. A match plotted at position 50 on the X-axis means the matched segment begins at approximately the 50th token of the primary text.':
      'Ogni unità su questo asse corrisponde a un indice di token (parola o carattere, a seconda dell\'algoritmo selezionato) nel Testimone α. Una corrispondenza posizionata alla posizione 50 sull\'asse X significa che il segmento corrispondente inizia approssimativamente al 50° token del testo primario.',
    'The vertical axis represents the token position within Witness β (the comparandum).':
      'L\'asse verticale rappresenta la posizione del token nel Testimone β (il comparandum).',
    'Each unit on this axis corresponds to a token index in Witness β. A match plotted at position 30 on the Y-axis means the matched segment begins at approximately the 30th token of the comparative text.':
      'Ogni unità su questo asse corrisponde a un indice di token nel Testimone β. Una corrispondenza posizionata alla posizione 30 sull\'asse Y significa che il segmento corrispondente inizia approssimativamente al 30° token del testo comparativo.',

    // Galleria Corrispondenze
    'TOP REUSES': 'PRINCIPALI RIUSI',
    'No Matches Detected': 'Nessuna Corrispondenza Rilevata',
    'Try lowering the threshold or increasing window size.': 'Provare a ridurre la soglia o aumentare la dimensione della finestra.',

    // Sezione Analisi Intertestualità con IA
    'AI Intertextuality Analysis': 'Analisi dell\'Intertestualità con IA',
    'Multi-Model Citation, Allusion & Echo Detection': 'Rilevamento Multi-Modello di Citazioni, Allusioni ed Echi',
    'Run AI Intertextuality Analysis': 'Esegui Analisi dell\'Intertestualità con IA',
    'API Key': 'Chiave API',
    'Model': 'Modello',
    'Comparative View': 'Vista Comparativa',
    'Scholarly Assessment': 'Valutazione Accademica',
    'No AI Analysis Yet': 'Nessuna Analisi IA Ancora',
    'Configure API keys and run analysis above.': 'Configurare le chiavi API ed eseguire l\'analisi sopra.',
    'Show Configuration': 'Mostra Configurazione',
    'Analyzing Intertextuality': 'Analizzando l\'Intertestualità',
    'Intertextuality Classification Taxonomy': 'Tassonomia di Classificazione dell\'Intertestualità',
    'Confidence': 'Confidenza',
    'ext. source': 'fonte est.',
    'Possible External Source': 'Possibile Fonte Esterna',
    'No matches in this category.': 'Nessuna corrispondenza in questa categoria.',
    'All Categories': 'Tutte le Categorie',
    'matches': 'corrispondenze',
    'Show Key': 'Mostra',
    'Hide Key': 'Nascondi',
    'Select Model': 'Seleziona Modello',
    'Bug Report / Feature Request': 'Segnalazione Bug / Richiesta Funzionalità',

    // Aiuto Soglia
    'High Threshold (80% - 100%)': 'Soglia Alta (80% - 100%)',
    'Medium Threshold (50% - 79%)': 'Soglia Media (50% - 79%)',
    'Low Threshold (20% - 49%)': 'Soglia Bassa (20% - 49%)',

    // Aiuto N-Size
    'Larger N-Size (e.g., 5-10+)': 'N-Dimensione Maggiore (es. 5-10+)',
    'Smaller N-Size (e.g., 1-4)': 'N-Dimensione Minore (es. 1-4)',

    // Categorie Riuso IA
    'Direct Quotation': 'Citazione Diretta',
    'Paraphrased Reuse': 'Riuso Parafrasato',
    'Structural Imitation': 'Imitazione Strutturale',
    'Thematic Reuse': 'Riuso Tematico',

    // Piè di Pagina
    'Advanced Digital Humanities Collation Tool': 'Strumento Avanzato di Collazione per le Digital Humanities',
    'Changelog': 'Registro delle Modifiche',

    // Nota sulla Privacy
    'Privacy Note: API keys are stored only in browser memory (never persisted) and sent only to the respective API provider.':
      'Nota sulla privacy: le chiavi API sono memorizzate solo nella memoria del browser (mai persistite) e inviate solo al rispettivo fornitore API.',

    // Controlli Intestazione/UI
    'UI Language': 'Lingua UI',
    'Font': 'Carattere',
    'Decrease font size': 'Riduci Dimensione Carattere',
    'Increase font size': 'Aumenta Dimensione Carattere',
    'GitHub Issues': 'GitHub Issues',

    // Nomi Algoritmi
    'Smith-Waterman (Local Alignment)': 'Smith-Waterman (Allineamento Locale)',
    'Coptic-Aware (Vowel & Mark Norm)': 'Consapevole del Copto (Normalizzazione Vocali & Segni)',
    'Levenshtein (Edit Distance)': 'Levenshtein (Distanza di Modifica)',
    'Jaccard (Set Similarity)': 'Jaccard (Similarità di Insieme)',
    'Word-Level N-Gram': 'N-Gramma a Livello di Parola',
    'Character-Level N-Gram': 'N-Gramma a Livello di Carattere',
    'FastText-like (Subword N-Grams)': 'Simile a FastText (N-Grammi Subword)',
    'Word2Vec-like (Local Co-occurrence)': 'Simile a Word2Vec (Co-occorrenza Locale)',

    // Casella Informazioni N-Gramma
    'N-Gram Definition': 'Definizione di N-Gramma',
    'N-Gram Definition Text': 'Un N-Gramma è una sequenza continua di n elementi da un testo dato. Gli N-grammi di caratteri (ad es., n=4) sono eccellenti per identificare somiglianze in script senza spazi o con variazioni ortografiche. Gli N-grammi di parole (ad es., n=3) si concentrano sul riuso fraseologico ignorando leggeri errori di carattere.',

    // Galleria Corrispondenze
    'matches ranked by similarity': 'corrispondenze ordinate per similarità',
    'Rank': 'Posizione',
    'Best Match': 'Miglior Corrispondenza',
    'pos': 'pos',
    'Length': 'Lunghezza',
    'tokens': 'token',

    // Piè di Pagina
    'CC BY 4.0 License': 'Licenza CC BY 4.0',

    // Controlli Grafico
    'Zoom In': 'Ingrandisci',
    'Zoom Out': 'Riduci',
    'Reset Zoom': 'Ripristina Zoom',
    'Download as SVG': 'Scarica come SVG',
    'Download as PNG': 'Scarica come PNG',
    'Help': 'Aiuto',
    'Exit Fullscreen': 'Esci da Schermo Intero',
    'Press ESC or click to exit fullscreen': 'Premi ESC o fai clic per uscire dallo schermo intero',

    // DiffView
    'Exact Match': 'Corrispondenza Esatta',
    'Diff': 'Differenza',

    // Opzioni Famiglia Font
    'Serif (Default)': 'Serif (Predefinito)',
    'Sans-Serif': 'Sans-Serif',
    'Monospace': 'Monospazio',

    // Vario
    'chars': 'caratteri',
    'Click to rename': 'Fai clic per rinominare',
    'Close': 'Chiudi',
  }
};

/**
 * Translate a string key into the specified language
 * Falls back to English if the key or language is not found
 * @param lang - The target language code
 * @param key - The string key to translate
 * @returns The translated string, or the English translation if not found
 */
export function t(lang: Language, key: string): string {
  if (lang && translations[lang] && translations[lang][key]) {
    return translations[lang][key];
  }
  // Fallback to English
  if (translations.en[key]) {
    return translations.en[key];
  }
  // If the key itself is not found, return the key
  return key;
}
