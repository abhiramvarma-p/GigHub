import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SkillNode {
  id: string;
  group: number;
  category: string;
}

interface SkillLink {
  source: string;
  target: string;
  value: number;
}

interface SkillTreeProps {
  width?: number;
  height?: number;
}

const SkillTree: React.FC<SkillTreeProps> = ({ width = 928, height = 680 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Sample data structure for skills
    const data = {
      nodes: [
        // Web Development Category
        { id: "Web Development", group: 0, category: "Web Development" },
        // Web Development Subcategories
        { id: "Frontend", group: 1, category: "Web Development" },
        { id: "Backend", group: 1, category: "Web Development" },
        { id: "Full Stack", group: 1, category: "Web Development" },
        // Frontend Specializations
        { id: "React", group: 2, category: "Web Development" },
        { id: "Angular", group: 2, category: "Web Development" },
        { id: "Vue.js", group: 2, category: "Web Development" },
        // Backend Specializations
        { id: "Node.js", group: 2, category: "Web Development" },
        { id: "Python", group: 2, category: "Web Development" },
        { id: "Java", group: 2, category: "Web Development" },

        // Mobile Development Category
        { id: "Mobile Development", group: 0, category: "Mobile Development" },
        // Mobile Development Specializations
        { id: "iOS", group: 1, category: "Mobile Development" },
        { id: "Android", group: 1, category: "Mobile Development" },
        { id: "React Native", group: 1, category: "Mobile Development" },

        // Data Science Category
        { id: "Data Science", group: 0, category: "Data Science" },
        // Data Science Specializations
        { id: "Machine Learning", group: 1, category: "Data Science" },
        { id: "Data Analysis", group: 1, category: "Data Science" },
        { id: "Big Data", group: 1, category: "Data Science" },

        // Cloud Computing Category
        { id: "Cloud Computing", group: 0, category: "Cloud Computing" },
        // Cloud Computing Specializations
        { id: "AWS", group: 1, category: "Cloud Computing" },
        { id: "Azure", group: 1, category: "Cloud Computing" },
        { id: "GCP", group: 1, category: "Cloud Computing" },
      ] as SkillNode[],
      links: [
        // Web Development Links
        { source: "Web Development", target: "Frontend", value: 1 },
        { source: "Web Development", target: "Backend", value: 1 },
        { source: "Web Development", target: "Full Stack", value: 1 },
        { source: "Frontend", target: "React", value: 1 },
        { source: "Frontend", target: "Angular", value: 1 },
        { source: "Frontend", target: "Vue.js", value: 1 },
        { source: "Backend", target: "Node.js", value: 1 },
        { source: "Backend", target: "Python", value: 1 },
        { source: "Backend", target: "Java", value: 1 },

        // Mobile Development Links
        { source: "Mobile Development", target: "iOS", value: 1 },
        { source: "Mobile Development", target: "Android", value: 1 },
        { source: "Mobile Development", target: "React Native", value: 1 },

        // Data Science Links
        { source: "Data Science", target: "Machine Learning", value: 1 },
        { source: "Data Science", target: "Data Analysis", value: 1 },
        { source: "Data Science", target: "Big Data", value: 1 },

        // Cloud Computing Links
        { source: "Cloud Computing", target: "AWS", value: 1 },
        { source: "Cloud Computing", target: "Azure", value: 1 },
        { source: "Cloud Computing", target: "GCP", value: 1 },
      ] as SkillLink[],
    };

    // Create the SVG container
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    // Create a color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create a simulation with several forces
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id((d: any) => d.id))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(0, 0))
      .force("collision", d3.forceCollide().radius(30));

    // Create the links
    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", 1);

    // Create the nodes
    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", d => d.group === 0 ? 10 : d.group === 1 ? 8 : 6)
      .attr("fill", d => color(d.group));

    // Add labels to nodes
    const labels = svg.append("g")
      .selectAll("text")
      .data(data.nodes)
      .join("text")
      .text(d => d.id)
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em");

    // Add drag behavior
    node.call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      labels
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    // Drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [width, height]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default SkillTree; 