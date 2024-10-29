"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CandidateCards from "./components/CandidateCards";
import ShowProfile from "../landscape/components/ShowProfile";
import LLMText from "./components/LLMtext";
import { UserRoundSearch, Tag } from "lucide-react";
import allCandidatesData from "./data/all_candidates_TRUTH.json";

const PRIORITY_COLORS = {
  P1: "#1E2A5C",
  P2: "#1e2a5cd8",
  P3: "#1e2a5cbc",
  All: "#1e2a5c94",
};

export default function TailoredTextPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [copiedCandidates, setCopiedCandidates] = useState(new Set());

  // Add this effect to set initial candidate
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== "undefined") {
      const initialCandidate = Object.entries(allCandidatesData).find(
        ([_, data]) => data.success && data.person
      );

      if (initialCandidate) {
        setSelectedCandidate({
          person: initialCandidate[1].person,
          priority: "Unknown", // Or determine from groupsData if needed
        });
      }
    }
  }, []);

  // Add this effect to fetch copied candidates on load
  useEffect(() => {
    const fetchCopiedCandidates = async () => {
      try {
        const response = await fetch("/api/copied");
        const data = await response.json();
        setCopiedCandidates(new Set(data));
      } catch (error) {
        console.error("Error fetching copied candidates:", error);
      }
    };
    fetchCopiedCandidates();
  }, []);

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate);
  };

  // Add this handler to pass to LLMText
  const handleCopied = async (publicIdentifier) => {
    setCopiedCandidates((prev) => new Set([...prev, publicIdentifier]));
  };

  const handleCopiedChange = async (publicIdentifier, isCopied) => {
    if (isCopied) {
      setCopiedCandidates((prev) => new Set([...prev, publicIdentifier]));
    } else {
      setCopiedCandidates((prev) => {
        const newSet = new Set(prev);
        newSet.delete(publicIdentifier);
        return newSet;
      });
    }
  };

  return (
    <div className="container h-screen bg-white p-4 flex flex-col overflow-hidden">
      <div className="flex justify-between items-center pl-1 mb-4 shadow-md shadow-white">
        <Button asChild className="bg-[#1E2A5C] h-8" variant="default">
          <Link href="/">Home</Link>
        </Button>
      </div>
      <div className="flex-grow flex overflow-hidden">
        {/* First Column */}
        <div className="w-1/3 pr-2 flex flex-col overflow-hidden">
          <div className="sticky top-0 z-10 bg-white">
            <div className="bg-transparent pb-4 relative">
              <div className="flex justify-between items-center mb-1 px-1">
                <UserRoundSearch className="w-6 h-6 text-[#1E2A5C]" />
                <Tag className="w-6 h-6 text-[#1E2A5C]" />
              </div>
              <div className="flex justify-between items-center mb-2">
                <Input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full mr-2 shadow-md shadow-gray-300 pl-1"
                />
                <div className="flex gap-0.5">
                  {["P1", "P2", "P3", "All"].map((priority) => (
                    <div
                      key={priority}
                      onClick={() => setPriorityFilter(priority)}
                      className="cursor-pointer rounded-md px-4 py-2 text-sm text-white transition-colors hover:bg-[#566CC8]"
                      style={{
                        backgroundColor:
                          priorityFilter === priority ? "#566CC8" : "#1E2A5C",
                      }}
                    >
                      {priority}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto">
            <CandidateCards
              searchTerm={searchTerm}
              priorityFilter={priorityFilter}
              onCandidateSelect={handleCandidateSelect}
              copiedCandidates={copiedCandidates}
              onCopiedChange={handleCopiedChange}
              selectedCandidate={selectedCandidate}
            />
          </div>
        </div>

        {/* Second Column */}
        <div className="w-1/3 px-2 overflow-hidden">
          <ShowProfile selectedCandidate={selectedCandidate} />
        </div>

        {/* Third Column */}
        <div className="w-1/3 pl-2 overflow-hidden">
          <LLMText
            selectedCandidate={selectedCandidate}
            onCopied={handleCopied}
          />
        </div>
      </div>
    </div>
  );
}
