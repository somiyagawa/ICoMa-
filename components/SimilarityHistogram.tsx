import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Match } from '../types';

interface SimilarityHistogramProps {
  matches: Match[];
}

const SimilarityHistogram: React.FC<SimilarityHistogramProps> = ({ matches }) => {
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
      .attr("fill", "#8b7355")
      .attr("opacity", 0.8)
      .on("mouseover", function() { d3.select(this).attr("opacity", 1); })
      .on("mouseout", function() { d3.select(this).attr("opacity", 0.8); });

    // Annotation
    svg.append("text")
      .attr("x", width)
      .attr("y", 10)
      .attr("text-anchor", "end")
      .attr("font-size", "10px")
      .attr("fill", "#7f8c8d")
      .text(`n=${matches.length}`);

  }, [matches]);

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full h-[200px]" />
    </div>
  );
};

export default SimilarityHistogram;