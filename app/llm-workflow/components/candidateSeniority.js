"use client";

import React, { useState, useMemo } from "react";
import candidatePositions from "../../data/candidates/positions/all_senior.json";

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

const CandidateSeniority = ({ candidateId }) => {
  const candidate = candidatePositions[candidateId];

  // Calculate the total career span and position durations
  const careerData = useMemo(() => {
    const positions = candidate.positionHistory;
    const careerStart = new Date(
      positions[positions.length - 1].startEndDate.start.year,
      positions[positions.length - 1].startEndDate.start.month - 1
    );
    const careerEnd = positions[0].startEndDate.end
      ? new Date(
          positions[0].startEndDate.end.year,
          positions[0].startEndDate.end.month - 1
        )
      : new Date(); // Use current date if the last position doesn't have an end date

    // Process position data
    const positionData = positions.map((position) => {
      const start = new Date(
        position.startEndDate.start.year,
        position.startEndDate.start.month - 1
      );
      const end = position.startEndDate.end
        ? new Date(
            position.startEndDate.end.year,
            position.startEndDate.end.month - 1
          )
        : new Date();
      const duration = end - start; // Duration in milliseconds

      return {
        ...position,
        start,
        end,
        duration,
      };
    });

    // Calculate total duration
    const totalDuration = positionData.reduce(
      (sum, position) => sum + position.duration,
      0
    );

    // Calculate percentages instead of fractions
    const gridTemplateColumns = positionData
      .map((position) => {
        const percentage = (position.duration / totalDuration) * 100;
        // Handle cases where duration might be zero
        const adjustedPercentage = percentage || 1; // Assign a minimal value if zero
        return `${adjustedPercentage}%`;
      })
      .join(" ");

    // Calculate position widths
    let currentWidth = 0;
    const positionWidths = {};
    positionData.forEach((position) => {
      const startWidth = currentWidth;
      const widthPercentage = (position.duration / totalDuration) * 100;
      currentWidth += widthPercentage;
      positionWidths[position.positionCode] = {
        positionCode: position.positionCode,
        startWidth: startWidth,
        endWidth: currentWidth,
      };
    });

    return {
      careerStart,
      careerEnd,
      totalDuration,
      positions: positionData,
      gridTemplateColumns,
      positionWidths,
    };
  }, [candidate]);

  const renderTimeline = () => {
    return (
      <div
        className="grid w-full"
        style={{ gridTemplateColumns: careerData.gridTemplateColumns }}
      >
        {careerData.positions.map((position) => {
          const seniorityCode = position.seniorityLevel?.substring(0, 2);
          const swatchColor = colorPalette[seniorityCode] || "#CCCCCC";

          return (
            <div
              key={position.positionCode}
              className="border-r last:border-r-0 min-w-0 flex flex-col"
            >
              <div className="flex-grow">
                <div
                  className="text-xs font-semibold truncate p-1"
                  title={position.title}
                >
                  {position.title}
                </div>
                <div
                  className="text-xs truncate p-1"
                  title={position.companyName}
                >
                  {position.companyName}
                </div>
                <div className="text-xs text-gray-500 p-1">
                  {`${position.startEndDate.start.month}/${
                    position.startEndDate.start.year
                  } - ${
                    position.startEndDate.end
                      ? `${position.startEndDate.end.month}/${position.startEndDate.end.year}`
                      : "Present"
                  }`}
                </div>
              </div>
              <div
                className="h-6 w-full relative"
                style={{ backgroundColor: swatchColor }}
                title={position.seniorityLevel}
              >
                {seniorityCode && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                    {seniorityCode}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderExplanations = () => {
    return (
      <div
        className="grid w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${careerData.positions.length}, 1fr)`,
        }}
      >
        {careerData.positions.map((position, index) => (
          <div
            key={`${position.positionCode}-explanation`}
            className="border-r last:border-r-0 p-2 overflow-auto flex flex-col"
          >
            <div className="text-xs font-bold mb-1">Position {index + 1}</div>
            <div className="text-xs flex-grow">
              {position.seniorityExplanation || "No explanation available"}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderArrows = () => {
    return (
      <div className="relative w-full h-12">
        <svg className="absolute top-0 left-0 w-full h-full">
          {careerData.positions.map((position, index) => {
            const startWidth =
              careerData.positionWidths[position.positionCode].startWidth;
            const endWidth =
              careerData.positionWidths[position.positionCode].endWidth;
            const centerX = (startWidth + endWidth) / 2;
            const equalWidth = 100 / careerData.positions.length;
            const equalCenterX = (index + 0.5) * equalWidth;

            return (
              <g key={`arrow-${position.positionCode}`}>
                <line
                  x1={`${centerX}%`}
                  y1="0%"
                  x2={`${equalCenterX}%`}
                  y2="100%"
                  stroke="#4B5563" // Tailwind gray-600
                  strokeWidth="0.2"
                />

                <circle
                  cx={`${equalCenterX}%`}
                  cy="100%"
                  r="1.5"
                  fill="#697584" // Tailwind gray-400
                />
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-shrink-0 shadow-md rounded-md border border-gray-200">
        {renderTimeline()}
      </div>

      <div className="">{renderArrows()}</div>

      <div className="flex-grow shadow-md rounded-md border border-gray-200 overflow-hidden">
        {renderExplanations()}
      </div>
    </div>
  );
};

export default CandidateSeniority;
