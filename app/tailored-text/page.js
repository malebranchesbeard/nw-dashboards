"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CandidateCards from "./components/CandidateCards";
import ShowProfile from "../landscape/components/ShowProfile";
import LLMText from "./components/LLMtext";
import { UserRoundSearch, Tag } from "lucide-react";

export default function TailoredTextPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate);
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
                    <Button
                      key={priority}
                      onClick={() => setPriorityFilter(priority)}
                      className={`flex items-center text-white gap-2 ${
                        priorityFilter === priority
                          ? "bg-[#566CC8]"
                          : "bg-[#1E2A5C]"
                      } hover:text-white hover:bg-[#566CC8]`}
                      variant="outline"
                    >
                      {priority}
                    </Button>
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
            />
          </div>
        </div>

        {/* Second Column */}
        <div className="w-1/3 px-2 overflow-hidden">
          <ShowProfile selectedCandidate={selectedCandidate} />
        </div>

        {/* Third Column */}
        <div className="w-1/3 pl-2 overflow-hidden">
          <LLMText selectedCandidate={selectedCandidate} />
        </div>
      </div>
    </div>
  );
}
