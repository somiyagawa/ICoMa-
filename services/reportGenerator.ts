/**
 * Report Generator for ICoMa — Intertextuality Collation Machine
 * Exports analysis results as PDF, docx, LaTeX, and TEI XML.
 */
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, TextRun, WidthType, BorderStyle,
} from 'docx';
import { saveAs } from 'file-saver';
import { AnalysisResult, AnalysisConfig, Match } from '../types';

export interface ReportData {
  witnessAlphaName: string;
  witnessBetaName: string;
  sourceText: string;
  targetText: string;
  config: AnalysisConfig;
  result: AnalysisResult;
  aiAnalysis?: any;
  date: string;
}

// ── Helpers ──────────────────────────────────────────────────────────

function escapeLatex(text: string): string {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%$#_{}~^]/g, c => `\\${c}`)
    .replace(/</g, '\\textless{}')
    .replace(/>/g, '\\textgreater{}');
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

function topMatches(result: AnalysisResult, max = 50): Match[] {
  return [...result.matches].sort((a, b) => b.similarity - a.similarity).slice(0, max);
}

// ── 1. PDF ──────────────────────────────────────────────────────────

export async function generatePDF(data: ReportData): Promise<Blob> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const { config, result, witnessAlphaName: wA, witnessBetaName: wB } = data;

  // Title
  doc.setFontSize(20);
  doc.text('ICoMa — Intertextuality Analysis Report', 105, 30, { align: 'center' });
  doc.setFontSize(11);
  doc.text(`Generated: ${data.date}`, 105, 40, { align: 'center' });
  doc.text(`${wA}  ↔  ${wB}`, 105, 48, { align: 'center' });

  // Config
  doc.setFontSize(14);
  doc.text('1. Analysis Configuration', 14, 65);
  autoTable(doc, {
    startY: 70,
    head: [['Parameter', 'Value']],
    body: [
      ['Algorithm', config.algorithm],
      ['Window / N-Size', String(config.windowSize)],
      ['Threshold', `${config.threshold}%`],
      ['Script Mode', config.scriptMode],
    ],
    theme: 'grid',
    headStyles: { fillColor: [52, 73, 94] },
    margin: { left: 14, right: 14 },
  });

  // Stats
  const statsY = (doc as any).lastAutoTable?.finalY + 12 || 120;
  doc.setFontSize(14);
  doc.text('2. Statistical Summary', 14, statsY);
  autoTable(doc, {
    startY: statsY + 5,
    head: [['Metric', 'Value']],
    body: [
      ['Mean Similarity', `${result.stats.meanSimilarity.toFixed(1)}%`],
      ['Reuse Coverage', `${result.stats.coverage.toFixed(1)}%`],
      ['Total Alignments', String(result.stats.totalAlignments)],
      ['Unique N-Grams', String(result.stats.uniqueNgrams)],
      ['Tokens (α)', String(result.tokensA.length)],
      ['Tokens (β)', String(result.tokensB.length)],
      ['Total Matches', String(result.matches.length)],
    ],
    theme: 'grid',
    headStyles: { fillColor: [139, 115, 85] },
    margin: { left: 14, right: 14 },
  });

  // Matches table
  const matchesY = (doc as any).lastAutoTable?.finalY + 12 || 200;
  doc.setFontSize(14);
  doc.text('3. Match Rankings (Top 50)', 14, matchesY);
  const top = topMatches(result);
  autoTable(doc, {
    startY: matchesY + 5,
    head: [['#', 'Sim%', `${wA} (α)`, `${wB} (β)`, 'α pos', 'β pos']],
    body: top.map((m, i) => [
      String(i + 1),
      m.similarity.toFixed(1),
      truncate(m.sourcePhrase, 40),
      truncate(m.targetPhrase, 40),
      String(m.sourcePosition),
      String(m.targetPosition),
    ]),
    theme: 'striped',
    headStyles: { fillColor: [52, 73, 94], fontSize: 8 },
    bodyStyles: { fontSize: 7 },
    columnStyles: { 0: { cellWidth: 8 }, 1: { cellWidth: 12 } },
    margin: { left: 14, right: 14 },
  });

  return doc.output('blob');
}

// ── 2. DOCX ─────────────────────────────────────────────────────────

function makeCell(text: string, bold = false): TableCell {
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text, bold, size: 18 })],
    })],
    verticalAlign: 'center' as any,
  });
}

export async function generateDocx(data: ReportData): Promise<Blob> {
  const { config, result, witnessAlphaName: wA, witnessBetaName: wB } = data;
  const top = topMatches(result);

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ text: 'ICoMa — Intertextuality Analysis Report', heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: `${wA}  ↔  ${wB} | ${data.date}`, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: '' }),

        // Config
        new Paragraph({ text: '1. Analysis Configuration', heading: HeadingLevel.HEADING_1 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({ children: [makeCell('Parameter', true), makeCell('Value', true)] }),
            new TableRow({ children: [makeCell('Algorithm'), makeCell(config.algorithm)] }),
            new TableRow({ children: [makeCell('Window / N-Size'), makeCell(String(config.windowSize))] }),
            new TableRow({ children: [makeCell('Threshold'), makeCell(`${config.threshold}%`)] }),
            new TableRow({ children: [makeCell('Script Mode'), makeCell(config.scriptMode)] }),
          ],
        }),
        new Paragraph({ text: '' }),

        // Stats
        new Paragraph({ text: '2. Statistical Summary', heading: HeadingLevel.HEADING_1 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({ children: [makeCell('Metric', true), makeCell('Value', true)] }),
            new TableRow({ children: [makeCell('Mean Similarity'), makeCell(`${result.stats.meanSimilarity.toFixed(1)}%`)] }),
            new TableRow({ children: [makeCell('Reuse Coverage'), makeCell(`${result.stats.coverage.toFixed(1)}%`)] }),
            new TableRow({ children: [makeCell('Total Alignments'), makeCell(String(result.stats.totalAlignments))] }),
            new TableRow({ children: [makeCell('Unique N-Grams'), makeCell(String(result.stats.uniqueNgrams))] }),
            new TableRow({ children: [makeCell(`Tokens (${wA})`), makeCell(String(result.tokensA.length))] }),
            new TableRow({ children: [makeCell(`Tokens (${wB})`), makeCell(String(result.tokensB.length))] }),
          ],
        }),
        new Paragraph({ text: '' }),

        // Matches
        new Paragraph({ text: '3. Match Rankings (Top 50)', heading: HeadingLevel.HEADING_1 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [makeCell('#', true), makeCell('Sim%', true), makeCell(`${wA} (α)`, true), makeCell(`${wB} (β)`, true), makeCell('α pos', true), makeCell('β pos', true)],
            }),
            ...top.map((m, i) => new TableRow({
              children: [
                makeCell(String(i + 1)),
                makeCell(m.similarity.toFixed(1)),
                makeCell(truncate(m.sourcePhrase, 60)),
                makeCell(truncate(m.targetPhrase, 60)),
                makeCell(String(m.sourcePosition)),
                makeCell(String(m.targetPosition)),
              ],
            })),
          ],
        }),
      ],
    }],
  });

  return Packer.toBlob(doc);
}

// ── 3. LaTeX ────────────────────────────────────────────────────────

export function generateLaTeX(data: ReportData): string {
  const { config, result, witnessAlphaName: wA, witnessBetaName: wB } = data;
  const top = topMatches(result);
  const eA = escapeLatex(wA), eB = escapeLatex(wB);

  const matchRows = top.map((m, i) =>
    `  ${i + 1} & ${m.similarity.toFixed(1)}\\% & ${escapeLatex(truncate(m.sourcePhrase, 50))} & ${escapeLatex(truncate(m.targetPhrase, 50))} & ${m.sourcePosition} & ${m.targetPosition} \\\\`
  ).join('\n');

  return `\\documentclass[a4paper,11pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{booktabs,longtable,hyperref,geometry}
\\geometry{margin=2.5cm}
\\title{ICoMa --- Intertextuality Analysis Report\\\\\\large ${eA} $\\leftrightarrow$ ${eB}}
\\author{Generated by ICoMa}
\\date{${escapeLatex(data.date)}}

\\begin{document}
\\maketitle

\\section{Analysis Configuration}
\\begin{tabular}{ll}
\\toprule
\\textbf{Parameter} & \\textbf{Value} \\\\
\\midrule
Algorithm & ${escapeLatex(config.algorithm)} \\\\
Window / N-Size & ${config.windowSize} \\\\
Threshold & ${config.threshold}\\% \\\\
Script Mode & ${escapeLatex(config.scriptMode)} \\\\
\\bottomrule
\\end{tabular}

\\section{Statistical Summary}
\\begin{tabular}{ll}
\\toprule
\\textbf{Metric} & \\textbf{Value} \\\\
\\midrule
Mean Similarity & ${result.stats.meanSimilarity.toFixed(1)}\\% \\\\
Reuse Coverage & ${result.stats.coverage.toFixed(1)}\\% \\\\
Total Alignments & ${result.stats.totalAlignments} \\\\
Unique N-Grams & ${result.stats.uniqueNgrams} \\\\
Tokens (${eA}) & ${result.tokensA.length} \\\\
Tokens (${eB}) & ${result.tokensB.length} \\\\
Total Matches & ${result.matches.length} \\\\
\\bottomrule
\\end{tabular}

\\section{Match Rankings (Top 50)}
\\begin{longtable}{rr p{4.5cm} p{4.5cm} rr}
\\toprule
\\textbf{\\#} & \\textbf{Sim\\%} & \\textbf{${eA} ($\\alpha$)} & \\textbf{${eB} ($\\beta$)} & \\textbf{$\\alpha$ pos} & \\textbf{$\\beta$ pos} \\\\
\\midrule
\\endhead
${matchRows}
\\bottomrule
\\end{longtable}

\\end{document}
`;
}

// ── 4. TEI XML ──────────────────────────────────────────────────────

export function generateTEIXML(data: ReportData): string {
  const { config, result, witnessAlphaName: wA, witnessBetaName: wB } = data;
  const top = topMatches(result);

  const matchEntries = top.map((m, i) => `
      <entry n="${i + 1}">
        <form type="alpha"><mentioned>${escapeXml(m.sourcePhrase)}</mentioned></form>
        <form type="beta"><mentioned>${escapeXml(m.targetPhrase)}</mentioned></form>
        <measure type="similarity" quantity="${m.similarity.toFixed(1)}">${m.similarity.toFixed(1)}%</measure>
        <note type="position-alpha">${m.sourcePosition}</note>
        <note type="position-beta">${m.targetPosition}</note>
      </entry>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-model href="http://www.tei-c.org/release/xml/tei/custom/schema/relaxng/tei_all.rng" type="application/xml"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0">
  <teiHeader>
    <fileDesc>
      <titleStmt>
        <title>ICoMa Intertextuality Analysis Report</title>
        <respStmt>
          <resp>Generated by</resp>
          <name>ICoMa — Intertextuality Collation Machine</name>
        </respStmt>
      </titleStmt>
      <publicationStmt>
        <p>Auto-generated report, ${escapeXml(data.date)}</p>
      </publicationStmt>
      <sourceDesc>
        <bibl>
          <title type="alpha">${escapeXml(wA)}</title>
          <title type="beta">${escapeXml(wB)}</title>
        </bibl>
      </sourceDesc>
    </fileDesc>
    <encodingDesc>
      <appInfo>
        <application ident="ICoMa" version="2.8.1">
          <desc>Intertextuality Collation Machine</desc>
        </application>
      </appInfo>
    </encodingDesc>
  </teiHeader>
  <text>
    <body>
      <div type="configuration">
        <head>Analysis Configuration</head>
        <list>
          <item><label>Algorithm</label> <val>${escapeXml(config.algorithm)}</val></item>
          <item><label>Window / N-Size</label> <val>${config.windowSize}</val></item>
          <item><label>Threshold</label> <val>${config.threshold}%</val></item>
          <item><label>Script Mode</label> <val>${escapeXml(config.scriptMode)}</val></item>
        </list>
      </div>
      <div type="statistics">
        <head>Statistical Summary</head>
        <list>
          <item><label>Mean Similarity</label> <val>${result.stats.meanSimilarity.toFixed(1)}%</val></item>
          <item><label>Reuse Coverage</label> <val>${result.stats.coverage.toFixed(1)}%</val></item>
          <item><label>Total Alignments</label> <val>${result.stats.totalAlignments}</val></item>
          <item><label>Unique N-Grams</label> <val>${result.stats.uniqueNgrams}</val></item>
          <item><label>Tokens (${escapeXml(wA)})</label> <val>${result.tokensA.length}</val></item>
          <item><label>Tokens (${escapeXml(wB)})</label> <val>${result.tokensB.length}</val></item>
          <item><label>Total Matches</label> <val>${result.matches.length}</val></item>
        </list>
      </div>
      <div type="matches">
        <head>Match Rankings (Top 50)</head>
        <listBibl>${matchEntries}
        </listBibl>
      </div>
      <div type="witnesses">
        <head>Full Witness Texts</head>
        <quote type="alpha" xml:id="witness-alpha">
          ${escapeXml(truncate(data.sourceText, 2000))}
        </quote>
        <quote type="beta" xml:id="witness-beta">
          ${escapeXml(truncate(data.targetText, 2000))}
        </quote>
      </div>
    </body>
  </text>
</TEI>
`;
}

// ── Download dispatcher ─────────────────────────────────────────────

export async function downloadReport(
  data: ReportData,
  format: 'pdf' | 'docx' | 'latex' | 'tei-xml',
): Promise<void> {
  const safeName = `${data.witnessAlphaName}-${data.witnessBetaName}`.replace(/[^a-zA-Z0-9_\-\u3000-\u9FFF\u00C0-\u024F]/g, '_').slice(0, 40);
  const ts = new Date().toISOString().slice(0, 10);

  switch (format) {
    case 'pdf': {
      const blob = await generatePDF(data);
      saveAs(blob, `icoma-report-${safeName}-${ts}.pdf`);
      break;
    }
    case 'docx': {
      const blob = await generateDocx(data);
      saveAs(blob, `icoma-report-${safeName}-${ts}.docx`);
      break;
    }
    case 'latex': {
      const tex = generateLaTeX(data);
      const blob = new Blob([tex], { type: 'application/x-tex;charset=utf-8' });
      saveAs(blob, `icoma-report-${safeName}-${ts}.tex`);
      break;
    }
    case 'tei-xml': {
      const xml = generateTEIXML(data);
      const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
      saveAs(blob, `icoma-report-${safeName}-${ts}.xml`);
      break;
    }
  }
}
