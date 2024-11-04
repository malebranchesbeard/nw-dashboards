"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import candidatePositions from "../data/candidates/positions/all_senior.json";
import { Badge } from "@/components/ui/badge";

// Import your components here
import CandidateTransitions from "./components/candidateTransitions";
import CandidateSeniority from "./components/candidateSeniority";
import DataComponent from "./components/dataComponent";
import VisualisationComponent from "./components/visualisationComponent";
import CandidateStats from "./components/candidateStats";

export default function LLMWorkflowPage() {
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [candidateOptions, setCandidateOptions] = useState([]);
  const [activeComponent, setActiveComponent] = useState("data");

  const components = {
    data: DataComponent,
    transitions: CandidateTransitions,
    seniority: CandidateSeniority,
    visualisation: () => (
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-[1200px] mt-6 mb-2">
          <VisualisationComponent />
        </div>
        <div className="w-[80%] max-w-[1200px]">
          <CandidateStats />
        </div>
      </div>
    ),
  };

  useEffect(() => {
    if (typeof candidatePositions === "object" && candidatePositions !== null) {
      const options = Object.entries(candidatePositions).map(([id, data]) => ({
        id,
        name: `${data.firstName} ${data.lastName}`,
      }));
      setCandidateOptions(options);
      if (options.length > 0) {
        setSelectedCandidate(options[0].id);
      }
    } else {
      console.error(
        "candidatePositions is not a valid object:",
        candidatePositions
      );
    }
  }, []);

  const ActiveComponent = components[activeComponent];

  const showBadges = activeComponent !== "data";

  return (
    <div className="w-screen h-screen max-w-full bg-white p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <Button asChild variant="default">
          <Link href="/">Home</Link>
        </Button>
      </div>
      <h2 className="flex justify-center text-xl text-gray-800 mb-3">
        LLM Workflow
      </h2>
      <div className="flex justify-center items-center space-x-2 mb-6">
        {Object.keys(components).map((component, index) => (
          <React.Fragment key={component}>
            <Button
              className="shadow-md"
              onClick={() => setActiveComponent(component)}
              variant={activeComponent === component ? "default" : "outline"}
            >
              {component.charAt(0).toUpperCase() + component.slice(1)}
            </Button>
            {index < Object.keys(components).length - 1 && (
              <span className="text-gray-800">→</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-center items-center space-x-4 mb-4">
        <Select value={selectedCandidate} onValueChange={setSelectedCandidate}>
          <SelectTrigger className="w-[180px] shadow-md">
            <SelectValue placeholder="Select candidate" />
          </SelectTrigger>
          <SelectContent>
            {candidateOptions.map((candidate) => (
              <SelectItem key={candidate.id} value={candidate.id}>
                {candidate.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showBadges && (
          <>
            <Badge variant="secondary">
              <span className="font-semibold mr-2">Model used:</span>{" "}
              <span className="font-normal"> o1-preview</span>
            </Badge>
            <Badge variant="secondary">
              <span className="font-semibold mr-2">Evaluation:</span>{" "}
              <span className="font-normal"> 0/5</span>
            </Badge>
            <Badge variant="secondary">
              <span className="font-semibold mr-2">Stage cost:</span>{" "}
              <span className="font-normal"> 0.0€</span>
            </Badge>
            <Badge variant="secondary">
              <span className="font-semibold mr-2">Candidate Cost:</span>{" "}
              <span className="font-normal"> 0.0€</span>
            </Badge>
            <Badge variant="secondary">
              <span className="font-semibold mr-2">Dataset Cost:</span>{" "}
              <span className="font-normal"> 0.0€</span>
            </Badge>
          </>
        )}
      </div>
      <div className="w-full flex-grow flex justify-center">
        {selectedCandidate && ActiveComponent && (
          <div className="w-full">
            <ActiveComponent candidateId={selectedCandidate} />
          </div>
        )}
      </div>
    </div>
  );
}
