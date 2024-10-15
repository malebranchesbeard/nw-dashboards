"use client";

import React, { useState, useEffect } from "react";
import Timeline from "./components/timeline";
import CandidateTimelines from "./components/candidateTimelines";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import candidatePositions from "../data/candidates/positions/all_pos.json";

export default function RolesDiagramPage() {
  const [showCandidateTimelines, setShowCandidateTimelines] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    // Load candidate IDs dynamically from all_pos.json
    const candidateIds = Object.keys(candidatePositions);
    setCandidates(candidateIds);

    // Set the first candidate as default if available
    if (candidateIds.length > 0) {
      setSelectedCandidate(candidateIds[0]);
    }
  }, []);

  return (
    <div className="w-screen h-screen max-w-full bg-white p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Roles Diagram</h2>
        <Button asChild variant="default">
          <Link href="/">Home</Link>
        </Button>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          checked={showCandidateTimelines}
          onCheckedChange={setShowCandidateTimelines}
        />
        <span>
          {showCandidateTimelines ? "Candidate Timelines" : "Timeline"}
        </span>
      </div>
      {showCandidateTimelines ? (
        <div className="w-full flex-grow flex flex-col">
          <div className="flex space-x-4 mb-4">
            <Select
              value={selectedCandidate}
              onValueChange={setSelectedCandidate}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select candidate" />
              </SelectTrigger>
              <SelectContent>
                {candidates.map((candidate) => (
                  <SelectItem key={candidate} value={candidate}>
                    {candidate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedCandidate && (
            <div className="w-full flex-grow overflow-hidden">
              <CandidateTimelines candidateId={selectedCandidate} />
            </div>
          )}
        </div>
      ) : (
        <Timeline />
      )}
    </div>
  );
}
