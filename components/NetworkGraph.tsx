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
    const relevantMatches = [...matches]
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

    // Label backgrounds (white rect behind text for readability)
    const labelBg = g.append("g")
      .selectAll("rect")
      .data(nodes)
      .join("rect")
      .attr("fill", "white")
      .attr("opacity", 0.85)
      .attr("rx", 2);

    const label = g.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d: any) => d.label.length > 15 ? d.label.substring(0, 13) + '…' : d.label)
      .attr("font-size", "8px")
      .attr("fill", "#555")
      .attr("pointer-events", "none");

    labelSelectionRef.current = label;

    // After first render, measure text and size backgrounds
    label.each(function(this: SVGTextElement) {
      const bbox = this.getBBox();
      const parentData = d3.select(this).datum();
      labelBg.filter((d: any) => d === parentData)
        .attr("width", bbox.width + 4)
        .attr("height", bbox.height + 2);
    });

    simulation.on("tick", () => {
      link.attr("x1", (d: any) => d.source.x).attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x).attr("y2", (d: any) => d.target.y);
      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
      // Position labels clearly below the circle (not overlapping)
      label.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y + 18)
           .attr("text-anchor", "middle");
      labelBg.attr("x", (d: any) => d.x - (labelBg.filter((bg: any) => bg === d).attr("width") || 0) / 2)
             .attr("y", (d: any) => d.y + 9);
    });

    return () => simulation.stop();
  }, [matches]);

  useEffect(() => {
    if (!nodeSelectionRef.current || !linkSelectionRef.current || !labelSelectionRef.current) return;

    const alphaId = selectedMatch ? `A::${selectedMatch.sourcePhrase}` : null;
    const betaId = selectedMatch ? `B::${selectedMatch.targetPhrase}` : null;
    const isSelected = (d: any) => alphaId && (d.id === alphaId || d.id === betaId);

    // --- Highlight nodes ---
    nodeSelectionRef.current
      .transition().duration(400)
      .attr("stroke", (d: any) => isSelected(d) ? "#c9302c" : "#fff")
      .attr("stroke-width", (d: any) => isSelected(d) ? 4 : 1.5)
      .attr("r", (d: any) => isSelected(d) ? 12 : 7)
      .attr("opacity", (d: any) => {
        if (!selectedMatch) return 1;
        return isSelected(d) ? 1 : 0.15;
      });

    // --- Highlight links ---
    const isMatchedLink = (d: any) => {
      if (!selectedMatch) return false;
      // Use phrase comparison instead of reference equality for cross-panel compatibility
      const md = d.matchData;
      return md && md.sourcePhrase === selectedMatch.sourcePhrase && md.targetPhrase === selectedMatch.targetPhrase;
    };
    const isConnectedLink = (d: any) => {
      const srcId = typeof d.source === 'object' ? d.source.id : d.source;
      const tgtId = typeof d.target === 'object' ? d.target.id : d.target;
      return srcId === alphaId || tgtId === betaId || srcId === betaId || tgtId === alphaId;
    };

    linkSelectionRef.current
      .transition().duration(400)
      .attr("stroke", (d: any) => {
        if (!selectedMatch) return d.value >= 99 ? "#27ae60" : "#bdc3c7";
        if (isMatchedLink(d)) return "#c9302c";
        if (isConnectedLink(d)) return "#e88";
        return "#bdc3c7";
      })
      .attr("stroke-opacity", (d: any) => {
        if (!selectedMatch) return 0.4;
        if (isMatchedLink(d)) return 1;
        if (isConnectedLink(d)) return 0.6;
        return 0.05;
      })
      .attr("stroke-width", (d: any) => {
        if (selectedMatch && isMatchedLink(d)) return 4;
        return Math.max(1, (d.value - 40) / 10);
      });

    // --- Highlight labels ---
    labelSelectionRef.current
      .transition().duration(400)
      .attr("fill", (d: any) => isSelected(d) ? "#c9302c" : "#555")
      .attr("font-weight", (d: any) => isSelected(d) ? "bold" : "normal")
      .attr("font-size", (d: any) => isSelected(d) ? "10px" : "8px")
      .attr("opacity", (d: any) => {
        if (!selectedMatch) return 1;
        return isSelected(d) ? 1 : 0.15;
      });

    // --- Auto zoom-in to selected cluster ---
    if (selectedMatch && svgRef.current && zoomBehaviorRef.current && nodesDataRef.current.length > 0) {
      // Stop simulation to stabilize node positions before zooming
      if (simulationRef.current) simulationRef.current.stop();

      const doZoom = () => {
        if (!svgRef.current || !zoomBehaviorRef.current) return;
        const alphaNodeZ = nodesDataRef.current.find((n: any) => n.id === alphaId);
        const betaNodeZ = nodesDataRef.current.find((n: any) => n.id === betaId);

        const foundNodes = [alphaNodeZ, betaNodeZ].filter(
          (n: any) => n && typeof n.x === 'number' && !isNaN(n.x) && typeof n.y === 'number' && !isNaN(n.y)
        );

        if (foundNodes.length > 0) {
          const svg = d3.select(svgRef.current);
          const width = svgRef.current.clientWidth || 800;
          const height = 350;

          let cx: number, cy: number, targetScale: number;

          if (foundNodes.length === 2) {
            cx = (foundNodes[0].x + foundNodes[1].x) / 2;
            cy = (foundNodes[0].y + foundNodes[1].y) / 2;
            const dist = Math.sqrt((foundNodes[0].x - foundNodes[1].x) ** 2 + (foundNodes[0].y - foundNodes[1].y) ** 2);
            targetScale = Math.min(2.5, Math.max(1.2, 180 / Math.max(dist, 1)));
          } else {
            cx = foundNodes[0].x;
            cy = foundNodes[0].y;
            targetScale = 2.0;
          }

          const transform = d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(targetScale)
            .translate(-cx, -cy);

          svg.transition()
            .duration(750)
            .ease(d3.easeCubicInOut)
            .call(zoomBehaviorRef.current.transform as any, transform);
        }
      };

      // Small delay to ensure simulation has updated positions
      setTimeout(doZoom, 100);
    }

    // Reset zoom when deselected
    if (!selectedMatch && svgRef.current && zoomBehaviorRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .call(zoomBehaviorRef.current.transform as any, d3.zoomIdentity);
    }
  }, [selectedMatch]);

  return (
    <div className="relative w-full overflow-hidden h-[350px]">
      <div ref={containerRef} className="w-full h-full" />
      {isEmpty && <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-50/50 text-[10px]">No significant reuse clusters detected.</div>}
    </div>
  );
};

export default NetworkGraph;