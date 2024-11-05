"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import qualityTrackData from "../app/data/quality_track.json";
import { lighten } from "polished";
import { ArrowUp } from "lucide-react";

// Update this constant to include gradient colors for each category
const colorGradient = [
  { top: "rgba(254, 240, 217, 0.4)", bottom: "rgba(254, 240, 217, 0.837)" },
  { top: "rgba(252, 141, 89, 0.2)", bottom: "rgba(252, 141, 89, 0.6)" },
  { top: "rgba(227, 74, 51, 0.2)", bottom: "rgba(227, 74, 51, 0.6)" },
  { top: "rgba(122, 1, 119, 0.2)", bottom: "rgba(122, 1, 119, 0.6)" },
];

const RolesDiagram = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [displayedCategory, setDisplayedCategory] = useState(null);
  const [displayedSubcategory, setDisplayedSubcategory] = useState(null);

  // Adjusted data mapping based on the new data structure
  const categoryData = Object.entries(qualityTrackData).map(
    ([categoryKey, categoryValue], index) => {
      // Extract category name without the "Category X: " prefix and remove "Quality"
      const categoryName =
        categoryKey.split(": ")[1].replace("Quality ", "") || categoryKey;

      return {
        name: `${index + 1}. ${categoryName}`,
        subcategories: Object.entries(categoryValue).map(
          ([subKey, subValue]) => {
            // Extract subcategory label and name
            const [label, name] = subKey.split(": ");
            return {
              label: label.trim(),
              name: name.trim(),
              description: subValue.Definition,
              keyFactors: subValue["Key Factors"],
              examples: subValue.Examples,
            };
          }
        ),
      };
    }
  );

  const handleCategoryClick = (index) => {
    if (activeCategory === index) {
      setActiveCategory(null);
      setActiveSubcategory(null);
    } else {
      setActiveCategory(index);
      setActiveSubcategory(null);
    }
  };

  const handleSubcategoryClick = (categoryIndex, subIndex) => {
    setActiveCategory(categoryIndex);
    setActiveSubcategory(subIndex);
    setDisplayedCategory(categoryIndex);
    setDisplayedSubcategory(subIndex);
  };

  return (
    <Card className="w-full max-w-6xl mx-auto border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <h2 className="text-xl text-center font-semi-bold mb-4">
          Quality Roles Seniority Diagram
        </h2>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {categoryData.map((category, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Each of the main Category cards */}
              <div
                className="w-full h-[40px] flex items-end justify-center cursor-pointer hover:opacity-80 rounded-md overflow-hidden"
                style={{
                  backgroundColor: colorGradient[index]?.bottom || "#ccc",
                }}
                onClick={() => handleCategoryClick(index)}
              >
                <span className="text-black font-semibold text-center text-base p-2">
                  {category.name}
                </span>
              </div>
              {activeCategory === index && (
                <div className="mt-1 w-full">
                  {/* Each of the Subcategory buttons */}
                  {category.subcategories.map((subcategory, subIndex) => (
                    <div key={subIndex} className="mb-0">
                      <Button
                        variant="ghost"
                        className="justify-start w-full text-left h-auto py-1 px-0 transition-colors duration-200 overflow-hidden hover:bg-transparent"
                        onClick={() => handleSubcategoryClick(index, subIndex)}
                      >
                        <div
                          className="flex w-full items-stretch rounded-md transition-colors duration-200"
                          style={{
                            backgroundColor:
                              activeCategory === index &&
                              activeSubcategory === subIndex
                                ? colorGradient[index]?.top || "transparent"
                                : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              colorGradient[index]?.top || "transparent";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              activeCategory === index &&
                              activeSubcategory === subIndex
                                ? colorGradient[index]?.top || "transparent"
                                : "transparent";
                          }}
                        >
                          <div
                            className="font-semibold mr-2 flex-shrink-0 px-2 py-1 rounded-md flex items-center"
                            style={{
                              backgroundColor:
                                colorGradient[index]?.bottom || "#ccc",
                              color: "black",
                            }}
                          >
                            <span>{subcategory.label}</span>
                          </div>
                          <div
                            className="whitespace-normal break-words px-2 py-1 flex-grow"
                            style={{
                              backgroundColor: "transparent",
                            }}
                          >
                            {subcategory.name}
                          </div>
                        </div>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Update the bottom card to use displayedCategory and displayedSubcategory */}
        <div className="mt-4 p-4 bg-transparent border border-gray-200 rounded-md shadow-sm text-sm">
          {displayedCategory !== null && displayedSubcategory !== null ? (
            <>
              <div
                className="mb-4 rounded-md flex items-stretch overflow-hidden"
                style={{
                  backgroundColor:
                    colorGradient[displayedCategory]?.top || "transparent",
                }}
              >
                <div
                  className="font-semibold mr-2 flex-shrink-0 px-2 py-1 flex items-center"
                  style={{
                    backgroundColor:
                      colorGradient[displayedCategory]?.bottom || "#ccc",
                    color: "black",
                  }}
                >
                  <span>
                    {
                      categoryData[displayedCategory].subcategories[
                        displayedSubcategory
                      ].label
                    }
                  </span>
                </div>
                <div className="flex-grow flex items-center">
                  <h3 className="text-lg font-semibold px-2">
                    {
                      categoryData[displayedCategory].subcategories[
                        displayedSubcategory
                      ].name
                    }
                  </h3>
                </div>
              </div>
              <p className="mb-3">
                {
                  categoryData[displayedCategory].subcategories[
                    displayedSubcategory
                  ].description
                }
              </p>
              <h4 className="text-base font-semibold mb-1">Key Factors:</h4>
              <ul className="list-disc pl-5 mb-3">
                {categoryData[displayedCategory].subcategories[
                  displayedSubcategory
                ].keyFactors &&
                  Object.entries(
                    categoryData[displayedCategory].subcategories[
                      displayedSubcategory
                    ].keyFactors
                  ).map(([factor, description], index) => (
                    <li key={index} className="mb-1">
                      <span className="font-semibold">{factor}:</span>{" "}
                      {description}
                    </li>
                  ))}
              </ul>
              <h4 className="text-base font-semibold mb-1">
                Examples from current Dataset:
              </h4>
              <ul className="list-disc pl-5 mb-3">
                {categoryData[displayedCategory].subcategories[
                  displayedSubcategory
                ].examples &&
                  categoryData[displayedCategory].subcategories[
                    displayedSubcategory
                  ].examples.map((example, index) => (
                    <li key={index} className="mb-1">
                      {typeof example === "string" ? (
                        example
                      ) : (
                        <>
                          <span className="font-semibold">
                            {Object.keys(example)[0]}:
                          </span>{" "}
                          {Object.values(example)[0]}
                        </>
                      )}
                    </li>
                  ))}
              </ul>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-2 flex items-center justify-center">
                <ArrowUp className="mr-2" size={24} />
              </h3>
              <p className="text-center">
                Click on a category above to view its subcategories, then select
                a subcategory to see detailed information.
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RolesDiagram;
