import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import outputData from "../data/output.json";
import companyData from "../data/companyData.json";
import seniorityData from "../data/seniorityData.json";
import { useState, useEffect } from "react";
import { SquareCheckBig } from "lucide-react";

//takes a single json of scrapin jsons grouped by company

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
    return (
      normalizedA.includes(normalizedB) || normalizedB.includes(normalizedA)
    );
  };

  const filterCandidates = (candidates, companyName) => {
    const currentEmployees = [];
    const otherCandidates = [];

    candidates.forEach((candidate) => {
      const latestPosition = candidate.person.positions.positionHistory[0];
      if (
        latestPosition &&
        isCompanyMatch(latestPosition.companyName, companyName)
      ) {
        currentEmployees.push(candidate);
      } else {
        otherCandidates.push(candidate);
      }
    });

    return { currentEmployees, otherCandidates };
  };

  const getSeniorityColor = (candidate, companyName) => {
    const seniorityInfo = seniorityData[companyName]?.find(
      (s) => s.publicIdentifier === candidate.person.publicIdentifier
    );
    if (seniorityInfo && seniorityInfo.seniority) {
      const seniorityLevel = parseInt(seniorityInfo.seniority[0]);
      const colorEntry = Object.entries(colorGradient).find(
        ([_, level]) => level === seniorityLevel
      );
      return colorEntry ? colorEntry[0] : "#FFFFFF";
    }
    return "#FFFFFF";
  };

  const isCurrentEmployee = (candidate, companyName) => {
    const latestPosition = candidate.person.positions.positionHistory[0];
    return (
      latestPosition && isCompanyMatch(latestPosition.companyName, companyName)
    );
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
        onClick={() => onCandidateSelect(candidate)}
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

  const sortCandidates = (candidates, companyName) => {
    return candidates.sort((a, b) => {
      // First, prioritize starred candidates
      const aIsStarred = starredCandidates.has(a.person.publicIdentifier);
      const bIsStarred = starredCandidates.has(b.person.publicIdentifier);

      if (aIsStarred !== bIsStarred) {
        return aIsStarred ? -1 : 1;
      }

      // If both are starred or both are not starred, use the existing sorting logic
      const aIsCurrent = isCurrentEmployee(a, companyName);
      const bIsCurrent = isCurrentEmployee(b, companyName);

      if (aIsCurrent !== bIsCurrent) {
        return aIsCurrent ? -1 : 1;
      }

      const aSeniority = getSeniorityLevel(a, companyName);
      const bSeniority = getSeniorityLevel(b, companyName);

      return compareSeniority(bSeniority, aSeniority);
    });
  };

  const getSeniorityLevel = (candidate, companyName) => {
    const seniorityInfo = seniorityData[companyName]?.find(
      (s) => s.publicIdentifier === candidate.person.publicIdentifier
    );
    return seniorityInfo && seniorityInfo.seniority
      ? seniorityInfo.seniority
      : "0A";
  };

  const compareSeniority = (a, b) => {
    const aNum = parseInt(a[0]) || 0;
    const bNum = parseInt(b[0]) || 0;
    if (aNum !== bNum) return aNum - bNum;
    return (a[1] || "A").localeCompare(b[1] || "A");
  };

  return (
    <div className="p-4 columns-1 md:columns-2 lg:columns-2 gap-6 space-y-6">
      {Object.entries(outputData).map(([company, candidates]) => {
        const sortedCandidates = sortCandidates(candidates, company);
        return (
          <div key={company} className="break-inside-avoid">
            <Card className="overflow-hidden shadow-md border border-[#42135860]">
              <CardContent className="p-0">
                <CompanyInfoCard company={company} />
                <div className="columns-2 gap-2 space-y-2 px-1 pb-1">
                  {sortedCandidates.map((candidate, index) => (
                    <div
                      key={`candidate-${index}`}
                      className="break-inside-avoid"
                    >
                      <CandidateCard
                        candidate={candidate}
                        companyName={company}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default CompanyEntities;
