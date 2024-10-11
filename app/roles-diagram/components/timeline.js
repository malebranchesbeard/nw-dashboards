"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import qualityTrackData from "../../data/quality_track.json";
import transitionsData from "../../data/transitions.json";

// Update this constant to include gradient colors for each category
const colorGradient = [
  { top: "rgba(254, 240, 217, 0.4)", bottom: "rgba(254, 240, 217, 0.837)" },
  { top: "rgba(252, 141, 89, 0.2)", bottom: "rgba(252, 141, 89, 0.6)" },
  { top: "rgba(227, 74, 51, 0.2)", bottom: "rgba(227, 74, 51, 0.6)" },
  { top: "rgba(122, 1, 119, 0.2)", bottom: "rgba(122, 1, 119, 0.6)" },
];

// Add this JSON object for title overrides
const subcategoryTitleOverrides = {
  "Entry-Level Quality Engineers": "Entry-Level",
  "Mid-Level Quality Professionals": "Mid-Level",
  "Senior Quality Professionals": "Senior",
  "First-Line Quality Supervisors": "First-Line",
  "Mid-Level Quality Supervisors": "Mid-Level",
  "Senior Quality Supervisors": "Senior",
  "Quality Managers": "Managers",
  "Senior Quality Managers": "Sr. Managers",
  "Quality Directors": "Directors",
  "Global Quality Leaders": "Global",
  "Executive Directors of Quality": "Executive",
  "Chief Quality Officers (CQO)": "CQO",
};

const Timeline = () => {
  const [hoveredTransition, setHoveredTransition] = useState(null);

  // Process the data similar to RolesDiagram
  const categoryData = Object.entries(qualityTrackData).map(
    ([categoryKey, categoryValue], categoryIndex) => {
      const categoryName =
        categoryKey.split(": ")[1].replace("Quality ", "") || categoryKey;

      return {
        name: `${categoryIndex + 1}. ${categoryName}`,
        subcategories: Object.entries(categoryValue).map(
          ([subKey, subValue]) => {
            const [label, name] = subKey.split(": ");
            // Use the override title if available, otherwise use the original name
            const overrideTitle =
              subcategoryTitleOverrides[name.trim()] || name.trim();
            return {
              label: label.trim(),
              name: overrideTitle,
              categoryIndex,
            };
          }
        ),
      };
    }
  );

  // Flatten the subcategories array
  const subcategories = categoryData.flatMap(
    (category) => category.subcategories
  );

  // Add this new constant for the main categories
  const mainCategories = [
    "Professional",
    "Supervisory",
    "Managerial",
    "Executive",
  ];

  // Function to calculate the width and left position for each transition
  const calculateTransitionStyle = (from, to) => {
    const positions = [
      "1A",
      "1B",
      "1C",
      "2A",
      "2B",
      "2C",
      "3A",
      "3B",
      "3C",
      "4A",
      "4B",
      "4C",
    ];
    const fromIndex = positions.indexOf(from);
    const toIndex = positions.indexOf(to);
    const width = ((toIndex - fromIndex + 1) / positions.length) * 100;
    const left = (fromIndex / positions.length) * 100;
    return { width: `${width}%`, left: `${left}%` };
  };

  // Update this function to check if a subcategory is included in the hovered transition
  const isSubcategoryHighlighted = (label) => {
    if (!hoveredTransition) return false;
    return (
      hoveredTransition.from.startsWith(label) ||
      hoveredTransition.to.startsWith(label)
    );
  };

  return (
    <Card className="w-full max-w-6xl mx-auto border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <h2 className="text-xl text-center font-semi-bold mb-4">
          Timeline — Quality Roles
        </h2>
        <div className="flex flex-col">
          {/* New top-level category row */}
          <div className="flex justify-between mb-2">
            {mainCategories.map((category, index) => (
              <div
                key={index}
                className="flex-1 text-center font-bold"
                style={{
                  backgroundColor: colorGradient[index]?.top || "#ccc",
                  padding: "0.5rem",
                }}
              >
                {category}
              </div>
            ))}
          </div>

          {/* Category and subcategory layers */}
          <div className="flex justify-between timeline-container relative">
            {subcategories.map((subcategory, index) => (
              <div
                key={index}
                className="timeline-subcategory flex flex-col items-center"
                style={{
                  flex: "1 0 8.33%",
                }}
              >
                <div
                  className="timeline-subcategory-header"
                  style={{
                    backgroundColor:
                      colorGradient[subcategory.categoryIndex]?.bottom ||
                      "#ccc",
                    width: "100%",
                    textAlign: "center",
                    padding: "0.5rem",
                  }}
                >
                  <span>{subcategory.label}</span>
                </div>
                <div className="timeline-subcategory-name mt-2">
                  <span>{subcategory.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Transitions */}
          <div className="mt-8 relative">
            {/* Fixed description card */}
            <Card className="absolute top-0 right-0 w-64 z-10 bg-white shadow-lg">
              <CardContent className="p-4">
                {hoveredTransition ? (
                  <>
                    <h3 className="font-bold mb-2">{hoveredTransition.name}</h3>
                    <p className="text-sm mb-2">
                      {hoveredTransition.from} → {hoveredTransition.to}
                    </p>
                    <p className="text-sm">{hoveredTransition.explanation}</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    Hover over a transition to see details
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="relative">
              {transitionsData.transitions.map((transition, index) => (
                <div
                  key={index}
                  className="transition-item mb-2 h-8 relative"
                  style={calculateTransitionStyle(
                    transition.from,
                    transition.to
                  )}
                  onMouseEnter={() => setHoveredTransition(transition)}
                  onMouseLeave={() => setHoveredTransition(null)}
                >
                  <div
                    className={`absolute inset-0 bg-blue-400 rounded transition-opacity duration-300 ${
                      hoveredTransition === transition
                        ? "opacity-75"
                        : "opacity-50"
                    }`}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-800 truncate px-2">
                    {transition.name}
                  </div>
                  <div className="absolute top-0 right-full mr-1 text-xs font-medium text-gray-600 whitespace-nowrap">
                    {transition.from} → {transition.to}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Timeline;
