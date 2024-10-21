"use client";

import { useState } from "react";
import Scorecard from "./components/Scorecard";
import ReverseWeights from "./components/ReverseWeights";
import CandidateScores from "./components/CandidateScores";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ScorecardsPage() {
  const [activeComponent, setActiveComponent] = useState("reverseWeights");
  const [selectedDataset, setSelectedDataset] = useState("");

  const showBadges = activeComponent !== "scorecard";

  return (
    <div className="container min-h-screen bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <Button asChild variant="default">
          <Link href="/">Home</Link>
        </Button>
      </div>
      <div className="flex justify-center space-x-4 mb-4">
        <Button
          className="rounded-lg shadow-lg"
          onClick={() => setActiveComponent("scorecard")}
          variant={activeComponent === "scorecard" ? "default" : "outline"}
        >
          Scorecard
        </Button>
        <Button
          className="rounded-lg shadow-lg"
          onClick={() => setActiveComponent("reverseWeights")}
          variant={activeComponent === "reverseWeights" ? "default" : "outline"}
        >
          Reverse Weights
        </Button>
        <Button
          className="rounded-lg shadow-lg"
          onClick={() => setActiveComponent("candidateScores")}
          variant={
            activeComponent === "candidateScores" ? "default" : "outline"
          }
        >
          Candidate Scores
        </Button>
      </div>
      {showBadges && (
        <div className="flex justify-center items-center space-x-4 mb-4">
          <Select value={selectedDataset} onValueChange={setSelectedDataset}>
            <SelectTrigger className="w-[180px] shadow-md">
              <SelectValue placeholder="Select dataset" />
            </SelectTrigger>
            <SelectContent>
              {/* Add dataset options here when available */}
            </SelectContent>
          </Select>
          <Badge variant="secondary">
            <span className="font-semibold mr-2">Model used:</span>{" "}
            <span className="font-normal"> GPT-4o</span>
          </Badge>
          <Badge variant="secondary">
            <span className="font-semibold mr-2">Evaluation:</span>{" "}
            <span className="font-normal"> 0/5</span>
          </Badge>
          <Badge variant="secondary">
            <span className="font-semibold mr-2">Candidate Cost:</span>{" "}
            <span className="font-normal"> 0.0€</span>
          </Badge>
          <Badge variant="secondary">
            <span className="font-semibold mr-2">Dataset Cost:</span>{" "}
            <span className="font-normal"> 0.0€</span>
          </Badge>
        </div>
      )}
      {activeComponent === "scorecard" && <Scorecard />}
      {activeComponent === "reverseWeights" && <ReverseWeights />}
      {activeComponent === "candidateScores" && <CandidateScores />}
    </div>
  );
}
