import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import allCandidatesData from "../data/all_candidates_TRUTH.json";
import groupsData from "../data/groups_truth.json";

const CandidateCards = ({ searchTerm, priorityFilter, onCandidateSelect }) => {
  const [isClient, setIsClient] = React.useState(false);
  const [candidates, setCandidates] = React.useState([]);
  const [filteredCandidates, setFilteredCandidates] = React.useState([]);

  // Set isClient to true once component mounts
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (!isClient) return; // Only run on client-side

    const priorityMap = groupsData.reduce((acc, item) => {
      const normalizedUrl = item.linkedinUrl.replace("https://", "");
      acc[normalizedUrl] = item.group;
      return acc;
    }, {});

    const processedCandidates = Object.entries(allCandidatesData)
      .filter(([_, data]) => data.success && data.person)
      .map(([id, data]) => ({
        person: data.person,
        priority:
          priorityMap[data.person.linkedInUrl.replace("https://", "")] ||
          "Unknown",
      }));

    setCandidates(processedCandidates);
  }, [isClient]);

  React.useEffect(() => {
    if (!isClient) return; // Only run on client-side

    const filtered = candidates.filter((candidate) => {
      const fullName =
        `${candidate.person.firstName} ${candidate.person.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase());
      const matchesPriority =
        priorityFilter === "All" || candidate.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });

    setFilteredCandidates(filtered);
  }, [isClient, candidates, searchTerm, priorityFilter]);

  // Return empty div during server-side rendering
  if (!isClient) {
    return <div className="grid grid-cols-1 gap-2"></div>;
  }

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
                    ? "bg-blue-100 text-blue-800"
                    : candidate.priority === "P3"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {candidate.priority}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {candidate.person.positions?.positionHistory[0]?.title} at{" "}
              {candidate.person.positions?.positionHistory[0]?.companyName}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CandidateCards;
