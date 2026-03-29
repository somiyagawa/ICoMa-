# Changelog

All notable changes to this project will be documented in this file.

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
