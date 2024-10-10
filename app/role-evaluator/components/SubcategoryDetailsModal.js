import React from "react";
import { useContext } from "react";
import { CandidatesContext } from "../contexts/CandidatesContext";
import { Button } from "@/components/ui/button";

const SubcategoryDetailsModal = ({ selectedSubcategory, onClose }) => {
  const { candidates } = useContext(CandidatesContext);

  if (!selectedSubcategory) return null;

  const { category, subcategory } = selectedSubcategory;
  const subcategoryName = subcategory.name;
  const subcategoryDetails = subcategory[subcategoryName];

  // Filter positions that match the current subcategory
  const matchingPositions = candidates.flatMap((candidate) =>
    candidate.experience
      .filter((role) => {
        if (role.seniority_label) {
          return role.seniority_label === subcategory.label;
        } else if (role.seniority_level) {
          const parsed = parseSeniorityLevel(role.seniority_level);
          return parsed.seniority_label === subcategory.label;
        }
        return false;
      })
      .map((role) => ({
        ...role,
        candidateName: candidate.name,
      }))
  );

  return (
    <div className="absolute inset-0 flex z-10">
      <div className="w-2/3 bg-white rounded-lg shadow-lg border border-gray-200 p-4 overflow-y-auto flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {category.name} - {subcategory.label}: {subcategoryName}
          </h2>
          <Button
            onClick={onClose}
            variant="default"
            size="sm"
            className="ml-auto"
          >
            Close
          </Button>
        </div>
        {subcategoryDetails ? (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Definition</h3>
              <p>{subcategoryDetails.Definition}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Factors</h3>
              <ul className="list-disc pl-5">
                {Object.entries(subcategoryDetails["Key Factors"] || {}).map(
                  ([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  )
                )}
              </ul>
            </div>
          </>
        ) : (
          <p>No additional details available.</p>
        )}

        {/* Updated section for matching positions */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-2">
            Matching Positions ({subcategory.label})
          </h3>
          {matchingPositions.length > 0 ? (
            <ul className="space-y-2">
              {matchingPositions.map((position, index) => (
                <li key={index} className="bg-gray-100 p-2 rounded">
                  <div className="font-medium">{position.title}</div>
                  <div className="text-sm text-gray-600">
                    {position.company}
                  </div>
                  <div className="text-sm text-gray-500">
                    Candidate: {position.candidateName}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No matching positions found for {subcategory.label}.</p>
          )}
        </div>
      </div>
      <div className="w-1/3"></div>
    </div>
  );
};

export default SubcategoryDetailsModal;
