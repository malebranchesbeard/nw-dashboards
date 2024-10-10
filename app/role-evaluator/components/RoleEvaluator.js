import React, { useState, useEffect } from "react";
import chroma from "chroma-js";
import candidatesData from "../../data/processed_candidates_with_seniority.json";
import qualityCareerCategories from "../../data/quality_career_categories.json";
import SubcategoryDetailsModal from "./SubcategoryDetailsModal";
import { CandidatesContext } from "../contexts/CandidatesContext";

const RoleEvaluator = () => {
  const [activeCandidate, setActiveCandidate] = useState(null);
  const [activeRole, setActiveRole] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [tempCategory, setTempCategory] = useState("");
  const [tempSubcategory, setTempSubcategory] = useState("");
  const [candidates, setCandidates] = useState(candidatesData);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [highlightedSubcategory, setHighlightedSubcategory] = useState(null);

  // Use the provided colorGradient
  const colorGradient = [
    "#FEF0D9",
    "#FDCC8A",
    "#FC8D59",
    "#E34A33",
    "#B30000",
    "#7A0177",
    "#49006A",
  ];

  // Generate 20 colors
  const totalColors = 20;
  const colorScale = chroma
    .scale(colorGradient)
    .mode("lab")
    .colors(totalColors);

  // Map colors to categories and subcategories
  const categoryColors = {};

  for (let i = 0; i < 5; i++) {
    const categoryNumber = (i + 1).toString(); // Categories 1 to 5
    categoryColors[categoryNumber] = {};
    for (let j = 0; j < 4; j++) {
      const subcategoryLetter = String.fromCharCode(65 + j); // Subcategories 'A' to 'D'
      const colorIndex = i * 4 + j; // Indices 0 to 19
      categoryColors[categoryNumber][subcategoryLetter] =
        colorScale[colorIndex];
    }
  }

  // Add this function at the beginning of your component
  const ensureSeniorityLabel = (candidates) => {
    return candidates.map((candidate) => ({
      ...candidate,
      experience: candidate.experience.map((role) => {
        if (!role.seniority_label && role.seniority_level) {
          const parsed = parseSeniorityLevel(role.seniority_level);
          return {
            ...role,
            seniority_label: parsed.seniority_label,
            seniority_level: parsed.seniority_level,
          };
        }
        return role;
      }),
    }));
  };

  useEffect(() => {
    // Parse the categories from the qualityCareerCategories data
    const parsedCategories = Object.entries(qualityCareerCategories).map(
      ([categoryKey, categoryValue]) => {
        const categoryName = categoryKey;
        const subcategoriesObj = categoryValue[Object.keys(categoryValue)[0]];
        const parsedSubcategories = Object.entries(subcategoriesObj).map(
          ([subKey, subValue]) => {
            const subcategoryLabel = subKey;
            const subcategoryName = Object.keys(subValue)[0];
            return {
              key: subcategoryLabel,
              label: subcategoryLabel,
              name: subcategoryName,
            };
          }
        );
        return {
          key: categoryKey,
          name: categoryName,
          subcategories: parsedSubcategories,
        };
      }
    );
    setCategories(parsedCategories);
  }, []);

  useEffect(() => {
    if (tempCategory) {
      const category = categories.find((cat) => cat.key === tempCategory);
      setSubcategories(category ? category.subcategories : []);
      setTempSubcategory("");
    } else {
      setSubcategories([]);
      setTempSubcategory("");
    }
  }, [tempCategory, categories]);

  // In your useEffect or where you set the initial candidates state
  useEffect(() => {
    const updatedCandidates = ensureSeniorityLabel(candidatesData);
    setCandidates(updatedCandidates);
  }, []);

  const handleCandidateClick = (index) => {
    if (activeCandidate === index) {
      setActiveCandidate(null);
      setActiveRole(null);
    } else {
      setActiveCandidate(index);
      setActiveRole(null);
    }
  };

  const handleRoleClick = (roleIndex) => {
    setActiveRole(roleIndex);
  };

  const handleCategoryChange = (e) => {
    setTempCategory(e.target.value);
  };

  const handleSubcategoryChange = (e) => {
    setTempSubcategory(e.target.value);
  };

  const handleSetSeniority = () => {
    const categoryKey = tempCategory;
    const subcategoryKey = tempSubcategory;
    const categoryData = qualityCareerCategories[categoryKey];
    if (categoryData) {
      const categoryName = Object.keys(categoryData)[0];
      const subcategoriesData = categoryData[categoryName];
      const subcategoryData = subcategoriesData[subcategoryKey];
      if (subcategoryData) {
        const seniorityLevelName = Object.keys(subcategoryData)[0];
        // Update the role's data immutably
        const updatedCandidates = [...candidates];
        const candidate = { ...updatedCandidates[activeCandidate] };
        const updatedRole = { ...candidate.experience[activeRole] };

        updatedRole.seniority_level = seniorityLevelName;
        updatedRole.seniority_label = subcategoryKey; // e.g., "4A", "2C"
        updatedRole.category = categoryKey;
        updatedRole.subcategory = subcategoryKey;

        // Update the candidate's experience array
        const updatedExperience = [...candidate.experience];
        updatedExperience[activeRole] = updatedRole;
        candidate.experience = updatedExperience;

        // Update the candidate in the candidates array
        updatedCandidates[activeCandidate] = candidate;

        setCandidates(updatedCandidates);
        // Reset temp variables
        setTempCategory("");
        setTempSubcategory("");
      }
    }
  };

  const parseSeniorityLevel = (seniorityLevelStr) => {
    const regex = /Category (\d+): (\w+) - (.+)/;
    const match = seniorityLevelStr.match(regex);
    if (match) {
      return {
        seniority_label: match[2],
        seniority_level: match[3],
      };
    }
    return {
      seniority_label: "",
      seniority_level: seniorityLevelStr,
    };
  };

  const getLevelColor = (role) => {
    let categoryNumber = null;
    let subcategoryLetter = null;

    if (role.seniority_label) {
      categoryNumber = role.seniority_label.charAt(0);
      subcategoryLetter = role.seniority_label.charAt(1);
    } else if (role.seniority_level) {
      const regex = /Category (\d+): (\d+)([A-Z]) - /;
      const match = role.seniority_level.match(regex);
      if (match) {
        categoryNumber = match[1];
        subcategoryLetter = match[3]; // Extract the subcategoryLetter
      }
    }

    if (
      categoryNumber &&
      subcategoryLetter &&
      categoryColors[categoryNumber] &&
      categoryColors[categoryNumber][subcategoryLetter]
    ) {
      return categoryColors[categoryNumber][subcategoryLetter];
    }

    // If subcategoryLetter is missing, default to the first subcategory
    if (
      categoryNumber &&
      categoryColors[categoryNumber] &&
      categoryColors[categoryNumber]["A"]
    ) {
      return categoryColors[categoryNumber]["A"];
    }

    return "#ccc"; // Default color if no match
  };

  const handleSubcategoryClick = (category, subcategory) => {
    const categoryData = qualityCareerCategories[category.name];
    if (categoryData) {
      const subcategoriesData = categoryData[Object.keys(categoryData)[0]];
      const subcategoryData = subcategoriesData[subcategory.key];
      if (subcategoryData) {
        setSelectedSubcategory({
          category: {
            ...category,
          },
          subcategory: {
            ...subcategory,
            ...subcategoryData,
          },
        });
        // Set the highlighted subcategory
        setHighlightedSubcategory(`${category.key}-${subcategory.key}`);
      } else {
        console.error("Subcategory data not found");
      }
    } else {
      console.error("Category data not found");
    }
  };

  const handleHideSubcategoryDetails = () => {
    setSelectedSubcategory(null);
    // Clear the highlighted subcategory when closing the modal
    setHighlightedSubcategory(null);
  };

  return (
    <div className="flex space-x-4 h-[80vh] relative">
      <CandidatesContext.Provider value={{ candidates, setCandidates }}>
        <SubcategoryDetailsModal
          selectedSubcategory={selectedSubcategory}
          onClose={handleHideSubcategoryDetails}
        />
        <div className="flex-1 p-4 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="flex h-full">
            <div className="w-1/2 border-r border-gray-200 pr-2 overflow-y-auto">
              {candidates.map((candidate, index) => (
                <div
                  key={index}
                  className="mb-2 p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => handleCandidateClick(index)}
                  style={{
                    backgroundColor: activeCandidate === index ? "#e2e8f0" : "",
                  }}
                >
                  {candidate.name}
                </div>
              ))}
            </div>
            <div className="w-1/2 pl-2 overflow-y-auto">
              {activeCandidate !== null && (
                <div className="mt-1 w-full">
                  {candidates[activeCandidate].experience.map(
                    (role, roleIndex) => (
                      <div key={roleIndex} className="mb-2 flex">
                        {/* Fixed width color swatch on the left */}
                        <div
                          className="w-4 flex-shrink-0"
                          style={{
                            backgroundColor: getLevelColor(role),
                          }}
                        ></div>
                        <div className="flex-grow flex flex-col">
                          <div
                            className="p-2 rounded-md cursor-pointer transition-colors duration-200"
                            onClick={() => handleRoleClick(roleIndex)}
                            style={{
                              backgroundColor:
                                activeRole === roleIndex
                                  ? "#edf2f7"
                                  : "transparent",
                            }}
                          >
                            <div className="font-semibold">{role.title}</div>
                            <div className="text-sm text-gray-600">
                              {role.company}
                            </div>
                            <div className="text-sm text-gray-500">
                              {role.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 p-4 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col">
          {activeCandidate !== null && activeRole !== null && (
            <>
              <div className="flex-grow overflow-y-auto mb-4">
                <h2 className="text-xl font-semibold mb-2">
                  {candidates[activeCandidate].experience[activeRole].title}
                </h2>
                <p className="text-gray-600 mb-2">
                  {candidates[activeCandidate].experience[activeRole].company}
                </p>
                <p className="text-gray-500 mb-4">
                  {candidates[activeCandidate].experience[activeRole].duration}
                </p>
                <p className="mb-4">
                  {
                    candidates[activeCandidate].experience[activeRole]
                      .description
                  }
                </p>
                {candidates[activeCandidate].experience[activeRole]
                  .location && (
                  <p className="text-gray-600 mb-2">
                    <strong>Location:</strong>{" "}
                    {
                      candidates[activeCandidate].experience[activeRole]
                        .location
                    }
                  </p>
                )}
                {/* Display Seniority Level */}
                {(() => {
                  const role =
                    candidates[activeCandidate].experience[activeRole];
                  let seniorityLabel = role.seniority_label;
                  let seniorityLevelName = role.seniority_level;

                  if (!seniorityLabel && seniorityLevelName) {
                    const parsed = parseSeniorityLevel(seniorityLevelName);
                    seniorityLabel = parsed.seniority_label;
                    seniorityLevelName = parsed.seniority_level;
                  }

                  if (seniorityLevelName) {
                    return (
                      <p className="text-gray-800 mb-2">
                        <strong>Current Seniority Level:</strong>{" "}
                        {seniorityLabel ? `${seniorityLabel} - ` : ""}
                        {seniorityLevelName}
                      </p>
                    );
                  }
                  return null;
                })()}
              </div>
              <div className="bg-gray-100 p-4 rounded-md">
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <select
                      className="w-full p-2 border rounded"
                      value={tempCategory}
                      onChange={handleCategoryChange}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category.key}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <select
                      className="w-full p-2 border rounded"
                      value={tempSubcategory}
                      onChange={handleSubcategoryChange}
                      disabled={!tempCategory}
                    >
                      <option value="">Select Subcategory</option>
                      {subcategories.map((subcategory, index) => (
                        <option key={index} value={subcategory.key}>
                          {subcategory.label} - {subcategory.name}
                        </option>
                      ))}
                    </select>
                    <button
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      onClick={handleSetSeniority}
                      disabled={!tempCategory || !tempSubcategory}
                    >
                      SET
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </CandidatesContext.Provider>
      <div className="flex-1 p-1 bg-gray-100 rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="h-full flex flex-col">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex-1 mb-1 bg-gray-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="h-full grid grid-cols-2 gap-1 p-1">
                {category.subcategories.map((subcategory, subIndex) => (
                  <button
                    key={subIndex}
                    className={`flex items-stretch rounded-md transition-colors duration-200 shadow-sm border border-gray-300 overflow-hidden ${
                      highlightedSubcategory ===
                      `${category.key}-${subcategory.key}`
                        ? "ring-2 ring-blue-500"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() =>
                      handleSubcategoryClick(category, subcategory)
                    }
                  >
                    <div
                      className="w-1/5 flex-shrink-0 flex items-center justify-center"
                      style={{
                        backgroundColor:
                          categoryColors[category.key.charAt(9)][
                            subcategory.label.charAt(1)
                          ],
                      }}
                    >
                      <span className="text-white font-bold text-lg">
                        {subcategory.label}
                      </span>
                    </div>
                    <span className="text-xs p-1 flex-grow flex items-center">
                      {subcategory.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleEvaluator;
