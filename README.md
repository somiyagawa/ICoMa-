# ICoMa (Intertextuality Collation Machine)

ICoMa is a web-based computational linguistics tool developed for analyzing text reuse, plagiarism, and intertextuality across multiple languages and scripts. It is designed to handle complex multilingual corpora, including English, Latin, Coptic, Sanskrit, Chinese, Syriac, Arabic, and Ancient Greek.

Developed by the **So Miyagawa Computational Linguistics Lab**.

## Features

*   **Multilingual Support:** Built-in tokenization and normalization for various scripts (Latin, Greek, Coptic, CJK, Arabic, Hebrew, Syriac, Devanagari, etc.).
*   **Multiple Algorithms:**
    *   Jaccard (Set Similarity) - *Default*
    *   Smith-Waterman (Local Alignment)
    *   Levenshtein (Edit Distance)
    *   N-gram (Character & Word level)
*   **Advanced Visualizations:**
    *   **Alignment Flow:** Visualizes connections between source and target texts as ribbons.
    *   **Parallel Viewer:** Side-by-side text comparison with highlighted matches.
    *   **Network Graph:** Visualizes clusters of related text segments.
    *   **Dispersion Plot:** Shows the distribution of matches across the texts.
    *   **Similarity Histogram:** Displays the distribution of similarity scores.
    *   **Heatmap:** Matrix view of text similarities.

## Tech Stack

*   React 19
*   Vite
*   Tailwind CSS
*   D3.js (for data visualization)
*   TypeScript

## Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

This project is configured for easy deployment on Vercel. A `vercel.json` file is included to handle client-side routing.

## License

This project is licensed under the Creative Commons Attribution 4.0 International (CC BY 4.0) - see the [LICENSE](LICENSE) file for details.
