"use client";

import Scorecard from "@/components/Scorecard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ScorecardsPage() {
  return (
    <div className="container min-h-screen bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Scorecard</h1>
        <Button asChild variant="default">
          <Link href="/">Home</Link>
        </Button>
      </div>
      <Scorecard />
    </div>
  );
}
