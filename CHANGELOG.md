# Changelog

All notable changes to this project will be documented in this file.

## [2.9.0] - 2026-03-30
### Added
- **Inline Diff View** in Match Gallery: for matches below 100%, word-level LCS diff shows common text, deletions (red strikethrough, Witness α only), and insertions (green, Witness β only). Supports all Unicode scripts.
- **Match Gallery fullscreen mode** with ranking view: medal badges (gold/silver/bronze) for top 3, large similarity bars, detailed position info, and DiffView at full size.
- **Custom Witness names**: editable input fields for Witness α and Witness β labels (click to rename).
- **SimilarityHistogram synchronization**: now receives `selectedMatch`/`onSelectMatch` — clicking a histogram bar selects the best match in that bin; selected match shown with red indicator line.
- **NetworkGraph auto zoom-in**: selecting a match in any panel zooms and pans the network graph to the relevant cluster with smooth animation.
- **AlignmentFlow labels**: clear "Witness α" / "Witness β" labels with "← Beginning ... End →" directional indicators.
- **Fullscreen exit button** redesigned: large red button fixed at bottom of screen with gradient overlay and Esc key support.

### Fixed
- **Heatmap layout**: reorganised header into 3 rows (title / axis legends with colour icons / toolbar) to prevent cramming.
- **Forced uppercase on Greek letters**: removed CSS `uppercase` from all Witness α/β labels so ギリシア文字小文字 are preserved correctly.
- **NetworkGraph circle/label overlap**: labels now positioned below circles with white background rects for readability.
- **NetworkGraph zoom-in sync**: simulation stopped before zoom, small delay for position stability, phrase-based matching instead of reference equality.
- **Zoom overflow**: ChartToolbar zoom now constrains parent container with `maxHeight` + `overflow: auto` so zoomed content doesn't cover sibling panels below.
- Version number in footer updated from v2.8.0 to v2.9.0.

### Changed
- Japanese translation: テキスト間性 → 間テクスト性 throughout i18n.ts.
- Consistent "Witness α" / "Witness β" naming across all components (ParallelViewer, MatchDetailModal, DispersionPlot, DiffView, AlignmentFlow, NetworkGraph).
- NetworkGraph link highlighting uses phrase comparison instead of reference equality for cross-panel compatibility.

## [2.8.1] - 2026-03-30
### Added
- Bug Report / Feature Request button in header menu (links to GitHub Issues), localized in all 6 languages.
- i18n keys for AIAnalysisPanel: Confidence, ext. source, Possible External Source, No matches in this category, All Categories, Show/Hide Key, Select Model.

### Fixed
- **CRITICAL**: Tailwind dynamic class bug — `border-${colorClass}-100` etc. in help modals were purged at build time and rendered unstyled. Replaced with inline styles via `COLOR_STYLES` mapping for all 10 colour variants.
- Heatmap title ("Position Correspondence") and axis labels ("X-Axis: Witness α Position", "Y-Axis: Witness β Position") now use `t(lang, ...)` instead of hardcoded English.
- AIAnalysisPanel sub-components (MatchCard, ResultView) now receive `lang` prop and render localized strings.
- "Pro Tip" label in help modals now localized (ヒント / 提示 / 팁 / Tipp / Consilium).

### Changed
- `Heatmap.tsx` accepts optional `lang?: Language` prop.
- `AIAnalysisPanel.tsx` accepts optional `lang?: Language` prop, forwarded to MatchCard and ResultView.
- Help modal colour rendering uses `COLOR_STYLES` constant with hex values instead of dynamic Tailwind class names.

## [2.8.0] - 2026-03-30
### Added
- Per-panel zoom controls (50%–200%) for all visualization panels (Match Gallery, Heatmap, Alignment Flow, Similarity Histogram, Network Graph, Dispersion Plot).
- Cross-panel synchronized scroll: clicking a match in any panel scrolls and highlights the corresponding item in Match Gallery, Parallel Viewer, Heatmap, and all D3 chart containers.
- Fully localized help modals (?) in 6 languages (EN, JA, ZH, KO, DE, LA): all 20 help topics, 8 algorithm descriptions, and 8 intertextuality categories now display in the selected UI language.
- New service: `helpContent.ts` (1087 lines) providing `getHelpContent`, `getAlgorithmHelp`, and `getIntertextualityCategoryHelp` with scholarly translations.

### Changed
- Match Gallery and Heatmap panels constrained to fixed height (420px) with internal scrolling, reducing vertical space consumption.
- `ChartControls.tsx` expanded with `ZoomControls` component (zoom in/out/reset with percentage display).
- Help modal rendering refactored from static `HELP_CONTENT` constant to dynamic `renderHelpContent(topic, lang)` function.

## [2.7.0] - 2026-03-29
### Added
- Internationalization (i18n) system supporting 6 languages: English, 日本語, 中文, 한국어, Deutsch, Latina.
- New service: `i18n.ts` with full UI translation coverage.
- Old Japanese (万葉集 & 注釈) example added to Quick Load.
- SVG/PNG download (2× resolution) and fullscreen mode for all visualization panels: Alignment Flow, Similarity Histogram, Network Graph, Dispersion Plot, and Heatmap.
- New component: `ChartControls.tsx` (DownloadButtons, FullscreenButton, ChartToolbar) integrated into every chart header.
- Font size and font family controls in the menu bar.
- Interactive help modals (?) for Heatmap axis labels (Witness α/β Position).
- Interactive help modals for AI Intertextuality Analysis section and classification taxonomy.
- Confidence-based colour highlighting for AI analysis parallel passages with per-category coding.
- Confidence distribution mini-chart and category summary badges in AI results view.
- AI Analysis auto-re-runs when the Collation Engine is triggered.

### Fixed
- Claude API "Failed to fetch" CORS issue resolved via Vercel proxy rewrites.
- Gemini and OpenAI API calls also routed through Vercel proxy on deployed environments.

### Changed
- Heatmap component redesigned: titled header, HTML-based axis labels with help buttons (replacing SVG text).
- AI match cards now use dynamic border/background colours scaled by confidence level.
- `vercel.json` updated with API proxy rewrites for `/api/anthropic`, `/api/openai`, `/api/gemini`.

## [2.6.0] - 2026-03-29
### Added
- AI Intertextuality Analysis system with multi-model support (Claude, Gemini, ChatGPT).
- AI-powered detection of direct quotations, allusions, echoes, paraphrases, structural parallels, thematic reuse, and formulaic language.
- User-configurable API keys for each provider (stored in browser memory only).
- Comparative view for side-by-side analysis across multiple AI models.
- Category-based filtering and expandable match cards with scholarly explanations.
- New service: `aiAnalysisService.ts` for API integration.
- New component: `AIAnalysisPanel.tsx` for configuration and results display.

## [2.5.0] - 2026-03-29
### Added
- Arabic and Ancient Greek examples added to Quick Load.
- Added CC BY 4.0 License and README.md.
- Added footer with license information and changelog link.

### Changed
- Default algorithm changed to Jaccard (Set Similarity).
- Optimized Levenshtein distance calculation to prevent UI freezing on large texts.
- Improved memory usage for text comparison.

## [2.4.0] - 2026-02-14
### Added
- Vercel deployment configuration (`vercel.json`).
- Restored text reuse visualization features (Alignment Flow, Parallel Viewer, Network Graph, Dispersion Plot, Similarity Histogram).
- Expanded multilingual support with longer examples for English, Latin, Coptic, Sanskrit, Chinese, and Syriac.

### Changed
- UI layout restructured to accommodate new visualization components.
