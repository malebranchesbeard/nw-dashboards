"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RoleEvaluator from "./components/RoleEvaluator";

export default function RoleEvaluatorPage() {
  return (
    <div className="container min-h-screen bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Role Evaluator</h2>
        <Button asChild variant="default">
          <Link href="/">Home</Link>
        </Button>
      </div>
      <RoleEvaluator />
    </div>
  );
}
