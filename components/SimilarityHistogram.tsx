import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Match } from '../types';

interface SimilarityHistogramProps {
  matches: Match[];
  selectedMatch?: Match | null;
  onSelectMatch?: (match: Match) => void;
}

const SimilarityHistogram: React.FC<SimilarityHistogramProps> = ({ matches, selectedMatch, onSelectMatch }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    d3.select(containerRef.current).selectAll("*").remove();

    const margin = { top: 10, right: 30, bottom: 40, left: 40 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis: Similarity buckets (0-100)
    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width]);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 35)
      .attr("fill", "#2c3e50")
      .attr("font-size", "10px")
      .text("Similarity Score (%)");

    // Histogram
    const histogram = d3.bin()
      .value((d: any) => d.similarity)
      .domain(x.domain() as [number, number])
      .thresholds(x.ticks(20)); // 20 bins

    const bins = histogram(matches as any);

    // Track which bin the selected match belongs to
    const selectedBinIndex = selectedMatch
      ? bins.findIndex(bin => (bin as any[]).some((m: any) => m === selectedMatch))
      : -1;

    // Y axis
    const y = d3.scaleLinear()
      .range([height, 0]);

    y.domain([0, d3.max(bins, d => d.length) || 0]);

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5));

    // Bars
    svg.selectAll("rect")
      .data(bins)
      .join("rect")
      .attr("x", 1)
      .attr("transform", d => `translate(${x(d.x0 || 0)}, ${y(d.length)})`)
      .attr("width", d => Math.max(0, x(d.x1 || 0) - x(d.x0 || 0) - 1))
      .attr("height", d => height - y(d.length))
      .attr("fill", (d, i) => {
        if (selectedBinIndex >= 0 && i === selectedBinIndex) return "#c9302c";
        if (selectedBinIndex >= 0) return "#d5cfc0";
        return "#2563eb";
      })
      .attr("opacity", (d, i) => {
        if (selectedBinIndex >= 0 && i === selectedBinIndex) return 1;
        if (selectedBinIndex >= 0) return 0.4;
        return 0.8;
      })
      .attr("cursor", onSelectMatch ? "pointer" : "default")
      .attr("stroke", (d, i) => i === selectedBinIndex ? "#991b1b" : "none")
      .attr("stroke-width", (d, i) => i === selectedBinIndex ? 2 : 0)
      .on("mouseover", function(event, d) {
        if (selectedBinIndex < 0 || bins.indexOf(d) !== selectedBinIndex) {
          d3.select(this).attr("opacity", 1).attr("fill", "#1e40af");
        }
      })
      .on("mouseout", function(event, d) {
        const i = bins.indexOf(d);
        if (selectedBinIndex >= 0 && i === selectedBinIndex) {
          d3.select(this).attr("opacity", 1).attr("fill", "#c9302c");
        } else if (selectedBinIndex >= 0) {
          d3.select(this).attr("opacity", 0.4).attr("fill", "#d5cfc0");
        } else {
          d3.select(this).attr("opacity", 0.8).attr("fill", "#2563eb");
        }
      })
      .on("click", function(event, d) {
        if (!onSelectMatch) return;
        event.stopPropagation();
        // Select the highest-similarity match in the clicked bin
        const binMatches = d as unknown as Match[];
        if (binMatches.length > 0) {
          const best = binMatches.reduce((a: Match, b: Match) => a.similarity > b.similarity ? a : b);
          onSelectMatch(best);
        }
      })
      .append("title")
      .text(d => `${d.length} matches (${(d.x0 || 0).toFixed(0)}–${(d.x1 || 0).toFixed(0)}% similarity)\nClick to select`);

    // Selected match indicator line
    if (selectedMatch) {
      svg.append("line")
        .attr("x1", x(selectedMatch.similarity))
        .attr("x2", x(selectedMatch.similarity))
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke", "#c9302c")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,2")
        .attr("opacity", 0.8);

      svg.append("text")
        .attr("x", x(selectedMatch.similarity))
        .attr("y", -2)
        .attr("text-anchor", "middle")
        .attr("font-size", "8px")
        .attr("fill", "#c9302c")
        .attr("font-weight", "bold")
        .text(`${selectedMatch.similarity.toFixed(1)}%`);
    }

    // Annotation
    svg.append("text")
      .attr("x", width)
      .attr("y", 10)
      .attr("text-anchor", "end")
      .attr("font-size", "10px")
      .attr("fill", "#7f8c8d")
      .text(`n=${matches.length}`);

  }, [matches, selectedMatch]);

  return (
    <div className="w-full overflow-x-auto max-w-full">
      <div ref={containerRef} className="w-full h-[200px] min-w-[280px]" />
    </div>
  );
};

export default SimilarityHistogram;
