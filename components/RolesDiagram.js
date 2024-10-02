"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import qualityCareerCategories from "../app/data/quality_career_categories.json";
import { lighten } from "polished";
import { ArrowUp } from "lucide-react";

// Update this constant to include gradient colors for each category
const colorGradient = [
  { top: "rgba(254, 240, 217, 0.4)", bottom: "rgba(254, 240, 217, 0.6)" },
  { top: "rgba(252, 141, 89, 0.2)", bottom: "rgba(252, 141, 89, 0.6)" },
  { top: "rgba(227, 74, 51, 0.2)", bottom: "rgba(227, 74, 51, 0.6)" },
  { top: "rgba(122, 1, 119, 0.2)", bottom: "rgba(122, 1, 119, 0.6)" },
  { top: "rgba(73, 0, 106, 0.2)", bottom: "rgba(73, 0, 106, 0.6)" },
];

const RolesDiagram = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [displayedCategory, setDisplayedCategory] = useState(null);
  const [displayedSubcategory, setDisplayedSubcategory] = useState(null);

  const categoryData = Object.entries(qualityCareerCategories).map(
    ([key, value], index) => ({
      name: `${index + 1}. ${Object.keys(value)[0].replace("Quality ", "")}`,
      subcategories: Object.entries(Object.values(value)[0]).map(
        ([subKey, subValue]) => {
          const subcategoryData = Object.values(subValue)[0];
          return {
            label: subKey,
            name: Object.keys(subValue)[0],
            description: subcategoryData.Definition,
            keyFactors: subcategoryData["Key Factors"],
            examples: subcategoryData.Examples,
          };
        }
      ),
    })
  );

  const handleCategoryClick = (index) => {
    if (activeCategory === index) {
      setActiveCategory(null);
      setActiveSubcategory(null);
    } else {
      setActiveCategory(index);
      setActiveSubcategory(null); // Reset activeSubcategory when changing categories
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
          Seniority Level Hierarchy — Quality Roles
        </h2>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {categoryData.map((category, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Each of the main Category cards */}
              <div
                className="w-full h-[40px] flex items-end justify-center cursor-pointer hover:opacity-80 rounded-md overflow-hidden"
                style={{ backgroundColor: colorGradient[index].bottom }}
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
                                ? colorGradient[index].top
                                : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              colorGradient[index].top;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              activeCategory === index &&
                              activeSubcategory === subIndex
                                ? colorGradient[index].top
                                : "transparent";
                          }}
                        >
                          <div
                            className="font-semibold mr-2 flex-shrink-0 px-2 py-1 rounded-md flex items-center"
                            style={{
                              backgroundColor: colorGradient[index].bottom,
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
                  backgroundColor: colorGradient[displayedCategory].top,
                }}
              >
                <div
                  className="font-semibold mr-2 flex-shrink-0 px-2 py-1 flex items-center"
                  style={{
                    backgroundColor: colorGradient[displayedCategory].bottom,
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
                {Object.entries(
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
                {Object.entries(
                  categoryData[displayedCategory].subcategories[
                    displayedSubcategory
                  ].examples
                ).map(([role, description], index) => (
                  <li key={index} className="mb-1">
                    <span className="font-semibold">{role}:</span> {description}
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
