import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Match } from '../types';

interface NetworkGraphProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  selectedMatch: Match | null;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ matches, onSelectMatch, selectedMatch }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const simulationRef = useRef<d3.Simulation<any, undefined> | null>(null);
  const nodesDataRef = useRef<any[]>([]);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const linkSelectionRef = useRef<any>(null);
  const nodeSelectionRef = useRef<any>(null);
  const labelSelectionRef = useRef<any>(null);

  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // For "Huge" texts, limit to Top 60 most significant to avoid performance crash
    const relevantMatches = matches
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 60);

    if (relevantMatches.length === 0) {
      setIsEmpty(true);
      return;
    }
    setIsEmpty(false);

    d3.select(containerRef.current).selectAll("*").remove();
    const width = containerRef.current.clientWidth || 800;
    const height = 350;

    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);
    
    svgRef.current = svg.node();
    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.2, 5])
        .on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    const nodeMap = new Map();
    relevantMatches.forEach(m => {
      const alphaId = `A::${m.sourcePhrase}`;
      const betaId = `B::${m.targetPhrase}`;
      if (!nodeMap.has(alphaId)) nodeMap.set(alphaId, { id: alphaId, label: m.sourcePhrase, group: 'alpha' });
      if (!nodeMap.has(betaId)) nodeMap.set(betaId, { id: betaId, label: m.targetPhrase, group: 'beta' });
    });

    const nodes = Array.from(nodeMap.values());
    const links = relevantMatches.map(m => ({
      source: `A::${m.sourcePhrase}`,
      target: `B::${m.targetPhrase}`,
      value: m.similarity,
      matchData: m
    }));

    nodesDataRef.current = nodes;

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(30));

    simulationRef.current = simulation;

    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d: any) => d.value >= 99 ? "#27ae60" : "#bdc3c7")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", (d: any) => Math.max(1, (d.value - 40) / 10))
      .on("click", (event, d: any) => { event.stopPropagation(); onSelectMatch(d.matchData); });

    linkSelectionRef.current = link;

    const node = g.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 7)
      .attr("fill", (d: any) => d.group === 'alpha' ? "#34495e" : "#8b7355")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .call(d3.drag<any, any>()
        .on("start", (event, d) => { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on("end", (event, d) => { if (!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }));

    nodeSelectionRef.current = node;

    const label = g.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d: any) => d.label.length > 12 ? d.label.substring(0, 10) + '...' : d.label)
      .attr("font-size", "9px")
      .attr("dx", 10)
      .attr("dy", 3)
      .attr("fill", "#666");
    
    labelSelectionRef.current = label;

    simulation.on("tick", () => {
      link.attr("x1", (d: any) => d.source.x).attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x).attr("y2", (d: any) => d.target.y);
      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
      label.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y);
    });

    return () => simulation.stop();
  }, [matches]);

  useEffect(() => {
    if (!nodeSelectionRef.current) return;
    nodeSelectionRef.current
      .transition().duration(400)
      .attr("stroke", (d: any) => {
        if (selectedMatch && (d.id === `A::${selectedMatch.sourcePhrase}` || d.id === `B::${selectedMatch.targetPhrase}`)) return "#c9302c";
        return "#fff";
      })
      .attr("stroke-width", (d: any) => {
        if (selectedMatch && (d.id === `A::${selectedMatch.sourcePhrase}` || d.id === `B::${selectedMatch.targetPhrase}`)) return 4;
        return 1.5;
      })
      .attr("r", (d: any) => {
        if (selectedMatch && (d.id === `A::${selectedMatch.sourcePhrase}` || d.id === `B::${selectedMatch.targetPhrase}`)) return 12;
        return 7;
      });
  }, [selectedMatch]);

  return (
    <div className="relative w-full overflow-hidden h-[350px]">
      <div ref={containerRef} className="w-full h-full" />
      {isEmpty && <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-50/50 text-[10px]">No significant reuse clusters detected.</div>}
    </div>
  );
};

export default NetworkGraph;