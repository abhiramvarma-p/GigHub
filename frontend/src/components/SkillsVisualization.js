import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'rgba(30, 41, 59, 0.7)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  borderRadius: 12,
}));

const SkillsVisualization = ({ skills }) => {
  console.log('Skills received:', skills);
  const svgRef = useRef();

  useEffect(() => {
    if (!skills || !svgRef.current) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up SVG
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;
    svg.attr('width', width).attr('height', height);

    // Create nodes and links from skills
    const nodes = [];
    const links = [];
    const processedNodes = new Set();

    // Add root node
    nodes.push({
      id: 'root',
      name: 'Skills',
      level: '',
      isRoot: true
    });

    // Process all skills and categories
    const processSkillData = (skillsData) => {
      if (!skillsData) return;

      // Process each skill
      if (Array.isArray(skillsData)) {
        // Create "Other" category node if there are uncategorized skills
        if (skillsData.length > 0) {
          const otherCategoryId = 'category-other';
          if (!processedNodes.has(otherCategoryId)) {
            processedNodes.add(otherCategoryId);
            nodes.push({
              id: otherCategoryId,
              name: 'Other',
              isCategory: true
            });
            links.push({
              source: 'root',
              target: otherCategoryId
            });
          }

          // Add skills to "Other" category
          skillsData.forEach(skill => {
            if (!processedNodes.has(skill.id)) {
              processedNodes.add(skill.id);
              nodes.push({
                id: skill.id,
                name: skill.name,
                isSkill: true,
                level: skill.level || 'beginner'
              });
              links.push({
                source: 'category-other',
                target: skill.id
              });
            }
          });
        }
      }

      // Process categories and their skills
      if (skillsData.skills) {
        const categoryId = skillsData.id;
        if (!processedNodes.has(categoryId)) {
          processedNodes.add(categoryId);
          nodes.push({
            id: categoryId,
            name: skillsData.name,
            isCategory: true
          });
          links.push({
            source: 'root',
            target: categoryId
          });

          skillsData.skills.forEach(skill => {
            const skillId = skill.id;
            if (!processedNodes.has(skillId)) {
              processedNodes.add(skillId);
              nodes.push({
                id: skillId,
                name: skill.name,
                isSkill: true,
                level: skill.level || 'beginner'
              });
              links.push({
                source: categoryId,
                target: skillId
              });
            }
          });
        }
      }
    };

    // Process the skills data
    processSkillData(skills);

    console.log('Processed Nodes:', nodes);
    console.log('Processed Links:', links);

    // Create container for zoom
    const g = svg.append('g');

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create the force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-800))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60))
      .force('x', d3.forceX(width / 2).strength(0.1))
      .force('y', d3.forceY(height / 2).strength(0.1));

    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .style('stroke', 'rgba(255, 255, 255, 0.2)')
      .style('stroke-width', 1.5);

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
      .attr('r', d => {
        if (d.isRoot) return 12;
        if (d.isCategory) return 10;
        return 8;
      })
      .style('fill', d => {
        if (d.isRoot) return 'rgba(255, 255, 255, 0.3)';
        if (d.isCategory) return 'rgba(100, 149, 237, 0.5)';  // Cornflower blue for categories
        switch (d.level?.toLowerCase()) {
          case 'beginner': return 'rgba(144, 238, 144, 0.7)';  // Light green
          case 'intermediate': return 'rgba(255, 215, 0, 0.7)';  // Gold
          case 'advanced': return 'rgba(255, 99, 71, 0.7)';  // Tomato
          case 'expert': return 'rgba(238, 130, 238, 0.7)';  // Violet
          default: return 'rgba(255, 255, 255, 0.3)';
        }
      })
      .style('stroke', 'rgba(255, 255, 255, 0.3)')
      .style('stroke-width', 1.5);

    // Add labels to nodes
    node.append('text')
      .text(d => d.name)
      .attr('x', 15)
      .attr('y', 5)
      .style('fill', 'white')
      .style('font-size', '12px');

    // Update positions on each tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }, [skills]);

  if (!skills || (Array.isArray(skills) && skills.length === 0) || (typeof skills === 'object' && Object.keys(skills).length === 0)) {
    return (
      <StyledPaper>
        <Typography variant="body1" color="text.secondary" align="center">
          No skills added yet. Click "Manage Skills" to add your skills.
        </Typography>
      </StyledPaper>
    );
  }

  return (
    <StyledPaper>
      <div style={{ width: '100%', height: '600px', backgroundColor: '#1a1a1a' }}>
        <svg ref={svgRef} style={{ width: '100%', height: '100%' }}></svg>
      </div>
    </StyledPaper>
  );
};

export default SkillsVisualization; 