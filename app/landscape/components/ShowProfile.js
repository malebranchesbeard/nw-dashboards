import React from "react";
import { Linkedin, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const InfoCard = ({ children }) => (
  <div className="bg-[#4213580e] mt-2 text-[#320d44] p-4 rounded-lg shadow-md flex items-center">
    <Info className="w-5 h-5 mr-3 flex-shrink-0" />
    <p className="text-sm text-center w-full">{children}</p>
  </div>
);

const formatDate = (date) => {
  if (!date) return "";
  return `${date.month}/${date.year}`;
};

const ShowProfile = ({ selectedCandidate }) => {
  if (!selectedCandidate) {
    return (
      <Card className="h-full flex flex-col justify-start pt-8">
        <CardContent className="mx-auto max-w-xs">
          <InfoCard>
            Select a candidate to view a position history and a link to their
            LinkedIn profile.
          </InfoCard>
          <InfoCard>Scroll down to see more companies.</InfoCard>
          <InfoCard>
            Within companies, candidates are ordered by seniority.
          </InfoCard>
          <InfoCard>
            Greyed-out candidates no longer work there, but once held relevant
            positions.
          </InfoCard>
        </CardContent>
      </Card>
    );
  }

  const { person } = selectedCandidate;

  return (
    <div className="h-full p-1 flex flex-col border border-blue-100 bg-blue-200 bg-opacity-10 rounded-lg shadow-md">
      <div className="m-1 p-2 flex justify-between items-center bg-white rounded-xl border border-blue-100 shadow-md">
        <h2 className="text-lg font-semibold text-blue-900">
          •{`${person.firstName} ${person.lastName}`}
        </h2>
        <a
          href={person.linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-[#1c5dd4] text-white px-3 py-1 border border-[#aad4eed7] rounded-full hover:bg-[#3276f6] transition-colors"
        >
          <Linkedin className="w-4 h-4 mr-1" />
          <span className="text-sm">LinkedIn</span>
        </a>
      </div>
      <div className="flex-grow overflow-y-auto p-1">
        <p className="text-sm pl-2 rounded-lg bg-white text-gray-600 mb-2 italic">
          {person.location}
        </p>

        {person.positions.positionHistory.map((position, index) => (
          <div key={index} className="mb-1 p-2 bg-white rounded-lg shadow-sm">
            <p className="text-sm font-semibold text-blue-900">
              {position.title}
            </p>
            <p className="text-sm text-gray-800 p-1">•{position.companyName}</p>
            <p className="text-xs text-gray-500 italic">
              {formatDate(position.startEndDate?.start)} -{" "}
              {position.startEndDate?.end
                ? formatDate(position.startEndDate.end)
                : "Present"}
            </p>
            <p className="text-sm text-gray-600">{position.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowProfile;
