/**
 * Internationalization (i18n) System for ICoMa
 * Supports: English, Japanese, Chinese (Simplified), Korean, German, and Latin
 */

export type Language = 'en' | 'ja' | 'zh' | 'ko' | 'de' | 'la';

export const LANGUAGES: Record<Language, string> = {
  en: 'English',
  ja: '日本語',
  zh: '中文',
  ko: '한국어',
  de: 'Deutsch',
  la: 'Latina'
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
  },

  ja: {
    // ヘッダー
    'ICoMa': 'ICoMa',
    'Intertextuality Collation Machine': 'テキスト間性照合機',
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

    // AI テキスト間性分析セクション
    'AI Intertextuality Analysis': 'AI テキスト間性分析',
    'Multi-Model Citation, Allusion & Echo Detection': 'マルチモデル引用・暗示・反響検出',
    'Run AI Intertextuality Analysis': 'AI テキスト間性分析を実行',
    'API Key': 'API キー',
    'Model': 'モデル',
    'Comparative View': '比較ビュー',
    'Scholarly Assessment': '学術的評価',
    'No AI Analysis Yet': 'AI分析がまだ実行されていません',
    'Configure API keys and run analysis above.': '上記でAPIキーを設定して分析を実行してください。',
    'Show Configuration': '設定を表示',
    'Analyzing Intertextuality': 'テキスト間性を分析中',
    'Intertextuality Classification Taxonomy': 'テキスト間性分類タクソノミー',
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
