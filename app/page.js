import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "NW Dashboards",
  description: "Workspace for dashboards, tests and tools in development.",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="flex justify-center">
          <CardTitle className="text-20xl font-bold text-gray-800">
            NW Dashboards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Button asChild variant="default" className="w-full">
              <Link href="/career-chart">Career Progression Chart</Link>
            </Button>
            <Button asChild variant="default" className="w-full">
              <Link href="/scorecards">Head of Global Quality Scorecard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
