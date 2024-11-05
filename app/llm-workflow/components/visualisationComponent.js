"use client";

import React, { useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";
import candidatePositions from "../../data/candidates/positions/all_senior.json";
import secondRoundSeniority from "../data/2nd_round_seniority.json";
import CandidateStats from "./candidateStats";
import groupsTruth from "../data/groups_truth.json";

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

    // Process both data sources
    const allCandidates = {
      ...candidatePositions,
      ...Object.fromEntries(
        Object.entries(secondRoundSeniority).map(([id, candidate]) => [
          id,
          {
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            positionHistory: candidate.positionAndTransitionHistory.map(
              (position) => ({
                ...position,
                startEndDate: position.startEndDate,
                seniorityLevel:
                  position.seniorityLevel?.split(":")[0]?.trim() ||
                  position.seniorityLevel,
              })
            ),
          },
        ])
      ),
    };

    const candidates = Object.keys(allCandidates);
    const data = [];

    // Create a map of public identifiers to groups
    const groupMap = Object.fromEntries(
      groupsTruth.map(({ linkedinUrl, group }) => {
        // Extract the identifier from after "/in/" in the URL
        const publicIdentifier = linkedinUrl.split("/in/")[1];
        return [publicIdentifier, group];
      })
    );

    console.log("Group Mappings:");
    Object.entries(groupMap).forEach(([id, group]) => {
      console.log(`${id} -> ${group}`);
    });

    console.log("\nCandidate IDs:");
    candidates.forEach((id) => {
      console.log(`${id} -> ${groupMap[id] || "Not Found"}`);
    });

    candidates.forEach((candidateId) => {
      const candidate = allCandidates[candidateId];
      const candidateName = `${candidate.firstName} ${candidate.lastName}`
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");

      // Match using the candidateId directly since it's the same as the public identifier
      const group = groupMap[candidateId] || "N/A";

      const positions =
        candidate.positionHistory || candidate.positionAndTransitionHistory;

      if (!positions) {
        console.warn(`No position history found for candidate ${candidateId}`);
        return;
      }

      positions.forEach((position, index) => {
        if (!position.seniorityLevel || position.seniorityLevel === "N/A") {
          return;
        }

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
          group,
        });
      });
    });

    earliestDate.setMonth(earliestDate.getMonth() - 3);
    return { data, earliestDate, currentDate };
  }, []);

  useEffect(() => {
    if (!chartData.data.length) return;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const margin = { top: 20, right: 50, bottom: 30, left: 200 };
    const width = containerWidth - margin.left - margin.right;

    const uniqueCandidates = new Set(chartData.data.map((d) => d.candidateName))
      .size;
    const height = uniqueCandidates * 23;

    containerRef.current.style.height = `${
      height + margin.top + margin.bottom
    }px`;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    // Add a clipping path
    svg
      .append("defs")
      .append("clipPath")
      .attr("id", "chart-area")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    // Create the main group with clipping
    const mainGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("clip-path", "url(#chart-area)");

    const startDate = new Date(1995, 0, 1);
    const x = d3
      .scaleTime()
      .domain([startDate, chartData.currentDate])
      .range([0, width]);

    const y = d3
      .scaleBand()
      .domain(Array.from(new Set(chartData.data.map((d) => d.candidateName))))
      .range([0, height])
      .padding(0.05);

    mainGroup
      .selectAll("rect")
      .data(chartData.data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.startDate))
      .attr("y", (d) => y(d.candidateName))
      .attr("width", (d) => x(d.endDate) - x(d.startDate))
      .attr("height", y.bandwidth())
      .attr("fill", (d) => colorPalette[d.seniorityCode] || "#cccccc");

    // Remove any existing axes
    mainGroup.selectAll(".y-axis").remove();
    svg.selectAll(".y-axis").remove();

    // Create y axis group
    const yAxisGroup = svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add the axis with simple labels
    yAxisGroup
      .call(d3.axisLeft(y))
      .selectAll("text")
      .html((d) => {
        const candidateData = chartData.data.find(
          (item) => item.candidateName === d
        );
        const group = candidateData?.group || "N/A";
        return `${d} ${group}`;
      })
      .style("font-size", "12px")
      .style("font-family", "sans-serif")
      .style("fill", "black");

    mainGroup
      .selectAll(".row-background")
      .data(y.domain())
      .enter()
      .append("rect")
      .attr("class", "row-background")
      .attr("x", 0)
      .attr("y", (d) => y(d))
      .attr("width", width)
      .attr("height", y.bandwidth())
      .attr("fill", (d, i) => (i % 2 === 0 ? "#f8f9fa" : "#ffffff"))
      .attr("opacity", 0.5);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("box-shadow", "2px 2px 6px rgba(0,0,0,0.1)")
      .style("font-size", "12px");

    mainGroup
      .selectAll("rect.timeline-bar")
      .data(chartData.data)
      .enter()
      .append("rect")
      .attr("class", "timeline-bar")
      .attr("x", (d) => x(d.startDate))
      .attr("y", (d) => y(d.candidateName))
      .attr("width", (d) => x(d.endDate) - x(d.startDate))
      .attr("height", y.bandwidth())
      .attr("fill", (d) => colorPalette[d.seniorityCode] || "#cccccc")
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `
            <strong>${d.candidateName}</strong><br/>
            <span style="color: #666;">Seniority Level:</span> ${
              d.seniorityCode
            }<br/>
            <span style="color: #666;">Period:</span> ${d.startDate.toLocaleDateString()} - ${d.endDate.toLocaleDateString()}
          `
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // Keep axes outside the clipped group
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${height + margin.top})`)
      .call(d3.axisBottom(x));
  }, [chartData]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default VisualisationComponent;
