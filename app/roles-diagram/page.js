"use client";

import React, { useState } from "react";
import Timeline from "./components/timeline";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import RolesDiagram from "../../components/RolesDiagram";

export default function RolesDiagramPage() {
  const [showCandidateTimelines, setShowCandidateTimelines] = useState(false);

  return (
    <div className="w-screen h-screen max-w-full bg-white p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quality Career Progression</h2>
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
          {showCandidateTimelines
            ? "Role Seniority Diagram"
            : "Transition Timeline"}
        </span>
      </div>
      {showCandidateTimelines ? <RolesDiagram /> : <Timeline />}
    </div>
  );
}
