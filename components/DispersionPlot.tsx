import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Match } from '../types';

interface DispersionPlotProps {
  matches: Match[];
  sourceLength: number;
  targetLength: number;
  onSelectMatch: (match: Match) => void;
  selectedMatch: Match | null;
}

const DispersionPlot: React.FC<DispersionPlotProps> = ({ matches, sourceLength, targetLength, onSelectMatch, selectedMatch }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    d3.select(containerRef.current).selectAll("*").remove();

    const width = containerRef.current.clientWidth;
    const height = 100;
    const margin = { left: 10, right: 10 };

    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const barHeight = 25;
    const row1Y = 20;
    const row2Y = 60;

    // Backgrounds
    svg.append("rect").attr("x", 0).attr("y", row1Y).attr("width", width).attr("height", barHeight).attr("fill", "#f8f9fa").attr("stroke", "#bdc3c7");
    svg.append("rect").attr("x", 0).attr("y", row2Y).attr("width", width).attr("height", barHeight).attr("fill", "#f8f9fa").attr("stroke", "#bdc3c7");

    svg.append("text").attr("x", 0).attr("y", row1Y - 5).text("Witness α Dispersion").attr("font-size", "10px").attr("fill", "#2c3e50");
    svg.append("text").attr("x", 0).attr("y", row2Y - 5).text("Witness β Dispersion").attr("font-size", "10px").attr("fill", "#2c3e50");

    // Render matches
    // Note: Rendering two rects per match (one for A, one for B)
    
    const g = svg.append("g");

    matches.forEach(match => {
        const x1 = (match.sourcePosition / sourceLength) * width;
        const w1 = Math.max(2, (match.sourcePhrase.length / sourceLength) * width);
        
        const x2 = (match.targetPosition / targetLength) * width;
        const w2 = Math.max(2, (match.targetPhrase.length / targetLength) * width);

        const isSelected = selectedMatch === match;
        const color = isSelected ? "#c9302c" : (match.similarity >= 80 ? "#2980b9" : "#95a5a6");
        const opacity = isSelected ? 1 : (selectedMatch ? 0.3 : 0.6);

        // Bar A
        g.append("rect")
         .attr("x", x1)
         .attr("y", row1Y)
         .attr("width", w1)
         .attr("height", barHeight)
         .attr("fill", color)
         .attr("opacity", opacity)
         .attr("cursor", "pointer")
         .on("click", (e) => { e.stopPropagation(); onSelectMatch(match); })
         .append("title").text(`α pos: ${match.sourcePosition} (Click to view)`);

        // Bar B
        g.append("rect")
         .attr("x", x2)
         .attr("y", row2Y)
         .attr("width", w2)
         .attr("height", barHeight)
         .attr("fill", color)
         .attr("opacity", opacity)
         .attr("cursor", "pointer")
         .on("click", (e) => { e.stopPropagation(); onSelectMatch(match); })
         .append("title").text(`β pos: ${match.targetPosition} (Click to view)`);
    });

  }, [matches, sourceLength, targetLength, selectedMatch]);

  return <div ref={containerRef} className="w-full bg-white border border-gray-200 rounded-sm shadow-sm p-4" />;
};

export default DispersionPlot;