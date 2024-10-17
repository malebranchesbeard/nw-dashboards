"use client";

import React, { useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";
import candidatePositions from "../../data/candidates/positions/all_senior.json";
import CandidateStats from "./candidateStats";

const colorPalette = {
  "1A": "#eed4a4",
  "1B": "#f4d682",
  "1C": "#f4c773",
  "2A": "#e79972",
  "2B": "#e9835e",
  "2C": "#e2663d",
  "3A": "#b03d56",
  "3B": "#b42a41",
  "3C": "#931937",
  "4A": "#8f4f9c",
  "4B": "#6c1b7e",
  "4C": "#3c044a",
};

const VisualisationComponent = () => {
  const svgRef = useRef();
  const containerRef = useRef();

  const chartData = useMemo(() => {
    const currentDate = new Date();
    let earliestDate = new Date();
    const candidates = Object.keys(candidatePositions);
    const data = [];

    candidates.forEach((candidateId) => {
      const positions = candidatePositions[candidateId].positionHistory;
      positions.forEach((position) => {
        const startDate = new Date(
          position.startEndDate.start.year,
          position.startEndDate.start.month - 1
        );
        const endDate = position.startEndDate.end
          ? new Date(
              position.startEndDate.end.year,
              position.startEndDate.end.month - 1
            )
          : currentDate;

        if (startDate < earliestDate) {
          earliestDate = startDate;
        }

        const seniorityCode = position.seniorityLevel?.substring(0, 2);

        data.push({
          candidateId,
          seniorityCode,
          startDate,
          endDate,
        });
      });
    });

    // Subtract 3 months from the earliest date
    earliestDate.setMonth(earliestDate.getMonth() - 3);

    return { data, earliestDate, currentDate };
  }, []);

  useEffect(() => {
    if (!chartData.data.length) return;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const margin = { top: 20, right: 50, bottom: 30, left: 180 };
    const width = containerWidth - margin.left - margin.right;

    // Calculate the number of unique candidates
    const uniqueCandidates = new Set(chartData.data.map((d) => d.candidateId))
      .size;

    // Set the height based on the number of candidates, with each taking up 70px
    const height = uniqueCandidates * 32;

    // Update the container height
    containerRef.current.style.height = `${
      height + margin.top + margin.bottom
    }px`;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Calculate the extended start date for the x-axis
    const extendedStartDate = new Date(chartData.earliestDate);
    extendedStartDate.setMonth(extendedStartDate.getMonth() - 3);

    const x = d3
      .scaleTime()
      .domain([extendedStartDate, chartData.currentDate])
      .range([0, width]);

    const y = d3
      .scaleBand()
      .domain(Array.from(new Set(chartData.data.map((d) => d.candidateId))))
      .range([0, height])
      .padding(0.1); // Increased padding for better separation

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll("rect")
      .data(chartData.data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.startDate))
      .attr("y", (d) => y(d.candidateId))
      .attr("width", (d) => x(d.endDate) - x(d.startDate))
      .attr("height", y.bandwidth())
      .attr("fill", (d) => colorPalette[d.seniorityCode] || "#cccccc");

    // Add tooltips
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

    svg
      .selectAll("rect")
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `Candidate: ${d.candidateId}<br/>
             Seniority: ${d.seniorityCode}<br/>
             Start: ${d.startDate.toDateString()}<br/>
             End: ${d.endDate.toDateString()}`
          )
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });
  }, [chartData]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default VisualisationComponent;
