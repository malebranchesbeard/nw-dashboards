"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CompanyEntities from "./components/CompanyEntities";
import ShowProfile from "./components/ShowProfile";

// Add this constant for the gradient colors
const gradientColors =
  "rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%";

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
      <div className="flex justify-between items-center mb-4 shadow-md shadow-white">
        <Button asChild className="bg-[#2b3a80] h-8" variant="default">
          <Link href="/">Home</Link>
        </Button>
      </div>
      <div className="flex-grow flex">
        <div
          className="w-[70%] overflow-hidden pr-4 company-entities-wrapper relative"
          style={{ maxHeight: "calc(100vh - 40px)" }}
        >
          {/* Add this div for the gradient overlay */}
          <div
            className="absolute top-0 left-0 right-0 h-4 pointer-events-none z-10"
            style={{
              background: `linear-gradient(to bottom, ${gradientColors})`,
            }}
          ></div>
          {/* Wrap CompanyEntities in a scrollable container */}
          <div className="overflow-y-auto h-full pt-0">
            <CompanyEntities
              onCandidateSelect={handleCandidateSelect}
              selectedCandidate={selectedCandidate}
            />
          </div>
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
