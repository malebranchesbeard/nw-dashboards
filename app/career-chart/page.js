"use client";

import React from "react";
import { BarChart, XAxis, YAxis, Tooltip, Customized } from "recharts";
import careerTrackData from "../data/career_track.json";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SHOW_CANDIDATE_NAMES = false; // Set this to false to hide real names

const levelOrder = [
  "Entry Level",
  "Mid Level",
  "Senior",
  "Manager",
  "Senior Manager",
  "Director",
  "Executive",
];

const colorGradient = [
  "#FEF0D9",
  "#FDCC8A",
  "#FC8D59",
  "#E34A33",
  "#B30000",
  "#7A0177",
  "#49006A",
];

const colorMap = Object.fromEntries(
  levelOrder.map((level, index) => [level, colorGradient[index]])
);

const CareerProgressionGanttChart = () => {
  const [chartData, setChartData] = React.useState([]);
  const [xAxisDomain, setXAxisDomain] = React.useState([1990, 2025]);
  const [chartWidth, setChartWidth] = React.useState(1000);

  React.useEffect(() => {
    const processedData = Object.entries(careerTrackData).map(
      ([name, career], index) => {
        const displayName = SHOW_CANDIDATE_NAMES
          ? name
          : `Candidate ${index + 1}`;
        const levels = career.map((job) => ({
          level: job.level,
          start: parseInt(job.dates.split("-")[0]),
          end: job.dates.includes("Present")
            ? new Date().getFullYear()
            : parseInt(job.dates.split("-")[1]),
          role: job.role,
          company: job.company,
        }));
        return { name: displayName, levels };
      }
    );
    setChartData(processedData);

    // Calculate xAxisDomain based on the earliest start and latest end dates
    const allDates = processedData.flatMap((person) =>
      person.levels.flatMap((level) => [level.start, level.end])
    );
    const minYear = Math.min(...allDates);
    const maxYear = Math.max(...allDates);
    setXAxisDomain([minYear, maxYear]); // Remove the +1 from maxYear

    const updateWidth = () => {
      const newWidth = Math.max(1000, window.innerWidth - 40);
      setChartWidth(newWidth);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const CustomizedBars = ({ xAxisMap, yAxisMap, data }) => {
    const xAxis = xAxisMap[Object.keys(xAxisMap)[0]];
    const yAxis = yAxisMap[Object.keys(yAxisMap)[0]];
    const xScale = xAxis.scale;
    const yScale = yAxis.scale;

    return (
      <g>
        {data.map((entry, index) => {
          const y = yScale(entry.name);
          const barHeight = yScale.bandwidth ? yScale.bandwidth() : 20;

          return (
            <g key={`person-${index}`}>
              {entry.levels.map((level, idx) => {
                const x = xScale(level.start);
                const width = xScale(level.end) - xScale(level.start);
                return (
                  <rect
                    key={`bar-${index}-${idx}`}
                    x={x}
                    y={y}
                    width={width}
                    height={barHeight}
                    fill={colorMap[level.level]}
                  />
                );
              })}
            </g>
          );
        })}
      </g>
    );
  };

  const LegendKey = () => (
    <div
      className="flex flex-wrap justify-center mt-4 gap-4" // Added gap-4 for spacing
      style={{ width: chartWidth }}
    >
      {levelOrder.map((level) => (
        <div key={level} className="flex items-center">
          <div
            className="w-4 h-4 mr-2"
            style={{ backgroundColor: colorMap[level] }}
          ></div>
          <span>{level}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full p-4">
      <BarChart
        width={chartWidth}
        height={600} // Increase the height to accommodate all names
        data={chartData}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }} // Reverted to original left margin
      >
        <XAxis
          type="number"
          domain={xAxisDomain}
          tickCount={8}
          tickFormatter={(value) => value.toString()}
          allowDataOverflow={true}
          padding={{ left: 0, right: 0 }} // Add this line
        />
        <YAxis
          dataKey="name"
          type="category"
          width={120} // Reverted to original width
          tickFormatter={(value) =>
            value.length > 15 ? `${value.substring(0, 15)}...` : value
          } // Reverted to original truncation
          interval={0} // This ensures all labels are shown
          style={{
            fontSize: "14px", // Reverted to original font size
          }}
        />
        <Tooltip
          formatter={(value, name, props) => {
            const { payload } = props;
            return [
              `${payload.level}: ${payload.start}-${payload.end}`,
              payload.level,
            ];
          }}
        />
        <Customized component={CustomizedBars} />
      </BarChart>
      <LegendKey />
    </div>
  );
};

export default function CareerChartPage() {
  return (
    <div className="container min-h-screen bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Career Progression Gantt Chart</h2>
        <Button asChild variant="default">
          <Link href="/">Home</Link>
        </Button>
      </div>
      <CareerProgressionGanttChart />
    </div>
  );
}
