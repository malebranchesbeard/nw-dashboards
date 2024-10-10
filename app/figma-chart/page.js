import FigmaChart from "./components/FigmaChart";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Process Maps - NW Dashboards",
  description: "Seniority Process Map",
};

export default function FigmaChartPage() {
  return (
    <main className="flex flex-col min-h-screen h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">Seniority Process Map</h1>
        <Button asChild variant="default">
          <Link href="/">Home</Link>
        </Button>
      </div>
      <div className="flex-grow flex flex-col h-full">
        <FigmaChart />
      </div>
    </main>
  );
}
