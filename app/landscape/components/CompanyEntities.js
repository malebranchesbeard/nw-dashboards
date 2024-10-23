import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import outputData from "../data/output.json";
import companyData from "../data/companyData.json";
import { useState } from "react";

//takes a single json of scrapin jsons grouped by company

const CompanyEntities = ({ onCandidateSelect }) => {
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

  const CandidateCard = ({ candidate, isCurrent }) => (
    <Card
      className={`p-0 w-full cursor-pointer hover:bg-red-50 ${
        isCurrent
          ? "border-red-700 border-opacity-20 shadow-md shadow-gray-200"
          : "border-gray-200 shadow-sm"
      }`}
      onClick={() => onCandidateSelect(candidate)}
    >
      <CardContent className="py-2 px-2">
        <p
          className={`text-sm ${isCurrent ? "text-gray-900" : "text-gray-600"}`}
        >
          {candidate.person.positions.positionHistory[0].title}
        </p>
      </CardContent>
    </Card>
  );

  const CompanyInfoCard = ({ company }) => {
    const matchedCompany = companyData.companies.find((c) =>
      isCompanyMatch(c.name, company)
    );

    if (!matchedCompany) return null;

    return (
      <Card className="mb-2 bg-red-800 bg-opacity-15 border border-red-200 shadow-md">
        <CardContent className="py-1 px-1">
          <p className="font-semibold text-red-900 px-1 py-1 rounded-xl">
            •{matchedCompany.name}
          </p>
          <p className="text-sm pl-2">{matchedCompany.description}</p>
          <div className="grid pl-2 grid-cols-2 gap-2 mt-2 text-xs">
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
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-4 columns-1 md:columns-2 lg:columns-2 gap-6 space-y-6">
      {Object.entries(outputData).map(([company, candidates]) => {
        const { currentEmployees, otherCandidates } = filterCandidates(
          candidates,
          company
        );

        return (
          <div key={company} className="break-inside-avoid">
            <Card className="mb-0 border-0 pt-1 px-0 shadow-md">
              <CardContent className="px-1 pb-1">
                <CompanyInfoCard company={company} />
                <div className="columns-2 gap-2 space-y-2">
                  {currentEmployees.map((candidate, index) => (
                    <div
                      key={`current-${index}`}
                      className="break-inside-avoid"
                    >
                      <CandidateCard candidate={candidate} isCurrent={true} />
                    </div>
                  ))}
                  {otherCandidates.map((candidate, index) => (
                    <div key={`other-${index}`} className="break-inside-avoid">
                      <CandidateCard candidate={candidate} isCurrent={false} />
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
