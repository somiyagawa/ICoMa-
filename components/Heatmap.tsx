import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Match } from '../types';

interface HeatmapProps {
  matches: Match[];
  sourceLength: number;
  targetLength: number;
  onSelectMatch: (match: Match) => void;
  selectedMatch: Match | null;
}

const Heatmap: React.FC<HeatmapProps> = ({ matches, sourceLength, targetLength, onSelectMatch, selectedMatch }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || sourceLength === 0 || targetLength === 0) return;

    d3.select(containerRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 20, bottom: 40, left: 50 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

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

    svg.append("text").attr("x", width/2).attr("y", height + 35).attr("text-anchor", "middle").attr("font-size", "10px").text("Witness α Position");
    svg.append("text").attr("transform", "rotate(-90)").attr("y", -35).attr("x", -height/2).attr("text-anchor", "middle").attr("font-size", "10px").text("Witness β Position");

    const cellWidth = Math.max(4, width / sourceLength * 3); // Make slightly clickable
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
         if (selectedMatch === d) return "#c9302c"; // Highlight selected
         return color(d.similarity);
      })
      .attr("stroke", d => selectedMatch === d ? "black" : "none")
      .attr("stroke-width", 1)
      .attr("opacity", d => selectedMatch && selectedMatch !== d ? 0.3 : 0.8) // Dim others
      .attr("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation();
        onSelectMatch(d);
      })
      .append("title")
      .text(d => `Similarity: ${d.similarity.toFixed(1)}%\nClick to view pair`);

  }, [matches, sourceLength, targetLength, selectedMatch]);

  return <div ref={containerRef} className="w-full h-[400px] bg-white border border-gray-200 rounded-sm shadow-sm" />;
};

export default Heatmap;