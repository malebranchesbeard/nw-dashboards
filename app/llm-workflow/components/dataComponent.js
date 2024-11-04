import React from "react";
import positions from "../../data/candidates/positions/all_senior.json";
import seniorityFramework from "../../data/quality_track.json";
import transitionFramework from "../../data/transitions.json";
import { Database } from "lucide-react"; // Import the specific icon you want
import { Linkedin } from "lucide-react";

const DataComponent = ({ candidateId }) => {
  const candidate = positions[candidateId] || [];
  const candidateName =
    candidate.firstName && candidate.lastName
      ? `${candidate.firstName} ${candidate.lastName}`
      : candidateId;

  return (
    <div className="grid grid-cols-3 gap-4 h-full overflow-auto">
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">
          <Linkedin className="inline-block pb-1" /> {candidateName}'s Positions
        </h3>
        <pre className="whitespace-pre-wrap text-sm">
          {JSON.stringify(candidate, null, 2)}
        </pre>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">
          <Database className="inline-block pb-1" /> Transition Framework
        </h3>
        <pre className="whitespace-pre-wrap text-sm">
          {JSON.stringify(transitionFramework, null, 2)}
        </pre>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">
          <Database className="inline-block pb-1" /> Seniority Framework
        </h3>

        <pre className="whitespace-pre-wrap text-sm">
          {JSON.stringify(seniorityFramework, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DataComponent;
