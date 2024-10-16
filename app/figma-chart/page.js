import FigmaChart from "./components/FigmaChart";
import Notes from "./components/Notes";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Process Maps - NW Dashboards",
  description: "Seniority Process Map",
};

export default function FigmaChartPage() {
  return (
    <main className="flex flex-col h-screen bg-gray-50">
      {/* Header Section */}
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-xl font-bold">
          Seniority Process Map
          <span className="text-sm text-orange-800 font-semibold">
            {" "}
            Red borders indicate sections currently being worked on
          </span>
        </h1>
        <Button asChild variant="default">
          <Link href="/">Home</Link>
        </Button>
      </header>

      {/* Content Section */}
      <div className="flex flex-row flex-grow p-1.5">
        {/* FigmaChart occupies 75% of the width */}
        <div className="w-3/4 h-full pr-1.5">
          <FigmaChart />
        </div>

        {/* Notes occupies 25% of the width with scroll and new styling */}
        <div className="w-1/4 h-full">
          <div className="h-full rounded-lg shadow-md bg-white overflow-hidden">
            <Notes />
          </div>
        </div>
      </div>
    </main>
  );
}
