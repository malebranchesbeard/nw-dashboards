"use client";

import React from "react";
import RolesDiagram from "../../components/RolesDiagram";
import Timeline from "./components/timeline";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RolesDiagramPage() {
  return (
    <div className="container min-h-screen bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Roles Diagram</h2>
        <Button asChild variant="default">
          <Link href="/">Home</Link>
        </Button>
      </div>
      <Timeline />
      {/* <RolesDiagram /> */}
    </div>
  );
}
