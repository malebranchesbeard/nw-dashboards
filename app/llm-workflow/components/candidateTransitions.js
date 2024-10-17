"use client";

import React, { useState, useMemo } from "react";
import candidatePositions from "../../data/candidates/positions/all_senior.json";
import transitionsData from "../../data/transitions_no_cats.json";

const CandidateTransitions = ({ candidateId }) => {
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
          return (
            <div
              key={position.positionCode}
              className="border-r last:border-r-0 min-w-0"
            >
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

              {position.transStartList.length > 0 && (
                <div className="text-xs text-green-600 p-1">
                  Start: {position.transStartList.join(", ")}
                </div>
              )}
              {position.transEndList.length > 0 && (
                <div className="text-xs text-red-600 p-1">
                  End: {position.transEndList.join(", ")}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderTransitions = () => {
    // Get list of transitions from transitions_no_cats
    const allTransitionCodes = transitionsData.transitions.map((t) => t.code);

    // Create a mapping from transition code to level
    const transitionCodeToLevel = {};
    allTransitionCodes.forEach((code, index) => {
      transitionCodeToLevel[code] = index;
    });

    // Create an object to store transitions with their start and end positions
    const groupedTransitions = allTransitionCodes.reduce((acc, code) => {
      acc[code] = [];
      return acc;
    }, {});

    // Iterate over positions to find starts and ends for each transition
    careerData.positions.forEach((position) => {
      position.transStartList.forEach((code) => {
        if (allTransitionCodes.includes(code)) {
          groupedTransitions[code].push({
            start: position.positionCode,
            end: null,
          });
        }
      });

      position.transEndList.forEach((code) => {
        if (allTransitionCodes.includes(code)) {
          const existingTransition = groupedTransitions[code].find(
            (t) => t.end === null
          );
          if (existingTransition) {
            existingTransition.end = position.positionCode;
          }
        }
      });
    });

    // Filter out transitions with no start or end
    Object.keys(groupedTransitions).forEach((code) => {
      groupedTransitions[code] = groupedTransitions[code].filter(
        (t) => t.start && t.end
      );
    });

    // Collect all transitions into a flat list with assigned levels
    const allTransitions = [];

    Object.entries(groupedTransitions).forEach(([code, transitions]) => {
      transitions.forEach((t) => {
        const transition = transitionsData.transitions.find(
          (trans) => trans.code === code
        );

        const startWidth = careerData.positionWidths[t.start]?.startWidth || 0;
        const endWidth =
          careerData.positionWidths[t.end]?.endWidth ||
          careerData.positionWidths[t.start]?.endWidth ||
          0;

        allTransitions.push({
          code,
          transition,
          startWidth,
          endWidth,
          t,
          level: transitionCodeToLevel[code], // Assign level based on transition code
        });
      });
    });

    // Determine the maximum level to set container height
    const maxLevel = Math.max(...allTransitions.map((trans) => trans.level));

    return (
      <div
        className="w-full mt-2 relative"
        style={{ minHeight: `${(maxLevel + 1) * 30}px` }}
      >
        {allTransitions.map((trans, index) => (
          <div
            key={`${trans.code}-${index}`}
            className="transition-item mb-2 h-8 relative"
            style={{
              position: "absolute",
              left: `${trans.startWidth}%`,
              width: `${trans.endWidth - trans.startWidth}%`,
              top: `${trans.level * 30}px`,
            }}
          >
            {/* individual lozenges */}
            <div className="absolute inset-0 bg-cyan-700 rounded-md mt-0.5 mb-0.5 ml-0.5 transition-opacity duration-300 opacity-20 hover:opacity-50"></div>
            <div
              className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-800 truncate px-2"
              title={`${trans.transition?.name || trans.code}: ${
                trans.transition?.explanation || ""
              }`}
            >
              {trans.transition?.name || trans.code}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-shrink-0 shadow-md rounded-md border border-gray-200">
        {renderTimeline()}
      </div>
      <div className="flex-grow overflow-y-auto">{renderTransitions()}</div>
      {/* Hover information card */}
    </div>
  );
};

export default CandidateTransitions;
