import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Match } from '../types';
import ChartToolbar from './ChartControls';

interface HeatmapProps {
  matches: Match[];
  sourceLength: number;
  targetLength: number;
  onSelectMatch: (match: Match) => void;
  selectedMatch: Match | null;
  onHelpClick?: (topic: string) => void;
}

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

const Heatmap: React.FC<HeatmapProps> = ({ matches, sourceLength, targetLength, onSelectMatch, selectedMatch, onHelpClick }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || sourceLength === 0 || targetLength === 0) return;

    d3.select(containerRef.current).selectAll("*").remove();

    const margin = { top: 10, right: 20, bottom: 20, left: 50 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 320 - margin.top - margin.bottom;

    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, sourceLength]).range([0, width]);
    const y = d3.scaleLinear().domain([0, targetLength]).range([0, height]);
    const color = d3.scaleSequential().domain([0, 100]).interpolator(d3.interpolateRdBu);

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(10));
    svg.append("g").call(d3.axisLeft(y).ticks(10));

    const cellWidth = Math.max(4, width / sourceLength * 3);
    const cellHeight = Math.max(4, height / targetLength * 3);

    svg.selectAll("rect")
      .data(matches)
      .enter()
      .append("rect")
      .attr("x", d => x(d.sourcePosition))
      .attr("y", d => y(d.targetPosition))
      .attr("width", cellWidth)
      .attr("height", cellHeight)
      .attr("fill", d => {
         if (selectedMatch === d) return "#c9302c";
         return color(d.similarity);
      })
      .attr("stroke", d => selectedMatch === d ? "black" : "none")
      .attr("stroke-width", 1)
      .attr("opacity", d => selectedMatch && selectedMatch !== d ? 0.3 : 0.8)
      .attr("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation();
        onSelectMatch(d);
      })
      .append("title")
      .text(d => `Similarity: ${d.similarity.toFixed(1)}%\nClick to view pair`);

  }, [matches, sourceLength, targetLength, selectedMatch]);

  // Scroll to selected cell within the chart container
  useEffect(() => {
    if (!selectedMatch || !containerRef.current) return;
    const selected = containerRef.current.querySelector('rect[stroke="black"]');
    if (selected && containerRef.current.scrollHeight > containerRef.current.clientHeight) {
      const rect = selected.getBoundingClientRect();
      const parentRect = containerRef.current.getBoundingClientRect();
      containerRef.current.scrollTo({
        top: containerRef.current.scrollTop + (rect.top - parentRect.top) - 20,
        behavior: 'smooth'
      });
    }
  }, [selectedMatch]);

  return (
    <div ref={wrapperRef} className="bg-white border border-gray-200 rounded-sm shadow-sm flex flex-col overflow-hidden max-h-[420px]">
      {/* Header with title */}
      <div className="bg-academic-paper px-4 py-3 border-b border-gray-200 flex justify-between items-center shrink-0">
        <span className="text-[11px] font-bold uppercase text-academic-blue tracking-widest flex items-center">
          Position Correspondence (Heatmap)
          {onHelpClick && <HelpButton topic="heatmapView" onClick={onHelpClick} />}
        </span>
        <ChartToolbar containerRef={wrapperRef} filename="icoma-heatmap" />
      </div>
      {/* Axis labels */}
      <div className="px-4 pt-2 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">Y-Axis: Witness β Position</span>
          {onHelpClick && <HelpButton topic="heatmapAxisBeta" onClick={onHelpClick} />}
        </div>
        <div className="flex items-center">
          <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">X-Axis: Witness α Position</span>
          {onHelpClick && <HelpButton topic="heatmapAxisAlpha" onClick={onHelpClick} />}
        </div>
      </div>
      {/* Chart */}
      <div ref={containerRef} className="w-full flex-1 min-h-[280px] overflow-y-auto px-2 pb-2" />
    </div>
  );
};

export default Heatmap;
