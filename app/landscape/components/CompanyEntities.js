import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import outputData from "../data/output.json";
import companyData from "../data/companyData.json";
import seniorityData from "../data/seniorityData.json";
import { useState, useEffect } from "react";
import { SquareCheckBig } from "lucide-react";
import Masonry from "react-masonry-css";
import { Button } from "@/components/ui/button";
import {
  Check,
  CircleCheckBig,
  Circle,
  UserRoundSearch,
  Factory,
} from "lucide-react";

// Takes a single JSON of scraping JSONs grouped by company

const colorGradient = {
  "#FDCC8A": 1,
  "#e6a384": 2,
  "#ca3737": 3,
  "#891c87": 4,
  "#49006A": 5,
};

const seniorityColorClasses = {
  "#FDCC8A": "hover:bg-seniority-1",
  "#e6a384": "hover:bg-seniority-2",
  "#ca3737": "hover:bg-seniority-3",
  "#891c87": "hover:bg-seniority-4",
  "#49006A": "hover:bg-seniority-5",
};

const hexToRgb = (hex) => {
  // Remove the hash if it's there
  hex = hex.replace(/^#/, "");

  // Parse the hex values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `${r}, ${g}, ${b}`;
};

const CompanyEntities = ({ onCandidateSelect, selectedCandidate }) => {
  const [starredCandidates, setStarredCandidates] = useState(new Set());
  const [activeFilters, setActiveFilters] = useState({
    onlySaved: false,
    automotive: true,
    lifeSciences: true,
    plastics: true,
  });

  useEffect(() => {
    fetchStarredCandidates();
  }, []);

  const fetchStarredCandidates = async () => {
    const response = await fetch("/api/star");
    if (response.ok) {
      const data = await response.json();
      setStarredCandidates(new Set(data));
    }
  };

  const toggleStar = async (publicIdentifier) => {
    const isCurrentlyStarred = starredCandidates.has(publicIdentifier);
    const newStarredStatus = !isCurrentlyStarred;

    const response = await fetch("/api/star", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicIdentifier, isStarred: newStarredStatus }),
    });

    if (response.ok) {
      setStarredCandidates((prev) => {
        const newSet = new Set(prev);
        if (newStarredStatus) {
          newSet.add(publicIdentifier);
        } else {
          newSet.delete(publicIdentifier);
        }
        return newSet;
      });
    }
  };

  const normalizeString = (str) => {
    return str.toLowerCase().replace(/[^a-z0-9]/g, "");
  };

  const isCompanyMatch = (companyA, companyB) => {
    const normalizedA = normalizeString(companyA);
    const normalizedB = normalizeString(companyB);

    // Check if one string contains the other, or if they share a significant portion
    const minLength = Math.min(normalizedA.length, normalizedB.length);
    const matchThreshold = Math.min(5, Math.floor(minLength * 0.7)); // At least 5 chars or 70% of the shorter string

    return (
      normalizedA.includes(normalizedB) ||
      normalizedB.includes(normalizedA) ||
      normalizedA.substring(0, matchThreshold) ===
        normalizedB.substring(0, matchThreshold)
    );
  };

  const getCompanySeniorityData = (companyName) => {
    for (const [key, data] of Object.entries(seniorityData)) {
      if (isCompanyMatch(key, companyName)) {
        return data;
      }
    }
    return null;
  };

  const getSeniorityLevel = (candidate, companyName) => {
    const companySeniorityData = getCompanySeniorityData(companyName);
    if (companySeniorityData) {
      const seniorityInfo = companySeniorityData.find(
        (s) => s.publicIdentifier === candidate.person.publicIdentifier
      );
      if (seniorityInfo) {
        // Log found seniority info
        console.log(
          `Found seniority for ${candidate.person.firstName} ${candidate.person.lastName} at ${companyName}: ${seniorityInfo.seniority}`
        );
        return seniorityInfo.seniority;
      } else {
        // Log if no seniority info found for candidate
        console.log(
          `No seniority info found for ${candidate.person.firstName} ${candidate.person.lastName} at ${companyName}`
        );
      }
    } else {
      // Log if no seniority data for company
      console.log(`No seniority data for company ${companyName}`);
    }
    return "0A";
  };

  const compareSeniority = (a, b) => {
    const aNum = parseInt(a[0]) || 0;
    const bNum = parseInt(b[0]) || 0;
    if (aNum !== bNum) return bNum - aNum; // Higher number first
    return (a[1] || "A").localeCompare(b[1] || "A"); // 'C' before 'B' before 'A'
  };

  const isCurrentEmployee = (candidate, companyName) => {
    const latestPosition = candidate.person.positions.positionHistory[0];
    return (
      latestPosition && isCompanyMatch(latestPosition.companyName, companyName)
    );
  };

  const handleCardClick = (candidate) => {
    if (
      selectedCandidate &&
      selectedCandidate.person.publicIdentifier ===
        candidate.person.publicIdentifier
    ) {
      onCandidateSelect(null); // Deselect if clicking the same candidate
    } else {
      onCandidateSelect(candidate);
    }
  };

  const CandidateCard = ({ candidate, companyName }) => {
    const isCurrent = isCurrentEmployee(candidate, companyName);
    const seniorityColor = getSeniorityColor(candidate, companyName);
    const isSelected =
      selectedCandidate &&
      selectedCandidate.person.publicIdentifier ===
        candidate.person.publicIdentifier;
    const isStarred = starredCandidates.has(candidate.person.publicIdentifier);

    return (
      <Card
        className={`p-0 w-full cursor-pointer ${
          isSelected ? "bg-blue-50" : "hover:bg-[#4213581d]"
        }`}
        style={{
          borderColor: `rgba(${hexToRgb(seniorityColor)}, ${
            isSelected ? "1" : "0.6"
          })`,
          borderWidth: isSelected ? "1.5px" : "0.25px",
          borderStyle: "solid",
          boxShadow:
            isCurrent || isSelected
              ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
              : "none",
        }}
        onClick={() => handleCardClick(candidate)}
      >
        <CardContent
          className={`py-2 px-2 relative ${
            seniorityColorClasses[seniorityColor] || ""
          }`}
        >
          <div
            className={`absolute top-1 left-1 w-3 h-3 rounded-full`}
            style={{
              backgroundColor: seniorityColor,
              opacity: isCurrent ? 1 : 0.5,
            }}
          ></div>
          <SquareCheckBig
            className={`absolute top-1 right-1 w-3 h-3 cursor-pointer ${
              isStarred ? "text-blue-400" : "text-gray-100"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleStar(candidate.person.publicIdentifier);
            }}
          />
          <p
            className={`text-sm ${
              isCurrent ? "text-gray-900" : "text-gray-400 hover:text-gray-900"
            } pl-4 pr-6`}
          >
            {candidate.person.positions.positionHistory[0].title}
          </p>
        </CardContent>
      </Card>
    );
  };

  const CompanyInfoCard = ({ company }) => {
    const matchedCompany = companyData.companies.find((c) =>
      isCompanyMatch(c.name, company)
    );

    if (!matchedCompany) return null;

    return (
      <div className="mb-2">
        <p className="font-semibold px-2 py-1 m-0 bg-[#2b3a80] text-white w-full rounded-t-md">
          • {matchedCompany.name}
        </p>
        <div className="p-2 bg-[#4213580e]">
          <p className="text-sm">{matchedCompany.description}</p>
          <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
            <p>
              <span className="font-semibold">Employees:</span>{" "}
              {matchedCompany.employees.toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Revenue:</span>{" "}
              {matchedCompany.revenue}
            </p>
            <p>
              <span className="font-semibold">Plants:</span>{" "}
              {matchedCompany.manufacturingPlants}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const getSeniorityColor = (candidate, companyName) => {
    const seniority = getSeniorityLevel(candidate, companyName);
    const seniorityLevel = parseInt(seniority[0]);
    const colorEntry = Object.entries(colorGradient).find(
      ([_, level]) => level === seniorityLevel
    );
    return colorEntry ? colorEntry[0] : "#FFFFFF";
  };

  const sortCandidates = (candidates, companyName) => {
    return candidates.sort((a, b) => {
      const aIsStarred = starredCandidates.has(a.person.publicIdentifier)
        ? 1
        : 0;
      const bIsStarred = starredCandidates.has(b.person.publicIdentifier)
        ? 1
        : 0;

      if (aIsStarred !== bIsStarred) {
        return bIsStarred - aIsStarred; // Starred first
      }

      const aIsNotCurrent = isCurrentEmployee(a, companyName) ? 0 : 1;
      const bIsNotCurrent = isCurrentEmployee(b, companyName) ? 0 : 1;

      if (aIsNotCurrent !== bIsNotCurrent) {
        return aIsNotCurrent - bIsNotCurrent; // Current before not current
      }

      const aSeniority = getSeniorityLevel(a, companyName);
      const bSeniority = getSeniorityLevel(b, companyName);

      const seniorityComparison = compareSeniority(aSeniority, bSeniority);
      if (seniorityComparison !== 0) return seniorityComparison;

      // If all else is equal, maintain original order
      return 0;
    });
  };

  const handleBackgroundClick = (e) => {
    // Check if the click target is the main container or the space between cards
    if (
      e.target === e.currentTarget ||
      e.target.classList.contains("company-card-container")
    ) {
      onCandidateSelect(null);
    }
  };

  const toggleFilter = (filterName) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const FilterButton = ({ filterName, label }) => (
    <Button
      onClick={() => toggleFilter(filterName)}
      className="flex items-center text-white gap-2 bg-[#483e68] hover:text-white hover:bg-[#655e7a]"
      variant="outline"
    >
      {activeFilters[filterName] ? (
        <CircleCheckBig className="w-4 h-4 text-white" />
      ) : (
        <Circle className="w-4 h-4 text-white opacity-50 group-hover:opacity-100" />
      )}
      <span>{label}</span>
    </Button>
  );

  // Modify findMatchingCandidates to filter starred candidates if needed
  const findMatchingCandidates = (companyName) => {
    for (const [key, candidates] of Object.entries(outputData)) {
      if (isCompanyMatch(key, companyName)) {
        if (activeFilters.onlySaved) {
          return candidates.filter((candidate) =>
            starredCandidates.has(candidate.person.publicIdentifier)
          );
        }
        return candidates;
      }
    }
    return [];
  };

  // New function to sort companies by candidate count
  const sortCompaniesByCandidateCount = (companies) => {
    return companies.sort((a, b) => {
      const aCandidates = findMatchingCandidates(a.name);
      const bCandidates = findMatchingCandidates(b.name);
      return bCandidates.length - aCandidates.length;
    });
  };

  // Sort companies before rendering
  const sortedCompanies = sortCompaniesByCandidateCount(companyData.companies);

  const breakpointColumnsObj = {
    default: 2,
    1100: 2,
    700: 1,
  };

  const distributeCandidates = (candidates) => {
    const column1 = [];
    const column2 = [];
    candidates.forEach((candidate, index) => {
      if (index % 2 === 0) {
        column1.push(candidate);
      } else {
        column2.push(candidate);
      }
    });
    return [column1, column2];
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-transparent">
        <div className="bg-transparent pb-4 relative">
          {/* Icons and Filter Buttons */}
          <div className="flex justify-between items-center mb-1 px-1">
            <UserRoundSearch className="w-6 h-6 text-[#402f76]" />
            <Factory className="w-6 h-6 text-[#402f76]" />
          </div>
          <div className="flex justify-between items-center mb-2">
            {/* Filter Buttons */}
            <FilterButton
              filterName="onlySaved"
              label="Only saved candidates"
            />
            <div className="flex gap-0.5">
              <FilterButton filterName="automotive" label="Automotive" />
              <FilterButton filterName="lifeSciences" label="Life Sciences" />
              <FilterButton filterName="plastics" label="Plastics" />
            </div>
          </div>
          {/* Gradient Overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 h-4 pointer-events-none z-10"
            style={{
              background: `linear-gradient(to bottom, rgba(255,255,255,1), rgba(246, 15, 15, 0))`,
            }}
          ></div>
        </div>
      </div>

      {/* Scrolling Content Area */}
      <div
        className="flex-grow overflow-y-auto"
        onClick={handleBackgroundClick}
      >
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {sortedCompanies.map((company) => {
            const candidates = findMatchingCandidates(company.name);
            const sortedCandidates = sortCandidates(candidates, company.name);

            // Log the company and ordered candidates with their seniority levels
            console.log(`Company: ${company.name}`);
            sortedCandidates.forEach((candidate, index) => {
              const seniority = getSeniorityLevel(candidate, company.name);
              const isStarred = starredCandidates.has(
                candidate.person.publicIdentifier
              )
                ? "Starred"
                : "Not Starred";
              const isCurrent = isCurrentEmployee(candidate, company.name)
                ? "Current"
                : "Not Current";
              console.log(
                `  ${index + 1}. ${candidate.person.firstName} ${
                  candidate.person.lastName
                } - Seniority: ${seniority}, ${isStarred}, ${isCurrent}`
              );
            });

            const [column1Candidates, column2Candidates] =
              distributeCandidates(sortedCandidates);
            return (
              <div key={company.name} className="mb-4">
                <Card className="overflow-hidden shadow-md border border-[#42135860]">
                  <CardContent className="p-0">
                    <CompanyInfoCard company={company.name} />
                    {sortedCandidates.length > 0 ? (
                      <div className="flex gap-2 p-1">
                        <div className="w-1/2 flex flex-col gap-2">
                          {column1Candidates.map((candidate, index) => (
                            <CandidateCard
                              key={`candidate-${index * 2}`}
                              candidate={candidate}
                              companyName={company.name}
                            />
                          ))}
                        </div>
                        <div className="w-1/2 flex flex-col gap-2">
                          {column2Candidates.map((candidate, index) => (
                            <CandidateCard
                              key={`candidate-${index * 2 + 1}`}
                              candidate={candidate}
                              companyName={company.name}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 p-2">
                        No candidates found for this company.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </Masonry>
      </div>
    </div>
  );
};

export default CompanyEntities;
