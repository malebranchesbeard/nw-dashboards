"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CompanyEntities from "./components/CompanyEntities";
import ShowProfile from "./components/ShowProfile";

const colorGradient = [
  "#FEF0D9",
  "#FDCC8A",
  "#FC8D59",
  "#E34A33",
  "#B30000",
  "#7A0177",
  "#49006A",
];

export default function LandscapePage() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate);
  };

  return (
    <div className="container min-h-screen bg-white p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <Button asChild variant="default">
          <Link href="/">Home</Link>
        </Button>
      </div>
      <div className="flex-grow flex">
        <div
          className="w-[70%] overflow-y-auto pr-4"
          style={{ maxHeight: "calc(100vh - 40px)" }}
        >
          <CompanyEntities
            onCandidateSelect={handleCandidateSelect}
            selectedCandidate={selectedCandidate}
          />
        </div>
        <div
          className="w-[30%] overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 40px)" }}
        >
          <ShowProfile selectedCandidate={selectedCandidate} />
        </div>
      </div>
    </div>
  );
}
