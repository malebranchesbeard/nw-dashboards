"use client";

import React, { useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";
import candidatePositions from "../../data/candidates/positions/all_senior.json";
import CandidateStats from "./candidateStats";

const colorPalette = {
  "1A": "#fcfdbf", // Light cream
  "1B": "#fed5a4", // Light peach
  "1C": "#fdab8c", // Salmon
  "2A": "#fb8a7d", // Coral
  "2B": "#f26b74", // Pink-red
  "2C": "#e14c65", // Dark pink
  "3A": "#c72f64", // Magenta
  "3B": "#ab1c6d", // Purple-magenta
  "3C": "#8b116c", // Purple
  "4A": "#660d76", // Deep purple
  "4B": "#3f075e", // Dark purple
  "4C": "#200140", // Nearly black purple
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
      const candidate = candidatePositions[candidateId];
      const candidateName = `${candidate.firstName} ${candidate.lastName}`;
      const positions = candidate.positionHistory;

      positions.forEach((position, index) => {
        const startDate = new Date(
          position.startEndDate.start.year,
          position.startEndDate.start.month - 1
        );

        let endDate;
        if (position.startEndDate.end) {
          const nextPosition = positions[index + 1];
          if (nextPosition) {
            const nextStartDate = new Date(
              nextPosition.startEndDate.start.year,
              nextPosition.startEndDate.start.month - 1
            );
            const monthDiff =
              (nextStartDate.getFullYear() - position.startEndDate.end.year) *
                12 +
              (nextStartDate.getMonth() -
                (position.startEndDate.end.month - 1));

            if (monthDiff <= 1) {
              endDate = nextStartDate;
            } else {
              endDate = new Date(
                position.startEndDate.end.year,
                position.startEndDate.end.month - 1
              );
            }
          } else {
            endDate = new Date(
              position.startEndDate.end.year,
              position.startEndDate.end.month - 1
            );
          }
        } else {
          endDate = currentDate;
        }

        if (startDate < earliestDate) {
          earliestDate = startDate;
        }

        const seniorityCode = position.seniorityLevel?.substring(0, 2);

        data.push({
          candidateId,
          candidateName,
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

    // Reduce height per candidate from 32px to 28px
    const height = uniqueCandidates * 28;

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
      .domain(Array.from(new Set(chartData.data.map((d) => d.candidateName))))
      .range([0, height])
      .padding(0.05); // Reduced padding from 0.1 to 0.05

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
      .attr("y", (d) => y(d.candidateName))
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
            `Name: ${d.candidateName}<br/>
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
