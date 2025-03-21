import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import * as d3 from 'd3';
import { styled } from '@mui/material/styles';

const StyledTreeContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 600,
  background: 'rgba(255, 255, 255, 0.02)',
  borderRadius: theme.shape.borderRadius * 1.5,
  border: '1px solid rgba(255, 255, 255, 0.05)',
  overflow: 'hidden',
  position: 'relative',
}));

const SkillTree = ({ skills }) => {
  const svgRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (!skills?.length) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    const width = containerRef.current.clientWidth;
    const height = 600;
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create the force simulation
    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Process data into nodes and links
    const nodes = [];
    const links = [];
    
    // Add root node
    nodes.push({
      id: 'root',
      name: 'Skills',
      level: '',
      isRoot: true
    });

    // Process skills into nodes and links
    const processSkill = (skill, parentId = 'root') => {
      nodes.push({
        id: skill.id,
        name: skill.name,
        level: skill.level
      });
      links.push({
        source: parentId,
        target: skill.id
      });

      // Process children recursively
      if (skill.children?.length) {
        skill.children.forEach(child => {
          processSkill(child, skill.id);
        });
      }
    };

    skills.forEach(skill => {
      processSkill(skill);
    });

    // Create container for zoom
    const g = svg.append('g');

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .style('stroke', 'rgba(255, 255, 255, 0.1)')
      .style('stroke-width', 2);

    // Create nodes
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add circles to nodes
    node.append('circle')
      .attr('r', d => d.isRoot ? 12 : 8)
      .style('fill', d => {
        if (d.isRoot) return 'rgba(255, 255, 255, 0.3)';
        switch (d.level?.toLowerCase()) {
          case 'beginner': return 'rgba(255, 255, 255, 0.3)';
          case 'intermediate': return 'rgba(255, 255, 255, 0.5)';
          case 'advanced': return 'rgba(255, 255, 255, 0.7)';
          case 'expert': return 'rgba(255, 255, 255, 0.9)';
          default: return 'rgba(255, 255, 255, 0.3)';
        }
      })
      .style('stroke', 'rgba(255, 255, 255, 0.2)')
      .style('stroke-width', 2);

    // Add labels to nodes
    node.append('text')
      .attr('dx', 15)
      .attr('dy', 5)
      .style('fill', 'rgba(255, 255, 255, 0.9)')
      .style('font-family', 'Outfit')
      .style('font-size', d => d.isRoot ? '14px' : '12px')
      .text(d => d.name);

    // Add level labels
    node.filter(d => !d.isRoot)
      .append('text')
      .attr('dx', 15)
      .attr('dy', 20)
      .style('fill', 'rgba(255, 255, 255, 0.5)')
      .style('font-family', 'Outfit')
      .style('font-size', '10px')
      .text(d => d.level ? d.level.charAt(0).toUpperCase() + d.level.slice(1) : '');

    // Update positions on simulation tick
    simulation.nodes(nodes).on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    simulation.force('link').links(links);

    // Drag functions
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Initial simulation cool down
    simulation.alpha(1).restart();

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [skills]);

  if (!skills?.length) {
    return (
      <StyledTreeContainer
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No skills added yet. Click "Manage Skills" to add your skills.
        </Typography>
      </StyledTreeContainer>
    );
  }

  return (
    <StyledTreeContainer ref={containerRef}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
    </StyledTreeContainer>
  );
};

export default SkillTree; 