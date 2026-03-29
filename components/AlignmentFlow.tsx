import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Match } from '../types';

interface AlignmentFlowProps {
  matches: Match[];
  sourceLength: number;
  targetLength: number;
  onSelectMatch: (match: Match) => void;
  selectedMatch: Match | null;
}

const AlignmentFlow: React.FC<AlignmentFlowProps> = ({ matches, sourceLength, targetLength, onSelectMatch, selectedMatch }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || sourceLength === 0 || targetLength === 0) return;

    d3.select(containerRef.current).selectAll("*").remove();

    const margin = { top: 30, right: 20, bottom: 30, left: 20 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScaleA = d3.scaleLinear().domain([0, sourceLength]).range([0, width]);
    const xScaleB = d3.scaleLinear().domain([0, targetLength]).range([0, width]);

    // Bars
    svg.append("rect").attr("width", width).attr("height", 10).attr("fill", "#34495e").attr("rx", 2);
    svg.append("rect").attr("y", height - 10).attr("width", width).attr("height", 10).attr("fill", "#8b7355").attr("rx", 2);

    const displayMatches = matches.length > 300 ? matches.filter(m => m.similarity > 70) : matches;

    // Ribbons
    svg.selectAll("path")
      .data(displayMatches)
      .enter()
      .append("path")
      .attr("d", d => {
        const x1 = xScaleA(d.sourcePosition);
        const x2 = xScaleB(d.targetPosition);
        const path = d3.path();
        path.moveTo(x1, 10);
        path.bezierCurveTo(x1, height / 2, x2, height / 2, x2, height - 10);
        return path.toString();
      })
      .attr("fill", "none")
      .attr("stroke", d => {
        if (selectedMatch === d) return "#c9302c";
        return d.similarity > 90 ? "rgba(39, 174, 96, 0.4)" : (d.similarity > 70 ? "rgba(52, 152, 219, 0.3)" : "rgba(149, 165, 166, 0.2)");
      })
      .attr("stroke-width", d => selectedMatch === d ? 3 : Math.max(1, (d.similarity - 40) / 15))
      .attr("opacity", d => selectedMatch && selectedMatch !== d ? 0.2 : 1)
      .attr("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation();
        onSelectMatch(d);
      })
      .append("title")
      .text(d => `Click to view transposition:\nSim: ${d.similarity.toFixed(1)}%`);

  }, [matches, sourceLength, targetLength, selectedMatch]);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-sm shadow-sm p-2">
      <div ref={containerRef} className="w-full h-[250px]" />
      <div className="text-[10px] text-gray-500 text-center mt-1">Click ribbons to view specific reuse pair</div>
    </div>
  );
};

export default AlignmentFlow;