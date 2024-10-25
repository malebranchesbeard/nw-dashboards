import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import outputData from "../data/output.json";

const CandidateCards = ({ searchTerm, priorityFilter, onCandidateSelect }) => {
  const allCandidates = Object.values(outputData).flat();

  const filteredCandidates = allCandidates.filter((candidate) => {
    const fullName =
      `${candidate.person.firstName} ${candidate.person.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesPriority =
      priorityFilter === "All" || candidate.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="grid grid-cols-1 gap-2">
      {filteredCandidates.map((candidate, index) => (
        <Card
          key={index}
          className="hover:bg-gray-100 transition-colors cursor-pointer border-gray-200"
          onClick={() => onCandidateSelect(candidate)}
        >
          <CardContent className="p-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-sm text-[#1E2A5C]">{`${candidate.person.firstName} ${candidate.person.lastName}`}</h3>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  candidate.priority === "P1"
                    ? "bg-blue-100 text-blue-800"
                    : candidate.priority === "P2"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {candidate.priority}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {candidate.person.positions.positionHistory[0].title} at{" "}
              {candidate.person.positions.positionHistory[0].companyName}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CandidateCards;
