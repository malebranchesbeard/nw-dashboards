"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CompanyEntities from "./components/CompanyEntities";
import ShowProfile from "./components/ShowProfile";

export default function LandscapePage() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleBackgroundClick = (e) => {
    if (
      e.target === e.currentTarget ||
      e.target.classList.contains("company-entities-wrapper")
    ) {
      setSelectedCandidate(null);
    }
  };

  return (
    <div
      className="container min-h-screen bg-white p-4 flex flex-col"
      onClick={handleBackgroundClick}
    >
      <div className="flex justify-between items-center pl-1 mb-4 shadow-md shadow-white">
        <Button asChild className="bg-[#1E2A5C] h-8" variant="default">
          <Link href="/">Home</Link>
        </Button>
      </div>
      <div className="flex-grow flex">
        <div
          className="w-[70%] overflow-hidden pr-4 company-entities-wrapper"
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
